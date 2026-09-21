import type { ProductDetail, ProductImage } from "@/db/schema";

/** Product as served to pages (no timestamps, so it survives JSON caching intact). */
export type CatalogProduct = {
  id: string;
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
  isActive: boolean;
  inStock: boolean;
  sortOrder: number;
};

/** What the cart needs to render a line without another round trip. */
export type CartCatalogItem = {
  id: string;
  slug: string;
  name: string;
  formatLabel: string;
  priceLkr: number | null;
  purchasable: boolean;
  image: { src: string; alt: string } | null;
};

export const rangeLabel = (range: CatalogProduct["range"]) =>
  range === "strong" ? "Strong" : "Premium BOPF";

/** A product can go in the cart only if it has a price and is not business-only. */
export const isPurchasable = (
  p: Pick<CatalogProduct, "priceLkr" | "isBusinessOnly" | "isActive" | "inStock">,
) => p.isActive && !p.isBusinessOnly && p.priceLkr !== null && p.inStock;

export function formatLabel(p: Pick<CatalogProduct, "format" | "unitsPerPack" | "netWeightG">) {
  if (p.format === "loose") return `Loose tea · ${p.netWeightG} g`;
  return `${p.unitsPerPack ?? ""} tea bags · ${p.netWeightG} g`.trim();
}

/** Shop filter value for a product's format. */
export function shopFormat(p: Pick<CatalogProduct, "format" | "isBusinessOnly">) {
  if (p.isBusinessOnly) return "catering" as const;
  return p.format === "loose" ? ("loose" as const) : ("tea-bags" as const);
}

export function toCartItem(p: CatalogProduct): CartCatalogItem {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    formatLabel: formatLabel(p),
    priceLkr: p.priceLkr,
    purchasable: isPurchasable(p),
    image: p.images[0] ? { src: p.images[0].src, alt: p.images[0].alt } : null,
  };
}

export function productHref(slug: string) {
  return `/shop/${slug}`;
}
