# Blush & Hush — Interior Architecture Website

> **Client:** Blush & Hush Design Studio, Chennai  
> **Built by:** [ClickField AI](https://clickfieldai.com) · clickfieldai@gmail.com  
> **Stack:** Next.js 14 · Tailwind CSS · GSAP · Lenis · TypeScript

---

## About the Project

A luxury interior architecture and bespoke design website for **Blush & Hush**, a Chennai-based studio offering residential, commercial, and hospitality interiors across India and the UAE.

The site is built to Awwwards-level quality — benchmarked against The Line Studio, BAMO Interior Design, Joseph Dirand, and Dimore Studio. Every interaction, animation, and spacing decision is deliberate.

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — hero, projects grid, philosophy, stats, product teaser, quote, contact |
| `/projects` | All projects — filterable list with floating image preview |
| `/projects/[slug]` | Single project — pinned horizontal photo gallery, material details |
| `/studio` | About the studio — story, team, awards |
| `/services` | Services offered |
| `/shop` | Product catalogue — filter, sort, cart drawer |
| `/shop/[slug]` | Single product — swatch selector, lightbox, accordion, cart |
| `/contact` | Commission enquiry form |
| `/sevvagam` | Standalone gallery page for the Sevvagam cabinet — craft storytelling + commission form |

---

## Tech Stack

```
Next.js 14      App Router, TypeScript, SSG/SSR
Tailwind CSS 3  Utility-first styling with custom design tokens
GSAP 3          ScrollTrigger, parallax, stagger, count-up animations
Lenis           Buttery smooth scroll (desktop only)
Google Fonts    Cormorant Garamond (display) + DM Sans (body)
Vercel          Deployment target
```

---

## Design System

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `--navy` | `#0E1B2E` | Primary dark — nav, footer, dark sections |
| `--ivory` | `#F5F0E8` | Primary light — background, cards |
| `--gold` | `#C8A96A` | Accent — labels, rules, price text |
| `--steel` | `#8A9BAE` | Secondary text, captions |
| `--linen` | `#E8E0D5` | Dividers, borders |
| `--charcoal` | `#2C2C2A` | Body text on light backgrounds |

### Typography

- **Display:** Cormorant Garamond — always italic, weight 300
- **Body / UI:** DM Sans — weight 300 / 400 / 500
- All labels: 10px, letter-spacing 0.18em, uppercase

### Global Interactions

- **Lenis smooth scroll** — 1.2s duration, disabled on touch devices
- **Custom cursor** — 8px dot morphs to 56px ring with contextual labels (View / Shop / Enquire / Drag)
- **GSAP ScrollTrigger** — image scale reveals, heading fade-ups, staggered cards, counter animations
- **Page transitions** — ivory curtain wipe between routes
- **Film grain** — 3% opacity SVG noise overlay across entire site
- **Fill-wipe buttons** — CSS `::before` scaleX transition on all CTAs

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone https://github.com/Azhwin05/blushandhush.git
cd blushandhush
npm install
```

### Development

```bash
npm run dev
# → http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout — fonts, metadata, global providers
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Design tokens, typography, button system
│   ├── not-found.tsx           # 404 page
│   ├── projects/
│   │   ├── page.tsx            # Projects grid with filter
│   │   └── [slug]/page.tsx     # Project detail + horizontal gallery
│   ├── studio/page.tsx         # About / team / awards
│   ├── services/page.tsx       # Services
│   ├── shop/
│   │   ├── page.tsx            # Product grid + cart drawer
│   │   └── [slug]/page.tsx     # Product detail + swatch + lightbox
│   ├── contact/page.tsx        # Enquiry form
│   └── sevvagam/
│       ├── layout.tsx          # Sevvagam SEO metadata
│       └── page.tsx            # Standalone Sevvagam cabinet page
├── components/
│   ├── Nav.tsx                 # Fixed nav — transparent → solid on scroll
│   ├── Footer.tsx              # Three-column footer
│   ├── Loader.tsx              # SVG path draw + counter + curtain reveal
│   ├── Cursor.tsx              # Custom cursor — dot + ring + labels
│   ├── SmoothScroll.tsx        # Lenis wrapper (touch-disabled)
│   ├── PageTransition.tsx      # Curtain between route changes
│   ├── ScrollAnimations.tsx    # Global GSAP ScrollTrigger animations
│   ├── FilmGrain.tsx           # SVG noise overlay
│   ├── MarqueeStrip.tsx        # Auto-scrolling ticker
│   ├── TextScramble.tsx        # Hero headline character scramble
│   └── CartDrawer.tsx          # Side-slide cart (context + UI)
├── lib/
│   ├── data.ts                 # Projects and products data
│   └── gsap.ts                 # GSAP + ScrollTrigger registration
├── public/
│   ├── logo-navy.svg
│   ├── logo-ivory.svg
│   └── images/                 # Replace placeholders with real photography
│       ├── projects/
│       ├── products/
│       └── sevvagam/
└── tailwind.config.ts          # Extended with custom colours and fonts
```

---

## Adding Real Photography

All image areas currently show **coloured placeholder `<div>` elements** with correct aspect ratios. To add real images:

1. Place files in `/public/images/projects/`, `/public/images/products/`, `/public/images/sevvagam/`
2. Replace placeholder `<div>` elements with `<Image>` from `next/image`
3. Use `priority={true}` on hero images, `loading="lazy"` elsewhere
4. Hero images require `aspect-video`; product images require `aspect-[4/5]`

### Expected image paths

```
/images/projects/[slug]-hero.jpg
/images/products/[slug]-[material]-01.jpg
/images/sevvagam/hero.jpg
/images/sevvagam/detail-teak.jpg
/images/sevvagam/detail-brass.jpg
/images/sevvagam/detail-cane.jpg
/images/sevvagam/detail-art.jpg
```

---

## Deployment

### Vercel (recommended)

```bash
npm i -g vercel
vercel --prod
```

Or connect the GitHub repo to Vercel at [vercel.com/new](https://vercel.com/new) — it auto-detects Next.js.

### Environment Variables

No environment variables are required for the base site. If connecting a CMS or payment gateway, add them in the Vercel dashboard and `.env.local`.

---

## Roadmap

- [ ] Replace all image placeholders with real photography
- [ ] Connect enquiry forms to email service (Resend / Nodemailer)
- [ ] CMS integration for projects and products (Sanity / Contentful)
- [ ] Checkout flow for shop (Stripe or enquiry-only)
- [ ] Journal / blog section

---

## Built by ClickField AI

This website was designed and developed by **[ClickField AI](https://clickfieldai.com)** for Blush & Hush Design Studio, Chennai.

For support, changes, or new features — contact: **clickfieldai@gmail.com**

---

*© 2025 Blush & Hush Design Studio. All rights reserved.*
