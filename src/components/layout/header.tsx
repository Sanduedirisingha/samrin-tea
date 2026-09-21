import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";
import { Logo } from "@/components/ui/logo";
import { MobileNav } from "./mobile-nav";
import { primaryNav } from "./nav-links";

export function Header() {
  return (
    <header className="border-gold/40 bg-cream/90 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
        <Link href="/" aria-label="SAMRIN Tea — home" className="shrink-0">
          <Logo className="h-12 sm:h-14" priority />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-forest hover:bg-champagne/40 inline-flex min-h-11 items-center rounded-full px-4 text-[0.95rem] font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <CartLink />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
