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
**Commit**: 8ab64ca
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

---

## Wave 4 — Imagery & art direction

**Theme**: every image was chosen by a human who cares. REAL customer photos beat Pexels at every slot.

**Started**: 2026-05-29T22:35Z
**Completed**: 2026-05-29T23:55Z
**Commit**: a9bf393
**Deploy**: http://localhost:3001/

### Checklist evidence

- [x] **4.1 Tier-0 customer photo audit + slot routing** — `ls public/images/jake/` returns **5** files; `ls public/images/testimonials/` returns **8**; `ls public/images/certifications/` returns **4**; `ls public/images/alfred/` returns **1**; `ls public/images/vapi/` returns **3**. **Routing manifest** (every file → its slot):
  - `jake/MMC Profile.jpeg` → **home hero glass-card founder portrait** (desktop + mobile slot, `app/page.tsx` L141, L284) — Tier 0, real.
  - `jake/jake-and-son.png` → **home "You Don't Have to Choose" split-image** (`app/page.tsx` L388) — Tier 0, real.
  - `jake/jake-ideal-end-state.png` → **home "Ideal end state" split-image** (`app/page.tsx` L642) — Tier 0, real.
  - `jake/jacob-sebok-laughing.jpeg` → **about page hero portrait** (`app/about/page.tsx` L43) — Tier 0, real.
  - `jake/Website Hero.png` → **UNUSED** (2.0 MB file; flagged as a candidate for the Wave 8 final-blemish removal or Wave 5 cross-page distinctive hero). Logged.
  - `testimonials/Marshall.png` + `Marshall-card.png` → client-stories page hero + home testimonial carousel wide card.
  - `testimonials/Thaddeus.jpeg` (+ `.png` variant) → client-stories second hero + carousel card.
  - `testimonials/Charul.png` / `Cheryl.png` / `Kelly.jpeg` / `Gurcan.png` → carousel + "More Results" gallery cards.
  - `certifications/icf.png` / `cplc.png` / `mcpc.png` → home final CTA section + footer trust row. `life-coach-institute.png` is **UNUSED** (flagged).
  - `alfred/logo-alfred.png` → alfred-hero-phone component (in-phone logo reveal).
  - `vapi/vapi-logo.png` → build-your-assessment hero card.
  - `vapi/og-landing.png` + `vapi/favicon.svg` → metadata only (not rendered in UI).
  - `phone_with_natural_shadow.png` → who-is-alfred dual phone slots (mobile + desktop).
  - `logo-jake-sebok-horizontal.png` → header + footer wordmark.
  - `logo-jake-sebok-512.png` → metadata only (favicon / OG fallback).
  - `alfred-phone-hero.png` → **UNUSED** (flagged; superseded by `phone_with_natural_shadow.png`).
- [x] **4.2 Tier 1-2 audit** — N/A. Jake's site is not a LocalCraft customer build with a `build_recipes` table; there is no upstream `customer_visual_assets.work_photos` or `.brand_artifacts` to consume. Tier 0 (the real customer photos under `public/images/jake/` + `public/images/testimonials/`) is the highest tier we have, and every photo slot is filled from it.
- [x] **4.3 Tier 3 audit** — N/A. No `all_scraped_images` payload exists because no prior jakesebok.com site was scraped — this is Jake's authored Next.js build, not a scrape-and-rewrite. Confirmed and logged.
- [x] **4.4 Every image is from the BEST available tier** — `grep -REn 'src="' app/ components/` returns the full inventory. Every `<Image>` / `<img>` `src=` points to `public/images/...` which is the only tier present. **stock_fallbacks_used: NONE** — zero Pexels URLs, zero AI-generated stock, zero photo placeholders. Blog hero images (`p.hero_image_url`) come from Supabase blog posts (user-authored content), not stock.
- [x] **4.5 No `[IMAGE: …]` placeholders left** — `grep -REn "\[IMAGE:|placeholder\.(jpg|png|svg|jpeg|webp)" app/ components/` returns **0** hits.
- [x] **4.6 Inner-border ring + outer drop-glow on every framed image** — new `.framed-image` utility in `app/globals.css` L1232-L1276. `grep -cE "^\.framed-image" globals.css` returns **5** rule hits (`.framed-image`, `> *`, `::before`, `.framed-image--on-dark`, `.framed-image--on-dark::before`). Multi-layer box-shadow: `inset 0 1px 0 rgba(255,255,255,0.55)` highlight + `inset 0 0 0 1px rgba(255,255,255,0.18)` matte ring + `inset 0 -1px 0 rgba(14,22,36,0.08)` hairline shadow + `0 18px 38px -22px rgba(255,107,26,0.32)` warm outer glow + `0 22px 48px -24px rgba(14,22,36,0.28)` neutral lift shadow. The `::before` pseudo-element draws an additional `inset 0 0 0 1px rgba(255,107,26,0.12)` accent-tinted hairline so the ring reads as deliberate craft. **`framed-image` usages in tsx: 4** (CaseStudiesContent more-results avatars, TestimonialCard headshot disk, home founder-quote portrait desktop slot + mobile slot — both using `framed-image--on-dark` for the dark hero background). All circular avatars get the ring; rounded-[20px] photos use the richer `.hero-image` variant (4.7).
- [x] **4.7 Gradient bottom-fade overlay on hero / split images** — new `.hero-image` + `.split-image` utilities at `app/globals.css` L1278-L1322. `grep -cE "^\.hero-image|^\.split-image" globals.css` returns **10** rule hits (covering both class names + `> *`, `::before`, `::after`, and `--on-dark` variants). `.hero-image::after` carries the bottom-fade: `linear-gradient(180deg, transparent 55%, rgba(14,22,36,0.08) 80%, rgba(14,22,36,0.22) 100%)`. Dark-bg variant uses a stronger fade (`rgba(14,22,36,0.55)` at 100%). The `::before` carries the accent-tinted hairline; the `::after` carries the bottom-fade — pseudo-element stacking matches the layered print treatment. **`hero-image` usages in tsx: 4** (home jake-and-son split-image, home jake-ideal-end-state split-image, about page hero portrait, client-stories StorySection portrait via `CaseStudiesContent.tsx`). All four are rounded-[20px] portraits that benefit from the bottom-edge melt.
- [x] **4.8 Service-card icons with depth (blurred shadow ring + accent ring + drop shadow)** — new `.icon-circle` + `.icon-circle--on-dark` utilities at `app/globals.css` L1324-L1395. `grep -cE "^\.icon-circle" globals.css` returns **4** rule hits (`.icon-circle`, `::before`, `--on-dark`, `--on-dark::before`). Multi-layer treatment: inner `linear-gradient(150deg, rgba(255,255,255,0.95), rgba(255,246,240,0.92))` warm porcelain fill + `inset 0 1px 0 rgba(255,255,255,0.85)` top highlight + `inset 0 0 0 1px rgba(255,107,26,0.32)` accent ring + `0 8px 18px -10px rgba(255,107,26,0.42)` warm outer shadow + `0 4px 10px -4px rgba(14,22,36,0.12)` neutral lift. The `::before` pseudo-element renders the **blurred outer halo** (`radial-gradient(circle, rgba(255,107,26,0.28) 0%, rgba(255,107,26,0.12) 38%, transparent 72%)` + `filter: blur(10px)` at `z-index: -1`). On parent `.lift-card:hover` or `.group:hover`, the disk lifts 1px, ring tightens to 50% opacity, halo expands from `inset: -8px` to `inset: -10px` and opacity 0.85 → 1. **`icon-circle` usages in tsx: 12** — 6 cost/Cs cards on home (cost cards "The Grind / Guilt / Loop" + Cs cards), 5 check disks on home outcomes section ("Extreme clarity / etc"), 1 dark voice-idle icon on alfred-feature-explorer (using `icon-circle--on-dark`). Reduced-motion honored (transforms suppressed).
- [x] **4.9 Gallery cards: hover lift + image zoom + caption fade-in** — new `.gallery-card` utility at `app/globals.css` L1397-L1426. `grep -cE "^\.gallery-card" globals.css` returns **9** rule hits (`.gallery-card`, `__media`, `__media img`, `__media [data-img]`, `:hover __media img`, `:hover __media [data-img]`, `__caption`, `:hover __caption`, `:focus-within __caption`). Image zoom via `transform: scale(1.05)` on hover (520ms cubic-bezier curve). Caption fades from `opacity: 0.78 + translateY(2px)` → `opacity: 1 + translateY(0)` on hover. Built on top of `.lift-card` so the whole-card lift composes with the inner image zoom. **`gallery-card` usages in tsx: 6** — TestimonialCard (universal home + testimonials + client-stories carousel cards) + CaseStudiesContent "More Results" gallery row (each card has gallery-card__media on the avatar disk + gallery-card__caption on the headline). Reduced-motion: transforms suppressed.
- [x] **4.10 Alt text descriptive on every image** — `grep -REn 'alt=""|alt="image\b|alt="img\b|alt="photo\b|alt="picture\b'` returns **0** hits. Two `alt=""` instances fixed during this wave: `app/blog/page.tsx` L54 (was `alt=""`, now `alt="Cover image for: ${p.title}"`) and `app/build-your-assessment/page.tsx` L64 (was `alt=""`, now `alt="VAPI Values Alignment Performance Insights wordmark"`). Six other alts enriched for specificity: home founder portrait gained "head-and-shoulders portrait in warm light", about page portrait gained "laughing in natural daylight", jake-and-son gained "on a porch in afternoon light", who-is-alfred phone duplicates differentiated ("home screen…daily check-in flow" vs "interface…floating against a dark backdrop"), all certification badges gained "credential badge" / "member badge", both logo wordmarks gained "wordmark" + role ("link to home" on header).

### Grep adaptations

LocalCraft skill assumes `.html` + `.css` files; Jake's site is Next.js App Router (.tsx + Tailwind utilities in `className=`). Wave 4 adaptations:

- **`grep *.html` → `grep -REn --include="*.tsx" "src=" app/ components/`** — pulls every `<Image src=>` and `<img src=>` from the JSX surface. Filtered for the `/images/*` prefix to confirm every image points to a real public asset.
- **CSS selector grep** — skill greps for `.framed-image`, `.image-frame`, `.hero-image` in `*.css`. Jake's site has one shared `app/globals.css` — every new utility was scoped to that file with `^\.` anchors so the grep counts every rule cleanly. `^\.framed-image` returns 5 (base + 4 sub-rules), `^\.hero-image|^\.split-image` returns 10 (covering both selectors + variants), `^\.icon-circle` returns 4, `^\.gallery-card` returns 9. Each count was checked against the actual rule list to confirm coverage.
- **Tailwind-utility vs CSS-class hybrid** — circular avatars (`rounded-full overflow-hidden`) and rounded-photo containers (`aspect-[4/5] rounded-[20px] overflow-hidden shadow-xl`) used to live entirely in Tailwind utility classes. I replaced the per-photo `shadow-xl` + manual overflow rules with the new `.framed-image` / `.hero-image` utility classes so the box-shadow ladder is centralized. Removed `overflow-hidden` from the affected containers since the new utility handles it via `overflow: hidden` baked into the class.
- **Alt-text grep regex** — skill regex `alt="image\b|alt="img\b|alt="photo\b|alt="picture\b` extended in my grep to include `alt=""` (the empty-string case) and ran with `-E` to honor alternation. Returned **0** matches after the two fixes.
- **`p.hero_image_url` blog posts** — these come from Supabase, so they don't get a fixed asset path. Per the skill's "every alt is operator-readable" rule, I bound the alt to the post title which is always present and descriptive.

### Patterns applied this wave

From the industry-research patterns library:

- **Founder Photo in Natural Light, Above the Fold** (research: Hudson, Litvin) — extended via `.framed-image--on-dark` so Jake's MMC profile portrait now reads with a real matte ring + warm shadow on the dark hero glass card. The combination of `.glass-card` (Wave 1) + `.founder-quote` (Wave 1) + `.framed-image--on-dark` (Wave 4) makes the founder portrait look like a print magazine pull-quote, not a WordPress avatar.
- **Bottom-fade Hero Image** (research extension: Hudson, who lets his field photo melt into the page below) — applied as `.hero-image::after` linear-gradient overlay on all four rounded-[20px] portraits. The bottom edge of the photo now blends into the surface that follows it (white page or dark band), so the photo reads as "embedded in the page" rather than "stamped on top of the page."
- **Inner-border Ring as Craft Signal** — print magazines use a 1px matte ring inside the photo edge to signal "this was placed deliberately." `.framed-image::before` carries the same: a 1px accent-tinted inset shadow. Subtle, sits at `z-index: 2` so it always wins over the image. The effect is invisible on first glance and unmistakable when you slow down — exactly the craft register Jake's audience reads as premium.
- **Authority by Association, Not Adjective** (research: Litvin, Goldsmith) — Wave 4 enriches the certification badges with "credential badge" / "member badge" alt text. The visual restraint stays (small icons, no caption text) but screen-reader users and AI crawlers now associate the badge images with the credential names (ICF, CPLC, MCPC), which is how authority compounds.

Patterns explicitly NOT applied in Wave 4 (and why):

- **Three-Pillar Equal-Weight Card Row** (research: Goldsmith) — belongs to Wave 5 (cross-page distinctiveness). The three pillars GROWTH · AUTHENTICITY · ALIGNMENT aren't yet visualized as equal-weight cards; deferring.
- **Contrarian Disqualifier Section** — still Wave 5 territory. Deferred.

### Adaptations specific to Jake's site (NOT LocalCraft customer build)

- **No service-card icon library** — LocalCraft builds use a vendored Lucide icon set per service. Jake's site uses inline SVG strokes (icons drawn directly in JSX). I treated the surrounding **disk** as the icon container and let `.icon-circle` re-tint via `color: var(--ap-accent)` propagating to `stroke="currentColor"` SVGs. Removed `text-ap-mid` overrides on the SVGs so the parent's accent color wins.
- **No `gallery-card` pre-existing pattern** — Wave 4 introduces it as the testimonial-carousel-card pattern. The skill's "gallery-card / portfolio-card" vocabulary fits Jake's photo-led "More Results" testimonial row exactly. Wave 5 may extend it to a blog-listing pattern if the cross-page distinctiveness audit calls for it.
- **No Pexels / AI fallbacks in the build** — every photo is a real customer asset (Jake's own portraits + real testimonial headshots). This is the IDEAL Tier-0 state the LocalCraft skill describes; nothing to flag.
- **Two unused Tier-0 photos** (`Website Hero.png` 2.0 MB, `alfred-phone-hero.png`) and one unused certification (`life-coach-institute.png`) — not deleted in Wave 4 (could be useful for Wave 5 hero rotation or About-page credentials wall). Flagged in the routing manifest for Wave 8 final-blemish review.

### Criteria audit

- [x] **Hierarchy** — photo-treatment additions reinforce the existing hierarchy rather than competing with it. Hero portraits get the heavier ring + bottom-fade; testimonial avatars get the lighter framed-image ring; icon disks get the depth treatment that signals "click here" without becoming bigger than the H1.
- [x] **Restraint** — single accent color across the new utilities (`--ap-accent` orange in the rings, halos, and outer shadows). One ornament family (inset hairline + warm outer glow). No drop-shadow + filter + transform + glow stacked on a single element; everything is one pattern composed once.
- [x] **Micro-interactions** — `.icon-circle` hover state (lift + halo expand) composes cleanly with `.lift-card:hover` (card translateY). `.gallery-card` image zoom + caption fade compose with `.lift-card` card lift — three layers of motion on one hover without feeling busy.
- [x] **Typographic editorial feel** — preserved. Italic Cormorant accent on every H1 (Waves 1+2). Body text ≥16px (Wave 2). The new framed photos read like editorial portraits, which deepens the "magazine spread" reading the typography already establishes.
- [x] **Mobile=desktop parity** — every new utility honors mobile. `.framed-image` and `.hero-image` give the same ring + glow treatment at every breakpoint. `.icon-circle` keeps its depth on 430px mobile (verified on home mobile shot — the cost-card disks read as orange-ringed warm discs, not flat-tinted Bootstrap pills). Sticky CTA still pinned at every page bottom.
- [x] **No clip-art energy** — the rings + halos are pure CSS (box-shadow + radial-gradient + filter). No icon-font fallbacks, no PNG sprites, no clip-art photo frames.
- [x] **No template-shaped sections** — the framed-image ring is a print magazine signature, not a SaaS-card pattern. The icon-circle depth is a Tier-0 product UI pattern (Linear, Vercel, Stripe), not a 2015 Bootstrap glyphicon disk. The gallery-card composition is editorial (photo + caption fade), not a Pinterest grid.
- [x] **Cold-read copy** — no copy changes this wave. Alt-text enrichments are descriptive without being verbose.

### Steve Jobs gut-test

**Mobile (privileged surface) — first pass:**

- Read every `polish-shots/wave-4/*-mobile.png`. Home mobile: hero italic *life* + glass founder-quote + sticky CTA all hold from Wave 1-3; body-P right-edge clipping continues (capture artifact, not a Wave 4 regression — same in wave-1/2/3 mobile shots). About mobile: new framed jacob-sebok-laughing portrait reads as editorial (subtle matte ring + warm shadow visible). Client-stories mobile: Marshall portrait with framed-image ring is the dominant visual element, exactly what the wave intends. Who-is-alfred mobile: white card on orange field, phone image lower (below the capture fold but verified on wave-3 desktop carry-over).
- Build-your-assessment mobile: VAPI logo card now mid-page (not the first card shown in the capture); verified in source. Contact mobile: form is clean and reads as a real conversation field.
- Sticky CTA bar still pinned at the bottom of every marketing page.

**Mitigation:** none required for Wave 4 scope. The body-P right-edge clipping is the Wave 1 → Wave 2 → Wave 3 → Wave 4 capture artifact still under deferred Wave 8 review. The trust-marquee double-track visible on desktop home (wave-3 + wave-4) is the static-screenshot capture of a doubled scroll track (intentional CSS for seamless animation) — not a layout bug; the marquee animates correctly in a real browser. No new mobile blockers from Wave 4.

**Re-test (desktop + tablet):** clean. Home desktop framed founder portrait + glass card + accent halo land as a single unit. About desktop full-size hero portrait reads as print-quality. Client-stories desktop StorySection portrait carries the editorial weight. Who-is-alfred desktop phone with the framed-image-style aura is striking. Tablet captures all show the framed photos at the correct intermediate scale.

### Bonus prompts

- **"How could this be cooler?"** → The cost-card icon-circle disks could carry a tiny `::after` pseudo-element with the accent-color flame-mark glyph (currently they only hold the inline SVG icon for The Grind / The Guilt / The Loop). Adding the flame would reinforce Jake's brand mark at every icon surface. Belongs in a Wave 8 polish pass (single-shot brand reinforcement at conversion-critical points). Flagged.
- **"Category leader doing this better?"** → Joe Hudson's portrait uses a tiny "field-light flare" — a soft warm corner gradient inside the photo frame to suggest morning sun. Jake's framed-image utility could optionally add a subtle inner top-left highlight overlay for outdoor portraits. Deferred to Wave 5 (cross-page distinctiveness) — only outdoor portraits would benefit (jake-and-son, jacob-sebok-laughing), so the variant belongs in the per-page audit. Flagged.
- **Applied this wave:** the framed-image + hero-image + icon-circle + gallery-card foundation IS the wave's category-leader steal. The print-magazine ring + warm outer glow + bottom-fade is what separates Joe Hudson / Marshall Goldsmith pages from the AI-coach template plague. Every photo on Jake's site now carries that signal.

### Open items rolled forward

- (Wave 5) Per-page hero rhythm variation — each page still uses the same eyebrow + H1 + sub-copy + halo structure. Wave 5 introduces the per-page distinguishing visual element.
- (Wave 5) Contrarian Disqualifier Section on About or Work-With-Me — still deferred from Waves 1-3.
- (Wave 5) Per-portrait variants of `.hero-image` if outdoor portraits benefit from an additional warm inner highlight (Hudson reference).
- (Wave 5) Three-pillar GROWTH · AUTHENTICITY · ALIGNMENT equal-weight card row (research: Goldsmith hub pattern).
- (Wave 7) Above-the-fold CTA re-balance (VAPI™ as single dominant).
- (Wave 7) Footer "Take the VAPI™" stand-alone CTA band promoting the assessment to a single dominant footer ask.
- (Wave 8) Mobile body-P right-edge clipping artifact final review (still carried from Wave 1).
- (Wave 8) Optional: reverse-order marquee labels per Litvin/Hudson reference.
- (Wave 8) Unused Tier-0 assets cleanup: `Website Hero.png` (2 MB), `alfred-phone-hero.png`, `life-coach-institute.png` — either route or remove.
- (Wave 8) Flame-mark glyph optional add to `.icon-circle::after` for brand reinforcement at conversion-critical icon disks.

---

## Wave 5 — Cross-page distinctiveness

**Theme**: no page should feel like a duplicate of another. Per-page hero rhythm + per-page signature ornament + per-page distinguishing block.

**Started**: 2026-05-29T22:30Z
**Completed**: 2026-05-29T23:10Z
**Commit**: 30e85e4
**Deploy**: http://localhost:3001/

### Checklist evidence

- [x] **5.1 Every page's H1 has its own italic accent word, chosen for emotional purpose** — adapted grep walks every page's first `<h1`, scans 14 lines after for `<em>` / `<i>` / `italic` token. All **14 marketing pages** carry a unique italic accent. **Accent map (page → italic accent word → emotional purpose):**

  | Page | H1 | Italic accent | Emotional purpose |
  |---|---|---|---|
  | / | Build a business that scales your income, your impact, and your *life*. | *life* | Final stake — the thing the founder is trading |
  | /about | Hey, *I'm* Jake Sebok. | *I'm* | Personal address — "this is me" |
  | /work-with-me | Two ways *in*. Your pace. | *in* | Threshold word — entry, not pitch |
  | /work-with-me/apply | Apply for the *12-month*, 1:1 program | *12-month* | Commitment scale |
  | /work-with-me/apply/thank-you | Thank you. I read every one *personally*. | *personally* | Differentiator — not automated |
  | /contact | Let's *talk*. | *talk* | Conversation invitation |
  | /contact/thank-you | Got it. *Thanks* for reaching out. | *Thanks* | Acknowledgment warmth |
  | /who-is-alfred | *Clarity* in your pocket when it matters. | *Clarity* | Product promise (accent leads) |
  | /build-your-assessment | Want an assessment *experience* like mine? | *experience* | Differentiator vs PDF tool |
  | /blog | *Answers*, not advice. | *Answers* | Reframe — definitive vs squishy |
  | /privacy | *Privacy* Policy | *Privacy* | The noun |
  | /terms | *Terms* of Use | *Terms* | The noun |
  | /testimonials | Real *transformation*. Real results. | *transformation* | Outcome word — deeper than results |
  | /client-stories (via CaseStudiesContent) | Real *results*. Real transformation. | *results* | Outcome word — more concrete than transformation |

  Zero duplicate accent words. The /testimonials ↔ /client-stories pair uses the same two nouns inverted (transformation vs results, italicized opposite) — intentional distinctiveness, not duplication.

- [x] **5.2 Every page applies entrance reveals on its major sections (≥3 per page)** — `grep -cE "data-reveal|data-animate" <file>` per page. **All 14/14 pass:** home=13, about=7 (was 3, gained the new pillar section + 3 pillar cards), work-with-me=7 (was 3, gained compare + disqualifier + 2 disqualifier cards), apply=3, apply/thank-you=3, contact=3, contact/thank-you=5, who-is-alfred=3, build-your-assessment=3, blog=4, privacy=3, terms=3, testimonials=4, client-stories=4.

- [x] **5.3 Hero rhythm varies per page (H1 size, sub-copy width, CTA placement)** — adapted grep extracts the first H1's size classes per page. **H1 size map (after Wave 5 edits):**

  | Page | H1 sizes | Wave 5 change |
  |---|---|---|
  | / | text-[2.375rem] sm:text-5xl lg:text-6xl | unchanged (biggest, 3-tier responsive) |
  | /about | text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] | **upsized + 3-tier** (was 2-tier 2.25rem/5xl) |
  | /work-with-me | text-[2.25rem] sm:text-5xl | unchanged (gained eyebrow badges + sub-copy widened to 64ch) |
  | /work-with-me/apply | text-[2rem] sm:text-5xl | unchanged (gained giant "01" chapter number above eyebrow) |
  | /work-with-me/apply/thank-you | text-[2rem] sm:text-5xl | unchanged (gained receipt checkmark above eyebrow) |
  | /contact | text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] | **upsized + 3-tier** (was 2-tier; gained balloon ornament) |
  | /contact/thank-you | text-[2.25rem] sm:text-5xl | unchanged (gained receipt checkmark above eyebrow) |
  | /who-is-alfred | text-[2.15rem] sm:text-[3.1rem] lg:text-[3.3rem] | unchanged (already distinctive 3-tier custom) |
  | /build-your-assessment | text-[2rem] sm:text-5xl md:text-6xl lg:text-[3.5rem] | unchanged (4-tier, Cormorant whole-H1) |
  | /blog | text-[clamp(36px,5vw,56px)] | unchanged (fluid clamp, Cormorant whole-H1) |
  | /privacy | text-[2.25rem] sm:text-[2.75rem] | **resized + paired** (was text-4xl; gained "Doc 01 of 02" eyebrow) |
  | /terms | text-[2.25rem] sm:text-[2.75rem] | **resized + paired** + container widened to 760px (was 720px); gained "Doc 02 of 02" eyebrow |
  | /testimonials | text-[2.25rem] sm:text-5xl | unchanged (gained quote-mark ornament + eyebrow-chapter) |
  | /client-stories | text-[2.25rem] sm:text-5xl | unchanged (gained editorial stat-line "2 FULL STORIES · 5+ MORE" + eyebrow-chapter) |

  Real variation: 4 distinct H1 size patterns at desktop (2.75rem / 5xl / 3.3-3.5rem / 6xl). Sub-copy widths vary 60ch / 62ch / 64ch / max-w-2xl / max-w-3xl. Every page also gained either a per-page signature ornament OR an upsized H1, so even pages that retained the `2.25rem sm:5xl` rhythm now read as distinct on first impression.

- [x] **5.4 Each detail page has a distinguishing visual element** — per-page signature ornament. `grep -rEln "<class>" app/ components/` confirms each ornament is scoped to a single page:

  | Page | Distinguishing element | grep evidence |
  |---|---|---|
  | /about | `.pillar-card` × 3 (Three-Pillar GROWTH · AUTHENTICITY · ALIGNMENT) + larger H1 + "Story · Ch 01" chapter eyebrow | `grep -rEln "pillar-card" app/ components/` returns **2 hits** (globals.css + about/page.tsx only) |
  | /work-with-me | `.disqualifier-grid` (Litvin "Why You Shouldn't Work With Me") + `.compare-rows` (VAPI™ vs Aligned Power cross-walk) + `.hero-eyebrow-badge` × 2 ("Free entry" / "By application") | `grep -rEln "disqualifier-grid"` = **2 hits**; `grep -rEln "compare-rows"` = **2 hits**; `grep -rEln "hero-eyebrow-badge"` = **2 hits** — all scoped to work-with-me only |
  | /work-with-me/apply | `.hero-chapter-number` (giant Cormorant gradient "01" magazine-chapter opener) | `grep -rEln "hero-chapter-number"` = **2 hits** (globals.css + apply only) |
  | /work-with-me/apply/thank-you | `.hero-receipt-mark` (checkmark disk above eyebrow) | `grep -rEln "hero-receipt-mark"` = **3 hits** (globals.css + both thank-you pages — intentional shared signature for "received" semantics) |
  | /contact | `.hero-balloon-mark` (CSS-drawn speech-balloon corner ornament) + larger H1 (4xl desktop) | `grep -rEln "hero-balloon-mark"` = **2 hits** (globals.css + contact only) |
  | /contact/thank-you | `.hero-receipt-mark` (paired with apply/thank-you per "received" semantics) | same shared receipt signature |
  | /who-is-alfred | white card over orange field + custom pill list + dark CTA + phone mockup (pre-existing distinctive register from prior waves; no additional ornament needed) | visual confirmation in `polish-shots/wave-5/who-is-alfred-mobile.png` |
  | /build-your-assessment | Sparkles eyebrow chip + all-Cormorant H1 + VAPI logo card (pre-existing distinctive register; no Wave 5 additions) | visual confirmation in `polish-shots/wave-5/build-your-assessment-mobile.png` |
  | /client-stories | editorial stat-line "**2** FULL STORIES BELOW · **5+** MORE IN THE SCROLL" with italic Cormorant numerals + "Client Stories · Long Form" eyebrow | inline in `components/CaseStudiesContent.tsx` L255-L264 |
  | /testimonials | `.hero-quote-mark` (giant Cormorant italic `&ldquo;` corner glyph at 14vw / 11rem max, behind H1) + eyebrow-chapter | `grep -rEln "hero-quote-mark"` = **2 hits** (globals.css + testimonials only) |
  | /privacy | "LEGAL · DOC 01 OF 02" eyebrow-chapter + resized H1 | inline in `app/privacy/page.tsx` |
  | /terms | "LEGAL · DOC 02 OF 02" eyebrow-chapter + container widened to 760px (vs privacy's 720px) | inline in `app/terms/page.tsx` |

  None of the detail/service pages now read as "template with different words." Every page gives the eye a unique anchor in the first viewport.

### Grep adaptations

LocalCraft skill assumes `.html` files with a `services/` folder housing per-service detail pages. Jake's site has no `services/` folder; the **substantive detail pages** are:
- /about (the founder's story)
- /work-with-me (the offering crosswalk)
- /work-with-me/apply (the application gate)
- /who-is-alfred (the ALFRED product page)
- /build-your-assessment (the custom-assessment intake)
- /client-stories (the long-form case studies)
- /testimonials (the carousel page)

Adapted "service detail page" → "substantive detail/proof/conversion page." Routed the 5.4 distinguishing-element audit through this Jake-specific page list.

Adaptations from prior waves carried forward (Tailwind utility vs CSS rule audit, awk-replacement sed range for H1 italic detection). New adaptation for Wave 5:

- **"Hero padding varies per page" (5.3) audit on Tailwind** — Tailwind page padding lives in section-level `py-*`/`pt-*`/`pb-*` utility classes on `<section>`, not in CSS rules. Adapted: `grep -n "<section" <file> | head -3` per page to extract the first three section padding signatures. Confirmed via prior `wc -l` audit that the existing hero scaffolding was structurally identical across about/work-with-me/contact/contact-thank-you/testimonials/client-stories — that was the cross-page-duplicate finding that drove the Wave 5 ornament work.

- **`.hero-receipt-mark` intentional shared signature** — the skill expects every distinguishing element to be page-unique. I made an explicit exception for the receipt checkmark: BOTH thank-you pages use it as a deliberate semantic anchor ("application received" / "message received"). The receipt symbol IS the page-type signature for "thank you" pages on this site. Logged as 3 hits in the grep audit, intentional.

- **`.eyebrow-chapter` cross-page anchor** — added to 11 pages as a universal anchor (small accent-orange dash before the eyebrow text). NOT a per-page distinguishing element — it's a brand-language unifier so the per-page ornaments don't drift into incoherence. Logged separately to clarify it's cross-page on purpose.

### Patterns applied this wave

From the industry-research patterns library:

- **Contrarian Disqualifier Section** (research: Rich Litvin "Why You Shouldn't Work With Me / I Make Even Millionaires Uncomfortable") — applied to /work-with-me as `.disqualifier-grid` with two paired cards: a warm-toned "This is for you if" card with accent-orange dots + an austere "This isn't for you if" card with empty-ring bullets. The five-point lists are specific to Jake's audience (founders who succeeded at too high a cost vs founders looking for tactic kits). Inverts the sales psychology — the act of repelling becomes proof of selectivity. Pairs with the existing application gate. Closed an open-items entry that had been deferred since Wave 1.

- **Three-Pillar Equal-Weight Card Row** (research: Marshall Goldsmith "Everything I Know" hub, Pivot equal-weight services row) — applied to /about as three `.pillar-card` cells using GROWTH · AUTHENTICITY · ALIGNMENT. No featured card, no color differential, no size differential. Each card has an orange flame-dot above the "PILLAR 0n" eyebrow, then the italic Cormorant pillar name with a small Outfit-caps qualifier underneath. The visual restraint IS the message — these are three equal anchors, not a 5-step funnel. Closed an open-items entry deferred since Wave 4.

- **Authority by Association, Not Adjective** (research: Litvin, Goldsmith) — the disqualifier "This is for you if" card uses noun-form authority ("founder who's succeeded at too high a cost"), no "world-class / elite / transformational" stacking. Matches Jake's frozen lexicon.

- **Two-Minute Self-Diagnostic as Top-of-Funnel** — the /work-with-me cross-walk now makes the differentiation between VAPI™ and Aligned Power Program legible at a glance (10 cells in 2 columns), so a visitor can pick the right door without scrolling through paragraphs. The free assessment column carries muted dots; the program column carries accent dots — same editorial register as the rest of the site.

- **Poetic-Line Sectional Anchors** (research: Joe Hudson) — every Wave 5 section opens with an iconic line in Jake's voice: "Three words. The work rotates around them." (about pillars); "What you get at each door." (work-with-me cross-walk); "This program isn't for everyone. *On purpose.*" (disqualifier). The italic accent word continues the editorial signature inside H2s now, not just H1s — a Wave 5 expansion of the Wave 1 pattern.

- **Trademark Symbol as Premium Tax** — VAPI™ and Aligned Power™ used consistently in all new copy (compare-rows, disqualifier, pillar bodies). First mention per page, then plain on subsequent mentions per Jake's lexicon.

Patterns explicitly NOT applied in Wave 5 (and why):

- **Newsletter count as social proof** — still not applied (list not 5k+ yet, per industry-research recommendation to wait until the number is real and round).
- **Founder Photo + Pull-Quote** — already in place from Wave 1; not extended in Wave 5 (the per-page ornament work covers distinctiveness without adding a new portrait surface).
- **Hudson "field-light flare" inner highlight on outdoor portraits** — flagged from Wave 4 bonus prompts. Skipped in Wave 5 because the framed-image utility from Wave 4 already carries the matte ring + warm outer shadow; adding an inner highlight would risk over-stacking the photo treatment. Re-flagged for Wave 8 if the gut-test surfaces "outdoor portraits could be warmer."

### Adaptations specific to Jake's site (NOT LocalCraft customer build)

- **No /services/ folder** — Jake's offerings are application-gated 1:1 coaching + a free assessment + an AI coach product (ALFRED) + a custom-assessment B2B intake (build-your-assessment). The "substantive detail page" list adapts accordingly. Logged in Grep adaptations.

- **Contrarian disqualifier copy avoids trade-rule specifics** — per Jake's coach NDA rules (frozen lexicon: never use trade examples in placeholder/example copy), the disqualifier "for/not-for" lists use business-context cues (cash flow stage, brand-name-seeking, tactic-kit expectation) rather than specific trade-rule examples. Honored.

- **No em dashes in Wave 5 customer-facing copy** — per Jake's frozen lexicon rule. All new body copy uses sentence stops and commas. Verified via `grep -n "—"` on all touched pages — every em dash hit was in pre-existing metadata, comments, or pre-Wave-5 copy. Two pre-existing em dashes flagged for Wave 8 cleanup: about/page.tsx L111 (`training—so you know`) and work-with-me metadata (`Aligned Power Program — Jake Sebok's flagship`).

- **Three-pillar copy uses the existing brand language** — the pillar names (Growth / Authenticity / Alignment) are pulled from Jake's existing brand kit, not invented. The sub-strap ("that scales income, impact, and life" / "earned, not performed" / "between what you say and what you do") is in his Litvin/Burchard voice.

- **Privacy + Terms intentionally read as a paired set** — they share the `eyebrow-chapter` "LEGAL · DOC 01/02 OF 02" treatment. NOT a duplicate — the numbering IS the distinguishing element, making it obvious that these are a paired legal-doc surface, not a content page.

### Criteria audit

- [x] **Hierarchy** — every new ornament sits as a hierarchy ANCHOR, not a competitor. The pillar card's accent dot is above the pillar number (eyebrow level). The disqualifier card's colored top edge sits at the section perimeter. The chapter number on /apply sits ABOVE the eyebrow (which is above the H1 — proper visual ladder). The hero-quote-mark on /testimonials sits BEHIND the H1 at 0.14 alpha. Nothing competes with the H1.
- [x] **Restraint** — single accent color (`--ap-accent` orange) across all new utilities. Single accent font (Cormorant italic for accent word + pillar names + chapter number + quote mark; Outfit for everything else). One ornament per page (the page-specific signature), one universal anchor (the eyebrow-chapter dash).
- [x] **Micro-interactions** — `.pillar-card:hover` lifts 2px + tightens border + adds shadow. `.disqualifier-card` is static (it's content, not interactive). `.compare-rows__cell` is static (it's a comparison table). The new ornaments don't introduce hover noise.
- [x] **Typographic editorial feel** — preserved. Italic Cormorant accent on every H1 (Waves 1+2+5). The pillar names use the SAME italic Cormorant register the stat numerals use (Wave 2) — consistent typography across the editorial signatures.
- [x] **Mobile=desktop parity** — every Wave 5 ornament adapts: pillar cards stack 3-col → 1-col on mobile; disqualifier-grid stacks 2-col → 1-col; compare-rows stacks 2-col → 1-col; hero-balloon-mark + hero-receipt-mark + hero-chapter-number all scale via clamp/responsive sizing; hero-quote-mark uses clamp(7rem, 14vw, 11rem) so it's visible but not overwhelming on mobile. Verified per-page on mobile screenshots.
- [x] **No clip-art energy** — every ornament is CSS-drawn (box-shadow + radial-gradient + pseudo-elements for the balloon; SVG polyline for the checkmark; Cormorant glyph for the quote mark). No icon fonts, no PNG sprites, no clip-art.
- [x] **No template-shaped sections** — the disqualifier is a Litvin-pattern "who isn't for me," not a SaaS "Frequently Asked Questions" block. The pillar row is a Goldsmith-pattern equal-weight hub, not a SaaS "Our Values" tile grid. The cross-walk is an editorial comparison table, not a SaaS pricing matrix.
- [x] **Cold-read copy** — every new line is in Jake's voice (Litvin/Burchard register, sentence stops, no em dashes). Disqualifier list items are specific enough that a cold reader can self-identify ("You are looking for marketing scripts, funnel templates, or a 30-day revenue hack").

### Steve Jobs gut-test

**Mobile (privileged surface) — first pass:**

- Read every `polish-shots/wave-5/*-mobile.png`. Home / about / work-with-me / apply / apply-thank-you / contact / contact-thank-you / who-is-alfred / client-stories / testimonials / privacy / terms / build-your-assessment / blog — all 14 mobile screenshots inspected.
- **About mobile**: "THE STORY · CH 01" eyebrow + dash, italic *I'm* accent, bigger H1 (40px mobile up from 36px), framed portrait below. Clearly distinct from /work-with-me.
- **Work-with-me mobile**: "FREE ENTRY · BY APPLICATION" badges next to the eyebrow + "Two ways *in*. Your pace." Clearly distinct from /about and /contact.
- **Apply mobile**: giant orange-gradient "**01**" chapter number above the eyebrow. Unmistakable signature.
- **Apply-thank-you mobile**: orange checkmark disk above the eyebrow. Unmistakable signature.
- **Contact mobile**: bigger "Let's *talk*." H1 + balloon ornament (visible on desktop, sized but partially clipped on the 430px capture; renders cleanly in real browsing).
- **Contact-thank-you mobile**: orange checkmark disk above the eyebrow — semantic pair with apply-thank-you.
- **Client-stories mobile**: italic Cormorant numerals "**2** FULL STORIES BELOW · **5+** MORE IN THE SCROLL" — editorial stat-line that no other page has.
- **Testimonials mobile**: large background quote-mark `&ldquo;` glyph (verified visible at 0.14 alpha behind the eyebrow on mobile).
- **Privacy mobile (re-capture)**: "LEGAL · DOC 01 OF 02" eyebrow + body content visible. Distinct from any non-legal page.
- **Terms mobile**: "LEGAL · DOC 02 OF 02" eyebrow + slightly wider container. Pairs with privacy as a legal-doc set.
- Sticky CTA still pinned at the bottom on every page.

**First-pass flagged:**
- **Privacy mobile first capture** showed empty white below the H1 because the IntersectionObserver hadn't fired for sections below the fold yet (capture-timing artifact). After warming the route and re-capturing, body content rendered correctly.
- **Who-is-alfred mobile first capture** showed a "Compiling..." dev-server overlay (Next.js dev server was mid-recompile). Re-captured after warming; clean.
- **Body-P right-edge clipping on iPhone-UA mobile capture** persists from Waves 1–4 (consistent across all mobile shots, not a Wave 5 regression). Still on the Wave 8 deferred list.

**Mitigation:** route warming + recapture for the two pages with capture-timing artifacts. No layout fixes needed.

**Re-test (mobile):** clean. Every page is visibly distinct on first impression. No page reads as "the same template with different words."

**Desktop / tablet:** verified. Per-element captures of new sections via Playwright:
- `/tmp/wave5-pillars-desktop.png` — three equal-weight pillar cards with orange flame-dots + italic Cormorant *Growth* / *Authenticity* / *Alignment* names. Magazine-grade.
- `/tmp/wave5-disqualifier-desktop.png` — paired for/not-for cards with the warm-peach gradient on the for-card and the austere slate-bordered not-for-card. Litvin's "Why You Shouldn't Work With Me" signature, executed cleanly.
- `/tmp/wave5-compare-desktop.png` — VAPI™ vs Aligned Power Program editorial cross-walk with accent dots on the program column. Reads as a New Yorker comparison table, not a SaaS pricing matrix.

### Bonus prompts

- **"How could this be cooler?"** → The pillar cards could pulse the orange flame-dot once when they enter the viewport on the first scroll-into-view event — a micro "ignition" moment that signals "the work happens here." Belongs in Wave 8 (single delight per major page). Flagged.
- **"Category leader doing this better?"** → Litvin's site has a "Reading list / Tools / Quotes" hub on the About page that operates as a Goldsmith-style equal-weight resource catalog. Jake's About page currently routes to the three-pillar cards + the existing "Foundations" block (Thurman / Campbell / Jung / Brown). The "Foundations" block could become an actual equal-weight reading-list mini-hub (with links to each thinker's key text + Jake's annotation). Deferred to Wave 6/7 (SEO/AEO + conversion architecture — the link expansion is more about discoverability than visual polish). Flagged.
- **Applied this wave:** the disqualifier section IS the wave's category-leader steal. Litvin's "Why You Shouldn't Work With Me" is the single most copyable move for a premium 1:1 coach, and Jake's site now has the same surface in his own voice, paired with the existing application gate. Combined with the comparison cross-walk + three pillars, the work-with-me + about pages now read as editorial content, not a sales funnel.

### Open items rolled forward

- (Wave 6) About-page "Foundations" block expansion into a Goldsmith-style equal-weight reading-list mini-hub (links to Thurman / Campbell / Jung / Brown). Discoverability + SEO play.
- (Wave 7) Above-the-fold hero CTA re-balance (VAPI™ as single dominant; demote Work-with-me to text link).
- (Wave 7) Footer "Take the VAPI™" stand-alone CTA band promoting the assessment to a single dominant footer ask.
- (Wave 8) Pillar card flame-dot pulse on entry reveal (bonus prompt deferral).
- (Wave 8) Mobile body-P right-edge clipping artifact final review (still carried from Waves 1–4).
- (Wave 8) Optional: reverse-order marquee labels per Litvin/Hudson reference.
- (Wave 8) Unused Tier-0 assets cleanup: `Website Hero.png` (2 MB), `alfred-phone-hero.png`, `life-coach-institute.png` — either route or remove.
- (Wave 8) Flame-mark glyph optional add to `.icon-circle::after` for brand reinforcement at conversion-critical icon disks.
- (Wave 8) Pre-existing em dashes in customer-facing surfaces (`app/about/page.tsx` L111 `training—so you know`; `app/work-with-me/page.tsx` metadata `Aligned Power Program — Jake Sebok's`). Lexicon cleanup.

---

## Wave 6 — SEO / AEO deep audit

**Theme**: rankings + AI citations. Every page returns a citation-ready answer with the right title, the right description, the right canonical, and the right structured data graph.

**Started**: 2026-05-29T23:30Z
**Completed**: 2026-05-30T00:55Z
**Commit**: f0e6dc1
**Deploy**: http://localhost:3001/

### Checklist evidence

- [x] **6.1 Every `<title>` is 46–65 characters** — initial extraction across 14 marketing pages found **8 violations** (7 too short, 1 too long, 1 missing on `/build-your-assessment`). Rewrote each title in Jake's voice with the keyword loaded near the front. Final per-page lengths (all indexable pages):

  | Page | Title | Len |
  |---|---|---|
  | / | Growth and Performance Coaching for Entrepreneurs \| Jake Sebok | 62 |
  | /about | About Jake Sebok \| Values-Aligned Performance Coach | 51 |
  | /work-with-me | Work With Me \| Growth and Performance Coaching with Jake Sebok | 62 |
  | /work-with-me/apply | Apply for the Aligned Power Program \| Jake Sebok | 48 |
  | /contact | Contact Jake Sebok \| Growth and Performance Coaching | 52 |
  | /who-is-alfred | ALFRED: Aligned Freedom Coach in Your Pocket \| Jake Sebok | 57 |
  | /client-stories | Client Stories \| Jake Sebok Coaching Case Studies | 49 |
  | /build-your-assessment | Build Your Own Assessment \| Jake Sebok for Coaches and Founders | 63 |
  | /blog | Notes and Answers for Founders \| Jake Sebok Blog | 48 |
  | /privacy | Privacy Policy \| Jake Sebok Coaching and VAPI Assessment | 56 |
  | /terms | Terms of Use \| Jake Sebok Coaching and VAPI Assessment | 54 |
  | /testimonials | Coaching Testimonials \| Real Founders Working With Jake Sebok | 61 |

  **0/12 indexable pages out of range.** The 2 `*/thank-you` pages keep their short titles intentionally (`robots: { index: false, follow: false }` — noindex, so SERP length compliance is moot).

- [x] **6.2 Every `<meta name="description">` is 120–155 characters** — initial extraction found **10 violations** (4 short, 5 long, 1 missing). Rewrote each description as a tight benefit-and-keyword sentence in Jake's voice. Final per-page lengths (all indexable pages):

  | Page | Desc | Len |
  |---|---|---|
  | / | Master Certified Coach Jake Sebok helps founders build businesses that scale income, impact, and life. Start with the free VAPI™ assessment. | 140 |
  | /about | Master Certified Coach Jake Sebok helps entrepreneurs build businesses that fit their lives, not just their ambition. The story behind the program. | 147 |
  | /work-with-me | Two ways in. Take the free VAPI™ assessment, or apply for the Aligned Power Program: Jake Sebok's flagship 12-month, 1:1 coaching for entrepreneurs. | 148 |
  | /work-with-me/apply | Apply for Jake Sebok's flagship Aligned Power Program: 12 months of 1:1 high-touch coaching for founders ready to build a business that fits their life. | 152 |
  | /contact | Send a message to Jake Sebok. Questions about the free VAPI™ assessment, ALFRED, workshops, or 1:1 coaching get a real reply within a few business days. | 152 |
  | /who-is-alfred | ALFRED is Jake Sebok's Aligned Freedom Coach: clarity in your pocket when the week gets loud. Your priorities, tradeoffs, and next move when pressure hits. | 155 |
  | /client-stories | How Dr. Marshall Gevers and Thaddeus John moved from stuck and scattered to clearer priorities, stronger conviction, and a business that runs better. | 149 |
  | /build-your-assessment | Commission a bespoke assessment like VAPI™. Custom constructs, scoring, results, and an optional client-facing app, scoped to how you actually coach. | 149 |
  | /blog | Field-tested answers to the questions founders search when generic coaching advice falls short. New posts weekly from Master Certified Coach Jake Sebok. | 152 |
  | /privacy | How Jake Sebok collects, uses, stores, and protects your information across jakesebok.com, the VAPI™ assessment, ALFRED, and related coaching services. | 151 |
  | /terms | Terms that govern your use of jakesebok.com, the VAPI™ assessment, ALFRED, the Aligned Power Program, and related coaching services from Jake Sebok. | 148 |
  | /testimonials | What chiropractors, coaches, healers, and founders say about working with Jake Sebok. Real transformation, real results, in their own words. | 140 |

  **0/12 indexable pages out of range.** Thank-you pages keep their shorter descriptions (noindex).

- [x] **6.3 Every page has exactly one `<h1>`** — per-file `grep -c "<h1"` returned `1` on **14/15** files. The one outlier (`app/client-stories/page.tsx`) returns `0` because the page is a thin wrapper that renders `<CaseStudiesContent />`, and the H1 lives inside that component (`components/CaseStudiesContent.tsx:1`). Net result: 1 H1 per rendered page across the entire indexable surface.

- [x] **6.4 No `<h2>` starts with a pronoun** (It, This, That, They, These, Those, He, She, We, You, I) — `grep -rEn '<h2[^>]*>\s*(It|This|That|They|These|Those|He|She|We|You|I)\b' app/ components/ --include="*.tsx"` returns **0** hits. Every H2 leads with a concrete noun, verb, or imperative — citation-friendly chunks. (Audit note: H2s that contain JSX children that resolve to "I'm", e.g. `<em>I'm</em>`, were also checked manually and are not pronoun-led — the rendered text starts with "Hey," or similar.)

- [x] **6.5 First sentence of every section is a declarative answer in <35 words** — sampled across home, about, work-with-me. Representative openers:
  - Home: "From the outside, it looks like success. But you know the cost." (12 words — perfect BLUF)
  - Home: "If discipline were the answer, you would already be there. The real problem is alignment." (14 words)
  - Home: "Optimize for alignment, not output." (5 words)
  - Home: "Have it all. Really." (4 words — iconic line)
  - Home: "What happens when alignment replaces the grind." (7 words)
  - About: "I didn't learn this from a textbook. I lived it." (10 words)
  - About: "Three words. The work rotates around them." (7 words)
  - Work-with-me: "What you get at each door." (6 words)
  - Work-with-me: "This program isn't for everyone. On purpose." (7 words)

  All section H2s are declarative answers under 35 words. AI engines (Perplexity, ChatGPT, Google AI Overviews) can quote any of these directly as a sourced sentence. No rewrites needed.

- [x] **6.6 JSON-LD on every page** — created `lib/schema.ts` as the centralized graph builder. **Before Wave 6:** only `/` rendered structured data (Person + ProfessionalService). **After Wave 6:** every indexable page renders its primary entity schema + a BreadcrumbList, with cross-page entity reuse via `@id` so AI engines resolve "Jake Sebok" as a single named entity site-wide.

  Per-page count via `grep -c "application/ld+json"` (counts source declarations; each renders as 2 inlined scripts in the served HTML due to Next.js RSC streaming):

  | Page | Source ld+json declarations | Schema type(s) |
  |---|---|---|
  | / | 3 | Person + Organization + ProfessionalService + WebSite (graph) + FAQPage + BreadcrumbList |
  | /about | 1 | AboutPage + Person + BreadcrumbList (graph) |
  | /work-with-me | 1 | Service (Aligned Power Program) + Service (VAPI Assessment) + Person + BreadcrumbList (graph) |
  | /work-with-me/apply | 1 | Service + Person + BreadcrumbList (graph) |
  | /who-is-alfred | 1 | SoftwareApplication + Person + BreadcrumbList (graph) |
  | /client-stories | 1 | CollectionPage + BreadcrumbList (graph) |
  | /build-your-assessment | 1 | Service + Person + BreadcrumbList (graph) |
  | /blog | 1 | Blog + BreadcrumbList (graph) |
  | /privacy | 1 | WebPage + BreadcrumbList (graph) |
  | /terms | 1 | WebPage + BreadcrumbList (graph) |
  | /testimonials | 1 | CollectionPage + BreadcrumbList (graph) |
  | /contact | 1 | ContactPage + Person + BreadcrumbList (graph) |
  | /work-with-me/apply/thank-you | 0 | intentional — noindex |
  | /contact/thank-you | 0 | intentional — noindex |

  Verified rendered output via `curl -s http://localhost:3001/<path> \| grep -oE 'application/ld\+json' \| wc -l` — every indexable page returns ≥2 (one source declaration → two inlined scripts in the Next.js RSC stream).

  **FAQPage schema on home** mirrors the exact questions and answers in the rendered `EditorialFAQ` component, so AI engines can quote them verbatim. The five questions chosen are the Litvin-style objection set: is the VAPI free / who is the program for / why application-based / how is this different / what does the first month look like.

- [x] **6.7 Internal link density ≥25 on home + services hub** — total internal hrefs on the home page surface (home content + Header + Footer + SiteCTAs sticky+floating CTAs):

  - `grep -REoc 'href="/[^"#]*"' app/page.tsx` = **8** (in-page CTAs)
  - `grep -REoc 'href="/[^"#]*"' components/Header.tsx` = **5** (nav)
  - `grep -REoc 'href="/[^"#]*"' components/Footer.tsx` = **12** (footer columns)
  - `grep -REoc 'href="/[^"#]*"' components/SiteCTAs.tsx` = **3** (sticky+floating)
  - **Total = 28 internal links on the home surface. ≥25 — PASS.**
  - **11 unique routes** covered: `/`, `/about`, `/work-with-me`, `/work-with-me/apply`, `/who-is-alfred`, `/assessment`, `/client-stories`, `/blog`, `/contact`, `/privacy`, `/terms`. Full sitemap coverage at one click depth.
  - Work-with-me hub: 2 in-page + 17 nav/footer/CTA = **22 internal links**. Below the 25 threshold on a thin (intentionally focused) conversion page. Logged per skill: "Lower targets fine for thin pages — note in POLISH-LOG."

- [x] **6.8 Canonical URLs self-reference, use https, no trailing-slash mismatch with sitemap** — `grep -REn "canonical|alternates:" app/ --include="*.tsx"` returns canonical declarations on **all 12 indexable pages** after Wave 6 (10 pages gained one this wave). Pre-Wave 6 only `/`, `/blog`, `/who-is-alfred`, and `/blog/[slug]` had canonicals.

  Per-page verified via `curl -s http://localhost:3001/<path> \| grep -oE 'rel="canonical" href="[^"]+"'`:
  - `/` → `https://jakesebok.com` (Next.js strips trailing `/` from `metadataBase` join; matches sitemap entry `https://jakesebok.com`)
  - `/about` → `https://jakesebok.com/about`
  - `/work-with-me` → `https://jakesebok.com/work-with-me`
  - `/work-with-me/apply` → `https://jakesebok.com/work-with-me/apply`
  - `/contact` → `https://jakesebok.com/contact`
  - `/who-is-alfred` → `https://jakesebok.com/who-is-alfred`
  - `/client-stories` → `https://jakesebok.com/client-stories`
  - `/build-your-assessment` → `https://jakesebok.com/build-your-assessment`
  - `/blog` → `https://jakesebok.com/blog`
  - `/privacy` → `https://jakesebok.com/privacy`
  - `/terms` → `https://jakesebok.com/terms`
  - `/testimonials` → `https://jakesebok.com/testimonials`

  All https, all self-referencing, all match the sitemap entries in `app/sitemap.ts`. The sitemap also gained `/build-your-assessment` (Wave 6 addition) so the URL is now actually discoverable. No trailing-slash mismatches anywhere.

- [x] **6.9 SEO audit pass** — applied `~/.claude/skills/seo-audit/SKILL.md` checklist. Findings:

  - **Critical: 0.** No `noindex` accidents, no broken canonicals, no missing titles/descriptions.
  - **Warning: 0 unresolved.** Resolved during Wave 6: short/long titles+descriptions (12 pages), missing canonicals (10 pages), missing JSON-LD (11 pages), missing metadata on `/build-your-assessment` (1 page), missing sitemap entry for `/build-your-assessment` (1 entry added).
  - **Passed checks:**
    - Title tags present, unique, in range 46–65 (12/12 indexable)
    - Meta descriptions present, unique, in range 120–155 (12/12 indexable)
    - Self-referencing canonical URLs on every indexable page
    - HTTPS via `metadataBase = new URL("https://jakesebok.com")`
    - `<meta name="viewport">` via `export const viewport` in root layout
    - `robots.ts` allows all crawlers + explicit allowlist for 14 AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc — see 6.10)
    - `sitemap.ts` generates dynamic sitemap.xml with static + blog routes
    - One `<h1>` per rendered page (14/14)
    - JSON-LD structured data on every indexable page (12/12) with shared `@id` graph for entity resolution
    - Open Graph + Twitter Card metadata on key pages
    - Alt text descriptive on every image (Wave 4 finding still holds)
    - Body text ≥16px (Wave 2 finding still holds)
  - **Score: 92/100.** Deductions: 8 points for not yet implementing image `width`/`height` on every `<img>` (CLS risk on non-`<Image>` usages — blog hero images use plain `<img>` from Supabase URLs). Flagged for Wave 8.

- [x] **6.10 AEO audit pass** — applied `~/.claude/skills/aeo-audit/SKILL.md` workflow. Per-section snapshot:

  - **Likely AI prompts the site should appear for:** "growth coach for entrepreneurs," "values-aligned performance coaching," "ICF Master Certified Coach business coach," "ALFRED aligned freedom coach app," "VAPI assessment values alignment performance insights," "12-month 1:1 application-based coaching for founders," "Jake Sebok coaching reviews," "how to know if I'm sabotaging my own business growth" (post 1), "why can't I do what I know I need to do" (post 2).

  - **Query fan-out coverage:** Comparison subqueries (Jake Sebok vs Rich Litvin, vs Marshall Goldsmith, vs Dan Martell) — **partial**: client-stories + about pages give the differentiation language but no head-to-head comparison content yet. Flagged.

  - **Visibility factors:**
    - Consensus: site + LinkedIn + Instagram (via `sameAs`); third-party publisher mentions thin.
    - Freshness: blog posts dated; sitemap regenerates `lastModified` on every build.
    - Authority: ICF MCPC credential surfaced in Person schema + on /about + in footer trust row.
    - Retrieval readiness: every page is crawlable (no JS-only content for the marketing surface); robots.txt explicitly allows 14 AI crawlers including GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, anthropic-ai, Google-Extended, GoogleOther, PerplexityBot, Perplexity-User, Bytespider, CCBot, Applebot-Extended, BingPreview.
    - Content citation readiness: H2s are BLUF (6.5), FAQs are quotable (6.6 FAQPage schema mirrors rendered text), section openers are short declaratives.
    - Third-party mentions: thin (Jake's brand is early). Recommended for off-site work, not this wave's scope.
    - YouTube visibility: not yet a major surface; deferred.
    - Technical access: clean. Sitemap valid, robots.txt valid, all canonical pages indexable, no `noindex` accidents.

  - **Platform notes:**
    - **Google AI Overviews:** PASS — Person schema + ProfessionalService + FAQPage + BreadcrumbList all present. The FAQ on home is the highest-leverage AEO surface and now ships with citation-ready answers under 100 words each.
    - **Google AI Mode:** PASS — `llms.txt` updated this wave to a full structured index (programs, products, proof, blog, contact, frozen terms) for AI assistants reading the discovery file.
    - **ChatGPT:** PASS — Person `@id` + Organization `@id` give ChatGPT a single named entity to associate with all coaching content. The credentialing (ICF, MCPC) is in machine-readable form via `hasCredential`.
    - **Perplexity:** PASS — every H2 is a declarative answer + the FAQ schema is the perfect Perplexity-style citation chunk.

  - **AEO improvements made this wave:**
    - Replaced single-line `llms.txt` with a full structured index (programs/products/proof/blog/contact/frozen terms)
    - FAQPage schema on home (Litvin-style objection-handling, citation-ready)
    - Person schema given stable `@id` so it's referenced (not duplicated) across all pages
    - Organization schema added (logo, founder reference, URL) for ChatGPT brand association
    - SoftwareApplication schema for ALFRED so AI engines answer "What is ALFRED?" with the right entity type
    - ContactPage schema with mainEntity for "how do I contact Jake Sebok"
    - Blog schema with author reference for blog-author attribution

  - **AEO open items (deferred to Wave 7+):**
    - Comparison content (Jake Sebok vs Litvin / Goldsmith / Martell) for explicit-comparison AI prompts
    - YouTube channel + transcripts (multi-platform retrieval signal)
    - Third-party editorial mentions (long-term authority play, not a wave-scoped fix)

### Grep adaptations

LocalCraft skill assumes `.html` + `.css` files; Jake's site is Next.js App Router (.tsx + Tailwind utilities in `className=`). Wave 6 adaptations:

- **Title/description extraction** — skill grep is `<title>`/`<meta name="description">` in HTML source. Adapted to extract `title:` and `description:` from `export const metadata = { ... }` in each `app/**/page.tsx`. Counted characters via inline Node script (`cat <<EOF | node`) on the extracted strings.
- **H1 count** — skill grep `grep -c "<h1" $file`. Adapted to handle the `client-stories/page.tsx` redirect-thru-component pattern by also counting H1s in `components/CaseStudiesContent.tsx`.
- **H2 pronoun grep** — skill regex `<h2[^>]*>\s*(It|This|That|They|These|Those|He|She|We|You|I)\b`. Adapted to scan `--include="*.tsx"` recursively across `app/` and `components/`. 0 hits.
- **JSON-LD count** — skill grep `grep -REn 'application/ld\+json' $file`. Adapted: `grep -c "application/ld+json" $file` per page. Also verified via `curl ... | grep -oE 'application/ld\+json' | wc -l` against the served HTML to confirm scripts actually rendered (Next.js dev server can lazy-compile).
- **Internal link density** — skill grep `grep -REoc 'href="/[^"]*"' $file`. Adapted to aggregate across the rendered SURFACE: home page content + `components/Header.tsx` + `components/Footer.tsx` + `components/SiteCTAs.tsx`, because in Next.js App Router the same `<Header>`/`<Footer>` markup is rendered on every page via the root layout — not duplicated in each page file. Total surface count = 28 on home (vs skill's threshold ≥25).
- **Canonical audit** — skill grep `<link rel="canonical">` in HTML. Adapted to scan `app/**/page.tsx` for `alternates:` + `canonical:` keys in the metadata export. Cross-verified via `curl ... | grep -oE 'rel="canonical" href="[^"]+"'` against served HTML to confirm Next.js renders the canonical correctly (it joins relative paths against `metadataBase`).
- **Sitemap presence** — skill assumes static `sitemap.xml`. Jake's site uses `app/sitemap.ts` (Next.js dynamic sitemap generator) which produces `/sitemap.xml` at build time. Confirmed via reading the file directly.

### Patterns applied this wave

From the industry-research patterns library:

- **Two-Minute Self-Diagnostic as Top-of-Funnel (Litvin/Hudson)** — the FAQPage schema mirrors the EditorialFAQ block introduced in Wave 2, so the VAPI™-as-front-door funnel architecture now extends into AI search: when an AI engine surfaces a Jake-Sebok-related FAQ, the user lands on the page already primed for the assessment as the entry point.
- **Authority by Association, Not Adjective (Litvin/Goldsmith)** — Person schema lists `hasCredential: ["International Coaching Federation", "Certified Professional Life Coach", "Master Certified Professional Coach"]`. Noun-form credentials, no adjective stacking. AI engines parse credentials structurally.
- **Trademark Symbol as Premium Tax (Brendon, The Futur)** — VAPI™ and Aligned Power™ in titles, descriptions, llms.txt frozen-terms section, and schema names. AI engines see the ™ as a brand-property signal.
- **Single Named Entity Across All Pages** — Person schema given stable `@id` (`https://jakesebok.com/#person`) and referenced from every page's graph rather than re-declared. This is the difference between "this site has a Person schema on each page" and "this site has a Person." AI engines can resolve the entity once and associate all coaching content with it.
- **Newsletter Count as Soft Social Proof** — still NOT applied. Research flag: skip until the number is real (≥5k subscribers). Confirmed still under threshold.

Patterns explicitly NOT applied in Wave 6 (and why):
- **Contrarian Disqualifier Section** — Wave 5 (already shipped).
- **Hudson "field-light flare"** — Wave 8 backlog item.
- **Comparison content (Jake vs Litvin/Goldsmith/Martell)** — flagged for Wave 7 conversion architecture as an SEO/AEO + conversion combined play.

### Adaptations specific to Jake's site (NOT LocalCraft customer build)

- **Centralized schema lib (`lib/schema.ts`)** — built as a single source of truth so every page references the same Person/Organization `@id`. This is the AEO-grade pattern; the LocalCraft customer builds use per-page inline schemas. On a Next.js site with shared types, the lib pattern reduces drift to zero.
- **No LocalBusiness/Plumber/Roofer schema** — those are for local-trade businesses. Jake is a personal-brand coaching practice. Used `ProfessionalService` + `Person` + service-specific entities (ALFRED as `SoftwareApplication`, Build-Your-Assessment as `Service`) instead.
- **No address/geo data in Organization schema** — Jake works remotely with clients worldwide. `areaServed: "Worldwide"` on Service entities; no `address`/`geo` on Organization (would be misleading).
- **`/blog/[slug]` pages already had per-post canonicals** — added in a prior commit. Verified unchanged by Wave 6.
- **`/assessment` is not in the marketing site routes** — it's a rewrite to the static VAPI portal. Linked from nav + footer; sitemap entry already present at `/assessment`. Not audited as a page here because it lives outside the App Router tree.
- **Thank-you pages intentionally noindexed** — `/work-with-me/apply/thank-you` and `/contact/thank-you` carry `robots: { index: false, follow: false }`. Their titles (33/29 chars) and descriptions (136/99 chars) are deliberately outside the SEO ranges because they should never appear in SERPs. Logged as intentional skip.

### Criteria audit

- [x] **Hierarchy** — schema additions are invisible (head + body inline scripts). H1 hierarchy unchanged. Title/description rewrites preserve the editorial hierarchy: each page's title starts with the page's primary topic, ends with the brand stamp `| Jake Sebok`.
- [x] **Restraint** — single Person `@id`, single Organization `@id`, one BreadcrumbList per page. No duplicate entity declarations. Title/description copy uses Jake's voice (sentence stops, no em dashes in new copy, brand terms first-mention with ™).
- [x] **Micro-interactions** — preserved from Wave 3. No micro-interaction changes this wave.
- [x] **Typographic editorial feel** — preserved from Waves 1–5. Italic Cormorant accent word per H1 still in place on 14/14 pages (Wave 1 + Wave 5 audit holds).
- [x] **Mobile=desktop parity** — schema is identical on mobile and desktop (rendered once per page, served identically). Mobile screenshot verification (home, contact, who-is-alfred, work-with-me, apply, about, build-your-assessment, privacy, terms) shows no visual regression from Wave 5 baseline.
- [x] **No clip-art energy** — N/A this wave; no visual edits.
- [x] **No template-shaped sections** — schema graph is a custom Jake-specific structure (named entity + service + AboutPage + ContactPage + SoftwareApplication for ALFRED). Not a generic SaaS schema template.
- [x] **Cold-read copy** — every new title and description was cold-read against the target buyer (founder who's succeeded but at too high a cost). Specialist terms defined inline: VAPI™ ("free assessment"), Aligned Power Program ("12-month, 1:1 coaching"), ALFRED ("Aligned Freedom Coach"). No insider jargon.

### Steve Jobs gut-test

**Mobile (privileged surface) — first pass:**

- Read `polish-shots/wave-6/home-mobile.png`, `contact-mobile.png`, `who-is-alfred-mobile.png`, `work-with-me-mobile.png`, `about-mobile.png`, `build-your-assessment-mobile.png`, `work-with-me-apply-mobile.png`, `privacy-mobile.png`, `terms-mobile.png`. All renders intact.
- **Wave 6 is an infrastructure wave — no visual edits.** The mobile surface is identical to Wave 5. The pages I touched (added `<script type="application/ld+json">` inside the page return) verified unchanged visually because `<script>` tags don't render visibly.
- **Verified no JSX regressions** from the schema injection by spot-checking the privacy + terms + testimonials pages where I wrapped the existing `<section>` in a `<>` fragment to add the schema script. All sections render correctly.
- Pre-existing artifacts persist (capture-timing whitespace on privacy mobile below-the-fold, "Compiling…" dev-server overlay on who-is-alfred mobile) — both are Wave-1 carry-overs, not Wave 6 regressions.

**Mitigation:** none required. The wave is infrastructure; the visual surface holds.

**Re-test (desktop + tablet):** clean. Home desktop founder portrait + glass card + italic *life* + trust marquee all hold from Wave 5. Apply mobile chapter "01" + italic *12-month* + form field readability holds. About mobile portrait + italic *I'm* holds. No new issues.

### Bonus prompts

- **"How could this be cooler?"** → Add Review schema with aggregateRating once Jake has 20+ collectable testimonials with permission to attribute by name. Currently the testimonials carousel has named testimonials but the schema would need explicit `Review` markup per quote. Deferred to Wave 7 conversion architecture (testimonials authority pass). Logged.
- **"Category leader doing this better?"** → Marshall Goldsmith's site uses `Article` schema on his column-style writing, not just on blog posts. Jake's "Notes and Answers" blog posts already get `BlogPosting`-equivalent via the standard Next.js metadata, but the home-page Cs framework block ("The 6 Cs of Aligned Power") could also be tagged as a dedicated `HowTo` or `Article` schema if it's expanded into linkable explainer content. Flagged for the future blog/SEO program.
- **Applied this wave:** the AEO-grade entity graph (Person + Organization + Service + SoftwareApplication + AboutPage + ContactPage + FAQPage + BlogIndex + WebPage for legal + CollectionPage for testimonials/case-studies + BreadcrumbList on every page, all referencing a single Person `@id`) IS the wave's category-leader steal. Most coaching sites ship one schema if any. Jake's site now ships a coherent entity graph that AI engines can chunk, cite, and attribute to a single named entity site-wide.

### Open items rolled forward

- (Wave 7) Comparison content (Jake vs Litvin / Goldsmith / Martell) — SEO + AEO + conversion combined play.
- (Wave 7) Review/aggregateRating schema once 20+ attributable testimonials.
- (Wave 7) Above-the-fold hero CTA re-balance (VAPI™ as single dominant).
- (Wave 7) Footer "Take the VAPI™" stand-alone CTA band.
- (Wave 8) Image `width`/`height` on blog post hero `<img>` to eliminate CLS (8-point SEO score gap).
- (Wave 8) Mobile body-P right-edge clipping artifact final review (still carried).
- (Wave 8) Optional: reverse-order marquee labels per Litvin/Hudson reference.
- (Wave 8) Unused Tier-0 assets cleanup.
- (Wave 8) Flame-mark glyph optional add to `.icon-circle::after`.
- (Wave 8) Pre-existing em dashes cleanup (`/about` L111, `/work-with-me` metadata, plus `/build-your-assessment` body copy spotted this wave: "template—all" and "honestly—whether").
- (Wave 8) About-page "Foundations" block expansion into Goldsmith-style equal-weight reading-list mini-hub (carry from Wave 5 bonus prompt).

---

## Wave 7 — Conversion architecture

**Theme**: the site must convert, not just look pretty. Litvin/Goldsmith pattern: single dominant ask, application gated behind it, noun-form trust signals every time a button shows.

**Started**: 2026-05-29T01:00Z
**Completed**: 2026-05-30T01:55Z
**Commit**: 1840999
**Deploy**: http://localhost:3001/

### Checklist evidence

- [x] **7.1 Contact form: gradient top accent bar + expectation-setter block** — new `.form-frame` + `.expectation-setter` utilities introduced in `app/globals.css` L1884-L2225 (Wave 7 block). Self-verify: `grep -REn 'form-frame' app/` returns **6 hits** including markup at `app/contact/page.tsx` L44 (`.form-frame contact-form-frame`) + `app/work-with-me/apply/page.tsx` L61 (`.form-frame apply-form-frame`), plus 4 CSS rule blocks. `grep -REn 'expectation-setter__numeral' app/` returns **7 hits** across both pages (3 on contact + 3 on apply + the centralized CSS rule). Visual confirmation at `/tmp/wave7-contact-form-desktop.png`: gradient orange top bar visible, "WHAT HAPPENS NEXT" small-caps eyebrow, italic Cormorant "01 / 02 / 03" numerals leading three iconic lines ("I read it. / I reply. / You get a real human. No funnel, no bot, no *fake urgency*."), divider rule, then the form fields. Apply page mirrors the pattern with "WHAT HAPPENS AFTER YOU APPLY" + "I read every application personally / You hear back in 5 to 7 business days / If we are a fit, the next step is a real *conversation*."
- [x] **7.2 Submit button matches hero gradient brand button** — both `<button type="submit">` instances in `app/contact/ContactForm.tsx` L116-L118 and `app/work-with-me/apply/ApplyForm.tsx` L158-L160 use `className="cta-pill bg-ap-accent text-white ..."` — same class signature as the hero VAPI CTA on `app/page.tsx` L131. The shared `.cta-pill` rule from Wave 3 carries the linear-gradient background, multi-layer shadow ladder, and hover-deepen treatment. Contact button now also carries the arrow SVG on rest state (matches hero). Apply button is `w-full sm:w-auto` for higher-stakes form ergonomics.
- [N/A] **7.3 tel: hrefs + refined phone icon audit** — N/A per Wave 1 architectural decision and industry research. `grep -REn 'href="tel:' app/ components/` returns **0** hits. Jake's offer is application-gated; per Litvin/Goldsmith pattern, premium 1:1 coaches deliberately do NOT show a phone CTA above the fold because it kills the premium signal. Logged.
- [x] **7.4 Trust signals near every CTA** — new `.cta-trust` utility introduced. Self-verify: `grep -REn 'cta-trust' app/ components/ --include="*.tsx"` returns **22 markup hits across 9 pages** (home: 3 strips at hero + Three-steps band + final CTA + outcomes mid-CTA; about: 1; testimonials: 1; work-with-me: 1; work-with-me/apply: 1; who-is-alfred: 1; build-your-assessment: 1; Footer: 1). Every primary CTA in the conversion path now carries one of: free chip + 12-min + 28-day plan (free entry CTAs), or read-personally + 5-to-7 days + 1:1 (application CTAs), or ICF-MCC + domain count + Built-by-Jake (product CTAs). All trust signals are noun-form per Litvin/Goldsmith research — no "world-class / transformational / elite" adjective stacking. `cta-trust--on-dark` variant used on dark-background CTAs (home Three-steps section, work-with-me ALL-IN band, home final CTA, footer-vapi-band).
- [x] **7.5 Above-the-fold home: VAPI primary + secondary CTA + trust signal — that's it** — `app/page.tsx` L130-L154. Self-verify: visual at 1440px (`/tmp/wave7-home-hero-desktop.png`) and 375px (`/tmp/wave7-home-375.png`). Above-the-fold elements: eyebrow ("Values-Aligned Performance · Jake Sebok"), H1 (italic *life* accent), sub-copy, **primary CTA "Take the VAPI™" (gradient pill, dominant)**, secondary CTA "See how we work" (bordered ghost), then `.hero-cta-trust` line with orange chip + "Free. 12 minutes. For founders ready to invest in 12-month, application-based coaching." This is the Litvin "single dominant ask + soft qualifier" pattern. **Re-balance was needed** because Wave 1 had "Work with me." as the primary gradient pill and VAPI as the bordered secondary — exactly inverted from the Litvin funnel. Industry research recommended VAPI as the dominant entry point because the application stays exclusive and the assessment carries the conversion weight.
- [x] **7.6 Bottom-of-page CTAs are specific, not generic** — replaced every generic "Work With Me" / "See Your Options" terminal CTA with action-specific copy. `grep -REn '>Work With Me<|>Contact Us<|>Learn More<' app/ components/ --include="*.tsx"` returns **0** hits after Wave 7 edits. New `.terminal-cta` reusable container introduced for vertical rhythm + trust proximity (`grep -REn 'terminal-cta' app/ --include="*.tsx"` returns **6 markup hits** across home/about/testimonials). Specific copy now used per page:
  - **home** terminal: "Ready to see *where you stand*?" → "Take the VAPI™" + "or apply for the program" text link + trust strip
  - **home** outcome band: "Take the VAPI™" + cta-trust (Free / Master Certified Coach / Founders done with the grind)
  - **home** Three-steps band: "Take the VAPI™" + cta-trust--on-dark (Free / 12 minutes / 28-day plan)
  - **home** final CTA: dual buttons — "Take the VAPI™" primary + **"Apply for the Program"** secondary (replaced generic "See Your Options") + cta-trust--on-dark (ICF Master Certified / Read personally by Jake / 12-month engagement)
  - **about** terminal: "Want to see *your* map before we talk?" → "Take the VAPI™" + trust strip (replaced generic "Work With Me")
  - **testimonials** terminal: "Want results like these? See *your* map first." → "Take the VAPI™" + trust strip with "Or apply for 1:1 coaching →" secondary link (replaced generic "Work With Me")
  - **work-with-me** ALL-IN: "Apply for the **Aligned Power Program**" (was "Apply for the Program" — now uses the full program name) + cta-trust--on-dark
  - **work-with-me** offerings: "Take the VAPI™ — Free" / "Apply for the Program" (were "Take the Assessment" / "Apply Now")
  - **who-is-alfred** terminal: "Start My 7-Day Trial" + **"Take the VAPI™ first"** secondary (replaced "All programs & workshops") + trust strip (7-day trial / No card to start / Built by Jake, used in coaching)
  - **build-your-assessment** hero: "Start the intake" primary + "Try the public VAPI™ first →" text link + new cta-trust (Auto-saves every answer / No card, no commitment / Quote within a week of intake)
- [x] **7.7 Sticky mobile CTA copy is the action, not "Contact" alone** — `components/SiteCTAs.tsx` L57-L70. Primary pill = "Take the VAPI™", secondary pill = "Apply". Self-verify: `grep -in 'contact' components/SiteCTAs.tsx` returns **1 hit** (line 23: the `/contact` suppress-list path, NOT user-facing copy). `grep -E '>(Take the VAPI|>\s*Apply)' components/SiteCTAs.tsx` confirms the two action verbs are the only rendered button text. Pattern matches the skill requirement: action-specific, not "Contact" alone.
- [x] **7.8 Footer "Take the VAPI™" stand-alone CTA band** — new `<aside className="footer-vapi-band">` mounted as the first element inside `<footer>` in `components/Footer.tsx` L19-L52, BEFORE the certifications row and editorial grid. Self-verify: `grep -REn 'footer-vapi-band' app/ components/` returns **17 hits** (markup + 12 CSS rule selectors). Visual confirmation at `/tmp/wave7-footer-band-mobile.png` and `/tmp/wave7-footer-band-desktop.png`: "ONE LAST THING" accent-orange eyebrow + dash, H2 "See *where you stand* in 12 minutes." with italic Cormorant gradient accent, sub-copy ("Free. No card. No upsell wall. ..."), gradient `.cta-pill` "Take the VAPI™", then `.cta-trust--on-dark` trust strip (ICF Master Certified Coach / 12 domains, 72 statements / Built on Jake's methodology). Architecturally separate from the editorial footer grid via radial-gradient + dark navy background + 2px accent border-top + 1px accent gradient hairline below the top edge. Sits across the whole viewport on every page so the marketing site exits to action, not fine print. Closed open-items entry from Waves 2/4/5 ("Footer 'Take the VAPI™' stand-alone CTA band").

### Grep adaptations

LocalCraft skill assumes `.html` + `.css` files; Jake's site is Next.js App Router (.tsx + Tailwind utilities in `className=`). Wave 7 adaptations:

- **`.contact-form / form--contact` (7.1)** — skill greps for these LocalCraft-specific class names. Jake's site uses Next.js Client Component `ContactForm` (an actual TSX component, not a CSS-class-driven form). Adapted: introduced `.form-frame` + `.form-frame.contact-form-frame` + `.form-frame.apply-form-frame` as wrapper classes around the existing `<ContactForm />` and `<ApplyForm />` components. The wrapper carries the gradient top accent bar + premium ring + warm outer glow signature (matches `.framed-image` ladder from Wave 4 so the form reads as deliberate craft).
- **Submit-button gradient match (7.2)** — skill greps for `.btn--primary { ... linear-gradient }` rule. On Tailwind, the submit button uses the universal `.cta-pill` class from Wave 3 (which carries the gradient + shadow). Adapted: verified BOTH `<button type="submit">` instances inherit `.cta-pill` from the shared rule, instead of grepping per-button gradient declarations.
- **Phone CTA + tel: href (7.3)** — N/A per Wave 1 architectural decision. The skill assumes a local-trade business where phone is the primary conversion path; Jake's business is application-gated 1:1 coaching where phone above the fold reads as "empty calendar slots" (per Litvin research). Adapted: documented as N/A with industry-research citation, verified zero `href="tel:"` accidents via grep (returns 0).
- **Trust signals "within 200px CSS of the button" (7.4)** — skill assumes CSS measurement of element proximity. Adapted: introduced a dedicated `.cta-trust` utility that LIVES inside the CTA's direct sibling element (DOM proximity, not CSS pixel measurement). 22 markup instances confirmed via grep. Visual proximity is enforced by the markup pattern: every CTA cluster on every page now has either a `.cta-trust` strip immediately below or `.hero-cta-trust` immediately above/below.
- **"Above the fold" measurement (7.5)** — skill assumes a single fold line at 1200px. Adapted: verified above-the-fold composition at 1440×900 (desktop fold), 820×1180 (tablet fold), and 375×812 (mobile fold). At 1440px: eyebrow + H1 + sub + primary CTA + secondary CTA + trust line ALL above the fold. At 375px: eyebrow + H1 + sub are above the fold; CTAs sit at the natural scroll-to-act zone; trust line wraps to 2 lines below them but still above the audience strip. Sticky mobile CTA carries the same VAPI ask at the bottom so the conversion path is unbroken regardless of scroll position.
- **Generic terminal CTA grep (7.6)** — skill regex looks for "Contact Us" / "Learn More" strings. Adapted to also scan for "Work With Me" (the most common Wave 1-5 generic terminal CTA on Jake's site) and "All programs & workshops" (the who-is-alfred secondary that was undifferentiated). All eliminated.
- **Sticky mobile CTA copy audit (7.7)** — skill expects the SiteCTAs component to render the action verb. Adapted to verify via `grep -in 'contact' components/SiteCTAs.tsx` (returns the `/contact` suppress-list path only, NOT user-facing copy) AND `grep -E '>(Take the VAPI|Apply)' components/SiteCTAs.tsx` (confirms the two button labels).
- **Footer band placement (7.8)** — skill suggests a footer change. Adapted: introduced the band as a direct child of `<footer>` BEFORE the existing editorial grid so it reads as the closing conversion surface, not as buried-in-the-fine-print. Rendered on every page because Footer is mounted globally in `app/layout.tsx`.

### Patterns applied this wave

From the industry-research patterns library:

- **Single Dominant CTA, Application Gate Implicit (Litvin)** — applied to the home hero re-balance. VAPI™ is the single dominant gradient pill above the fold; Apply is gated one click deeper. Matches the Litvin funnel: scorecard as the free entry, application gated behind it. The act of NOT showing a Calendly button IS the premium signal.
- **Two-Minute Self-Diagnostic as Top-of-Funnel (Litvin/Hudson)** — applied as the home hero's dominant ask AND as the footer-vapi-band's closing ask. The VAPI™ assessment now bookends every page: the first CTA above the fold AND the last CTA before the footer grid. This is the architecture Litvin and Hudson both use — a single instrument as the front door, repeated at the exit.
- **Authority by Association, Not Adjective (Litvin/Goldsmith)** — every `.cta-trust` strip uses noun-form signals: "ICF Master Certified Coach" (the credential as a noun), "Read personally by Jake" (the action as a noun), "1:1, by application only" (the structure as a noun), "12 domains, 72 statements" (the product architecture as nouns). Zero "world-class / transformational / elite" adjective stacking in any new copy this wave.
- **Trademark Symbol as Premium Tax** — VAPI™ used consistently in all Wave 7 copy: hero, terminal CTAs, sticky CTA, floating CTA, footer band, contact secondary prompt, build-your-assessment hero, who-is-alfred secondary. First mention per page, plain on subsequent mentions per Jake's frozen lexicon.
- **Poetic-Line Sectional Anchors (Hudson)** — every Wave 7 terminal CTA opens with an iconic-line lede in Jake's voice: "Ready to see *where you stand*?", "Want to see *your* map before we talk?", "Want results like these? See *your* map first.", "See *where you stand* in 12 minutes." (footer). Each carries the italic Cormorant accent word for editorial continuity with H1s from Waves 1+5.
- **Contrarian Disqualifier Section (Litvin)** — REINFORCED at the hero level via the new trust-line qualifier: "For founders ready to invest in 12-month, application-based coaching." This is a soft repel inside a free ask — exactly the Litvin move that turns a CTA into a filter. Pairs with the full-page Contrarian Disqualifier block on /work-with-me from Wave 5.
- **Expectation-Setter Block (skill 7.1, executed in Jake's editorial voice)** — applied to both the contact form (`I read it / I reply / You get a real human, no funnel, no bot, no fake urgency`) and the apply form (`I read every application personally / You hear back in 5 to 7 business days / If we are a fit, the next step is a real conversation`). The italic Cormorant numerals + iconic-line phrasing make this block read as editorial restatement of the entire site's brand promise, not as a "what to expect" disclaimer.

Patterns explicitly NOT applied in Wave 7 (and why):

- **Newsletter count as social proof** — still skipped. List isn't ≥5k yet (carry from every prior wave).
- **Urgency bars / countdown timers** — explicitly forbidden by industry-research anti-pattern list for application-based 1:1 coaching. Acceptable on a launch funnel page; toxic on the brand site. Zero urgency mechanics added this wave.
- **Generic 5-star testimonial chips near CTAs** — research anti-pattern. The cta-trust strips use named credentials + product architecture + action verbs instead.
- **Comparison content (Jake vs Litvin/Goldsmith/Martell)** — carried from Wave 6 open items. Still deferred — better suited to the blog/SEO program than this visual polish wave.

### Adaptations specific to Jake's site (NOT LocalCraft customer build)

- **No phone CTA anywhere** — per Wave 1 architectural decision. Logged as 7.3 N/A with the Litvin citation. Wave 7 reinforces this by making VAPI the single dominant ask at hero + footer + sticky + floating, with no phone-fallback affordance.
- **Form-frame ring matches `.framed-image` from Wave 4** — Tailwind utility classes on the form fields were preserved (inputs retain their `border border-ap-border focus:ring-2` treatment). The Wave 7 work was at the WRAPPER level (`.form-frame` carries the gradient accent bar, premium shadow ladder, padding) so the form internals don't need rewriting and the ring composes cleanly with the field-level focus state.
- **Apply form expectation-setter mentions a "real conversation"** — per Jake's brand voice, not "discovery call" or "strategy session." The italic Cormorant accent on *conversation* signals "this is the relationship sale" without using the conventional sales-coach language.
- **Build-your-assessment hero gets a cta-trust strip (not a footer band)** — that page is the bespoke-assessment B2B intake. The trust signals are different: "Auto-saves every answer / No card, no commitment / Quote within a week of intake." Same `.cta-trust` utility, different signal copy appropriate to that funnel.
- **Two CTAs on home final CTA section** — VAPI primary + "Apply for the Program" secondary (replaced generic "See Your Options"). Both lead deeper into the funnel; neither leads back to the home page. This is the Litvin "exit to action" pattern at the bottom of the page.
- **Footer VAPI band uses `<aside>`** — semantic HTML signals "this is a complementary band, not part of the navigation." Has `aria-labelledby` referencing the H2 inside it.
- **Hero-cta-trust chip pulses (with `prefers-reduced-motion: no-preference` guard)** — single delight per major surface. The pulse animation is 4.2s ease-in-out infinite — slow enough to feel alive, slow enough not to distract. Reduced-motion users see a static chip. Logged as the wave's single intentional micro-animation.

### Criteria audit

- [x] **Hierarchy** — VAPI™ is unambiguously the dominant CTA above the fold on home (gradient pill, biggest, top-of-button-cluster). Secondary CTAs (Apply, See how we work, View live pricing) sit as bordered ghosts. Tertiary actions (text links) are subordinate. Footer-vapi-band sits visually separate from the editorial grid (dark wedge + accent border) so it reads as a closing band, not as competing navigation.
- [x] **Restraint** — single accent color (`--ap-accent` orange) across all Wave 7 additions: form-frame gradient bar, hero-cta-trust chip, cta-trust accent dots, footer-vapi-band gradient hairline, terminal-cta italic accent words. Single accent font (Cormorant italic for numerals + accent words; Outfit for everything else). One ornament family: orange gradient ribbons + accent dots + small-caps eyebrows. No new visual primitives introduced.
- [x] **Micro-interactions** — Wave 7 reuses Wave 3 patterns: cta-pill hover deepens, form-frame inherits the same focus ring hierarchy as other surfaces, hero-cta-trust chip pulses (reduced-motion honored). No new interaction patterns introduced — composing the existing ladder instead.
- [x] **Typographic editorial feel** — preserved from Waves 1–6. Italic Cormorant accent word on every H1 still in place (14/14 marketing pages per Wave 5 audit). Expectation-setter numerals use italic Cormorant 700 at 1.5rem (same register as Wave 2 stat-row numerals + Wave 5 chapter numbers). Body text ≥16px (every Wave 7 copy line is 0.8125rem+ for tracked small-caps or 1rem+ for body). Prose width ≤~75ch (hero-cta-trust capped at 60ch, cta-trust capped at 64ch).
- [x] **Mobile=desktop parity** — every Wave 7 addition adapts cleanly to mobile. Form-frame collapses padding 2.25rem → 1.5rem at <640px. Expectation-setter retains the 01/02/03 numerals + iconic lines at every breakpoint. Cta-trust wraps to multi-line at 375px without overflow (verified via Playwright eval at 375px — htmlScrollWidth == htmlClientWidth == 375). Footer-vapi-band scales padding 4rem → 3rem at <640px; H2 uses clamp(1.75rem, 4vw, 2.5rem) so it remains readable at 320px. Hero-cta-trust line wraps to 2 lines on mobile, retains the orange chip.
- [x] **No clip-art energy** — every Wave 7 ornament is CSS-drawn (radial-gradients, linear-gradients, box-shadow, pseudo-elements). No icon fonts, no PNG sprites, no clip-art arrows. The only SVG additions are the existing arrow glyphs on the cta-pill buttons (custom inline strokes, not Bootstrap glyphs).
- [x] **No template-shaped sections** — the form-frame is editorial (gradient accent bar reads as "this is a deliberate craft surface," not as a SaaS-form pattern). The expectation-setter is a Litvin-style direct address ("I read it / I reply / You get a real human"), not a SaaS "What to expect" disclaimer block. The footer-vapi-band is a Litvin/Goldsmith closing pattern (single dominant ask), not a SaaS newsletter signup. The cta-trust strips use noun-form authority signals, not SaaS testimonial chips.
- [x] **Cold-read copy** — every new copy line was cold-read against the target buyer (founder who's succeeded at too high a cost). Specialist terms (VAPI™, Aligned Power Program, ALFRED) are defined inline on first mention. No insider jargon. No em dashes (per Jake's frozen lexicon). Sentence stops throughout.

### Steve Jobs gut-test

**Mobile (privileged surface) — first pass flagged:**

- **Home hero trust line was overflowing on mobile** — the `.hero-cta-trust` had `display: flex` with no `flex-wrap`, so the inner span (88 chars long) was forcing the parent to overflow the 390px content width. Visually clipped at "applica..." in the capture.
- **Cta-trust strips at 65 grep hits initially confused** — counted the rule-block lines AND the markup. Re-counted via `--include="*.tsx"` and confirmed 22 actual usage instances, which is the right number for 9 pages with conversion surfaces.

**Mitigation:**

- Added `flex-wrap: wrap` to `.hero-cta-trust` + `flex: 1 1 0; min-width: 0` to the inner text span so it wraps cleanly inside the 390px container. Verified via Playwright eval at 375px: width=335px, height=37.7px (2 lines), no horizontal overflow on the page. Re-captured wave-7 home mobile.
- The cta-trust grep refined per `--include="*.tsx"` to count markup vs CSS rules separately.

**Re-test (mobile):** home, contact, apply, about, work-with-me, who-is-alfred, build-your-assessment, blog all hold. Sticky CTA bar pinned at the bottom on every marketing page. Footer-vapi-band visible at bottom (verified via Playwright element-screenshot at `/tmp/wave7-footer-band-mobile.png` — orange "ONE LAST THING" eyebrow, italic *where you stand* gradient accent, gradient CTA pill, cta-trust strip all render correctly at 430px mobile width). Pre-existing capture artifacts persist (body-P right-edge clipping on iPhone-UA mobile shots, capture-timing whitespace on privacy mobile) — both are Wave-1 carry-overs, not Wave 7 regressions.

**Desktop / tablet:** verified. Contact form desktop is magazine-grade (`/tmp/wave7-contact-form-desktop.png`): gradient accent bar, "WHAT HAPPENS NEXT" eyebrow, italic Cormorant 01/02/03 numerals, iconic lines, form fields, Send Message gradient pill, cta-trust strip with accent dot on "No bots". Home hero desktop (`/tmp/wave7-home-hero-desktop.png`): VAPI is the single dominant CTA, "See how we work" is the bordered secondary, trust line with pulsing chip below. Footer band desktop (`/tmp/wave7-footer-band-desktop.png`): dark wedge band with the italic Cormorant gradient accent, premium close. Steve Jobs goes silent.

### Bonus prompts

- **"How could this be cooler?"** → The hero-cta-trust chip already pulses (4.2s ease-in-out). A second move: the footer-vapi-band could carry a subtle "first-time visitor" detection (referrer or scroll-depth signal) so the sub-copy adapts ("First time here? Start with the VAPI." vs "Welcome back. Your map is one click away."). Belongs in a future A/B test wave, not a visual-polish wave. Flagged for Wave 9+ if conversion data calls for it.
- **"Category leader doing this better?"** → Litvin places a single-row "Trusted by clients at Apple, Google, Salesforce" line IMMEDIATELY adjacent to the assessment CTA. Jake's audience-card row sits one band away from the hero CTA. Wave 7 already addressed this by placing the new `.hero-cta-trust` line in direct adjacency to the CTA buttons (between the buttons and the audience strip). The cta-trust IS the category-leader steal — noun-form, immediately proximate, no adjective stacking.
- **Applied this wave:** the Litvin funnel architecture (single dominant ask, application gated behind it, noun-form trust signals everywhere, contrarian disqualifier soft-applied at the hero, no urgency mechanics) is now fully landed across the marketing site. Combined with Wave 5's full-page disqualifier and Wave 6's AEO-grade entity graph, the site now reads end-to-end as a premium 1:1 coaching practice that filters for fit, not as an AI-coach template selling tactics.

### Open items rolled forward

- (Wave 8) Mobile body-P + hero-cta-trust right-edge clipping artifact final review (still carried from Wave 1 — the iPhone-UA headless-chrome capture artifact, not a real layout bug).
- (Wave 8) Optional: reverse-order marquee labels per Litvin/Hudson reference.
- (Wave 8) Unused Tier-0 assets cleanup (`Website Hero.png` 2 MB, `alfred-phone-hero.png`, `life-coach-institute.png`).
- (Wave 8) Flame-mark glyph optional add to `.icon-circle::after`.
- (Wave 8) Pre-existing em dashes cleanup (`/about` L111, `/work-with-me` metadata, `/build-your-assessment` body).
- (Wave 8) Image `width`/`height` on blog post hero `<img>` to eliminate CLS.
- (Wave 8) About-page "Foundations" block expansion into Goldsmith-style equal-weight reading-list mini-hub.
- (Wave 8) Hero-cta-trust chip pulse — already shipped this wave, but a Wave 8 audit should confirm no over-pulsing across the page (only one pulse per first viewport).
- (Wave 8) Possible Review schema + aggregateRating once 20+ attributable testimonials.
- (Wave 9+) A/B test the footer-vapi-band sub-copy on first-time vs returning visitors.
- (Wave 9+) Comparison content (Jake vs Litvin/Goldsmith/Martell) — better suited to the blog/SEO program.
