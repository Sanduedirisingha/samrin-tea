import { Factory, Layers, MapPin, ShieldCheck } from "lucide-react";

/** Text + icons only. No certification marks are recreated. */
const facts = [
  { icon: MapPin, label: "Single region Ruhuna" },
  { icon: Layers, label: "Unblended" },
  { icon: Factory, label: "Loose tea packed at the factory" },
  { icon: ShieldCheck, label: "ISO 22000:2018-certified tea manufacture" },
] as const;

export function TrustStrip() {
  return (
    <section aria-label="Why Samrin" className="border-gold/40 bg-ivory border-b">
      <ul className="container-page grid grid-cols-2 gap-x-4 gap-y-6 py-8 lg:grid-cols-4">
        {facts.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3">
            <Icon aria-hidden className="text-gold-ink size-7 shrink-0" strokeWidth={1.5} />
            <span className="text-forest text-sm font-medium sm:text-[0.95rem]">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
