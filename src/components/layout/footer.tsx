import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Trilingual } from "@/components/ui/trilingual";
import { siteConfig } from "@/lib/site-config";

const linkClass =
  "inline-flex min-h-8 items-center text-ink/85 underline-offset-4 transition-colors hover:text-heading hover:underline";

export function Footer() {
  const { manufacturer, distributor } = siteConfig;
  return (
    <footer className="bg-surface text-ink mt-24">
      <div className="container-page grid gap-12 py-16 md:grid-cols-[1.1fr_1fr_1fr]">
        <div>
          <Logo className="h-20" />
          <Trilingual className="mt-6" />
          <p className="text-ink/85 mt-3 max-w-xs text-sm leading-relaxed">{siteConfig.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-gold-ink font-sans text-xs font-semibold tracking-[0.2em] uppercase">
            Explore
          </h2>
          <ul className="mt-4 space-y-1 text-[0.95rem]">
            <li>
              <Link href="/shop" className={linkClass}>
                Shop tea
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkClass}>
                About Samrin
              </Link>
            </li>
            <li>
              <Link href="/contact?type=business" className={linkClass}>
                Business supply
              </Link>
            </li>
            <li>
              <Link href="/contact?type=sample" className={linkClass}>
                Request a tasting sample
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkClass}>
                Contact us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className={linkClass}>
                Privacy policy
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-gold-ink font-sans text-xs font-semibold tracking-[0.2em] uppercase">
            Consumer care
          </h2>
          <p className="mt-4">
            <a
              href={siteConfig.hotline.href}
              className="text-heading font-serif text-2xl underline-offset-4 hover:underline"
            >
              {siteConfig.hotline.display}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a href={siteConfig.website.href} className={linkClass}>
              {siteConfig.website.display}
            </a>
          </p>
          <address className="text-ink/85 mt-6 space-y-4 text-sm leading-relaxed not-italic">
            <p>
              <span className="text-ink block font-medium">Manufactured by</span>
              {manufacturer.name}, {manufacturer.address.join(", ")}
            </p>
            <p>
              <span className="text-ink block font-medium">Distributed by</span>
              {distributor.name}, {distributor.address.join(", ")}
            </p>
          </address>
        </div>
      </div>

      <div className="border-gold/40 border-t">
        <div className="container-page text-ink/75 flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SAMRIN Tea · {siteConfig.mfNumber} · Packer registration{" "}
            {siteConfig.packerRegistration}
          </p>
          <p>
            © {new Date().getFullYear()} Pure Ceylon black tea from Ruhuna, Sri Lanka | Design by
            Olutek Digital Solutions
          </p>
        </div>
      </div>
    </footer>
  );
}
