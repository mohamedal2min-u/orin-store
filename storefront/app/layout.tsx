import type { Metadata } from "next";
import { Manrope, Noto_Sans_Arabic } from "next/font/google";
import Link from "next/link";
import { t } from "@/lib/translations";
import { CartProvider } from "@/lib/cart-context";
import { NavigationHeader } from "@/components/navigation-header";
import { CardBrands } from "@/components/payment-badges";
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
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            {/* Header + mobile drawer (client component — needs cart state) */}
            <NavigationHeader />

            {/* Page content */}
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
                    <CardBrands />
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
