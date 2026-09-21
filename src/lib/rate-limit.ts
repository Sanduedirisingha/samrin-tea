import "server-only";
import { and, count, eq, gte } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";

/**
 * Durable per-IP limit for enquiry submissions, counted from the inquiries table itself.
 * It works across serverless instances without extra infrastructure.
 */
export const INQUIRY_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 } as const;

export async function isInquiryRateLimited(ipHash: string): Promise<boolean> {
  const since = new Date(Date.now() - INQUIRY_LIMIT.windowMs);
  const [row] = await getDb()
    .select({ n: count() })
    .from(inquiries)
    .where(and(eq(inquiries.ipHash, ipHash), gte(inquiries.createdAt, since)));
  return (row?.n ?? 0) >= INQUIRY_LIMIT.max;
}
