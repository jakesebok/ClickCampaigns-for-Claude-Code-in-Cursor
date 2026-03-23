# Unified Sprint Display Across Platforms

**Goal:** Users see the full 28-day My Plan on **both** the Aligned Performance Portal and ALFRED, regardless of `primary_surface`. Alfred-exclusive **features** (check-ins, Coach, push) remain the conversion lever—not withholding plan data.

**Related data:** Single `sprints` table; APIs already return the active sprint for the authenticated user without surface gating.

---

## Section A: Task Overview

### Summary of changes

- Removed UI branches that hid the full plan when `primary_surface` did not match the current app.
- Portal Dashboard: always show the main My Plan card when a sprint exists; add progress line; self-service users see an Alfred **feature** CTA (not “your plan is only in Alfred”).
- Portal My Plan: always render full plan; removed “wrong surface” redirect; self-service users see an Alfred trial / feature CTA block.
- Alfred My Plan: always render full plan; removed “open portal for your plan” gate; optional desktop link to portal when `primary_surface === portal` (same data, not a gate).
- Alfred Dashboard: fetch `/api/sprint/me` and show a sprint summary card + progress + link to `/my-plan` when a sprint exists (any surface).
- Copy updates: CTAs emphasize daily check-ins, accountability, and coaching—not where data lives.
- Documentation: `primary_surface` described as analytics / origin metadata, not a display lock.

### Files modified (implementation)

| Area | File |
|------|------|
| Portal Dashboard | `campaigns/aligned-power-vapi/output-assets/portal/dashboard.html` |
| Portal My Plan | `campaigns/aligned-power-vapi/output-assets/portal/my-plan.html` |
| Alfred Dashboard | `campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx` |
| Alfred My Plan | `campaigns/aligned-ai-os/app/(dashboard)/my-plan/page.tsx` |
| API comment | `campaigns/aligned-power-vapi/output-assets/lib/portal-server/handlers/sprint-get-me.js` |
| Schema comments | `campaigns/aligned-power-vapi/output-assets/supabase/sprints.sql` |

### Integration points

- **Portal:** `GET /api/sprint-get-me` (Bearer) → active sprint row.
- **Alfred:** `GET /api/sprint/me` → same logical row via Supabase.
- **Patches:** Portal `PATCH /api/sprint-patch-me`, Alfred `PATCH /api/sprint/patch` (unchanged; still merge task + reflection updates).

---

## Section B: Work Waves

### Wave 1: Audit Current Logic

- [x] Identify all locations where `primary_surface` controls display  
  - **Found:** `portal/dashboard.html` (card vs alfred-only card), `portal/my-plan.html` (wrong-surface redirect), `app/(dashboard)/my-plan/page.tsx` (portal redirect). Coach UI still **labels** surface for coaches only (`coach.html`)—intentionally kept.
- [x] Document Portal My Plan conditional — **was:** block full UI if `alfred`.
- [x] Document Portal Dashboard — **was:** portal card vs `my-plan-alfred-card`.
- [x] Document Alfred My Plan — **was:** portal redirect.
- [x] Document Alfred Dashboard — **was:** no sprint card (added unified card).
- [x] List files to modify — see Section D.

### Wave 2: Portal Changes

- [x] Dashboard: full sprint card for any active sprint + progress + self-service Alfred CTA.
- [x] My Plan: full UI regardless of `primary_surface`.
- [x] Remove “track in Alfred” / “plan is in Alfred” **gate** messaging; replace with feature-focused CTAs.
- [x] Self-service: Alfred CTAs visible; active clients: `portal_active_clients` hides trial-style blocks on My Plan and main Alfred CTA banner on dashboard (existing `isActiveClient` / `isNonClient` behavior preserved).

### Wave 3: Alfred Changes

- [x] Dashboard: sprint card + progress + `/my-plan` link for any active sprint.
- [x] My Plan: full UI for all surfaces; footer explains ALFRED engagement; optional Portal link when sprint originated on portal (desktop convenience).
- [x] Exclusive features unchanged (Coach, check-ins, notifications—other routes).

### Wave 4: CTA Updates

- [x] Portal dashboard “Continue your journey” / ALFRED band copy updated to features-not-data-hiding.
- [x] Primary CTA label aligned to trial: “Start 7-day free trial” (self-service only; clients still hide whole band).
- [x] My Plan page: long-form “turn plan into follow-through” + trial CTA (self-service only).

### Wave 5: Edge Cases + Verification

Manual QA recommended:

- [ ] Portal + Alfred-origin sprint: full plan both places; tasks/reflections sync.
- [ ] Alfred + Portal-origin sprint: same.
- [ ] Retake on other platform: new sprint replaces old; both apps show new plan.
- [ ] Active client: no Alfred trial CTAs on portal; coach notes still show.
- [ ] Self-service: sees Alfred CTAs on portal My Plan + dashboard card strip.

---

## Section C: Current State Tracker

```
Current Wave: 5 (verification — manual)
Last Completed Task: Code + copy updates for unified display + plan doc
Next Task: Run cross-platform QA checklist (Section B Wave 5)
Blockers: None
Files Modified This Wave: See Section A table
```

---

## Section D: Files to Modify (audit list)

**Display / UX**

1. `campaigns/aligned-power-vapi/output-assets/portal/dashboard.html`
2. `campaigns/aligned-power-vapi/output-assets/portal/my-plan.html`
3. `campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx`
4. `campaigns/aligned-ai-os/app/(dashboard)/my-plan/page.tsx`

**Docs / comments (non-runtime behavior)**

5. `campaigns/aligned-power-vapi/output-assets/lib/portal-server/handlers/sprint-get-me.js`
6. `campaigns/aligned-power-vapi/output-assets/supabase/sprints.sql`

**Explicitly not changed (still valid uses of `primary_surface`)**

- `campaigns/aligned-power-vapi/output-assets/portal/coach.html` — coach-facing label “ALFRED vs Portal” for where the client took VAPI.
- Sprint creation / upsert logic that **sets** `primary_surface` on new rows.

---

## Expected outcome matrix

| Scenario | Portal | Alfred |
|----------|--------|--------|
| Assessment on Portal | Full plan ✓ | Full plan ✓ |
| Assessment on Alfred | Full plan ✓ | Full plan ✓ |
| Self-service | Plan + Alfred feature CTAs | Plan + exclusive features |
| Active client | Plan + coach context; no trial CTAs | Plan + coach + exclusive features |

---

*Unified Sprint Display Protocol — implemented in-repo; complete Wave 5 in staging/production with real accounts.*
