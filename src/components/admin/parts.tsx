import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Server-safe presentational pieces shared by the admin pages. */

export function AdminPageTitle({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-heading text-3xl sm:text-4xl">{title}</h1>
        {description && <p className="text-muted mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function AdminCard({
  title,
  children,
  className,
  actions,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  return (
    <section className={cn("border-line bg-surface-2 rounded-2xl border p-5 sm:p-6", className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-heading font-serif text-xl">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="border-line bg-surface-2 rounded-2xl border p-5">
      <p className="text-muted text-xs font-semibold tracking-[0.14em] uppercase">{label}</p>
      <p className="text-heading mt-2 font-serif text-3xl">{value}</p>
      {hint && <p className="text-muted mt-1 text-sm">{hint}</p>}
    </div>
  );
}

const tones: Record<string, string> = {
  pending: "bg-champagne/25 text-gold-ink",
  confirmed: "bg-forest-soft text-heading",
  shipped: "bg-forest-soft text-heading",
  delivered: "bg-success/15 text-success",
  cancelled: "bg-error/10 text-error",
  unpaid: "bg-champagne/25 text-gold-ink",
  paid: "bg-success/15 text-success",
  failed: "bg-error/10 text-error",
  refunded: "bg-surface-3 text-muted",
  new: "bg-champagne/25 text-gold-ink",
  handled: "bg-success/15 text-success",
  active: "bg-success/15 text-success",
  hidden: "bg-surface-3 text-muted",
};

export function StatusBadge({ value, label }: { value: string; label?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        tones[value] ?? "bg-surface-3 text-muted",
      )}
    >
      {label ?? value.replace("_", " ")}
    </span>
  );
}

/** Wrapper that scrolls sideways on small screens instead of squashing tables. */
export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="border-line bg-surface-2 overflow-x-auto rounded-2xl border">{children}</div>
  );
}

export const th =
  "px-4 py-3 text-left text-xs font-semibold tracking-[0.12em] uppercase text-muted";
export const td = "px-4 py-3 align-middle text-sm";

export function formatDate(d: Date | string): string {
  return new Date(d).toLocaleString("en-LK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Notice({
  tone = "success",
  children,
}: {
  tone?: "success" | "error";
  children: ReactNode;
}) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "mb-6 rounded-xl border px-4 py-3 text-sm font-medium",
        tone === "success"
          ? "border-success/40 bg-success/10 text-success"
          : "border-error/40 bg-error/10 text-error",
      )}
    >
      {children}
    </p>
  );
}
