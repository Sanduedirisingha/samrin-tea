import { ExternalLink, LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/login/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/ui/logo";
import { requireAdmin } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin" },
  robots: { index: false, follow: false },
};

// Everything in the dashboard is per-request and private.
export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="bg-surface min-h-dvh">
      <header className="bg-surface/90 border-line sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3">
            <Logo className="h-11" />
            <span className="text-heading hidden font-serif text-xl sm:block">Store admin</span>
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/"
              target="_blank"
              className="text-ink/85 hover:bg-surface-3 inline-flex min-h-10 items-center gap-2 rounded-full px-3"
            >
              <ExternalLink aria-hidden className="size-4" />{" "}
              <span className="max-sm:hidden">View store</span>
            </Link>
            <span className="text-muted max-md:hidden">{admin.email}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-ink/85 hover:bg-surface-3 inline-flex min-h-10 items-center gap-2 rounded-full px-3"
              >
                <LogOut aria-hidden className="size-4" />{" "}
                <span className="max-sm:hidden">Log out</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="container-page grid grid-cols-[minmax(0,1fr)] gap-8 py-8 lg:grid-cols-[13rem_minmax(0,1fr)]">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <AdminNav />
        </aside>
        <main id="main" className="keep-left min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
