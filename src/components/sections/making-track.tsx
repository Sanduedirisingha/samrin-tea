"use client";

import { Filter, PackageCheck, Truck, Wind, type LucideIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { SlotImage } from "@/components/ui/slot-image";
import type { SlotId } from "@/content/site-images";
import { cn } from "@/lib/cn";
import { PIN_QUERY, useMediaQuery } from "@/lib/use-media-query";

/** Only facts from the approved product copy: manufacture runs withering → sifting. */
const steps: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Wind,
    title: "Withering",
    body: "Where black-tea manufacture begins at Samrin Tea Factory in Nakiyadeniya, Galle district.",
  },
  {
    icon: Filter,
    title: "Sifting",
    body: "Where manufacture ends. The factory's ISO 22000:2018 certification covers black-tea manufacture from withering to sifting.",
  },
  {
    icon: PackageCheck,
    title: "Packed at the factory",
    body: "The finished loose tea is packed at the same factory, keeping the journey from finished tea to sealed pack short and easier to oversee.",
  },
  {
    icon: Truck,
    title: "Tea bags, transparently",
    body: "Tea bags are a separate step: the tea travels a short distance to a nearby specialist facility, using Samrin's quality and freshness requirements.",
  },
];

const NAV = 64; // sticky header height in px

function Card({ index, step }: { index: number; step: (typeof steps)[number] }) {
  const Icon = step.icon;
  return (
    <li className="border-paper/10 w-[min(84vw,30rem)] shrink-0 snap-start rounded-3xl border bg-[#16281d] p-7 sm:p-9">
      <div className="flex items-start justify-between">
        <span className="text-gold font-serif text-5xl">{String(index + 1).padStart(2, "0")}</span>
        <Icon aria-hidden className="text-champagne size-7" strokeWidth={1.4} />
      </div>
      <div className="hatch border-paper/10 relative mt-6 h-36 overflow-hidden rounded-xl border sm:h-44">
        <SlotImage slot={`making${index + 1}` as SlotId} sizes="30rem" overlay={false} />
      </div>
      <h3 className="mt-6 font-serif text-2xl">{step.title}</h3>
      <p className="text-paper/75 mt-2 text-[0.95rem] leading-relaxed">{step.body}</p>
    </li>
  );
}

/**
 * "Four things happen to the leaf" — pinned, horizontally scrolling on wide screens;
 * a native swipeable strip on phones and for reduced-motion users.
 */
export function MakingTrack() {
  const pinned = useMediaQuery(PIN_QUERY);
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinned) return;
    const sec = section.current;
    const trk = track.current;
    const fill = bar.current;
    if (!sec || !trk || !fill) return;
    let distance = 0;
    let frame = 0;

    const update = () => {
      frame = 0;
      const total = Math.max(1, sec.offsetHeight - (window.innerHeight - NAV));
      const p = Math.min(1, Math.max(0, (NAV - sec.getBoundingClientRect().top) / total));
      trk.style.transform = `translate3d(${-p * distance}px,0,0)`;
      fill.style.transform = `scaleX(${p})`;
    };
    const measure = () => {
      distance = Math.max(0, trk.offsetWidth - sec.clientWidth);
      sec.style.height = `${distance + window.innerHeight - NAV}px`;
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
      id="making"
      ref={section}
      aria-labelledby="making-heading"
      className="on-dark text-paper scroll-mt-16 bg-[#0e1a14]"
    >
      <div
        className={cn(
          pinned
            ? "sticky top-16 flex h-[calc(100dvh-4rem)] flex-col justify-center overflow-hidden"
            : "py-24",
        )}
      >
        <div className="container-page">
          <SectionHeading
            onDark
            eyebrow="02 — The making"
            title={
              <span id="making-heading">
                From withering to <em className="accent text-champagne">sealed pack.</em>
              </span>
            }
          />
        </div>

        <div className={cn("mt-10", !pinned && "overflow-x-auto pb-4")}>
          <ol
            ref={track}
            className={cn(
              "flex w-max gap-5 will-change-transform",
              !pinned && "snap-x snap-mandatory",
              "px-4 sm:px-8 lg:px-[max(2rem,calc((100vw-76rem)/2+2rem))]",
            )}
          >
            {steps.map((s, i) => (
              <Card key={s.title} index={i} step={s} />
            ))}
          </ol>
        </div>

        {pinned && (
          <div className="container-page mt-10">
            <div className="bg-paper/15 h-px w-full">
              <div ref={bar} className="bg-gold h-px origin-left scale-x-0" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
