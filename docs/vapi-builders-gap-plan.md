# VAPI Builder's Gap and Enhanced Fallback Expansion Plan

This document is the durable working context for the next Layer 2 Driver expansion across:

- Portal
- Marketing site
- Alfred app

The goal is to finish this rollout in waves without losing context or changing unrelated VAPI behavior.

## Status Snapshot

- Wave 1 completed:
  - mapped the current 8-driver + secondary-driver implementation
  - added Builder's Gap scoring, content, icon, fallback typing, and shared payload support
- Wave 2 completed:
  - updated Alfred, portal, and marketing driver UI surfaces for Builder's Gap and dual fallback rendering
  - updated Driver Library content and 9-driver references across all platforms
- Wave 3 completed:
  - propagated Builder's Gap and enhanced fallback behavior into progress/email flows
  - synced portal and marketing completion-email routes
  - passed final build and syntax verification

## Non-Negotiables

- Do not change any existing questions, weights, domain scoring, arena scoring, composite scoring, archetype logic, interpretations, priority matrix logic, reflection prompt logic, onboarding behavior, or unrelated UI behavior.
- Zero em dashes in any new text.
- Existing 8-driver content stays unchanged except where the new fallback system references the shared driver library and where Builder's Gap is added as the 9th driver.
- All platforms continue reading and writing from the shared `vapi_results.results` payload.
- Builder's Gap text and enhanced fallback text must remain identical across Alfred, portal, and marketing.

## Current Architecture Findings

### Shared scoring seams

- Alfred canonical driver model and scoring live in [drivers.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/drivers.ts).
- Alfred serializes shared `results` JSON in [portal-format.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/portal-format.ts).
- Alfred read/write API lives in [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts).
- Marketing scoring duplication lives in [vapi-driver-scoring.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/lib/vapi-driver-scoring.ts).
- Portal scoring duplication lives in [vapi-driver-scoring.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/_lib/vapi-driver-scoring.js).
- Portal and marketing browser-side rendering/fallback logic live in:
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js)
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-drivers.js)

### Shared content seams

- Alfred long-form driver-library content lives in [driver-library.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/driver-library.ts).
- Alfred driver progress copy lives in [driver-progress.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/driver-progress.ts).
- Alfred inline SVG driver icon registry lives in [driver-icons.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/driver-icons.tsx).
- Portal and marketing duplicate the icon/content registries in:
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js)
  - [vapi-driver-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-driver-library.js)
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-drivers.js)
  - [vapi-driver-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-driver-library.js)

### UI seams

- Alfred results page driver section is rendered inside [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx).
- Alfred dashboard driver summary is in [dashboard/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx).
- Alfred driver library route is [page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/drivers/page.tsx).
- Portal results page delegates driver section rendering to `VAPI_DRIVERS.buildResultsSection(...)` from [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html).
- Portal dashboard driver summary and progress section live in [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html).
- Portal driver library page is [driver-library.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/driver-library.html).
- Marketing results/library surfaces live in:
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html)
  - [vapi-driver-library.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-driver-library.html)

### Email seams

- Marketing completion email route is [route.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/vapi-assessment-complete/route.js).
- Portal completion email route is [vapi-assessment-complete.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js).

## Wave Plan

### Wave 1: Builder's Gap algorithm, content, icon, and library data

Scope:

- Add Builder's Gap as the 9th driver in all scorers.
- Extend tie-break priority to 9 drivers.
- Add Builder's Gap content and icon registry entries.
- Add enhanced fallback scenario typing and shared fallback content.
- Persist any new shared fields needed for display consistency.
- Add Builder's Gap library content and update all "8" references to "9".

Primary files:

- [drivers.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/drivers.ts)
- [driver-icons.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/driver-icons.tsx)
- [driver-library.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/driver-library.ts)
- [driver-progress.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/driver-progress.ts)
- [portal-format.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/portal-format.ts)
- [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts)
- [vapi-driver-scoring.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/lib/vapi-driver-scoring.ts)
- [vapi-driver-scoring.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/_lib/vapi-driver-scoring.js)
- [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js)
- [vapi-driver-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-driver-library.js)

Wave 1 verification:

- Builder's Gap scores and gates are present everywhere.
- All driver score/gate maps now have 9 entries.
- Enhanced fallback type is derivable everywhere without changing non-driver scoring.
- Driver library metadata now references 9 driver patterns.

### Wave 2: Results, dashboard, and driver-library UI updates

Scope:

- Let Builder's Gap render as primary or secondary on results and dashboard surfaces.
- Replace the single fallback render path with the two scenario-specific fallback messages.
- Add Driver Library link only to standard fallback, not high performer fallback.
- Add Builder's Gap to Alfred, portal, and marketing Driver Library navigation and sections.

Primary files:

- [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx)
- [dashboard/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx)
- [page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/drivers/page.tsx)
- [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html)
- [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html)
- [driver-library.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/driver-library.html)
- [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html)
- [vapi-driver-library.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-driver-library.html)

Wave 2 verification:

- Builder's Gap is available in all 3 results surfaces and both dashboard surfaces.
- High performer fallback and standard fallback render correctly.
- Only standard fallback exposes the Driver Library link.
- All "8 drivers" references become "9 drivers" on every surface.

### Wave 3: Progress-over-time, email updates, and final sync

Scope:

- Add maintained Builder's Gap interpretation.
- Ensure transitions to/from Builder's Gap work on Alfred and portal progress views.
- Update user/admin completion emails for Builder's Gap and fallback type.
- Verify marketing gate text still works with the new "9 driver patterns" language.
- Re-run builds and syntax checks, then record outcomes here.

Primary files:

- [driver-progress.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/driver-progress.ts)
- [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx)
- [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html)
- [route.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/vapi-assessment-complete/route.js)
- [vapi-assessment-complete.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js)

Wave 3 verification:

- Maintained Builder's Gap copy shows correctly.
- User/admin emails support 9-driver score lists and fallback type.
- Portal and marketing assets remain in sync after duplication.

## Final Verification Outcomes

- `npm run build` passed in [aligned-ai-os](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os)
- `npm run build` passed in [jake-sebok-marketing-website](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website)
- `node --check` passed for:
  - [vapi-driver-scoring.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/_lib/vapi-driver-scoring.js)
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js)
  - [vapi-driver-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-driver-library.js)
  - [vapi-assessment-complete.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js)
- `git diff --check` passed
- Final Alfred build surfaced one TypeScript narrowing issue in [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts), which was fixed by normalizing stored driver-name strings before deriving fallback metadata

## Resume Protocol

At the start of each new wave:

1. Re-open this file.
2. Confirm the active wave.
3. Update the findings and implementation status before touching more code.
4. Run only the checks relevant to the files changed in that wave.
5. Keep all cross-platform text and logic synchronized before closing the wave.
