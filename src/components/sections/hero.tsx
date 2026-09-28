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
          <p
            className="fade-up text-muted flex items-center gap-3 text-xs font-medium tracking-[0.22em] uppercase max-md:justify-center"
            style={{ animationDelay: "0.2s" }}
          >
            <span aria-hidden className="bg-gold h-px w-8" />
            Pure Ceylon black tea · Ruhuna
          </p>
          <h1 className="text-heading mt-6 text-[3.1rem] leading-[0.98] sm:text-7xl lg:text-[6.5rem]">
            A cup with <em className="accent text-gold-ink block">backbone.</em>
          </h1>
          <p
            className="fade-up text-ink/85 mt-8 max-w-md text-lg leading-relaxed"
            style={{ animationDelay: "0.55s" }}
          >
            Factory-fresh Ruhuna tea, straight from the source. Single region, unblended, packed
            directly from the factory where it is made.
          </p>
          <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.9s" }}>
            <ButtonLink href="/shop" variant="on-dark" size="lg">
              Shop tea
            </ButtonLink>
            <ButtonLink href="/contact?type=business" variant="secondary-on-dark" size="lg">
              Business supply
            </ButtonLink>
          </div>
          <div className="fade-up mt-10 space-y-2" style={{ animationDelay: "1.25s" }}>
            <Trilingual className="text-base" />
            <p className="text-muted text-xs tracking-[0.14em] uppercase">{siteConfig.tagline}</p>
          </div>
        </div>

        <div className="pop-in relative mx-auto aspect-square w-full max-w-[40rem]">
          {/* Soft copper halo that slowly breathes behind the glass */}
          <div
            aria-hidden
            className="breathe bg-gold/30 absolute inset-[8%] rounded-full blur-3xl"
          />
          <div className="drift absolute inset-0">
            {/* Frosted-glass bezel: the leaf photo shows through, blurred */}
            <div aria-hidden className="glass absolute inset-0 rounded-full" />
            {/* The video: one clean circle inside the bezel */}
            <div className="ring-gold/50 absolute inset-[6.5%] overflow-hidden rounded-full shadow-[0_18px_50px_-18px_rgb(0_0_0/0.6)] ring-1">
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
              {/* Glass sheen: a soft highlight top-left and a light vignette at the edge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 80% at 28% 8%, rgb(255 255 255 / 0.22) 0%, transparent 55%), radial-gradient(circle at 50% 50%, transparent 64%, rgb(0 0 0 / 0.26) 100%)",
                  boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.22)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
