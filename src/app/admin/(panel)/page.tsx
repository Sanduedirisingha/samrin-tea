import Link from "next/link";
import {
  AdminCard,
  AdminPageTitle,
  formatDate,
  Stat,
  StatusBadge,
  TableWrap,
  td,
  th,
} from "@/components/admin/parts";
import { requireAdmin } from "@/lib/admin/session";
import { getDashboardStats } from "@/lib/admin/queries";
import { formatLkr } from "@/lib/format";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  await requireAdmin();
  const s = await getDashboardStats();
  return (
    <>
      <AdminPageTitle title="Dashboard" description="A quick look at the store." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Sales" value={formatLkr(s.revenueMinor)} hint="All orders except cancelled" />
        <Stat
          label="Orders"
          value={String(s.totalOrders)}
          hint={`${s.ordersThisWeek} in the last 7 days`}
        />
        <Stat
          label="Awaiting action"
          value={String(s.statusCounts.pending ?? 0)}
          hint="Pending orders"
        />
        <Stat
          label="New enquiries"
          value={String(s.newEnquiries)}
          hint={`${s.activeProducts} active products`}
        />
      </div>

      <div className="mt-8">
        <AdminCard
          title="Recent orders"
          actions={
            <Link
              href="/admin/orders"
              className="text-heading text-sm font-medium underline underline-offset-4"
            >
              View all
            </Link>
          }
        >
          {s.recent.length === 0 ? (
            <p className="text-muted">
              No orders yet. They will appear here as soon as customers check out.
            </p>
          ) : (
            <TableWrap>
              <table className="w-full">
                <thead className="border-line border-b">
                  <tr>
                    <th className={th}>Order</th>
                    <th className={th}>Customer</th>
                    <th className={th}>Date</th>
                    <th className={th}>Status</th>
                    <th className={`${th} text-right`}>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-line divide-y">
                  {s.recent.map((o) => (
                    <tr key={o.id}>
                      <td className={td}>
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="text-heading font-medium underline underline-offset-4"
                        >
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className={td}>{o.customerName}</td>
                      <td className={`${td} text-muted`}>{formatDate(o.createdAt)}</td>
                      <td className={td}>
                        <StatusBadge value={o.status} />
                      </td>
                      <td className={`${td} text-right font-medium`}>{formatLkr(o.totalLkr)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableWrap>
          )}
        </AdminCard>
      </div>
    </>
  );
}
