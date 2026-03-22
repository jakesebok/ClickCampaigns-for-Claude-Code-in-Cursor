# VAPI “Journeyman” archetype (formerly Rising Architect)

This document is historical working context for the **near-Architect** archetype across:

- **Marketing site** (static VAPI HTML/JS, assessment-complete emails)
- **Portal** (dashboard progress narratives)
- **Alfred / aligned-ai-os** (portal API, results UI, archetype library)

## Current canonical name

- **Display name:** The Journeyman  
- **Legacy stored value:** `The Rising Architect` is normalized to `The Journeyman` when reading (marketing emails, portal API, Alfred results) so old `vapi_results` rows still behave.

## Detection (unchanged)

Priority 2 after The Architect: composite ≥ 7.0, at least two arenas ≥ 7.5, lowest arena ≥ 6.5.

## Icon

Custom SVG: three interlocking circles (arenas); one ring has a deliberate gap in the stroke.

## Copy source of truth (TypeScript)

- `campaigns/aligned-ai-os/lib/vapi/scoring.ts` — type union, `getArchetype`, `normalizeVapiArchetypeName`, short `ARCHETYPE_DESCRIPTIONS`
- `campaigns/aligned-ai-os/lib/vapi/archetypes-full.ts` — full archetype fields
- `campaigns/aligned-ai-os/lib/vapi/archetype-library.ts` — library cards and cross-archetype relationship text

Mirrored browser bundles:

- `campaigns/jake-sebok-marketing-website/public/vapi/vapi-archetypes.js`
- `campaigns/jake-sebok-marketing-website/public/vapi/vapi-archetype-library.js`
- `campaigns/aligned-power-vapi/output-assets/html/` (copies as needed)

---

*Earlier revisions of this file referred to “Rising Architect”; the archetype was renamed to **The Journeyman** for positioning.*
