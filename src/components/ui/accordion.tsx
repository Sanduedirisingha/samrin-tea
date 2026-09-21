import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Native <details> accordion: keyboard and screen-reader friendly with zero JS. */
export function AccordionItem({
  title,
  summary,
  children,
  className,
}: {
  title: string;
  /** Short line that stays visible under the title while collapsed. */
  summary?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={cn("group border-line border-b first:border-t", className)}>
      <summary className="flex min-h-14 cursor-pointer list-none items-start justify-between gap-4 py-5 marker:hidden [&::-webkit-details-marker]:hidden">
        <span>
          <span className="text-forest block font-serif text-xl">{title}</span>
          {summary && <span className="text-deep mt-2 block font-semibold">{summary}</span>}
        </span>
        <ChevronDown
          aria-hidden
          className="text-gold-ink mt-1.5 size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>
      <div className="text-muted space-y-4 pb-6 leading-relaxed">{children}</div>
    </details>
  );
}
