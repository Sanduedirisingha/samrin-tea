import { BrewToggle } from "@/components/sections/brew-toggle";
import { SectionHeading } from "@/components/ui/section-heading";

/** The approved brewing guides (loose tea and tea bags), with the tab toggle between them. */
export function BrewSteps() {
  return (
    <section
      id="brew"
      aria-labelledby="brew-heading"
      className="text-ink bg-surface-alt scroll-mt-20 py-24"
    >
      <div className="container-page">
        <SectionHeading
          eyebrow="03 — The brewing"
          title={
            <span id="brew-heading">
              How to <em className="accent text-gold-ink">prepare.</em>
            </span>
          }
        />
        <div className="mt-10">
          <BrewToggle />
        </div>
      </div>
    </section>
  );
}
