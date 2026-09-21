import Link from "next/link";
import { AdminPageTitle, formatDate, StatusBadge } from "@/components/admin/parts";
import { Pagination } from "@/components/admin/pagination";
import { SubmitButton } from "@/components/admin/ui";
import { cn } from "@/lib/cn";
import { listInquiries, type InquiryStatus, type InquiryType } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/admin/session";
import { INQUIRY_TYPES } from "@/lib/validators/contact";
import { setInquiryStatus } from "./actions";

export const metadata = { title: "Enquiries" };

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function AdminEnquiriesPage({ searchParams }: PageProps<"/admin/enquiries">) {
  await requireAdmin();
  const sp = await searchParams;
  const typeParam = first(sp.type);
  const type = INQUIRY_TYPES.find((t) => t.value === typeParam)?.value as InquiryType | undefined;
  const statusParam = first(sp.status);
  const status = (statusParam === "new" || statusParam === "handled" ? statusParam : undefined) as
    InquiryStatus | undefined;
  const page = Number(first(sp.page)) || 1;
  const data = await listInquiries({ type, status, page });
  const label = (t: string) => INQUIRY_TYPES.find((x) => x.value === t)?.label ?? t;

  const chip = (text: string, params: Record<string, string | undefined>, active: boolean) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v) q.set(k, v);
    return (
      <Link
        key={text}
        href={`/admin/enquiries${q.toString() ? `?${q}` : ""}`}
        aria-current={active ? "true" : undefined}
        className={cn(
          "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium",
          active ? "border-btn bg-btn text-btn-ink" : "border-line hover:bg-surface-3",
        )}
      >
        {text}
      </Link>
    );
  };

  return (
    <>
      <AdminPageTitle
        title="Enquiries"
        description="Messages from the contact form: questions, order help, business supply, sample requests and factory-visit interest."
      />
      <div className="mb-3 flex flex-wrap gap-2">
        {chip(`All (${data.total})`, { type }, !status)}
        {chip(`New (${data.newCount})`, { status: "new", type }, status === "new")}
        {chip("Handled", { status: "handled", type }, status === "handled")}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {chip("Any type", { status }, !type)}
        {INQUIRY_TYPES.map((t) => chip(t.label, { type: t.value, status }, type === t.value))}
      </div>

      {data.rows.length === 0 ? (
        <p className="border-line bg-surface-2 text-muted rounded-2xl border p-8 text-center">
          No enquiries.
        </p>
      ) : (
        <ul className="space-y-3">
          {data.rows.map((e) => (
            <li key={e.id} className="border-line bg-surface-2 rounded-2xl border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-heading font-serif text-lg">{e.name}</p>
                  <p className="text-muted text-sm">
                    {label(e.type)} · {formatDate(e.createdAt)}
                    {e.productSlug && <> · {e.productSlug}</>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge value={e.status} />
                  <form action={setInquiryStatus}>
                    <input type="hidden" name="id" value={e.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={e.status === "new" ? "handled" : "new"}
                    />
                    <SubmitButton variant="secondary">
                      {e.status === "new" ? "Mark handled" : "Reopen"}
                    </SubmitButton>
                  </form>
                </div>
              </div>
              <p className="mt-3 text-sm">
                {e.email && (
                  <a href={`mailto:${e.email}`} className="mr-4 underline">
                    {e.email}
                  </a>
                )}
                {e.phone && (
                  <a href={`tel:${e.phone}`} className="underline">
                    {e.phone}
                  </a>
                )}
              </p>
              {(e.businessName || e.businessType || e.location || e.monthlyUsage) && (
                <p className="text-muted mt-2 text-sm">
                  {[
                    e.businessName,
                    e.businessType,
                    e.location,
                    e.monthlyUsage && `Usage: ${e.monthlyUsage}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              )}
              {e.message && <p className="mt-3 text-sm whitespace-pre-wrap">{e.message}</p>}
            </li>
          ))}
        </ul>
      )}
      <Pagination
        basePath="/admin/enquiries"
        params={{ type, status }}
        page={data.page}
        pages={data.pages}
      />
    </>
  );
}
