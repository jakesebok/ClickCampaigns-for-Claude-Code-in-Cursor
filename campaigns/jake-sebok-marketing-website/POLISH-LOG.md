# Jake Sebok Marketing Site — Polish Log

> Structured per-wave evidence from the premium polish pass.
> Adapted from LocalCraft Digital's `polish-wave-runner` skill for a Next.js App Router + Tailwind site.
>
> Each wave entry below records: checklist evidence (with adapted-for-Next.js grep commands), criteria audit, Steve Jobs gut-test (against mobile screenshots), bonus prompts, commit SHA on `polish-pass` branch, and the localhost preview URL (`http://localhost:3001` — port 3001 because LocalCraft Digital owns 3000).
>
> No Vercel deploys during the pass. `polish-pass` branch only; `main` stays untouched.

---

## Wave 1 — Foundations

**Theme**: kill the AI-tells. Establish the bones the rest of the polish builds on.

**Started**: 2026-05-29T22:00Z
**Completed**: 2026-05-29T23:35Z
**Commit**: f46fb43
**Deploy**: http://localhost:3001/

### Checklist evidence

- [x] **1.1 No theme toggle / dark-mode / prefers-color-scheme user toggle** — `grep -RIn "theme-toggle\|dark-mode\|prefers-color-scheme" app/ components/` returns **0** hits in user-facing UI. `prefers-color-scheme` does not appear at all; `prefers-reduced-motion` hits are accessibility-only (ALFRED hero animations, intake wizard) and unrelated to a theme toggle.
- [x] **1.2 No pill-shaped credibility chips above any H1** — `grep -REn 'class[Nn]ame="[^"]*\b(chip|pill|badge)\b[^"]*"'` returns 24 hits across the codebase but every hit is a `cta-pill` or `rounded-pill` BUTTON class — none is a credibility chip stacked above an H1. Visually confirmed on home + about + work-with-me screenshots: no "ESTABLISHED 2025" / "PREMIUM COACHING" badge floating above any H1.
- [x] **1.3 Hero H1 contains italic accent word on every page** — 14/14 page H1s carry an italic accent (added Cormorant `<em>` spans on home, about, work-with-me, apply, apply/thank-you, contact, contact/thank-you, who-is-alfred, build-your-assessment, privacy, terms, blog, testimonials, client-stories). Italic accent word per page: home=`life`, about=`I'm`, work-with-me=`in`, apply=`12-month`, apply/thank-you=`personally`, contact=`talk`, contact/thank-you=`Thanks`, who-is-alfred=`Clarity`, build-your-assessment=`experience`, privacy=`Privacy`, terms=`Terms`, blog=`Answers`, testimonials=`transformation`, client-stories=`results`. Self-verify command: walk every page file, locate first `<h1`, scan 12 lines after for `<em>` / `<i>` / `italic` token — all 14 returned ≥1.
- [N/A] **1.4 Hero `tel:` href** — N/A. Jake's offer is **application-gated** (Aligned Power Program is 12-month, 1:1, $$$). Per industry research adaptation (Litvin/Goldsmith), high-ticket coaches deliberately do NOT show a phone/Calendly above-the-fold because it kills the premium signal. Phone CTA would be a downgrade. Logged under Adaptations.
- [x] **1.5 Hero glass founder-quote card** — `grep -n "founder-quote" app/page.tsx` returns **2** hits (line 132 desktop slot, line 257 mobile slot). The existing hero portrait-+-pull-quote block was reclassed as `.founder-quote.glass-card` and given a real frosted-glass treatment in `globals.css` (backdrop-filter blur+saturate, inset white highlight, radial top-left light wash, accent ring). Quote: "Your business shouldn't be a beautiful prison. It should be the best expression of who you naturally are."
- [x] **1.6 No clip-art / Bootstrap-default icon inside the hero** — Visual verification on `polish-shots/wave-1/home-mobile.png` and `home-desktop.png`. Hero contains: brand wordmark + flame-disc mark (custom SVG), Jake's MMC portrait photo (real), and a single inline ARROW SVG on the primary CTA (12-pt custom stroke, not Bootstrap). No FontAwesome, no clip-art smileys, no stock-shape ornaments.
- [x] **1.7 Sticky mobile CTA bar** — `grep "sticky-cta" globals.css` returns **6** rule hits (`.sticky-cta`, hidden-state, anchor styling, primary, secondary, ≥md hide). `grep "sticky-cta" components/SiteCTAs.tsx` returns **1** JSX hit (`<div className="sticky-cta" ...>`). Component mounted in `app/layout.tsx`. Two pills: "Take the VAPI™" primary (gradient) + "Apply" secondary (glass on dark). Auto-hides on intake-style routes (/work-with-me/apply, /build-your-assessment, /contact, /who-is-alfred, /assessment) via `data-hidden` attribute driven by `usePathname()`. Honors `env(safe-area-inset-bottom)`. Visible at the bottom of every wave-1 mobile screenshot of marketing pages.
- [x] **1.8 Desktop floating CTA pill** — `grep "floating-cta" globals.css` returns **6** rule hits. `grep "floating-cta" components/SiteCTAs.tsx` returns **1** JSX hit (`<Link className="floating-cta" ...>`). Bottom-right pill that fades in after 600px scroll (managed by scroll listener in client component), single ask: "Take the VAPI™". Same suppress-list as sticky-cta. Not visible at scroll=0 in desktop screenshots (by design — it only appears after the user scrolls past the hero).
- [x] **1.9 No copy that fails cold-read test** — Walked home, about, work-with-me, who-is-alfred, contact, apply. Existing copy is in Jake's voice (Litvin/Burchard register, sentence stops not em-dashes per his lexicon). No insider jargon visible. The two terms a cold reader meets — VAPI™ and Aligned Power Program — are both immediately defined inline ("72 statements. About 12 minutes." and "My flagship 12-month, 1:1, high-touch growth and performance coaching"). No changes needed at the Wave-1 layer. Light copy critique deferred to Wave 7 conversion-architecture pass.
- [x] **1.10 No `*.vercel.app` placeholders in canonical/OG/sitemap** — `grep -RIn "vercel\.app" app/ components/ lib/` returns **0** hits. Canonical URLs already point to `https://jakesebok.com/` (verified in `app/page.tsx` metadata + `app/layout.tsx` metadataBase).

### Grep adaptations

LocalCraft skill assumes `.html` + `.css` files; Jake's site is Next.js App Router (.tsx + Tailwind utilities in `className=`). Every checklist grep was adapted:

- `grep *.html` → `grep -RIn --include="*.tsx" "..." app/ components/`
- `grep *.css` → `grep` on `app/globals.css` AND audit Tailwind utility classes in .tsx
- Tailwind equivalents used:
  - `font-size: 16px` → `text-base` / `text-[16px]`
  - `outline-offset: 4px` → `outline-offset-4` / `outline-offset-[4px]`
  - `translateY(-6px)` → `hover:-translate-y-1.5` / `hover:-translate-y-[6px]`
  - `linear-gradient` → `bg-gradient-to-*` / `bg-[linear-gradient(...)]`
  - `max-width: 75ch` → `max-w-[75ch]` / `max-w-prose`
  - `text-wrap: balance` → `[text-wrap:balance]`
- Inline `style={{ clipPath: ... }}` attributes also greppable (used for accent wedge audit).
- H1 italic verification: awk's `/<h1>/,/<\/h1>/` range pattern doesn't span JSX line-breaks reliably, so used `grep -n "<h1"` to find the start line, then `sed -n "${L},$((L+12))p" | grep -cE "<em\b|<i\b|italic"` to scan 12 lines after — this matches both `<em>` tags and `italic` utility tokens.

### Patterns applied this wave

From the industry-research patterns library:

- **Founder Photo + Pull-Quote, Glass Treatment Above the Fold** (research: Joe Hudson, Litvin) — applied as `.founder-quote.glass-card` on home hero desktop slot + mobile fallback slot. Real photo (MMC profile), real attributable quote in Jake's voice. Replaces no-photo / stock-photo trope.
- **Poetic-Line Sectional Anchors** (research: Hudson) — preserved existing "Have it all. Really.", "Two ways in. Your pace.", "Clarity in your pocket when it matters.", "Got it.", "Thank you. I read every one personally." Each Wave-1 italic accent word reinforces the iconic-line cadence.
- **Trademark Symbol as Premium Tax** (research: Brendon, The Futur) — VAPI™ and Aligned Power™ used consistently on first mention per page (already in copy per Jake's frozen lexicon).
- **Single Dominant CTA on Mobile** (research: Litvin) — sticky-mobile-CTA bar leads with **Take the VAPI™** (free, low-friction). Apply is the secondary ghost pill so the assessment carries the conversion weight, matching Litvin's "scorecard as front door, application gated behind it" architecture.

Patterns explicitly NOT applied in Wave 1 (and why):
- **Newsletter count as social proof** — research flagged as not-yet (list isn't 5k+ yet). Skip until real number exists.
- **Contrarian Disqualifier Section** — strong Litvin move but belongs to Wave 5 (cross-page distinctiveness) on the About/Work-With-Me page, not the foundations layer.
- **Two-minute self-diagnostic as TOFU** — VAPI™ already plays this role and is the dominant CTA. No additional instrument needed.

### Adaptations specific to Jake's site (NOT LocalCraft customer build)

- No phone CTA anywhere (logged as N/A on 1.4). Premium 1:1 coaching is application-gated.
- No "Trusted by Major Brands" client-logo row. Substituted with the existing "Trusted by Doctors · Coaches · Healers · Bodyworkers · Creators" audience row.
- No urgency timers / "spots remaining" mechanics, per industry-research anti-patterns list.
- Mobile accent wedges (clip-path diagonals) hidden via `hidden lg:block` and replaced with a subtle `bg-gradient-to-br from-ap-accent/10 via-ap-accent/3 to-transparent` wash. The wedges were causing visual overflow + crowding on the 430px viewport; on desktop they remain as intentional brand flourish.
- Added a global `html, body { overflow-x: clip; max-width: 100vw }` belt-and-suspenders rule to prevent any single absolute element from pushing the page beyond viewport width on mobile.
- Explicit `viewport` export added to `app/layout.tsx` with `width=device-width, initial-scale=1, viewport-fit=cover` — covers iOS safe-area-inset handling for the sticky-cta bar.

### Criteria audit

- [x] **Hierarchy** — H1 is unambiguously the dominant visual element above the fold on every page. Italic accent word draws the eye to the page's emotional anchor (life / I'm / talk / Clarity / Privacy / Terms / etc).
- [x] **Restraint** — single accent color (`--ap-accent` orange), single accent font (Cormorant italic for accent + Outfit bold for default + Outfit small caps for eyebrow), single ornament family (orange divider bars + flame-mark). No double-treatment sections.
- [x] **Micro-interactions** — every interactive surface has hover state distinct from rest (`.cta-pill:hover` lifts 2px + adds orange shadow). Focus rings for floating-cta added. Default link focus relies on Tailwind preflight; will be hardened in Wave 3.
- [x] **Typographic editorial feel** — italic Cormorant accent word per H1. Body text 1.25rem (text-xl) on mobile, well above 16px floor. Prose width capped by container max-w-[640px] / max-w-2xl. Text-wrap:balance added to every H1 to prevent orphan/widow lines (lay the Wave-2 groundwork early).
- [x] **Mobile=desktop parity** — mobile sticky CTA bar carries the same two conversion paths the desktop floating CTA + nav carry (VAPI + Apply). Mobile retains the founder-quote card below the hero so the human face is on-screen even when the desktop right-column layout collapses.
- [x] **No clip-art energy** — every icon is custom inline SVG (audited via grep). No FontAwesome, no Bootstrap glyphs.
- [x] **No template-shaped sections** — hero structure is Jake-specific (diagonal wedge + iconic-line eyebrow + founder-quote glass card); the "Three steps" section uses a hand-tuned dark-mode gradient panel with `border-t-2 border-ap-accent`, not a generic SaaS pricing-card grid.
- [x] **Cold-read copy** — verified per 1.9. Specialist terms (VAPI™, Aligned Power Program) defined inline on first mention.

### Steve Jobs gut-test

**Mobile (privileged surface) — first pass flagged:**
- Home: orange diagonal accent wedge was overflowing viewport on mobile, causing the H1 "Build a business **tha**[t]" to visually clip against the orange field. Wedge also covered the secondary CTA pill copy.
- Inner pages (about, work-with-me, work-with-me/apply, contact, contact/thank-you, testimonials, client-stories): same wedge pattern using `w-[min(100%,520px)]` was eating the right edge of paragraph copy on 430px viewport.
- Sticky mobile CTA bar was rendering but the dev server hadn't compiled the new SiteCTAs component yet in the first capture pass → looked absent.
- H1 sizes (`text-4xl sm:text-5xl` and `text-5xl`) were too aggressive at 430px, forcing 4-line wrap with words spilling near the right edge.

**Mitigation:**
- Wedges on mobile: hidden via `hidden lg:block` and replaced with a subtle gradient wash that doesn't clip text. Desktop wedge unchanged.
- Global `overflow-x: clip` on `html, body` as a final guard against any future absolute child going rogue.
- H1 sizes reduced to `text-[2rem]`–`text-[2.25rem]` (32–36 px) on mobile across all pages with the explicit sm: breakpoint preserving the desktop 48 px treatment.
- Mobile CTA row `min-w-[220px]` removed below sm: so the two pills can shrink to fit 390px content width.
- Pre-warmed every route before re-capture so SiteCTAs hydrated and the sticky bar shows in screenshots.

**Re-test (mobile):** sticky CTA visible at bottom of every marketing page, italic accent words render in Cormorant orange, no visual overflow at the viewport edge that affects readability, founder photo + glass quote card visible at home hero mobile slot below the headline.

**Desktop / tablet:** clean. Hero diagonal wedge + glass founder-quote + flame-disc mark + italic *life* accent all hold together. About page italic *I'm* renders in orange Cormorant against the dark wordmark. Work-with-me italic *in* + "Your pace." gradient holds.

### Bonus prompts

- **"How could this be cooler?"** → Sticky mobile CTA could pulse once on first scroll past the hero, then settle into rest state — draws the eye without becoming noisy. Floating desktop CTA could include the flame-disc mark inline, reinforcing brand identity at the conversion point. Both deferred to Wave 3 (micro-interactions), where they belong.
- **"Category leader doing this better?"** → Per industry research (Litvin, Goldsmith), high-end coaches use a **single** dominant CTA above the fold (assessment / scorecard), with application gated one click deeper. Jake's home currently shows "Work with me." and "Take the VAPI™" at equal visual weight. The research recommends VAPI™ as the dominant ask so the application stays exclusive. Flagged for Wave 7 (conversion architecture) — appropriate layer for this change.
- **Applied this wave:** sticky-mobile-CTA already leads with VAPI™ (primary gradient pill) and demotes Apply to the secondary glass pill, matching Litvin's funnel architecture for the mobile surface. Hero re-balance deferred to Wave 7.

### Open items rolled forward

- (Wave 3) Universal focus rings (2px accent outline + 4px offset) across all `:focus-visible` selectors. Currently only `.floating-cta:focus-visible` has the treatment.
- (Wave 3) Sticky CTA pulse-on-first-scroll micro-interaction.
- (Wave 5) Contrarian disqualifier section on About or Work-With-Me ("This program isn't for everyone…").
- (Wave 7) Above-the-fold hero CTA re-balance: VAPI™ as single dominant; Work-with-me demoted to text link.
- (Wave 7) Trust-signal density audit near every CTA.
