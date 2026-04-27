import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import InteractiveLink from "@modules/common/components/interactive-link"

export default async function FeaturedProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  // Fetch latest products regardless of collection for a stunning homepage showcase
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      limit: 8,
      order: "-created_at",
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts || pricedProducts.length === 0) {
    return null
  }

  return (
    <div className="w-full">
      <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-12">
        {pricedProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} isFeatured />
          </li>
        ))}
      </ul>
      <div className="flex justify-center mt-16">
        <InteractiveLink href={`/store`} className="text-kv-primary hover:text-kv-accent text-[13px] tracking-widest font-semibold uppercase">
          Visa alla klockor
        </InteractiveLink>
      </div>
    </div>
  )
}
