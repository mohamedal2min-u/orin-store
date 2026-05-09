export type ProductVariantPrice = {
  calculated_amount: number
  currency_code: string
  original_amount: number
}

export type ProductVariant = {
  id: string
  sku?: string
  calculated_price?: ProductVariantPrice
  inventory_quantity?: number
}

export type MedusaProduct = {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  description: string | null
  images?: { id: string; url: string }[]
  variants: ProductVariant[]
  metadata?: Record<string, string | null | undefined>
  tags?: { id: string; value: string }[]
}

export type ProductListResponse = {
  products: MedusaProduct[]
  count: number
  offset: number
  limit: number
}

export type CartShippingAddress = {
  first_name: string | null
  last_name: string | null
  address_1: string | null
  address_2: string | null
  city: string | null
  postal_code: string | null
  country_code: string | null
  phone: string | null
}

export type CartLineItem = {
  id: string
  title: string
  subtitle: string | null
  thumbnail: string | null
  quantity: number
  unit_price: number
  total: number
  variant_id: string | null
  variant?: {
    id: string
    product_id?: string
    product?: {
      id: string
      thumbnail: string | null
      images?: { url: string }[]
    }
  } | null
}

export type MedusaCart = {
  id: string
  email: string | null
  items: CartLineItem[]
  shipping_address: CartShippingAddress | null
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  region_id: string | null
}

export type ShippingOption = {
  id: string
  name: string
  amount: number
  provider_id: string
}
