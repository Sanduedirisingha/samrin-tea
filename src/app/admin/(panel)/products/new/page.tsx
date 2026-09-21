import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AdminPageTitle } from "@/components/admin/parts";
import { ProductForm, type ProductFormInitial } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin/session";

export const metadata = { title: "Add product" };

const blank: ProductFormInitial = {
  name: "",
  slug: "",
  range: "strong",
  format: "loose",
  packLabel: "",
  netWeightG: "",
  unitsPerPack: "",
  tagline: "",
  shortDescription: "",
  description: "",
  chooseThisIf: "",
  priceRs: "",
  sortOrder: "100",
  isBusinessOnly: false,
  isActive: true,
  inStock: true,
  details: [
    { label: "Pack", value: "" },
    { label: "Tea", value: "" },
    { label: "Origin", value: "Ruhuna, Sri Lanka" },
    { label: "Source", value: "" },
  ],
  images: [],
};

export default async function NewProductPage() {
  await requireAdmin();
  return (
    <>
      <Link
        href="/admin/products"
        className="text-muted mb-4 inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" /> All products
      </Link>
      <AdminPageTitle title="Add product" />
      <ProductForm initial={blank} />
    </>
  );
}
