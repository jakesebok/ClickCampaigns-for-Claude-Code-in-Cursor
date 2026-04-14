# Build Your Assessment — project plan (waves)

**Goal:** Ship an immersive, multi-step intake (“assessment-style”) on `jakesebok.com` for prospects who want a custom assessment + portal stack, with Supabase persistence, Resend summaries (user + admin), a lightweight results/summary view, and an inline interactive 6C demo.

**URLs**

- Landing: `/build-your-assessment`
- Intake: `/build-your-assessment/intake`
- Thank-you / summary: `/build-your-assessment/complete`

**Distribution:** share `/build-your-assessment` directly (no site footer link; optional later).

**Stack:** Next.js App Router (existing site), Tailwind, Resend (same env pattern as VAPI), Supabase service role (same project as marketing/VAPI).

---

## Wave 0 — Context (this document)

- Scope locked; waves below are execution order.
- After each wave, re-read this file + touched files before continuing.

## Wave 1 — Database

- Add SQL migration: `build_assessment_intake_submissions` (`id`, `created_at`, `email`, `full_name`, `payload` jsonb).
- Service-role inserts only from API (no anon policy). Document run instruction in migration comment.

## Wave 2 — API

- `POST /api/build-assessment-intake`: validate payload, insert row, send Resend (user confirmation + admin summary), return `{ ok, id }`.
- Reuse `RESEND_API_KEY`, `VAPI_USER_FROM_EMAIL` / `VAPI_ADMIN_FROM_EMAIL` or parallel `BUILD_INTAKE_*` fallbacks.

## Wave 3 — Landing + footer

- Minimal landing page (VAPI landing tone, not copy-paste).
- Footer link only entry from site chrome.

## Wave 4 — Intake wizard shell

- Client wizard: one question per view, progress bar, VAPI-like motion (CSS transitions).
- State: single TS payload object, persisted to `sessionStorage` for refresh resilience (optional).

## Wave 5 — All steps (content)

- Proprietary system gate, audience/job multi-select + attribution tags, construct tree builder, length/scale education, optional modules, scoring notes, matrix/pattern education, outputs, voice slider, author/depth, libraries, conditional plans, portal/auth copy, coach extras, longitudinal copy, brand, legal URLs, integrations, rush.
- Final: name + email + submit.

## Wave 6 — 6C demo (inline modal)

- Truncated scorecard: 2 items per C → average to 0–100 per `clarity|coherence|capacity|confidence|courage|connection`.
- Vital Action field; result panel mirrors portal 6C card grid + Vital Action block.
- Copy: email + dashboard placement (educational). `sessionStorage` for demo result only.

## Wave 7 — Complete page + emails polish

- `/build-your-assessment/complete` reads `sessionStorage` summary; fallback if missing.
- HTML email templates readable; admin gets full JSON summary.

## Wave 8 — QA

- `npm run build`, lint, fix issues.
- Update `DEPLOYMENT-BEGINNER-GUIDE.md` env line if new vars (optional).

---

**Owner note:** Site root layout keeps global `Header`/`Footer`; intake uses full-width sections and strong visual hierarchy so it still feels “immersive.”

---

## Completion log

**2026-04-14:** Waves 1–8 implemented in `jake-sebok-marketing-website`: landing (`/build-your-assessment`), wizard (`/build-your-assessment/intake`), complete (`/build-your-assessment/complete`), API `POST /api/build-assessment-intake`, Supabase migration file `supabase/migrations/20260214120000_build_assessment_intake_submissions.sql`, inline 6C demo modal.

**Before production:** Run the SQL migration in the Supabase SQL editor for the Jake project so inserts succeed.
