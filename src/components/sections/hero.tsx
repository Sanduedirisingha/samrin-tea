import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Trilingual } from "@/components/ui/trilingual";
import type { CatalogProduct } from "@/lib/product-utils";
import { siteConfig } from "@/lib/site-config";

/** Hero from the homepage design: giant serif headline, copper orb, packs drifting in front of it. */
export function Hero({ strong, bopf }: { strong?: CatalogProduct; bopf?: CatalogProduct }) {
  const packs = [strong, bopf].filter((p): p is CatalogProduct => Boolean(p?.images[0]));
  return (
    <section
      id="hero"
      className="on-dark text-paper relative isolate overflow-hidden bg-gradient-to-b from-[#1a2b22] via-[#14271d] to-[#0e1a14]"
    >
      <div className="container-page grid min-h-[calc(100svh-4rem)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <p className="text-sage flex items-center gap-3 text-xs font-medium tracking-[0.22em] uppercase">
            <span aria-hidden className="bg-gold h-px w-8" />
            Pure Ceylon black tea · Ruhuna
          </p>
          <h1 className="text-paper mt-6 text-[3.1rem] leading-[0.98] sm:text-7xl lg:text-[6.5rem]">
            A cup with <em className="accent text-champagne block">backbone.</em>
          </h1>
          <p className="text-paper/85 mt-8 max-w-md text-lg leading-relaxed">
            Factory-fresh Ruhuna tea, straight from the source. Single region, unblended, packed
            directly from the factory where it is made.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/shop" variant="on-dark" size="lg">
              Shop tea
            </ButtonLink>
            <ButtonLink href="/contact?type=business" variant="secondary-on-dark" size="lg">
              Business supply
            </ButtonLink>
          </div>
          <div className="mt-10 space-y-2">
            <Trilingual className="text-base" />
            <p className="text-sage text-xs tracking-[0.14em] uppercase">{siteConfig.tagline}</p>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          <div aria-hidden className="border-paper/10 absolute inset-[6%] rounded-full border" />
          <div aria-hidden className="orb drift absolute inset-[18%]" />
          <ul className="absolute inset-0">
            {packs.map((p, i) => (
              <li
                key={p.id}
                className={
                  i === 0
                    ? "absolute top-[22%] left-[2%] w-[46%]"
                    : "absolute top-[6%] right-[0%] w-[46%]"
                }
              >
                <div
                  className="drift bg-ivory ring-gold/60 relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ring-1"
                  style={{ animationDelay: `${i * -3}s` }}
                >
                  <Image
                    src={p.images[0].src}
                    alt={p.images[0].alt}
                    fill
                    priority
                    sizes="(min-width: 1024px) 16rem, 44vw"
                    className="object-contain p-2"
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
