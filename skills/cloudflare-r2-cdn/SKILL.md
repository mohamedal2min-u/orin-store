---
name: cloudflare-r2-cdn
description: Cloudflare R2 object storage and CDN configuration for ORIN.SE. Covers bucket setup, custom domains, CORS, cache rules, image pipeline, and backup to Backblaze B2.
---

# Cloudflare R2 + CDN — ORIN.SE

> All product images and media files are stored in R2 and served via Cloudflare CDN. Zero egress cost.

---

## When to Use

- Setting up or modifying the R2 bucket
- Configuring CDN cache rules
- Troubleshooting image delivery issues
- Setting up or testing the image pipeline
- Configuring R2 → B2 backup

---

## Architecture

```
Admin uploads → Medusa (S3 API) → R2 Bucket (medusa-uploads)
                                        ↓
                                 cdn.orin.se (Custom Domain)
                                        ↓
Customer request → Cloudflare CDN Edge (ARN/STO)
                        ├── cache hit → return (~20ms)
                        └── cache miss → R2 → [Image Resizing] → cache → return
```

---

## R2 Bucket Configuration

| Setting            | Value                                    |
|--------------------|------------------------------------------|
| Bucket name        | `medusa-uploads`                         |
| Location hint      | EU (closest to Sweden)                   |
| Storage class      | Standard (NOT Infrequent Access for active images) |
| Custom domain      | `cdn.orin.se`                            |
| SSL                | Cloudflare Universal SSL (automatic)     |

### Setup Steps

1. Cloudflare Dashboard → R2 → Create bucket
2. Name: `medusa-uploads`, Location: EU, Class: Standard
3. Settings → Custom Domains → Connect `cdn.orin.se`
4. Cloudflare auto-creates CNAME DNS record
5. Verify "Proxy" is enabled (orange cloud) — this enables CDN + Image Resizing
6. SSL is automatic via Cloudflare Universal SSL

---

## API Token

1. Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Create API Token → Object Read & Write
3. **Scope to `medusa-uploads` only** — never give access to all buckets
4. Save: Access Key ID + Secret Access Key + Endpoint URL
5. Store in password manager immediately

> **The Secret Key is shown ONCE. Save it immediately.**

---

## CORS Policy

Apply via R2 bucket settings:

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

## CDN Cache Rules

Configure in: Cloudflare Dashboard → Caching → Cache Rules

| Rule                     | Value                                  |
|--------------------------|----------------------------------------|
| When                     | `hostname equals "cdn.orin.se"`        |
| Cache eligibility        | Eligible for cache                     |
| Edge TTL                 | 30 days (images don't change often)    |
| Browser TTL              | 7 days                                 |
| Cache by query string    | Ignore (prevents cache-busting)        |

---

## Image Pipeline

### MVP: Pre-generated Variants ($0/month)

Medusa subscriber generates 3 WebP variants on upload using `sharp`:

| Variant | Width  | Suffix     | Quality |
|---------|--------|------------|---------|
| Thumb   | 300px  | `-thumb`   | 80      |
| Medium  | 600px  | `-medium`  | 80      |
| Large   | 1200px | `-large`   | 80      |

Example paths in R2:
```
products/abc123/main.webp
products/abc123/main-thumb.webp
products/abc123/main-medium.webp
products/abc123/main-large.webp
```

### Future: Cloudflare Image Resizing (requires Pro plan ~$20/month)

```
https://cdn.orin.se/cdn-cgi/image/width=400,quality=80,format=auto/products/abc/main.webp
```

Features:
- On-the-fly resize + format conversion (WebP/AVIF)
- No need to pre-generate variants
- Automatic `format=auto` picks best format for browser

### Polish (included with Pro plan)

- Auto-compress all images
- Auto-convert to WebP/AVIF
- No code changes needed

---

## Advantages of This Setup

| Benefit                    | Detail                                           |
|----------------------------|--------------------------------------------------|
| Zero egress cost           | R2 has $0 egress — huge savings vs S3            |
| Global CDN included        | Cloudflare free plan = unlimited bandwidth        |
| Fast for Sweden            | Edge nodes in ARN (Stockholm) and nearby          |
| Automatic format conversion| WebP/AVIF via Cloudflare (no extra code)          |
| VPS disk savings           | 0 GB images on VPS — all in R2                   |
| Reliable backup            | R2 = 99.999999999% durability + weekly B2 backup  |
| Automatic scaling          | CDN handles traffic spikes, not VPS               |
| On-demand resize (future)  | `/cdn-cgi/image/width=400` — any size on the fly  |

---

## Backup: R2 → Backblaze B2

Weekly sync using `rclone`:

```bash
rclone sync r2:medusa-uploads b2:watches-backup-weekly/snapshot-YYYY-MM-DD/
```

- Schedule: Sunday 04:30 (avoids daily DB backup at 03:00)
- Retention: Last 4 weekly snapshots
- Tool: `rclone` with two configured remotes (`r2`, `b2`)
- Logs: `/var/log/r2-backup.log`

### Verify Backup

```bash
# List files in most recent snapshot
rclone ls b2:watches-backup-weekly/$(rclone lsd b2:watches-backup-weekly | awk '{print $5}' | sort | tail -1)/
```

---

## Cost Breakdown (Monthly)

| Item              | Usage             | Cost (SEK) |
|-------------------|-------------------|------------|
| R2 Storage (10GB) | 500 products × 4 variants × ~5MB | ~1.50 |
| R2 Writes         | ~2000/month       | ~0.10      |
| R2 Reads          | 95%+ served by CDN cache | ~1.00 |
| R2 Egress         | $0 (R2's advantage) | 0        |
| CDN (Free plan)   | Unlimited bandwidth | 0        |
| B2 Backup (40GB)  | 4 snapshots × 10GB | ~3.00    |
| **Total**         |                   | **~6 SEK** |

---

## Rules

1. **Bucket scoped API token** — never give access to all buckets
2. **Location hint: EU** — closest to Swedish customers
3. **Standard storage class** — not Infrequent Access for active images
4. **Custom domain must be proxied** (orange cloud) — enables CDN + Image Resizing
5. **Edge TTL: 30 days** — images rarely change
6. **Ignore query strings** — prevents cache fragmentation
7. **Test image delivery** after any CDN rule changes
8. **Monitor R2 usage** in Cloudflare dashboard monthly

---

## Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| 403 on image request | Custom domain not proxied | Enable Proxy (orange cloud) in DNS |
| Slow image load | Cache miss | Wait for cache warm-up, or pre-warm popular images |
| CORS error in browser | Bucket CORS not configured | Apply CORS policy above |
| Image not found (404) | Wrong path in Postgres | Verify path matches R2 key |
| Old image showing | CDN caching old version | Purge cache in Cloudflare dashboard |
