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
        d="M-20 505 C 260 415 500 590 780 505 S 1120 400 1240 455"
        stroke="#C9A43B"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        opacity=".7"
      />
      <path
        d="M-20 550 C 280 460 520 640 800 550 S 1140 450 1240 500"
        stroke="#C9A43B"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        opacity=".4"
      />
    </svg>
  );
}
