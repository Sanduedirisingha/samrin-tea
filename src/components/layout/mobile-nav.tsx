"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { primaryNav } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="text-ink hover:bg-surface-3 grid size-11 place-items-center rounded-full transition-colors"
      >
        {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
      </button>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="bg-surface border-line absolute inset-x-0 top-full border-b shadow-[0_18px_30px_-18px_rgb(0_0_0/0.6)]"
      >
        <ul className="container-page py-3">
          {primaryNav.map((item) => (
            <li key={item.href} className="border-line border-b">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-ink flex min-h-14 items-center justify-center font-serif text-2xl"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span className="text-ink/75 text-sm">
              Consumer care{" "}
              <a href={siteConfig.hotline.href} className="text-gold-ink font-medium">
                {siteConfig.hotline.display}
              </a>
            </span>
            <Link
              href="/contact?type=business"
              onClick={() => setOpen(false)}
              className="bg-gold text-on-accent inline-flex min-h-11 items-center rounded-full px-5 text-sm font-medium"
            >
              Business supply
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
