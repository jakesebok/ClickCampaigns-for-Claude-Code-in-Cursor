# Who is ALFRED — page work context & continuation plan

**Purpose:** Single handoff doc for multi-wave updates to `/who-is-alfred` without requiring the stakeholder at every step.

**Rule for the implementer:** After completing each wave below, re-open this file, mark the wave done, skim the whole page in the browser (mobile + desktop), and fix any regressions before moving on. Continue until all waves are complete unless blocked by a missing asset.

---

## Wave 1 — Copy & voice (done when shipped)

- [x] Hero: accountability + priorities (not proprietary headline overfit to VAPI™).
- [x] Subhero: Jake-built-for-himself story; PDFs vs “alive”; no “only app I sell”; no “when you have it.”
- [x] Section rename: “Not just another AI coach” (or equivalent); strip AI-slop; **no em dashes** in body copy; bold used rarely; rare emphasis via `text-gradient-accent` like the homepage hero.
- [x] “Who’s in the room” reframe + light Alfred/Batman wink (tasteful, not campy).
- [x] Card/intelligence copy: VAPI weighted to *their* stated importance + reflections; 6Cs in plain English; split former “AIOS” into benefit cards (desires, values, why/world, becoming, weekly moves, Vital Action).
- [x] Daily/week + comparison + pricing + who/for: same voice rules; remove em dashes; lighten bold.
- [x] Metadata (title/description/OG) aligned with new hero promise.

**Re-review checklist after Wave 1**

- [x] Read page aloud; remove anything that sounds like generic LLM cadence.
- [x] Grep page source for `—` (em dash) and fix.
- [x] Count `<strong>`; should be minimal.

---

## Wave 2 — Brand system note (done when shipped)

- [x] Add “body emphasis” rule to brand lexicon (gradient accent, sparse use; no bold walls).

**Re-review:** KB/lexicon reads clearly next to existing frozen terms.

---

## Wave 3 — Feature explorer (Apple-style exploration) (done when shipped)

- [x] Client component: centered device frame, faux dashboard UI (CSS) until a real screenshot exists.
- [x] Auto-tour with pause, prev/next, progress dots; respects `prefers-reduced-motion`.
- [x] Hotspots / focus regions sync to tour steps; optional hover affordance on desktop.
- [x] Copy for each step is benefit-led and matches Wave 1 strategy.

**Optional asset (not blocking):** Drop `public/images/alfred/dashboard-phone.png` (9:19-ish) and wire `next/image` inside the frame behind hotspots if you want a photo-real device. Until then, the CSS mock is the source of truth.

**Re-review checklist after Wave 3**

- [x] Keyboard: focus states on controls.
- [x] Mobile: tap targets, no horizontal scroll.
- [x] Reduced motion: no auto-advance.

---

## Wave 4 — Final QA

- [x] `npm run build` for marketing site.
- [ ] Lighthouse sanity (no CLS from explorer).
- [x] Update this doc’s checkboxes to reflect reality.

---

*Last updated: Waves 1–3 shipped; Wave 4 build done; optional Lighthouse + phone screenshot still open.*
