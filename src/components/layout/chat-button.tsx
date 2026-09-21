import { MessageCircle } from "lucide-react";

const GREETING = "Hello SAMRIN Tea, I'd like to ask about your tea.";

/**
 * Floating "Chat on WhatsApp" button. The number comes from admin → Settings (or the env default);
 * with no number configured nothing is rendered, so no contact detail is ever invented.
 */
export function ChatButton({ whatsappNumber }: { whatsappNumber: string | null }) {
  if (!whatsappNumber) return null;
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(GREETING)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="fixed right-4 bottom-20 z-40 inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#075e54] px-4 font-medium text-white shadow-lg shadow-black/30 transition-colors hover:bg-[#0a7466] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:right-6 lg:bottom-6 lg:px-5"
    >
      <MessageCircle aria-hidden className="size-6" strokeWidth={1.8} />
      <span className="max-lg:sr-only">Chat with us</span>
    </a>
  );
}
