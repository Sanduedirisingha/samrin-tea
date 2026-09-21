import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "on-dark" | "secondary-on-dark";
type Size = "sm" | "md" | "lg";

type StyleOptions = { variant?: Variant; size?: Size; fullWidth?: boolean };

const variants: Record<Variant, string> = {
  primary: "bg-forest text-ivory hover:bg-deep",
  secondary: "border border-forest text-forest hover:bg-forest hover:text-ivory",
  "on-dark": "on-dark bg-cream text-forest hover:bg-white",
  "secondary-on-dark": "on-dark border border-champagne/70 text-cream hover:bg-cream/10",
};

const sizes: Record<Size, string> = {
  sm: "min-h-11 px-5 text-sm",
  md: "min-h-12 px-7 text-[0.95rem]",
  lg: "min-h-14 px-9 text-base",
};

export function buttonStyles({ variant = "primary", size = "md", fullWidth }: StyleOptions = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-wide whitespace-nowrap transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60",
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
