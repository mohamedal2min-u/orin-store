import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { Text, clx } from "@modules/common/components/ui";

import LocalizedClientLink from "@modules/common/components/localized-client-link";

const SocialIcon = ({ children, href, label }: { children: React.ReactNode; href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex items-center justify-center w-9 h-9 rounded-full border border-kv-border/50 text-kv-secondary hover:text-kv-primary hover:border-kv-primary/30 hover:bg-kv-surface transition-all duration-200"
  >
    {children}
  </a>
);

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  });
  const productCategories = await listCategories();

  return (
    <footer className="w-full bg-kv-primary text-kv-bg/80">
      {/* ── Newsletter Section ── */}
      <div className="border-b border-white/10">
        <div className="content-container py-12 small:py-16">
          <div className="flex flex-col small:flex-row items-center justify-between gap-8">
            <div className="text-center small:text-left">
              <h3 className="text-[18px] small:text-[20px] font-light tracking-[0.06em] uppercase text-white">
                Håll dig uppdaterad
              </h3>
              <p className="text-[13px] text-white/50 mt-2 max-w-sm">
                Prenumerera för exklusiva erbjudanden och nyheter om nya klockor.
              </p>
            </div>
            <div className="flex w-full small:w-auto max-w-md">
              <input
                type="email"
                placeholder="Din e-postadress"
                className="flex-1 small:w-64 px-5 py-3 bg-white/5 border border-white/15 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40 transition-colors"
                aria-label="E-postadress"
              />
              <button className="px-6 py-3 bg-white text-kv-primary text-[11px] font-semibold uppercase tracking-[0.14em] hover:bg-white/90 transition-colors">
                Prenumerera
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="content-container py-14 small:py-20">
        <div className="grid grid-cols-2 small:grid-cols-12 gap-y-10 gap-x-6 small:gap-x-8">
          {/* Brand Column */}
          <div className="col-span-2 small:col-span-3">
            <LocalizedClientLink
              href="/"
              className="inline-block text-[22px] font-bold tracking-[0.08em] text-white hover:text-white/80 uppercase transition-colors duration-200"
            >
              ORIN
            </LocalizedClientLink>
            <p className="text-[13px] text-white/45 mt-3 leading-relaxed max-w-[220px]">
              Tidlösa armbandsur, kurerade för den svenska marknaden.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://instagram.com/orin.se"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/orin.se"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://tiktok.com/@orin.se"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/40 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Categories */}
          {productCategories && productCategories.length > 0 && (
            <div className="col-span-1 small:col-span-2">
              <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white mb-4">
                Kategorier
              </h4>
              <ul className="flex flex-col gap-2.5" data-testid="footer-categories">
                {productCategories.slice(0, 6).map((c) => {
                  if (c.parent_category) return null;
                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-[13px] text-white/45 hover:text-white transition-colors duration-200"
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Collections */}
          {collections && collections.length > 0 && (
            <div className="col-span-1 small:col-span-2">
              <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white mb-4">
                Kollektioner
              </h4>
              <ul className="flex flex-col gap-2.5">
                {collections.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="text-[13px] text-white/45 hover:text-white transition-colors duration-200"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Customer Service */}
          <div className="col-span-1 small:col-span-2">
            <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white mb-4">
              Kundservice
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <LocalizedClientLink href="/account" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">
                  Mitt konto
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/cart" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">
                  Varukorg
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/shipping-returns" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">
                  Frakt & Returer
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/warranty" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">
                  Garanti
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="col-span-1 small:col-span-3">
            <h4 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-white mb-4">
              Information
            </h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <LocalizedClientLink href="/about" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">
                  Om oss
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/privacy" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">
                  Integritetspolicy
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/terms" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">
                  Köpvillkor
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/cookies" className="text-[13px] text-white/45 hover:text-white transition-colors duration-200">
                  Cookies
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Trust Badges ── */}
      <div className="border-t border-white/8">
        <div className="content-container py-8">
          <div className="grid grid-cols-2 small:grid-cols-4 gap-6 small:gap-8">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium text-white/70">Fri frakt</p>
                <p className="text-[10px] text-white/30">Över 999 kr</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium text-white/70">Trygg betalning</p>
                <p className="text-[10px] text-white/30">SSL-krypterad</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium text-white/70">Fri retur</p>
                <p className="text-[10px] text-white/30">Inom 30 dagar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/5">
                <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[11px] font-medium text-white/70">2 års garanti</p>
                <p className="text-[10px] text-white/30">På alla klockor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/8">
        <div className="content-container py-6">
          <div className="flex flex-col small:flex-row items-center justify-between gap-4">
            <Text className="text-[11px] text-white/30 tracking-wide">
              © {new Date().getFullYear()} ORIN. Alla rättigheter förbehållna.
            </Text>
            <div className="flex items-center gap-6">
              <span className="text-[11px] text-white/30 tracking-wide">orin.se</span>
              <span className="text-[11px] text-white/20">•</span>
              <span className="text-[11px] text-white/30 tracking-wide">Stockholm, Sverige</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
