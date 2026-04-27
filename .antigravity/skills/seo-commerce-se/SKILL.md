---
name: seo-commerce-se
description: SEO optimization for a Swedish watch e-commerce store — titles, meta, schema markup, internal linking, product/category page optimization.
version: "1.0.0"
author: KRONVÄRD Team
tags:
  - seo
  - swedish
  - ecommerce
  - watches
  - structured-data
---

# SEO Commerce — Swedish Watch Market

## Overview

Optimizes the entire SEO strategy for a multi-brand watch e-commerce store targeting Sweden. Covers page-level SEO, structured data, internal linking, and Swedish keyword optimization.

## When to Use

- Creating or improving SEO titles and meta descriptions
- Adding structured data (JSON-LD) to pages
- Planning internal linking architecture
- Optimizing product/category/collection pages
- Running SEO audits before launch
- Keyword research for the Swedish watch market

## Do NOT Use When

- Writing product descriptions (use `product-content-se`)
- Building UI components (use `storefront-builder`)
- Configuring Medusa backend (use `medusa-admin-ops`)

---

## 1. SEO Title Templates

### Rules

- Max **60 characters** (Google truncates beyond this)
- Brand/model first for product pages
- Action keyword ("Köp") for commercial intent
- Store name last, separated by `|`

### Templates by Page Type

| Page | Template | Example |
|------|----------|---------|
| Home | `Klockor online — [Store]` | `Klockor online — KRONVÄRD` |
| Product | `[Brand] [Model] | Köp online | [Store]` | `Seiko Presage SPB167J1 | Köp online | KRONVÄRD` |
| Category | `[Category] — [Store]` | `Automatiska klockor — KRONVÄRD` |
| Collection | `[Collection Name] | [Store]` | `Nyheter höst 2026 | KRONVÄRD` |
| Brand | `[Brand] klockor | Köp online | [Store]` | `Tissot klockor | Köp online | KRONVÄRD` |
| Cart | `Varukorg | [Store]` | `Varukorg | KRONVÄRD` |
| About | `Om oss | [Store]` | `Om oss | KRONVÄRD` |

---

## 2. Meta Description Templates

### Rules

- Max **155 characters**
- Start with benefit or hook, not brand name
- Include 1–2 searchable features
- End with CTA or shipping incentive
- Write in Swedish, du-tilltal

### Templates

**Product:**
```
[Hook/benefit]. [Brand] [Model] med [key feature 1] och [key feature 2].
Köp tryggt online. Fri frakt över 999 kr.
```

**Category:**
```
Utforska [category] från [brands]. [Benefit/selection statement].
Snabb leverans i hela Sverige.
```

**Brand page:**
```
Köp [Brand] klockor online. [Brand positioning statement].
Fri frakt över 999 kr. Säker betalning.
```

**Home:**
```
Sveriges urbutik online. Klockor från Seiko, Tissot, Boss och fler.
Fri frakt över 999 kr. Snabb och säker leverans.
```

---

## 3. Structured Data (JSON-LD)

### Product Page Schema

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Seiko Presage SPB167J1",
  "description": "Automatisk klocka med safirkristall och 70h gångreserv",
  "image": "https://example.com/seiko-spb167j1.jpg",
  "brand": {
    "@type": "Brand",
    "name": "Seiko"
  },
  "sku": "SPB167J1",
  "mpn": "SPB167J1",
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/se/products/seiko-presage-spb167j1",
    "priceCurrency": "SEK",
    "price": "7500",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "KRONVÄRD"
    }
  }
}
```

### Breadcrumb Schema

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Hem", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Herrklockor", "item": "https://example.com/se/collections/herrklockor" },
    { "@type": "ListItem", "position": 3, "name": "Seiko Presage SPB167J1" }
  ]
}
```

### Organization Schema (Home Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KRONVÄRD",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Swedish"
  }
}
```

---

## 4. Internal Linking Strategy

### Link Architecture

```
Home
├── /se/collections/herrklockor     (Herrklockor)
├── /se/collections/damklockor      (Damklockor)
├── /se/collections/automatiska     (Automatiska klockor)
├── /se/collections/kronografer     (Kronografer)
├── /se/brands/seiko                (Seiko)
├── /se/brands/tissot               (Tissot)
├── /se/brands/boss                 (Hugo Boss)
├── /se/products/[handle]           (Product pages)
└── /se/om-oss                      (About)
```

### Linking Rules

| From | To | Method |
|------|----|--------|
| Product page | Related products (same brand) | "Fler från [Brand]" section |
| Product page | Same category products | "Relaterade klockor" section |
| Category page | Top products | Featured grid |
| Category page | Subcategories | Filter/link bar |
| Home page | Top categories | Navigation + featured sections |
| All pages | Categories | Footer links |
| Blog (future) | Product pages | Contextual links |

### Anchor Text Guidelines

- Use descriptive Swedish text, not "Klicka här"
- Include brand name when linking to brand pages
- Include category name when linking to categories
- Vary anchor text (don't repeat exact same text)

---

## 5. URL Structure

### Rules

- All lowercase, Swedish characters converted (`ö` → `o`)
- Hyphens for word separation
- No trailing slashes
- Short and descriptive

### Pattern

```
/se/products/seiko-presage-spb167j1
/se/collections/herrklockor
/se/collections/automatiska-klockor
/se/brands/tissot
```

---

## 6. Swedish Keyword Map

### High-Volume Keywords

| Keyword | Monthly Volume (est.) | Page Target |
|---------|----------------------|-------------|
| klockor online | High | Home |
| herrklockor | High | Category |
| damklockor | High | Category |
| seiko klockor | Medium | Brand page |
| automatiska klockor | Medium | Category |
| tissot klockor | Medium | Brand page |
| köpa klocka online | Medium | Home/Category |
| kronograf klocka | Low-Medium | Category |
| klocka present | Seasonal | Gift guide |

### Long-Tail Keywords (Product Level)

```
seiko presage pris
tissot prx powermatic 80 recension
hugo boss klocka herr
michael kors klocka dam guld
casio g-shock billig
```

---

## 7. Page-Level SEO Checklist

### Every Page Must Have

- [ ] Unique `<title>` tag (max 60 chars)
- [ ] Unique `<meta name="description">` (max 155 chars)
- [ ] Single `<h1>` containing primary keyword
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] `<html lang="sv">` attribute
- [ ] Canonical URL (`<link rel="canonical">`)
- [ ] Open Graph tags (og:title, og:description, og:image)
- [ ] All images have `alt` text in Swedish

### Product Pages Must Also Have

- [ ] Product schema (JSON-LD)
- [ ] Breadcrumb schema
- [ ] Brand name in h1 or h2
- [ ] Specification table with Swedish terms
- [ ] At least 100 words of description
- [ ] Internal links to related products
- [ ] Image alt = "[Brand] [Model] — [key feature]"

### Category Pages Must Also Have

- [ ] 50-150 words of intro text above products
- [ ] Breadcrumb navigation
- [ ] Faceted navigation (brand, price, type)
- [ ] Pagination with `rel="next"` / `rel="prev"`

---

## 8. Technical SEO (Next.js Specific)

### Metadata API (App Router)

```typescript
// app/[countryCode]/products/[handle]/page.tsx
import { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.handle);
  return {
    title: `${product.title} | Köp online | KRONVÄRD`,
    description: `${product.description.slice(0, 150)}...`,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [product.thumbnail],
      type: "website",
      locale: "sv_SE",
    },
    alternates: {
      canonical: `/se/products/${params.handle}`,
    },
  };
}
```

### Robots & Sitemap

```typescript
// app/robots.ts
export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://example.com/sitemap.xml",
  };
}

// app/sitemap.ts
export default async function sitemap() {
  const products = await getAllProducts();
  return [
    { url: "https://example.com", lastModified: new Date() },
    ...products.map(p => ({
      url: `https://example.com/se/products/${p.handle}`,
      lastModified: p.updated_at,
    })),
  ];
}
```

---

## 9. Image SEO

### Alt Text Pattern

```
[Brand] [Model] — [descriptor]
```

Examples:
- `Seiko Presage SPB167J1 — champagnefärgad urtavla`
- `Tissot PRX — blå urtavla med stålarmband`
- `Hugo Boss Allure — svart läderarmband`

### Image Optimization

- Format: WebP (Next.js Image auto-converts)
- Max width: 1200px for product images
- Lazy load below-the-fold images
- Include `width` and `height` attributes

---

## 10. Pre-Launch SEO Audit Checklist

Before going live, verify:

- [ ] All pages return 200 status
- [ ] No duplicate title tags
- [ ] No duplicate meta descriptions
- [ ] All images have alt text
- [ ] Sitemap is generated and accessible
- [ ] robots.txt allows crawling
- [ ] JSON-LD validates (test at schema.org validator)
- [ ] Mobile-friendly (Google Mobile Test)
- [ ] Page speed < 3s LCP
- [ ] No broken internal links
- [ ] Canonical URLs are correct
- [ ] `hreflang` ready for future English version
- [ ] 404 page exists with navigation back
- [ ] HTTPS configured (production only)
