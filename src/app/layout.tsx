import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader, Noto_Sans_Sinhala, Noto_Sans_Tamil } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { ToastProvider } from "@/components/cart/toast";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { JsonLd } from "@/components/seo/json-ld";
import { getCatalog } from "@/lib/data/products";
import { toCartItem } from "@/lib/product-utils";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});
// Fallbacks so the pack's trilingual line (තේ · TEA · தேயிலை) renders correctly.
const sinhala = Noto_Sans_Sinhala({
  subsets: ["sinhala"],
  variable: "--font-sinhala",
  display: "swap",
  preload: false,
});
const tamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  variable: "--font-tamil",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SAMRIN Tea — Factory-fresh Ruhuna tea",
    template: "%s | SAMRIN Tea",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en_LK",
    title: "SAMRIN Tea — Factory-fresh Ruhuna tea",
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#063D24",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/samrin-logo.png`,
  description: siteConfig.description,
  telephone: "+94717745777",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+94717745777",
    contactType: "customer service",
    areaServed: "LK",
    availableLanguage: ["en"],
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // The 5-item catalogue is small; the cart resolves names and prices from it locally.
  const catalog = (await getCatalog()).map(toCartItem);

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${instrument.variable} ${sinhala.variable} ${tamil.variable}`}
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="focus:bg-forest focus:text-ivory sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:px-5 focus:py-3"
        >
          Skip to content
        </a>
        <ToastProvider>
          <CartProvider catalog={catalog}>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </ToastProvider>
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
