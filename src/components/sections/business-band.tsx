import Link from "next/link";
import { ArrowRight, Building2, Coffee, Factory } from "lucide-react";
import { shopConfig } from "@/lib/site-config";

const cards = [
  {
    icon: Building2,
    title: "Business supply",
    body: "Offices, cafés, shops and restaurants: ask about regular supply and business pricing.",
    href: "/contact?type=business",
    cta: "Talk to Samrin",
  },
  {
    icon: Factory,
    title: "Factory visits",
    body: `Factory visits are planned from ${shopConfig.factoryVisitsFrom}. Register your interest.`,
    href: "/contact?type=visit",
    cta: "Register interest",
  },
  {
    icon: Coffee,
    title: "Still unsure?",
    body: "Taste Samrin the way you normally make tea. Samples are subject to availability.",
    href: "/contact?type=sample",
    cta: "Request a tasting sample",
  },
] as const;

export function BusinessBand() {
  return (
    <section
      aria-label="Business, factory visits and samples"
      className="bg-champagne/40 mt-28 py-20"
    >
      <div className="container-page grid gap-6 md:grid-cols-3">
        {cards.map(({ icon: Icon, title, body, href, cta }) => (
          <Link
            key={title}
            href={href}
            className="group reveal border-gold/50 bg-ivory flex flex-col rounded-2xl border p-7 transition-shadow hover:shadow-[0_16px_36px_-16px_rgb(4_40_16/0.35)]"
          >
            <Icon aria-hidden className="text-gold-ink size-8" strokeWidth={1.4} />
            <h3 className="text-forest mt-5 text-2xl">{title}</h3>
            <p className="text-muted mt-3 flex-1">{body}</p>
            <span className="text-forest mt-6 inline-flex items-center gap-2 font-medium">
              {cta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
