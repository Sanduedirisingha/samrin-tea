import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Ribbon-style plaque with concave corners and a gold hairline, echoing the pack's
 * "Factory Fresh Premium BOPF" badge. Purely decorative shape; text stays real text.
 */
export function PlaqueBadge({
  children,
  tone = "forest",
  className,
}: {
  children: ReactNode;
  tone?: "forest" | "strong" | "cream";
  className?: string;
}) {
  const fill = { forest: "#063D24", strong: "#8F1628", cream: "#FBF8E7" }[tone];
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center px-8 py-2.5 text-center text-[0.8rem] font-semibold tracking-[0.14em] uppercase",
        tone === "cream" ? "text-forest" : "text-ivory",
        className,
      )}
    >
      <svg
        aria-hidden
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d="M5 1 H95 Q95 6 99 6 V34 Q95 34 95 39 H5 Q5 34 1 34 V6 Q5 6 5 1 Z"
          fill={fill}
          stroke="#C9A43B"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}
