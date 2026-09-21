import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { ButtonLink } from "@/components/ui/button";
import { VariantChip } from "@/components/ui/variant-chip";
import { cn } from "@/lib/cn";
import { formatLkr } from "@/lib/format";
import {
  formatLabel,
  isPurchasable,
  productHref,
  toCartItem,
  type CatalogProduct,
} from "@/lib/product-utils";

export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
}: {
  product: CatalogProduct;
  sizes?: string;
  priority?: boolean;
}) {
  const image = product.images[0];
  const purchasable = isPurchasable(product);
  return (
    <article
      className={cn(
        "group border-line bg-ivory shadow-card relative flex w-full flex-col overflow-hidden rounded-2xl border border-t-4 transition-shadow duration-300 hover:shadow-[0_16px_36px_-16px_rgb(4_40_16/0.35)]",
        product.range === "strong" ? "border-t-strong" : "border-t-forest",
      )}
    >
      <div className="bg-ivory relative aspect-[4/5] overflow-hidden">
        {image && (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col items-center gap-1 p-4 text-center sm:p-5">
        <VariantChip range={product.range} />
        <h3 className="text-forest mt-3 flex min-h-[4.75rem] items-center justify-center font-serif text-lg leading-snug sm:min-h-14 sm:text-xl">
          {/* Stretched link: the whole card is clickable, the button stays separate */}
          <Link href={productHref(product.slug)} className="after:absolute after:inset-0">
            {product.name}
          </Link>
        </h3>
        <p className="text-muted text-sm">{formatLabel(product)}</p>

        <div className="mt-auto flex w-full flex-col gap-3 pt-4">
          {product.priceLkr !== null ? (
            <p className="text-deep text-lg font-semibold">{formatLkr(product.priceLkr)}</p>
          ) : (
            <p className="text-deep text-sm font-medium">Business pricing on request</p>
          )}
          <div className="relative z-10">
            {purchasable ? (
              <AddToCartButton item={toCartItem(product)} size="sm" fullWidth />
            ) : product.isBusinessOnly ? (
              <ButtonLink
                href={`/contact?type=business&product=${product.slug}`}
                variant="secondary"
                size="sm"
                fullWidth
              >
                Request business pricing
              </ButtonLink>
            ) : (
              <p className="text-muted min-h-11 py-2.5 text-center text-sm">
                Currently unavailable
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
