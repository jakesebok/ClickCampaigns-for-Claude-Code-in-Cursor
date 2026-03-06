# Aligned Power Brand Style Guide

*Used for VAPI Assessment campaign and all Aligned Power assets.*

---

## 1. VISUAL IDENTITY

### Brand Concept
**Detonation** — Corporate bones. Orange breaks through.

The brand lives in the contrast between a composed, professional structure and a single orange element that detonates through it. The neutral field says "we know the rules." The orange says "we chose something better." Every use of orange is intentional and earned. When it appears, it means something.

---

### Colors

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| **Primary** | Orange | `#F26522` | Main actions, buttons, highlights, the detonation |
| **Primary Dark** | Orange Dark | `#C4501A` | Hover states, pressed states |
| **Secondary** | Teal | `#2E706A` | Secondary actions, supporting elements, grounding |
| **Secondary Light** | Teal Light | `#3D8C85` | Hover states for teal elements |
| **Background** | Linen | `#F5F3F0` | Page background |
| **Surface** | White | `#FFFFFF` | Cards, panels, inputs |
| **Text** | Ink | `#1A1A1A` | Primary text |
| **Text Mid** | Ink Mid | `#3D3D3D` | Secondary text |
| **Text Muted** | Ink Muted | `#7A7A7A` | Supporting/helper text |
| **Text Subtle** | Ink Subtle | `#B8B8B8` | Placeholders, disabled |
| **Border** | Rule | `#E2E0DC` | Borders, dividers |
| **Border Dark** | Rule Dark | `#C8C5BF` | Stronger borders, nav |

#### CSS Variables (used in all portal/HTML pages)
```css
:root {
  --ap-primary:   #F26522;   /* Orange — detonation */
  --ap-secondary: #2E706A;   /* Teal — grounding */
  --ap-accent:    #2E706A;   /* Teal — accent (replaces old gold) */
  --ap-bg:        #F5F3F0;   /* Linen — background */
  --ap-text:      #1A1A1A;   /* Ink — body text */
  --ap-muted:     #7A7A7A;   /* Muted text */
  --ap-border:    #E2E0DC;   /* Borders */
}
```

#### Usage Ratio — Orange is rare by design
- **Neutral (linen/white/ink):** ~70% of any page
- **Orange:** ~7–10% — CTAs, key numbers, the ONE thing that matters
- **Teal:** ~3–5% — secondary actions, framework elements, achievement
- Never use orange as a background color except for the primary CTA button and intentional "detonation" hero moments

---

### Logo

**Primary mark: Grid Monogram (Mark B)**
- AP letterforms inside a structured grid square
- Orange diagonal stroke cuts corner to corner through the grid
- The grid = the establishment; the stroke = the answer to it
- See: `brand-kit/brand-exploration/logo-concept-detonation.html`

**Wordmark options:**
- Mark A: "ALIGNED Power" with orange slash through the P
- Mark C: "ALIGNED" over rule over italic orange "Power"

**Favicon:** AP grid monogram with orange diagonal — embedded as inline SVG data URI across all HTML files.

**Colorway rules:**
- Light backgrounds: ink AP, orange diagonal
- Dark backgrounds: white AP, orange diagonal (diagonal stays orange always)
- Orange backgrounds: white AP, white diagonal

---

### Typography

| Role | Font | Weight | Notes |
|------|------|--------|-------|
| **Headings** | Cormorant Garamond | 700 | Display, H1, H2, H3 |
| **Display Italic** | Cormorant Garamond | 400 italic | Pull quotes, emphasis moments |
| **Body** | Inter | 400 | Body text, UI copy |
| **Body Bold** | Inter | 600–700 | Labels, buttons, nav |

**Google Fonts import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

### Spacing & Layout

- **Base unit:** 4px
- **Border radius:** 3px (buttons/inputs), 8px (small cards), 16px (main cards), 999px (pills/badges)
- **Card shadow:** `0 1px 4px rgba(26,26,26,0.07), 0 1px 2px rgba(26,26,26,0.05)`
- **Orange shadow:** `0 4px 20px rgba(242,101,34,0.25)`
- **Layout principle:** Composed, professional, restrained — then one orange element detonates through it

---

### Buttons

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| **Primary** | `#F26522` | White | — | Main CTA — one per page |
| **Teal** | `#2E706A` | White | — | Secondary positive action |
| **Outline** | Transparent | Ink | Ink 1.5px | Tertiary actions |
| **Ghost** | Transparent | Muted | Rule 1px | Lowest priority |

---

### Design Principles

1. **The contrast is the brand.** The neutral field earns the orange. Don't use orange everywhere.
2. **Corporate bones, orange detonation.** Structure first, disruption second.
3. **Orange appears where it matters.** Primary CTA. The score that's the focus. The ONE word in a headline that changes everything.
4. **Teal grounds what orange ignites.** Use teal for achievement, completion, framework elements.
5. **Cormorant Garamond for soul. Inter for clarity.** Headlines carry the emotional weight; body copy is direct and functional.

---

*Brand concept: Detonation (Concept 08) — developed February 2026*
