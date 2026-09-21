"use client";

import { useId, useState } from "react";
import { BrewImage } from "@/components/product/brew-image";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "loose", label: "Loose tea" },
  { key: "tea_bags", label: "Tea bags" },
] as const;

/** Accessible tab toggle between the two approved brewing-instruction artworks. */
export function BrewToggle() {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("loose");
  const baseId = useId();

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      setActive((a) => (a === "loose" ? "tea_bags" : "loose"));
      e.preventDefault();
    }
  };

  return (
    <div>
      <div
        role="tablist"
        aria-label="Brewing method"
        onKeyDown={onKey}
        className="border-line bg-ivory inline-flex rounded-full border p-1"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            id={`${baseId}-tab-${t.key}`}
            aria-selected={active === t.key}
            aria-controls={`${baseId}-panel`}
            tabIndex={active === t.key ? 0 : -1}
            onClick={() => setActive(t.key)}
            className={cn(
              "min-h-11 rounded-full px-6 text-sm font-medium transition-colors",
              active === t.key ? "bg-forest text-ivory" : "text-forest hover:bg-champagne/40",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
        className="mt-8"
      >
        <BrewImage key={active} format={active} />
      </div>
    </div>
  );
}
