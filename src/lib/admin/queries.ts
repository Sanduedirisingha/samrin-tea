import "server-only";
import { and, asc, count, desc, eq, gte, ilike, ne, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries, orderItems, orders, products } from "@/db/schema";

export const PAGE_SIZE = 20;

export type OrderStatus = (typeof orders.$inferSelect)["status"];
export type InquiryStatus = (typeof inquiries.$inferSelect)["status"];
export type InquiryType = (typeof inquiries.$inferSelect)["type"];

export const ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];
export const PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded"] as const;

export async function getDashboardStats() {
  const db = getDb();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [byStatus, revenue, week, newEnquiries, activeProducts, recent] = await Promise.all([
    db.select({ status: orders.status, n: count() }).from(orders).groupBy(orders.status),
    db
      .select({ sum: sql<string>`coalesce(sum(${orders.totalLkr}), 0)` })
      .from(orders)
      .where(ne(orders.status, "cancelled")),
    db.select({ n: count() }).from(orders).where(gte(orders.createdAt, weekAgo)),
    db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "new")),
    db.select({ n: count() }).from(products).where(eq(products.isActive, true)),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(6),
  ]);
  const statusCounts = Object.fromEntries(byStatus.map((r) => [r.status, r.n])) as Partial<
    Record<OrderStatus, number>
  >;
  return {
    totalOrders: byStatus.reduce((s, r) => s + r.n, 0),
    statusCounts,
    revenueMinor: Number(revenue[0]?.sum ?? 0),
    ordersThisWeek: week[0]?.n ?? 0,
    newEnquiries: newEnquiries[0]?.n ?? 0,
    activeProducts: activeProducts[0]?.n ?? 0,
    recent,
  };
}

export async function listOrders(opts: { status?: OrderStatus; q?: string; page?: number }) {
  const db = getDb();
  const page = Math.max(1, opts.page ?? 1);
  const q = opts.q?.trim();
  const where = and(
    opts.status ? eq(orders.status, opts.status) : undefined,
    q
      ? or(
          ilike(orders.orderNumber, `%${q}%`),
          ilike(orders.customerName, `%${q}%`),
          ilike(orders.customerEmail, `%${q}%`),
          ilike(orders.customerPhone, `%${q}%`),
        )
      : undefined,
  );
  const [rows, total, byStatus] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(orders).where(where),
    db.select({ status: orders.status, n: count() }).from(orders).groupBy(orders.status),
  ]);
  return {
    rows,
    total: total[0]?.n ?? 0,
    page,
    pages: Math.max(1, Math.ceil((total[0]?.n ?? 0) / PAGE_SIZE)),
    statusCounts: Object.fromEntries(byStatus.map((r) => [r.status, r.n])) as Partial<
      Record<OrderStatus, number>
    >,
  };
}

export async function getOrderDetail(id: string) {
  const db = getDb();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return null;
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.nameSnapshot));
  return { order, items };
}

export async function listCustomers() {
  const emailKey = sql<string>`lower(${orders.customerEmail})`;
  const rows = await getDb()
    .select({
      email: emailKey,
      name: sql<string>`max(${orders.customerName})`,
      phone: sql<string>`max(${orders.customerPhone})`,
      district: sql<string>`max(${orders.district})`,
      orders: count(),
      spent: sql<string>`coalesce(sum(case when ${orders.status} <> 'cancelled' then ${orders.totalLkr} else 0 end), 0)`,
      last: sql<string>`max(${orders.createdAt})`,
    })
    .from(orders)
    .groupBy(emailKey)
    .orderBy(desc(sql`max(${orders.createdAt})`));
  return rows.map((r) => ({ ...r, spent: Number(r.spent) }));
}

export async function listInquiries(opts: {
  type?: InquiryType;
  status?: InquiryStatus;
  page?: number;
}) {
  const db = getDb();
  const page = Math.max(1, opts.page ?? 1);
  const where = and(
    opts.type ? eq(inquiries.type, opts.type) : undefined,
    opts.status ? eq(inquiries.status, opts.status) : undefined,
  );
  const [rows, total, fresh] = await Promise.all([
    db
      .select()
      .from(inquiries)
      .where(where)
      .orderBy(desc(inquiries.createdAt))
      .limit(PAGE_SIZE)
      .offset((page - 1) * PAGE_SIZE),
    db.select({ n: count() }).from(inquiries).where(where),
    db.select({ n: count() }).from(inquiries).where(eq(inquiries.status, "new")),
  ]);
  return {
    rows,
    total: total[0]?.n ?? 0,
    page,
    pages: Math.max(1, Math.ceil((total[0]?.n ?? 0) / PAGE_SIZE)),
    newCount: fresh[0]?.n ?? 0,
  };
}

export async function listAdminProducts(q?: string) {
  const term = q?.trim();
  return getDb()
    .select()
    .from(products)
    .where(
      term ? or(ilike(products.name, `%${term}%`), ilike(products.slug, `%${term}%`)) : undefined,
    )
    .orderBy(asc(products.sortOrder), asc(products.name));
}

export async function getAdminProduct(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const [row] = await getDb().select().from(products).where(eq(products.id, id)).limit(1);
  return row ?? null;
}

export async function productOrderCount(productId: string): Promise<number> {
  const [row] = await getDb()
    .select({ n: count() })
    .from(orderItems)
    .where(eq(orderItems.productId, productId));
  return row?.n ?? 0;
}
