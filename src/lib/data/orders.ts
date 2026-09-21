import "server-only";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { orderItems, orders } from "@/db/schema";

/**
 * Deliberately excludes contact and address details: order numbers are sequential, so the
 * public confirmation page must not expose personal data.
 */
export async function getOrderConfirmation(orderNumber: string) {
  const db = getDb();
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      paymentProvider: orders.paymentProvider,
      subtotalLkr: orders.subtotalLkr,
      deliveryFeeLkr: orders.deliveryFeeLkr,
      totalLkr: orders.totalLkr,
    })
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  if (!order) return null;

  const items = await db
    .select({
      name: orderItems.nameSnapshot,
      unitPriceLkr: orderItems.unitPriceLkr,
      qty: orderItems.qty,
      lineTotalLkr: orderItems.lineTotalLkr,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.nameSnapshot));

  return { ...order, items };
}
