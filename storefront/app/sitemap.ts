import type { MetadataRoute } from "next";
import { medusaFetch } from "@/lib/medusa";
import type { ProductListResponse } from "@/lib/types";

const BASE_URL = "https://orin.se";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  },
  { url: `${BASE_URL}/herrklockor`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/damklockor`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${BASE_URL}/rea`, changeFrequency: "daily", priority: 0.8 },
  { url: `${BASE_URL}/marken`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/nyheter`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/klockor`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${BASE_URL}/om-oss`, changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.4 },
  { url: `${BASE_URL}/returer`, changeFrequency: "monthly", priority: 0.3 },
  { url: `${BASE_URL}/villkor`, changeFrequency: "monthly", priority: 0.3 },
  {
    url: `${BASE_URL}/integritet`,
    changeFrequency: "monthly",
    priority: 0.3,
  },
];

export const revalidate = 3600; // regenerate sitemap at most once per hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const data = await medusaFetch<ProductListResponse>(
      "/store/products?limit=500&fields=handle",
      { next: { revalidate: 3600 } }
    );
    productRoutes = data.products.map((p) => ({
      url: `${BASE_URL}/produkter/${p.handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // Medusa unavailable (e.g. during CI build) — return static routes only
  }

  return [...STATIC_ROUTES, ...productRoutes];
}
