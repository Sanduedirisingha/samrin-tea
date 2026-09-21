"use client";

import { ExternalLink, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { saveProduct, type ProductFormState } from "@/app/admin/(panel)/products/actions";
import { ImageManager } from "@/components/admin/image-manager";
import { AdminCard, Notice } from "@/components/admin/parts";
import { SubmitButton } from "@/components/admin/ui";
import { Field, inputClass } from "@/components/ui/field";
import type { ProductDetail, ProductImage } from "@/db/schema";
import { slugify } from "@/lib/validators/product-admin";

export type ProductFormInitial = {
  id?: string;
  name: string;
  slug: string;
  range: "strong" | "bopf";
  format: "loose" | "tea_bags";
  packLabel: string;
  netWeightG: string;
  unitsPerPack: string;
  tagline: string;
  shortDescription: string;
  description: string;
  chooseThisIf: string;
  priceRs: string;
  sortOrder: string;
  isBusinessOnly: boolean;
  isActive: boolean;
  inStock: boolean;
  details: ProductDetail[];
  images: ProductImage[];
};

const check = "size-5 rounded border-line accent-[var(--color-btn)]";

export function ProductForm({ initial }: { initial: ProductFormInitial }) {
  const [state, action] = useActionState<ProductFormState, FormData>(saveProduct, {
    status: "idle",
  });
  const [images, setImages] = useState(initial.images);
  const [details, setDetails] = useState(initial.details);
  const [businessOnly, setBusinessOnly] = useState(initial.isBusinessOnly);
  const slugRef = useRef<HTMLInputElement>(null);
  const slugTouched = useRef(Boolean(initial.id));

  const err = state.fieldErrors ?? {};
  const v = (name: keyof ProductFormInitial & string) =>
    state.values?.[name] ?? String(initial[name as keyof ProductFormInitial] ?? "");

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_20rem]">
      {initial.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="details" value={JSON.stringify(details)} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <div className="space-y-6">
        {state.status === "error" && state.message && <Notice tone="error">{state.message}</Notice>}

        <AdminCard title="Product">
          <div className="space-y-5">
            <Field label="Product name" name="name" error={err.name} required>
              {(p) => (
                <input
                  {...p}
                  defaultValue={v("name")}
                  className={inputClass}
                  onChange={(e) => {
                    if (!slugTouched.current && slugRef.current)
                      slugRef.current.value = slugify(e.target.value);
                  }}
                />
              )}
            </Field>
            <Field
              label="Slug (web address)"
              name="slug"
              error={err.slug}
              hint="Used in the product URL: /shop/your-slug. Changing it later breaks old links."
              required
            >
              {(p) => (
                <input
                  {...p}
                  ref={slugRef}
                  defaultValue={v("slug")}
                  onChange={() => (slugTouched.current = true)}
                  className={inputClass}
                />
              )}
            </Field>
            <Field
              label="Tagline"
              name="tagline"
              error={err.tagline}
              hint="e.g. Rich and Bold"
              required
            >
              {(p) => <input {...p} defaultValue={v("tagline")} className={inputClass} />}
            </Field>
            <Field
              label="Short description"
              name="shortDescription"
              error={err.shortDescription}
              hint="Shown under the price on the product page and on cards."
              required
            >
              {(p) => (
                <textarea
                  {...p}
                  rows={3}
                  defaultValue={v("shortDescription")}
                  className={inputClass}
                />
              )}
            </Field>
            <Field label="Detailed description" name="description" error={err.description} required>
              {(p) => (
                <textarea {...p} rows={5} defaultValue={v("description")} className={inputClass} />
              )}
            </Field>
            <Field
              label="“Choose this if…” line"
              name="chooseThisIf"
              error={err.chooseThisIf}
              hint="The highlighted callout on the product page."
              required
            >
              {(p) => (
                <textarea {...p} rows={2} defaultValue={v("chooseThisIf")} className={inputClass} />
              )}
            </Field>
          </div>
        </AdminCard>

        <AdminCard title="Pack and pricing">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Range" name="range" error={err.range} required>
              {(p) => (
                <select {...p} defaultValue={v("range")} className={inputClass}>
                  <option value="strong">Strong</option>
                  <option value="bopf">Premium BOPF</option>
                </select>
              )}
            </Field>
            <Field label="Format" name="format" error={err.format} required>
              {(p) => (
                <select {...p} defaultValue={v("format")} className={inputClass}>
                  <option value="loose">Loose tea</option>
                  <option value="tea_bags">Tea bags</option>
                </select>
              )}
            </Field>
            <Field
              label="Pack label"
              name="packLabel"
              error={err.packLabel}
              hint="e.g. 100 g loose tea"
              required
            >
              {(p) => <input {...p} defaultValue={v("packLabel")} className={inputClass} />}
            </Field>
            <Field label="Net weight (g)" name="netWeightG" error={err.netWeightG} required>
              {(p) => (
                <input
                  {...p}
                  inputMode="numeric"
                  defaultValue={v("netWeightG")}
                  className={inputClass}
                />
              )}
            </Field>
            <Field
              label="Units per pack"
              name="unitsPerPack"
              error={err.unitsPerPack}
              hint="Tea bags per box. Leave empty for loose tea."
              optional
            >
              {(p) => (
                <input
                  {...p}
                  inputMode="numeric"
                  defaultValue={v("unitsPerPack")}
                  className={inputClass}
                />
              )}
            </Field>
            <Field
              label="Price (LKR)"
              name="priceRs"
              error={err.priceRs}
              hint={businessOnly ? "Optional for quote-only products." : "e.g. 320 or 320.00"}
              optional={businessOnly}
              required={!businessOnly}
            >
              {(p) => (
                <input
                  {...p}
                  inputMode="decimal"
                  defaultValue={v("priceRs")}
                  className={inputClass}
                />
              )}
            </Field>
          </div>
          <label className="mt-5 flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              name="isBusinessOnly"
              checked={businessOnly}
              onChange={(e) => setBusinessOnly(e.target.checked)}
              className={`${check} mt-0.5`}
            />
            <span>
              <span className="font-medium">Business quote only</span>
              <span className="text-muted block">
                No cart button. The page shows “Request business pricing” instead.
              </span>
            </span>
          </label>
        </AdminCard>

        <AdminCard
          title="Product details"
          actions={
            <button
              type="button"
              onClick={() => setDetails([...details, { label: "", value: "" }])}
              disabled={details.length >= 20}
              className="border-line hover:bg-surface-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-sm font-medium disabled:opacity-40"
            >
              <Plus aria-hidden className="size-4" /> Add row
            </button>
          }
        >
          {details.length === 0 && (
            <p className="text-muted text-sm">
              Rows shown in the “Product details” table, e.g. Pack, Tea, Origin, Source.
            </p>
          )}
          {err.details && <p className="text-error mb-2 text-sm">{err.details}</p>}
          <ul className="space-y-3">
            {details.map((row, i) => (
              <li key={i} className="grid grid-cols-[1fr_1.6fr_auto] items-center gap-2">
                <input
                  aria-label={`Detail ${i + 1} label`}
                  placeholder="Label"
                  value={row.label}
                  maxLength={80}
                  onChange={(e) =>
                    setDetails(
                      details.map((r, j) => (j === i ? { ...r, label: e.target.value } : r)),
                    )
                  }
                  className={inputClass}
                />
                <input
                  aria-label={`Detail ${i + 1} value`}
                  placeholder="Value"
                  value={row.value}
                  maxLength={300}
                  onChange={(e) =>
                    setDetails(
                      details.map((r, j) => (j === i ? { ...r, value: e.target.value } : r)),
                    )
                  }
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setDetails(details.filter((_, j) => j !== i))}
                  aria-label={`Remove detail ${i + 1}`}
                  className="text-error hover:bg-error/10 grid size-10 place-items-center rounded-full"
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </AdminCard>

        <AdminCard title="Product images">
          {err.images && <p className="text-error mb-2 text-sm">{err.images}</p>}
          <ImageManager images={images} onChange={setImages} />
        </AdminCard>
      </div>

      <aside className="space-y-6 xl:sticky xl:top-24 xl:self-start">
        <AdminCard title="Publish">
          <div className="space-y-4 text-sm">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={initial.isActive}
                className={`${check} mt-0.5`}
              />
              <span>
                <span className="font-medium">Visible on the store</span>
                <span className="text-muted block">Untick to hide it without deleting.</span>
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="inStock"
                defaultChecked={initial.inStock}
                className={`${check} mt-0.5`}
              />
              <span>
                <span className="font-medium">In stock</span>
                <span className="text-muted block">
                  Out-of-stock products can&apos;t be ordered.
                </span>
              </span>
            </label>
            <Field
              label="Sort order"
              name="sortOrder"
              error={err.sortOrder}
              hint="Lower numbers appear first."
              required
            >
              {(p) => (
                <input
                  {...p}
                  inputMode="numeric"
                  defaultValue={v("sortOrder")}
                  className={inputClass}
                />
              )}
            </Field>
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <SubmitButton size="md">{initial.id ? "Save changes" : "Create product"}</SubmitButton>
            <Link
              href="/admin/products"
              className="text-muted text-center text-sm underline underline-offset-4"
            >
              Cancel
            </Link>
            {initial.id && (
              <Link
                href={`/shop/${initial.slug}`}
                target="_blank"
                className="text-heading inline-flex items-center justify-center gap-2 text-sm underline underline-offset-4"
              >
                View on store <ExternalLink aria-hidden className="size-3.5" />
              </Link>
            )}
          </div>
        </AdminCard>
      </aside>
    </form>
  );
}
