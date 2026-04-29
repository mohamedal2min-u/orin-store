import { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { getBaseURL } from "@lib/util/env"

// Memoize per-request to avoid duplicate API calls between generateMetadata and page render
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "se"

// Memoize per-request to avoid duplicate API calls between generateMetadata and page render
const getProduct = cache(async (handle: string) => {
  const { response } = await listProducts({
    countryCode: DEFAULT_REGION,
    queryParams: { handle },
  })
  return response.products[0] ?? null
})

const getCachedRegion = cache(async () => getRegion(DEFAULT_REGION))

type Props = {
  params: Promise<{ handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const { response } = await listProducts({
      countryCode: DEFAULT_REGION,
      queryParams: { limit: 100, fields: "handle" },
    })

    return response.products
      .map((product) => ({
        handle: product.handle,
      }))
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images!.map((i) => [i.id, true]))
  return product.images?.filter((i) => imageIdsMap.has(i.id)) ?? null
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getCachedRegion()

  if (!region) {
    notFound()
  }

  const product = await getProduct(handle)

  if (!product) {
    notFound()
  }

  const description =
    product.description?.trim() ||
    `Köp ${product.title} hos ORIN — tryggt, snabbt och med fri retur inom Sverige.`

  const ogImages = product.thumbnail
    ? [{ url: product.thumbnail, alt: product.title ?? "" }]
    : []

  return {
    title: product.title ?? "",
    description,
    openGraph: {
      title: product.title ?? "",
      description,
      images: ogImages,
      type: "website",
    },
  }
}

function buildProductJsonLd(
  product: HttpTypes.StoreProduct
): Record<string, unknown> {
  const baseUrl = getBaseURL()
  const url = `${baseUrl}/products/${product.handle}`

  const firstVariant = product.variants?.[0]
  const price = (firstVariant as any)?.calculated_price?.calculated_amount
  const currency = (firstVariant as any)?.calculated_price?.currency_code?.toUpperCase()

  const offerBlock =
    price !== undefined && currency
      ? {
          "@type": "Offer",
          price: (price / 100).toFixed(2),
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "ORIN" },
        }
      : undefined

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? undefined,
    image: product.images?.map((i) => i.url).filter(Boolean) ?? [],
    url,
    brand: product.subtitle
      ? { "@type": "Brand", name: product.subtitle }
      : undefined,
    ...(offerBlock ? { offers: offerBlock } : {}),
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getCachedRegion()
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProduct(params.handle)

  if (!pricedProduct) {
    notFound()
  }

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  const jsonLd = buildProductJsonLd(pricedProduct)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={DEFAULT_REGION}
        images={images ?? []}
      />
    </>
  )
}
