import type { ReactNode } from "react";
import { SectionHeading } from "@/components/ui/section-heading";

/** Calm, generous page intro used by Shop, Cart, Checkout, About, Contact, Privacy. */
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
}) {
  return (
    <div className="container-page pt-14 pb-10 sm:pt-20 sm:pb-14">
      <SectionHeading as="h1" eyebrow={eyebrow} title={title} intro={intro} />
    </div>
  );
}
