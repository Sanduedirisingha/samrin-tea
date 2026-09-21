"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/session";

const schema = z.object({
  id: z.uuid(),
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  paymentStatus: z.enum(["unpaid", "paid", "failed", "refunded"]),
  paymentReference: z.string().trim().max(200),
  adminNotes: z.string().trim().max(4000),
});

export async function updateOrder(formData: FormData): Promise<void> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/orders?error=invalid");
  const { id, status, paymentStatus, paymentReference, adminNotes } = parsed.data;

  await getDb()
    .update(orders)
    .set({
      status,
      paymentStatus,
      paymentReference: paymentReference || null,
      adminNotes: adminNotes || null,
    })
    .where(eq(orders.id, id));

  revalidatePath("/admin", "layout");
  redirect(`/admin/orders/${id}?updated=1`);
}
