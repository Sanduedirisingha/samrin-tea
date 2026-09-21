import Image from "next/image";
import { getSlot, type SlotId } from "@/content/site-images";

/**
 * Fills its (relatively positioned) parent with the photo assigned to `slot`, plus a dark
 * gradient so text on top stays readable. Renders nothing while the slot is empty, so the
 * parent's fallback texture shows through.
 */
export function SlotImage({ slot, sizes }: { slot: SlotId; sizes: string }) {
  const img = getSlot(slot);
  if (!img) return null;
  return (
    <>
      <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover" />
      <div
        aria-hidden
        className="from-deep/90 via-deep/30 absolute inset-0 bg-gradient-to-t to-transparent"
      />
    </>
  );
}

export const hasSlot = (slot: SlotId) => getSlot(slot) !== null;
