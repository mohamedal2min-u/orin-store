---
name: nextjs-storefront
description: Next.js App Router storefront for ORIN.SE. Covers custom Cloudflare image loader, standalone output, responsive images, and integration with Medusa v2 backend.
---

# Next.js Storefront — ORIN.SE

> Server-rendered storefront optimized for Swedish market. Images served via Cloudflare CDN, not VPS.

---

## When to Use

- Building or modifying storefront pages
- Configuring the image pipeline
- Optimizing performance (LCP, CLS, FCP)
- Adding new product displays or landing pages

---

## Core Configuration

### next.config.ts

```typescript
import type { NextConfig } from 'next'

const config: NextConfig = {
  output: 'standalone',       // Required for PM2 deployment on VPS
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudflare-loader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.orin.se' },
    ],
  },
}

export default config
```

### Key settings:
- **`output: 'standalone'`** — generates a self-contained build for VPS deployment (no need for full node_modules)
- **`loader: 'custom'`** — offloads image optimization to Cloudflare CDN instead of VPS CPU
- **`loaderFile`** — points to the custom Cloudflare loader

---

## Custom Image Loader

### `lib/cloudflare-loader.ts`

Two modes controlled by `NEXT_PUBLIC_USE_CF_RESIZING`:

#### Mode 1: Pre-generated Variants (MVP — Default)

Uses the 3 WebP variants created by Medusa's `image-variants` subscriber:
- `width ≤ 300` → `-thumb.webp`
- `width ≤ 600` → `-medium.webp`
- `else` → `-large.webp`

**Cost: $0** (sharp runs on VPS at upload time)

#### Mode 2: Cloudflare Image Resizing (Future)

Uses `/cdn-cgi/image/` URL transformation for on-the-fly resizing.

**Cost: Requires Cloudflare Pro plan (~$20/month)**

```typescript
type LoaderArgs = {
  src: string
  width: number
  quality?: number
}

export default function cloudflareLoader({
  src, width, quality,
}: LoaderArgs): string {
  if (process.env.NEXT_PUBLIC_USE_CF_RESIZING === 'true') {
    const params = [
      `width=${width}`,
      `quality=${quality || 80}`,
      'format=auto',
      'fit=scale-down',
    ].join(',')
    return `https://cdn.orin.se/cdn-cgi/image/${params}/${src}`
  }

  // Default: pre-generated variants
  const variant = width <= 300 ? 'thumb'
                : width <= 600 ? 'medium'
                : 'large'
  const variantSrc = src.replace(/\.[^.]+$/, `-${variant}.webp`)
  return `https://cdn.orin.se/${variantSrc}`
}
```

---

## Image Usage Pattern

```tsx
import Image from 'next/image'

<Image
  src={`products/${product.id}/${product.thumbnail}`}
  alt={product.title}
  width={600}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={isAboveFold}
/>
```

### Rules for `<Image>`:
1. `src` is always a **relative path** within the R2 bucket (e.g., `products/abc/main.webp`)
2. Always provide `sizes` attribute for responsive images
3. Mark above-the-fold images with `priority={true}`
4. Never use absolute URLs in `src` — the loader adds the CDN domain

---

## Environment Variables

```env
# Medusa Backend URL
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000

# Image pipeline mode
NEXT_PUBLIC_USE_CF_RESIZING=false  # Set to 'true' when upgrading to Pro plan

# CDN domain (used in loader)
NEXT_PUBLIC_CDN_URL=https://cdn.orin.se
```

---

## Performance Targets

| Metric | Target    | How                                    |
|--------|-----------|----------------------------------------|
| LCP    | < 2.0s    | `priority` on hero images, CDN caching |
| CLS    | < 0.1     | Always provide `width` + `height`      |
| FCP    | < 1.5s    | SSR via App Router, minimal JS         |
| TTI    | < 3.5s    | Code splitting, standalone output      |

---

## Build & Deploy

```bash
cd storefront
pnpm install
pnpm build
pm2 restart nextjs-storefront --update-env
```

> `standalone` output means the `.next/standalone` folder is self-contained. PM2 runs `node .next/standalone/server.js`.

---

## Smoke Test Page

Create `app/_test/images/page.tsx` that loads 4 sample images at different sizes to verify both loader modes work. Remove before production launch.

---

## Rules

1. **All images via CDN** — never serve from VPS or use Next.js built-in optimization
2. **`output: 'standalone'`** — mandatory for VPS deployment
3. **Swedish locale** — `sv-SE` as default, SEK as currency
4. **Responsive images** — always use `sizes` prop
5. **No inline styles for layout** — use CSS modules or vanilla CSS
6. **SEO metadata** — every page must have `<title>`, `<meta description>`, and structured data
7. **Test with Lighthouse** after every deployment
