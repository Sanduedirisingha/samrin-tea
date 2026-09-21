import { cn } from "@/lib/cn";

/** Decorative curved gold lines (a restrained echo of the pack artwork). */
export function GoldCurves({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 600"
      preserveAspectRatio="none"
      fill="none"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <path
        d="M-20 430 C 260 300 500 580 780 430 S 1120 260 1240 340"
        stroke="#C9A43B"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        opacity=".7"
      />
      <path
        d="M-20 480 C 280 360 520 620 800 480 S 1140 320 1240 390"
        stroke="#C9A43B"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        opacity=".4"
      />
    </svg>
  );
}
