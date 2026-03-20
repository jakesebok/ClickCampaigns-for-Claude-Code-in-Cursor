# VAPI Aligned Momentum Rollout Plan

## Goal

Replace the current high performer fallback in the Layer 2 driver system with a named positive state, `Aligned Momentum`, while preserving:

- all 9 dysfunction driver gates, signals, and content
- the standard no-driver fallback
- the existing archetype system
- shared data behavior across Alfred, portal, and marketing

## Core Rule Change

Evaluation order becomes:

1. Evaluate all 9 dysfunction drivers with existing gate + signal logic
2. Apply threshold and margin rules
3. If a dysfunction driver is assigned:
   - `driver_state = "dysfunction_driver"`
   - `assignedDriver = <driver name>`
4. If no dysfunction driver is assigned and composite `>= 7.0` and no more than 1 domain `< 5.5`:
   - `driver_state = "aligned_momentum"`
   - `assignedDriver = "Aligned Momentum"`
5. Otherwise:
   - `driver_state = "no_driver"`
   - `assignedDriver = null`

## Shared Data Changes

Persist alongside the existing driver fields:

- `assignedDriver`
- `secondaryDriver`
- `driverScores`
- `driverGates`
- `topDriverScore`
- `secondDriverScore`
- `secondaryDriverScore`
- `primaryToSecondaryMargin`
- `driverFallbackType`
- `driverState` (new)

Notes:

- `driverFallbackType` remains useful for admin reporting and backward compatibility, but `high_performer` should now map to the richer `aligned_momentum` state instead of a plain fallback message.
- `secondaryDriver` must always remain `null` for `aligned_momentum`.

## Canonical Alfred Files

- `campaigns/aligned-ai-os/lib/vapi/drivers.ts`
- `campaigns/aligned-ai-os/lib/vapi/driver-icons.tsx`
- `campaigns/aligned-ai-os/lib/vapi/driver-library.ts`
- `campaigns/aligned-ai-os/lib/vapi/driver-progress.ts`
- `campaigns/aligned-ai-os/lib/vapi/portal-format.ts`
- `campaigns/aligned-ai-os/app/api/vapi/route.ts`
- `campaigns/aligned-ai-os/app/api/admin/vapi/backfill-drivers/route.ts`
- `campaigns/aligned-ai-os/app/(dashboard)/assessment/results/page.tsx`
- `campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx`
- `campaigns/aligned-ai-os/app/(dashboard)/drivers/page.tsx`

## Portal / Marketing Duplicates

- `campaigns/aligned-power-vapi/output-assets/html/vapi-drivers.js`
- `campaigns/jake-sebok-marketing-website/public/vapi/vapi-drivers.js`
- `campaigns/aligned-power-vapi/output-assets/html/vapi-driver-library.js`
- `campaigns/jake-sebok-marketing-website/public/vapi/vapi-driver-library.js`
- `campaigns/aligned-power-vapi/output-assets/portal/dashboard.html`
- `campaigns/aligned-power-vapi/output-assets/html/vapi-results.html`
- `campaigns/jake-sebok-marketing-website/public/vapi/vapi-results.html`

## Email / Server Duplicates

- `campaigns/jake-sebok-marketing-website/lib/vapi-driver-scoring.ts`
- `campaigns/aligned-power-vapi/output-assets/api/_lib/vapi-driver-scoring.js`
- `campaigns/jake-sebok-marketing-website/app/api/save-vapi-results/route.ts`
- `campaigns/aligned-power-vapi/output-assets/api/save-vapi-results.js`
- `campaigns/jake-sebok-marketing-website/app/api/vapi-assessment-complete/route.js`
- `campaigns/aligned-power-vapi/output-assets/api/vapi-assessment-complete.js`

## Wave Plan

### Wave 1

Implement shared driver-state logic, Aligned Momentum content, icon, and storage semantics in the canonical Alfred modules plus shared save/read/backfill paths.

Success criteria:

- `driverState` exists in canonical evaluation output
- `assignedDriver = "Aligned Momentum"` for high performer no-driver cases
- `secondaryDriver = null` for aligned momentum
- storage and read paths surface `driverState`

### Wave 2

Update Alfred, portal, and marketing results pages and dashboard displays.

Success criteria:

- dynamic section heading switches between `Driving` and `Fueling`
- Aligned Momentum renders with full rich content, not fallback copy
- no secondary section appears for aligned momentum
- dashboard label changes to `What's Fueling This`

### Wave 3

Update Driver Library and progress-over-time behavior across all surfaces.

Success criteria:

- Aligned Momentum is the first library section
- the dysfunction-driver divider appears after it
- navigation highlights it when active
- progress transitions support all specified Aligned Momentum state changes

### Wave 4

Update user/admin emails, verify exact behavior, and run build/syntax checks.

Success criteria:

- emails reflect `What's Fueling This Pattern: Aligned Momentum`
- admin email reports aligned momentum distinctly
- Alfred build passes
- marketing build passes
- portal JS syntax checks pass

## Risks To Watch

- old rows that only store fallback metadata but not `driverState`
- browser helpers and server helpers drifting from canonical Alfred logic
- progress code that assumes any non-null `assignedDriver` is a dysfunction driver
- library personalization and sidebar highlighting when `assignedDriver = "Aligned Momentum"`

## Completion Status

- Wave 1 completed: canonical Aligned Momentum logic, content, icon, storage, read/write, backfill
- Wave 2 completed: Alfred, portal, and marketing results/dashboard state-aware rendering
- Wave 3 completed: Driver Library first-section treatment plus Aligned Momentum progress transitions
- Wave 4 completed: user/admin email updates and verification checks

## Verification

- `npm run build` passed in `campaigns/aligned-ai-os`
- `npm run build` passed in `campaigns/jake-sebok-marketing-website`
- `node --check` passed for the modified portal and marketing JS assets plus email routes
- `git diff --check` passed
