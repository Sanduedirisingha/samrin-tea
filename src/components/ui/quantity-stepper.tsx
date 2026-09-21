"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  onChange,
  max,
  min = 1,
  label = "Quantity",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  max: number;
  min?: number;
  label?: string;
  className?: string;
}) {
  const set = (n: number) => onChange(Math.min(Math.max(n, min), max));
  const btn =
    "grid size-11 place-items-center text-forest transition-colors hover:bg-sand disabled:cursor-not-allowed disabled:text-muted/40 disabled:hover:bg-transparent";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("border-line bg-ivory inline-flex items-center rounded-full border", className)}
    >
      <button
        type="button"
        className={cn(btn, "rounded-l-full")}
        onClick={() => set(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus aria-hidden className="size-4" />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={value}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          set(Number.isNaN(n) ? min : n);
        }}
        className="h-11 w-10 bg-transparent text-center text-base font-medium tabular-nums"
      />
      <button
        type="button"
        className={cn(btn, "rounded-r-full")}
        onClick={() => set(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus aria-hidden className="size-4" />
      </button>
    </div>
  );
}
