import type { MetadataRoute } from "next";
import { getCatalog } from "@/lib/data/products";
import { siteConfig } from "@/lib/site-config";

const staticRoutes = ["/", "/shop", "/about", "/contact", "/privacy-policy"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog();
  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path === "/" ? "" : path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...products.map((p) => ({
      url: `${siteConfig.url}/shop/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
