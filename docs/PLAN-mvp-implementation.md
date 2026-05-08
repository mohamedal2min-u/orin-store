# MVP Implementation Plan

This document outlines the step-by-step implementation strategy for the ORIN.SE Swedish wristwatch e-commerce MVP. It translates the architectural decisions from `PROJECT_CONTEXT.md` into actionable build phases, ensuring all infrastructure, backend, storefront, and deployment requirements are met systematically.

## User Review Required
> [!IMPORTANT]
> Please review the **Build Order** and **GitHub Milestones** to confirm they align with your expected project velocity. Do not proceed to `/create` until this plan is approved.

## Open Questions (Socratic Gate - Edge Cases)
> [!WARNING]
> Before we start writing code, we need to clarify two edge cases to prevent future architectural debt:
> 1. **Image Processing Load**: Given we are generating image variants locally on the backend during upload (via `sharp`), how should we handle potential CPU spikes if an admin bulk-uploads many high-resolution lifestyle images? Should we implement a queue system, or is synchronous processing acceptable for the MVP?
> 2. **Klarna Integration**: Are we using Medusa's official standalone Klarna plugin, or are we routing Klarna payments through Stripe's Local Payment Methods (LPMs)? Stripe LPM is usually simpler to maintain.

---

## Proposed Changes & Setup

### 1. Build Order
We will implement the MVP in five distinct phases to isolate complexity:
1. **Phase 1: Local Foundation** — Initialize Medusa v2 backend and PostgreSQL database locally.
2. **Phase 2: R2 & Image Pipeline** — Connect backend to Cloudflare R2 and implement the `sharp` image variant subscriber.
3. **Phase 3: Storefront UX** — Initialize Next.js, implement the custom Cloudflare image loader, and build the Ditur.se-referenced layouts in Swedish.
4. **Phase 4: VPS Preparation** — Provision Hetzner VPS, setup CloudPanel, PM2, and backup scripts (DB to Storage Box, R2 to Backblaze).
5. **Phase 5: CI/CD & Launch** — Configure GitHub Actions, run automated deployments, and execute the final testing checklist.

---

### 2. Folder Structure
The repository will be structured as a strict monorepo:
```text
orin.se/
├── .github/
│   └── workflows/          # ci.yml, deploy.yml
├── backend/                # Medusa v2 application
│   └── src/
│       └── subscribers/    # image-variants.ts
├── storefront/             # Next.js App Router
│   ├── lib/
│   │   └── cloudflare-loader.ts
│   └── app/                # Page routes and layouts
├── scripts/                # VPS management and backup scripts
│   ├── backup_db.sh
│   └── backup_r2.sh
├── skills/                 # Antigravity AI skills
├── docs/                   # Project plans and documentation
└── PROJECT_CONTEXT.md
```

---

### 3. GitHub Milestones
- **M1: Foundation** — Repo setup, Local DB, Base Medusa backend running.
- **M2: Infrastructure** — R2 buckets created, CDN caching configured, image upload/variant pipeline tested.
- **M3: Storefront & UX** — Next.js initialized, Swedish locale active, core pages (Home, PLP, PDP, Cart) built using Ditur.se structural logic.
- **M4: Production Ready** — VPS provisioned, PM2 running, GitHub Actions deploying successfully.
- **M5: Polish & Launch** — Stripe/Klarna payments tested, Lighthouse SEO targets hit, backup scripts verified.

---

### 4. Backend Setup Tasks
- [ ] Initialize Medusa v2 project in `/backend`.
- [ ] Configure local PostgreSQL connection.
- [ ] Install and configure `@medusajs/file-s3` plugin.
  - *Crucial*: Set `forcePathStyle: false` for Cloudflare R2 compatibility.
- [ ] Create `image-variants.ts` subscriber to intercept `file.uploaded` events and generate `-thumb`, `-medium`, and `-large` WebP variants using `sharp`.
- [ ] Configure CORS arrays for `https://orin.se` and `https://admin.orin.se`.
- [ ] Setup Stripe payment provider.

---

### 5. Storefront Setup Tasks
- [ ] Initialize Next.js 15 (App Router) in `/storefront` with `output: 'standalone'`.
- [ ] Create `/lib/cloudflare-loader.ts`.
  - *MVP Mode*: Pick the correct pre-generated variant suffix based on the requested width.
- [ ] Setup i18n for Swedish (`sv-SE`) and default currency to `SEK`.
- [ ] Implement UI structures referencing Ditur.se:
  - Global Header & Megamenu navigation.
  - Product Listing Page (PLP) with filter/sorting UX.
  - Product Detail Page (PDP) with trust badges and clear Add-to-Cart logic.
  - Slide-out Cart and Checkout flow.
- [ ] Configure `metadata` exports for Swedish SEO and Schema.org structured data.

---

### 6. Cloudflare R2/CDN Tasks
- [ ] Create R2 bucket: `medusa-uploads` (EU Location).
- [ ] Map custom domain `cdn.orin.se` (Proxied).
- [ ] Apply CORS policy allowing GET/PUT/POST/DELETE from allowed origins.
- [ ] Set CDN Cache Rules for `cdn.orin.se`:
  - Edge Cache TTL: 30 days
  - Browser Cache TTL: 7 days
  - Ignore Query Strings
- [ ] Generate scoped R2 API Tokens for the backend.

---

### 7. VPS Deployment Preparation
- [ ] Provision Hetzner VPS (Ubuntu, 100GB SSD).
- [ ] Install CloudPanel and configure the `orin.se` site.
- [ ] Install Node.js LTS, PM2, and PostgreSQL.
- [ ] Generate SSH deploy key and add to GitHub repository secrets.
- [ ] Write and cron `scripts/backup_db.sh` for daily `pg_dump` to Hetzner Storage Box.
- [ ] Write and cron `scripts/backup_r2.sh` for weekly `rclone` sync to Backblaze B2.

---

### 8. Testing Checklist
#### Automated Tests
- [ ] Run `pnpm lint` and `pnpm tsc --noEmit` on both backend and storefront.
- [ ] Trigger GitHub Actions CI workflow and verify it passes.

#### Manual Verification
- [ ] **Image Pipeline**: Upload an image in the Medusa Admin. Verify that the original and 3 WebP variants appear in the R2 bucket.
- [ ] **CDN Cache**: Load the storefront. Inspect network requests to `cdn.orin.se` and ensure `cf-cache-status: HIT` is present.
- [ ] **Checkout Flow**: Complete an end-to-end test order using Stripe test cards.
- [ ] **Performance**: Run Lighthouse on the production URL and verify scores > 90 for Performance, Accessibility, and SEO.
- [ ] **Resilience**: Manually execute backup scripts and verify archives appear in external storage.
- [ ] **Deploy**: Push a minor text change to `main` and verify the PM2 instances restart seamlessly without downtime.
