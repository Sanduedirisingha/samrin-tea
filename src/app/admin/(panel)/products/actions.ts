"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { products, type ProductImage } from "@/db/schema";
import { productOrderCount } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/session";
import { removeUploadedImage } from "@/lib/admin/storage";
import { PRODUCTS_TAG } from "@/lib/data/products";
import { productSchema, TEXT_FIELDS } from "@/lib/validators/product-admin";

export type ProductFormState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
};

/** Make storefront pages and the cached catalogue pick up the change immediately. */
function refreshStorefront() {
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  revalidatePath("/", "layout");
}

const isUniqueViolation = (e: unknown) => {
  const code = (e as { code?: string })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
  return code === "23505";
};

const parseJson = (raw: FormDataEntryValue | null): unknown => {
  try {
    return JSON.parse(String(raw ?? "[]"));
  } catch {
    return null;
  }
};

export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();
  const idRaw = formData.get("id");
  const id = typeof idRaw === "string" && idRaw !== "" ? idRaw : undefined;
  if (id && !z.uuid().safeParse(id).success)
    return { status: "error", message: "Invalid product." };

  const values: Record<string, string> = {};
  for (const f of TEXT_FIELDS) values[f] = String(formData.get(f) ?? "");
  const isBusinessOnly = formData.get("isBusinessOnly") === "on";
  const isActive = formData.get("isActive") === "on";
  const inStock = formData.get("inStock") === "on";

  const details = parseJson(formData.get("details"));
  const images = parseJson(formData.get("images"));
  if (details === null || images === null) {
    return {
      status: "error",
      message: "The form data was corrupted. Please reload and try again.",
      values,
    };
  }

  // The new-product form pre-fills labels (Pack, Tea, …); rows left without a value are ignored.
  const detailRows = Array.isArray(details)
    ? details.filter((r) => String((r as { value?: unknown })?.value ?? "").trim() !== "")
    : details;
  const parsed = productSchema.safeParse({ ...values, details: detailRows, images });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0]);
      fieldErrors[key] ??= issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors, values };
  }
  const d = parsed.data;
  if (!isBusinessOnly && d.priceRs === undefined) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: { priceRs: "Add a price, or tick “Business quote only”." },
      values,
    };
  }

  const row = {
    slug: d.slug,
    name: d.name,
    range: d.range,
    format: d.format,
    packLabel: d.packLabel,
    netWeightG: d.netWeightG,
    unitsPerPack: d.unitsPerPack ?? null,
    tagline: d.tagline,
    shortDescription: d.shortDescription,
    description: d.description,
    chooseThisIf: d.chooseThisIf,
    details: d.details,
    // Every image needs alt text: default to the product name.
    images: d.images.map((i): ProductImage => ({ ...i, alt: i.alt || d.name })),
    priceLkr:
      isBusinessOnly && d.priceRs === undefined ? null : Math.round(Number(d.priceRs) * 100),
    isBusinessOnly,
    isActive,
    inStock,
    sortOrder: d.sortOrder,
  };

  const db = getDb();
  let previousImages: ProductImage[] = [];
  try {
    if (id) {
      const [old] = await db
        .select({ images: products.images })
        .from(products)
        .where(eq(products.id, id))
        .limit(1);
      if (!old) return { status: "error", message: "That product no longer exists.", values };
      previousImages = old.images;
      await db.update(products).set(row).where(eq(products.id, id));
    } else {
      await db.insert(products).values(row);
    }
  } catch (error) {
    if (isUniqueViolation(error)) {
      return {
        status: "error",
        message: "Please fix the highlighted fields.",
        fieldErrors: { slug: "Another product already uses this slug." },
        values,
      };
    }
    console.error("saveProduct failed", error);
    return { status: "error", message: "Couldn't save the product. Please try again.", values };
  }

  // Delete uploaded files that were removed from this product.
  const kept = new Set(row.images.map((i) => i.src));
  await Promise.all(
    previousImages.filter((i) => !kept.has(i.src)).map((i) => removeUploadedImage(i.src)),
  );

  refreshStorefront();
  redirect("/admin/products?saved=1");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!z.uuid().safeParse(id).success) redirect("/admin/products");

  // Products that appear on orders must be kept for the order history: hide them instead.
  if ((await productOrderCount(id)) > 0) redirect("/admin/products?error=in-use");

  const db = getDb();
  const [old] = await db
    .select({ images: products.images })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  await db.delete(products).where(eq(products.id, id));
  await Promise.all((old?.images ?? []).map((i) => removeUploadedImage(i.src)));
  refreshStorefront();
  redirect("/admin/products?deleted=1");
}

const flagSchema = z.object({
  id: z.uuid(),
  flag: z.enum(["isActive", "inStock"]),
  value: z.enum(["true", "false"]),
});

/** Quick toggles on the products list: visible on the store / in stock. */
export async function setProductFlag(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = flagSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { id, flag, value } = parsed.data;
  await getDb()
    .update(products)
    .set({ [flag]: value === "true" })
    .where(eq(products.id, id));
  refreshStorefront();
  revalidatePath("/admin/products");
}
