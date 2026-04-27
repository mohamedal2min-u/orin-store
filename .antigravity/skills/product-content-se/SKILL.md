---
name: product-content-se
description: Write and optimize Swedish product content for a multi-brand luxury watch store — names, descriptions, specs, categories, SEO, with scalable templates for 1000+ products.
version: "1.0.0"
author: KRONVÄRD Team
tags:
  - content
  - swedish
  - seo
  - watches
  - copywriting
  - ecommerce
tools:
  - antigravity
  - gemini-cli
---

# Product Content — Swedish Watch Market

## Overview

This skill creates professional Swedish-language product content for a multi-brand luxury watch e-commerce store. It covers product naming, descriptions, technical specifications, category text, and SEO metadata. Designed for scalability (1000–2000 products) with templates and patterns.

## When to Use This Skill

- Writing product titles and descriptions in Swedish
- Creating watch specification tables
- Writing collection/category descriptions
- Generating SEO titles and meta descriptions
- Establishing tone-of-voice for the Swedish market
- Bulk-generating content from brand/model data
- Reviewing and improving existing product copy

## Do NOT Use This Skill When

- Building UI components (use `storefront-builder`)
- Configuring Medusa settings (use `medusa-admin-ops`)
- Working on non-Swedish markets

---

## 1. Brand Voice & Tone

### The Voice

**Modern. Premium. Trustworthy.**

Think: A knowledgeable watch advisor in a well-curated boutique — professional but approachable. Not a luxury magazine (too stiff), not a streetwear brand (too casual).

### Tone Guidelines

| ✅ Do | ❌ Don't |
|-------|---------|
| Use clear, confident language | Use superlatives excessively ("bästa", "fantastisk") |
| Be specific about features | Be vague ("fin klocka") |
| Sound knowledgeable | Sound academic or technical-manual |
| Address the reader directly ("du") | Use formal "Ni" (too distant for e-commerce) |
| Highlight craftsmanship and detail | Make unsubstantiated luxury claims |
| Use Swedish naturally | Use anglicisms when Swedish terms exist |

### Writing Register

- **Du-tilltal** (informal "you") — standard for Swedish e-commerce
- **Active voice** preferred over passive
- **Short paragraphs** — max 3 sentences per paragraph
- **Sentence length** — mix short (impact) with medium (detail)

---

## 2. Product Title Format

### Template

```
[Brand] [Model Name] [Key Identifier] — [Primary Material] / [Key Feature]
```

### Examples

| Brand | Title |
|-------|-------|
| Seiko | Seiko Presage SPB167J1 — Rostfritt stål / Automatisk |
| Tissot | Tissot PRX Powermatic 80 — Blå urtavla / 80h gångreserv |
| Michael Kors | Michael Kors Runway MK9105 — Guld / Kronograf |
| Hugo Boss | Hugo Boss Allure 1514043 — Svart läder / Datum |
| Casio | Casio G-Shock GA-2100 — Carbon Core / Stöttålig |

### Rules

1. **Always start with brand name** — customers search by brand
2. **Include model number** — crucial for watch buyers
3. **Use Swedish for descriptors** — "Rostfritt stål" not "Stainless steel"
4. **Max 70 characters** for SEO title display
5. **No emoji, no ALL CAPS** in titles

### Common Swedish Watch Terms

| English | Swedish |
|---------|---------|
| Stainless steel | Rostfritt stål |
| Leather strap | Läderarmband |
| Automatic | Automatisk |
| Quartz | Kvarts |
| Water resistant | Vattentät |
| Chronograph | Kronograf |
| Date display | Datumvisning |
| Dial | Urtavla |
| Case | Boett |
| Bracelet | Länkarmband |
| Sapphire crystal | Safirkristall |
| Power reserve | Gångreserv |
| Luminous | Lysande visare |
| Bezel | Ring/Lupp |
| Crown | Krona |
| Buckle | Spänne |
| Deployment clasp | Vikspänne |
| Movement | Urverk |
| Winding | Uppdragning |

---

## 3. Product Description Template

### Structure (3-Part Format)

```
[Opening Hook — 1 sentence, evocative, connects to lifestyle]

[Body — 2-3 sentences, key features and craftsmanship details]

[Closing — 1 sentence, subtle call-to-value or ownership appeal]
```

### Example: Seiko Presage SPB167J1

```
En klocka som fångar ögonblicket med japansk precision och tidlös elegans.

Seiko Presage SPB167J1 kombinerar ett automatiskt urverk av kaliber 6R35
med en urtavla i emaljinspirerad finish. Boetten i rostfritt stål mäter
40,5 mm och skyddas av en kupad safirkristall. Med 70 timmars gångreserv
och vattentäthet till 50 meter är den lika pålitlig som den är vacker.

En klocka för dig som uppskattar hantverk och detaljer.
```

### Example: Tissot PRX Powermatic 80

```
Retro i sin renaste form — uppgraderad för moderna handleder.

Tissot PRX Powermatic 80 är en hyllning till 70-talets designspråk med
integrerat länkarmband och tydliga linjer. Det automatiska urverket
Powermatic 80 levererar imponerande 80 timmars gångreserv. Boetten i
rostfritt stål med blå urtavla ger en sofistikerad men avslappnad look.

Vardagslyx som håller med tiden.
```

### Example: Budget Range (Casio G-Shock)

```
Byggd för att klara allt du kastar mot den — och lite till.

Casio G-Shock GA-2100 med Carbon Core Guard-struktur väger bara 51 gram
trots sin robusta konstruktion. Stöttålig, vattentät till 200 meter
och med världstid i 31 tidszoner. Den kompakta 45,4 mm boetten
sitter bekvämt på alla handleder.

Tough enough. Snygg nog.
```

---

## 4. Specification Table Template

### Standard Fields for All Watches

```markdown
| Egenskap          | Värde                          |
|-------------------|--------------------------------|
| Varumärke         | [Brand]                        |
| Modell            | [Model + Reference]            |
| Urverk            | [Movement type + Caliber]      |
| Boettmaterial     | [Case material]                |
| Boettdiameter     | [XX mm]                        |
| Boettjocklek      | [XX mm]                        |
| Urtavla           | [Dial color + finish]          |
| Glas              | [Crystal type]                 |
| Armband           | [Strap/bracelet material]      |
| Vattentäthet      | [XX meter / XX ATM]            |
| Gångreserv        | [XX timmar] (if automatic)     |
| Funktioner        | [Datum, kronograf, etc.]       |
| Vikt              | [XX gram]                      |
| Garanti           | [XX års tillverkargaranti]     |
```

### Conditional Fields

- **Automatic watches:** Add Gångreserv, Frekvens (vibrations/hour)
- **Chronograph:** Add Mätnoggrannhet
- **Dive watches:** Add Vridbar ring (Unidirectional bezel)
- **Smart features:** Add Sensorer, Batteritid

---

## 5. Category & Collection Descriptions

### Category Page Template

```
# [Category Name]

[1-2 sentences describing the category, focusing on the customer's
needs/desires, not just listing products]

[Optional: 1 sentence about the brands available in this category]
```

### Examples

**Automatiska klockor**
```
Klockor som drivs av rörelse, inte batterier. Automatiska urverk
representerar traditionellt urmakeri i sin mest eleganta form.
Vi erbjuder automatiska klockor från Seiko, Tissot, Hamilton och fler.
```

**Herrklockor**
```
Från klassiska dressvarianter till sportiga kronografer — hitta
klockan som passar din stil. Utforska vårt sortiment av herrklockor
från världens mest respekterade urmakare.
```

**Under 3 000 kr**
```
Kvalitet behöver inte kosta en förmögenhet. Upptäck klockor som
kombinerar stil, hållbarhet och prisvärdhet — utan kompromisser
på det som spelar roll.
```

---

## 6. SEO Templates

### SEO Title Format

```
[Product Title] | Köp online | [Store Name]
```

- Max **60 characters** (Google truncates at ~60)
- Include brand + model in title
- "Köp online" signals commercial intent
- Store name at the end

### Examples

```
Seiko Presage SPB167J1 | Köp online | KRONVÄRD
Tissot PRX Powermatic 80 | Köp online | KRONVÄRD
```

### Meta Description Format

```
[Benefit/hook]. [1-2 key features]. [CTA]. Fri frakt över 999 kr.
```

- Max **155 characters**
- Start with benefit, not brand name
- Include 1-2 searchable features
- End with shipping incentive or CTA

### Examples

```
Japansk precision i en tidlös design. Seiko Presage SPB167J1 med
automatiskt urverk och safirkristall. Köp tryggt online.
Fri frakt över 999 kr.

Retro elegans med modern teknik. Tissot PRX Powermatic 80 med
80 timmars gångreserv och integrerat stålarmband. Snabb leverans
i hela Sverige.
```

### Category SEO

| Category | SEO Title | Meta Description |
|----------|-----------|-----------------|
| All watches | Köp klockor online — [Store] | Sveriges urbutik online. Klockor från Seiko, Tissot, Boss och fler. Fri frakt över 999 kr. |
| Automatic | Automatiska klockor — [Store] | Utforska automatiska klockor med mekaniska urverk. Seiko, Tissot, Hamilton. Köp tryggt online. |
| Men's | Herrklockor — [Store] | Stilfulla herrklockor från ledande varumärken. Fri retur inom 30 dagar. |
| Women's | Damklockor — [Store] | Eleganta damklockor för varje tillfälle. Snabb leverans i hela Sverige. |

---

## 7. Scalable Content Generation Workflow

For 1000+ products, use this process:

### Step 1: Brand Data Input

Provide structured input per product:

```json
{
  "brand": "Seiko",
  "model": "Presage",
  "reference": "SPB167J1",
  "movement": "Automatic (6R35)",
  "case_material": "Stainless steel",
  "case_diameter_mm": 40.5,
  "dial_color": "Champagne",
  "crystal": "Sapphire",
  "strap": "Leather",
  "water_resistance_m": 50,
  "power_reserve_h": 70,
  "functions": ["Date"],
  "price_sek": 7500,
  "category": ["herrur", "automatisk"]
}
```

### Step 2: Template Application

The skill generates:
- ✅ Swedish product title
- ✅ 3-part description (hook + body + close)
- ✅ Full specification table in Swedish
- ✅ SEO title (max 60 chars)
- ✅ Meta description (max 155 chars)

### Step 3: Quality Review

For every 50 generated products, manually review 5 for:
- Natural Swedish language flow
- Accurate technical terms
- Consistent tone across brands
- No repeated opening phrases

---

## 8. Brand-Specific Style Notes

### Seiko
- Emphasize: Japanese craftsmanship, value, heritage
- Tone: Respectful, technical, watch-enthusiast friendly
- Key Swedish terms: "japanskt urmakeri", "hantverk", "precision"

### Tissot
- Emphasize: Swiss made, innovation, sport elegance
- Tone: Confident, modern, versatile
- Key Swedish terms: "schweiziskt kvalitetsur", "innovation", "tradition"

### Michael Kors
- Emphasize: Fashion, style, statement
- Tone: Fashion-forward, aspirational, lifestyle
- Key Swedish terms: "modevärld", "stil", "statement-accessoar"

### Hugo Boss
- Emphasize: Professional, refined, modern masculinity
- Tone: Polished, understated luxury
- Key Swedish terms: "professionell elegans", "sofistikerad", "modern klassiker"

### Casio / G-Shock
- Emphasize: Durability, technology, value
- Tone: Direct, energetic, functional
- Key Swedish terms: "stöttålig", "pålitlig", "äventyrsklar"

---

## 9. Content Quality Checklist

Before publishing any product content:

- [ ] Title under 70 characters
- [ ] Description has 3-part structure (hook/body/close)
- [ ] All technical terms in Swedish (not English)
- [ ] Price formatted as `X XXX kr` (Swedish standard)
- [ ] SEO title under 60 characters
- [ ] Meta description under 155 characters
- [ ] Specification table complete (no empty fields)
- [ ] No superlatives without backing ("bäst", "unik" etc.)
- [ ] du-tilltal used consistently (not "ni" or "man")
- [ ] No brand-name misspellings
- [ ] Category assignment is correct

---

## 10. Forbidden Words & Phrases

These are overused or inappropriate for the brand voice:

| ❌ Avoid | ✅ Use Instead |
|---------|---------------|
| Fantastisk | Imponerande / Utmärkt |
| Underbar | Elegant / Sofistikerad |
| Helt unik | Distinkt / Karakteristisk |
| Bäst i test | (Remove — unsubstantiated) |
| Lyxig | Premiumkvalitet / Förfinad |
| Billig | Prisvärd / Tillgänglig |
| Perfekt | Idealisk / Genomtänkt |
| Magisk | (Remove — inappropriate for watches) |
| Wow-faktor | (Remove — too informal) |
| REA!!!!! | Kampanjpris / Erbjudande |
