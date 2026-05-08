---
name: seo-ux-sweden
description: SEO strategy and UX patterns for ORIN.SE targeting the Swedish watch market. Uses Ditur.se as the primary storefront reference for layout, flow, and conversion patterns. Covers locale, structured data, page structure, and mobile UX.
---

# SEO & UX for Sweden — ORIN.SE

> Optimized for the Swedish market (sv-SE, SEK). Uses Ditur.se as the primary UX/layout reference for a professional Scandinavian watch e-commerce experience.

---

## When to Use

- Designing page layouts and navigation
- Writing metadata, titles, and descriptions
- Implementing structured data (Schema.org)
- Reviewing mobile responsiveness
- Auditing conversion flow
- Planning content hierarchy

---

## Design Reference: Ditur.se

Ditur.se is the **primary storefront reference** for structure, UX, layout logic, and e-commerce flow. The goal is to create a similar Swedish watch-store experience — **not a clone** — that can be customized and rebranded.

### What to Replicate (Structure & Patterns)

| Element                    | Pattern from Ditur.se                              |
|----------------------------|-----------------------------------------------------|
| **Homepage structure**     | Hero banner → Featured brands → Category cards → Campaign/sale section → Trust badges → Newsletter |
| **Navigation**             | Mega-menu with brand categories, clean top bar with search, account, cart icons |
| **Product listing**        | Grid layout (2 col mobile, 3-4 col desktop), filters sidebar, sorting dropdown |
| **Filters & sorting**      | Brand, price range, case size, movement type, color — collapsible sidebar on mobile |
| **Product page**           | Large image gallery (left), product info (right), specs table, related products below |
| **Cart & checkout**        | Slide-out cart → multi-step checkout with shipping/payment summary |
| **Mobile responsiveness**  | Hamburger menu, bottom sticky CTA, swipeable image galleries |
| **Trust badges**           | Shipping info, return policy, secure payment — placed near CTA and in footer |
| **Campaign/sale sections** | Banner strips, countdown timers, "REA" badges on product cards |
| **Typography & spacing**   | Clean sans-serif, generous whitespace, consistent vertical rhythm |

### What NOT to Copy

- ❌ Branding, logos, or visual identity
- ❌ Images or copyrighted assets
- ❌ Source code or markup
- ❌ Specific brand names in navigation (use ORIN's own catalog)

### Implementation Approach

- Generate a **clean original implementation** in Next.js + Medusa v2
- Use the layout patterns as wireframe inspiration
- Create original CSS/design system with Scandinavian premium aesthetics
- Generate original images with AI tools (product placeholders, hero banners)

---

## Swedish Locale Configuration

### Language & Currency

| Setting       | Value       |
|---------------|-------------|
| Locale        | `sv-SE`     |
| Currency      | SEK         |
| Currency format | `1 299 kr` (space as thousands separator, "kr" suffix) |
| Date format   | `YYYY-MM-DD` or `D MMMM YYYY` |
| Number format | Decimal comma: `1.299,00` → display as `1 299 kr` |

### Common Swedish E-commerce Terms

| English          | Swedish (use in UI)      |
|------------------|--------------------------|
| Add to cart      | Lägg i varukorgen        |
| Buy now          | Köp nu                   |
| Checkout         | Kassan / Till kassan     |
| Shipping         | Frakt                    |
| Free shipping    | Fri frakt                |
| Return policy    | Returpolicy              |
| In stock         | I lager                  |
| Out of stock     | Slut i lager             |
| Sale / On sale   | REA / Rea                |
| New arrivals     | Nyheter                  |
| Best sellers     | Bästsäljare              |
| Watches          | Klockor                  |
| Wristwatch       | Armbandsur               |
| Men's watches    | Herrklockor              |
| Women's watches  | Damklockor               |
| Search           | Sök                      |
| My account       | Mitt konto               |
| Order history    | Orderhistorik            |
| Payment          | Betalning                |
| Secure payment   | Säker betalning          |
| Customer service | Kundtjänst               |

---

## Page Structure & SEO

### Homepage

```
<title>ORIN — Svenska Klockor Online | Fri Frakt</title>
<meta name="description" content="Upptäck vårt sortiment av armbandsur för herr och dam. Fri frakt, snabb leverans och säker betalning. Handla klockor online hos ORIN.">
```

Layout (inspired by Ditur.se pattern):
1. **Top bar**: Shipping info, contact, locale
2. **Header**: Logo, mega-menu navigation, search, account, cart
3. **Hero banner**: Campaign/seasonal with CTA
4. **Featured brands**: Logo grid or carousel
5. **Category cards**: Herrklockor, Damklockor, Nyheter, REA
6. **Product highlights**: Bästsäljare / trending
7. **Campaign strip**: Sale banner with countdown
8. **Trust section**: Fri frakt, Säker betalning, 30 dagars öppet köp
9. **Newsletter signup**
10. **Footer**: Links, contact, social, payment icons

### Product Listing Page (PLP)

```
<title>Herrklockor — Köp Online | ORIN</title>
<meta name="description" content="Bläddra bland våra herrklockor. Filtrera på märke, pris och stil. Fri frakt och snabb leverans.">
```

- **Single `<h1>`**: Category name (e.g., "Herrklockor")
- **Breadcrumbs**: Hem → Klockor → Herrklockor
- **Filters sidebar**: Brand, price range, case size, movement, color
- **Sort dropdown**: Relevans, Pris (lågt-högt), Pris (högt-lågt), Nyheter
- **Product grid**: 2 col (mobile), 3-4 col (desktop)
- **Product card**: Image, brand, title, price (+ REA badge if on sale)
- **Pagination or infinite scroll**

### Product Detail Page (PDP)

```
<title>{Brand} {Model} — Köp hos ORIN | {Price} kr</title>
<meta name="description" content="{Brand} {Model}. {Short description}. Fri frakt och 30 dagars öppet köp.">
```

Layout (two-column, inspired by Ditur.se):
- **Left**: Image gallery (main image + thumbnails, swipeable on mobile)
- **Right**: Brand, title, price, variant selector, quantity, "Lägg i varukorgen" CTA
- **Below**: Specs table, description, shipping info
- **Bottom**: Related products / "Du kanske också gillar"

### Cart

- **Slide-out panel** (not full page redirect)
- Line items with image, title, quantity, price
- Subtotal, shipping estimate, total
- "Till kassan" CTA
- Continue shopping link

### Checkout

- Multi-step: Kontaktuppgifter → Leverans → Betalning → Bekräftelse
- Payment options: Stripe (card) + Klarna (Pay later / installments)
- Order summary sidebar
- Trust badges near payment section

---

## Structured Data (Schema.org)

### Product Page

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Seiko Presage SPB167",
  "brand": { "@type": "Brand", "name": "Seiko" },
  "description": "...",
  "image": "https://cdn.orin.se/products/abc/main.webp",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "SEK",
    "price": "4999",
    "availability": "https://schema.org/InStock",
    "url": "https://orin.se/klockor/seiko-presage-spb167",
    "seller": { "@type": "Organization", "name": "ORIN" }
  }
}
```

### Organization (site-wide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ORIN",
  "url": "https://orin.se",
  "logo": "https://cdn.orin.se/brand/logo.svg",
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": "Swedish"
  }
}
```

### BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Hem", "item": "https://orin.se" },
    { "@type": "ListItem", "position": 2, "name": "Herrklockor", "item": "https://orin.se/herrklockor" }
  ]
}
```

---

## Technical SEO Checklist

- [ ] `<html lang="sv">` on every page
- [ ] Canonical URLs on all pages
- [ ] `robots.txt` allows crawling, blocks `/api/`, `/_next/`
- [ ] `sitemap.xml` generated dynamically (products, categories)
- [ ] Open Graph tags for social sharing (og:title, og:image, og:description)
- [ ] Alt text on all images (Swedish)
- [ ] No duplicate `<h1>` tags per page
- [ ] Internal linking between related products and categories
- [ ] 301 redirects for any URL changes
- [ ] Page speed: LCP < 2.0s (images via CDN)
- [ ] Mobile-friendly (responsive, touch targets ≥ 44px)
- [ ] HTTPS everywhere (Cloudflare SSL)

---

## URL Structure

| Page            | URL Pattern                        | Example                           |
|-----------------|------------------------------------|-----------------------------------|
| Homepage        | `/`                                | `orin.se`                         |
| Category        | `/{category}`                      | `orin.se/herrklockor`             |
| Brand           | `/marken/{brand}`                  | `orin.se/marken/seiko`            |
| Product         | `/klockor/{slug}`                  | `orin.se/klockor/seiko-presage-spb167` |
| Cart            | `/varukorg`                        | `orin.se/varukorg`                |
| Checkout        | `/kassan`                          | `orin.se/kassan`                  |
| Sale            | `/rea`                             | `orin.se/rea`                     |
| New arrivals    | `/nyheter`                         | `orin.se/nyheter`                 |
| About           | `/om-oss`                          | `orin.se/om-oss`                  |
| Contact         | `/kontakt`                         | `orin.se/kontakt`                 |

> All URLs in **Swedish**, lowercase, hyphens for spaces. No trailing slashes.

---

## Trust & Conversion Elements

Place these strategically (inspired by Ditur.se patterns):

1. **Top bar**: "Fri frakt över 499 kr" + "30 dagars öppet köp"
2. **Product page**: Trust icons near CTA button
3. **Cart**: Shipping estimate + secure payment badges
4. **Checkout**: Payment provider logos (Stripe, Klarna, Visa, Mastercard)
5. **Footer**: Contact info, return policy link, social proof

### Payment Badges

Display accepted payment methods:
- Visa / Mastercard (via Stripe)
- Klarna (Pay later, installments)
- Swish (future consideration)

---

## Mobile UX Priorities

1. **Sticky header** with search and cart
2. **Hamburger menu** with full category tree
3. **Bottom sticky CTA** on product pages ("Lägg i varukorgen")
4. **Swipeable image galleries**
5. **Collapsible filters** on product listing
6. **Touch targets ≥ 44px**
7. **No horizontal scroll**
8. **Fast load**: images via CDN, minimal JS

---

## Typography Guidelines

| Element        | Size (desktop) | Size (mobile) | Weight | Font                |
|----------------|---------------|---------------|--------|---------------------|
| H1             | 32-40px       | 24-28px       | 700    | Sans-serif (Inter/similar) |
| H2             | 24-28px       | 20-24px       | 600    |                     |
| H3             | 20-24px       | 18-20px       | 600    |                     |
| Body           | 16px          | 15px          | 400    |                     |
| Small/caption  | 13-14px       | 12-13px       | 400    |                     |
| Price          | 20-24px       | 18-20px       | 700    |                     |
| Sale price     | 20-24px       | 18-20px       | 700    | Red accent color    |
| Original price | 16px          | 14px          | 400    | Strikethrough       |

---

## Rules

1. **All UI text in Swedish** — no English-facing customer text
2. **SEK currency only** — format as `X XXX kr`
3. **Every page needs unique `<title>` and `<meta description>`**
4. **Structured data on every product page**
5. **Images always have Swedish alt text**
6. **URLs are Swedish, lowercase, hyphenated**
7. **Mobile-first design** — desktop is the enhancement
8. **Use Ditur.se as layout reference** — not for branding or code
9. **Test with Google PageSpeed Insights** after every major change
10. **Lighthouse SEO score target: 95+**
