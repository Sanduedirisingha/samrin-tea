import { cn } from "@/lib/cn";
import { rangeLabel } from "@/lib/product-utils";

/** Burgundy identifies the Strong range only; everything else stays green. */
export function VariantChip({
  range,
  onDark,
  className,
}: {
  range: "strong" | "bopf";
  onDark?: boolean;
  className?: string;
}) {
  const tone =
    range === "strong"
      ? onDark
        ? "bg-strong text-ivory"
        : "bg-strong-soft text-strong"
      : onDark
        ? "bg-forest text-ivory ring-1 ring-champagne/50"
        : "bg-forest-soft text-forest";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[0.72rem] font-semibold tracking-[0.12em] uppercase",
        tone,
        className,
      )}
    >
      {rangeLabel(range)}
    </span>
  );
}
