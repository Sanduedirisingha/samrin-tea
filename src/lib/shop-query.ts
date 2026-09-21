import { shopFormat, type CatalogProduct } from "@/lib/product-utils";

export type RangeFilter = "strong" | "bopf" | null;
export type FormatFilter = "loose" | "tea-bags" | "catering" | null;
export type SortKey = "featured" | "price-asc" | "price-desc" | "name";

export type ShopQuery = { range: RangeFilter; format: FormatFilter; sort: SortKey };

export const RANGE_OPTIONS: { value: RangeFilter; label: string }[] = [
  { value: null, label: "All" },
  { value: "strong", label: "Strong" },
  { value: "bopf", label: "Premium BOPF" },
];

export const FORMAT_OPTIONS: { value: FormatFilter; label: string }[] = [
  { value: null, label: "All" },
  { value: "loose", label: "Loose leaf 100 g" },
  { value: "tea-bags", label: "Tea bags 25" },
  { value: "catering", label: "Catering 100" },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name", label: "Name A–Z" },
];

type RawParams = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Parses searchParams defensively — unknown values fall back to "no filter". */
export function parseShopQuery(raw: RawParams): ShopQuery {
  const range = first(raw.range);
  const format = first(raw.format);
  const sort = first(raw.sort);
  return {
    range: range === "strong" || range === "bopf" ? range : null,
    format: format === "loose" || format === "tea-bags" || format === "catering" ? format : null,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "featured",
  };
}

export function buildShopHref(
  current: ShopQuery,
  patch: Partial<Record<keyof ShopQuery, string | null>>,
) {
  const next = { ...current, ...patch } as Record<keyof ShopQuery, string | null>;
  const params = new URLSearchParams();
  if (next.range) params.set("range", next.range);
  if (next.format) params.set("format", next.format);
  if (next.sort && next.sort !== "featured") params.set("sort", next.sort);
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function applyShopQuery(products: CatalogProduct[], q: ShopQuery): CatalogProduct[] {
  const filtered = products.filter(
    (p) => (!q.range || p.range === q.range) && (!q.format || shopFormat(p) === q.format),
  );
  const byOrder = (a: CatalogProduct, b: CatalogProduct) => a.sortOrder - b.sortOrder;
  // Quote-only items (no price) always sort last for price sorts.
  const price = (p: CatalogProduct, dir: 1 | -1) =>
    p.priceLkr === null ? Number.POSITIVE_INFINITY : p.priceLkr * dir;
  switch (q.sort) {
    case "price-asc":
      return filtered.sort((a, b) => price(a, 1) - price(b, 1) || byOrder(a, b));
    case "price-desc":
      return filtered.sort(
        (a, b) =>
          (a.priceLkr === null ? 1 : 0) - (b.priceLkr === null ? 1 : 0) ||
          price(a, -1) - price(b, -1) ||
          byOrder(a, b),
      );
    case "name":
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return filtered.sort(byOrder);
  }
}

export const hasActiveFilters = (q: ShopQuery) => Boolean(q.range || q.format);
