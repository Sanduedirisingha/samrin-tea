"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BrewToggle } from "@/components/sections/brew-toggle";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getSlot, type SlotId } from "@/content/site-images";
import { cn } from "@/lib/cn";
import { PIN_QUERY, useMediaQuery } from "@/lib/use-media-query";

/** Wording follows the approved loose-leaf brewing artwork. Step 5 has no photo: the orb takes over. */
const steps: { title: string; body: string; slot?: SlotId; position?: string }[] = [
  {
    title: "Rinse the cup",
    body: "Rinse the cup with hot water and pour out the water.",
    slot: "brew1",
    position: "object-[50%_45%]",
  },
  {
    title: "Add the tea",
    body: "Add 2 g of tea (about 1 teaspoon per cup).",
    slot: "brew2",
    position: "object-[32%_50%]",
  },
  {
    title: "Add boiling water",
    body: "Add 200 ml of boiling water at 100°C.",
    slot: "brew3",
    position: "object-[45%_50%]",
  },
  {
    title: "Brew",
    body: "Brew for 3–5 minutes, or as preferred.",
    slot: "brew4",
    position: "object-[55%_55%]",
  },
  { title: "Filter and enjoy", body: "Filter, and enjoy." },
];

const NAV = 80;
const COLD = [0x24, 0x40, 0x2f] as const; // deep green
const WARM = [0xd9, 0x8b, 0x34] as const; // copper amber

const mix = (p: number) =>
  `rgb(${COLD.map((c, i) => Math.round(c + (WARM[i] - c) * p)).join(",")})`;

/**
 * "Water meets leaf" — a photo per step crossfades as you scroll (pinned on wide screens) while
 * the orb behind it warms from green to amber, then the approved brewing artwork.
 */
export function BrewSteps() {
  const pinned = useMediaQuery(PIN_QUERY);
  const [active, setActive] = useState(0);
  const section = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;
    const sec = section.current;
    const o = orb.current;
    if (!sec || !o) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const total = Math.max(1, sec.offsetHeight - (window.innerHeight - NAV));
      const p = Math.min(1, Math.max(0, (NAV - sec.getBoundingClientRect().top) / total));
      o.style.setProperty("--orb", mix(Math.min(1, p * 1.25)));
      setActive(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    const measure = () => {
      sec.style.height = `${steps.length * 0.6 * window.innerHeight + (window.innerHeight - NAV)}px`;
      update();
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
      sec.style.height = "";
    };
  }, [pinned]);

  return (
    <section
      id="brew"
      aria-labelledby="brew-heading"
      className="text-ink bg-surface-alt scroll-mt-20"
    >
      <div ref={section}>
        <div
          className={cn(
            pinned
              ? "sticky top-20 flex h-[calc(100dvh-5rem)] items-center overflow-hidden"
              : "py-24",
          )}
        >
          <div className="container-page grid items-center gap-12 lg:grid-cols-2">
            {pinned && (
              <div className="grid place-items-center">
                <div className="relative aspect-square w-[min(28rem,80%)]">
                  <div
                    ref={orb}
                    aria-hidden
                    className="orb absolute inset-0"
                    style={{ ["--orb" as string]: mix(0) }}
                  />
                  {steps.map((s, i) => {
                    const img = s.slot ? getSlot(s.slot) : null;
                    if (!img) return null;
                    return (
                      <div
                        key={s.title}
                        aria-hidden={i !== active}
                        className={cn(
                          "ring-gold/60 absolute inset-0 overflow-hidden rounded-full ring-1 transition-opacity duration-500",
                          i === active ? "opacity-100" : "opacity-0",
                        )}
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="28rem"
                          className={cn("object-cover", s.position)}
                        />
                      </div>
                    );
                  })}
                  {/* Sphere shading and glow above every photo, so each one reads as part of the orb */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle at 35% 30%, rgb(255 255 255 / 0.28) 0%, transparent 42%), radial-gradient(circle at 72% 78%, rgb(0 0 0 / 0.4) 0%, transparent 62%)",
                      boxShadow:
                        "inset 0 0 0 1px rgb(217 139 52 / 0.35), inset 0 -30px 60px -30px rgb(0 0 0 / 0.45)",
                    }}
                  />
                </div>
              </div>
            )}
            <div>
              <SectionHeading
                eyebrow="03 — The brewing"
                title={
                  <span id="brew-heading">
                    Water meets leaf. <em className="accent text-gold-ink">Keep it simple.</em>
                  </span>
                }
              />
              {pinned ? (
                <div className="mt-10 min-h-40" aria-live="polite">
                  <p className="text-gold font-serif text-5xl">
                    {String(active + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl sm:text-4xl">{steps[active].title}</h3>
                  <p className="text-ink/80 mt-3 max-w-md text-lg">{steps[active].body}</p>
                  <div className="mt-8 flex gap-2" aria-hidden>
                    {steps.map((s, i) => (
                      <span
                        key={s.title}
                        className={cn(
                          "h-0.5 w-10 rounded-full",
                          i <= active ? "bg-gold" : "bg-line",
                        )}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <ol className="mt-10 space-y-4">
                  {steps.map((s, i) => {
                    const img = s.slot ? getSlot(s.slot) : null;
                    return (
                      <li
                        key={s.title}
                        className="border-line bg-surface-2 flex flex-col items-center gap-3 rounded-2xl border p-5 text-center"
                      >
                        {img && (
                          <div className="ring-gold/50 relative size-28 shrink-0 overflow-hidden rounded-full ring-1">
                            <Image
                              src={img.src}
                              alt={img.alt}
                              fill
                              sizes="7rem"
                              className={cn("object-cover", s.position)}
                            />
                          </div>
                        )}
                        <span className="text-gold font-serif text-3xl">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-serif text-xl">{s.title}</h3>
                          <p className="text-ink/75 mt-1 text-[0.95rem]">{s.body}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
              <div className="mt-8">
                <ButtonLink href="/shop" variant="on-dark">
                  Get the tea
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page pb-24">
        <p className="text-muted mb-5 text-xs font-medium tracking-[0.2em] uppercase">
          The approved brewing guides
        </p>
        <BrewToggle />
      </div>
    </section>
  );
}
