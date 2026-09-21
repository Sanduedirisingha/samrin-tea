import Image from "next/image";
import { brewArtwork } from "@/content/reasons";

/** Approved brewing-instruction artwork for the given format. */
export function BrewGuide({ format }: { format: "loose" | "tea_bags" }) {
  const art = brewArtwork[format];
  return (
    <div className="border-gold/50 bg-ivory overflow-hidden rounded-2xl border">
      <Image
        src={art.src}
        alt={art.alt}
        width={art.width}
        height={art.height}
        sizes="(min-width: 1024px) 60rem, 100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
