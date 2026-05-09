# Local Development Checklist

Use this checklist every time you set up the project on a new machine,
or when onboarding a new developer. All commands assume the repo root.

---

## Prerequisites

- [ ] **Node.js 20+** — `node --version` should print `v20.x.x` or higher
- [ ] **pnpm 11+** — install with `npm install -g pnpm@11`; verify with `pnpm --version`
- [ ] **PostgreSQL 14+** running locally — `psql --version`
- [ ] The repo cloned — `git clone git@github.com:YOUR_ORG/orin.se.git && cd orin.se`

---

## First-time backend setup

```bash
# 1. Install backend dependencies
cd backend && pnpm install && cd ..

# 2. Create the database
createdb orin_medusa
# Or via psql: psql -U postgres -c "CREATE DATABASE orin_medusa;"

# 3. Copy the env template and fill in values
cp backend/apps/backend/.env.template backend/apps/backend/.env
# Open .env and set:
#   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/orin_medusa
#   JWT_SECRET=$(openssl rand -base64 32)
#   COOKIE_SECRET=$(openssl rand -base64 32)
#   STORE_CORS=http://localhost:3000
#   ADMIN_CORS=http://localhost:9000
#   AUTH_CORS=http://localhost:3000,http://localhost:9000
# Leave R2 and Stripe blank — the config will fall back to local file storage

# 4. Run database migrations
cd backend/apps/backend && pnpm medusa db:migrate && cd ../../..

# 5. Seed initial data (regions, currencies, sales channels)
cd backend/apps/backend && pnpm medusa exec src/migration-scripts/initial-data-seed.ts && cd ../../..
```

---

## First-time storefront setup

```bash
# 1. Install storefront dependencies
cd storefront && pnpm install && cd ..

# 2. Create local env file
cat > storefront/.env.local << 'EOF'
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=REPLACE_AFTER_STEP_BELOW
NEXT_PUBLIC_USE_CF_RESIZING=false
NEXT_PUBLIC_CDN_URL=https://cdn.orin.se
EOF
```

---

## Running locally (two terminals)

**Terminal 1 — Medusa backend (port 9000)**
```bash
cd backend && pnpm run backend:dev
```
Wait for `Medusa started successfully` before starting the storefront.

**Terminal 2 — Next.js storefront (port 3000)**
```bash
cd storefront && pnpm dev
```

Access points:
| URL | What |
|-----|------|
| `http://localhost:3000` | Storefront |
| `http://localhost:9000/app` | Medusa Admin panel |
| `http://localhost:9000/health` | Backend health check |

---

## After first backend start

1. Open `http://localhost:9000/app` and create an admin account when prompted
2. Navigate to **Settings → API Keys → Publishable Keys**
3. Create a new publishable key (name it "Local dev")
4. Copy the key (starts with `pk_`) and paste it into `storefront/.env.local`:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_YOUR_KEY_HERE
   ```
5. Restart the storefront: `Ctrl+C` in Terminal 2, then `pnpm dev` again

---

## Adding test products

1. In the admin panel at `http://localhost:9000/app`:
   - **Catalog → Products → Create product**
   - Add title, variant with price, upload a test image
   - Make sure to publish the product
2. The homepage product grid will show it once seeded

---

## Verifying the image pipeline (local)

When R2 credentials are empty, the backend uses the **local file provider**:
- Uploads are stored in `backend/apps/backend/uploads/`
- Image variants (thumb/medium/large) are NOT generated locally (subscriber skips when R2 is not configured)
- Product thumbnails will be served from `http://localhost:9000/uploads/...`

To test the full R2 pipeline, add real R2 credentials to `.env` and set
`NEXT_PUBLIC_USE_CF_RESIZING=false` to use pre-generated variants.

---

## Common issues

| Symptom | Likely cause | Fix |
|---------|-------------|-----|
| `Missing required env: JWT_SECRET` on backend start | `.env` not copied or missing secrets | Run step 3 in backend setup above |
| Storefront shows empty product grid | Publishable key not set or backend not running | Check `.env.local` key and `pnpm run backend:dev` |
| `ECONNREFUSED 9000` in browser console | Backend not running | Start backend in Terminal 1 |
| `Medusa 401` in server logs | Wrong or expired publishable key | Recreate key in admin panel |
| Image uploads fail in admin | PostgreSQL connection issue or uploads dir permissions | Check `DATABASE_URL` and run `mkdir -p backend/apps/backend/uploads` |
| `pnpm: command not found` | pnpm not installed globally | `npm install -g pnpm@11` |
| Port 3000 already in use | Another dev server running | `lsof -i :3000` and kill that process |

---

## Useful dev commands

```bash
# Lint storefront
cd storefront && pnpm lint

# Typecheck storefront
cd storefront && npx tsc --noEmit

# Typecheck backend
cd backend/apps/backend && npx tsc --noEmit

# Build storefront (production build test)
cd storefront && pnpm build

# Reset database (drop + recreate + migrate + seed)
dropdb orin_medusa && createdb orin_medusa
cd backend/apps/backend && pnpm medusa db:migrate
cd backend/apps/backend && pnpm medusa exec src/migration-scripts/initial-data-seed.ts
```

---

## What is NOT set up locally (requires VPS / secrets)

- Cloudflare R2 file storage (uses local file provider instead)
- Stripe payments (payment module not loaded without `STRIPE_API_KEY`)
- Klarna payments (not yet integrated)
- Image variant generation (requires R2 credentials)
- CDN image serving (local images served from `localhost:9000`)

See [SECRETS-ROTATION.md](./SECRETS-ROTATION.md) for production secret management.
