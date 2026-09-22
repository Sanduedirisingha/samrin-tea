import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Trilingual } from "@/components/ui/trilingual";
import { getSlot } from "@/content/site-images";
import { siteConfig } from "@/lib/site-config";

/**
 * Hero: giant serif headline, copper orb with a looping video inside it, over a full-bleed leaf
 * photo. Every colour comes from the theme tokens, so it is a light hero in light mode and a dark
 * hero in dark mode.
 */
export function Hero() {
  const photo = getSlot("heroMain");
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
          <div className="ring-gold/60 absolute inset-[18%] overflow-hidden rounded-full ring-1">
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="/videos/hero-tea-poster.jpg"
              className="size-full object-cover"
            >
              <source src="/videos/hero-tea.mp4" type="video/mp4" />
            </video>
            {/* Sphere shading and glow above the video, so it reads as part of the orb */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.28) 0%, transparent 42%), radial-gradient(circle at 72% 78%, rgb(0 0 0 / 0.4) 0%, transparent 62%)",
                boxShadow:
                  "inset 0 0 0 1px rgb(217 139 52 / 0.35), inset 0 -30px 60px -30px rgb(0 0 0 / 0.45)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
