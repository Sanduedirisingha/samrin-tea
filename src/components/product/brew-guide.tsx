import { BrewImage } from "./brew-image";

/** Approved brewing-instruction artwork for the given format. */
export function BrewGuide({ format }: { format: "loose" | "tea_bags" }) {
  return <BrewImage format={format} />;
}
