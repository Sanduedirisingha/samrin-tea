import type { Metadata } from "next";
import { Story } from "@/components/sections/story";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { reasonsByVariant } from "@/content/reasons";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About Samrin",
  description:
    "One region, one factory. Samrin is unblended Ruhuna tea, made at Samrin Tea Factory in Nakiyadeniya, Galle district.",
  alternates: { canonical: "/about" },
};

const [, ruhuna, , looseQuality] = reasonsByVariant.loose;
const bagBrings = reasonsByVariant.tea_bags[2];
const visit = reasonsByVariant.loose[4];

function Block({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="border-gold/60 scroll-mt-28 border-t py-16 sm:py-24"
    >
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeading eyebrow={eyebrow} title={<span id={`${id}-heading`}>{title}</span>} />
        <div className="reveal space-y-5 text-lg leading-relaxed">{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const { manufacturer, distributor, factory } = siteConfig;
  return (
    <>
      <Story as="h1" withTiles eyebrow="The story" />

      <Block
        id="ruhuna"
        eyebrow="Ruhuna"
        title={
          <>
            Why Ruhuna tea is <em className="accent">special</em>
          </>
        }
      >
        <p className="font-semibold">{ruhuna.summary}</p>
        {ruhuna.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </Block>

      <Block
        id="factory"
        eyebrow="The factory"
        title={
          <>
            Nakiyadeniya, <em className="accent">Galle district</em>
          </>
        }
      >
        <p>
          {factory.name} is in Nakiyadeniya in the Galle district, within the tea-growing landscape
          between the Kanneliya, Dediyagala and Kottawa forest areas.
        </p>
        <p>
          The tea is unblended: it is not mixed with teas from unrelated factories or regions. The
          loose tea is packed at the same factory, which reduces unnecessary transfers.
        </p>
      </Block>

      <Block
        id="quality"
        eyebrow="Quality &amp; freshness"
        title={
          <>
            Our quality and <em className="accent">freshness focus</em>
          </>
        }
      >
        <p className="font-semibold">{looseQuality.summary}</p>
        {looseQuality.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
      </Block>

      <Block
        id="tea-bags"
        eyebrow="Tea bags"
        title={
          <>
            Tea bags, <em className="accent">transparently</em>
          </>
        }
      >
        <p className="font-semibold">{bagBrings.summary}</p>
        {bagBrings.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <p>
          Tea-bag packing is a separate step carried out at a specialist facility, so the ISO
          22000:2018 certification of Samrin Tea Factory covers the manufacture of the tea, not the
          tea-bagging.
        </p>
      </Block>

      <Block
        id="visit"
        eyebrow="Visit the factory"
        title={
          <>
            See where Samrin <em className="accent">is made</em>
          </>
        }
      >
        <p className="font-semibold">{visit.summary}</p>
        {visit.body.map((p) => (
          <p key={p.slice(0, 24)}>{p}</p>
        ))}
        <ButtonLink href="/contact?type=visit" size="lg" className="mt-2">
          Register your interest
        </ButtonLink>
      </Block>

      <Block
        id="companies"
        eyebrow="The companies"
        title={
          <>
            Who is <em className="accent">behind</em> Samrin
          </>
        }
      >
        <dl className="grid gap-8 sm:grid-cols-2">
          <div>
            <dt className="text-gold-ink text-sm font-semibold tracking-[0.14em] uppercase">
              Manufactured by
            </dt>
            <dd className="mt-2">
              <span className="font-medium">{manufacturer.name}</span>
              <br />
              <span className="text-muted">{manufacturer.address.join(", ")}</span>
            </dd>
          </div>
          <div>
            <dt className="text-gold-ink text-sm font-semibold tracking-[0.14em] uppercase">
              Distributed by
            </dt>
            <dd className="mt-2">
              <span className="font-medium">{distributor.name}</span>
              <br />
              <span className="text-muted">{distributor.address.join(", ")}</span>
            </dd>
          </div>
        </dl>
        <p className="text-muted text-base">
          {siteConfig.mfNumber} · Packer registration {siteConfig.packerRegistration} · Consumer
          care{" "}
          <a href={siteConfig.hotline.href} className="text-forest font-medium underline">
            {siteConfig.hotline.display}
          </a>
        </p>
      </Block>
    </>
  );
}
