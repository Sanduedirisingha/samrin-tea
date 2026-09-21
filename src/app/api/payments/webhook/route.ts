import { getPaymentProvider } from "@/lib/payments";

/** Stub: returns 501 until a real gateway provider implements handleWebhook. */
export async function POST(request: Request) {
  return getPaymentProvider().handleWebhook(request);
}

export function GET() {
  return new Response("Not implemented", { status: 501 });
}
