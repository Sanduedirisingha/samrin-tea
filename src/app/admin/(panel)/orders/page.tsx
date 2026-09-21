import { Download } from "lucide-react";
import Link from "next/link";
import {
  AdminPageTitle,
  formatDate,
  StatusBadge,
  TableWrap,
  td,
  th,
} from "@/components/admin/parts";
import { Pagination } from "@/components/admin/pagination";
import { buttonStyles } from "@/components/ui/button";
import { inputClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { ORDER_STATUSES, listOrders, type OrderStatus } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/session";
import { formatLkr } from "@/lib/format";

export const metadata = { title: "Orders" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminOrdersPage({ searchParams }: PageProps<"/admin/orders">) {
  await requireAdmin();
  const sp = await searchParams;
  const statusParam = first(sp.status);
  const status = ORDER_STATUSES.find((s) => s === statusParam) as OrderStatus | undefined;
  const q = first(sp.q);
  const page = Number(first(sp.page)) || 1;
  const data = await listOrders({ status, q, page });
  const all = Object.values(data.statusCounts).reduce((a, b) => a + (b ?? 0), 0);

  const tab = (label: string, value: OrderStatus | undefined, n: number) => {
    const sp2 = new URLSearchParams();
    if (value) sp2.set("status", value);
    if (q) sp2.set("q", q);
    const active = status === value;
    return (
      <Link
        key={label}
        href={`/admin/orders${sp2.toString() ? `?${sp2}` : ""}`}
        aria-current={active ? "true" : undefined}
        className={cn(
          "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium capitalize",
          active ? "border-btn bg-btn text-btn-ink" : "border-line hover:bg-surface-3",
        )}
      >
        {label} <span className="opacity-70">{n}</span>
      </Link>
    );
  };

  return (
    <>
      <AdminPageTitle
        title="Orders"
        description="Orders placed on the website. Payment is confirmed manually until a gateway is connected."
        actions={
          <a
            href="/api/admin/export/orders"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            <Download aria-hidden className="size-4" /> Export CSV
          </a>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {tab("All", undefined, all)}
        {ORDER_STATUSES.map((s) => tab(s, s, data.statusCounts[s] ?? 0))}
      </div>

      <form className="mb-6 flex gap-2" role="search">
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search order number, name, email or phone"
          aria-label="Search orders"
          className={inputClass}
        />
        <button type="submit" className={buttonStyles({ size: "sm" })}>
          Search
        </button>
      </form>

      {data.rows.length === 0 ? (
        <p className="border-line bg-surface-2 text-muted rounded-2xl border p-8 text-center">
          No orders match.
        </p>
      ) : (
        <TableWrap>
          <table className="w-full min-w-[44rem]">
            <thead className="border-line border-b">
              <tr>
                <th className={th}>Order</th>
                <th className={th}>Customer</th>
                <th className={th}>Placed</th>
                <th className={th}>Status</th>
                <th className={th}>Payment</th>
                <th className={`${th} text-right`}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {data.rows.map((o) => (
                <tr key={o.id}>
                  <td className={td}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-heading font-medium underline underline-offset-4"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className={td}>
                    {o.customerName}
                    <span className="text-muted block text-xs">{o.district}</span>
                  </td>
                  <td className={`${td} text-muted`}>{formatDate(o.createdAt)}</td>
                  <td className={td}>
                    <StatusBadge value={o.status} />
                  </td>
                  <td className={td}>
                    <StatusBadge value={o.paymentStatus} />
                  </td>
                  <td className={`${td} text-right font-medium`}>{formatLkr(o.totalLkr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
      <Pagination
        basePath="/admin/orders"
        params={{ status, q }}
        page={data.page}
        pages={data.pages}
      />
    </>
  );
}
