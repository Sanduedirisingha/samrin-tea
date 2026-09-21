import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PurchasePanel } from "@/components/cart/purchase-panel";
import { BrewGuide } from "@/components/product/brew-guide";
import { ProductCard } from "@/components/product/product-card";
import { ProductJsonLd } from "@/components/product/product-json-ld";
import { ReasonsAccordion } from "@/components/product/reasons-accordion";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { VariantChip } from "@/components/ui/variant-chip";
import { stillUnsure } from "@/content/reasons";
import { getCatalog, getProductBySlug } from "@/lib/data/products";
import { cn } from "@/lib/cn";
import { formatLkr } from "@/lib/format";
import { isPurchasable, toCartItem } from "@/lib/product-utils";

// Product data is cached for a minute; pages are prerendered and refreshed in the background.
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getCatalog()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found", robots: { index: false } };
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `/shop/${product.slug}`,
      images: product.images[0]
        ? [{ url: product.images[0].src, alt: product.images[0].alt }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const catalog = await getCatalog();
  const related = catalog
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.format === product.format) - Number(a.format === product.format))
    .slice(0, 3);

  const image = product.images[0];
  const purchasable = isPurchasable(product);
  const isStrong = product.range === "strong";
  const sample = product.isBusinessOnly ? stillUnsure.business : stillUnsure.consumer;
  const sampleHref = `/contact?type=sample&product=${product.slug}`;

  return (
    <>
      <ProductJsonLd product={product} />

      <div className="container-page pt-8 sm:pt-12">
        <nav aria-label="Breadcrumb" className="text-muted text-sm">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/shop" className="underline-offset-4 hover:underline">
                Shop
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-deep">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div
              className={cn(
                "border-line bg-ivory relative aspect-[4/5] overflow-hidden rounded-2xl border border-t-4",
                isStrong ? "border-t-strong" : "border-t-forest",
              )}
            >
              {image && (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40rem, 100vw"
                  className="object-contain p-4"
                />
              )}
            </div>
          </div>

          <div>
            <VariantChip range={product.range} />
            <h1 className="text-forest mt-4 text-4xl sm:text-5xl">{product.name}</h1>
            <p className="text-muted mt-3 font-serif text-xl italic">{product.tagline}</p>

            <p className="text-deep mt-6 text-3xl font-medium">
              {product.priceLkr !== null
                ? formatLkr(product.priceLkr)
                : "Business pricing on request"}
            </p>
            <p className="mt-6 text-lg leading-relaxed">{product.shortDescription}</p>

            <div className="mt-8">
              {purchasable ? (
                <PurchasePanel item={toCartItem(product)} />
              ) : product.isBusinessOnly ? (
                <ButtonLink
                  href={`/contact?type=business&product=${product.slug}`}
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Request Business Pricing / Talk to Samrin
                </ButtonLink>
              ) : (
                <p className="border-line bg-ivory text-muted rounded-lg border px-4 py-3">
                  This pack is currently unavailable.
                </p>
              )}
            </div>

            <p className="text-muted mt-6 text-sm">{product.description}</p>

            <div
              className={cn(
                "bg-ivory mt-8 rounded-xl border-l-4 p-6",
                isStrong ? "border-strong" : "border-gold",
              )}
            >
              <h2 className="text-gold-ink font-sans text-xs font-semibold tracking-[0.2em] uppercase">
                Choose this if
              </h2>
              <p className="text-forest mt-2 font-serif text-xl">{product.chooseThisIf}</p>
            </div>

            <section aria-labelledby="details-heading" className="mt-10">
              <h2 id="details-heading" className="text-forest text-2xl">
                Product details
              </h2>
              <dl className="divide-line border-line mt-4 divide-y border-y">
                {product.details.map((d) => (
                  <div
                    key={d.label}
                    className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-[0.95rem]"
                  >
                    <dt className="text-muted">{d.label}</dt>
                    <dd className="font-medium">{d.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </div>
      </div>

      <section aria-labelledby="brew-heading" className="container-page mt-20">
        <SectionHeading
          eyebrow="How to brew"
          title={
            <span id="brew-heading">
              {product.format === "loose" ? "Loose tea, " : "Tea bags, "}
              <em className="accent">brewed simply.</em>
            </span>
          }
        />
        <div className="mt-8">
          <BrewGuide format={product.format} />
        </div>
      </section>

      <section
        aria-labelledby="reasons-heading"
        className="container-page mt-20 grid gap-10 lg:grid-cols-[1fr_2fr]"
      >
        <div>
          <SectionHeading
            eyebrow="Samrin"
            title={
              <span id="reasons-heading">
                More reasons to <em className="accent">choose Samrin</em>
              </span>
            }
            intro="Select any topic to learn more about the tea behind your cup."
          />
        </div>
        <ReasonsAccordion variant={product.format} />
      </section>

      <section aria-labelledby="unsure-heading" className="container-page mt-20">
        <div className="border-gold/50 bg-ivory rounded-2xl border p-8 sm:p-12">
          <h2 id="unsure-heading" className="text-forest text-3xl">
            Still unsure?
          </h2>
          <p className="text-muted mt-4 max-w-2xl text-lg">{sample.body}</p>
          <ButtonLink href={sampleHref} variant="secondary" size="lg" className="mt-7">
            {sample.cta}
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="related-heading" className="container-page mt-20">
        <h2 id="related-heading" className="text-forest text-3xl">
          You may also like
        </h2>
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 lg:grid-cols-3">
          {related.map((p) => (
            <li key={p.id} className="flex">
              <div className="flex w-full">
                <ProductCard product={p} sizes="(min-width: 1024px) 33vw, 50vw" />
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
