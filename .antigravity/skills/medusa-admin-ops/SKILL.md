---
name: medusa-admin-ops
description: Manage Medusa v2 backend configuration for the Swedish market — regions, SEK currency, VAT 25%, shipping, Stripe preparation, and local store verification.
version: "1.0.0"
author: KRONVÄRD Team
tags:
  - medusa
  - backend
  - sweden
  - ecommerce
  - configuration
tools:
  - antigravity
  - gemini-cli
---

# Medusa Admin Operations — Swedish Market

## Overview

This skill manages the Medusa v2 backend configuration for a Swedish watch e-commerce store. It covers region setup, currency, taxes, shipping, payment provider preparation, and local verification workflows. All operations target **localhost** only in this version.

## When to Use This Skill

- Setting up or modifying the Sweden region
- Configuring SEK currency as default
- Setting up Swedish VAT (25%)
- Preparing Stripe integration (scaffolding only — no live keys)
- Verifying store configuration integrity
- Debugging Admin Dashboard issues
- Managing store settings via Medusa CLI (`npx medusa exec`)

## Do NOT Use This Skill When

- Building storefront UI (use `storefront-builder`)
- Writing product content (use `product-content-se`)
- Deploying to production (not covered in v1.0)

---

## Project Context

```
Project:        KRONVÄRD (temporary name)
Backend:        c:\Users\moham\Desktop\متجر\kronvard\apps\backend
Backend URL:    http://localhost:9000
Admin URL:      http://localhost:9000/app
Admin Email:    mohamed@alamin.se
Admin Password: a550055A!
Database:       medusa-kronvard (PostgreSQL 18.3)
Medusa Version: 2.14.0
Node Version:   24.14.1
```

---

## 1. Region Configuration — Sweden

### Current State
A "Sweden" region with SEK currency has been created via script.

### Required Settings

| Setting              | Value                    |
|----------------------|--------------------------|
| Region Name          | Sweden                   |
| Currency Code        | `sek`                    |
| Countries            | `se` (Sweden)            |
| Payment Providers    | `pp_system_default`      |
| Automatic Taxes      | `true`                   |
| Tax Inclusive Pricing | `true`                   |

### How to Create/Verify via Script

Create a file at `apps/backend/verify-sweden.ts`:

```typescript
import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "automatic_taxes",
             "countries.*", "payment_providers.*"],
  });

  const sweden = regions.find(r => r.name === "Sweden");
  if (!sweden) {
    logger.error("❌ Sweden region NOT FOUND!");
    return;
  }

  logger.info("✅ Sweden region found:");
  logger.info(`   Currency: ${sweden.currency_code}`);
  logger.info(`   Auto taxes: ${sweden.automatic_taxes}`);
  logger.info(`   Countries: ${sweden.countries?.map(c => c.iso_2).join(", ")}`);
  logger.info(`   Providers: ${sweden.payment_providers?.map(p => p.id).join(", ")}`);
}
```

Run: `npx medusa exec verify-sweden.ts`

### How to Verify via Admin Dashboard

1. Open `http://localhost:9000/app`
2. Go to **Settings → Regions**
3. Confirm "Sweden" region exists with:
   - Currency: SEK
   - Country: Sweden (SE)
   - Automatic Taxes: ON
   - Tax Inclusive: ON

---

## 2. Currency Configuration — SEK

### Store-Level Currencies

The store must list SEK as a supported currency. Without this, SEK will NOT appear in the Region creation dropdown.

**Root cause (documented):** Medusa v2 filters the currency dropdown in Admin to show only currencies listed in `store.supported_currencies`. The default seed only includes EUR and USD.

### Current Supported Currencies

| Currency | Code | Default |
|----------|------|---------|
| Swedish Krona | `sek` | ✅ Yes |
| Euro | `eur` | No |
| US Dollar | `usd` | No |

### Verification Script

```typescript
// apps/backend/verify-currencies.ts
import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "name", "supported_currencies.*"],
  });

  const store = stores[0];
  logger.info(`Store: ${store.name}`);
  logger.info("Supported currencies:");
  for (const c of store.supported_currencies || []) {
    logger.info(`  ${c.currency_code.toUpperCase()} ${c.is_default ? "(DEFAULT)" : ""}`);
  }
}
```

---

## 3. Tax Configuration — Swedish VAT 25%

### Tax Region Setup

| Setting         | Value    |
|-----------------|----------|
| Country         | `se`     |
| Provider        | `tp_system` |
| Default Rate    | 25%      |
| Rate Name       | Moms     |

### Script to Create Tax Rate

```typescript
// apps/backend/setup-tax.ts
import { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createTaxRatesWorkflow } from "@medusajs/medusa/core-flows";

export default async function ({ container }: { container: MedusaContainer }) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  // Find the tax region for Sweden
  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  });

  const seTaxRegion = taxRegions.find(r => r.country_code === "se");
  if (!seTaxRegion) {
    logger.error("❌ No tax region for Sweden. Create it first.");
    return;
  }

  await createTaxRatesWorkflow(container).run({
    input: [
      {
        tax_region_id: seTaxRegion.id,
        name: "Moms",
        code: "se-vat-25",
        rate: 25,
        is_default: true,
      },
    ],
  });

  logger.info("✅ Swedish VAT 25% (Moms) created successfully!");
}
```

---

## 4. Shipping Configuration

### Recommended Setup for Sweden

| Option            | Name               | Type | Price (SEK) |
|-------------------|--------------------|------|-------------|
| Standard          | Standardfrakt      | flat | 49          |
| Express           | Expressfrakt       | flat | 99          |
| Free (threshold)  | Fri frakt          | flat | 0           |

**Note:** Free shipping can be configured with price rules (e.g., orders over 999 SEK).

### Verification Checklist

- [ ] Fulfillment set exists for Sweden
- [ ] Service zone includes country code `se`
- [ ] Shipping profile is linked
- [ ] Stock location is linked to fulfillment provider
- [ ] At least one shipping option has SEK pricing

---

## 5. Stripe Preparation (Scaffolding Only)

> ⚠️ **No live Stripe keys are configured yet.** This section documents the setup steps for when keys become available.

### Step 1: Install Stripe Plugin

```bash
cd apps/backend
npm install @medusajs/payment-stripe
```

### Step 2: Add to medusa-config.ts

```typescript
// In the modules array:
{
  resolve: "@medusajs/payment-stripe",
  options: {
    apiKey: process.env.STRIPE_API_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },
}
```

### Step 3: Add Environment Variables

```env
# apps/backend/.env
STRIPE_API_KEY=sk_test_...         # Add when available
STRIPE_WEBHOOK_SECRET=whsec_...    # Add when available
```

### Step 4: Enable in Sweden Region

After Stripe is installed, add `pp_stripe_stripe` to the Sweden region's payment providers via Admin Dashboard or script.

### Readiness Checklist

- [ ] `@medusajs/payment-stripe` installed
- [ ] Config added to `medusa-config.ts`
- [ ] `.env` placeholders created
- [ ] Region updated with Stripe provider
- [ ] Test payment completed on localhost

---

## 6. Full Store Verification Checklist

Run through this checklist after any configuration change:

### Backend Health

- [ ] `npm run dev` starts without errors
- [ ] API responds at `http://localhost:9000/health`
- [ ] Admin loads at `http://localhost:9000/app`

### Store Settings

- [ ] Store has SEK as supported currency
- [ ] SEK is set as default currency
- [ ] Sweden region exists with correct settings

### Tax

- [ ] Tax region for `se` exists
- [ ] Default rate is 25% (Moms)
- [ ] Tax inclusive pricing is enabled

### Shipping

- [ ] At least one shipping option with SEK pricing
- [ ] Fulfillment set covers Sweden

### Payment

- [ ] System default payment provider is active
- [ ] (Later) Stripe provider is active and tested

---

## Common Issues & Fixes

| Issue | Root Cause | Fix |
|-------|-----------|-----|
| SEK not in currency dropdown | Not in `store.supported_currencies` | Run `update-store.ts` script |
| Can't create Sweden region | SEK not supported OR country `se` already assigned | Remove `se` from other regions first |
| Tax rate not applying | No default tax rate for `se` tax region | Run `setup-tax.ts` |
| Admin won't load | Backend not running | `cd apps/backend && npm run dev` |

---

## File Locations

| File | Purpose |
|------|---------|
| `apps/backend/medusa-config.ts` | Core Medusa configuration |
| `apps/backend/.env` | Environment variables |
| `apps/backend/src/migration-scripts/initial-data-seed.ts` | Seed data (modified to include SEK) |
| `apps/backend/update-store.ts` | Script to add SEK to existing store |
| `apps/backend/create-sweden-region.ts` | Script to create Sweden region |
