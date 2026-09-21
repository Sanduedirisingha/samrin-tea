import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { MobileNav } from "./mobile-nav";
import { primaryNav } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

/** Sticky bar in both themes; the approved logo follows the theme (full colour / reversed). */
export function Header() {
  return (
    <header className="bg-surface/90 border-line sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" aria-label="SAMRIN Tea — home" className="shrink-0">
          <Logo className="h-16" priority />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink/85 hover:text-gold-ink inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <CartLink />
          <ButtonLink
            href="/contact?type=business"
            variant="on-dark"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Business supply
          </ButtonLink>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
