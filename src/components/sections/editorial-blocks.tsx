import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { reasonsByVariant } from "@/content/reasons";

/** Short versions of the approved "Why Ruhuna" / "What Samrin brings" copy, linking to About. */
export function EditorialBlocks() {
  const [, ruhuna, brings] = reasonsByVariant.loose;
  const blocks = [
    {
      eyebrow: "03 — Origin",
      title: (
        <>
          Why <em className="accent">Ruhuna</em> tea is special
        </>
      ),
      reason: ruhuna,
      id: "ruhuna",
    },
    {
      eyebrow: "04 — Difference",
      title: (
        <>
          What Samrin <em className="accent">brings</em> to your cup
        </>
      ),
      reason: brings,
      id: "brings",
    },
  ];
  return (
    <section aria-label="Ruhuna and Samrin" className="container-page mt-28">
      <div className="grid gap-16 md:grid-cols-2 md:gap-12">
        {blocks.map((b) => (
          <article key={b.id} className="reveal border-gold border-t pt-8">
            <SectionHeading eyebrow={b.eyebrow} title={b.title} />
            <p className="mt-6 text-lg leading-relaxed">{b.reason.summary}</p>
            <p className="mt-6">
              <Link
                href={b.reason.link.href}
                className="text-forest hover:text-deep font-medium underline underline-offset-4"
              >
                {b.reason.link.label} →
              </Link>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
