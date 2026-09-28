import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Eyebrow + serif title (+ optional intro). Wrap an italic word in <em className="accent">. Theme-aware. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2" | "h3";
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn("reveal", align === "center" && "mx-auto text-center", "max-w-2xl", className)}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-gold-ink mb-4 flex items-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase max-md:justify-center",
            align === "center" && "justify-center",
          )}
        >
          <span aria-hidden className="bg-gold h-px w-8" />
          {eyebrow}
        </p>
      )}
      <Tag className="text-heading text-[2rem] sm:text-4xl lg:text-5xl [&_em]:font-normal">
        {title}
      </Tag>
      {intro && <p className="text-muted mt-5 text-lg leading-relaxed">{intro}</p>}
    </div>
  );
}
