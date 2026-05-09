import { t } from "@/lib/translations";
import { medusaFetch } from "@/lib/medusa";
import { MedusaProduct, ProductListResponse } from "@/lib/types";
import Link from "next/link";
import { ProductCard, ProductCardSkeleton } from "@/components/product-card";
import { TruckIcon, SwapIcon, ShieldIcon } from "@/components/icons/icons";
async function getFeaturedProducts(): Promise<MedusaProduct[]> {
  try {
    const data = await medusaFetch<ProductListResponse>(
      "/store/products?limit=4&fields=id,title,handle,thumbnail,metadata,tags,%2Bimages.id,%2Bimages.url,%2Bvariants.calculated_price&region_id=reg_01KR4NAMQR05YZNFWJFZY7BXS0"
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
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {products.length > 0 ? (
              products.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 2} />
              ))
            ) : (
              [1, 2, 3, 4].map((item) => (
                <ProductCardSkeleton key={item} />
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
                <TruckIcon size={48} strokeWidth={1.2} />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-3">{t.freeShipping}</h4>
              <p className="text-sm text-text-muted leading-relaxed">Fri frakt på alla beställningar över 499 kr inom hela Sverige.</p>
            </div>
            <div className="trust-item flex flex-col items-center">
              <div className="w-12 h-12 mb-6 text-accent">
                <SwapIcon size={48} strokeWidth={1.2} />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-3">{t.openPurchase}</h4>
              <p className="text-sm text-text-muted leading-relaxed">Handla tryggt med 30 dagars öppet köp och smidiga returer.</p>
            </div>
            <div className="trust-item flex flex-col items-center">
              <div className="w-12 h-12 mb-6 text-accent">
                <ShieldIcon size={48} strokeWidth={1.2} />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest mb-3">Tryggt Köp</h4>
              <p className="text-sm text-text-muted leading-relaxed">Säker betalning och snabb leverans direkt till din dörr.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
