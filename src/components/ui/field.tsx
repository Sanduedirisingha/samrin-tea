import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "block w-full min-h-11 rounded-lg border border-line bg-surface-2 px-4 py-2.5 text-base text-ink placeholder:text-muted/70 transition-colors focus-visible:border-heading aria-[invalid=true]:border-error";

type ControlProps = {
  id: string;
  name: string;
  "aria-invalid": boolean | undefined;
  "aria-describedby": string | undefined;
  "aria-required": boolean | undefined;
};

/**
 * Labelled form field with inline error. The child is a render function so the exact
 * control (input / select / textarea) receives the right id and aria wiring.
 */
export function Field({
  label,
  name,
  error,
  hint,
  required,
  optional,
  className,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const id = `field-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");
  return (
    <div className={className}>
      <label htmlFor={id} className="text-ink mb-1.5 block text-sm font-medium">
        {label}
        {optional && <span className="text-muted ml-1.5 font-normal">(optional)</span>}
      </label>
      {children({
        id,
        name,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy || undefined,
        "aria-required": required || undefined,
      })}
      {hint && (
        <p id={`${id}-hint`} className="text-muted mt-1.5 text-sm">
          {hint}
        </p>
      )}
      <p
        id={`${id}-error`}
        role={error ? "alert" : undefined}
        className={cn("text-error mt-1.5 text-sm font-medium", !error && "hidden")}
      >
        {error}
      </p>
    </div>
  );
}
