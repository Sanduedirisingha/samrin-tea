import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader, Noto_Sans_Sinhala, Noto_Sans_Tamil } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { ToastProvider } from "@/components/cart/toast";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SiteShell } from "@/components/layout/site-shell";
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
  weight: "500",
  variable: "--font-sinhala",
  display: "swap",
  preload: false,
});
const tamil = Noto_Sans_Tamil({
  subsets: ["tamil"],
  weight: "500",
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

const themeScript = `(function(){try{var t=localStorage.getItem("samrin_theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

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
      suppressHydrationWarning
      className={`${newsreader.variable} ${instrument.variable} ${sinhala.variable} ${tamil.variable}`}
    >
      <head>
        {/* Applies the saved (or device) theme before first paint so there is no flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <ToastProvider>
          <CartProvider catalog={catalog}>
            <SiteShell header={<Header />} footer={<Footer />}>
              {children}
            </SiteShell>
          </CartProvider>
        </ToastProvider>
        <JsonLd data={organizationJsonLd} />
      </body>
    </html>
  );
}
