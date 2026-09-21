"use client";

import { Loader2 } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/** Submit button that shows a spinner while its parent form's action is running. */
export function SubmitButton({
  children,
  variant = "primary",
  size = "sm",
  className,
  ...props
}: ComponentProps<"button"> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || props.disabled}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    >
      {pending && <Loader2 aria-hidden className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

/** Submit button that asks for confirmation first (delete etc.). */
export function ConfirmSubmit({
  children,
  message,
  className,
}: {
  children: ReactNode;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cn(
        "text-error hover:bg-error/10 inline-flex min-h-9 items-center rounded-full px-3 text-sm font-medium transition-colors disabled:opacity-60",
        className,
      )}
    >
      {children}
    </button>
  );
}
