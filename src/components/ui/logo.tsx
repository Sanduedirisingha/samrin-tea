import Image from "next/image";
import { cn } from "@/lib/cn";

const sources = {
  color: "/brand/samrin-logo.svg",
  white: "/brand/samrin-logo-white.svg",
  green: "/brand/samrin-logo-green.svg",
  black: "/brand/samrin-logo-black.svg",
} as const;

/**
 * The approved logo artwork. Never restyle it: size it with height only so the aspect ratio
 * (481:330) is preserved. Full colour on light/cream, "white" on forest green or dark photos.
 */
export function Logo({
  variant = "color",
  className,
  priority,
}: {
  variant?: keyof typeof sources;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={sources[variant]}
      alt="SAMRIN Tea"
      width={481}
      height={330}
      priority={priority}
      unoptimized
      className={cn("w-auto", className)}
    />
  );
}
