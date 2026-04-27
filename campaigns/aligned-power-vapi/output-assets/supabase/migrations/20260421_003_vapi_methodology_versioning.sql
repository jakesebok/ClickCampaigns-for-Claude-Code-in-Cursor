-- Wave 1: Methodology versioning
-- Additive only. Does not modify vapi_results; uses a join table instead.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

create table if not exists public.vapi_taxonomy_versions (
  version text primary key,
  questions jsonb not null default '[]'::jsonb,
  archetype_definitions jsonb not null default '{}'::jsonb,
  driver_definitions jsonb not null default '{}'::jsonb,
  scoring_rules jsonb not null default '{}'::jsonb,
  priority_matrix_copy jsonb not null default '{}'::jsonb,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  notes text
);
create unique index if not exists vapi_taxonomy_versions_active_idx
  on public.vapi_taxonomy_versions(active) where active = true;

insert into public.vapi_taxonomy_versions (version, active, activated_at, notes)
values ('v1.0.0', true, now(), 'Current production VAPI taxonomy. Full payload populated separately.')
on conflict (version) do nothing;

create table if not exists public.vapi_assessment_version_link (
  vapi_result_id uuid primary key references public.vapi_results(id) on delete cascade,
  taxonomy_version text not null references public.vapi_taxonomy_versions(version),
  linked_at timestamptz not null default now()
);
comment on table public.vapi_assessment_version_link is 'Additive join: which taxonomy version scored a given assessment. Existing results default to v1.0.0 via handler, not backfilled here.';
