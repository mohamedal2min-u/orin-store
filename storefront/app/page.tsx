import { t } from "@/lib/translations";
import Link from "next/link";

export default function Home() {
  return (
    <div className="home-page">
      {/* 3. Hero Banner */}
      <section className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <h1>Upptäck Tidlös Elegans</h1>
            <p>Premiumklockor för varje tillfälle</p>
            <Link href="/herrklockor" className="btn-primary">Shoppa Nu</Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Brands (Placeholder) */}
      <section className="featured-brands">
        <div className="container">
          <h2 className="sr-only">{t.brands}</h2>
          <div className="brand-grid">
            <div className="brand-placeholder">Märke 1</div>
            <div className="brand-placeholder">Märke 2</div>
            <div className="brand-placeholder">Märke 3</div>
            <div className="brand-placeholder">Märke 4</div>
          </div>
        </div>
      </section>

      {/* 5. Category Cards */}
      <section className="category-cards">
        <div className="container">
          <div className="category-grid">
            <Link href="/herrklockor" className="category-card">
              <h3>{t.menWatches}</h3>
            </Link>
            <Link href="/damklockor" className="category-card">
              <h3>{t.womenWatches}</h3>
            </Link>
            <Link href="/nyheter" className="category-card">
              <h3>{t.newArrivals}</h3>
            </Link>
            <Link href="/rea" className="category-card">
              <h3 className="text-sale">{t.sale}</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Product Highlights (Placeholder) */}
      <section className="product-highlights">
        <div className="container">
          <h2>{t.bestSellers}</h2>
          <div className="product-grid">
            {/* Product Card Placeholders */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="product-card-placeholder">
                <div className="image-placeholder">Bild</div>
                <div className="product-info">
                  <span className="brand">Märke</span>
                  <h3 className="title">Klockmodell {item}</h3>
                  <span className="price">1 499 kr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <h4>{t.freeShipping}</h4>
              <p>På alla beställningar över 499 kr</p>
            </div>
            <div className="trust-item">
              <h4>{t.openPurchase}</h4>
              <p>Handla tryggt och säkert</p>
            </div>
            <div className="trust-item">
              <h4>Snabb Leverans</h4>
              <p>1-3 arbetsdagar</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
