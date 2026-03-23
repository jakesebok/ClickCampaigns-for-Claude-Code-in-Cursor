# My Plan (28-day sprint) — implementation

## Behavior (confirmed)

| Assessment taken on | `primary_surface` | Where to use My Plan |
|--------------------|-------------------|----------------------|
| Marketing site or portal | `portal` | Portal `/my-plan` |
| Alfred app | `alfred` | Alfred `/my-plan` |

- Only users with a **portal account** (Supabase auth) or **Alfred account** (Clerk) can use My Plan; data is keyed by **email**.
- **Active client** remains a manual admin flag (`portal_active_clients`); no automation added here.
- **Alfred trial / pricing**: continue to use **alfredai.coach** (no new trial flow in this repo).

## Supabase

1. Run `supabase/sprints.sql` (adds `sprints` table, optional `vapi_results.source` column).
2. Env on **Vercel (portal)**: existing Supabase keys + optional `PORTAL_SPRINT_SYNC_SECRET` / `SPRINT_SYNC_SECRET` for Alfred → portal sprint sync.

## Portal (aligned-power-vapi / `output-assets`)

| Piece | Location |
|-------|----------|
| Sprint generation | `lib/portal-server/sprint-from-vapi.js`, `lib/portal-server/vapi-enrich-for-storage.js` |
| Upsert active sprint | `lib/portal-server/sprint-upsert.js` |
| API entry (Vercel Hobby) | `api/gw.js` + `lib/portal-server/handlers/*` (see `docs/API_GATEWAY.md`) |
| Save VAPI + sprint | `api/save-vapi-results.js` (`source`: `marketing` \| `portal`) |
| Internal sync (Alfred) | `api/sprint-upsert-from-assessment.js` (header `x-sprint-sync-secret`) |
| User APIs | `api/sprint-get-me.js`, `api/sprint-patch-me.js` |
| Coach APIs | `api/coach-sprints.js`, `api/coach-sprint-save.js`, `api/coach-sprint-regenerate.js` |
| UI | `portal/my-plan.html`, `portal/dashboard.html` (card + nav), `portal/coach.html` (sprints section) |
| Marketing results save | `html/vapi-results.html` (sets `source` from session) |
| Routes | `vercel.json` → `/my-plan` |

## Alfred (aligned-ai-os)

| Piece | Location |
|-------|----------|
| VAPI `source` + sprint sync | `app/api/vapi/route.ts` (`source: "alfred"`, POST to portal `/api/sprint-upsert-from-assessment` when `PORTAL_BASE_URL` + secret set) |
| Clerk-authenticated sprint APIs | `app/api/sprint/me/route.ts`, `app/api/sprint/patch/route.ts` |
| UI | `app/(dashboard)/my-plan/page.tsx` |
| Nav | `app/(dashboard)/layout.tsx`, `components/nav-menu-sheet.tsx` |

### Alfred env vars

- `PORTAL_BASE_URL` — e.g. `https://portal.alignedpower.coach`
- `PORTAL_SPRINT_SYNC_SECRET` or `SPRINT_SYNC_SECRET` — same value as portal Vercel env

## Coach dashboard

New block at top of `coach.html`: list active sprints, edit coach context / private notes, regenerate from latest VAPI per client email.

## One-time backfill (no UI)

For everyone who already has a `vapi_results` row but no `sprints` row yet, run once from your machine (not Vercel):

```bash
cd campaigns/aligned-power-vapi/output-assets
export SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
node scripts/backfill-sprints-from-vapi.js --dry-run   # optional: preview
node scripts/backfill-sprints-from-vapi.js             # writes upserts
# Single email: node scripts/backfill-sprints-from-vapi.js --email=client@example.com
```

Uses the same enrichment + `buildSprintPayload` + `upsertActiveSprint` as live saves. Latest assessment per email wins (ordered by `created_at` desc). Existing active sprints are **updated** in place (same as coach Regenerate).

## Payload shape (`sprints.payload` JSON)

- `version`, `title`, `summary`, `archetype`, `driver`, `generatedAt`
- `weeks[]`: `weekNumber`, `theme`, `tasks[]` (`id`, `title`, `description`, `completed`)
- `weekReflections`: `{ "1": "...", ... }` (optional)
