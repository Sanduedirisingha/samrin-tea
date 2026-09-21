import Link from "next/link";
import { cn } from "@/lib/cn";

/** Prev / next links that keep the other query parameters. */
export function Pagination({
  basePath,
  params,
  page,
  pages,
}: {
  basePath: string;
  params: Record<string, string | undefined>;
  page: number;
  pages: number;
}) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };
  const link =
    "inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-medium";
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3">
      <Link
        href={href(page - 1)}
        aria-disabled={page <= 1}
        className={cn(link, page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-surface-3")}
      >
        ← Previous
      </Link>
      <span className="text-muted text-sm">
        Page {page} of {pages}
      </span>
      <Link
        href={href(page + 1)}
        aria-disabled={page >= pages}
        className={cn(
          link,
          page >= pages ? "pointer-events-none opacity-40" : "hover:bg-surface-3",
        )}
      >
        Next →
      </Link>
    </nav>
  );
}
