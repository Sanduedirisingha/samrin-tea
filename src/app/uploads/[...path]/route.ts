import { readFile } from "node:fs/promises";
import path from "node:path";
import { uploadRoot } from "@/lib/admin/storage";

export const runtime = "nodejs";

/**
 * Serves images saved by the admin upload (./uploads/products/<uuid>.webp). Only that exact
 * shape is served, so no other file on disk can be reached through this route. Filenames are
 * random and never reused, so responses are cached forever.
 */
export async function GET(_request: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path: segments } = await ctx.params;
  if (
    segments.length !== 2 ||
    segments[0] !== "products" ||
    !/^[0-9a-f-]{36}\.webp$/.test(segments[1])
  ) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const file = await readFile(path.join(uploadRoot(), "products", segments[1]));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
