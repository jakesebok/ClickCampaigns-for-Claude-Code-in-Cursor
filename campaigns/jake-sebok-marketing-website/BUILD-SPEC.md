# Jake Sebok Marketing Website — Build Specification

**Campaign:** Jake Sebok Marketing Website  
**Domain:** jakesebok.com  
**Framework:** Next.js 14 (App Router) — clean URLs, Vercel-native, easy to update

---

## Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Hero, brand promise, testimonials, CTAs to VAPI/workshop |
| About | `/about` | Story, credentials, vision, testimonials |
| Work With Me | `/work-with-me` | Offer overview + Aligned Power Accelerator application form |
| Contact | `/contact` | Contact form only (no booking) |
| Testimonials | `/testimonials` | Full testimonial collection |
| Privacy Policy | `/privacy` | Legal |
| Terms of Use | `/terms` | Legal |

---

## Key Requirements

- **Clean URLs** — No .html, framework handles routing
- **Full brand style** — Slate & Spark (style guide)
- **Modern, gorgeous, interactive** — Enneagram 7 energy, iconoclastic, breaks the mold
- **Testimonials** — Scattered on Home + About; full page at /testimonials
- **Application form** — Work With Me: capture revenue, "state their case," why choose them for Accelerator
- **Contact form** — Simple form, no booking
- **Images** — From brand-kit: Pictures of Jacob, Testimonials folder

---

## Offer Flow (Work With Me)

Primary path: Get people into free monthly Aligned Freedom Workshop. Also:
- Free VAPI Assessment
- Free Aligned Freedom Course (Freedom Builders Community)
- Quarterly Strategic Alignment Intensives (paid)
- Paid communities (Aligned Leaders, Growth Alliance Network)
- Aligned Power Accelerator (application required)
- 1:1 VIP Coaching (2 slots/year)

---

## Domain Setup

- **portal.alignedpower.coach** → Existing Vercel project (client portal)
- **jakesebok.com** → This marketing site (new Vercel project)

---

## Deployment

- Same GitHub repo as portal (different root folder)
- Vercel: Root Directory = `campaigns/jake-sebok-marketing-website`
- Custom domain: jakesebok.com
