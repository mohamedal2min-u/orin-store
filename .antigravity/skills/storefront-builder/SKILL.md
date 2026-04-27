---
name: storefront-builder
description: Build and develop the Next.js storefront connected to Medusa v2 — pages, components, Swedish localization, Minimal Luxury design with subtle Anti-Design touches.
version: "1.0.0"
author: KRONVÄRD Team
tags:
  - nextjs
  - storefront
  - frontend
  - swedish
  - design
  - ecommerce
tools:
  - antigravity
  - gemini-cli
---

# Storefront Builder — KRONVÄRD

## Overview

This skill guides the development of the Next.js 15 storefront for a Swedish luxury watch e-commerce store. It covers page creation, component architecture, Swedish language support, and the "Minimal Luxury + subtle Anti-Design" visual language. All development targets **localhost:8000** in this version.

## When to Use This Skill

- Creating new pages (home, product, collection, cart, checkout)
- Building reusable UI components
- Organizing the project file structure
- Implementing Swedish (sv) language support
- Applying design tokens and visual patterns
- Customizing the Medusa Next.js starter
- Responsive design adjustments

## Do NOT Use This Skill When

- Configuring Medusa backend settings (use `medusa-admin-ops`)
- Writing product copy or SEO content (use `product-content-se`)
- Deploying to production (not in scope for v1.0)

---

## Project Context

```
Storefront:     c:\Users\moham\Desktop\متجر\kronvard\apps\storefront
Framework:      Next.js 15.3.9 (Turbopack)
Storefront URL: http://localhost:8000
Backend URL:    http://localhost:9000
Package:        @dtc/storefront
Region:         Sweden (SEK)
Language:       Swedish (primary), English (future-ready)
```

---

## 1. Design Language

### Philosophy
**Minimal Luxury** — Let the watches speak. The interface is a gallery frame, not the painting.

With **subtle Anti-Design touches** — Small intentional imperfections that create character: a slightly oversized header, a monospace price tag, or a raw grid line. Never chaotic. Never brutalist. Just enough edge to feel modern.

### Reference: DESIGN.md

The project-level `DESIGN.md` at the project root defines the canonical design system. All components MUST reference it. Key tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#0A0A0A` | Primary dark background |
| `--color-surface` | `#1A1A1A` | Cards, containers |
| `--color-text` | `#F9F9F9` | Primary text |
| `--color-border` | `#E0E0E0` | Dividers, subtle borders |
| `--color-accent` | `#CC9900` | Rare highlights only |
| `--font-primary` | `Inter` | Body text |
| `--font-mono` | `Roboto Mono` | Prices, specs, serial numbers |
| `--radius` | `0` | Sharp edges (Anti-Design) |

### Typography Scale

```css
/* Base: 16px */
--text-xs:   0.75rem;   /* 12px — labels, metadata */
--text-sm:   0.875rem;  /* 14px — secondary text */
--text-base: 1rem;      /* 16px — body */
--text-lg:   1.25rem;   /* 20px — subheadings */
--text-xl:   1.5rem;    /* 24px — section titles */
--text-2xl:  2rem;      /* 32px — page titles */
--text-hero: 4rem;      /* 64px — hero headlines */
```

### Spacing System

```css
--space-xs:  0.25rem;  /* 4px */
--space-sm:  0.5rem;   /* 8px */
--space-md:  1rem;     /* 16px */
--space-lg:  2rem;     /* 32px */
--space-xl:  4rem;     /* 64px */
--space-2xl: 8rem;     /* 128px — generous whitespace */
```

---

## 2. Project Structure

### Recommended Directory Layout

```
apps/storefront/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [countryCode]/       # Dynamic region routing
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── layout.tsx       # Region layout
│   │   │   ├── products/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx # Product detail page
│   │   │   ├── collections/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx # Collection page
│   │   │   ├── cart/
│   │   │   │   └── page.tsx     # Cart page
│   │   │   └── checkout/
│   │   │       └── page.tsx     # Checkout page
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Design tokens + base styles
│   │
│   ├── components/              # Reusable UI components
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── product/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── ProductDetails.tsx
│   │   │   └── PriceTag.tsx     # Monospace SEK price
│   │   ├── cart/
│   │   │   ├── CartItem.tsx
│   │   │   └── CartSummary.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Badge.tsx
│   │       └── Skeleton.tsx
│   │
│   ├── lib/
│   │   ├── medusa.ts            # Medusa client setup
│   │   ├── i18n/
│   │   │   ├── sv.json          # Swedish translations
│   │   │   ├── en.json          # English (future)
│   │   │   └── index.ts         # Translation utility
│   │   └── utils.ts             # Helpers (formatPrice, etc.)
│   │
│   └── styles/
│       ├── tokens.css           # CSS custom properties
│       └── components.css       # Component-specific styles
│
├── public/
│   ├── fonts/                   # Self-hosted Inter & Roboto Mono
│   └── images/
│
└── .env.local                   # Environment variables
```

---

## 3. Swedish Language Support (sv)

### Architecture: i18n-Ready but sv-Only

Use a simple JSON-based translation system. NO heavy i18n library needed for a single-language store.

```typescript
// src/lib/i18n/sv.json
{
  "nav": {
    "home": "Hem",
    "watches": "Klockor",
    "collections": "Kollektioner",
    "cart": "Varukorg",
    "search": "Sök",
    "about": "Om oss",
    "contact": "Kontakt"
  },
  "product": {
    "addToCart": "Lägg i varukorgen",
    "outOfStock": "Slut i lager",
    "specifications": "Specifikationer",
    "description": "Beskrivning",
    "relatedProducts": "Relaterade klockor",
    "price": "Pris",
    "sku": "Artikelnummer",
    "freeShipping": "Fri frakt över 999 kr"
  },
  "cart": {
    "title": "Din varukorg",
    "empty": "Din varukorg är tom",
    "subtotal": "Delsumma",
    "shipping": "Frakt",
    "tax": "Moms (25%)",
    "total": "Totalt",
    "checkout": "Till kassan",
    "continueShopping": "Fortsätt handla",
    "remove": "Ta bort",
    "quantity": "Antal"
  },
  "checkout": {
    "title": "Kassa",
    "shipping": "Leveransinformation",
    "payment": "Betalning",
    "review": "Granska beställning",
    "placeOrder": "Slutför köp",
    "firstName": "Förnamn",
    "lastName": "Efternamn",
    "email": "E-post",
    "phone": "Telefon",
    "address": "Adress",
    "city": "Stad",
    "postalCode": "Postnummer",
    "country": "Land"
  },
  "footer": {
    "customerService": "Kundservice",
    "returns": "Returer & byten",
    "shipping": "Frakt & leverans",
    "privacy": "Integritetspolicy",
    "terms": "Köpvillkor",
    "followUs": "Följ oss"
  },
  "common": {
    "currency": "kr",
    "loading": "Laddar...",
    "error": "Något gick fel",
    "retry": "Försök igen",
    "seeAll": "Visa alla",
    "new": "Nyhet",
    "sale": "Rea"
  }
}
```

### Translation Utility

```typescript
// src/lib/i18n/index.ts
import sv from "./sv.json";

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string
      ? T[K] extends object ? `${K}.${NestedKeyOf<T[K]>}` : K
      : never
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<typeof sv>;

export function t(key: string): string {
  const keys = key.split(".");
  let value: any = sv;
  for (const k of keys) {
    value = value?.[k];
  }
  return typeof value === "string" ? value : key;
}
```

### Adding English Later

1. Create `src/lib/i18n/en.json` with the same keys
2. Add a locale parameter to `t()` function
3. Use the `[countryCode]` route param to select locale
4. No structural changes needed

---

## 4. Component Patterns

### Button Component

```tsx
// src/components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* CSS (in components.css):
.btn {
  font-family: var(--font-primary);
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn--primary {
  background: var(--color-text);
  color: var(--color-bg);
}
.btn--primary:hover {
  opacity: 0.85;
}
.btn--secondary {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.btn--ghost {
  background: transparent;
  color: var(--color-text);
  text-decoration: underline;
}
*/
```

### PriceTag Component (Anti-Design Touch)

```tsx
// src/components/product/PriceTag.tsx
interface PriceTagProps {
  amount: number;
  currency?: string;
}

export function PriceTag({ amount, currency = "SEK" }: PriceTagProps) {
  const formatted = new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100);

  return (
    <span className="price-tag">
      {formatted}
    </span>
  );
}

/* CSS:
.price-tag {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-text);
}
*/
```

### ProductCard Component

```tsx
// src/components/product/ProductCard.tsx
import { PriceTag } from "./PriceTag";
import Image from "next/image";

interface ProductCardProps {
  title: string;
  handle: string;
  thumbnail: string | null;
  price: number;
  brand?: string;
}

export function ProductCard({
  title,
  handle,
  thumbnail,
  price,
  brand,
}: ProductCardProps) {
  return (
    <a href={`/se/products/${handle}`} className="product-card">
      <div className="product-card__image">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        )}
      </div>
      <div className="product-card__info">
        {brand && <span className="product-card__brand">{brand}</span>}
        <h3 className="product-card__title">{title}</h3>
        <PriceTag amount={price} />
      </div>
    </a>
  );
}

/* CSS:
.product-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}
.product-card:hover {
  transform: translateY(-4px);
}
.product-card__image {
  position: relative;
  aspect-ratio: 3/4;
  background: var(--color-surface);
  overflow: hidden;
}
.product-card__info {
  padding: var(--space-md) 0;
}
.product-card__brand {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-border);
}
.product-card__title {
  font-size: var(--text-base);
  font-weight: 400;
  margin: var(--space-xs) 0;
}
*/
```

---

## 5. Page Templates

### Home Page Structure

```
┌─────────────────────────────────────┐
│  HEADER (minimal, logo + nav)       │
├─────────────────────────────────────┤
│                                     │
│  HERO (full-width, single watch     │
│  image, oversized headline)         │
│                                     │
├─────────────────────────────────────┤
│  FEATURED COLLECTION                │
│  (4-column grid of ProductCards)    │
├─────────────────────────────────────┤
│  BRAND STRIP                        │
│  (monospace logos/names row)         │
├─────────────────────────────────────┤
│  NEWSLETTER / CTA                   │
│  (single input, minimal design)     │
├─────────────────────────────────────┤
│  FOOTER                             │
└─────────────────────────────────────┘
```

### Product Detail Page Structure

```
┌─────────────────────────────────────┐
│  BREADCRUMB (Hem > Klockor > Name)  │
├──────────────────┬──────────────────┤
│                  │  BRAND (mono)    │
│  PRODUCT IMAGE   │  TITLE           │
│  (large, clean   │  PRICE (mono)    │
│   background)    │  ADD TO CART     │
│                  │  SPECS TABLE     │
├──────────────────┴──────────────────┤
│  DESCRIPTION (clean prose)          │
├─────────────────────────────────────┤
│  RELATED PRODUCTS (grid)            │
└─────────────────────────────────────┘
```

---

## 6. Responsive Breakpoints

```css
/* Mobile first */
--bp-sm:  640px;    /* Large phones */
--bp-md:  768px;    /* Tablets */
--bp-lg:  1024px;   /* Small laptops */
--bp-xl:  1280px;   /* Desktops */
--bp-2xl: 1536px;   /* Large screens */
```

### Grid Columns by Breakpoint

| Breakpoint | Product Grid | Spacing |
|-----------|-------------|---------|
| Mobile    | 1 column    | 16px    |
| sm        | 2 columns   | 16px    |
| md        | 3 columns   | 24px    |
| lg+       | 4 columns   | 32px    |

---

## 7. Anti-Design Touches (Use Sparingly)

These are the "subtle imperfections" that give the store character. Use **maximum 1-2 per page**.

| Technique | Example | Where to Use |
|-----------|---------|-------------|
| Monospace in unexpected places | Price tags, SKUs | Product cards, detail pages |
| Oversized typography | Hero headlines at 4-6rem | Home page hero only |
| Visible grid lines | Thin 1px lines between grid items | Collection pages |
| Asymmetric spacing | One side has more margin | Hero sections |
| Raw hover states | Simple opacity change, no gradients | Links, cards |
| Uppercase tracking | Widely-spaced uppercase for labels | Category names, nav |

### ❌ Do NOT

- Use glitch effects or distorted typography
- Mix more than 2 fonts
- Use neon or high-saturation colors
- Add noise textures or grain overlays
- Make text hard to read
- Use Comic Sans "ironically"

---

## 8. Performance Guidelines

- Use Next.js `Image` component for all images
- Lazy-load below-the-fold components
- Self-host fonts (Inter, Roboto Mono) via `next/font`
- Keep CSS under 50KB total
- Use Server Components by default; Client Components only for interactivity
- Target LCP < 2.5s, CLS < 0.1
