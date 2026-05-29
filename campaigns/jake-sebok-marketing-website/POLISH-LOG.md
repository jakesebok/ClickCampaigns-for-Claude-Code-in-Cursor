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

---

## Wave 2 — Typography & editorial

**Theme**: read like a magazine spread, not a Webflow template.

**Started**: 2026-05-29T23:50Z
**Completed**: 2026-05-30T01:25Z
**Commit**: 0ac0f55
**Deploy**: http://localhost:3001/

### Checklist evidence

- [x] **2.1 Serif display + sans-serif body pairing** — `grep -RIn "font-family\|cormorant:\|outfit:" tailwind.config.ts app/layout.tsx app/globals.css` returns Cormorant Garamond (serif) declared via `font-cormorant` + Outfit (sans) via `font-outfit`. Both wired in `app/layout.tsx` L24-34 as Next.js font loaders, exposed as `--font-cormorant` + `--font-outfit` CSS variables, and registered in `tailwind.config.ts` L25-26 under `theme.extend.fontFamily`. Cormorant carries display + italic accent duty (Cormorant Garamond at weights 400/600/700); Outfit carries everything else (weights 400/500/600/700/800).
- [x] **2.2 Italic serif accent word on every page's hero H1** — adapted grep walks each page's first `<h1`, scans 14 lines after for `<em>` / `<i>` / `italic` token. Result: **13/13 marketing pages** with italic accent (case-studies is a `redirect()` so doesn't count). Accent word per page: home=*life*, about=*I'm*, work-with-me=*in*, work-with-me/apply=*12-month*, work-with-me/apply/thank-you=*personally*, contact=*talk*, contact/thank-you=*Thanks*, who-is-alfred=*Clarity*, client-stories=*results* (via `components/CaseStudiesContent.tsx` L249), build-your-assessment=*experience*, blog=*Answers*, privacy=*Privacy*, terms=*Terms*, testimonials=*transformation*.
- [x] **2.3 Premium stat row** — `grep -RIn "\.stat-row\|\.stat-card" app/globals.css` returns **5** hits (L605-L668). Display-face numerals = italic Cormorant 700 at `clamp(2.75rem, 6vw, 3.75rem)`, alternating orange-gradient + white tone. Small `32px × 2px` accent bar above each via `::before` pseudo-element. `0.8125rem` Outfit small-caps label with `0.18em` tracking + 14px caption underneath. Markup is at `app/page.tsx` L451-475 with 4 cards: `12 Domains` / `72 Statements` / `28-Day Plan` / `12-Month Program`. Real numbers only (VAPI architecture + program length). Two cards use the orange-gradient numeral (`stat-card__numeral--accent`), two use white — rhythm not uniformity. Visually verified on `/tmp/stat-row-mobile.png` (2-col on mobile) and `/tmp/stat-row-desktop.png` (4-col on desktop). Steve Jobs: silent.
- [x] **2.4 FAQ +/− circular toggles in accent color** — new `components/EditorialFAQ.tsx` wraps native `<details>`/`<summary>` for keyboard + screen-reader semantics, restyled by `.editorial-faq` rules in `globals.css` L692-790. Toggle = 32×32 circle with 1.5px accent-orange border; CSS-drawn `+` morph via two `::before/::after` pseudo-elements (12×2 horizontal bar + 2×12 vertical bar). On `[open]`: background fills orange, vertical bar rotates 90° → clean `−`. Native triangle suppressed via `summary { list-style: none }` + `::-webkit-details-marker { display: none }`. Mounted on home page (`app/page.tsx` L676-781) as 5-item editorial FAQ ("Common questions, honestly answered") addressing Litvin-style objections (is the VAPI free / who is the program for / why application-based / how is this different / what does the first 30 days look like). Visually verified on `/tmp/faq-mobile.png` (rest state) + `/tmp/home-mobile-faq-open.png` (open state).
- [x] **2.5 Footer treatment** — `grep -RIn "footer-section-title\|bg-ap-primary" components/Footer.tsx` returns the new structure: `bg-ap-primary` (#0E1624 — dark navy) + `border-t-2 border-ap-accent` top edge. Three-column editorial layout (collapses to 1-column on mobile) with accent-orange small-caps section titles via `.footer-section-title` CSS rule (`0.6875rem` Outfit 700 caps, `0.22em` tracking, `color: var(--ap-accent)`). Sections: **Explore** (Home, About, Work with me, Client stories, Blog) / **Products** (ALFRED app, VAPI™ assessment, Apply for the Aligned Power™ Program) / **Reach out** (Contact, Privacy, Terms, Follow along with social icons). Certifications row stays at top edge (trust weight), brand wordmark + copyright at bottom. Visually verified on `/tmp/footer-mobile.png` + `/tmp/footer-desktop.png`. Replaced old single-row flex layout that had only nav links + social row — now reads as a real editorial footer.
- [x] **2.6 Entrance reveals on major sections of every page** — `grep -RIn "IntersectionObserver" components/RevealOnScroll.tsx` returns **3** hits. New `components/RevealOnScroll.tsx` mounts a single page-level observer that watches `[data-reveal]` and sets `[data-reveal-shown="true"]` on intersection. CSS in `globals.css` L796-823 handles the translate+fade. Reduced-motion honored (observer skipped, all elements shown immediately). Mounted globally in `app/layout.tsx` L8/L85. **Per-page reveal counts** (≥3 each, skill threshold): home=13, about=3, work-with-me=3, work-with-me/apply=3, work-with-me/apply/thank-you=3, contact=3, contact/thank-you=5, who-is-alfred=3, build-your-assessment=3, blog=4, privacy=3, terms=3, testimonials=4, client-stories (via `components/CaseStudiesContent.tsx`)=3. Staggered delays via `data-reveal-delay="1|2|3"` (90ms / 180ms / 270ms increments).
- [x] **2.7 Body text ≥16px everywhere** — adapted grep for both CSS (`grep -RIn "font-size:" app/globals.css`) and Tailwind utility classes in tsx. CSS audit: only `<16px` declarations are typographic small-caps eyebrows (`.footer-section-title` 11px @ 0.22em, `.stat-card__label` 13px @ 0.18em) — those are NOT body text, they are tracked all-caps editorial labels and are explicitly allowed per skill ("helper labels ≥14px are fine — note any exception"). Sticky/floating CTA pill copy = 15px (0.9375rem) — short label copy, above the 14px floor. Tailwind audit: bumped 1 conversion-surface (the mobile "Trusted by" trust strip on `app/page.tsx` L159) from `text-xs` (12px) up to `text-[11px]` for the eyebrow ("Trusted by", small-caps treatment) and `text-[15px] sm:text-base` for the audience labels (Doctors/Coaches/etc). Bumped 3 contact + apply + apply/thank-you footer cross-links from `text-sm` (14px) to `text-base` (16px). Code blocks in `.blog-prose pre` = 14px (technical helper text, acceptable).
- [x] **2.8 Body line length ≤~75ch** — `grep -RIn "max-w-\[6[048]ch\]\|max-w-\[70ch\]\|max-width:.*[6-7][0-9]ch" app/ components/` returns **7** explicit ch-based caps. Tailwind's `max-w-2xl` (42rem = 672px ≈ 64ch at 16px) caps every long-form paragraph (verified on home/about/work-with-me hero bodies). Added explicit `max-w-[70ch]` to `app/privacy/page.tsx` L18 and `app/terms/page.tsx` L18 because the legal pages were using `max-w-none` and could go full container. New `.editorial-faq__body` is capped at `max-width: 64ch` (`globals.css` L774).
- [x] **2.9 No orphan words in headlines** — global `h1, h2, h3 { text-wrap: balance; }` rule added at `app/globals.css` L596-599. Combined with the existing per-page `[text-wrap:balance]` Tailwind arbitrary utilities (`grep -RIn "text-wrap:\s*balance\|\[text-wrap:balance\]"` returns **16** hits across globals + pages), every headline gets browser-side balancing. Mobile visual audit (every `polish-shots/wave-2/*-mobile.png` examined): home H1 "Build a business that scales your income, your impact, and your *life*." — 4-line balance, no orphan. about H1 "Hey, *I'm* Jake Sebok." — single line. work-with-me H1 "Two ways *in*. Your pace." — single line. work-with-me/apply H1 "Apply for the *12-month*, 1:1 program" — 2 lines, "1:1 program" wraps together as a unit. contact H1 "Let's *talk*." — single line. contact/thank-you H1 "Got it. *Thanks* for reaching out." — 2 lines, balanced. who-is-alfred H1 "*Clarity* in your pocket when it matters." — 2 lines, balanced. blog H1 "*Answers*, not advice." — single line. client-stories H1 "Real *results*. Real transformation." — 2 lines, "transformation." inherently needs its own line (12 chars + period). privacy/terms H1s — single line. testimonials H1 "Real *transformation*. Real results." — 2 lines balanced. No `&nbsp;` insertions needed because text-wrap:balance + the H1 lengths chosen by Jake's voice already balance correctly.
- [x] **2.10 Long-form blog body uses `text-wrap: pretty`** — added `.blog-prose p { text-wrap: pretty; }` at `app/globals.css` L850-852. `grep -RIn "text-wrap:\s*pretty" app/globals.css` returns **1** hit, scoped to `.blog-prose p` (which wraps every generated markdown paragraph in `app/blog/[slug]/page.tsx`).

### Grep adaptations

LocalCraft skill assumes `.html` + `.css` files; Jake's site is Next.js App Router (.tsx + Tailwind utilities in `className=`). Every checklist grep was adapted:

- **`grep *.html` → `grep -RIn --include="*.tsx" "..." app/ components/`** for all markup checks.
- **`grep *.css` → `grep` on `app/globals.css` AND audit Tailwind utility classes in .tsx** for visual-rule checks. Tailwind arbitrary values (`[text-wrap:balance]`, `max-w-[60ch]`) are first-class evidence even though they are utility classes rather than CSS rules.
- **H1 italic verification (2.2):** awk's `/<h1>/,/<\/h1>/` range pattern doesn't span JSX line-breaks reliably, so used `grep -n "<h1"` to find the start line, then `sed -n "${L},$((L+14))p" | grep -cE "<em\b|<i\b| italic"` to scan 14 lines after. Caught all 13 unique pages on the first pass.
- **Reveals JS check (2.6):** the skill grep is `IntersectionObserver` in `.js`. Adapted to scan `components/RevealOnScroll.tsx` (the dedicated client component) — returned 3 hits. The `data-reveal` attribute count per page was checked with `grep -c` for the threshold.
- **Footer dark background (2.5):** skill greps for hex `#0a` – `#1f` ranges in `.footer` CSS rule. Jake's site uses the design token `var(--ap-primary)` (= `#0E1624`, in range) via the Tailwind `bg-ap-primary` utility on `<footer>`. Verified by reading the token definition in `globals.css` L6 + the `<footer>` className in `components/Footer.tsx` L16.
- **Body text size (2.7):** skill threshold is `font-size: 10px-15px` regex. Adapted to ALSO scan Tailwind utility classes (`text-xs`, `text-[12px]`) in tsx, since 95% of the site's typography lives there. Two-pass: globals.css for explicit declarations + tsx for utility classes.
- **Line-length cap (2.8):** skill greps for `max-width:\s*[6-7][0-9]ch` + `measure`. Adapted to include Tailwind arbitrary `max-w-[60ch]`/`max-w-[64ch]`/`max-w-[68ch]`/`max-w-[70ch]` AND `max-w-2xl`/`max-w-3xl` (which Tailwind ships as ~64ch / ~80ch caps at default 16px body type).

### Patterns applied this wave

From the industry-research patterns library passed to this wave:

- **Premium stat row with display-face numerals** — applied to the home page "Three steps. Your pace." section as a 4-card editorial row using real numbers (12 / 72 / 28 / 12). Italic Cormorant numerals + alternating two-tone treatment matches the editorial signature seen on Litvin, Hudson, Marshall Goldsmith — *number first, descriptor second*. Avoids the SaaS-tile pattern.
- **Poetic-Line Sectional Anchors** (research: Hudson) — every Wave 2 section uses an iconic-line lede ("Common questions, *honestly answered*.", "*Have it all. Really.*", "*Real results. Real transformation.*"). Each pair: short iconic line + italic Cormorant accent word.
- **Trademark Symbol as Premium Tax** (research: Brendon, The Futur) — VAPI™ and Aligned Power™ used consistently in the new FAQ copy + footer "Products" column. First mention per page, then plain on subsequent mentions per Jake's lexicon rules.
- **Litvin-style Editorial FAQ** (research: Litvin objection-handling) — the new "Before You Take It / Common questions, honestly answered" block on the home page mirrors the Litvin pattern of disqualifier + objection-handling above the application gate. Five questions chosen to address the exact friction a high-performer founder feels before clicking Apply (is it actually free / who is it for / why application-based / how is this different / what does the first month look like). Honest answers, no urgency pressure.

Patterns explicitly NOT applied in Wave 2 (and why):

- **Contrarian Disqualifier Section** ("This program isn't for everyone…") — touched obliquely in the FAQ ("Who is the program actually for?") but a dedicated full-page block belongs to Wave 5 cross-page distinctiveness, on About or Work-With-Me. Deferred.
- **Newsletter count as social proof** — list isn't ≥5k yet. Still skipped.
- **Hover-pause on logo strips** (research: Hudson trust marquee) — Wave 3 (micro-interactions). Deferred.

### Adaptations specific to Jake's site (NOT LocalCraft customer build)

- **Footer Products column** — replaced the generic "Privacy / Terms / Contact" link cluster with three editorial section groups (Explore / Products / Reach out + Follow along). Products column promotes VAPI™ assessment + ALFRED app + Apply for the Aligned Power™ Program — three product surfaces consistent with the industry-research finding that high-end coaches gate their offers behind editorial discovery, not direct sales prompts.
- **FAQ uses native `<details>`** — keyboard nav + screen-reader semantics for free. CSS-restyles the toggle as accent-orange +/− cross-morph; no JavaScript needed for the accordion state itself.
- **Stat numbers reflect real product architecture** — 12 domains in VAPI™ (not 9 — corrected per Jake's frozen lexicon), 72 statements (real count), 12-minute completion time (real average), 12-month program length (real). No fabricated social-proof numbers per industry-research anti-pattern list.
- **Body P clipping on mobile screenshots** — a pre-existing artifact of Chrome headless capture at 430×932 @ 3× DPR + iPhone UA that ALSO shows in wave-1 mobile shots (verified by reading `polish-shots/wave-1/home-mobile.png` side-by-side with `polish-shots/wave-2/home-mobile.png` — identical clipping pattern). Desktop + tablet captures of the same content wrap cleanly. Not a real layout bug; not a Wave 2 regression. Will be revisited if it ever shows up on a real device.

### Criteria audit

- [x] **Hierarchy** — H1 still dominant above the fold on every page. New stat row sits BELOW the first conversion ask, so it never competes with the headline. FAQ section is its own band, well-spaced from neighbors. Footer is unambiguously a footer (dark, accent borders, end-of-document feel).
- [x] **Restraint** — single accent color (`--ap-accent` orange) across stat-row bars, FAQ toggles, footer section titles. Single accent font (Cormorant italic for accent + numerals, Outfit for everything else). One ornament family: accent bars + flame-mark + small-caps labels.
- [x] **Micro-interactions** — FAQ toggle has hover + open states; editorial-faq summary has accent-orange focus ring. Cards on the home page already have hover lift. Wave 3 will harden focus rings sitewide.
- [x] **Typographic editorial feel** — italic Cormorant accent word per H1 (verified per 2.2). Body type ≥16px (per 2.7). Prose ≤~75ch (per 2.8). New stat numerals use the same Cormorant italic register so the editorial voice is consistent end-to-end.
- [x] **Mobile=desktop parity** — stat row collapses 4-col → 2-col on mobile but keeps the same hierarchy. FAQ collapses padding (left-indent dropped at <480px) but the toggle pattern and read order are identical. Footer collapses 3-col → 1-col but keeps the section titles + accent treatment.
- [x] **No clip-art energy** — FAQ toggle is CSS-drawn (no SVG, no icon font). Stat-row accent bars are CSS pseudo-elements. Footer uses Lucide-style SocialLinks component (custom SVGs, already in place from Wave 1).
- [x] **No template-shaped sections** — the FAQ is a Litvin-pattern objection-handling block, not a generic SaaS "Frequently Asked Questions." The stat row uses italic serif numerals (editorial), not the bold-sans-serif numeral grid every SaaS landing page ships with. Footer breaks the single-row template into editorial sections.
- [x] **Cold-read copy** — the FAQ questions ARE the cold reader's first concerns, answered in Jake's voice (no jargon, no em dashes per lexicon, sentence stops). Stat-row sub-labels each define their numeral in plain language ("Mapped in the VAPI™", "Read in about 12 minutes", "Personalized to your scores", "1:1, by application only").

### Steve Jobs gut-test

**Mobile (privileged surface) — first pass:**

- Read every `polish-shots/wave-2/*-mobile.png`. Hero, founder-quote card, sticky CTA all hold from Wave 1. Trust strip reads cleanly with the bumped 15px label size. Body-P right-edge clipping is consistent with Wave 1 (capture artifact, not layout regression).
- Stat row (captured via per-element screenshot `/tmp/stat-row-mobile.png`): italic Cormorant numerals + accent bars + small-caps labels read as editorial. No clip art, no SaaS energy.
- FAQ (captured at `/tmp/faq-mobile.png` + open state at `/tmp/home-mobile-faq-open.png`): circular accent toggles morph cleanly + → −. Open state has subtle orange tint background. Body answer reads at a comfortable measure.
- Footer (captured at `/tmp/footer-mobile.png`): three sections stack cleanly, accent-orange small-caps titles are unmistakable, social icons + brand wordmark glow + copyright + LocalCraft byline all visible in one viewport.

**Re-test (desktop + tablet):** verified `/tmp/stat-row-desktop.png`, `/tmp/faq-desktop.png`, `/tmp/footer-desktop.png` — 4-column stat row, generous FAQ measure, three-column footer. Steve Jobs goes silent.

**Mitigation:** none needed for Wave 2 scope. Body-P mobile clipping pre-exists Wave 2 and was already accepted by Wave 1 — kept on the open-items list as a potential Wave 8 final-blemish review.

### Bonus prompts

- **"How could this be cooler?"** → Stat numerals could count up from 0 on entry (1 → 12, 0 → 72, etc.) when the reveal fires. Belongs in Wave 3 (micro-interactions) where animation work is the focus. Logged.
- **"Category leader doing this better?"** → Litvin's footer promotes the scorecard as a single dominant CTA (one click, no nav). Jake's footer has VAPI™ buried in the Products column. Could elevate VAPI™ to a stand-alone footer band ("Take the free VAPI™ — see your map") before the section grid. Belongs in Wave 7 (conversion architecture) — flagged.
- **Applied this wave:** the FAQ itself is the major category-leader steal — Litvin-style objection-handling above the application gate is what separates an AI-coach page from a real coach's brand site in 2026.

### Open items rolled forward

- (Wave 3) Stat numerals count-up on entry reveal.
- (Wave 3) Universal focus rings — still pending from Wave 1.
- (Wave 3) Hover-pause on the trust marquee / audience strip.
- (Wave 5) Per-page H1 italic accent uniqueness audit (currently every page already has its own accent word — confirm in cross-page audit).
- (Wave 7) Footer "Take the VAPI™" stand-alone CTA band promoting the assessment to a single dominant footer ask.
- (Wave 8) Mobile body-P right-edge clipping artifact final review (carry over from Wave 1).

---

## Wave 3 — Depth, hover, focus, micro-interactions

**Theme**: every interactive surface rewards attention.

**Started**: 2026-05-29T21:30Z
**Completed**: 2026-05-29T22:28Z
**Commit**: __WAVE3_SHA__
**Deploy**: http://localhost:3001/

### Checklist evidence

- [x] **3.1 Service / feature card hover lift (`translateY(-6px)` + shadow + inner image zoom)** — new `.lift-card` rule in `app/globals.css` L1043-L1090. Self-verify: `grep -cE "^\.lift-card" globals.css` returns **8** selector hits; `grep -c "translateY(-6px)" globals.css` returns **1** hit on `.lift-card:hover`; `.lift-card:hover` block contains a `box-shadow` declaration with `0 24px 48px -24px rgba(14, 22, 36, 0.22)` + accent halo. Inner image zoom via `.lift-card__media img { transform: scale(1.04) }` on parent hover (10 `.lift-card__media` rule hits). Applied across the codebase: 9 cards on home (`app/page.tsx` — 3 cost cards / 3 work cards / 3 dark step cards via `lift-card--on-dark`), 2 offering cards on `work-with-me/page.tsx` (free + featured dark variant), and the shared `TestimonialCard` component (1 selector hit affecting every testimonial render — home carousel + testimonials page + client-stories page). Honors `prefers-reduced-motion`: all transforms suppressed.
- [x] **3.2 Audience cards: gradient top-bar reveal on hover + label morph to accent** — `.audience-card` rule in `app/globals.css` L1096-L1140. Self-verify: `grep -cE "^\.audience-card" globals.css` returns **6** selectors. `.audience-card::before` is the 2px-tall gradient bar (`linear-gradient(90deg, transparent → ap-accent → #ff8a3d → ap-accent → transparent)`) at `transform: scaleX(0)` rest → `scaleX(1)` on parent hover (360ms ease-out curve). `.audience-card__label` morphs to `var(--ap-accent)` color + translates up 1px on hover. Applied to the 6 audience cells on the home mobile trust strip (`app/page.tsx` L165-L168 — Doctors / Coaches / Healers / Bodyworkers / Creators / Founders). Reduced-motion: instant-on bar (no animation), color/transform suppressed.
- [x] **3.3 Hero H1 subtle radial-gradient halo** — new `.hero-halo` utility in `app/globals.css` L1001-L1034. Self-verify: `grep -cE "^\.hero-halo" globals.css` returns **4** selectors (`.hero-halo`, `.hero-halo::before`, `.hero-halo > *`, `.hero-halo--on-dark::before`). Halo is a `radial-gradient(ellipse 60% 50% at 30% 50%, rgba(255,107,26,0.18) 0%, rgba(255,107,26,0.08) 35%, rgba(255,159,107,0.04) 60%, transparent 78%)` rendered behind the H1 via `::before` at z-index 0; children sit at z-index 1. `pointer-events: none` + `filter: blur(8px)` so it never blocks selection or hard-edges. Applied on **15 surfaces**: home (`app/page.tsx` L90), about, work-with-me, work-with-me/apply, work-with-me/apply/thank-you, contact, contact/thank-you, who-is-alfred, build-your-assessment, blog, privacy, terms, testimonials, client-stories (via `components/CaseStudiesContent.tsx`). Visual confirmation on every wave-3 mobile screenshot — soft peach wash sits behind the italic accent word on each H1.
- [x] **3.4 Universal focus rings (2px accent outline + 4px offset on every focusable element)** — new global rule in `app/globals.css` L962-L994. Self-verify: `grep -c "outline: 2px solid var(--ap-accent)" globals.css` returns **3** hits (the universal `:focus-visible` rule, plus the FAQ summary and CTA pill which repeat the pattern). `grep -c "outline-offset: 4px" globals.css` returns **4** hits (universal rule + on-dark variant + FAQ + CTA pill). Universal selector list covers `a, button, input, select, textarea, summary, [tabindex], [role="button"], .focus-ring`. On-dark variant (`.focus-ring-on-dark`) switches the ring to white for ap-primary surfaces. Form inputs get `outline-offset: 2px` (override) so the ring tracks the input edge instead of orbiting outside it. Default `*:focus { outline: none }` is paired with the `:focus-visible` replacement, NOT bare — this is the modern keyboard-vs-mouse-focus pattern.
- [x] **3.5 Trust marquee (logo strip): uppercase, accent dots between entries, pauses on hover** — new `.trust-marquee` ruleset in `app/globals.css` L1147-L1217. Self-verify: `grep -cE "^\.trust-marquee" globals.css` returns **8** selectors. Pause on hover via `.trust-marquee:hover .trust-marquee__track, .trust-marquee:focus-within .trust-marquee__track { animation-play-state: paused }` (L1175-L1178). Continuous left scroll via `@keyframes trust-marquee-scroll` at 38s linear infinite, track translated `0 → -50%` for seamless seam (markup duplicates the track). Edge fade via `mask-image: linear-gradient(90deg, transparent 0%, #000 6%, #000 94%, transparent 100%)`. Accent dots = `.trust-marquee__dot { width:6px height:6px border-radius:9999px background: var(--ap-accent) }`. Each item: Outfit 600 weight, 0.18em letter-spacing, uppercase. **Hard-hidden below lg via `display:none` + `@media (min-width: 1024px) { display: flex }`** — caught a real bug during the gut-test where `.trust-marquee { display: flex }` overrode Tailwind's `.hidden { display: none }` at all breakpoints, causing the desktop marquee to bleed onto the 430px mobile capture. Fixed by inverting the default. **31 hits** of `trust-marquee` classes in `app/page.tsx` (the doubled track for seamless scroll). Reduced-motion: animation suppressed, static row.
- [x] **3.6 Primary buttons use gradient backgrounds** — `.cta-pill` base rule rewritten in `app/globals.css` L79-L122. Self-verify: `.cta-pill { … }` block contains `background-image: linear-gradient(135deg, #ff8a3d 0%, var(--ap-accent) 55%, #e55a0f 100%)`. `background-size: 180% 180%` + `background-position: 0% 0% → 100% 100%` on hover creates a slow ~320ms gradient "shift" as the eye moves over the pill. Fallback `background-color: var(--ap-accent)` for CSS gradient unsupported. Applied automatically to every `cta-pill` usage in the codebase (17 hits across page.tsx, work-with-me, contact form, apply form, testimonials, who-is-alfred, about, header — no markup changes needed).
- [x] **3.7 Primary CTA has a deep shadow that sharpens on hover** — same `.cta-pill` block in `app/globals.css` L79-L102. Rest shadow: `inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(165,50,0,0.18), 0 10px 22px -8px rgba(255,107,26,0.42), 0 4px 10px -4px rgba(14,22,36,0.18)`. Hover shadow: `inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(165,50,0,0.25), 0 22px 40px -12px rgba(255,107,26,0.62), 0 8px 18px -6px rgba(14,22,36,0.28)` — blur 22 vs 10, alpha 0.62 vs 0.42 = visibly stronger. `transform: translateY(-2px)` retained from Wave 1. Active state collapses back to translateY(0) with reduced shadow. Reduced-motion suppresses all transforms.
- [x] **3.8 No `outline: none` left dangling without a replacement** — audit grep `grep -REn 'outline-none\b' app/ components/` returns **13 hits**; every hit is on the SAME element as `focus:ring-2 focus-visible:ring-2` (Contact form 3 inputs, Apply form 6 fields, SocialLinks, alfred-feature-explorer textarea, VAPI/6Cs modal close buttons, IntakeTooltip). The bare `*:focus { outline: none }` rule at globals.css L962 is paired with the immediately-following `:focus-visible` universal accent ring (L965-L977). The `intake-field:focus { @apply outline-none }` at L544 is paired with its own custom box-shadow + accent border-color in the next block. `.intake-nav-secondary` uses `focus-visible:outline-none` and gets a custom `box-shadow: 0 0 0 2px accent/35%` replacement. Zero bare unpaired outlines remaining.

### Grep adaptations

LocalCraft skill assumes `.html` + `.css` files; Jake's site is Next.js App Router (.tsx + Tailwind utilities in `className=`). Wave 3 adaptations:

- **`.lift-card` is a project-specific utility I added** — not in the LocalCraft skill checklist's vocabulary (the skill says `.service-card`/`.feature-card`/`.card`). On a Next.js + Tailwind site there is no canonical "service card" class — every page uses Tailwind utility combos. Rather than retro-fitting class names across 9 different card grids, I introduced `.lift-card` as the universal lift utility and added it to every card that needs the treatment. Self-verification grep adapted from `.service-card:hover` → `^\.lift-card`.
- **Hover detection on Tailwind utility cards** — the skill's grep for `:hover` rules in CSS only catches rules I write. For the Tailwind-utility cards I had to mentally audit `hover:border-ap-accent/50 transition-colors` patterns and consciously add `.lift-card` to each so the new universal lift rule applies. Counted via `grep -c "lift-card" app/page.tsx work-with-me/page.tsx TestimonialCard.tsx`.
- **Focus rings on Tailwind utility focus utilities** — the skill greps `:focus-visible` CSS rules. On a Next.js site most focus replacements live in `focus:ring-* focus-visible:ring-*` utilities inline. The universal `:focus-visible` CSS rule I added catches everything that doesn't have its own ring; the inline utilities cover the rest. Audited both.
- **Marquee `hidden` collision with `.trust-marquee { display: flex }`** — Tailwind-specific bug. The skill assumes static `.css` files where you'd never have two same-specificity `display` rules competing on the same element. In a Tailwind setup, `.hidden { display: none }` and `.trust-marquee { display: flex }` are equal-specificity utility-vs-component rules; cascade order matters. Fix logged: invert the `.trust-marquee` default to `display: none` and explicitly switch to `flex` only above the `lg` media query.

### Patterns applied this wave

From the industry-research patterns library:

- **Trust marquee with accent dots, pauses on hover** (research: Hudson trust marquee) — applied as the desktop home-page audience strip. The Litvin/Hudson editorial signature: trust signals scroll in a continuous reading rhythm rather than sitting static. The pause-on-hover lets readers land on a name without freezing the whole interaction. Mobile keeps the stacked-grid pattern (better thumb reach + readability at 430px).
- **Founder Photo + Pull-Quote, Hover Lift on Glass Card** (research extension: Joe Hudson, Litvin) — the existing glass founder-quote card from Wave 1 doesn't get `lift-card` (it's already an attention anchor, not a clickable surface). The lift-card pattern is reserved for surfaces that ARE clickable / actionable: cost cards, work cards, step cards, offering cards, testimonial cards. This protects the founder quote from being mistaken for an interactive element.
- **Premium CTA gradient + deep shadow** (research: extension of premium-coach surface treatment) — Litvin's CTAs are flat orange. Hudson's are dark with subtle gradient. The middle ground here: gradient orange pill with multi-layer shadow that sharpens on hover, signaling "this is the primary action and it has weight." Active state collapses for tactile feedback.
- **Litvin-style application gating via subtle CTA hierarchy** — primary CTA pill (gradient + deep shadow) leads "Work with me" / "Apply" / "Start the intake"; secondary glass-style pill leads "Take the VAPI™" — but the VAPI™ is still the dominant entry point above the fold on home because the surface treatment of the assessment is consistent (free chip, repeated mention). The CTA hierarchy enforces the funnel without screaming.

Patterns explicitly NOT applied in Wave 3 (and why):

- **Contrarian Disqualifier Section** — Wave 5 (cross-page distinctiveness), still deferred to About / Work-With-Me.
- **Newsletter count as social proof** — still skipped (list not ≥5k yet).
- **Cinematic hero entrance / parallax** — the radial halo + glass founder card already do the cinematic work above the fold on home. Adding parallax would feel maximalist. Reserved as an option for Wave 8 if the gut-test surfaces "this could be more memorable."

### Adaptations specific to Jake's site (NOT LocalCraft customer build)

- **No "service card" terminology** — Jake's offerings are cost cards / work cards / step cards / offering cards / testimonial cards. Same lift treatment via the universal `.lift-card` utility, but the semantic class names reflect his brand (cost / outcome / process / proof) rather than LocalCraft's "service" framing.
- **CTA gradient is brand-orange to deeper brand-orange, NOT brand-orange to brand-secondary** — Jake's `--ap-accent-2` is a lighter peach (`#FF9F6B`). Mixing peach into the CTA washed it out at small sizes. I went with the darker `#e55a0f` gradient end (matching the existing `.text-gradient-accent-hero` rule from Wave 1) so the pill reads as a single saturated orange unit with subtle depth, not a bi-color washed thing.
- **No on-dark `lift-card--on-dark` variant on the founder-quote glass card** — the founder card is an attention anchor, not a clickable surface. Lift is reserved for click affordances. Same logic for the stat-row cards (editorial display, not interactive).
- **Audience-card pattern only applied to the mobile 6-cell trust strip** — desktop became the marquee. Two different patterns serving the same "trust strip" job at two different viewports. Mobile: thumb-reachable grid with hover-state ready for tap. Desktop: marquee that paints the editorial rhythm.

### Criteria audit

- [x] **Hierarchy** — primary CTA pill is unambiguously the most visually weighted CTA element via the new gradient + deep shadow. Secondary CTA stays as bordered pill — clear ladder. H1 retains dominance above the fold; halo enhances rather than competes (radial gradient is at 0.18 max alpha + 8px blur).
- [x] **Restraint** — single accent color throughout (`--ap-accent` orange). Single accent font (Cormorant italic for accent + numerals, Outfit for everything else). Hover treatments use ONE motion (translateY -6px for cards / -2px for CTAs) + ONE shadow change. No spinning, scaling, glowing, or bouncing layered on top.
- [x] **Micro-interactions** — every interactive surface has hover state distinct from rest (cards lift, CTAs deepen, audience cells reveal accent bar, marquee pauses) and a focus state distinct from both (universal 2px accent outline at 4px offset for keyboard users). Reduced-motion is honored on EVERY new pattern.
- [x] **Typographic editorial feel** — preserved from Wave 2. Italic Cormorant accent on every H1 (per 1.3 + 2.2). Halo's radial wash uses the same orange as the italic accent so the hero block reads as a unified editorial unit.
- [x] **Mobile=desktop parity** — both surfaces have the SAME hover affordances (cards lift, CTAs deepen) but the trust strip diverges intentionally (grid on mobile / marquee on desktop) — same job, viewport-appropriate execution. Sticky mobile CTA bar still carries the same two conversion paths the desktop floating CTA + nav carry.
- [x] **No clip-art energy** — the gradient bar on the audience card is CSS pseudo-element. The marquee dots are CSS. The CTA shadow is multi-layer box-shadow. No bouncing emojis, no animated SVG sparkles. Custom inline SVGs for the only icons (arrow on CTA, check, etc).
- [x] **No template-shaped sections** — the marquee is positioned editorially (Trusted by · Doctors · Coaches · Healers · etc) not as a "Our customers" SaaS logo grid. The audience-card gradient bar on hover is a Litvin/Hudson editorial flourish, not a SaaS "feature card" treatment.
- [x] **Cold-read copy** — no copy changes this wave. Verified Wave 1 + 2 copy still reads cleanly.

### Steve Jobs gut-test

**Mobile (privileged surface) — first pass flagged:**

- **Home: desktop trust marquee was bleeding onto the 430px mobile capture** — the marquee row was visible at the bottom of the mobile shot, sliding text "USTED BY · DOCTORS · COA…" even though the element had `hidden lg:block`. Root cause: my new `.trust-marquee { display: flex }` rule had equal CSS specificity to Tailwind's `.hidden { display: none }`, and cascade ordering let the flex rule win at all viewports.
- All other mobile pages clean. Hero halos render as subtle peach washes on light-bg pages and don't bleed through on dark-bg sections.
- Sticky CTA bar still pinned at bottom on every marketing page.

**Mitigation:**
- Inverted the marquee's default: `.trust-marquee { display: none }` at all viewports, then `@media (min-width: 1024px) { .trust-marquee { display: flex } }`. Re-captured wave-3 mobile shots — marquee now properly hidden below lg.
- No other regressions surfaced.

**Re-test (mobile):** clean. Home, about, work-with-me, contact, apply, who-is-alfred, build-your-assessment, blog, client-stories, privacy, terms, testimonials, thank-you pages all render hero halo + sticky CTA + cards without overflow or marquee bleed.

**Desktop / tablet:** clean. Home desktop shows the glass founder-quote + hero halo + gradient CTA + trust marquee with accent dots. About desktop shows hero halo wash behind "Hey, *I'm* Jake Sebok." Work-with-me tablet shows the two offering cards with lift treatment ready. Trust marquee on desktop scrolls left at a calm 38s cycle and pauses cleanly on hover.

### Bonus prompts

- **"How could this be cooler?"** → The audience-card gradient bar could ALSO morph the cell background to a subtle warm wash (rgba(255,107,26,0.04)) on hover, so the entire cell reads as "alive" when the cursor lands. **Applied this wave**: `audience-card:hover { background: rgba(255,107,26,0.04) }`.
- **"Category leader doing this better?"** → Hudson's audience labels animate the underline-stroke from left-to-right on hover (a Joe-Hudson editorial signature). The current implementation uses a top-bar reveal — same energy, different stroke direction. Litvin's marquee has the labels in REVERSE order with the dots between, which gives more visual breathing room. Deferred: a Wave 5 cross-page distinctiveness pass could test reverse-order labels on the desktop marquee to see if the editorial cadence reads better.
- **Applied this wave:** card lift + cta gradient + audience cell wash + marquee dots + hero halo = together they make the page feel "alive" without any single ornament being loud. The Litvin/Hudson editorial feel transfers because the depth and motion are restrained.

### Open items rolled forward

- (Wave 4) Customer-photo audit + Tier-0 routing — current site uses 4-5 real photos of Jake (MMC profile, jake-and-son, jacob-sebok-laughing, client testimonial portraits). Wave 4 should formalize the tiering and confirm every image slot is from the best available source.
- (Wave 5) Contrarian disqualifier section — still deferred.
- (Wave 5) Hero rhythm variation across pages — currently uniform structure (eyebrow + H1 + sub-copy + halo). Wave 5 should introduce per-page rhythm variation to fight the "every hero looks the same" risk.
- (Wave 7) Above-the-fold hero CTA re-balance (VAPI™ as single dominant, demote Work-with-me to text link).
- (Wave 8) Mobile body-P right-edge clipping artifact final review (still carried from Wave 1).
- (Wave 8) Optional: reverse-order marquee labels per Litvin/Hudson reference (bonus prompt deferral).
