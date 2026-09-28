import type { Metadata } from "next";
import { BrewSteps } from "@/components/sections/brew-steps";
import { ChooseYourCup } from "@/components/sections/choose-your-cup";
import { ContactBand } from "@/components/sections/contact-band";
import { FeaturedProducts } from "@/components/sections/featured-products";
import { Hero } from "@/components/sections/hero";
import { MakingPanels } from "@/components/sections/making-panels";
import { Origin } from "@/components/sections/origin";
import { Story } from "@/components/sections/story";
import { getCatalog } from "@/lib/data/products";

export const metadata: Metadata = {
  title: { absolute: "SAMRIN Tea — A cup with backbone. Factory-fresh Ruhuna tea" },
  alternates: { canonical: "/" },
};

export const revalidate = 60;

export default async function HomePage() {
  const products = await getCatalog();
  const strong = products.find((p) => p.slug === "samrin-strong-100g");
  const bopf = products.find((p) => p.slug === "samrin-premium-bopf-100g");

  return (
    <>
      <Hero />
      <Origin />
      <MakingPanels />
      <BrewSteps />
      <ChooseYourCup strong={strong} bopf={bopf} />
      <FeaturedProducts products={products} />
      <Story />
      <ContactBand />
    </>
  );
}
