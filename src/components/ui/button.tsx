import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "on-dark" | "secondary-on-dark" | "panel-outline";
type Size = "sm" | "md" | "lg";

type StyleOptions = { variant?: Variant; size?: Size; fullWidth?: boolean };

const variants: Record<Variant, string> = {
  /** Outline button for panels that stay dark in both themes (business card). */
  "panel-outline": "border border-paper/30 text-paper hover:border-paper/70 hover:bg-paper/5",
  primary: "bg-btn text-btn-ink hover:bg-moss dark:hover:bg-champagne",
  secondary: "border border-heading text-heading hover:bg-heading hover:text-surface",
  "on-dark": "bg-gold text-on-accent hover:bg-champagne",
  "secondary-on-dark": "border border-ink/30 text-ink hover:border-ink/60 hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 py-2 text-sm",
  md: "min-h-12 px-7 py-2.5 text-[0.95rem]",
  lg: "min-h-14 px-9 py-3 text-base",
};

export function buttonStyles({ variant = "primary", size = "md", fullWidth }: StyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full text-center font-medium tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
  );
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleOptions) {
  return (
    <button
      type={type}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  size,
  fullWidth,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleOptions) {
  return <Link className={cn(buttonStyles({ variant, size, fullWidth }), className)} {...props} />;
}
