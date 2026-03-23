# ACTION PLAN / My Plan content — project plan

Cross-session source of truth. Update **Section C** after every working block.

---

## Section A: Task overview

### Summary

Generate **168** content pieces for the 28-day My Plan / sprint system:

| Type | Count | Approx. words each |
|------|-------|----------------------|
| Level-calibrated openers (12 domains × 3 levels) | 36 | ~150 |
| Driver modifiers (12 domains × 10 VAPI drivers) | 120 | ~75 |
| Aligned Momentum modifiers (12 domains) | 12 | ~50 |

**Total:** ~15,000+ words. No em dashes (U+2014). Second person. Tone rules per level (high-performer / mid-level / rebuilding).

### Integration (actual repo)

- **Sprint generation:** `lib/portal-server/sprint-from-vapi.js` (assemble `payload` + context fields).
- **Level:** `determineUserLevel(results.overall)` — `>=7.0` high-performer, `>=5.5 && <7.0` mid-level, `<5.5` rebuilding.
- **Focus domain (non-Journeyman):** (1) Critical priority: score ≤6 & importance ≥7 → highest importance, tie → lowest score; (2) else any domain &lt;6 → lowest score; (3) else lowest score overall.
- **Layer 2:** Level opener **replaces** deep-dive `whyMatters` only; `usuallyIndicates`, `hiddenCost`, `leveragePoint`, `howToKnow`, weeks unchanged from Journeyman deep dive.
- **Layer 3:** Driver modifier in sprint payload (e.g. `driverModifier` or `context.driverModifier`) + My Plan / Alfred UI callout: **“A Pattern to Watch”**.
- **Drivers:** Match **live VAPI** assigned-driver strings (see Section B). **No** “Ghost” as driver (archetype only).

### Four logical content parts (from spec)

1. **Part 1:** Architecture + 36 level openers.  
2. **Part 2:** Driver modifiers, Self + Relationships arenas (40 + 40).  
3. **Part 3:** Driver modifiers, Business arena (40) + Aligned Momentum (12).  
4. **Part 4:** Storage layout, retrieval helpers, sprint + UI wiring, verification.

---

## Section B: Work waves

### Wave 1: Content structure setup

- [x] Repo paths: `lib/action-plan-content/` for data + helpers (parallel to `lib/portal-server/`).
- [x] Index / keys: domain codes, level keys, driver slugs ↔ VAPI display names.
- [x] `getOpenerForLevel`, `getDriverModifier` (return null if missing; no throws), `determineUserLevel`.
- [x] This plan document created; API gateway consolidated (separate track).

### Wave 2: High-performer openers (12)

- [x] PH, IA, ME, AF, RS, FA, CO, WI, VS, EX, OH, EC (`openers-data.js`)

### Wave 3: Mid-level openers (12)

- [x] PH through EC (same order)

### Wave 4: Rebuilding openers (12)

- [x] PH through EC

### Waves 5–14: Driver modifiers (12 domains each)

Use **VAPI** driver names (stored as `assignedDriver`):

| Wave | Driver (VAPI string) | Slug key |
|------|----------------------|----------|
| 5 | The Achiever's Trap | achievers-trap |
| 6 | The Escape Artist | escape-artist |
| 7 | The Pleaser's Bind | pleasers-bind |
| 8 | The Imposter Loop | imposter-loop |
| 9 | The Perfectionist's Prison | perfectionists-prison |
| 10 | The Protector | protector |
| 11 | The Martyr Complex | martyr-complex |
| 12 | The Fog | fog |
| 13 | The Scattered Mind | scattered-mind |
| 14 | The Builder's Gap | builders-gap |

Per wave: [x] PH, IA, ME, AF, RS, FA, CO, WI, VS, EX, OH, EC (all drivers in `drivers-modifiers-a.js`, `drivers-modifiers-b.js`, `drivers-modifiers-c.js`)

### Wave 15: Aligned Momentum modifiers (12)

- [x] PH through EC (`aligned-momentum` in `drivers-modifiers-c.js`)

### Wave 16: Content integration

- [x] Wire `sprint-from-vapi.js`: `selectFocusDomain`, `determineUserLevel`, opener replaces `whyMatters` in `payload.context`, `payload.driverModifier`, non-Journeyman weeks from focus-domain deep dive when available.
- [x] `portal/my-plan.html` + `aligned-ai-os/.../my-plan/page.tsx`: context blocks + amber **A pattern to watch** for `driverModifier`.
- [x] `resolveDriverSlug` in `keys.js`; safe `getOpenerForLevel` / `getDriverModifier` (null when missing, no throws).

### Wave 17: Verification

- [ ] Full checklist (completeness, no em dashes, word bands).
- [ ] Frank Sloan scenario: Journeyman, PH gap, high-performer, Aligned Momentum.
- [ ] Mid-level + Achiever's Trap + EX focus.
- [ ] Rebuilding + Escape Artist + PH focus.
- [ ] Edge: `overall === 7.0`, `overall === 5.5`, `overall === 5.499`.

---

## Section C: Current state tracker

```
Current Wave: 16–17 (integration done; verification optional)
Last Completed Task: 36 openers + 132 driver modifiers; sprint payload context + driverModifier; My Plan UI (portal + Alfred app)
Next Task: Wave 17 spot-check (Frank Sloan scenarios, edge scores) if desired
Blockers: none
Files Modified This Wave: lib/action-plan-content/* (openers-data, drivers-modifiers-*, index, keys resolveDriverSlug), lib/portal-server/sprint-from-vapi.js, portal/my-plan.html, aligned-ai-os my-plan page, docs/ACTION_PLAN_CONTENT_PLAN.md
```

---

## Section D: Content patterns

_To fill as drafts stabilize._

- **High-performer opener:** Acknowledge strength; gap as refinement; no fundamentals lecture. ~150 words.  
- **Mid-level opener:** Functional not thriving; leverage; no condescension. ~150 words.  
- **Rebuilding opener:** Compassion, stabilize before optimize, small steps. ~150 words.  
- **Driver modifier:** Warning + how pattern hits this domain + reframe. ~75 words. Second person.  
- **Aligned Momentum:** No dysfunction driver; straight execution; complacency risk; accountability. ~50 words.

---

## Section E: Test scenarios

1. **Frank Sloan:** Journeyman, PH gap, composite high-performer, driver null → Aligned Momentum modifier + PH high-performer opener + deep dive body minus replaced whyMatters.  
2. **Mid + Achiever's Trap:** Drifter-class profile, EX focus, composite mid-level, `The Achiever's Trap`.  
3. **Rebuilding + Escape Artist:** Ghost/Phoenix-class composite, PH focus, `The Escape Artist`.

---

## Confirmation line (for agents)

`Project plan created at output-assets/docs/ACTION_PLAN_CONTENT_PLAN.md. Wave 1 structure in progress. API gateway: single function api/gw.js.`
