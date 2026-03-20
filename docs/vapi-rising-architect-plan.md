# VAPI Rising Architect Archetype Expansion Plan

This document is the durable working context for the Rising Architect rollout across:

- Portal
- Marketing site
- Alfred app

The goal is to add the 9th archetype without changing unrelated VAPI behavior and to finish the work in waves without losing context.

## Status Snapshot

- Wave 1 completed:
  - mapped the current archetype scoring, content, icon, progress, results, dashboard, and email seams
  - identified and patched the duplicated portal and marketing archetype helpers
- Wave 2 completed:
  - results, dashboard, and progress UI updates for Rising Architect and the lagging-arena callout are in place
- Wave 3 completed:
  - email updates, copy-reference cleanup, and final verification are complete

## Non-Negotiables

- Do not change any existing archetype content except where Rising Architect is added.
- Do not change any driver logic, driver content, domain scoring, arena scoring, interpretations, priority matrix logic, or unrelated UI behavior.
- Zero em dashes in any new text.
- Rising Architect logic, icon, and copy must remain identical across Alfred, portal, and marketing.
- Shared data continues to flow through the existing `vapi_results.results` payload.

## Current Architecture Findings

### Shared archetype seams

- Alfred canonical scoring and archetype typing live in [scoring.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/scoring.ts).
- Alfred long-form archetype content lives in [archetypes-full.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/archetypes-full.ts).
- Alfred archetype icon mapping lives in [archetype-icons.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/archetype-icons.tsx).
- Alfred results serialization for shared data lives in [portal-format.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/portal-format.ts).
- Alfred read API lives in [route.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/api/vapi/route.ts).

### Browser duplication seams

- Portal archetype helper lives in [vapi-archetypes.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-archetypes.js).
- Marketing archetype helper lives in [vapi-archetypes.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-archetypes.js).
- Both quiz surfaces use those helpers to assign `results.archetype` client-side before save.

### UI seams

- Alfred results archetype section and progress interpretation live in [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx).
- Alfred dashboard archetype summary lives in [dashboard/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx).
- Portal results page uses `VAPI_ARCHETYPES` and `VAPI_ARCHETYPE` from [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html).
- Portal dashboard archetype summary and progress interpretation live in [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html).

### Progress and email seams

- Alfred generic tier transitions are in [progress-transitions.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/progress-transitions.ts), but archetype transition copy is composed inside [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx).
- Portal archetype transition copy is composed inline in [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html).
- Marketing completion email route is [route.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/vapi-assessment-complete/route.js).
- Portal completion email route is [vapi-assessment-complete.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js).

## Wave Plan

### Wave 1: Shared Rising Architect scoring, content, icon, and helper updates

Scope:

- Add Rising Architect to the Alfred archetype type union and scoring logic at Priority 2.
- Add Rising Architect content and accent color.
- Add Rising Architect icon support across Alfred and browser helpers.
- Update shared browser archetype helpers and any server-side archetype fallback determiners.
- Update any active 8-archetype references in VAPI landing/results copy to 9.

### Wave 2: Results, dashboard, and progress UI updates

Scope:

- Add the Rising Architect lagging-arena callout to results surfaces.
- Update Alfred and portal progress-over-time archetype narratives to handle Rising Architect transitions and maintained copy.
- Make sure dashboard surfaces render Rising Architect consistently.

### Wave 3: Email updates, cleanup, and verification

Scope:

- Add the Rising Architect lagging-arena line to user and admin emails.
- Sync the portal email route from the verified marketing route if the files remain aligned.
- Run app build, marketing build, portal parse checks, and diff hygiene checks.
- Record verification outcomes here.

## Resume Protocol

1. Re-open this file before each wave.
2. Update the status snapshot before touching new code.
3. Keep Alfred as the canonical source where possible.
4. Mirror browser and portal duplicates only after the canonical logic is verified.
5. Run only the checks relevant to the files changed in that wave, then close the wave in this file.

## Completion Summary

- Rising Architect is now the 9th archetype across Alfred, portal, and marketing.
- Priority 2 archetype scoring is implemented in the canonical Alfred scorer and mirrored in the browser and email fallback determiners.
- The new archetype content, icon, lagging-arena callout, progress-over-time handling, and email lines are in place across all required surfaces.
- Active VAPI copy references were updated from 8 archetypes to 9 where applicable.

## Final Verification

- `npm run build` passed in [aligned-ai-os](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os).
- `npm run build` passed in [jake-sebok-marketing-website](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website).
- `node --check` passed for:
  - [vapi-archetypes.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-archetypes.js)
  - [vapi-assessment-complete.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js)
  - [route.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/app/api/vapi-assessment-complete/route.js)
- Inline portal and results script parse checks passed for:
  - [dashboard.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/dashboard.html)
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html)
  - [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html)
- `git diff --check` passed.
- A final search found no remaining active `8 archetypes` or `8 Founder Archetypes` references in the targeted Alfred, portal, and marketing VAPI surfaces.
