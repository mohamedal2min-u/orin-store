import { Text, clx } from "@modules/common/components/ui"
import { VariantPrice } from "types/global"

function formatAmount(amount: number): string {
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function formatSavings(amount: number): string {
  const rounded = Math.round(amount)
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  return `Spara ${formatted},-`
}

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  const isSale = price.price_type === "sale"

  return (
    <div className="flex flex-col gap-y-0.5 mt-auto">
      <div className="flex items-center gap-x-2 flex-wrap">
        {/* Main price */}
        <div className="flex items-baseline gap-x-0.5">
          <span
            className={clx("text-[20px] font-bold leading-none", {
              "text-[#E53935]": isSale,
              "text-[#1a1a1a]": !isSale,
            })}
            data-testid="price"
          >
            {formatAmount(price.calculated_price_number)}
          </span>
          <span className={clx("text-[12px] font-normal lowercase", {
              "text-[#E53935]": isSale,
              "text-[#757575]": !isSale,
          })}>
            kr.
          </span>
        </div>

        {isSale && (
          <div className="flex items-baseline gap-x-0.5 text-[#9E9E9E] line-through text-[12px] ml-1">
            <span>{formatAmount(price.original_price_number)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
