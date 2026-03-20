# VAPI Founder Archetype Library Plan

This document is the durable working context for the Founder Archetype Library rollout across:

- Alfred app
- Portal
- Marketing site

The goal is to add the new Archetype Library in waves without losing context and without changing unrelated VAPI behavior.

## Status Snapshot

- Wave 1 completed:
  - mapped the current archetype, results, library, gating, and navigation seams
  - added the canonical archetype-library content layer in Alfred
- Wave 2 completed:
  - shipped Alfred `/archetypes`, the results-page archetype-library link, and app navigation updates
  - added reciprocal Alfred library footer cross-links
- Wave 3 completed:
  - shipped the shared browser archetype-library builder
  - added portal `/portal/archetype-library` and marketing `/assessment/archetypes`
  - implemented the marketing gate flow and public results-page archetype-library entry point
- Wave 4 completed:
  - added browser footer cross-links between the libraries
  - added portal rewrites, auth allowlist updates, and portal navigation links
  - completed verification and diff hygiene

## Non-Negotiables

- Do not change existing archetype scoring, content, or transition logic except to add library access and links.
- Do not change driver logic or existing Driver Library content.
- Zero em dashes in any new text.
- Archetype Library content must be identical across Alfred, portal, and marketing.
- Marketing gating must match the existing Driver Library gating pattern.

## Current Architecture Findings

### Alfred archetype seams

- Canonical archetype typing and summaries live in [scoring.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/scoring.ts).
- Full archetype content lives in [archetypes-full.ts](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/archetypes-full.ts).
- Archetype icons and accent colors live in [archetype-icons.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/lib/vapi/archetype-icons.tsx).
- Alfred results-page archetype section lives in [results/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx).
- Alfred already has the target library UI pattern in [drivers/page.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/drivers/page.tsx).
- Alfred mobile nav extensions live in [nav-menu-sheet.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/components/nav-menu-sheet.tsx) and desktop nav lives in [layout.tsx](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os/app/(dashboard)/layout.tsx).

### Browser seams

- Shared browser archetype helper lives in [vapi-archetypes.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-archetypes.js), mirrored to the marketing copy.
- Shared browser Driver Library builder lives in [vapi-driver-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-driver-library.js), mirrored to the marketing copy.
- Public results archetype section lives inline in [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-results.html), mirrored to the marketing copy.
- Marketing Driver Library gating is already implemented in [vapi-driver-library.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-driver-library.html) and [vapi-results.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html).
- Portal authenticated Driver Library page exists at [driver-library.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/driver-library.html).

### Routing and auth seams

- Portal rewrites/redirects live in [vercel.json](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/vercel.json).
- Portal login/signup allowed redirect lists live in [login.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/login.html) and [signup.html](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/portal/signup.html).

## Wave Plan

### Wave 1: Canonical Alfred archetype-library data

Scope:

- Create a canonical archetype-library content module in Alfred.
- Store title, subtitle, section ordering, section-id helper, empty-state banner, footer CTA text, and all 9 archetype library content blocks.
- Include the common-driver link mapping against the existing Driver Library sections.

### Wave 2: Alfred page and app integration

Scope:

- Create the Alfred `/archetypes` page using the existing Driver Library layout pattern.
- Add the archetype results-page link.
- Add Archetype Library and Driver Library into Alfred app navigation surfaces.
- Add the reciprocal footer cross-links between the two libraries in Alfred.

### Wave 3: Portal and marketing archetype-library pages and gating

Scope:

- Create a shared browser archetype-library builder and mirror it to marketing.
- Add portal `/portal/archetype-library` and marketing `/assessment/archetypes` wrappers.
- Implement the marketing gating modal and authenticated rendering flow.
- Add results-page archetype-library links and gating behavior on public results.

### Wave 4: Cross-links, route updates, redirects, and verification

Scope:

- Add footer cross-links between libraries on browser surfaces.
- Add portal rewrites/redirects and auth allowlists for the new library page.
- Verify Alfred build, marketing build, browser JS parse checks, and diff hygiene.
- Update this plan doc with final completion status and verification.

## Verification Completed

- `npm run build` passed in [aligned-ai-os](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os)
- `npm run build` passed in [jake-sebok-marketing-website](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website)
- `node --check` passed for:
  - [vapi-archetype-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-archetype-library.js)
  - [vapi-driver-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-power-vapi/output-assets/html/vapi-driver-library.js)
  - [vapi-archetype-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-archetype-library.js)
  - [vapi-driver-library.js](/Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website/public/vapi/vapi-driver-library.js)
- `git diff --check` passed

## Resume Protocol

1. Re-open this file before each wave.
2. Update the status snapshot before touching a new wave.
3. Keep Alfred as the canonical content source where possible.
4. Mirror browser and marketing copies only after the canonical layer is in place.
5. Run focused verification at the end of each wave and record the outcome here.
