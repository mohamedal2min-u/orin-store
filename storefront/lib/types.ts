export type ProductVariantPrice = {
  calculated_amount: number
  currency_code: string
  original_amount: number
}

export type ProductVariant = {
  id: string
  calculated_price?: ProductVariantPrice
}

export type MedusaProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  variants: ProductVariant[]
}

export type ProductListResponse = {
  products: MedusaProduct[]
  count: number
  offset: number
  limit: number
}
