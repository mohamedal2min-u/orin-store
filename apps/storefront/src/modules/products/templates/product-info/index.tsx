import { HttpTypes } from "@medusajs/types"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const brand = (product.metadata?.spec_Märke as string) || product.collection?.title

  return (
    <div id="product-info" className="flex flex-col gap-y-3">
      {/* Brand — like ditur: gray uppercase text */}
      {brand && (
        <span className="text-[13px] font-normal text-[#666] uppercase tracking-wide">
          {brand}
        </span>
      )}

      {/* Title — like ditur: large bold uppercase */}
      <h1
        className="text-[20px] small:text-[24px] font-bold uppercase text-[#1a1a1a] leading-tight tracking-[0.01em]"
        data-testid="product-title"
      >
        {product.title}
      </h1>

      {/* Stock indicators — like ditur: colored dots */}
      <div className="flex flex-col gap-y-1.5 mt-1">
        <div className="flex items-center gap-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4CAF50]" />
          <span className="text-[13px] text-[#333]">
            Finns i lager
          </span>
        </div>
        <div className="flex items-center gap-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFC107]" />
          <span className="text-[13px] text-[#333]">
            Skickas inom 1-3 arbetsdagar
          </span>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
