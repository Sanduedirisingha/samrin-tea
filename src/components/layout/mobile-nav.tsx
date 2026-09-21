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
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="text-forest hover:bg-champagne/40 grid size-11 place-items-center rounded-full transition-colors"
      >
        {open ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
      </button>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="border-gold/40 bg-ivory absolute inset-x-0 top-full border-b shadow-[0_18px_30px_-18px_rgb(4_40_16/0.35)]"
      >
        <ul className="container-page py-3">
          {primaryNav.map((item) => (
            <li key={item.href} className="border-line border-b last:border-0">
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-forest flex min-h-14 items-center font-serif text-2xl"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="text-muted py-4 text-sm">
            Consumer care{" "}
            <a href={siteConfig.hotline.href} className="text-forest font-medium">
              {siteConfig.hotline.display}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
