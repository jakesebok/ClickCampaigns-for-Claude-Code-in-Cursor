# Journeyman growth edge — Aligned AI OS (Next.js)

The canonical implementation lives under:

`campaigns/aligned-power-vapi/output-assets/lib/`

- `vapi-journeyman-analysis.js` — detection + `journeymanAnalysis` payload
- `vapi-journeyman-display.js` — `buildJourneymanGrowthEdgeHtml(results, { escapeHtml })`
- `journeyman/` — deep dives, pair notes, arena fallbacks

**Portal + static HTML** load the display module via dynamic `import()` and inject HTML.

**To add to `aligned-ai-os` (React):**

1. Copy the `lib/` folder (or subtree) into `public/vapi/lib/` or use a shared package.
2. Either:
   - **A)** Fetch `buildJourneymanGrowthEdgeHtml` by exposing a tiny API route that returns HTML (not ideal), or  
   - **B)** Port `analyzeJourneyman` + content to TypeScript modules under `lib/vapi/` and render with JSX using the same field structure (`whyMatters`, `usuallyIndicates`, etc.), or  
   - **C)** Use `dangerouslySetInnerHTML` after dynamic `import()` of `vapi-journeyman-display.js` in a client component (same pattern as `vapi-results.html`).

3. On save, the API already attaches `journeymanAnalysis` for **The Journeyman** via `enrichResultsWithJourneyman` in `save-vapi-results.js`.

Keep marketing site `public/vapi/lib/` in sync when you change journeyman files (or replace with a build step).
