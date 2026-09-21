import Link from "next/link";
import { CartLink } from "@/components/cart/cart-link";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { MobileNav } from "./mobile-nav";
import { primaryNav } from "./nav-links";

/** Dark sticky bar from the homepage design; the approved logo (reversed) replaces the typed wordmark. */
export function Header() {
  return (
    <header className="on-dark bg-deep/90 border-paper/10 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="SAMRIN Tea — home" className="shrink-0">
          <Logo variant="white" className="h-11" priority />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-paper/85 hover:text-champagne inline-flex min-h-11 items-center px-3 text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
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
