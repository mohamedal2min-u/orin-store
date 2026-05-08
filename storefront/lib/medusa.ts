const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? 'http://localhost:9000'
const KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? ''

export async function medusaFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': KEY,
      ...init?.headers,
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) {
    throw new Error(`Medusa ${path} → ${res.status}`)
  }
  return res.json()
}
