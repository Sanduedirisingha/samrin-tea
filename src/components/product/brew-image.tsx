import Image from "next/image";
import { brewArtwork } from "@/content/reasons";
import { cn } from "@/lib/cn";

/**
 * Approved brewing-instruction artwork. The artwork can't be re-laid out, so on narrow screens
 * it keeps a legible minimum width and scrolls sideways instead of shrinking its text.
 */
export function BrewImage({ format }: { format: "loose" | "tea_bags" }) {
  const art = brewArtwork[format];
  const minWidth = format === "loose" ? "min-w-[34rem]" : "min-w-[46rem]";
  return (
    <>
      <div className="reveal reveal-wipe sheen rounded-2xl">
        <div
          role="region"
          tabIndex={0}
          aria-label="Brewing instructions"
          className="border-gold/50 bg-surface-2 overflow-x-auto rounded-2xl border"
        >
          <Image
            src={art.src}
            alt={art.alt}
            width={art.width}
            height={art.height}
            sizes={
              format === "loose"
                ? "(min-width: 1216px) 70rem, max(100vw, 34rem)"
                : "(min-width: 1216px) 70rem, max(100vw, 46rem)"
            }
            className={cn("h-auto w-full", minWidth)}
          />
        </div>
      </div>
      <p className="mt-2 text-xs opacity-75 md:hidden">Swipe sideways to see every step →</p>
    </>
  );
}
