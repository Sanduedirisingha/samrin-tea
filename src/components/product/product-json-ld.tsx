import { JsonLd } from "@/components/seo/json-ld";
import { lkrDecimal } from "@/lib/format";
import { isPurchasable, type CatalogProduct } from "@/lib/product-utils";
import { siteConfig } from "@/lib/site-config";

export function ProductJsonLd({ product }: { product: CatalogProduct }) {
  const url = `${siteConfig.url}/shop/${product.slug}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.slug,
    url,
    image: product.images.map((i) => `${siteConfig.url}${i.src}`),
    brand: { "@type": "Brand", name: siteConfig.name },
    category: "Black tea",
  };
  // Only priced, orderable items get an Offer; the catering pack is quote-only.
  if (product.priceLkr !== null && !product.isBusinessOnly) {
    data.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "LKR",
      price: lkrDecimal(product.priceLkr),
      availability: isPurchasable(product)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    };
  }
  return <JsonLd data={data} />;
}
