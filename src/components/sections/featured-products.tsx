import { BusinessCard } from "@/components/sections/business-card";
import { ProductCard } from "@/components/product/product-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { isPurchasable, type CatalogProduct } from "@/lib/product-utils";

export function FeaturedProducts({ products }: { products: CatalogProduct[] }) {
  const featured = products.filter(isPurchasable).slice(0, 4);
  return (
    <section
      id="shop"
      aria-labelledby="featured-heading"
      className="bg-ivory scroll-mt-16 py-24 sm:py-28"
    >
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="05 — The shop"
            title={
              <span id="featured-heading">
                Pure Ceylon black tea, <em className="accent">from one factory.</em>
              </span>
            }
          />
          <ButtonLink href="/shop" variant="secondary">
            View all
          </ButtonLink>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 lg:grid-cols-4">
          {featured.map((p) => (
            <li key={p.id} className="flex">
              <div className="reveal flex w-full">
                <ProductCard product={p} />
              </div>
            </li>
          ))}
        </ul>
        <BusinessCard />
      </div>
    </section>
  );
}
