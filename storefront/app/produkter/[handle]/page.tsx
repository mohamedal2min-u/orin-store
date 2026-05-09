import { cache } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { medusaFetch } from "@/lib/medusa";
import type { MedusaProduct, ProductListResponse } from "@/lib/types";
import { formatPriceParts } from "@/lib/locale";
import { AddToCartButton } from "./add-to-cart-button";
import { ProductGallery } from "./product-gallery";
import { TrustBadge, TrustBadgeInline } from "@/components/trust/trust-badge";
import { TruckIcon, SwapIcon, ShieldIcon } from "@/components/icons/icons";
const REGION_ID = "reg_01KR4NAMQR05YZNFWJFZY7BXS0";

// cache() deduplicates this fetch across generateMetadata + ProductPage
// which both call getProduct with the same handle in the same render pass.
const getProduct = cache(async (handle: string): Promise<MedusaProduct | null> => {
  try {
    const data = await medusaFetch<ProductListResponse>(
      `/store/products?handle=${encodeURIComponent(handle)}&fields=id,title,handle,thumbnail,description,metadata,%2Bimages.id,%2Bimages.url,%2Bvariants.calculated_price,%2Bt_product_tags,%2Bvariants.sku,%2Bvariants.inventory_quantity&region_id=${REGION_ID}`,
      { next: { revalidate: 300, tags: [`product-${handle}`] } }
    );
    return data.products[0] ?? null;
  } catch {
    return null;
  }
});

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return { title: "Produkt hittades inte | ORIN" };

  const title = product.metadata?.meta_title || `${product.title} | ORIN Sverige`;
  const description =
    product.metadata?.meta_description ||
    product.description ||
    `Köp ${product.title} hos ORIN. Premiumklockor med fri frakt och 30 dagars öppet köp.`;
  const ogImage =
    product.thumbnail ?? product.images?.[0]?.url ?? null;
  const images = ogImage ? [ogImage] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://orin.se/produkter/${handle}`,
      siteName: "ORIN",
      images: images.map((url) => ({ url, width: 1080, height: 1080, alt: product.title })),
      locale: "sv_SE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
    alternates: {
      canonical: `https://orin.se/produkter/${handle}`,
    },
  };
}

const SPEC_LABELS: Record<string, string> = {
  ref_nr: "Referensnummer",
  brand: "Märke",
  series: "Serie",
  gender: "Kön",
  movement_type: "Urverkstyp",
  movement: "Urverk",
  power_reserve: "Kraftreserv",
  jewels: "Stenar",
  diameter: "Diameter",
  thickness: "Tjocklek",
  water_resistance: "Vattentålighet",
  glass: "Glas",
  caseback: "Bakstycke",
  warranty: "Garanti",
  manufacturer: "Tillverkare",
};

export default async function ProductPage({ params }: Props) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) notFound();

  const variant = product.variants[0];
  const price = variant?.calculated_price;
  const priceParts = price ? formatPriceParts(price.calculated_amount / 100) : null;
  const specs = product.metadata
    ? Object.entries(SPEC_LABELS).filter(([key]) => product.metadata![key])
    : [];

  const images = product.images?.length
    ? product.images
    : product.thumbnail
      ? [{ id: "thumb", url: product.thumbnail }]
      : [];

  // Treat unknown inventory as in-stock (optimistic); only mark OutOfStock when
  // inventory_quantity is explicitly 0.
  const inStock =
    variant?.inventory_quantity === undefined || variant.inventory_quantity > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: images.map((img) => img.url),
    description: product.description || product.title,
    sku: variant?.sku ?? product.handle,
    brand: {
      "@type": "Brand",
      name: product.metadata?.brand || "ORIN",
    },
    offers: {
      "@type": "Offer",
      url: `https://orin.se/produkter/${product.handle}`,
      priceCurrency: "SEK",
      price: price ? price.calculated_amount / 100 : 0,
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "ORIN",
      },
    },
  };

  return (
    <div className="min-h-screen bg-bg-secondary pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Top Bar (Breadcrumb + Delivery) */}
      <div className="container py-4 flex items-center justify-between">

        {/* Left: Back button + Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link
            href="/marken"
            className="w-8 h-8 flex items-center justify-center bg-white border border-border rounded shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Gå tillbaka"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>

          <nav className="flex items-center gap-2 text-[13px] font-medium text-text-muted">
            <Link href="/" className="hover:text-text transition-colors flex items-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </Link>
            <span className="text-border-dark">/</span>
            <Link href="/marken" className="hover:text-text transition-colors">
              Varumärken
            </Link>
            <span className="text-border-dark">/</span>
            <Link
              href={`/marken/${product.metadata?.brand?.toLowerCase() || "brand"}`}
              className="hover:text-text transition-colors"
            >
              {product.metadata?.brand || "Märke"}
            </Link>
            <span className="text-border-dark">/</span>
            <span className="text-text truncate max-w-[200px]">{product.title}</span>
          </nav>
        </div>

        {/* Right: Delivery info */}
        <div className="hidden lg:flex items-center gap-6">
          <TrustBadgeInline 
            icon={<TruckIcon size={16} strokeWidth={1.5} />}
            title="1-2 dagars leverans"
          />
          <TrustBadgeInline 
            icon={<SwapIcon size={16} strokeWidth={1.5} />}
            title="30 dagars öppet köp"
          />
        </div>
      </div>

      <section className="container">
        <div className="bg-white rounded-xl shadow-sm border border-border p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-16">

            {/* Left: Image Gallery */}
            <div>
              <ProductGallery
                images={images}
                title={product.title}
                diameter={product.metadata?.diameter ?? undefined}
              />

              {/* Accordions */}
              <div className="mt-12 space-y-2">
                <details className="group border border-border rounded-lg bg-bg-secondary/50 overflow-hidden" open>
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-sm uppercase tracking-wider p-5 hover:bg-bg-secondary transition-colors">
                    Produktinformation
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </summary>
                  <div className="text-sm text-text-muted leading-relaxed p-5 pt-0">
                    {product.description || "Ingen beskrivning tillgänglig."}
                  </div>
                </details>

                {specs.length > 0 && (
                  <details className="group border border-border rounded-lg bg-bg-secondary/50 overflow-hidden">
                    <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-sm uppercase tracking-wider p-5 hover:bg-bg-secondary transition-colors">
                      Specifikationer
                      <span className="transition-transform duration-300 group-open:rotate-180">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </summary>
                    <div className="p-5 pt-0">
                      <dl className="divide-y divide-border/50 text-sm">
                        {specs.map(([key, label]) => (
                          <div key={key} className="flex justify-between py-3 gap-4">
                            <dt className="text-text-muted">{label}</dt>
                            <dd className="font-medium text-right text-text">{product.metadata![key]}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </details>
                )}

                <details className="group border border-border rounded-lg bg-bg-secondary/50 overflow-hidden">
                  <summary className="flex justify-between items-center font-bold cursor-pointer list-none text-sm uppercase tracking-wider p-5 hover:bg-bg-secondary transition-colors">
                    Leverans &amp; Retur
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>
                  </summary>
                  <div className="text-sm text-text-muted leading-relaxed p-5 pt-0">
                    Vi erbjuder fri frakt på alla beställningar över 499 kr.
                    Din order skickas vanligtvis inom 24 timmar och levereras inom 1-2 arbetsdagar.
                    Du har alltid 30 dagars öppet köp när du handlar hos oss.
                  </div>
                </details>
              </div>
            </div>

            {/* Right: Info panel */}
            <div className="flex flex-col">

              {/* Brand & Title */}
              {product.metadata?.brand && (
                <span className="text-sm text-text-muted font-medium mb-1 uppercase tracking-widest">
                  {product.metadata.brand}
                </span>
              )}
              <h1 className="text-[28px] font-bold leading-tight mb-4 uppercase">
                {product.title}
              </h1>

              {/* Stock indicators */}
              <div className="space-y-1 mb-8 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                  <span>
                    Finns i lager i{" "}
                    <a href="#" className="underline font-medium hover:text-accent">
                      1 butik
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success"></span>
                  <span>Leverans inom 1-2 dagar</span>
                </div>
              </div>

              {/* Price box */}
              <div className="bg-white border border-border rounded-lg p-5 mb-6 shadow-sm">
                <div className="mb-4">
                  {priceParts ? (
                    <div className="flex items-baseline gap-1">
                      <span className="text-[40px] font-bold leading-none tracking-tight">
                        {priceParts.number}
                      </span>
                      <span className="text-xl font-bold">{priceParts.currency}.</span>
                    </div>
                  ) : (
                    <p className="text-text-muted text-sm">Kontakta oss för pris</p>
                  )}
                </div>

                <div className="bg-bg-secondary rounded flex items-center justify-center border border-border overflow-hidden p-2 min-h-[50px]">
                  <Script 
                    src="https://eu-library.klarnaservices.com/lib.js" 
                    strategy="lazyOnload" 
                    data-client-id={process.env.NEXT_PUBLIC_KLARNA_CLIENT_ID || "00000000-0000-0000-0000-000000000000"} 
                  />
                  <klarna-placement
                    data-key="credit-promotion-badge"
                    data-locale="sv-SE"
                    data-purchase-amount={price ? price.calculated_amount : 0}
                  ></klarna-placement>
                </div>
              </div>

              {/* Warranty selector (UI Mockup) */}
              <div className="mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold">Förlängd garanti</span>
                  <a href="#" className="text-xs underline flex items-center gap-1 text-text-muted hover:text-text">
                    Läs mer
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </a>
                </div>
                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  <label className="cursor-pointer">
                    <input type="radio" name="warranty" className="peer sr-only" defaultChecked />
                    <div className="border border-border rounded p-2 h-full flex flex-col justify-center peer-checked:border-text peer-checked:bg-bg-secondary transition-colors">
                      <span className="font-medium">Nej tack</span>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="warranty" className="peer sr-only" />
                    <div className="border border-border rounded p-2 h-full flex flex-col justify-center peer-checked:border-text transition-colors">
                      <span className="font-medium">1 år</span>
                      <span className="text-text-muted mt-1">432 kr</span>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="warranty" className="peer sr-only" />
                    <div className="border border-border rounded p-2 h-full flex flex-col justify-center peer-checked:border-text transition-colors">
                      <span className="font-medium">2 år</span>
                      <span className="text-text-muted mt-1">768 kr</span>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="warranty" className="peer sr-only" />
                    <div className="border border-border rounded p-2 h-full flex flex-col justify-center peer-checked:border-text transition-colors">
                      <span className="font-medium">3 år</span>
                      <span className="text-text-muted mt-1">1 008 kr</span>
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="warranty" className="peer sr-only" />
                    <div className="border border-border rounded p-2 h-full flex flex-col justify-center peer-checked:border-text transition-colors">
                      <span className="font-medium">5 år</span>
                      <span className="text-text-muted mt-1">1 440 kr</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <div className="flex-1">
                  <AddToCartButton variantId={variant?.id} />
                </div>
                <button
                  className="h-[52px] w-[52px] shrink-0 border border-border rounded flex items-center justify-center hover:bg-bg-secondary transition-colors"
                  aria-label="Lägg till i favoriter"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>
              </div>

              {/* Add-ons List (UI Mockup) */}
              <div className="space-y-2 mb-8">
                <label className="flex items-center justify-between p-3 border border-border rounded cursor-pointer hover:bg-bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">🛡️</div>
                    <span className="text-sm font-medium">Monterat glasskydd</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">+189 kr</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-border text-text focus:ring-0 cursor-pointer" />
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 border border-border rounded cursor-pointer hover:bg-bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">🎁</div>
                    <span className="text-sm font-medium">Presentinslagning</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">+49 kr</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-border text-text focus:ring-0 cursor-pointer" />
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 border border-border rounded cursor-pointer hover:bg-bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">✍️</div>
                    <span className="text-sm font-medium">Gravering</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">+149 kr</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-border text-text focus:ring-0 cursor-pointer" />
                  </div>
                </label>

                <label className="flex items-center justify-between p-3 border border-border rounded cursor-pointer hover:bg-bg-secondary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">✨</div>
                    <span className="text-sm font-medium">Ditur Watch Cleaning Set...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold">+299 kr</span>
                    <input type="checkbox" className="w-5 h-5 rounded border-border text-text focus:ring-0 cursor-pointer" />
                  </div>
                </label>
              </div>

              {/* PDP Trust Signals */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <TrustBadge 
                  icon={<TruckIcon size={20} strokeWidth={1.5} />}
                  title="Fri Frakt"
                  subtitle="Över 499 kr"
                  className="rounded-lg bg-bg-secondary/30"
                />
                <TrustBadge 
                  icon={<SwapIcon size={20} strokeWidth={1.5} />}
                  title="Öppet Köp"
                  subtitle="I 30 dagar"
                  className="rounded-lg bg-bg-secondary/30"
                />
                <TrustBadge 
                  icon={<ShieldIcon size={20} strokeWidth={1.5} />}
                  title="Garanti"
                  subtitle="Minst 2 år"
                  className="rounded-lg bg-bg-secondary/30"
                />
                <TrustBadge 
                  icon={<ShieldIcon size={20} strokeWidth={1.5} />}
                  title="Trygg e-handel"
                  subtitle="Säker betalning"
                  className="rounded-lg bg-bg-secondary/30"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
