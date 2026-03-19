# VAPI Layer 2 Driver System Plan

This document is the durable working context for the Layer 2 Driver rollout across:

- Portal
- Marketing site
- Alfred app

The goal is to complete the driver system in waves without losing context or accidentally changing unrelated VAPI behavior.

## Non-Negotiables

- Do not change any existing questions, weights, archetype rules, interpretations, priority matrix logic, reflection prompt logic, onboarding modal behavior, email trigger behavior, or existing visualizations except where the driver system must be inserted.
- Zero em dashes in any new content.
- Driver content must be identical across all platforms.
- All assessment data continues to live in the single shared `vapi_results` data layer.

## Current Architecture Findings

### Shared data layer

- All platforms already write to the shared Supabase `public.vapi_results` table.
- The canonical schema is in [schema.sql](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/supabase/schema.sql).
- Current columns are:
  - `id`
  - `email`
  - `first_name`
  - `last_name`
  - `results` (`jsonb`)
  - `created_at`
- A `source` column is added separately by [add-vapi-results-source.sql](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/supabase/add-vapi-results-source.sql).

### Shared read/write reality

- Alfred app reads and writes through [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts).
- Marketing site writes through [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/save-vapi-results/route.ts).
- Portal writes through [save-vapi-results.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/save-vapi-results.js).
- Marketing email trigger runs through [route.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/vapi-assessment-complete/route.js).
- Portal email trigger runs through [vapi-assessment-complete.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js).

### Important storage gap

- Portal and marketing quiz flows already persist `allResponses` inside the `results` JSON:
  - [vapi-quiz.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-quiz.html)
  - [vapi-quiz.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-quiz.html)
- Alfred app currently does not persist raw item responses in `results`; it only sends grouped `answers` to the server and stores derived scores + importance:
  - [page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/page.tsx)
  - [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts)
- Because the driver algorithm depends on reverse-scored item IDs like `RS6`, `EC6`, `PH6`, Alfred submissions must start storing normalized item-level responses in the shared `results` JSON.

### Existing scoring and serialization seams

- Alfred scoring/archetype logic lives in [scoring.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/scoring.ts).
- Alfred builds the portal-compatible `results` JSON in [portal-format.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/portal-format.ts).
- Portal and marketing results pages are static HTML + JS renderers:
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html)
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html)
  - shared interpretation registries are duplicated in:
    - [vapi-results-interpretations.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results-interpretations.js)
    - [vapi-results-interpretations.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results-interpretations.js)

### Dashboard/progress surfaces that must be updated

- Portal dashboard:
  - [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html)
  - [progress-transitions.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/progress-transitions.js)
- Alfred dashboard:
  - [dashboard/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx)
- Alfred results:
  - [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx)

## Decision: Where driver data should live

Driver data should be added to the shared `results` JSON for each assessment row, not as a platform-local cache.

Required fields inside `results`:

- `assignedDriver`
- `driverScores`
- `topDriverScore`

Recommended supporting fields inside `results`:

- `driverMetaVersion`
- `allResponses` normalized as reverse-coded scores by item ID

This keeps driver data readable on every platform through the existing shared payload model.

## Wave Plan

### Wave 1: Shared driver model and persistence

Scope:

- Build the driver registry with exact text and metadata.
- Build the driver scoring engine:
  - all 8 drivers scored in parallel
  - threshold 8
  - exact tie-break order
  - business vs self importance average comparison
  - importance standard deviation
  - reverse-coded item checks
- Normalize Alfred raw answers into item-level response maps.
- Enrich every new assessment write with:
  - `assignedDriver`
  - `driverScores`
  - `topDriverScore`
  - normalized response map
- Ensure marketing, portal, and app inserts all persist identical driver fields.
- Update read mapping in Alfred so driver fields are available to the UI.

Primary files:

- [scoring.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/scoring.ts)
- [portal-format.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/portal-format.ts)
- [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts)
- [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/save-vapi-results/route.ts)
- [save-vapi-results.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/save-vapi-results.js)

Wave 1 verification:

- Driver fields exist on new rows from all three submission sources.
- Alfred app submissions now persist item-level responses.
- No archetype or score regressions.

### Wave 2: Driver content display on results pages and dashboards

Scope:

- Add driver section after archetype and before arena scores on:
  - portal results
  - marketing results
  - Alfred results
- Add dashboard summary under archetype on:
  - portal dashboard
  - Alfred dashboard
- Add fallback rendering when no driver meets threshold.
- Add "View Full Details" links into the driver section anchor.

Primary files:

- [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html)
- [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html)
- [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html)
- [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx)
- [dashboard/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx)

Wave 2 verification:

- Section order is correct on all three results surfaces.
- Dashboard summary is present on portal and Alfred.
- Driver content text is identical across platforms.

Wave 2 implementation status:

- Completed on March 19, 2026.
- Alfred results now render the full driver section in [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx).
- Alfred dashboard now shows the driver summary under the archetype in [dashboard/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx).
- Alfred read mapping now computes missing legacy driver fields on read in [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts).
- Portal and marketing results now use the shared browser helper in:
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js)
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-drivers.js)
- Portal results and marketing results now render the full driver section in:
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html)
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html)
- Portal dashboard now shows the driver summary and deep link behavior in [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html).

### Wave 3: Progress-over-time and email updates

Scope:

- Add driver transition block beneath archetype transition in progress views.
- Add maintained, changed, newly identified, and lost-driver interpretations.
- Update user/admin completion emails to include driver content.
- Add previous-driver comparison in admin email.

Primary files:

- [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html)
- [progress-transitions.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/progress-transitions.js)
- [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx)
- [route.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/vapi-assessment-complete/route.js)
- [vapi-assessment-complete.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js)

Wave 3 verification:

- Driver transition appears only when prior assessments exist.
- Email payloads include driver content and sorted driver scores.
- Previous/current driver comparisons are correct.

Wave 3 implementation status:

- Completed on March 19, 2026.
- Alfred progress-over-time now renders the ordered interpretation stack in [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx):
  - composite transition
  - archetype transition
  - driver transition
  - selected arena or domain transition
- Portal dashboard progress-over-time now renders the same ordered interpretation stack in [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html).
- Shared browser driver helper now includes driver transition summaries in:
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js)
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-drivers.js)
- Completion email payloads now include `allResponses` and `responseCodingVersion` in:
  - [vapi-quiz.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-quiz.html)
  - [vapi-quiz.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-quiz.html)
- Marketing and portal completion emails now include:
  - user-facing driver name and core belief
  - admin-facing driver summary, sorted driver score breakdown, and previous-driver comparison
  in:
  - [route.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/vapi-assessment-complete/route.js)
  - [vapi-assessment-complete.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js)

## Implementation Notes For Future Waves

- The driver registry should be authored once per deployable runtime, then copied carefully where static deployables require duplication.
- Prefer computing driver data server-side at save time instead of client-side to keep write behavior consistent.
- For legacy rows missing driver fields but containing `allResponses`, consider opportunistic backfill on read or an explicit backfill script.
- For legacy Alfred rows without raw item responses, perfect backfill may not be possible. Handle this explicitly instead of silently fabricating signal conditions.
- The one-time admin backfill route now lives at [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/admin/vapi/backfill-drivers/route.ts).
- The non-technical runbook for the backfill and QA pass lives at [vapi-driver-backfill-and-qa-checklist.md](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/docs/vapi-driver-backfill-and-qa-checklist.md).

## Resume Protocol

At the start of each new wave:

1. Re-open this file.
2. Confirm which wave is active.
3. Update this document with any new findings before branching into more code.
4. Run only the verifications relevant to the wave that was changed.
5. Do not mark the project complete until every checklist item in the request has a concrete implementation path or verified completion.
