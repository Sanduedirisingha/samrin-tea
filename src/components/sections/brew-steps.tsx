"use client";

import { useEffect, useRef, useState } from "react";
import { BrewToggle } from "@/components/sections/brew-toggle";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { PIN_QUERY, useMediaQuery } from "@/lib/use-media-query";

/** Wording follows the approved loose-leaf brewing artwork. */
const steps = [
  { title: "Rinse the cup", body: "Rinse the cup with hot water and pour out the water." },
  { title: "Add the tea", body: "Add 2 g of tea (about 1 teaspoon per cup)." },
  { title: "Add boiling water", body: "Add 200 ml of boiling water at 100°C." },
  { title: "Brew", body: "Brew for 3–5 minutes, or as preferred." },
  { title: "Filter and enjoy", body: "Filter, and enjoy." },
] as const;

const NAV = 64;
const COLD = [0x24, 0x40, 0x2f] as const; // deep green
const WARM = [0xd9, 0x8b, 0x34] as const; // copper amber

const mix = (p: number) =>
  `rgb(${COLD.map((c, i) => Math.round(c + (WARM[i] - c) * p)).join(",")})`;

/**
 * "Water meets leaf" — the orb warms from green to amber as the steps advance (pinned on wide
 * screens), then the approved brewing artwork for loose tea and tea bags.
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
      className="on-dark text-paper scroll-mt-16 bg-[#111e16]"
    >
      <div ref={section}>
        <div
          className={cn(
            pinned
              ? "sticky top-16 flex h-[calc(100dvh-4rem)] items-center overflow-hidden"
              : "py-24",
          )}
        >
          <div className="container-page grid items-center gap-12 lg:grid-cols-2">
            {pinned && (
              <div className="grid place-items-center">
                <div
                  ref={orb}
                  aria-hidden
                  className="orb aspect-square w-[min(28rem,80%)]"
                  style={{ ["--orb" as string]: mix(0) }}
                />
              </div>
            )}
            <div>
              <SectionHeading
                onDark
                eyebrow="03 — The brewing"
                title={
                  <span id="brew-heading">
                    Water meets leaf. <em className="accent text-champagne">Keep it simple.</em>
                  </span>
                }
              />
              {pinned ? (
                <div className="mt-10 min-h-40" aria-live="polite">
                  <p className="text-gold font-serif text-5xl">
                    {String(active + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-serif text-3xl sm:text-4xl">{steps[active].title}</h3>
                  <p className="text-paper/80 mt-3 max-w-md text-lg">{steps[active].body}</p>
                  <div className="mt-8 flex gap-2" aria-hidden>
                    {steps.map((s, i) => (
                      <span
                        key={s.title}
                        className={cn(
                          "h-0.5 w-10 rounded-full",
                          i <= active ? "bg-gold" : "bg-paper/20",
                        )}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <ol className="mt-10 space-y-4">
                  {steps.map((s, i) => (
                    <li
                      key={s.title}
                      className="border-paper/10 flex gap-5 rounded-2xl border bg-[#16281d] p-5"
                    >
                      <span className="text-gold font-serif text-3xl">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-serif text-xl">{s.title}</h3>
                        <p className="text-paper/75 mt-1 text-[0.95rem]">{s.body}</p>
                      </div>
                    </li>
                  ))}
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
        <p className="text-sage mb-5 text-xs font-medium tracking-[0.2em] uppercase">
          The approved brewing guides
        </p>
        <BrewToggle />
      </div>
    </section>
  );
}
