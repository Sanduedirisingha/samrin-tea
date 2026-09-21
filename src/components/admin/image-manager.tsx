"use client";

import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/db/schema";
import { inputClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";

const MAX_IMAGES = 10;
const MAX_BYTES = 6 * 1024 * 1024;

/**
 * Upload, reorder, describe and remove product images. The first image is the main one shown
 * on cards and the product page. Files are uploaded immediately to /api/admin/upload.
 */
export function ImageManager({
  images,
  onChange,
}: {
  images: ProductImage[];
  onChange: (next: ProductImage[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  // Uploads finish out of order; always merge into the latest list.
  const latest = useRef(images);
  useEffect(() => {
    latest.current = images;
  }, [images]);

  async function upload(files: File[]) {
    const room = MAX_IMAGES - latest.current.length;
    const chosen = files.slice(0, Math.max(0, room));
    const problems: string[] = [];
    if (files.length > chosen.length) problems.push(`You can add up to ${MAX_IMAGES} images.`);
    setBusy((n) => n + chosen.length);
    await Promise.all(
      chosen.map(async (file) => {
        try {
          if (file.size > MAX_BYTES)
            throw new Error(`${file.name}: images must be 6 MB or smaller.`);
          if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
            throw new Error(`${file.name}: only JPG, PNG or WebP images are allowed.`);
          }
          const body = new FormData();
          body.append("file", file);
          const res = await fetch("/api/admin/upload", { method: "POST", body });
          const data = (await res.json()) as {
            src?: string;
            width?: number;
            height?: number;
            error?: string;
          };
          if (!res.ok || !data.src || !data.width || !data.height) {
            throw new Error(`${file.name}: ${data.error ?? "upload failed."}`);
          }
          const next = [
            ...latest.current,
            { src: data.src, alt: "", width: data.width, height: data.height },
          ];
          latest.current = next;
          onChange(next);
        } catch (e) {
          problems.push(e instanceof Error ? e.message : "Upload failed.");
        } finally {
          setBusy((n) => n - 1);
        }
      }),
    );
    setErrors(problems);
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    [next[from], next[to]] = [next[to], next[from]];
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload([...e.dataTransfer.files]);
        }}
        className={cn(
          "border-line rounded-xl border-2 border-dashed p-6 text-center transition-colors",
          dragging && "border-gold bg-gold/5",
        )}
      >
        <ImagePlus aria-hidden className="text-muted mx-auto size-8" strokeWidth={1.4} />
        <p className="mt-2 text-sm">
          Drag images here or{" "}
          <button
            type="button"
            onClick={() => input.current?.click()}
            className="text-heading font-medium underline underline-offset-4"
          >
            choose files
          </button>
        </p>
        <p className="text-muted mt-1 text-xs">
          JPG, PNG or WebP · up to 6 MB each · resized and optimised automatically
        </p>
        <input
          ref={input}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="sr-only"
          aria-label="Upload product images"
          onChange={(e) => {
            void upload([...(e.target.files ?? [])]);
            e.target.value = "";
          }}
        />
      </div>

      <div aria-live="polite">
        {busy > 0 && (
          <p className="text-muted mt-3 flex items-center gap-2 text-sm">
            <Loader2 aria-hidden className="size-4 animate-spin" /> Uploading {busy} image
            {busy > 1 ? "s" : ""}…
          </p>
        )}
        {errors.map((msg) => (
          <p key={msg} role="alert" className="text-error mt-2 text-sm font-medium">
            {msg}
          </p>
        ))}
      </div>

      {images.length > 0 && (
        <ul className="mt-5 space-y-3">
          {images.map((img, i) => (
            <li key={img.src} className="border-line bg-surface flex gap-4 rounded-xl border p-3">
              <div className="bg-surface-2 relative size-24 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={img.src}
                  alt=""
                  fill
                  unoptimized
                  sizes="96px"
                  className="object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {i === 0 && (
                    <span className="bg-btn text-btn-ink rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      Main image
                    </span>
                  )}
                  <span className="text-muted text-xs">
                    {img.width} × {img.height}
                  </span>
                </div>
                <label className="mt-2 block text-xs font-medium">
                  Alt text
                  <input
                    value={img.alt}
                    onChange={(e) =>
                      onChange(images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))
                    }
                    placeholder="Describe the image (defaults to the product name)"
                    maxLength={200}
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  aria-label="Move image up"
                  className="hover:bg-surface-3 grid size-9 place-items-center rounded-full disabled:opacity-30"
                >
                  <ArrowUp aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === images.length - 1}
                  aria-label="Move image down"
                  className="hover:bg-surface-3 grid size-9 place-items-center rounded-full disabled:opacity-30"
                >
                  <ArrowDown aria-hidden className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, j) => j !== i))}
                  aria-label="Remove image"
                  className="text-error hover:bg-error/10 grid size-9 place-items-center rounded-full"
                >
                  <Trash2 aria-hidden className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
