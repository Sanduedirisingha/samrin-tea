import { ButtonLink } from "@/components/ui/button";

export function BusinessStrip() {
  return (
    <aside
      aria-label="Business supply"
      className="container-page border-gold/50 bg-surface-2 mt-20 flex flex-col items-start justify-between gap-5 rounded-2xl border p-7 sm:flex-row sm:items-center sm:p-9"
    >
      <div>
        <h2 className="text-heading text-2xl">Buying for an office, café or shop?</h2>
        <p className="text-muted mt-2 max-w-xl">
          Business supply is quoted, not priced on the site. Tell us how much tea you serve and we
          will come back to you.
        </p>
      </div>
      <ButtonLink href="/contact?type=business" variant="secondary" className="shrink-0">
        Business supply enquiry
      </ButtonLink>
    </aside>
  );
}
