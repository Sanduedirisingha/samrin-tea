import { ButtonLink } from "@/components/ui/button";

/** Dark "for business" card from the Choose section of the design. */
export function BusinessCard() {
  return (
    <aside
      aria-labelledby="business-card-heading"
      className="on-dark text-paper mt-14 grid gap-8 rounded-3xl bg-[#16281d] p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-center"
    >
      <div>
        <p className="text-sage text-xs tracking-[0.2em] uppercase">For business</p>
        <h2 id="business-card-heading" className="mt-3 text-3xl sm:text-4xl">
          Offices, cafés, shops and restaurants.
        </h2>
        <p className="text-paper/80 mt-4 max-w-xl">
          The Samrin Strong 100 tea-bag catering pack is built for places that serve tea through the
          day. Business supply is quoted, not priced on the site: tell us how much tea you serve.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 lg:justify-end">
        <ButtonLink href="/contact?type=business" variant="on-dark" size="lg">
          Talk to Samrin
        </ButtonLink>
        <ButtonLink href="/shop/samrin-strong-100-tea-bags" variant="panel-outline" size="lg">
          See the catering pack
        </ButtonLink>
      </div>
    </aside>
  );
}
