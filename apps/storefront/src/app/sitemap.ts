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

    const countryCodes = regions
      .flatMap((r) => r.countries?.map((c) => c.iso_2) ?? [])
      .filter(Boolean) as string[]

    const storeRoutes: MetadataRoute.Sitemap = countryCodes.map((code) => ({
      url: `${baseUrl}/${code}/store`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }))

    const primaryCode = countryCodes[0]

    const [productsData, collectionsData] = await Promise.all([
      listProducts({
        countryCode: primaryCode,
        queryParams: { limit: 100, fields: "handle,updated_at" },
      }).catch(() => null),
      listCollections({ fields: "handle,updated_at", limit: "100" }).catch(() => null),
    ])

    const productRoutes: MetadataRoute.Sitemap = countryCodes.flatMap((code) =>
      (productsData?.response.products ?? [])
        .filter((p) => p.handle)
        .map((p) => ({
          url: `${baseUrl}/${code}/products/${p.handle}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
    )

    const collectionRoutes: MetadataRoute.Sitemap = countryCodes.flatMap(
      (code) =>
        (collectionsData?.collections ?? [])
          .filter((c) => c.handle)
          .map((c) => ({
            url: `${baseUrl}/${code}/collections/${c.handle}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
          }))
    )

    return [...staticRoutes, ...storeRoutes, ...productRoutes, ...collectionRoutes]
  } catch {
    return staticRoutes
  }
}
