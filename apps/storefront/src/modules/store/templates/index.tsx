import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreFilterWrapper from "@modules/store/components/store-filter-wrapper"
import CategoryCircles from "@modules/store/components/category-circles"
import { listProducts } from "@lib/data/products"
import { getCategoryByHandle } from "@lib/data/categories"
import { getCollectionByHandle } from "@lib/data/collections"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categoryHandle,
  collectionHandle,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryHandle?: string
  collectionHandle?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  // Resolve category/collection IDs from handles in parallel
  const [categoryData, collectionData] = await Promise.all([
    categoryHandle ? getCategoryByHandle([categoryHandle]) : null,
    collectionHandle ? getCollectionByHandle(collectionHandle) : null,
  ])

  const categoryId = categoryData?.id
  const collectionId = collectionData?.id

  // Fetch product count with active filters
  const { response: { count } } = await listProducts({
    countryCode,
    queryParams: {
      limit: 1,
      ...(categoryId && { category_id: [categoryId] }),
      ...(collectionId && { collection_id: [collectionId] }),
    },
  })

  return (
    <div className="min-h-screen bg-kv-bg">
      {/* ── Category Circles ── */}
      <div className="content-container pt-6 pb-2">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-kv-border/30 px-6 py-5">
          <Suspense fallback={<div className="h-[100px]" />}>
            <CategoryCircles />
          </Suspense>
        </div>
      </div>

      {/* ── Filter Bar + Products ── */}
      <div className="content-container pb-16">
        <Suspense fallback={<div className="h-16 border-b border-kv-border/60 mb-8" />}>
          <StoreFilterWrapper sortBy={sort} productCount={count} />
        </Suspense>

        <div className="w-full min-w-0">
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
              categoryId={categoryId}
              collectionId={collectionId}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default StoreTemplate
