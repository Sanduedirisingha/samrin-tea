"use server";

import { eq, inArray, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { getDeliveryFeeMinor } from "@/lib/env";
import { getPaymentProvider } from "@/lib/payments";
import { isPurchasable } from "@/lib/product-utils";
import { shopConfig } from "@/lib/site-config";
import { cartItemsSchema, checkoutSchema, type CheckoutFieldName } from "@/lib/validators/checkout";
import type { CheckoutState } from "./state";

const fieldNames = [
  "fullName",
  "email",
  "phone",
  "addressLine1",
  "addressLine2",
  "city",
  "district",
  "postalCode",
  "notes",
] as const;

const successPath = (orderNumber: string) => `/checkout/success/${orderNumber}`;

const isUniqueViolation = (e: unknown): boolean => {
  const code = (e as { code?: string })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
  return code === "23505";
};

async function findOrderNumberByKey(key: string): Promise<string | undefined> {
  const [row] = await getDb()
    .select({ orderNumber: orders.orderNumber })
    .from(orders)
    .where(eq(orders.idempotencyKey, key))
    .limit(1);
  return row?.orderNumber;
}

/**
 * Places an order. Nothing the browser sends about prices is trusted: only product ids and
 * quantities are read; names, prices and totals come from the database.
 */
export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const values: Record<string, string> = {};
  for (const name of fieldNames) values[name] = String(formData.get(name) ?? "");

  const parsed = checkoutSchema.safeParse({
    ...values,
    idempotencyKey: String(formData.get("idempotencyKey") ?? ""),
  });

  let rawItems: unknown = [];
  try {
    rawItems = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    rawItems = [];
  }
  const items = cartItemsSchema.safeParse(rawItems);

  if (!parsed.success || !items.success) {
    const fieldErrors: CheckoutState["fieldErrors"] = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as CheckoutFieldName;
        fieldErrors[key] ??= issue.message;
      }
    }
    return {
      status: "error",
      message: !items.success
        ? "Your cart is empty or could not be read. Please review your cart and try again."
        : "Please check the highlighted fields.",
      fieldErrors,
      values,
    };
  }

  const input = parsed.data;

  // Merge duplicate lines and clamp to the configured maximum.
  const qtyById = new Map<string, number>();
  for (const { productId, qty } of items.data) {
    qtyById.set(productId, Math.min((qtyById.get(productId) ?? 0) + qty, shopConfig.maxQtyPerLine));
  }

  // Replay of an already-placed order (double click, retry): go straight to confirmation.
  const existing = await findOrderNumberByKey(input.idempotencyKey);
  if (existing) redirect(successPath(existing));

  const db = getDb();
  const rows = await db
    .select()
    .from(products)
    .where(inArray(products.id, [...qtyById.keys()]));

  const unavailable: string[] = [];
  const lines = [...qtyById].flatMap(([productId, qty]) => {
    const product = rows.find((r) => r.id === productId);
    if (!product || !isPurchasable(product) || product.priceLkr === null) {
      unavailable.push(product?.name ?? "An item in your cart");
      return [];
    }
    return [
      {
        productId: product.id,
        nameSnapshot: product.name,
        unitPriceLkr: product.priceLkr,
        qty,
        lineTotalLkr: product.priceLkr * qty,
      },
    ];
  });

  if (unavailable.length > 0) {
    return {
      status: "error",
      message: `${unavailable.join(", ")} can't be ordered online right now. Please update your cart and try again.`,
      values,
    };
  }

  const subtotalLkr = lines.reduce((sum, l) => sum + l.lineTotalLkr, 0);
  // No invented delivery fee: unset means "confirmed by our team" and nothing is charged here.
  const deliveryFeeLkr = getDeliveryFeeMinor() ?? 0;
  const totalLkr = subtotalLkr + deliveryFeeLkr;
  const provider = getPaymentProvider();

  let orderNumber: string;
  let orderId: string;
  try {
    ({ orderNumber, orderId } = await db.transaction(async (tx) => {
      const seq = await tx.execute(sql`select nextval('order_number_seq') as n`);
      const n = String((seq.rows[0] as { n: string | number }).n);
      const number = `SMR-${n.padStart(6, "0")}`;

      const [order] = await tx
        .insert(orders)
        .values({
          orderNumber: number,
          status: "pending",
          paymentStatus: "unpaid",
          paymentProvider: provider.id,
          customerName: input.fullName,
          customerEmail: input.email,
          customerPhone: input.phone,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2 || null,
          city: input.city,
          district: input.district,
          postalCode: input.postalCode,
          notes: input.notes || null,
          subtotalLkr,
          deliveryFeeLkr,
          totalLkr,
          idempotencyKey: input.idempotencyKey,
        })
        .returning({ id: orders.id });

      await tx.insert(orderItems).values(lines.map((l) => ({ ...l, orderId: order.id })));
      return { orderNumber: number, orderId: order.id };
    }));
  } catch (error) {
    if (isUniqueViolation(error)) {
      // A concurrent request with the same key won the race.
      const winner = await findOrderNumberByKey(input.idempotencyKey);
      if (winner) redirect(successPath(winner));
    }
    console.error("placeOrder failed", error);
    return {
      status: "error",
      message:
        "We couldn't place your order just now. Nothing has been charged — please try again.",
      values,
    };
  }

  // Payment hook: the manual provider returns "unpaid"; a gateway can redirect to pay.
  const payment = await provider.createPayment({
    id: orderId,
    orderNumber,
    totalLkr,
    customerEmail: input.email,
  });
  if (payment.reference || payment.status !== "unpaid") {
    await db
      .update(orders)
      .set({ paymentReference: payment.reference ?? null, paymentStatus: payment.status })
      .where(eq(orders.id, orderId));
  }

  redirect(payment.redirectUrl ?? successPath(orderNumber));
}
