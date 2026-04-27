# VAPI Supabase Migrations

Versioned, ordered SQL migration files for the VAPI portal Supabase project. **Additive only** — never reshape existing tables.

## File-naming convention

`YYYYMMDD_NNN_<purpose>.sql`

- `YYYYMMDD` — date authored
- `NNN` — sequential number for that date
- `<purpose>` — snake_case description

## Order of application

Run in numeric order. Each migration assumes the previous one has been applied.

| # | File | Purpose | Status |
|---|---|---|---|
| 001 | `20260421_001_vapi_ritual_tables.sql` | Morning check-ins, evening reviews, monthly pulses | ✅ Applied |
| 002 | `20260421_002_vapi_presence_engine.sql` | Presence trigger versions + events + v1.0.0 catalog seed | ✅ Applied |
| 003 | `20260421_003_vapi_methodology_versioning.sql` | Taxonomy versions + assessment-version link | ✅ Applied |
| 004 | `20260421_004_vapi_coach_tables.sql` | Coach relationships, session briefs, pattern alerts, cohort snapshots | ✅ Applied |
| 005 | `20260421_005_vapi_sharing_marketplace.sql` | Shareable results, referral attributions, peer marketplace | ✅ Applied |
| 006 | `20260421_006_vapi_notifications_analytics.sql` | Notification preferences, notification events, analytics events | ✅ Applied |
| 007 | `20260421_007_vapi_rls_policies.sql` | RLS on all new tables + auth helper functions | ✅ Applied |
| 008 | `20260422_008_axiom_tables.sql` | Axiom business tables (intake, engagements, pipeline, agents, referrals) | ✅ Applied |
| 009 | `20260422_009_seed_taxonomy_v1_payload.sql` | Update vapi_taxonomy_versions v1.0.0 with full payload | ✅ Applied |
| 010 | `20260422_010_seed_sample_clients.sql` | Sample clients part 1 (Maya earlier) | ✅ Applied |
| 011 | `20260422_011_seed_sample_clients_part2.sql` | Sample clients part 2 (Maya recent, Darren, Sara, Leo) | ✅ Applied |
| 012 | `20260422_012_seed_sample_rituals.sql` | Sample morning/evening/alerts for demo | ✅ Applied |

## Production status

All 12 migrations have been applied to Supabase project `zhlmfqjtthrkcsbfwnpo` ("Client Dashboard") on 2026-04-22.

To verify on the live project:

```sql
SELECT version, name, statements -> 0 ->> 'statements' as preview
FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 20;
```

## Re-applying

These migrations are **idempotent** — every `CREATE TABLE` uses `IF NOT EXISTS`, every `CREATE INDEX` uses `IF NOT EXISTS`, every `INSERT` uses `ON CONFLICT DO NOTHING` (or appropriate update). Sample-data seeds (010-012) include `DELETE` statements at the top so they can be safely re-run.

## To apply to a fresh project

```bash
# Using the Supabase CLI
supabase db push

# Or manually via SQL editor: open each file in numeric order, paste, run.
```

## Demo data purge

To remove all sample/demo content:

```sql
DELETE FROM public.vapi_pattern_alerts WHERE client_email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_evening_reviews WHERE email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_morning_checkins WHERE email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_results WHERE email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_coach_relationships WHERE client_email LIKE 'sample-%@axiom.demo';
DELETE FROM public.portal_active_clients WHERE email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_notification_preferences WHERE email LIKE 'sample-%@axiom.demo';
```

## Pre-existing migrations (before Wave 1)

These are not in this folder. They are the original VAPI schema files in the parent directory:

- `../coach_notes.sql` — coach_notes table (March 2026)
- `../sprints.sql` — sprints + vapi_results.source column (March 2026)
- `../schema.sql` (in main project) — initial vapi_results, six_c_submissions, portal_active_clients

These were applied by Jake before Wave 1 began. Wave 1 migrations build on top.

## Discipline

- **Additive only.** No `DROP`, no `ALTER COLUMN TYPE`, no `RENAME`.
- **`IF NOT EXISTS` everywhere** — every migration must be idempotent.
- **Comments explain non-obvious tables.** `COMMENT ON TABLE` to make schema self-documenting.
- **RLS enabled on every new table.** Service role bypasses; authenticated role gets per-email access.
- **Numbered consistently.** `YYYYMMDD_NNN_<purpose>.sql`. Never re-use a number.

## Also see

- `../../docs/vapi-data-model.md` — authoritative data model documentation
- `../coach_notes.sql`, `../sprints.sql` — pre-Wave-1 migrations
