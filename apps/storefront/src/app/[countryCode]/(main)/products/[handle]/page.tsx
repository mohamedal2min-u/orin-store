import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"
import { HttpTypes } from "@medusajs/types"
import { getBaseURL } from "@lib/util/env"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100, fields: "handle" },
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
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
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

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
  product: HttpTypes.StoreProduct,
  countryCode: string
): Record<string, unknown> {
  const baseUrl = getBaseURL()
  const url = `${baseUrl}/${countryCode}/products/${product.handle}`

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
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  if (!pricedProduct) {
    notFound()
  }

  const jsonLd = buildProductJsonLd(pricedProduct, params.countryCode)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductTemplate
        product={pricedProduct}
        region={region}
        countryCode={params.countryCode}
        images={images ?? []}
      />
    </>
  )
}
