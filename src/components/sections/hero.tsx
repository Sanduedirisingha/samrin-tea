import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Trilingual } from "@/components/ui/trilingual";
import { getSlot } from "@/content/site-images";
import type { CatalogProduct } from "@/lib/product-utils";
import { siteConfig } from "@/lib/site-config";

/**
 * Hero: giant serif headline, copper orb and packs over a full-bleed leaf photo. Every colour
 * comes from the theme tokens, so it is a light hero in light mode and a dark hero in dark mode.
 */
export function Hero({ strong, bopf }: { strong?: CatalogProduct; bopf?: CatalogProduct }) {
  const photo = getSlot("heroMain");
  const packs = [strong, bopf].filter((p): p is CatalogProduct => Boolean(p?.images[0]));
  return (
    <section
      id="hero"
      className="from-surface-2 via-surface to-surface text-ink relative isolate overflow-hidden bg-gradient-to-b"
    >
      {photo && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src={photo.src}
            alt=""
            fill
            priority
            quality={70}
            sizes="100vw"
            className="[mask-image:linear-gradient(to_right,transparent_10%,black_60%)] object-cover object-[70%_50%] max-lg:[mask-image:none] dark:opacity-95"
          />
          {/* Dark mode: tint the photo into the brand green. Light mode: keep it bright. */}
          <div className="bg-forest/20 absolute inset-0 hidden mix-blend-multiply dark:block" />
          {/* Fade the headline side into the page colour, whichever theme is active */}
          <div className="from-surface via-surface/60 max-lg:from-surface/90 max-lg:via-surface/75 max-lg:to-surface/50 dark:via-surface/55 absolute inset-0 bg-gradient-to-r to-transparent" />
          <div className="from-surface-alt absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t to-transparent" />
        </div>
      )}
      <div className="container-page grid min-h-[calc(100svh-5rem)] items-center gap-14 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <p className="text-muted flex items-center gap-3 text-xs font-medium tracking-[0.22em] uppercase max-md:justify-center">
            <span aria-hidden className="bg-gold h-px w-8" />
            Pure Ceylon black tea · Ruhuna
          </p>
          <h1 className="text-heading mt-6 text-[3.1rem] leading-[0.98] sm:text-7xl lg:text-[6.5rem]">
            A cup with <em className="accent text-gold-ink block">backbone.</em>
          </h1>
          <p className="text-ink/85 mt-8 max-w-md text-lg leading-relaxed">
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
            <p className="text-muted text-xs tracking-[0.14em] uppercase">{siteConfig.tagline}</p>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
          <div aria-hidden className="border-line absolute inset-[6%] rounded-full border" />
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
                  className="drift bg-surface-2 ring-gold/60 relative aspect-[4/5] overflow-hidden rounded-2xl shadow-[0_30px_60px_-20px_rgb(0_0_0/0.55)] ring-1"
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
