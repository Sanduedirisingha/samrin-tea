"use client";

import { ArrowRight, Filter, PackageCheck, Truck, Wind, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SlotImage } from "@/components/ui/slot-image";
import type { SlotId } from "@/content/site-images";
import { cn } from "@/lib/cn";
import { useMediaQuery } from "@/lib/use-media-query";

/** Only facts from the approved product copy: manufacture runs withering → sifting. */
const panels: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  slot: SlotId;
  href: string;
  cta: string;
}[] = [
  {
    icon: Wind,
    eyebrow: "At the factory",
    title: "Withering",
    body: "Where black-tea manufacture begins at Samrin Tea Factory in Nakiyadeniya, Galle district.",
    slot: "making1",
    href: "/about",
    cta: "Read our story",
  },
  {
    icon: Filter,
    eyebrow: "At the factory",
    title: "Sifting",
    body: "Where manufacture ends. The factory's ISO 22000:2018 certification covers black-tea manufacture from withering to sifting.",
    slot: "making2",
    href: "/about",
    cta: "Read our story",
  },
  {
    icon: PackageCheck,
    eyebrow: "At the factory",
    title: "Packed at the factory",
    body: "The finished loose tea is packed at the same factory, keeping the journey from finished tea to sealed pack short and easier to oversee.",
    slot: "making3",
    href: "/shop",
    cta: "Shop the tea",
  },
  {
    icon: Truck,
    eyebrow: "A separate step",
    title: "Tea bags, transparently",
    body: "Tea bags are a separate step: the tea travels a short distance to a nearby specialist facility, using Samrin's quality and freshness requirements.",
    slot: "making4",
    href: "/shop",
    cta: "Shop the tea",
  },
];

const AMBER = "#e9a354"; // reads on photos in both themes

/**
 * "From withering to sealed pack" — four photo panels; the open one widens and carries the
 * text, the rest fold down to a number, icon and title. Opens on click, and moves on by itself
 * (paused on hover, focus, off-screen and for reduced-motion users).
 */
export function MakingPanels() {
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const motionOk = useMediaQuery("(prefers-reduced-motion: no-preference)");

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = hovered || focused || !inView;

  return (
    <section
      id="making"
      aria-labelledby="making-heading"
      className="text-ink bg-surface scroll-mt-20 py-24"
    >
      <div className="container-page">
        <SectionHeading
          align="center"
          eyebrow="02 — The making"
          title={
            <span id="making-heading">
              From withering to <em className="accent text-gold-ink">sealed pack.</em>
            </span>
          }
        />

        <div
          ref={wrap}
          className="reveal mt-12"
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <ol className="flex h-[40rem] flex-col gap-3 lg:h-[34rem] lg:flex-row">
            {panels.map((p, i) => {
              const on = i === active;
              const Icon = p.icon;
              return (
                <li
                  key={p.title}
                  style={{ flexGrow: on ? 6 : 1 }}
                  className="bg-deep shadow-card relative min-h-0 min-w-0 basis-0 overflow-hidden rounded-3xl text-white transition-[flex-grow] duration-[1100ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                >
                  {/* Photo, with a slow settle-in zoom while open */}
                  <div
                    className={cn(
                      "absolute inset-0 transition-transform duration-[2400ms] ease-out",
                      on ? "scale-105" : "scale-100",
                    )}
                  >
                    <SlotImage slot={p.slot} sizes="(min-width: 1024px) 50vw, 100vw" />
                  </div>
                  <div
                    aria-hidden
                    className={cn(
                      "bg-deep absolute inset-0 transition-opacity duration-[1100ms]",
                      on ? "opacity-0" : "opacity-40",
                    )}
                  />

                  {/* The whole panel opens on click / Enter / Space */}
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-label={`Step ${i + 1}: ${p.title}`}
                    onClick={() => setActive(i)}
                    className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white"
                  />

                  <div className="pointer-events-none relative z-20 h-full">
                    {/* Number, icon and (mobile) folded title */}
                    <div className="absolute inset-x-0 top-0 flex h-[4.5rem] items-center gap-3 px-5 lg:h-auto lg:flex-col lg:px-0 lg:pt-6">
                      <span className="text-xs font-medium tracking-[0.2em] text-white/80">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        aria-hidden
                        className="bg-deep/70 grid size-10 place-items-center rounded-full ring-1"
                        style={{ color: AMBER, ["--tw-ring-color" as string]: `${AMBER}66` }}
                      >
                        <Icon className="size-[1.15rem]" strokeWidth={1.5} />
                      </span>
                      <span
                        aria-hidden
                        className={cn(
                          "font-serif text-lg transition-opacity duration-700 lg:hidden",
                          on ? "opacity-0" : "opacity-100",
                        )}
                      >
                        {p.title}
                      </span>
                    </div>

                    {/* Folded title, reading upwards */}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute bottom-7 left-1/2 hidden -translate-x-1/2 rotate-180 font-serif text-xl whitespace-nowrap transition-opacity duration-700 [writing-mode:vertical-rl] lg:block",
                        on ? "opacity-0" : "opacity-100",
                      )}
                    >
                      {p.title}
                    </span>

                    {/* Open panel */}
                    <div
                      aria-hidden={!on}
                      className={cn(
                        "absolute inset-x-0 bottom-0 px-6 pb-14 transition-[opacity,transform] duration-[1000ms] ease-out sm:px-9 lg:w-[34rem] lg:px-10 xl:w-[38rem]",
                        on
                          ? "translate-y-0 opacity-100 delay-[550ms]"
                          : "pointer-events-none translate-y-4 opacity-0",
                      )}
                    >
                      <p
                        className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase"
                        style={{ color: AMBER }}
                      >
                        <Icon aria-hidden className="size-4" strokeWidth={1.6} />
                        {p.eyebrow}
                      </p>
                      <h3 className="font-serif text-3xl leading-tight sm:text-4xl">{p.title}</h3>
                      <p className="mt-4 max-w-lg text-[0.95rem] leading-relaxed text-white/85 sm:text-base">
                        {p.body}
                      </p>
                      <Link
                        href={p.href}
                        tabIndex={on ? 0 : -1}
                        className="pointer-events-auto mt-6 flex max-w-lg items-center justify-between border-t border-white/25 pt-4 text-sm font-medium transition-colors hover:text-white/70"
                      >
                        {p.cta}
                        <ArrowRight aria-hidden className="size-4" style={{ color: AMBER }} />
                      </Link>
                    </div>

                    {/* Auto-advance progress */}
                    {on && motionOk && (
                      <span
                        aria-hidden
                        className="absolute inset-x-6 bottom-6 block h-px bg-white/25 sm:inset-x-9 lg:inset-x-10"
                      >
                        <span
                          key={active}
                          onAnimationEnd={() => setActive((a) => (a + 1) % panels.length)}
                          className="panel-progress block h-px origin-left"
                          style={{
                            background: AMBER,
                            animationPlayState: paused ? "paused" : "running",
                          }}
                        />
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
