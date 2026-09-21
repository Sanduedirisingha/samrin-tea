import type { Metadata } from "next";
import { BrewToggle } from "@/components/sections/brew-toggle";
import { BusinessBand } from "@/components/sections/business-band";
import { ChooseYourCup } from "@/components/sections/choose-your-cup";
import { EditorialBlocks } from "@/components/sections/editorial-blocks";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { Hero } from "@/components/sections/hero";
import { TrustStrip } from "@/components/sections/trust-strip";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCatalog } from "@/lib/data/products";

export const metadata: Metadata = {
  title: { absolute: "SAMRIN Tea — Factory-fresh Ruhuna tea, straight from the source" },
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function HomePage() {
  const products = await getCatalog();
  const strong = products.find((p) => p.slug === "samrin-strong-100g");
  const bopf = products.find((p) => p.slug === "samrin-premium-bopf-100g");

  return (
    <>
      <Hero strong={strong} bopf={bopf} />
      <TrustStrip />
      <ChooseYourCup strong={strong} bopf={bopf} />
      <FeaturedProducts products={products} />
      <EditorialBlocks />
      <section aria-labelledby="brew-heading" className="container-page mt-28">
        <SectionHeading
          eyebrow="05 — How to brew"
          title={
            <span id="brew-heading">
              Water meets leaf. <em className="accent">Keep it simple.</em>
            </span>
          }
        />
        <div className="mt-10">
          <BrewToggle />
        </div>
      </section>
      <BusinessBand />
    </>
  );
}
