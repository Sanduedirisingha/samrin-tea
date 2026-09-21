import type { ProductDetail, ProductImage } from "./schema";

/**
 * Product copy is taken verbatim from "Samrin_Product Description.docx".
 * Prices are the client's working prices in minor units (Rs. 320.00 → 32000) and are
 * editable in the database (`npm run db:studio`).
 */
export type SeedProduct = {
  slug: string;
  name: string;
  range: "strong" | "bopf";
  format: "loose" | "tea_bags";
  packLabel: string;
  netWeightG: number;
  unitsPerPack: number | null;
  tagline: string;
  shortDescription: string;
  description: string;
  chooseThisIf: string;
  details: ProductDetail[];
  images: ProductImage[];
  priceLkr: number | null;
  isBusinessOnly: boolean;
  sortOrder: number;
};

const image = (slug: string, alt: string): ProductImage[] => [
  { src: `/images/products/${slug}.webp`, alt, width: 800, height: 1000 },
];

const looseSource = "Unblended tea from Samrin Tea Factory";
const bagSource = "Samrin factory tea, tea-bagged at a nearby specialist facility";

export const seedProducts: SeedProduct[] = [
  {
    slug: "samrin-strong-100g",
    name: "Samrin Strong — 100 g",
    range: "strong",
    format: "loose",
    packLabel: "100 g loose tea",
    netWeightG: 100,
    unitsPerPack: null,
    tagline: "Rich and Bold",
    shortDescription:
      "A darker, bolder Ruhuna tea for a deeply coloured, full-bodied cup. Its robust character carries well through milk and also suits drinkers who enjoy their plain tea strong.",
    description:
      "Samrin Strong is made for people who want their tea unmistakably strong. Because it is loose tea, you can adjust the amount for your cup or pot. Use a little more when you want a deeper, more forceful brew, or brew it for less time when you prefer a lighter cup.",
    chooseThisIf: "You want the darker, bolder option, especially for milk tea.",
    // NOTE: the summary table in the product doc says "Pure Ceylon black tea" for this pack;
    // the product page says "BOPF pure Ceylon black tea". Page wording is used (see OPEN_ITEMS.md).
    details: [
      { label: "Pack", value: "100 g loose tea" },
      { label: "Tea", value: "BOPF pure Ceylon black tea" },
      { label: "Origin", value: "Ruhuna, Sri Lanka" },
      { label: "Source", value: looseSource },
    ],
    images: image("samrin-strong-100g", "Samrin Strong 100 g loose tea pack"),
    priceLkr: 32000,
    isBusinessOnly: false,
    sortOrder: 10,
  },
  {
    slug: "samrin-premium-bopf-100g",
    name: "Samrin Premium BOPF — 100 g",
    range: "bopf",
    format: "loose",
    packLabel: "100 g loose tea",
    netWeightG: 100,
    unitsPerPack: null,
    tagline: "Bright and Full Bodied",
    shortDescription:
      "A bright, lively and full-bodied Ruhuna BOPF with a more noticeable tea flavour. It is especially enjoyable plain and still has enough strength for milk.",
    description:
      "Samrin Premium BOPF offers a different style of strength from Samrin Strong. The cup is bright and lively, with a clearer tea flavour. BOPF is a fine black-tea grade that infuses readily. The loose format also lets you adjust the amount and brewing time, whether you make one cup or a pot.",
    chooseThisIf:
      "You want a strong, bright cup with a more noticeable tea flavour, especially when drinking it plain.",
    details: [
      { label: "Pack", value: "100 g loose tea" },
      { label: "Tea", value: "BOPF pure Ceylon black tea" },
      { label: "Origin", value: "Ruhuna, Sri Lanka" },
      { label: "Source", value: looseSource },
    ],
    images: image("samrin-premium-bopf-100g", "Samrin Premium BOPF 100 g loose tea pack"),
    priceLkr: 36000,
    isBusinessOnly: false,
    sortOrder: 20,
  },
  {
    slug: "samrin-strong-25-tea-bags",
    name: "Samrin Strong — 25 Tea Bags",
    range: "strong",
    format: "tea_bags",
    packLabel: "25 tea bags x 1.8 g",
    netWeightG: 45,
    unitsPerPack: 25,
    tagline: "Rich and Bold, Simply Brewed",
    shortDescription:
      "A darker, bolder Ruhuna cup in a convenient tea bag. Its robust character carries well through milk, with no loose-tea measuring or straining.",
    description:
      "Samrin Strong Tea Bags bring the bold character of Samrin Strong to an easy individual serving. Each bag contains 1.8 g of tea, so preparation is simple and there is no loose tea to measure or strain. The 25-bag pack is a practical choice for tea breaks at home or at work.",
    chooseThisIf: "You want a bold cup that suits milk, with the convenience of a tea bag.",
    details: [
      { label: "Pack", value: "25 tea bags x 1.8 g" },
      { label: "Net weight", value: "45 g" },
      { label: "Tea", value: "Pure Ceylon black tea" },
      { label: "Source", value: bagSource },
    ],
    images: image("samrin-strong-25-tea-bags", "Samrin Strong 25 tea bags box"),
    priceLkr: 33000,
    isBusinessOnly: false,
    sortOrder: 30,
  },
  {
    slug: "samrin-premium-bopf-25-tea-bags",
    name: "Samrin Premium BOPF — 25 Tea Bags",
    range: "bopf",
    format: "tea_bags",
    packLabel: "25 tea bags x 1.8 g",
    netWeightG: 45,
    unitsPerPack: 25,
    tagline: "Bright and Full Bodied, Simply Brewed",
    shortDescription:
      "A bright, lively and full-bodied Ruhuna BOPF in a convenient tea bag. Enjoy its more noticeable tea flavour plain, or add milk if you prefer.",
    description:
      "Samrin Premium BOPF Tea Bags give you a bright, characterful cup without loose-tea preparation. Each bag contains 1.8 g of BOPF black tea that infuses readily. The 25-bag pack is a convenient choice for people who enjoy a livelier tea flavour at home or at work.",
    chooseThisIf:
      "You want a brighter tea flavour in a convenient tea bag, especially for drinking plain.",
    details: [
      { label: "Pack", value: "25 tea bags x 1.8 g" },
      { label: "Net weight", value: "45 g" },
      { label: "Tea", value: "BOPF pure Ceylon black tea" },
      { label: "Source", value: bagSource },
    ],
    images: image("samrin-premium-bopf-25-tea-bags", "Samrin Premium BOPF 25 tea bags box"),
    priceLkr: 41000,
    isBusinessOnly: false,
    sortOrder: 40,
  },
  {
    slug: "samrin-strong-100-tea-bags",
    name: "Samrin Strong — 100 Tea Bags (Catering Pack)",
    range: "strong",
    format: "tea_bags",
    packLabel: "100 tea bags x 1.8 g",
    netWeightG: 180,
    unitsPerPack: 100,
    tagline: "Catering Pack for Frequent Service",
    shortDescription:
      "A practical pack for offices, shops, restaurants and cafes that need a bold Ruhuna cup suited to milk, with simple and measured preparation.",
    description:
      "Samrin Strong Catering Pack is designed for places that serve tea throughout the day. Each 1.8 g tea bag gives staff a measured amount of tea and removes the need to portion loose tea. Using the same cup size and brewing time helps keep the cup more consistent. Its deep colour and bold character make it especially suitable for milk tea. Ask us about regular supply and business pricing.",
    chooseThisIf:
      "You serve tea regularly and want easy portioning, simple preparation and a bold cup that works well with milk.",
    details: [
      { label: "Pack", value: "100 tea bags x 1.8 g" },
      { label: "Net weight", value: "180 g" },
      { label: "Tea", value: "Pure Ceylon black tea" },
      { label: "Source", value: bagSource },
    ],
    images: image("samrin-strong-100-tea-bags", "Samrin Strong 100 tea bags catering pack"),
    priceLkr: null,
    isBusinessOnly: true,
    sortOrder: 50,
  },
];
