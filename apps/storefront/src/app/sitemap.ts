import { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"
import { listRegions } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { listCollections } from "@lib/data/collections"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ]

  try {
    const regions = await listRegions()
    if (!regions?.length) return staticRoutes

    const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "se"

    const [productsData, collectionsData] = await Promise.all([
      listProducts({
        countryCode: DEFAULT_REGION,
        queryParams: { limit: 100, fields: "handle,updated_at" },
      }).catch(() => null),
      listCollections({ fields: "handle,updated_at", limit: "100" }).catch(() => null),
    ])

    const storeRoutes: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/store`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
    ]

    const productRoutes: MetadataRoute.Sitemap = (productsData?.response.products ?? [])
      .filter((p) => p.handle)
      .map((p) => ({
        url: `${baseUrl}/products/${p.handle}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }))

    const collectionRoutes: MetadataRoute.Sitemap = (collectionsData?.collections ?? [])
      .filter((c) => c.handle)
      .map((c) => ({
        url: `${baseUrl}/collections/${c.handle}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      }))

    return [...staticRoutes, ...storeRoutes, ...productRoutes, ...collectionRoutes]
  } catch {
    return staticRoutes
  }
}
