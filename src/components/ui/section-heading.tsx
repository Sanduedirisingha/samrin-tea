import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Eyebrow + serif title (+ optional intro). Wrap an italic word in <em className="accent">. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  align = "left",
  onDark,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-2xl", className)}>
      {eyebrow && (
        <p
          className={cn(
            "mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase",
            align === "center" && "justify-center",
            onDark ? "text-champagne" : "text-gold-ink",
          )}
        >
          <span aria-hidden className={cn("h-px w-8", onDark ? "bg-gold" : "bg-gold")} />
          {eyebrow}
        </p>
      )}
      <Tag
        className={cn(
          "text-[2rem] sm:text-4xl lg:text-5xl [&_em]:font-normal",
          onDark ? "text-cream" : "text-forest",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p className={cn("mt-5 text-lg leading-relaxed", onDark ? "text-cream/85" : "text-muted")}>
          {intro}
        </p>
      )}
    </div>
  );
}
