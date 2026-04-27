import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({ product })

  // More robust brand extraction
  const brandCandidate = product.collection?.title || product.type?.value || product.subtitle || ""
  const brand = brandCandidate.length > 25 ? brandCandidate.split(" ")[0] : brandCandidate

  // Robust size extraction
  const sizeFromTitle = product.title?.match(/\d+\s*mm/i)?.[0]
  const size = (product.metadata?.size as string) || (product.metadata?.specifications as any)?.["Boettstorlek"] || sizeFromTitle || ""

  const discount = cheapestPrice?.percentage_diff || 0
  const rating = (product.metadata?.rating as string) || "5.0"
  const isPremium = product.tags?.some(t => t.value?.toLowerCase() === "premium") || product.metadata?.is_premium === "true"

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex flex-col bg-white rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
      aria-label={`${brand} ${product.title}`}
      data-testid="product-wrapper"
    >
      {/* Image container - Full bleed */}
      <div className="relative aspect-[4/5] w-full bg-transparent flex items-center justify-center overflow-hidden">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          isFeatured={isFeatured}
          alt={product.title ?? ""}
          className="!bg-transparent object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges - Moved down slightly */}
        <div className="absolute top-2 left-0 right-0 flex justify-between items-start z-10">
          {discount > 0 ? (
            <span className="bg-[#E53935] text-white text-[10px] font-bold px-2 py-1 rounded-br-sm shadow-sm">
              {discount}% Deal
            </span>
          ) : isPremium ? (
            <span className="bg-white/90 text-[#1a1a1a] text-[10px] font-bold px-2 py-1 rounded-br-sm shadow-sm border-b border-r border-gray-100">
              Premium
            </span>
          ) : <div />}
          
          <div className="flex items-center gap-1.5 p-1 pr-0 mr-3 mt-0.5">
             <span className="text-[#1a1a1a] text-[13px] font-bold">★</span>
             <span className="text-[#1a1a1a] text-[13px] font-bold">{rating}</span>
          </div>
        </div>

        {/* Size Badge (Bottom Right of Image) */}
        {size && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="bg-white/95 border border-gray-200 text-[#1a1a1a] text-[10px] font-bold px-2 py-1 rounded-full shadow-sm whitespace-nowrap">
              {size}
            </span>
          </div>
        )}
      </div>

      {/* Card info - with padding */}
      <div className="flex flex-col gap-1 p-4 pt-3 mt-auto">
        {brand && (
          <span className="text-[15px] font-bold uppercase text-[#1a1a1a] tracking-tight truncate" title={brand}>
            {brand}
          </span>
        )}

        <p
          className="text-[13px] text-[#757575] font-normal leading-tight truncate"
          data-testid="product-title"
        >
          {product.title}
        </p>

        <div className="mt-2">
          {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
        </div>
      </div>
    </LocalizedClientLink>
  )
}
