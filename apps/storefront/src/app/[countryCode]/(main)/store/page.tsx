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
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
