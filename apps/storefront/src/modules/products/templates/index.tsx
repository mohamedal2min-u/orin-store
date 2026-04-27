import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import ProductSpecifications from "@modules/products/components/product-specifications"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  // Extract specs from flat metadata keys
  const specs: Record<string, string | number> = {}
  if (product.metadata?.watch_specs && typeof product.metadata.watch_specs === "object") {
    Object.assign(specs, product.metadata.watch_specs)
  }
  Object.entries(product.metadata || {}).forEach(([key, value]) => {
    if (key.startsWith("spec_") && (typeof value === "string" || typeof value === "number")) {
      const cleanKey = key.replace("spec_", "")
      specs[cleanKey] = value
    }
  })

  return (
    <>
      {/* ═══ TOP TRUST BAR — dark navy strip like ditur ═══ */}
      <div className="bg-[#1a2332] text-white">
        <div className="content-container flex items-center justify-center gap-x-6 small:gap-x-12 py-2 overflow-x-auto">
          <div className="flex items-center gap-x-1.5 whitespace-nowrap">
            <svg className="w-3.5 h-3.5 text-[#4CAF50]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <span className="text-[11px] font-medium tracking-wide">Fri frakt</span>
            <span className="text-[11px] text-white/60">över 1 000 kr*</span>
          </div>
          <div className="flex items-center gap-x-1.5 whitespace-nowrap">
            <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
            <span className="text-[11px] font-medium tracking-wide">14 dagars</span>
            <span className="text-[11px] font-bold tracking-wide">returrätt</span>
          </div>
          <div className="flex items-center gap-x-1.5 whitespace-nowrap">
            <svg className="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            <span className="text-[11px] text-white/60">Vi erbjuder</span>
            <span className="text-[11px] font-bold tracking-wide">prisgaranti</span>
          </div>
        </div>
      </div>

      {/* ═══ BREADCRUMB + delivery info row ═══ */}
      <div className="bg-white border-b border-[#e5e5e5]">
        <div className="content-container flex items-center justify-between py-2.5">
          <nav className="flex items-center gap-x-1.5 text-[12px] text-[#666]" aria-label="Brödsmulor">
            <a href="/" className="hover:text-[#333] transition-colors">🏠</a>
            <span className="text-[#ccc]">/</span>
            <a href="/store" className="hover:text-[#333] transition-colors">Varumärken</a>
            {product.collection && (
              <>
                <span className="text-[#ccc]">/</span>
                <a href={`/store?collection=${product.collection.handle}`} className="hover:text-[#333] transition-colors">
                  {product.collection.title}
                </a>
              </>
            )}
            <span className="text-[#ccc]">/</span>
            <span className="text-[#333] truncate max-w-[200px]">{product.title}</span>
          </nav>
          {/* Right: delivery info like ditur */}
          <div className="hidden small:flex items-center gap-x-6 text-[12px] text-[#666]">
            <div className="flex items-center gap-x-1.5">
              <svg className="w-4 h-4 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <span className="text-[#2196F3]">1-3 dagars leverans</span>
            </div>
            <div className="flex items-center gap-x-1.5">
              <svg className="w-4 h-4 text-[#666]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span className="text-[#2196F3]">14 dagars returrätt</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAIN PRODUCT AREA — 2-column like ditur ═══ */}
      <div className="bg-[#f0f2f5]">
        <div
          className="content-container flex flex-col small:flex-row py-6 small:py-8 gap-y-6 gap-x-8 relative"
          data-testid="product-container"
        >
          {/* ──── LEFT COLUMN: Image + Accordions ──── */}
          <div className="w-full small:w-[58%]">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg overflow-hidden">
              <ImageGallery images={images} productTitle={product.title ?? ""} />
            </div>

            {/* Accordion Tabs — UNDER the image like ditur */}
            <div className="bg-white rounded-lg mt-2 px-6">
              <ProductTabs product={product} />
            </div>
          </div>

          {/* ──── RIGHT COLUMN: Product info ──── */}
          <div className="flex flex-col small:sticky small:top-20 w-full small:w-[42%] gap-y-4 self-start">

            {/* White card: Brand + Title + Stock */}
            <div className="bg-white rounded-lg p-6">
              <ProductInfo product={product} />
            </div>

            {/* White card: Price + CTA */}
            <div className="bg-white rounded-lg p-6">
              <Suspense
                fallback={
                  <ProductActions
                    disabled={true}
                    product={product}
                    region={region}
                  />
                }
              >
                <ProductActionsWrapper id={product.id} region={region} />
              </Suspense>
            </div>

            {/* White card: Trust info */}
            <div className="bg-white rounded-lg p-5 flex flex-col gap-y-3">
              <div className="flex items-center gap-x-3">
                <svg className="w-5 h-5 text-[#4CAF50] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <div>
                  <span className="text-[13px] font-medium text-[#333]">Fri frakt</span>
                  <span className="text-[12px] text-[#888] ml-1">över 1 000 kr</span>
                </div>
              </div>
              <div className="w-full h-px bg-[#eee]" />
              <div className="flex items-center gap-x-3">
                <svg className="w-5 h-5 text-[#2196F3] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                <div>
                  <span className="text-[13px] font-medium text-[#333]">14 dagars returrätt</span>
                </div>
              </div>
              <div className="w-full h-px bg-[#eee]" />
              <div className="flex items-center gap-x-3">
                <svg className="w-5 h-5 text-[#FF9800] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <div>
                  <span className="text-[13px] font-medium text-[#333]">2 års garanti</span>
                  <span className="text-[12px] text-[#888] ml-1">— 100% äkta</span>
                </div>
              </div>
              <div className="w-full h-px bg-[#eee]" />
              <div className="flex items-center gap-x-3">
                <svg className="w-5 h-5 text-[#666] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <div>
                  <span className="text-[13px] font-medium text-[#333]">Säker betalning</span>
                  <span className="text-[12px] text-[#888] ml-1">— SSL-krypterad</span>
                </div>
              </div>
            </div>

            <ProductOnboardingCta />
          </div>
        </div>
      </div>

      {/* ═══ SPECIFICATIONS — full width section ═══ */}
      <ProductSpecifications specs={specs} />

      {/* ═══ RELATED — "Rekommenderas för dig" like ditur ═══ */}
      <div
        className="content-container my-12 small:my-16"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
