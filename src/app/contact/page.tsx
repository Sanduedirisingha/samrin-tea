import { Globe, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHeader } from "@/components/sections/page-header";
import { AccordionItem } from "@/components/ui/accordion";
import { contactFaq } from "@/content/faq";
import { getCatalog } from "@/lib/data/products";
import { getStoreSettings } from "@/lib/data/settings";
import { createFormToken } from "@/lib/form-guard";
import { siteConfig } from "@/lib/site-config";
import { inquiryTypeValues, type InquiryTypeValue } from "@/lib/validators/contact";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Talk to Samrin: questions, order help, business supply, tasting samples and factory-visit interest.",
  alternates: { canonical: "/contact" },
};

// Each render issues a fresh signed timing token, so this page is never cached.
export const dynamic = "force-dynamic";

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const sp = await searchParams;
  const typeParam = first(sp.type);
  const initialType: InquiryTypeValue = inquiryTypeValues.includes(typeParam as InquiryTypeValue)
    ? (typeParam as InquiryTypeValue)
    : "general";
  const productSlug = first(sp.product);
  const catalog = await getCatalog();
  const store = await getStoreSettings();
  const match = catalog.find((p) => p.slug === productSlug);

  const { factory, manufacturer, distributor } = siteConfig;

  return (
    <>
      <PageHeader
        eyebrow="Contact us"
        title={
          <>
            Talk to us <em className="accent">about tea.</em>
          </>
        }
        intro="A quick question about a pack, help with an order, or a supply conversation for your business — it all reaches the same team."
      />

      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div className="space-y-10">
          <section aria-labelledby="reach-heading">
            <h2 id="reach-heading" className="text-heading text-2xl">
              Reach us
            </h2>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-4 max-md:flex-col max-md:items-center max-md:gap-1">
                <Phone aria-hidden className="text-gold-ink mt-1 size-5 shrink-0" />
                <div>
                  <p className="text-muted text-sm">Consumer care</p>
                  <a
                    href={siteConfig.hotline.href}
                    className="text-heading font-serif text-2xl hover:underline"
                  >
                    {siteConfig.hotline.display}
                  </a>
                </div>
              </li>
              <li className="flex gap-4 max-md:flex-col max-md:items-center max-md:gap-1">
                <Globe aria-hidden className="text-gold-ink mt-1 size-5 shrink-0" />
                <div>
                  <p className="text-muted text-sm">Website</p>
                  <a
                    href={siteConfig.website.href}
                    className="text-heading font-medium hover:underline"
                  >
                    {siteConfig.website.display}
                  </a>
                </div>
              </li>
              {store.contactEmail && (
                <li className="flex gap-4 max-md:flex-col max-md:items-center max-md:gap-1">
                  <Mail aria-hidden className="text-gold-ink mt-1 size-5 shrink-0" />
                  <div>
                    <p className="text-muted text-sm">Email</p>
                    <a
                      href={`mailto:${store.contactEmail}`}
                      className="text-heading font-medium hover:underline"
                    >
                      {store.contactEmail}
                    </a>
                  </div>
                </li>
              )}
              {store.whatsappNumber && (
                <li className="flex gap-4 max-md:flex-col max-md:items-center max-md:gap-1">
                  <MessageCircle aria-hidden className="text-gold-ink mt-1 size-5 shrink-0" />
                  <div>
                    <p className="text-muted text-sm">WhatsApp</p>
                    <a
                      href={`https://wa.me/${store.whatsappNumber}`}
                      className="text-heading font-medium hover:underline"
                    >
                      Chat with us
                    </a>
                  </div>
                </li>
              )}
            </ul>
          </section>

          <section aria-labelledby="where-heading">
            <h2 id="where-heading" className="text-heading text-2xl">
              Where we are
            </h2>
            <address className="mt-5 space-y-6 not-italic">
              {[
                { label: "Samrin Tea Factory", name: factory.name, lines: factory.address },
                { label: "Manufactured by", name: manufacturer.name, lines: manufacturer.address },
                { label: "Distributed by", name: distributor.name, lines: distributor.address },
              ].map((a) => (
                <div
                  key={a.label}
                  className="flex gap-4 max-md:flex-col max-md:items-center max-md:gap-1"
                >
                  <MapPin aria-hidden className="text-gold-ink mt-1 size-5 shrink-0" />
                  <div>
                    <p className="text-muted text-sm">{a.label}</p>
                    <p className="font-medium">{a.name}</p>
                    <p className="text-muted">{a.lines.join(", ")}</p>
                  </div>
                </div>
              ))}
            </address>
          </section>
        </div>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="sr-only">
            Send us a message
          </h2>
          <div className="border-line bg-surface-2 rounded-2xl border p-6 sm:p-9">
            <ContactForm
              key={`${initialType}-${match?.slug ?? ""}`}
              initialType={initialType}
              product={match ? { slug: match.slug, name: match.name } : undefined}
              formToken={createFormToken()}
            />
          </div>
        </section>
      </div>

      <section aria-labelledby="faq-heading" className="container-page mt-24">
        <h2 id="faq-heading" className="text-heading text-3xl">
          Questions we expect
        </h2>
        <div className="mt-8 max-w-3xl">
          {contactFaq.map((f) => (
            <AccordionItem key={f.question} title={f.question}>
              <p>{f.answer}</p>
            </AccordionItem>
          ))}
        </div>
      </section>
    </>
  );
}
