import Link from "next/link";
import { AccordionItem } from "@/components/ui/accordion";
import { reasonsByVariant, type ReasonsVariant } from "@/content/reasons";

/** "More Reasons to Choose Samrin" — variant picks the loose or tea-bag approved copy. */
export function ReasonsAccordion({ variant }: { variant: ReasonsVariant }) {
  return (
    <div>
      {reasonsByVariant[variant].map((reason) => (
        <AccordionItem key={reason.id} title={reason.title} summary={reason.summary}>
          {reason.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <p>
            <Link
              href={reason.link.href}
              className="text-heading hover:text-ink font-medium underline underline-offset-4"
            >
              {reason.link.label} →
            </Link>
          </p>
        </AccordionItem>
      ))}
    </div>
  );
}
