import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/ui/logo";
import { getAdminSession } from "@/lib/admin/session";

export const metadata: Metadata = {
  title: "Admin sign in",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return (
    <main className="bg-surface keep-left grid min-h-dvh place-items-center px-4 py-12">
      <div className="border-line bg-surface-2 w-full max-w-sm rounded-2xl border p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo className="h-16" />
          <h1 className="text-heading text-2xl">Store admin</h1>
          <p className="text-muted text-sm">Sign in to manage products, orders and enquiries.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
