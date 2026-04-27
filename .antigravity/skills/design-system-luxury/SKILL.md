---
name: design-system-luxury
description: Professional design system for a Swedish luxury watch store — tokens, components, patterns, Minimal Luxury aesthetic with subtle Anti-Design touches.
version: "1.0.0"
author: KRONVÄRD Team
tags:
  - design-system
  - css
  - luxury
  - watches
  - swedish
---

# Design System — Minimal Luxury for Swedish Watch Store

## Overview

Comprehensive design system for a multi-brand watch e-commerce store targeting the Swedish market. Defines every visual decision — colors, typography, spacing, components, and page patterns — ensuring consistency across the entire storefront.

## When to Use

- Defining or updating visual tokens (colors, fonts, spacing)
- Building new UI components
- Reviewing design consistency
- Creating header/footer/card/form patterns
- Ensuring Anti-Design touches stay subtle

## Do NOT Use When

- Configuring Medusa backend (use `medusa-admin-ops`)
- Writing product copy (use `product-content-se`)
- Optimizing SEO (use `seo-commerce-se`)

---

## 1. Design Philosophy

**Minimal Luxury** — The interface is a gallery frame. Watches are the art.

**Anti-Design Rules:**
- Maximum 1-2 subtle touches per page
- Monospace for prices/specs ✅
- Oversized hero text ✅
- Visible grid lines (thin, 1px) ✅
- Glitch/distortion/noise ❌
- Chaotic layouts ❌
- Neon colors ❌

---

## 2. Color Tokens

### Core Palette

```css
:root {
  /* Backgrounds */
  --color-bg-primary:    #0A0A0A;   /* Deep Onyx — main background */
  --color-bg-surface:    #1A1A1A;   /* Nordic Midnight — cards, containers */
  --color-bg-elevated:   #242424;   /* Charcoal — modals, dropdowns */
  --color-bg-inverse:    #F9F9F9;   /* Architectural White — alt sections */

  /* Text */
  --color-text-primary:  #F9F9F9;   /* Primary text on dark */
  --color-text-secondary:#A0A0A0;   /* Muted text */
  --color-text-tertiary: #666666;   /* Disabled/placeholder */
  --color-text-inverse:  #0A0A0A;   /* Text on light backgrounds */

  /* Borders & Lines */
  --color-border:        #2A2A2A;   /* Subtle dark borders */
  --color-border-hover:  #444444;   /* Border on hover */
  --color-divider:       #1E1E1E;   /* Section dividers */

  /* Accent (use sparingly) */
  --color-accent:        #CC9900;   /* Warning Ochre — rare highlights */
  --color-accent-hover:  #B8870D;   /* Accent hover state */

  /* Feedback */
  --color-success:       #2D7A3A;
  --color-error:         #C43E3E;
  --color-warning:       #CC9900;
}
```

### Light Mode Override (for specific sections)

```css
[data-theme="light"] {
  --color-bg-primary:    #FFFFFF;
  --color-bg-surface:    #F5F5F5;
  --color-text-primary:  #0A0A0A;
  --color-text-secondary:#555555;
  --color-border:        #E0E0E0;
}
```

---

## 3. Typography

### Font Stack

```css
:root {
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono:    'Roboto Mono', 'SF Mono', monospace;
}
```

### Type Scale

| Token | Size | Weight | Use |
|-------|------|--------|-----|
| `--text-hero` | 4rem (64px) | 300 | Hero headlines only |
| `--text-2xl` | 2rem (32px) | 400 | Page titles |
| `--text-xl` | 1.5rem (24px) | 400 | Section headings |
| `--text-lg` | 1.25rem (20px) | 500 | Subheadings, prices |
| `--text-base` | 1rem (16px) | 400 | Body text |
| `--text-sm` | 0.875rem (14px) | 400 | Secondary info |
| `--text-xs` | 0.75rem (12px) | 500 | Labels, metadata |

### Letter Spacing

```css
--tracking-tight:    -0.02em;  /* Hero text */
--tracking-normal:    0;       /* Body */
--tracking-wide:      0.05em;  /* Buttons, labels */
--tracking-wider:     0.1em;   /* Brand names, categories */
```

---

## 4. Spacing Scale

```css
:root {
  --space-1:  0.25rem;   /* 4px */
  --space-2:  0.5rem;    /* 8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-24: 6rem;      /* 96px */
  --space-32: 8rem;      /* 128px — generous whitespace */
}
```

**Rule:** When in doubt, use more whitespace. Luxury = breathing room.

---

## 5. Component Guidelines

### Buttons

```css
/* Primary — White on Black, sharp edges */
.btn-primary {
  background: var(--color-text-primary);
  color: var(--color-bg-primary);
  border: none;
  border-radius: 0;
  padding: var(--space-3) var(--space-8);
  font-family: var(--font-primary);
  font-size: var(--text-sm);
  font-weight: 500;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.btn-primary:hover { opacity: 0.85; }

/* Secondary — outlined */
.btn-secondary {
  background: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-hover);
  border-radius: 0;
  padding: var(--space-3) var(--space-8);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}
.btn-secondary:hover { border-color: var(--color-text-primary); }

/* Ghost — text only */
.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border: none;
  text-decoration: underline;
  text-underline-offset: 4px;
}
```

### Product Card

```css
.product-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}
.product-card:hover { transform: translateY(-4px); }

.product-card__image {
  aspect-ratio: 3/4;
  background: var(--color-bg-surface);
  overflow: hidden;
  position: relative;
}
.product-card__brand {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider);
  color: var(--color-text-secondary);
  margin-top: var(--space-4);
}
.product-card__title {
  font-size: var(--text-base);
  font-weight: 400;
  margin: var(--space-1) 0;
}
.product-card__price {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: 600;
}
```

### Input Fields

```css
.input {
  width: 100%;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 0;
  padding: var(--space-3) var(--space-4);
  font-family: var(--font-primary);
  font-size: var(--text-base);
  color: var(--color-text-primary);
  transition: border-color 0.2s;
}
.input:focus {
  outline: none;
  border-color: var(--color-text-primary);
}
.input::placeholder {
  color: var(--color-text-tertiary);
}
.input-label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}
```

---

## 6. Header Pattern

```
┌─────────────────────────────────────────────────┐
│  LOGO (left)          NAV (center)    CART (right) │
│  [KRONVÄRD]    Klockor  Märken  Om oss    [🛒 3] │
└─────────────────────────────────────────────────┘
```

- Fixed position, `backdrop-filter: blur(12px)`
- Background: `rgba(10,10,10,0.85)`
- Height: 64px desktop, 56px mobile
- Logo: `var(--font-primary)`, weight 600, `var(--tracking-wider)`
- Nav links: `var(--text-sm)`, uppercase, `var(--tracking-wide)`
- Border-bottom: `1px solid var(--color-divider)`

### Mobile Header

- Hamburger menu (left)
- Logo (center)
- Cart icon (right)
- Full-screen overlay menu on open

---

## 7. Footer Pattern

```
┌─────────────────────────────────────────────────┐
│  [Logo]                                          │
│                                                  │
│  Kundservice    Information    Följ oss          │
│  Kontakt        Om oss        Instagram          │
│  Returer        Köpvillkor    Facebook           │
│  Frakt          Integritet                        │
│                                                  │
│  ───────────────────────────────────────────      │
│  © 2026 KRONVÄRD. Alla rättigheter förbehållna.  │
└─────────────────────────────────────────────────┘
```

- Background: `var(--color-bg-primary)`
- Top border: `1px solid var(--color-divider)`
- Padding: `var(--space-24) 0 var(--space-8)`
- 3-column layout on desktop, stacked on mobile
- Link style: `var(--text-sm)`, `var(--color-text-secondary)`, hover → white

---

## 8. Grid System

```css
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}
@media (min-width: 768px) {
  .container { padding: 0 var(--space-8); }
}
@media (min-width: 1280px) {
  .container { padding: 0 var(--space-16); }
}

.product-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;
}
@media (min-width: 640px)  { .product-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px)  { .product-grid { grid-template-columns: repeat(3, 1fr); gap: var(--space-6); } }
@media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr); gap: var(--space-8); } }
```

---

## 9. Animation & Transitions

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Buttons | opacity | 200ms | ease |
| Cards | transform | 300ms | ease |
| Links | color | 150ms | ease |
| Inputs | border-color | 200ms | ease |
| Page transitions | opacity | 400ms | ease-in-out |
| Modals | opacity + transform | 300ms | cubic-bezier(0.4, 0, 0.2, 1) |

**Rule:** No bouncy animations. No delays > 400ms. Luxury is smooth and immediate.

---

## 10. Do / Don't Reference

| ✅ Do | ❌ Don't |
|-------|---------|
| Sharp corners (border-radius: 0) | Rounded corners > 4px |
| Monospace for prices/specs | Monospace for body text |
| Generous whitespace | Cramped layouts |
| 1-2 Anti-Design touches per page | Anti-Design on every element |
| Subtle hover (opacity, translateY) | Flashy hover effects |
| Dark backgrounds | Bright/colorful backgrounds |
| Inter + Roboto Mono only | Mix 3+ fonts |
| White primary buttons | Gradient buttons |
| 1px borders | Thick borders or shadows |
