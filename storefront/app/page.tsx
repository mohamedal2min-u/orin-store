import { t } from "@/lib/translations";
import { medusaFetch } from "@/lib/medusa";
import { MedusaProduct, ProductListResponse } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";

function formatPrice(product: MedusaProduct): string {
  const price = product.variants[0]?.calculated_price
  if (!price) return ""
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: price.currency_code.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(price.calculated_amount / 100)
}

async function getFeaturedProducts(): Promise<MedusaProduct[]> {
  try {
    const data = await medusaFetch<ProductListResponse>(
      "/store/products?limit=4&fields=id,title,handle,thumbnail,+variants.calculated_price"
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
      <section className="hero-banner">
        <div className="container">
          <div className="hero-content">
            <h1>Upptäck Tidlös Elegans</h1>
            <p>Premiumklockor för varje tillfälle</p>
            <Link href="/herrklockor" className="btn-primary">Shoppa Nu</Link>
          </div>
        </div>
      </section>

      {/* Featured Brands */}
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

      {/* Category Cards */}
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

      {/* Product Highlights */}
      <section className="product-highlights">
        <div className="container">
          <h2>{t.bestSellers}</h2>
          <div className="product-grid">
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product.id}
                  href={`/produkter/${product.handle}`}
                  className="product-card"
                >
                  <div className="image-placeholder">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        width={300}
                        height={300}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    ) : (
                      <span>Bild</span>
                    )}
                  </div>
                  <div className="product-info">
                    <h3 className="title">{product.title}</h3>
                    {formatPrice(product) && (
                      <span className="price">{formatPrice(product)}</span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              /* Placeholders shown when catalog is empty */
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="product-card-placeholder">
                  <div className="image-placeholder">Bild</div>
                  <div className="product-info">
                    <span className="brand">Märke</span>
                    <h3 className="title">Klockmodell {item}</h3>
                    <span className="price">1 499 kr</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Trust Section */}
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
