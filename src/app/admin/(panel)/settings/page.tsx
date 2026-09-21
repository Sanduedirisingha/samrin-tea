import { AdminCard, AdminPageTitle } from "@/components/admin/parts";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/admin/session";
import { getStoreSettings } from "@/lib/data/settings";
import { siteConfig } from "@/lib/site-config";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getStoreSettings();
  return (
    <>
      <AdminPageTitle
        title="Settings"
        description="Store details that used to live in environment variables."
      />
      <SettingsForm initial={settings} />
      <div className="mt-6 max-w-2xl">
        <AdminCard title="Fixed store details">
          <dl className="grid gap-3 text-sm sm:grid-cols-[10rem_1fr]">
            <dt className="text-muted">Consumer care</dt>
            <dd>{siteConfig.hotline.display}</dd>
            <dt className="text-muted">Website</dt>
            <dd>{siteConfig.website.display}</dd>
            <dt className="text-muted">Currency</dt>
            <dd>Sri Lankan rupee (LKR)</dd>
            <dt className="text-muted">Payments</dt>
            <dd>Manual: confirmed by the team after the order is placed</dd>
          </dl>
          <p className="text-muted mt-4 text-xs">
            These come from the client documents and code. Ask your developer to change them.
          </p>
        </AdminCard>
      </div>
    </>
  );
}
