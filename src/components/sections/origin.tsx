import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { SlotImage } from "@/components/ui/slot-image";
import { reasonsByVariant } from "@/content/reasons";

const [, ruhuna, brings] = reasonsByVariant.loose;

/** Chips carry the trust facts. Text only: no certification marks are recreated. */
const facts = [
  { title: "Ruhuna", label: "Single region" },
  { title: "Unblended", label: "One known factory" },
  { title: "Factory-packed", label: "Loose tea" },
  { title: "ISO 22000:2018", label: "Tea manufacture" },
] as const;

export function Origin() {
  return (
    <section id="origin" className="on-dark text-paper scroll-mt-16 bg-[#12241a] py-24 sm:py-32">
      <div className="container-page grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            onDark
            eyebrow="01 — The origin"
            title={
              <>
                Low country, <em className="accent text-champagne block">strong cup.</em>
              </>
            }
          />
          <p className="text-paper/85 mt-8 text-lg leading-relaxed">{ruhuna.summary}</p>
          <p className="text-paper/75 mt-4 leading-relaxed">{brings.summary}</p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {facts.map((f) => (
              <li key={f.title} className="border-paper/15 rounded-xl border px-4 py-3">
                <p className="font-serif text-xl">{f.title}</p>
                <p className="text-sage mt-0.5 text-[0.7rem] tracking-[0.16em] uppercase">
                  {f.label}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8">
            <Link
              href="/about#ruhuna"
              className="text-champagne font-medium underline underline-offset-4 hover:text-white"
            >
              Read more about Ruhuna tea →
            </Link>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="hatch border-paper/15 relative col-span-2 flex aspect-[16/10] flex-col justify-end overflow-hidden rounded-2xl border bg-[#16281d] p-7">
            <SlotImage slot="originMain" sizes="(min-width: 1024px) 40vw, 100vw" />
            <p className="text-sage relative text-xs tracking-[0.2em] uppercase">
              Where it is made
            </p>
            <p className="relative mt-2 font-serif text-4xl sm:text-5xl">
              Nakiyadeniya, <em className="accent text-champagne">Galle district</em>
            </p>
            <p className="text-paper/70 relative mt-3 text-sm">
              Between the Kanneliya, Dediyagala and Kottawa forest areas.
            </p>
          </div>
          <div className="border-paper/15 rounded-2xl border bg-[#16281d] p-6">
            <p className="text-gold font-serif text-4xl">1</p>
            <p className="mt-2 font-serif text-xl">Region</p>
            <p className="text-paper/70 mt-1 text-sm">Ruhuna, Sri Lanka</p>
          </div>
          <div className="border-paper/15 rounded-2xl border bg-[#16281d] p-6">
            <p className="text-gold font-serif text-4xl">1</p>
            <p className="mt-2 font-serif text-xl">Factory</p>
            <p className="text-paper/70 mt-1 text-sm">Samrin Tea Factory</p>
          </div>
        </div>
      </div>
    </section>
  );
}
