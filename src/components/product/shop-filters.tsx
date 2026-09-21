import Link from "next/link";
import { cn } from "@/lib/cn";
import type { ShopQuery } from "@/lib/shop-query";
import { buildShopHref, FORMAT_OPTIONS, RANGE_OPTIONS, SORT_OPTIONS } from "@/lib/shop-query";

function Chip({ href, active, children }: { href: string; active: boolean; children: string }) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cn(
        "inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-forest bg-forest text-ivory"
          : "border-line bg-ivory text-forest hover:border-forest",
      )}
    >
      {children}
    </Link>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="text-muted mr-1 w-full text-xs font-semibold tracking-[0.16em] uppercase sm:w-auto">
        {label}
      </span>
      {children}
    </div>
  );
}

/** URL-driven filters: plain links, so they work without JS and are server-rendered. */
export function ShopFilters({ query }: { query: ShopQuery }) {
  return (
    <nav aria-label="Filter and sort products" className="space-y-5">
      <Group label="Range">
        {RANGE_OPTIONS.map((o) => (
          <Chip
            key={o.value ?? "all"}
            href={buildShopHref(query, { range: o.value })}
            active={query.range === o.value}
          >
            {o.label}
          </Chip>
        ))}
      </Group>
      <Group label="Format">
        {FORMAT_OPTIONS.map((o) => (
          <Chip
            key={o.value ?? "all"}
            href={buildShopHref(query, { format: o.value })}
            active={query.format === o.value}
          >
            {o.label}
          </Chip>
        ))}
      </Group>
      <Group label="Sort">
        {SORT_OPTIONS.map((o) => (
          <Chip
            key={o.value}
            href={buildShopHref(query, { sort: o.value === "featured" ? null : o.value })}
            active={query.sort === o.value}
          >
            {o.label}
          </Chip>
        ))}
      </Group>
    </nav>
  );
}
