import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AdminPageTitle, Notice, StatusBadge, TableWrap, td, th } from "@/components/admin/parts";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/ui";
import { buttonStyles } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";
import { listAdminProducts } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/session";
import { formatLkr } from "@/lib/format";
import { formatLabel, rangeLabel } from "@/lib/product-utils";
import { deleteProduct, setProductFlag } from "./actions";

export const metadata = { title: "Products" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminProductsPage({ searchParams }: PageProps<"/admin/products">) {
  await requireAdmin();
  const sp = await searchParams;
  const q = first(sp.q);
  const rows = await listAdminProducts(q);

  return (
    <>
      <AdminPageTitle
        title="Products"
        description="Everything customers can see in the shop. Changes appear on the website straight away."
        actions={
          <Link href="/admin/products/new" className={buttonStyles({ size: "sm" })}>
            <Plus aria-hidden className="size-4" /> Add product
          </Link>
        }
      />
      {sp.saved && <Notice>Product saved.</Notice>}
      {sp.deleted && <Notice>Product deleted.</Notice>}
      {sp.error === "in-use" && (
        <Notice tone="error">
          That product appears on existing orders, so it can&apos;t be deleted. Hide it from the
          store instead.
        </Notice>
      )}

      <form className="mb-6 flex gap-2" role="search">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search products"
          aria-label="Search products"
          className={inputClass}
        />
        <button type="submit" className={buttonStyles({ size: "sm" })}>
          Search
        </button>
      </form>

      <TableWrap>
        <table className="w-full min-w-[54rem]">
          <thead className="border-line border-b">
            <tr>
              <th className={th}>Product</th>
              <th className={th}>Range · format</th>
              <th className={`${th} text-right`}>Price</th>
              <th className={th}>Stock</th>
              <th className={th}>Store</th>
              <th className={`${th} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {rows.map((p) => {
              const img = p.images[0];
              return (
                <tr key={p.id}>
                  <td className={td}>
                    <div className="flex items-center gap-3">
                      <div className="bg-surface relative size-12 shrink-0 overflow-hidden rounded-lg">
                        {img && (
                          <Image
                            src={img.src}
                            alt=""
                            fill
                            unoptimized
                            sizes="48px"
                            className="object-contain"
                          />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="text-heading font-medium underline underline-offset-4"
                        >
                          {p.name}
                        </Link>
                        <span className="text-muted block text-xs">/{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className={td}>
                    {rangeLabel(p.range)}
                    <span className="text-muted block text-xs">{formatLabel(p)}</span>
                  </td>
                  <td className={`${td} text-right font-medium whitespace-nowrap`}>
                    {p.priceLkr !== null ? (
                      formatLkr(p.priceLkr)
                    ) : (
                      <span className="text-muted">Quote</span>
                    )}
                  </td>
                  <td className={td}>
                    <form action={setProductFlag}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="flag" value="inStock" />
                      <input type="hidden" name="value" value={String(!p.inStock)} />
                      <SubmitButton
                        variant="secondary"
                        title="Toggle stock"
                        className="whitespace-nowrap"
                      >
                        {p.inStock ? "In stock" : "Out of stock"}
                      </SubmitButton>
                    </form>
                  </td>
                  <td className={td}>
                    <form action={setProductFlag}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="flag" value="isActive" />
                      <input type="hidden" name="value" value={String(!p.isActive)} />
                      <button type="submit" title="Toggle visibility" className="rounded-full">
                        <StatusBadge
                          value={p.isActive ? "active" : "hidden"}
                          label={p.isActive ? "Visible" : "Hidden"}
                        />
                      </button>
                    </form>
                  </td>
                  <td className={`${td} text-right`}>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className={buttonStyles({ variant: "secondary", size: "sm" })}
                      >
                        Edit
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <ConfirmSubmit
                          message={`Delete “${p.name}” permanently? This also deletes its uploaded images.`}
                        >
                          Delete
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableWrap>
      {rows.length === 0 && <p className="text-muted mt-6 text-center">No products match.</p>}
    </>
  );
}
