import { cn } from "@/lib/cn";

/**
 * "තේ · TEA · தேயிலை" exactly as printed on the pack — used as a graphic accent.
 * Each word carries its language so screen readers pronounce it correctly.
 */
export function Trilingual({ className }: { className?: string }) {
  return (
    <p className={cn("text-gold-ink text-sm font-medium tracking-[0.18em]", className)}>
      <span lang="si">තේ</span> · <span lang="en">TEA</span> · <span lang="ta">தேயிலை</span>
    </p>
  );
}
