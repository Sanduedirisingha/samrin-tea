"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Wraps pages in the storefront chrome (skip link, header, footer). The admin dashboard has its
 * own shell, so under /admin only the page itself is rendered. Header and footer stay server
 * components: they are passed in as slots.
 */
export function SiteShell({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return <>{children}</>;
  return (
    <>
      <a
        href="#main"
        className="focus:bg-forest focus:text-ivory sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:px-5 focus:py-3"
      >
        Skip to content
      </a>
      {header}
      <main id="main" className="flex-1">
        {children}
      </main>
      {footer}
    </>
  );
}
