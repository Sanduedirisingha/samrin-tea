import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { orders } from "@/db/schema";
import { getAdminSession } from "@/lib/admin/session";
import { lkrDecimal } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Cells starting with = + - @ are prefixed so spreadsheets never run them as formulas. */
function cell(value: string | number | null | undefined): string {
  let s = value === null || value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  if (!(await getAdminSession())) return new Response("Unauthorized", { status: 401 });
  const rows = await getDb().select().from(orders).orderBy(desc(orders.createdAt));
  const header = [
    "Order",
    "Placed",
    "Status",
    "Payment status",
    "Payment reference",
    "Name",
    "Email",
    "Phone",
    "Address",
    "City",
    "District",
    "Postal code",
    "Subtotal (LKR)",
    "Delivery (LKR)",
    "Total (LKR)",
    "Customer note",
    "Admin notes",
  ];
  const lines = rows.map((o) =>
    [
      o.orderNumber,
      o.createdAt.toISOString(),
      o.status,
      o.paymentStatus,
      o.paymentReference,
      o.customerName,
      o.customerEmail,
      o.customerPhone,
      [o.addressLine1, o.addressLine2].filter(Boolean).join(", "),
      o.city,
      o.district,
      o.postalCode,
      lkrDecimal(o.subtotalLkr),
      lkrDecimal(o.deliveryFeeLkr),
      lkrDecimal(o.totalLkr),
      o.notes,
      o.adminNotes,
    ]
      .map(cell)
      .join(","),
  );
  const csv = `﻿${[header.map(cell).join(","), ...lines].join("\r\n")}\r\n`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="samrin-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
