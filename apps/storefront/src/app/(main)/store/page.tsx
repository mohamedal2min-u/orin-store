import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Alla Klockor",
  description:
    "Utforska ORIN:s urval av armbandsur från välkända varumärken. Tydliga priser, trygg betalning och leverans inom Sverige.",
  openGraph: {
    title: "Alla Klockor — ORIN",
    description:
      "Utforska vårt kurerade urval av armbandsur med tydliga priser och trygg leverans inom Sverige.",
  },
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    collection?: string
  }>
}

export default async function StorePage(props: Params) {
  const searchParams = await props.searchParams;
  const { sortBy, page, category, collection } = searchParams
  const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "se"

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={DEFAULT_REGION}
      categoryHandle={category}
      collectionHandle={collection}
    />
  )
}
