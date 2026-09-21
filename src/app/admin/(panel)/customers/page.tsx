import { AdminPageTitle, formatDate, TableWrap, td, th } from "@/components/admin/parts";
import { listCustomers } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/session";
import { formatLkr } from "@/lib/format";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  await requireAdmin();
  const customers = await listCustomers();
  return (
    <>
      <AdminPageTitle
        title="Customers"
        description="Built from orders: one row per email address. Customers don't have accounts."
      />
      {customers.length === 0 ? (
        <p className="border-line bg-surface-2 text-muted rounded-2xl border p-8 text-center">
          No customers yet.
        </p>
      ) : (
        <TableWrap>
          <table className="w-full min-w-[40rem]">
            <thead className="border-line border-b">
              <tr>
                <th className={th}>Customer</th>
                <th className={th}>Contact</th>
                <th className={th}>District</th>
                <th className={`${th} text-right`}>Orders</th>
                <th className={`${th} text-right`}>Spent</th>
                <th className={th}>Last order</th>
              </tr>
            </thead>
            <tbody className="divide-line divide-y">
              {customers.map((c) => (
                <tr key={c.email}>
                  <td className={`${td} font-medium`}>{c.name}</td>
                  <td className={td}>
                    <a href={`mailto:${c.email}`} className="underline">
                      {c.email}
                    </a>
                    <span className="text-muted block text-xs">{c.phone}</span>
                  </td>
                  <td className={td}>{c.district}</td>
                  <td className={`${td} text-right`}>{c.orders}</td>
                  <td className={`${td} text-right font-medium`}>{formatLkr(c.spent)}</td>
                  <td className={`${td} text-muted`}>{formatDate(c.last)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </>
  );
}
