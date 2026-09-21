import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminPageTitle } from "@/components/admin/parts";
import { ProductForm, type ProductFormInitial } from "@/components/admin/product-form";
import { getAdminProduct } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/session";

export const metadata = { title: "Edit product" };

export default async function EditProductPage({ params }: PageProps<"/admin/products/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const p = await getAdminProduct(id);
  if (!p) notFound();

  const initial: ProductFormInitial = {
    id: p.id,
    name: p.name,
    slug: p.slug,
    range: p.range,
    format: p.format,
    packLabel: p.packLabel,
    netWeightG: String(p.netWeightG),
    unitsPerPack: p.unitsPerPack === null ? "" : String(p.unitsPerPack),
    tagline: p.tagline,
    shortDescription: p.shortDescription,
    description: p.description,
    chooseThisIf: p.chooseThisIf,
    priceRs: p.priceLkr === null ? "" : (p.priceLkr / 100).toFixed(2),
    sortOrder: String(p.sortOrder),
    isBusinessOnly: p.isBusinessOnly,
    isActive: p.isActive,
    inStock: p.inStock,
    details: p.details,
    images: p.images,
  };

  return (
    <>
      <Link
        href="/admin/products"
        className="text-muted mb-4 inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" /> All products
      </Link>
      <AdminPageTitle title={p.name} description={`/${p.slug}`} />
      <ProductForm key={p.id} initial={initial} />
    </>
  );
}
