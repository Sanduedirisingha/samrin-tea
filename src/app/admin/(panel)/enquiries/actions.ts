"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/session";

const schema = z.object({ id: z.uuid(), status: z.enum(["new", "handled"]) });

export async function setInquiryStatus(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  await getDb()
    .update(inquiries)
    .set({ status: parsed.data.status })
    .where(eq(inquiries.id, parsed.data.id));
  revalidatePath("/admin", "layout");
}
