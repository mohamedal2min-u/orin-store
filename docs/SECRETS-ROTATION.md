# Secrets Rotation Guide

Run through this checklist whenever a secret is suspected to be compromised,
or as part of routine key rotation (recommended: every 90 days for JWT/cookie
secrets, immediately for database passwords).

**Never commit actual secret values to git. This file contains steps only.**

---

## 1. PostgreSQL Database Password

### When to rotate
- Suspected breach
- Developer offboarding
- Routine (every 90 days)

### Steps

```bash
# 1. Connect to PostgreSQL on the VPS
psql -U postgres

# 2. Generate a strong new password (run locally, don't paste into shell history)
openssl rand -base64 32

# 3. Change the password in PostgreSQL
ALTER USER postgres WITH PASSWORD 'PASTE_NEW_PASSWORD_HERE';
\q

# 4. Update /home/deploy/.env.backend on the VPS
#    Change DATABASE_URL=postgresql://postgres:OLD@localhost:5432/orin_medusa
#    to    DATABASE_URL=postgresql://postgres:NEW@localhost:5432/orin_medusa

# 5. Reload Medusa (zero-downtime)
pm2 reload medusa

# 6. Verify backend is healthy
pm2 logs medusa --lines 20
curl -s http://localhost:9000/health | grep ok
```

---

## 2. JWT Secret (`JWT_SECRET`)

### When to rotate
- Suspected leak
- Routine (every 90 days)

**Effect:** All active admin sessions will be invalidated immediately.
Plan to do this during low-traffic hours.

### Steps

```bash
# 1. Generate a new 256-bit secret
openssl rand -base64 32
# Example output: aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789abcd

# 2. Update on VPS
nano /home/deploy/.env.backend
# Change: JWT_SECRET=OLD_VALUE
# To:     JWT_SECRET=NEW_VALUE

# 3. Reload Medusa
pm2 reload medusa

# 4. All admin users must log in again — inform the team beforehand
```

---

## 3. Cookie Secret (`COOKIE_SECRET`)

### When to rotate
- Same conditions as JWT_SECRET
- Rotating this invalidates all user browser sessions

### Steps

```bash
# 1. Generate a new secret
openssl rand -base64 32

# 2. Update on VPS
nano /home/deploy/.env.backend
# Change: COOKIE_SECRET=OLD_VALUE
# To:     COOKIE_SECRET=NEW_VALUE

# 3. Reload Medusa
pm2 reload medusa
```

---

## 4. Cloudflare R2 API Key (`R2_ACCESS_KEY_ID` + `R2_SECRET_ACCESS_KEY`)

### Steps

```bash
# 1. Go to Cloudflare Dashboard → R2 → Manage R2 API tokens
# 2. Create a new token scoped to the medusa-uploads bucket (Object Read & Write)
# 3. Copy the new Access Key ID and Secret Access Key

# 4. Update on VPS
nano /home/deploy/.env.backend
# R2_ACCESS_KEY_ID=NEW_KEY_ID
# R2_SECRET_ACCESS_KEY=NEW_SECRET

# 5. Reload Medusa (image uploads will use new key immediately)
pm2 reload medusa

# 6. Revoke the old API token in the Cloudflare Dashboard
```

---

## 5. Stripe API Key (`STRIPE_API_KEY` + `STRIPE_WEBHOOK_SECRET`)

### Steps

```bash
# 1. Log in to dashboard.stripe.com → Developers → API keys
# 2. Roll the secret key — Stripe keeps the old key active for 24 hours
# 3. Update on VPS
nano /home/deploy/.env.backend
# STRIPE_API_KEY=sk_live_NEW_KEY
# STRIPE_WEBHOOK_SECRET=whsec_NEW_SECRET  (re-register webhook endpoint if needed)

# 4. Reload Medusa
pm2 reload medusa

# 5. Test a checkout in production (use a real small transaction or Stripe test mode)
# 6. Revoke the old key in the Stripe Dashboard after 24h
```

---

## 6. Medusa Publishable API Key (storefront)

This key is intentionally public (`NEXT_PUBLIC_*`). Rotate it if:
- The storefront is decommissioned
- You want to revoke access from old deployments

### Steps

```bash
# 1. Log in to the Medusa Admin panel → Settings → API Keys
# 2. Create a new Publishable API Key
# 3. Update /home/deploy/.env.storefront on the VPS
#    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_NEW_VALUE

# 4. Rebuild and reload the storefront
cd /home/deploy/orin.se/storefront
pnpm build
pm2 reload storefront

# 5. Revoke the old key in the Medusa Admin panel
```

---

## Checklist After Any Rotation

- [ ] New secret is in `/home/deploy/.env.*` on VPS, `chmod 600`
- [ ] PM2 process reloaded: `pm2 reload all`
- [ ] Health check passes: `curl http://localhost:9000/health`
- [ ] Storefront loads without errors
- [ ] Old secret revoked / removed from all systems
- [ ] Rotation date logged in team password manager
