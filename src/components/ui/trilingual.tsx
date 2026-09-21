import { trilingualLine } from "@/lib/site-config";
import { cn } from "@/lib/cn";

/** "තේ · TEA · தேயிலை" exactly as printed on the pack — used as a graphic accent. */
export function Trilingual({ className }: { className?: string }) {
  return (
    <p
      className={cn("text-champagne text-sm font-medium tracking-[0.18em]", className)}
      aria-label="Tea, in Sinhala, English and Tamil"
    >
      <span aria-hidden>{trilingualLine}</span>
    </p>
  );
}
