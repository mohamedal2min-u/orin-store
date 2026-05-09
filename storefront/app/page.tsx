import { t } from "@/lib/translations";
import { medusaFetch } from "@/lib/medusa";
import { MedusaProduct, ProductListResponse } from "@/lib/types";
import { formatPriceRaw } from "@/lib/locale";
import Link from "next/link";
import Image from "next/image";

async function getFeaturedProducts(): Promise<MedusaProduct[]> {
  try {
    const data = await medusaFetch<ProductListResponse>(
      "/store/products?limit=4&fields=id,title,handle,thumbnail,+variants.calculated_price&region_id=reg_01KR4NAMQR05YZNFWJFZY7BXS0"
    )
    return data.products
  } catch {
    return []
  }
}

export default async function Home() {
  const products = await getFeaturedProducts()

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-banner relative overflow-hidden">
        <div className="container relative z-10">
          <div className="hero-content max-w-2xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Upptäck Tidlös Elegans
            </h1>
            <p className="text-xl md:text-2xl text-text-muted mb-10 leading-relaxed">
              Premiumklockor för varje tillfälle. Handplockade kollektioner med fokus på kvalitet och skandinavisk design.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/herrklockor" className="btn-primary w-full sm:w-auto min-w-[200px]">
                Herrklockor
              </Link>
              <Link href="/damklockor" className="btn-primary w-full sm:w-auto min-w-[200px]">
                Damklockor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="featured-brands py-12 bg-white">
        <div className="container">
          <h2 className="sr-only">{t.brands}</h2>
          <div className="brand-grid grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            <div className="brand-placeholder grayscale hover:grayscale-0 transition-all">Seiko</div>
            <div className="brand-placeholder grayscale hover:grayscale-0 transition-all">Citizen</div>
            <div className="brand-placeholder grayscale hover:grayscale-0 transition-all">Tissot</div>
            <div className="brand-placeholder grayscale hover:grayscale-0 transition-all">Casio</div>
            <div className="brand-placeholder grayscale hover:grayscale-0 transition-all">Certina</div>
            <div className="brand-placeholder grayscale hover:grayscale-0 transition-all">Orient</div>
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="category-cards py-20">
        <div className="container">
          <div className="category-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/herrklockor" className="category-card category-card--men group overflow-hidden">
              <div className="category-card-body">
                <h3 className="category-card-title">{t.menWatches}</h3>
                <p className="category-card-sub">Klassiska &amp; sportiga</p>
                <span className="category-card-cta">Utforska &rarr;</span>
              </div>
            </Link>
            <Link href="/damklockor" className="category-card category-card--women group overflow-hidden">
              <div className="category-card-body">
                <h3 className="category-card-title">{t.womenWatches}</h3>
                <p className="category-card-sub">Eleganta &amp; moderna</p>
                <span className="category-card-cta">Utforska &rarr;</span>
              </div>
            </Link>
            <Link href="/nyheter" className="category-card category-card--new group overflow-hidden">
              <div className="category-card-body">
                <h3 className="category-card-title">{t.newArrivals}</h3>
                <p className="category-card-sub">Senaste kollektionen</p>
                <span className="category-card-cta">Se nyheter &rarr;</span>
              </div>
            </Link>
            <Link href="/rea" className="category-card category-card--sale group overflow-hidden">
              <div className="category-card-body">
                <h3 className="category-card-title">{t.sale}</h3>
                <p className="category-card-sub" style={{ color: "rgba(200,169,110,0.65)" }}>Upp till 50% rabatt</p>
                <span className="category-card-cta">Se erbjudanden &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="product-highlights py-20 bg-bg-secondary/30">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-accent uppercase tracking-[0.2em] text-sm font-bold mb-2 block">Utvalda</span>
              <h2 className="text-3xl md:text-4xl font-bold">{t.bestSellers}</h2>
            </div>
            <Link href="/klockor" className="text-sm font-bold uppercase tracking-wider border-b-2 border-accent pb-1 hover:text-accent transition-colors">
              Se alla klockor
            </Link>
          </div>
          
          <div className="product-grid grid grid-cols-2 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => {
                const price = product.variants[0]?.calculated_price;
                return (
                  <Link
                    key={product.id}
                    href={`/produkter/${product.handle}`}
                    className="product-card group"
                  >
                    <div className="image-placeholder aspect-[4/5] relative bg-white overflow-hidden rounded-none">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <span className="text-text-muted">Ingen bild</span>
                      )}
                    </div>
                    <div className="product-info pt-6">
                      <span className="text-[10px] uppercase tracking-widest text-text-muted mb-1 block">ORIN Premium</span>
                      <h3 className="text-base font-bold mb-1 group-hover:text-accent transition-colors">{product.title}</h3>
                      {price && (
                        <span className="text-sm font-semibold">{formatPriceRaw(price.calculated_amount / 100)}</span>
                      )}
                    </div>
                  </Link>
                );
              })
            ) : (
              /* Placeholders shown when catalog is empty */
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="product-card-placeholder group animate-pulse">
                  <div className="image-placeholder aspect-[4/5] bg-gray-200" />
                  <div className="product-info pt-6">
                    <div className="h-2 w-16 bg-gray-200 mb-2" />
                    <div className="h-4 w-32 bg-gray-200 mb-2" />
                    <div className="h-4 w-20 bg-gray-200" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section py-20 border-y border-border bg-white">
        <div className="container">
          <div className="trust-grid grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="trust-item flex flex-col items-center">
              <div className="w-12 h-12 mb-6 text-accent">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-3">{t.freeShipping}</h4>
              <p className="text-sm text-text-muted leading-relaxed">Fri frakt på alla beställningar över 499 kr inom hela Sverige.</p>
            </div>
            <div className="trust-item flex flex-col items-center">
              <div className="w-12 h-12 mb-6 text-accent">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-3">{t.openPurchase}</h4>
              <p className="text-sm text-text-muted leading-relaxed">Handla tryggt med 30 dagars öppet köp och smidiga returer.</p>
            </div>
            <div className="trust-item flex flex-col items-center">
              <div className="w-12 h-12 mb-6 text-accent">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-3">Snabb Leverans</h4>
              <p className="text-sm text-text-muted leading-relaxed">Beställ före kl. 14:00 så skickar vi din klocka samma vardag.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
