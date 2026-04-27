import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreFilterWrapper from "@modules/store/components/store-filter-wrapper"
import CategoryCircles from "@modules/store/components/category-circles"
import { listProducts } from "@lib/data/products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Fetch product count for the filter bar
  const { response: { count } } = await listProducts({ 
    countryCode, 
    queryParams: { limit: 1 } 
  })

  return (
    <div className="min-h-screen bg-kv-bg">
      {/* ── Category Circles ── */}
      <div className="content-container pt-6 pb-2">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-kv-border/30 px-6 py-5">
          <CategoryCircles />
        </div>
      </div>

      {/* ── Filter Bar + Products ── */}
      <div className="content-container pb-16">
        <StoreFilterWrapper sortBy={sort} productCount={count} />
        
        <div className="w-full min-w-0">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
