import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { VariantChip } from "@/components/ui/variant-chip";
import { reasonsByVariant } from "@/content/reasons";
import type { CatalogProduct } from "@/lib/product-utils";

/** Approved "Strong or Premium BOPF — which is right for me" copy, split per range. */
export function ChooseYourCup({
  strong,
  bopf,
}: {
  strong?: CatalogProduct;
  bopf?: CatalogProduct;
}) {
  const compare = reasonsByVariant.loose[0];
  const cards = [
    {
      range: "strong" as const,
      tagline: "Rich and Bold",
      body: compare.body[0],
      href: "/shop?range=strong",
      cta: "Shop Strong",
      product: strong,
      surface: "bg-strong text-ivory",
      ring: "ring-strong",
    },
    {
      range: "bopf" as const,
      tagline: "Bright and Full Bodied",
      body: "Samrin Premium BOPF gives you a bright, full-bodied cup with a more noticeable tea flavour. It is best appreciated plain, while retaining enough strength for milk.",
      href: "/shop?range=bopf",
      cta: "Shop Premium BOPF",
      product: bopf,
      surface: "bg-forest text-ivory",
      ring: "ring-forest",
    },
  ];
  return (
    <section aria-labelledby="choose-heading" className="bg-surface py-24 sm:py-28">
      <div className="container-page">
        <SectionHeading
          eyebrow="04 — Choose your cup"
          title={
            <span id="choose-heading">
              Strong or Premium BOPF — <em className="accent">which is right for me?</em>
            </span>
          }
          intro={compare.summary}
        />
        <ul className="mt-12 grid gap-6 lg:grid-cols-2">
          {cards.map((c) => {
            const image = c.product?.images[0];
            return (
              <li
                key={c.range}
                className={`on-dark reveal relative overflow-hidden rounded-3xl ${c.surface}`}
              >
                <div className="grid h-full grid-cols-1 items-center gap-8 p-7 sm:grid-cols-[1fr_9rem] sm:gap-6 sm:p-8 xl:grid-cols-[1fr_12rem] xl:p-10">
                  <div className="pb-2">
                    <VariantChip range={c.range} onDark />
                    <h3 className="text-cream mt-5 text-3xl sm:text-4xl">
                      <em className="accent">{c.tagline}</em>
                    </h3>
                    <p className="text-cream/90 mt-4 text-[0.95rem] leading-relaxed">{c.body}</p>
                    <ButtonLink href={c.href} variant="on-dark" className="mt-7">
                      {c.cta}
                    </ButtonLink>
                  </div>
                  {image && (
                    <div className="bg-ivory ring-gold/70 relative order-first mx-auto aspect-[4/5] w-40 overflow-hidden rounded-xl ring-1 sm:order-last sm:mx-0 sm:w-full">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1280px) 12rem, 10rem"
                        className="object-contain p-1"
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
