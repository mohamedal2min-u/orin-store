---
name: medusa-v2
description: Medusa v2 backend development for ORIN.SE. Covers configuration, R2 file storage integration, subscribers, custom API routes, and PM2 process management.
---

# Medusa v2 Backend — ORIN.SE

> Headless commerce backend. Manages products, orders, payments, and file uploads to Cloudflare R2.

---

## When to Use

- Setting up or modifying the Medusa backend
- Adding subscribers, API routes, or custom modules
- Configuring payment providers (Stripe, Klarna)
- Troubleshooting backend issues

---

## Core Configuration

### medusa-config.ts

```typescript
import { defineConfig, loadEnv } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
    },
  },
  modules: [
    // File storage → Cloudflare R2
    {
      resolve: '@medusajs/medusa/file',
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/file-s3',
            id: 's3',
            options: {
              file_url: process.env.R2_PUBLIC_URL,
              access_key_id: process.env.R2_ACCESS_KEY_ID,
              secret_access_key: process.env.R2_SECRET_ACCESS_KEY,
              region: 'auto',
              bucket: process.env.R2_BUCKET,
              endpoint: process.env.R2_ENDPOINT,
              additional_client_config: {
                forcePathStyle: false, // R2 requires subdomain-style
              },
            },
          },
        ],
      },
    },
    // Add payment, notification, and other modules here
  ],
})
```

---

## Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://medusa:password@localhost:5432/medusa_db

# CORS
STORE_CORS=https://orin.se,http://localhost:3000
ADMIN_CORS=https://admin.orin.se,http://localhost:5173
AUTH_CORS=https://orin.se,https://admin.orin.se,http://localhost:3000,http://localhost:5173

# Cloudflare R2
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=xxxxxxxxxxxx
R2_SECRET_ACCESS_KEY=yyyyyyyyyyyy
R2_BUCKET=medusa-uploads
R2_PUBLIC_URL=https://cdn.orin.se

# Stripe
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Klarna (via Stripe or direct)
KLARNA_API_KEY=...
```

> **NEVER commit `.env`. Add all keys to `.env.example` with placeholder values.**

---

## Key Dependencies

```bash
# Core
pnpm add @medusajs/medusa
pnpm add @medusajs/file-s3

# Image processing (for variant generation)
pnpm add sharp

# Payments
pnpm add @medusajs/payment-stripe
```

---

## Image Variant Subscriber

On every image upload, generate 3 WebP variants:

```
backend/src/subscribers/image-variants.ts
```

| Variant | Width  | Suffix    | Quality |
|---------|--------|-----------|---------|
| Thumb   | 300px  | `-thumb`  | 80      |
| Medium  | 600px  | `-medium` | 80      |
| Large   | 1200px | `-large`  | 80      |

Listens to: `file.uploaded` event

---

## PM2 Process Management

```bash
# Start
pm2 start npm --name "medusa-backend" -- run start

# Restart after config changes
pm2 restart medusa-backend --update-env

# View logs
pm2 logs medusa-backend

# Save process list (survives reboot)
pm2 save
pm2 startup
```

---

## Build & Deploy Workflow

```bash
cd backend
pnpm install
pnpm build
pm2 restart medusa-backend --update-env
```

---

## Rules

1. **`file_url` MUST use `R2_PUBLIC_URL`** (the CDN domain), never the raw R2 endpoint
2. **`forcePathStyle` MUST be `false`** — R2 uses subdomain-style URLs
3. All subscriber files go in `src/subscribers/`
4. All custom API routes go in `src/api/`
5. Use `pnpm` as package manager (consistent with Medusa v2)
6. Run `pnpm build` before every restart
7. Test image uploads in Admin after any R2 config changes
8. Verify uploaded image URL starts with `https://cdn.orin.se/`

---

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Upload fails silently | Wrong R2 endpoint or keys | Check `.env`, verify API token scope |
| Image URL shows R2 raw domain | `file_url` not set to CDN | Set `R2_PUBLIC_URL=https://cdn.orin.se` |
| CORS error on upload | Bucket CORS misconfigured | Apply CORS policy from PROJECT_CONTEXT.md |
| `forcePathStyle` error | Set to `true` | Must be `false` for R2 |
| Variants not generated | Subscriber not triggered | Check `file.uploaded` event, verify `sharp` installed |
