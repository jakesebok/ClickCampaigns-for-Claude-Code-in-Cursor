# VAPI Secondary Driver, Driver Library, and Icon Expansion Plan

This document is the durable working context for the next Layer 2 Driver expansion across:

- Portal
- Marketing site
- Alfred app

The goal is to finish this rollout in waves without losing context or changing unrelated VAPI behavior.

## Status Snapshot

- Wave 1 completed:
  - secondary-driver logic and storage
  - Imposter Loop refinement
  - results-page secondary driver UI
  - driver icon registry
- Wave 2 completed:
  - Alfred `/drivers`
  - portal `/portal/driver-library`
  - marketing `/assessment/drivers`
  - shared long-form driver library content across all 8 drivers
- Wave 3 completed:
  - marketing auth interstitial for Driver Library access
  - portal auth redirects for Driver Library
  - progress-over-time secondary driver messaging
  - user/admin email updates for primary + secondary drivers

## Non-Negotiables

- Do not change any questions, domain scoring, arena scoring, composite scoring, archetype logic, interpretations, priority matrix logic, reflection prompt logic, onboarding behavior, or unrelated UI behavior.
- Zero em dashes in any new text.
- Existing driver content remains unchanged except for the Imposter Loop `description` and `mechanism` fields.
- All platforms continue reading and writing from the shared `vapi_results.results` payload.
- New driver-library content must remain text-identical across Alfred, portal, and marketing.

## Current Architecture Findings

### Shared driver scoring seams

- Alfred canonical driver model and scoring live in [drivers.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/drivers.ts).
- Alfred serializes shared `results` JSON in [portal-format.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/portal-format.ts).
- Alfred read/write API lives in [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts).
- Marketing scoring duplication lives in [vapi-driver-scoring.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/lib/vapi-driver-scoring.ts).
- Portal scoring duplication lives in [vapi-driver-scoring.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/_lib/vapi-driver-scoring.js).
- Portal and marketing browser-side driver rendering and fallback scoring live in:
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js)
  - [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-drivers.js)

### Current driver UI seams

- Alfred results page driver section is rendered inside [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx).
- Portal and marketing results pages delegate driver section rendering to `VAPI_DRIVERS.buildResultsSection(...)` from:
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html)
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html)
- Portal dashboard driver summary is assembled in [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html).
- Alfred dashboard driver summary is in [dashboard/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx).

### Current icon state

- Archetype icons in Alfred currently come from Lucide in [archetype-icons.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/archetype-icons.ts).
- Portal and marketing archetype icons are browser-rendered in:
  - [vapi-archetypes.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-archetypes.js)
  - [vapi-archetypes.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-archetypes.js)
- There is no existing driver icon registry yet.

### Current library page state

- There is no existing driver-library page or route in any surface.
- Search confirmed there are no current `/portal/driver-library`, `/assessment/drivers`, or Alfred `/drivers` routes.

## Wave Plan

### Wave 1: Secondary driver logic, Imposter refinement, results-page secondary UI, driver icons

Scope:

- Extend the driver evaluator to assign:
  - primary driver
  - secondary driver
  - primary-to-secondary margin
- Persist new metadata in `results`:
  - `secondaryDriver`
  - `secondaryDriverScore`
  - `primaryToSecondaryMargin`
- Keep existing storage fields intact.
- Refine only the Imposter Loop gate, signals, `description`, `mechanism`, and max signal score.
- Build a shared driver icon system:
  - Alfred React icon components
  - portal/marketing inline SVG helpers
  - PNG assets for later email usage
- Update results pages:
  - keep primary driver section where it is
  - add compact secondary section when eligible
  - add library link to primary and secondary driver sections

Primary files:

- [drivers.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/drivers.ts)
- [portal-format.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/portal-format.ts)
- [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts)
- [vapi-driver-scoring.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/lib/vapi-driver-scoring.ts)
- [vapi-driver-scoring.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/_lib/vapi-driver-scoring.js)
- [vapi-drivers.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js)
- [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx)
- [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html)
- [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html)

Wave 1 verification:

- Secondary driver only exists when primary exists.
- Secondary respects threshold, gate pass, and within-3 margin.
- Imposter Loop logic matches revised spec.
- Results page primary UI remains intact.
- Secondary section appears only when present.
- Driver icons render correctly on Alfred, portal, and marketing results pages.

### Wave 2: Driver Library pages and shared content

Scope:

- Build a shared driver library content registry with:
  - how to know this is you
  - how to know this is not you
  - reflection prompts
  - relationship to other drivers
- Create routes/pages:
  - Alfred `/drivers`
  - portal `/portal/driver-library`
  - marketing `/assessment/drivers`
- Add sticky sidebar / mobile tabs, personalization banner, section highlights, and CTA footer.
- Ensure authenticated/no-results behavior is handled correctly on Alfred and portal.

Primary files:

- new Alfred route under `campaigns/aligned-ai-os/app`
- new portal page under `campaigns/aligned-power-vapi/output-assets/portal`
- new marketing page under `campaigns/jake-sebok-marketing-website`
- shared content registries under Alfred `lib/vapi` plus duplicated browser helpers where needed

Wave 2 verification:

- All 8 sections render in the specified order.
- Primary and secondary highlights work when results exist.
- No-results banner appears correctly.
- Content is text-identical across all platforms.

### Wave 3: Marketing gating, progress updates, email updates, final verification

Scope:

- Add marketing interstitial gating for the driver library.
- Add driver-library links with correct auth behavior from results and progress sections.
- Extend progress-over-time to include primary/secondary display and secondary transition notes.
- Update user/admin emails for primary + secondary driver reporting and gate status lines.
- Use generated PNG driver icons for email contexts if needed by the existing email rendering approach.

Primary files:

- marketing results and auth flows
- Alfred results progress area
- portal dashboard progress area
- marketing completion email route
- portal completion email route

Wave 3 verification:

- Marketing unauthenticated clicks show the library modal instead of opening the page.
- Progress section displays primary and secondary correctly.
- Emails show both drivers, margin, scores, and gate status.
- Final checklist items all map to implemented behavior.

## Resume Protocol

At the start of each new wave:

1. Re-open this file.
2. Confirm the active wave.
3. Update the findings and implementation status before touching more code.
4. Run only the checks relevant to the files changed in that wave.
5. Keep all cross-platform text and logic synchronized before closing the wave.
