import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { ShopFilters } from "@/components/product/shop-filters";
import { BusinessStrip } from "@/components/sections/business-strip";
import { PageHeader } from "@/components/sections/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonStyles } from "@/components/ui/button";
import { getCatalog } from "@/lib/data/products";
import { applyShopQuery, hasActiveFilters, parseShopQuery } from "@/lib/shop-query";

export const metadata: Metadata = {
  title: "Shop tea",
  description:
    "Shop Samrin Strong and Samrin Premium BOPF — pure Ceylon black tea from Ruhuna, in 100 g loose leaf and 25 tea-bag packs.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const query = parseShopQuery(await searchParams);
  const results = applyShopQuery(await getCatalog(), query);

  return (
    <>
      <PageHeader
        eyebrow="The shop"
        title={
          <>
            Everything Samrin makes, <em className="accent">in one place.</em>
          </>
        }
        intro="Two ranges of unblended Ruhuna tea — Strong for a darker, bolder cup, Premium BOPF for a bright, full-bodied one — in loose leaf and tea bags."
      />

      <div className="container-page grid items-start gap-10 lg:grid-cols-[15.5rem_1fr]">
        <aside className="border-line bg-surface-2 rounded-2xl border p-5 lg:sticky lg:top-28">
          <ShopFilters query={query} />
        </aside>

        <div>
          <div className="border-line flex items-center justify-between border-b pb-4">
            <p aria-live="polite" className="text-muted text-sm">
              {results.length} {results.length === 1 ? "product" : "products"}
            </p>
            {hasActiveFilters(query) && (
              <Link
                href="/shop"
                className="text-heading text-sm font-medium underline underline-offset-4"
              >
                Clear filters
              </Link>
            )}
          </div>

          <h2 className="sr-only">Products</h2>
          {results.length > 0 ? (
            <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 xl:grid-cols-3">
              {results.map((product, i) => (
                <li key={product.id} className="flex">
                  <div className="flex w-full">
                    <ProductCard product={product} priority={i < 4} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <EmptyState
                title="No tea matches those filters"
                action={
                  <Link href="/shop" className={buttonStyles({ variant: "secondary" })}>
                    Clear filters
                  </Link>
                }
              >
                Try removing one of them to see the full range.
              </EmptyState>
            </div>
          )}
        </div>
      </div>

      <BusinessStrip />
    </>
  );
}
