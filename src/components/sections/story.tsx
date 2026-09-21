import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";

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

export function Story() {
  return (
    <section
      id="story"
      aria-labelledby="story-heading"
      className="on-dark text-paper scroll-mt-16 bg-[#0e1a14] py-24 sm:py-32"
    >
      <div className="container-page">
        <SectionHeading
          onDark
          eyebrow="06 — The story"
          title={
            <span id="story-heading">
              A new tea, <em className="accent text-champagne">told plainly.</em>
            </span>
          }
          intro="One region, one factory, and a cup strong enough to be worth talking about. Everything here is something we can stand behind."
        />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <li
              key={c.title}
              className="reveal border-paper/10 rounded-2xl border bg-[#16281d] p-7"
            >
              <h3 className="font-serif text-2xl">{c.title}</h3>
              <p className="text-paper/75 mt-3 leading-relaxed">{c.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <Link
            href="/about"
            className="text-champagne font-medium underline underline-offset-4 hover:text-white"
          >
            Read the full story →
          </Link>
        </p>
      </div>
    </section>
  );
}
