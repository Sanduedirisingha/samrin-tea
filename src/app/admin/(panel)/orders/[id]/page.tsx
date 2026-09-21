import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminCard,
  AdminPageTitle,
  formatDate,
  Notice,
  StatusBadge,
} from "@/components/admin/parts";
import { SubmitButton } from "@/components/admin/ui";
import { inputClass } from "@/components/ui/field";
import { ORDER_STATUSES, PAYMENT_STATUSES, getOrderDetail } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/session";
import { formatLkr } from "@/lib/format";
import { updateOrder } from "../actions";

export const metadata = { title: "Order" };

export default async function AdminOrderPage({
  params,
  searchParams,
}: PageProps<"/admin/orders/[id]">) {
  await requireAdmin();
  const { id } = await params;
  const sp = await searchParams;
  const data = await getOrderDetail(id);
  if (!data) notFound();
  const { order, items } = data;

  return (
    <>
      <Link
        href="/admin/orders"
        className="text-muted mb-4 inline-flex items-center gap-2 text-sm hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" /> All orders
      </Link>
      <AdminPageTitle
        title={order.orderNumber}
        description={`Placed ${formatDate(order.createdAt)}`}
      />
      {sp.updated && <Notice>Order updated.</Notice>}

      <div className="grid gap-6 xl:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <AdminCard title="Items">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted text-left text-xs tracking-[0.12em] uppercase">
                  <th className="pb-2 font-semibold">Product</th>
                  <th className="pb-2 text-right font-semibold">Price</th>
                  <th className="pb-2 text-right font-semibold">Qty</th>
                  <th className="pb-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-line divide-y">
                {items.map((i) => (
                  <tr key={i.id}>
                    <td className="py-3">{i.nameSnapshot}</td>
                    <td className="py-3 text-right">{formatLkr(i.unitPriceLkr)}</td>
                    <td className="py-3 text-right">{i.qty}</td>
                    <td className="py-3 text-right font-medium">{formatLkr(i.lineTotalLkr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="border-line mt-4 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Subtotal</dt>
                <dd>{formatLkr(order.subtotalLkr)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd>
                  {order.deliveryFeeLkr > 0 ? formatLkr(order.deliveryFeeLkr) : "Not charged"}
                </dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatLkr(order.totalLkr)}</dd>
              </div>
            </dl>
          </AdminCard>

          <div className="grid gap-6 md:grid-cols-2">
            <AdminCard title="Customer">
              <p className="font-medium">{order.customerName}</p>
              <p className="mt-1 text-sm">
                <a href={`mailto:${order.customerEmail}`} className="underline">
                  {order.customerEmail}
                </a>
              </p>
              <p className="text-sm">
                <a href={`tel:${order.customerPhone}`} className="underline">
                  {order.customerPhone}
                </a>
              </p>
            </AdminCard>
            <AdminCard title="Delivery address">
              <address className="text-sm leading-relaxed not-italic">
                {order.addressLine1}
                <br />
                {order.addressLine2 && (
                  <>
                    {order.addressLine2}
                    <br />
                  </>
                )}
                {order.city}, {order.district}
                <br />
                {order.postalCode}
              </address>
            </AdminCard>
          </div>

          {order.notes && (
            <AdminCard title="Customer note">
              <p className="text-sm whitespace-pre-wrap">{order.notes}</p>
            </AdminCard>
          )}
        </div>

        <form action={updateOrder}>
          <input type="hidden" name="id" value={order.id} />
          <AdminCard title="Manage order">
            <div className="mb-4 flex gap-2">
              <StatusBadge value={order.status} />
              <StatusBadge value={order.paymentStatus} />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium">
                Order status
                <select
                  name="status"
                  defaultValue={order.status}
                  className={`${inputClass} mt-1.5 capitalize`}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Payment status
                <select
                  name="paymentStatus"
                  defaultValue={order.paymentStatus}
                  className={`${inputClass} mt-1.5 capitalize`}
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-medium">
                Payment reference
                <input
                  name="paymentReference"
                  defaultValue={order.paymentReference ?? ""}
                  placeholder="Bank transfer / receipt number"
                  className={`${inputClass} mt-1.5`}
                />
              </label>
              <label className="block text-sm font-medium">
                Internal notes
                <textarea
                  name="adminNotes"
                  rows={4}
                  defaultValue={order.adminNotes ?? ""}
                  placeholder="Only visible to admins"
                  className={`${inputClass} mt-1.5`}
                />
              </label>
              <SubmitButton size="md" className="w-full">
                Update order
              </SubmitButton>
            </div>
            <p className="text-muted mt-4 text-xs">
              Payment method: {order.paymentProvider}. Customers are not emailed automatically.
            </p>
          </AdminCard>
        </form>
      </div>
    </>
  );
}
