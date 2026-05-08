import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@/lib/translations";
import "./globals.css";

export const metadata: Metadata = {
  title: `ORIN — Svenska Klockor Online | Fri Frakt`,
  description: "Upptäck vårt sortiment av armbandsur för herr och dam. Fri frakt, snabb leverans och säker betalning. Handla klockor online hos ORIN.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>
        <div className="layout-wrapper">
          {/* Top Bar */}
          <div className="topbar">
            <div className="container">
              <div className="topbar-content">
                <span>{t.freeShippingThreshold}</span>
                <span>{t.openPurchase}</span>
              </div>
            </div>
          </div>

          {/* Header */}
          <header className="header">
            <div className="container">
              <div className="header-content">
                {/* Logo Placeholder */}
                <div className="logo">
                  <Link href="/">ORIN</Link>
                </div>

                {/* Navigation Placeholder */}
                <nav className="desktop-nav">
                  <ul>
                    <li><Link href="/herrklockor">{t.menWatches}</Link></li>
                    <li><Link href="/damklockor">{t.womenWatches}</Link></li>
                    <li><Link href="/marken">{t.brands}</Link></li>
                    <li><Link href="/rea" className="text-sale">{t.sale}</Link></li>
                  </ul>
                </nav>

                {/* Header Actions Placeholder */}
                <div className="header-actions">
                  <button aria-label={t.search}>Sök</button>
                  <button aria-label={t.myAccount}>Konto</button>
                  <button aria-label={t.cart}>Varukorg (0)</button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="main-content">
            {children}
          </main>

          {/* Footer */}
          <footer className="footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-column">
                  <h3>{t.customerService}</h3>
                  <ul>
                    <li><Link href="/kontakt">{t.contact}</Link></li>
                    <li><Link href="/returer">{t.returnPolicy}</Link></li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h3>ORIN</h3>
                  <ul>
                    <li><Link href="/om-oss">{t.aboutUs}</Link></li>
                    <li><Link href="/villkor">{t.termsAndConditions}</Link></li>
                    <li><Link href="/integritet">{t.privacyPolicy}</Link></li>
                  </ul>
                </div>
                <div className="footer-column">
                  <h3>{t.securePayment}</h3>
                  <div className="payment-icons">
                    {/* Placeholder for payment icons */}
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
