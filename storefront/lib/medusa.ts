const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'
const KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ''

export async function medusaFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } }
): Promise<T> {
  const { next, ...fetchInit } = init ?? {}
  const res = await fetch(`${BASE}${path}`, {
    ...fetchInit,
    signal: AbortSignal.timeout(5000),
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': KEY,
      ...fetchInit?.headers,
    },
    next: next ?? { revalidate: 60 },
  })
  if (!res.ok) {
    throw new Error(`Medusa ${path} → ${res.status}`)
  }
  return res.json()
}
