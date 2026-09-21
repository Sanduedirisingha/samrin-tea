import { Coffee, Factory, Mountain, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { SectionHeading } from "@/components/ui/section-heading";
import { hasSlot, SlotImage } from "@/components/ui/slot-image";
import type { SlotId } from "@/content/site-images";

/** Photo slots from the design. Captions come from approved copy; swap in real photography later. */
const tiles: { slot: SlotId; icon: LucideIcon; label: string; caption: string }[] = [
  {
    slot: "storyRuhuna",
    icon: Mountain,
    label: "Ruhuna",
    caption:
      "Ruhuna is part of Sri Lanka's low-grown tea area, where warm conditions suit richly coloured black tea.",
  },
  {
    slot: "storyFactory",
    icon: Factory,
    label: "One factory",
    caption: "Samrin Tea Factory, Nakiyadeniya, Galle district.",
  },
  {
    slot: "storyCup",
    icon: Coffee,
    label: "Your cup",
    caption: "Milk tea or plain: your usual way of drinking tea is the best guide.",
  },
];

/** Three plain statements, each taken from the approved "What Samrin brings" copy. */
const cards = [
  {
    title: "One known factory",
    body: "Samrin tea comes from one identified factory in Ruhuna, so the source behind the tea is easy to understand.",
  },
  {
    title: "Not blended across regions",
    body: "It is not mixed with teas from unrelated factories or regions simply to create a standardised profile.",
  },
  {
    title: "Tea bags, transparently",
    body: "Samrin Tea Factory does not currently have tea-bagging machinery, so the tea travels a short distance to a nearby specialist packing facility.",
  },
] as const;

export function Story({
  as = "h2",
  withTiles,
  eyebrow = "06 — The story",
}: {
  as?: "h1" | "h2";
  withTiles?: boolean;
  eyebrow?: string;
}) {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="text-ink bg-surface scroll-mt-20 py-24 sm:py-32"
    >
      <div className="container-page">
        <SectionHeading
          as={as}
          eyebrow={eyebrow}
          title={
            <span id="story-heading">
              A new tea, <em className="accent text-gold-ink">told plainly.</em>
            </span>
          }
          intro="One region, one factory, and a cup strong enough to be worth talking about. Everything here is something we can stand behind."
        />

        {withTiles && (
          <ul className="mt-14 grid gap-5 md:grid-cols-3">
            {tiles.map(({ slot, icon: Icon, label, caption }) => (
              <li
                key={label}
                className="hatch border-line bg-surface-2 relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl border p-6"
              >
                <SlotImage slot={slot} sizes="(min-width: 768px) 33vw, 100vw" />
                {hasSlot(slot) ? (
                  <span />
                ) : (
                  <Icon aria-hidden className="text-gold-ink relative size-9" strokeWidth={1.3} />
                )}
                <div className="relative">
                  <p
                    className={cn(
                      "text-xs tracking-[0.2em] uppercase",
                      hasSlot(slot) ? "text-paper/80" : "text-muted",
                    )}
                  >
                    {label}
                  </p>
                  <p
                    className={cn(
                      "mt-2 text-[0.95rem] leading-snug",
                      hasSlot(slot) ? "text-paper" : "text-ink/90",
                    )}
                  >
                    {caption}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <ul
          className={
            withTiles ? "mt-5 grid gap-5 md:grid-cols-3" : "mt-14 grid gap-5 md:grid-cols-3"
          }
        >
          {cards.map((c) => (
            <li key={c.title} className="border-line bg-surface-2 rounded-2xl border p-7">
              <h3 className="font-serif text-2xl">{c.title}</h3>
              <p className="text-ink/75 mt-3 leading-relaxed">{c.body}</p>
            </li>
          ))}
        </ul>

        {!withTiles && (
          <p className="mt-10">
            <Link
              href="/about"
              className="text-gold-ink hover:text-heading font-medium underline underline-offset-4"
            >
              Read the full story →
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}
