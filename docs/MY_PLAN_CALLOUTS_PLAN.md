# My Plan Introduction Callouts

Bridge assessment results to **My Plan**: users learn that a personalized 30-day action plan exists and how to open it (portal account or in-app).

---

## Section A: Task Overview

### Placements

| Placement | Portal | Alfred |
|-----------|--------|--------|
| Large callout (bottom of results, before footer/journey) | `vapi-results.html` | `assessment/results/page.tsx` |
| Inline after Archetype | `buildArchetypeSection` in `vapi-results.html` | `ArchetypeSection` in `page.tsx` |
| Inline after Driver | `vapi-drivers.js` (non–Aligned Momentum only) | `DriverSection` in `page.tsx` |
| Dashboard reminder (dismissible, until My Plan viewed) | `dashboard.html` + `my-plan.html` localStorage | `dashboard/page.tsx` + `my-plan/page.tsx` localStorage |

### Authentication

- **Portal results (`vapi-results.html`):** Supabase session via existing `applyPortalCtaVisibility` pattern. Guests see “Create free account” with `?redirect=/my-plan`. Logged-in users see “View My Plan” → `/my-plan`.
- **Alfred in-app results:** User is authenticated; CTAs always point to `/my-plan`.
- **Signup/login:** `/my-plan` added to allowed `redirect` targets.

### Files touched

- `docs/MY_PLAN_CALLOUTS_PLAN.md` (this file)
- `campaigns/aligned-power-vapi/output-assets/html/vapi-results.html`
- `campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js`
- `campaigns/aligned-power-vapi/output-assets/portal/signup.html`
- `campaigns/aligned-power-vapi/output-assets/portal/login.html`
- `campaigns/aligned-power-vapi/output-assets/portal/dashboard.html`
- `campaigns/aligned-power-vapi/output-assets/portal/my-plan.html`
- `campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html` (portal absolute URLs)
- `campaigns/jake-sebok-marketing-website/public/vapi/vapi-drivers.js`
- `campaigns/aligned-ai-os/components/my-plan-callouts.tsx`
- `campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx`
- `campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx`
- `campaigns/aligned-ai-os/app/(dashboard)/my-plan/page.tsx`

---

## Section B: Work Waves

Wave 1: Audit — completed (results: portal `vapi-results.html`, Alfred `page.tsx`; archetype/driver sections identified; dashboard patterns documented).

Waves 2–8: see verification checklist below; implementation completed in-repo. **Manual QA** still required for full flows (guest signup → My Plan, mobile, email confirmation path).

---

## Section C: Current State Tracker

```
Current Wave: 8 (verification)
Last Completed Task: Integrated callouts + localStorage flags + redirect allowlist
Next Task: Manual QA on staging/production
Blockers: None
Files Modified This Wave: See Section A
```

---

## Section D: Files (audit)

Listed in Section A.

---

## localStorage keys

| Key | Where set | Purpose |
|-----|-----------|---------|
| `portal_hasViewedMyPlan` | Portal `my-plan.html` after plan loads | Hide portal dashboard reminder |
| `portal_dismissedMyPlanReminder` | Portal dashboard dismiss button | Hide reminder |
| `alfred_hasViewedMyPlan` | Alfred `my-plan/page.tsx` on mount | Hide Alfred reminder |
| `alfred_dismissedMyPlanReminder` | Alfred reminder dismiss | Hide reminder |

---

## Copy rules

- No em dashes in user-facing strings (use commas or hyphens).
- Inline callouts: 2–3 short sentences.

---

*End of plan.*
