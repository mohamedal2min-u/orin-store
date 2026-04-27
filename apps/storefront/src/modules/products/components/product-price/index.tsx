import { clx } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

function formatAmount(amount: number): string {
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function formatSavings(amount: number): string {
  const rounded = Math.round(amount)
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `Spara ${formatted},-`
}

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-[#eee] animate-pulse rounded" />
  }

  const isSale = selectedPrice.price_type === "sale"
  const savings = isSale
    ? selectedPrice.original_price_number - selectedPrice.calculated_price_number
    : 0

  return (
    <div className="flex items-center gap-x-3 flex-wrap">
      {!variant && !isSale && (
        <span className="text-[14px] text-[#757575] mr-1">Från</span>
      )}

      {/* Main price */}
      <div className="flex items-baseline gap-x-1">
        <span
          className={clx("text-[32px] small:text-[38px] font-bold leading-none", {
            "text-[#E53935]": isSale,
            "text-[#1a1a1a]": !isSale,
          })}
          data-testid="product-price"
        >
          {formatAmount(selectedPrice.calculated_price_number)}
        </span>
        <span className="text-[18px] text-[#757575] font-normal lowercase">
          kr
        </span>
      </div>

      {isSale && (
        <div className="flex items-center gap-x-3">
          {/* Original price */}
          <div className="flex items-baseline gap-x-1 text-[#9E9E9E] line-through text-[18px]">
            <span>{formatAmount(selectedPrice.original_price_number)}</span>
            <span className="text-[14px] no-underline">kr</span>
          </div>

          {/* Spara badge */}
          <span className="bg-[#E53935] text-white text-[13px] font-bold px-2 py-[4px] rounded-[4px] leading-none">
            {formatSavings(savings)}
          </span>
        </div>
      )}
    </div>
  )
}
