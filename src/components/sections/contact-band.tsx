import { ArrowRight, Building2, Coffee, Factory, Phone } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { shopConfig, siteConfig } from "@/lib/site-config";

const cards = [
  {
    icon: Building2,
    eyebrow: "Business supply",
    title: "Talk supply",
    body: "Offices, cafés, shops and restaurants: ask about regular supply and business pricing.",
    href: "/contact?type=business",
    cta: "Talk to Samrin",
  },
  {
    icon: Factory,
    eyebrow: "Factory visits",
    title: "Visit the factory",
    body: `Factory visits are planned from ${shopConfig.factoryVisitsFrom}. Register your interest.`,
    href: "/contact?type=visit",
    cta: "Register interest",
  },
  {
    icon: Coffee,
    eyebrow: "Still unsure?",
    title: "Taste first",
    body: "Taste Samrin the way you normally make tea. Samples are subject to availability.",
    href: "/contact?type=sample",
    cta: "Request a tasting sample",
  },
] as const;

export function ContactBand() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-surface scroll-mt-20 py-24 sm:py-28"
    >
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            eyebrow="07 — Contact"
            title={
              <span id="contact-heading">
                Talk to us <em className="accent text-gold-ink">about tea.</em>
              </span>
            }
            intro="A quick question about a pack, or a supply conversation for a business. Both reach the same team."
          />
          <a
            href={siteConfig.hotline.href}
            className="bg-surface-2 border-line hover:border-heading flex items-center gap-4 rounded-2xl border px-6 py-5 transition-colors"
          >
            <Phone aria-hidden className="text-gold-ink size-6" strokeWidth={1.5} />
            <span>
              <span className="text-muted block text-xs tracking-[0.16em] uppercase">
                Consumer care
              </span>
              <span className="text-heading font-serif text-2xl">{siteConfig.hotline.display}</span>
            </span>
          </a>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map(({ icon: Icon, eyebrow, title, body, href, cta }) => (
            <li key={title} className="flex">
              <Link
                href={href}
                className="group reveal border-line bg-surface-2 hover:border-heading flex w-full flex-col rounded-2xl border p-7 transition-colors"
              >
                <Icon aria-hidden className="text-gold-ink size-7" strokeWidth={1.4} />
                <p className="text-muted mt-5 text-xs tracking-[0.16em] uppercase">{eyebrow}</p>
                <h3 className="text-heading mt-1 text-2xl">{title}</h3>
                <p className="text-muted mt-3 flex-1">{body}</p>
                <span className="text-heading mt-6 inline-flex items-center gap-2 font-medium">
                  {cta}
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
