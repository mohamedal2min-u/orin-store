import type { Metadata } from "next";
import { Manrope, Noto_Sans_Arabic } from "next/font/google";
import Link from "next/link";
import { t } from "@/lib/translations";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-noto-arabic",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "ORIN — Svenska Klockor Online | Fri Frakt",
    template: "%s — ORIN",
  },
  description:
    "Upptäck vårt sortiment av armbandsur för herr och dam. Fri frakt, snabb leverans och säker betalning. Handla klockor online hos ORIN.",
  metadataBase: new URL("https://orin.se"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: "https://orin.se",
    siteName: "ORIN",
    title: "ORIN — Svenska Klockor Online | Fri Frakt",
    description:
      "Premiumklockor för herr och dam. Fri frakt, 30 dagars öppet köp och säker betalning.",
    images: [
      {
        url: "https://cdn.orin.se/og-default.webp",
        width: 1200,
        height: 630,
        alt: "ORIN — Svenska Klockor Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ORIN — Svenska Klockor Online | Fri Frakt",
    description:
      "Premiumklockor för herr och dam. Fri frakt, 30 dagars öppet köp och säker betalning.",
    images: ["https://cdn.orin.se/og-default.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${manrope.variable} ${notoArabic.variable}`}>
      <body className={manrope.className}>
        <div className="min-h-screen flex flex-col">
          {/* Top Banner */}
          <div className="top-banner">
            <div className="container">
              <p className="m-0">{t.freeShippingThreshold} • {t.openPurchase}</p>
            </div>
          </div>

          {/* Header Container */}
          <div className="header-wrapper glass-effect">
            <div className="container">
              <header className="flex h-20 items-center justify-between">
                {/* Logo - Left */}
                <div className="flex-1">
                  <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
                    ORIN<span className="text-accent">.</span>
                  </Link>
                </div>

                {/* Navigation - Center */}
                <nav className="hidden lg:flex items-center space-x-10">
                  <Link href="/herrklockor" className="nav-link">{t.menWatches}</Link>
                  <Link href="/damklockor" className="nav-link">{t.womenWatches}</Link>
                  <Link href="/marken" className="nav-link">{t.brands}</Link>
                  <Link href="/rea" className="nav-link text-sale">{t.sale}</Link>
                </nav>

                {/* Actions - Right */}
                <div className="flex-1 flex items-center justify-end space-x-4">
                  <button className="header-icon-btn" aria-label={t.search}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </button>
                  <button className="header-icon-btn hidden sm:flex" aria-label={t.myAccount}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </button>
                  <button className="header-icon-btn relative" aria-label={t.cart}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-bg-dark text-[10px] font-bold text-text-inverse">
                      0
                    </span>
                  </button>
                  
                  {/* Mobile Menu Toggle */}
                  <button className="header-icon-btn lg:hidden" aria-label="Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </header>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-column">
                  <h3>{t.customerService}</h3>
                  <ul>
                    <li>
                      <Link href="/kontakt">{t.contact}</Link>
                    </li>
                    <li>
                      <Link href="/returer">{t.returnPolicy}</Link>
                    </li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h3>ORIN</h3>
                  <ul>
                    <li>
                      <Link href="/om-oss">{t.aboutUs}</Link>
                    </li>
                    <li>
                      <Link href="/villkor">{t.termsAndConditions}</Link>
                    </li>
                    <li>
                      <Link href="/integritet">{t.privacyPolicy}</Link>
                    </li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h3>{t.securePayment}</h3>
                  <div className="payment-icons">
                    <span>Stripe</span>
                    <span>Klarna</span>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
