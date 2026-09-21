import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getServerEnv } from "@/lib/env";

/**
 * Product image storage. Today: a local folder (git-ignored) served by /uploads/[...path].
 * To move to cloud storage (S3, Cloudinary, Vercel Blob) replace `saveProductImage` and
 * `removeUploadedImage`; the rest of the admin only deals in the returned `src` URL.
 */
export const UPLOAD_URL_PREFIX = "/uploads/products/";
export const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;
const ALLOWED_FORMATS = new Set(["jpeg", "png", "webp"]);

export const uploadRoot = () =>
  path.resolve(/* turbopackIgnore: true */ process.cwd(), getServerEnv().UPLOAD_DIR ?? "uploads");

export class ImageUploadError extends Error {}

/** Validates the bytes really are a JPEG/PNG/WebP, then re-encodes to a resized WebP (metadata stripped). */
export async function saveProductImage(
  input: Buffer,
): Promise<{ src: string; width: number; height: number }> {
  if (input.length === 0) throw new ImageUploadError("The file is empty.");
  if (input.length > MAX_UPLOAD_BYTES)
    throw new ImageUploadError("Images must be 6 MB or smaller.");

  let format: string | undefined;
  try {
    format = (await sharp(input, { limitInputPixels: 40_000_000 }).metadata()).format;
  } catch {
    throw new ImageUploadError("That file isn't a valid image.");
  }
  if (!format || !ALLOWED_FORMATS.has(format)) {
    throw new ImageUploadError("Only JPG, PNG or WebP images are allowed.");
  }

  const { data, info } = await sharp(input, { limitInputPixels: 40_000_000 })
    .rotate() // honour EXIF orientation, then EXIF is dropped on output
    .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });

  const name = `${randomUUID()}.webp`;
  const dir = path.join(uploadRoot(), "products");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), data);
  return { src: `${UPLOAD_URL_PREFIX}${name}`, width: info.width, height: info.height };
}

/** Deletes a file previously saved by `saveProductImage`. Ignores anything else (e.g. /images/…). */
export async function removeUploadedImage(src: string): Promise<void> {
  if (!src.startsWith(UPLOAD_URL_PREFIX)) return;
  const name = path.basename(src);
  if (!/^[0-9a-f-]{36}\.webp$/.test(name)) return;
  try {
    await unlink(path.join(uploadRoot(), "products", name));
  } catch {
    // already gone
  }
}
