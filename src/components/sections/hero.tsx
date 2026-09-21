import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { GoldCurves } from "@/components/ui/gold-curves";
import { PlaqueBadge } from "@/components/ui/plaque-badge";
import { Trilingual } from "@/components/ui/trilingual";
import type { CatalogProduct } from "@/lib/product-utils";

export function Hero({ strong, bopf }: { strong?: CatalogProduct; bopf?: CatalogProduct }) {
  const packs = [strong, bopf].filter((p): p is CatalogProduct => Boolean(p?.images[0]));
  return (
    <section className="on-dark bg-forest text-cream relative isolate overflow-hidden">
      <GoldCurves />
      <div className="container-page relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <PlaqueBadge>Factory Fresh</PlaqueBadge>
          <h1 className="text-cream mt-8 text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl">
            Factory-fresh Ruhuna tea,{" "}
            <em className="accent text-champagne">straight from the source.</em>
          </h1>
          <p className="text-champagne mt-6 text-sm font-semibold tracking-[0.18em] uppercase">
            Single region · Unblended · Directly from the factory
          </p>
          <Trilingual className="mt-4 text-base" />
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/shop" variant="on-dark" size="lg">
              Shop tea
            </ButtonLink>
            <ButtonLink href="/contact?type=business" variant="secondary-on-dark" size="lg">
              Business supply
            </ButtonLink>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-4 sm:gap-6">
          {packs.map((p, i) => (
            <li key={p.id} className={i === 1 ? "mt-8 sm:mt-12" : ""}>
              <div className="bg-ivory ring-gold/60 relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_24px_48px_-20px_rgb(0_0_0/0.6)] ring-1">
                <Image
                  src={p.images[0].src}
                  alt={p.images[0].alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 22rem, 44vw"
                  className="object-contain p-2"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
