---
name: project-architect
description: Master architecture skill for the ORIN.SE Swedish wristwatch e-commerce MVP. Defines the full stack, enforces architectural boundaries, and coordinates all other skills.
---

# Project Architect — ORIN.SE

> Enforces the architecture defined in `PROJECT_CONTEXT.md`. Read that file first before any implementation.

---

## When to Use

- Starting a new feature or module
- Making infrastructure decisions
- Reviewing pull requests for architectural compliance
- Onboarding a new agent or developer to the project

---

## Architecture Diagram

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────────────────────┐
│  Customer   │────▶│  Cloudflare CDN  │────▶│  VPS (Hetzner, 100GB SSD)   │
│  Browser    │     │  + DNS           │     │                              │
└─────────────┘     │  cdn.orin.se     │     │  ┌─────────────┐            │
                    └────────┬─────────┘     │  │  Next.js     │ :3000      │
                             │               │  │  (Storefront) │            │
                             ▼               │  └──────┬──────┘            │
                    ┌──────────────────┐     │         │                    │
                    │  Cloudflare R2   │     │  ┌──────▼──────┐            │
                    │  medusa-uploads  │◀───▶│  │  Medusa v2   │ :9000      │
                    │  (EU region)     │     │  │  (Backend)   │            │
                    └──────────────────┘     │  └──────┬──────┘            │
                             │               │         │                    │
                             ▼               │  ┌──────▼──────┐            │
                    ┌──────────────────┐     │  │  PostgreSQL  │ :5432      │
                    │  Backblaze B2    │     │  │  (Database)  │            │
                    │  (Weekly Backup) │     │  └─────────────┘            │
                    └──────────────────┘     └──────────────────────────────┘
```

---

## Stack Rules

### MUST use:

| Component       | Technology                | Reason                        |
|-----------------|---------------------------|-------------------------------|
| Frontend        | Next.js (App Router)      | SSR/SSG, SEO, standalone      |
| Backend         | Medusa v2                 | Headless commerce, extensible |
| Database        | PostgreSQL                | On-VPS, FTS for search        |
| File Storage    | Cloudflare R2             | S3-compatible, free egress    |
| CDN             | Cloudflare (Free plan)    | Edge caching, image pipeline  |
| Payments        | Stripe + Klarna           | Swedish market standard       |
| Process Manager | PM2                       | Zero-downtime restarts        |
| Server Panel    | CloudPanel                | Nginx, SSL, admin             |
| Version Control | GitHub                    | Continuous backup of code     |

### MUST NOT:

- Store images on VPS disk (use R2)
- Use Docker in MVP (PM2 + CloudPanel instead)
- Use external search services (PostgreSQL FTS only)
- Commit `.env` files to Git
- Use `forcePathStyle: true` in S3 client (R2 requires subdomain-style)
- Point `file_url` to raw R2 endpoint (must use `cdn.orin.se`)

---

## Directory Structure (Target)

```
orin.se/
├── PROJECT_CONTEXT.md          # Source of truth
├── CLAUDE.md                   # Agent instructions + env var list
├── skills/                     # Antigravity skills
│   ├── project-architect/
│   ├── medusa-v2/
│   ├── nextjs-storefront/
│   ├── vps-deployment/
│   ├── cloudflare-r2-cdn/
│   ├── github-workflow/
│   └── seo-ux-sweden/
├── backend/                    # Medusa v2 backend
│   ├── src/
│   │   ├── subscribers/        # Event handlers (image-variants.ts)
│   │   ├── api/                # Custom API routes
│   │   └── modules/            # Custom modules
│   ├── medusa-config.ts
│   ├── .env                    # NEVER commit
│   └── package.json
├── storefront/                 # Next.js frontend
│   ├── app/                    # App Router pages
│   ├── lib/
│   │   └── cloudflare-loader.ts
│   ├── next.config.ts
│   └── package.json
└── scripts/                    # VPS management scripts
    ├── backup-db.sh
    ├── backup-r2-weekly.sh
    └── deploy.sh
```

---

## Port Assignments

| Service     | Port  | Managed By |
|-------------|-------|------------|
| Next.js     | 3000  | PM2        |
| Medusa v2   | 9000  | PM2        |
| PostgreSQL  | 5432  | System     |
| Nginx       | 80/443| CloudPanel |

---

## Coordination Between Skills

| Task                          | Primary Skill        | Supporting Skills         |
|-------------------------------|----------------------|---------------------------|
| Set up Medusa backend         | `medusa-v2`          | `cloudflare-r2-cdn`       |
| Build storefront              | `nextjs-storefront`  | `seo-ux-sweden`           |
| Configure image pipeline      | `cloudflare-r2-cdn`  | `medusa-v2`, `nextjs-storefront` |
| Deploy to production          | `vps-deployment`     | `github-workflow`         |
| Set up CI/CD                  | `github-workflow`    | `vps-deployment`          |
| SEO & Swedish localization    | `seo-ux-sweden`      | `nextjs-storefront`       |

---

## Pre-Implementation Checklist

Before writing any production code, verify:

- [ ] VPS is provisioned with CloudPanel
- [ ] Domain `orin.se` DNS is on Cloudflare
- [ ] R2 bucket `medusa-uploads` is created
- [ ] R2 API token is generated (scoped to bucket)
- [ ] Custom domain `cdn.orin.se` is connected to R2
- [ ] GitHub repository is created
- [ ] SSH keys are configured for deployment
- [ ] PostgreSQL is installed and secured
- [ ] Node.js LTS is installed
- [ ] PM2 is installed globally
- [ ] Stripe account is created (test mode)
- [ ] Klarna developer account is created (test mode)

---

## Decision Log Template

When making architectural decisions, document them:

```markdown
### Decision: [Title]
- **Date**: YYYY-MM-DD
- **Context**: Why this decision was needed
- **Options Considered**: List alternatives
- **Decision**: What was chosen
- **Consequences**: Impact on other components
```
