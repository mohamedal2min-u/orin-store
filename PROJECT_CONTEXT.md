# ORIN.SE — Project Context

> Swedish wristwatch e-commerce MVP — single source of truth for all agents and skills.

---

## 1. Brand & Domain

| Key           | Value                                  |
|---------------|----------------------------------------|
| Brand         | ORIN (working name)                    |
| Primary domain| `orin.se`                              |
| Storefront    | `https://orin.se` (or `butiken.orin.se`) |
| Admin panel   | `https://admin.orin.se`                |
| CDN subdomain | `https://cdn.orin.se`                  |
| Market        | Sweden (sv-SE locale, SEK currency)    |

---

## 1b. Design Reference

**Primary reference**: [Ditur.se](https://ditur.se) — for storefront structure, UX patterns, layout logic, navigation, filters, product page flow, and conversion elements.

- Replicate the **general patterns** (page structure, grid layouts, filter UX, checkout flow, trust badge placement, typography rhythm)
- Do NOT copy branding, logos, images, source code, or copyrighted assets
- Build a clean **original implementation** using Next.js + Medusa v2
- See `skills/seo-ux-sweden/SKILL.md` for the full pattern breakdown

---

## 2. Architecture Overview

```
Customer → Cloudflare CDN → VPS [Next.js + Medusa v2 + PostgreSQL]
                                    ↕
                            Cloudflare R2 (Object Storage)
                                    ↕
                            Backblaze B2 (Weekly Backup)
```

### Stack

| Layer             | Technology                              |
|-------------------|-----------------------------------------|
| **Frontend**      | Next.js (App Router, standalone output) |
| **Backend / CMS** | Medusa v2                               |
| **Database**      | PostgreSQL (on VPS)                     |
| **File Storage**  | Cloudflare R2 (`medusa-uploads` bucket) |
| **CDN / Edge**    | Cloudflare CDN (Free plan) + DNS        |
| **Image Pipeline**| Pre-generated variants via `sharp` (MVP), Cloudflare Image Resizing (future) |
| **Payments**      | Stripe + Klarna                         |
| **Process Mgr**   | PM2                                     |
| **Server Panel**  | CloudPanel                              |
| **Hosting**       | Hetzner VPS (100 GB SSD)                |
| **Search**        | PostgreSQL FTS (MVP)                    |
| **Backup**        | Hetzner Storage Box (DB) + Backblaze B2 (R2 images) |
| **Version Control**| GitHub                                 |

---

## 3. VPS Disk Budget (100 GB SSD)

| Item                              | Size     |
|-----------------------------------|----------|
| Ubuntu OS + packages              | ~10 GB   |
| CloudPanel + Nginx                | ~2 GB    |
| PostgreSQL data                   | ~5 GB    |
| Medusa + node_modules             | ~2 GB    |
| Next.js + node_modules + .next    | ~3 GB    |
| Logs (with rotation)              | ~5 GB    |
| Local DB backups (last 4 × 6 hrs) | ~3 GB    |
| **Free headroom**                 | **~70 GB** |

> Images are NOT stored on VPS. They live in Cloudflare R2.

---

## 4. Image Flow

### Upload (Admin → R2)

```
Admin uploads image
  → Medusa Backend (multipart upload)
  → @medusajs/file-s3 module (configured for R2 endpoint)
  → Cloudflare R2 Bucket: medusa-uploads/
  → Postgres stores path: /products/{product-id}/main.webp
  → Public URL: https://cdn.orin.se/products/{id}/main.webp
```

### Request (Customer → CDN → R2)

```
Browser requests: cdn.orin.se/cdn-cgi/image/width=400,quality=80,format=auto/products/abc/main.webp
  → Cloudflare CDN edge (ARN/STO)
     ├─ cache hit  → return instantly (~20ms)
     └─ cache miss → R2 Bucket → Cloudflare Image Resizing → cache at edge → Browser (~80-200ms first, 20ms after)
```

> Cache hit ratio after one week: typically 95%+

### Image Variants (MVP Strategy)

Pre-generate 3 WebP variants on upload using `sharp`:

| Variant  | Width  | Suffix   |
|----------|--------|----------|
| Thumb    | 300px  | `-thumb` |
| Medium   | 600px  | `-medium`|
| Large    | 1200px | `-large` |

Subscriber: `backend/src/subscribers/image-variants.ts` listens to `file.uploaded` event.

---

## 5. Cloudflare R2 Configuration

| Setting            | Value                                    |
|--------------------|------------------------------------------|
| Bucket name        | `medusa-uploads`                         |
| Location hint      | EU (closest to Sweden)                   |
| Storage class      | Standard                                 |
| Custom domain      | `cdn.orin.se` (CNAME, proxied)           |
| SSL                | Cloudflare Universal SSL (automatic)     |
| API Token scope    | Object Read & Write, scoped to bucket    |

### CORS Policy

```json
[
  {
    "AllowedOrigins": [
      "https://orin.se",
      "https://admin.orin.se",
      "http://localhost:3000",
      "http://localhost:9000"
    ],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 6. Cloudflare CDN Cache Rules (cdn.orin.se)

| Rule                 | Value                                    |
|----------------------|------------------------------------------|
| Match                | `hostname equals "cdn.orin.se"`          |
| Cache eligibility    | Eligible for cache                       |
| Edge TTL             | 30 days                                  |
| Browser TTL          | 7 days                                   |
| Query string caching | Ignore (prevent cache-busting via versions) |

---

## 7. Environment Variables (Backend)

```env
# Cloudflare R2
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=xxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=yyyyyyyyyyyy
R2_BUCKET=medusa-uploads
R2_PUBLIC_URL=https://cdn.orin.se

# Note: R2_PUBLIC_URL is the CDN domain, NOT the raw R2 endpoint
```

> **Never commit `.env` files. Store secrets in a password manager.**

---

## 8. Next.js Image Configuration

### next.config.ts

```typescript
const config: NextConfig = {
  output: 'standalone',
  images: {
    loader: 'custom',
    loaderFile: './lib/cloudflare-loader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.orin.se' },
    ],
  },
}
```

### Custom Loader (`lib/cloudflare-loader.ts`)

Two modes controlled by `NEXT_PUBLIC_USE_CF_RESIZING`:
- **`true`**: Use `/cdn-cgi/image/` URL transformation (requires Pro plan)
- **default (MVP)**: Pick pre-generated variant (`-thumb`, `-medium`, `-large`)

---

## 9. Backup Strategy

| Target       | Method                    | Destination            | Schedule     |
|--------------|---------------------------|------------------------|--------------|
| PostgreSQL   | pg_dump                   | Hetzner Storage Box    | Daily 03:00  |
| .env + nginx | rsync                     | Hetzner Storage Box    | Weekly       |
| R2 bucket    | rclone sync               | Backblaze B2           | Weekly Sun 04:30 |
| Source code   | Git                       | GitHub                 | Every push   |

R2 → B2 backup retains last 4 weekly snapshots.

---

## 10. Monthly Cost Budget

| Item                    | Expected Cost     |
|-------------------------|-------------------|
| VPS (Hetzner)           | ~150 SEK          |
| R2 Storage (10 GB)      | ~1.50 SEK         |
| R2 Operations           | ~1.10 SEK         |
| R2 Egress               | 0 SEK (free)      |
| Cloudflare CDN + DNS    | 0 SEK (Free plan) |
| B2 Backup (40 GB)       | ~3 SEK            |
| **Total**               | **~156 SEK/month**|

---

## 11. Key Decisions & Rules

1. **Images NEVER live on VPS** — always R2 + CDN
2. **Start with pre-generated variants** (free, sharp) — switch to Cloudflare Image Resizing later if traffic justifies Pro plan
3. **`forcePathStyle: false`** in S3 client config — R2 uses subdomain-style URLs
4. **`file_url` must point to CDN domain** (`cdn.orin.se`), not raw R2 endpoint
5. **Stripe + Klarna** for payments (Swedish market expectation)
6. **PostgreSQL FTS** for search in MVP — no external search service
7. **PM2** for process management — no Docker in MVP
8. **CloudPanel** for server administration
9. **All scripts use `set -euo pipefail`** — fail fast, no silent errors
10. **Bucket names and paths must be configurable** via top-of-file variables

---

## 12. Pending / Future

- Cloudflare Image Resizing (requires Pro plan ~$20/month)
- Email notifications on backup failure (msmtp + Brevo)
- Advanced SEO: structured data, hreflang
- Analytics integration
- Multi-language support (sv/en)
