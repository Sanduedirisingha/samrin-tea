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
 * (481:330) is preserved. `auto` follows the theme: full colour in light mode, reversed (white)
 * in dark mode. Fixed variants are for panels that look the same in both modes.
 */
export function Logo({
  variant = "auto",
  className,
  priority,
}: {
  variant?: "auto" | keyof typeof sources;
  className?: string;
  priority?: boolean;
}) {
  if (variant === "auto") {
    return (
      <>
        <Image
          src={sources.color}
          alt="SAMRIN Tea"
          width={481}
          height={330}
          priority={priority}
          unoptimized
          className={cn("w-auto dark:hidden", className)}
        />
        <Image
          src={sources.white}
          alt="SAMRIN Tea"
          width={481}
          height={330}
          unoptimized
          className={cn("hidden w-auto dark:block", className)}
        />
      </>
    );
  }
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
