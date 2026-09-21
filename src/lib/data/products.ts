import "server-only";
import { asc, eq, getTableColumns } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import type { CatalogProduct } from "@/lib/product-utils";

// Timestamps are left out so cached (JSON-serialised) rows keep their declared types.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { createdAt, updatedAt, ...catalogColumns } = getTableColumns(products);

/** Product data changes rarely; cache for a minute and allow tag-based revalidation. */
export const CATALOG_REVALIDATE_SECONDS = 60;
export const PRODUCTS_TAG = "products";

export const getCatalog = unstable_cache(
  async (): Promise<CatalogProduct[]> =>
    getDb()
      .select(catalogColumns)
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(asc(products.sortOrder), asc(products.name)),
  ["catalog:v1"],
  { revalidate: CATALOG_REVALIDATE_SECONDS, tags: [PRODUCTS_TAG] },
);

export async function getProductBySlug(slug: string): Promise<CatalogProduct | undefined> {
  const catalog = await getCatalog();
  return catalog.find((p) => p.slug === slug);
}
