-- Wave 1: Coach dashboard tables (relationships, session briefs, pattern alerts, cohort snapshots)
-- Additive only.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

create table if not exists public.vapi_coach_relationships (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null,
  client_email text not null,
  status text not null default 'active',
  tier text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  private_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists vapi_coach_relationships_pair_idx
  on public.vapi_coach_relationships(coach_email, client_email);
create index if not exists vapi_coach_relationships_client_idx
  on public.vapi_coach_relationships(client_email);

create table if not exists public.vapi_session_briefs (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null,
  client_email text not null,
  session_scheduled_at timestamptz not null,
  generated_at timestamptz not null default now(),
  brief jsonb not null,
  generator_version text not null default 'v1.0.0',
  opened_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists vapi_session_briefs_coach_idx
  on public.vapi_session_briefs(coach_email, session_scheduled_at desc);
create index if not exists vapi_session_briefs_client_idx
  on public.vapi_session_briefs(client_email, session_scheduled_at desc);

create table if not exists public.vapi_pattern_alerts (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null,
  client_email text not null,
  alert_type text not null,
  detected_at timestamptz not null default now(),
  severity text not null default 'normal',
  payload jsonb not null,
  acknowledged_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists vapi_pattern_alerts_coach_unread_idx
  on public.vapi_pattern_alerts(coach_email, detected_at desc) where acknowledged_at is null and dismissed_at is null;

create table if not exists public.vapi_cohort_snapshots (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null,
  generated_at timestamptz not null default now(),
  period_start date not null,
  period_end date not null,
  client_count int not null,
  archetype_distribution jsonb not null default '{}'::jsonb,
  driver_activation_ranking jsonb not null default '[]'::jsonb,
  progression_velocity jsonb,
  at_risk_client_count int not null default 0,
  insights jsonb,
  anonymization_level text not null default 'full'
);
create index if not exists vapi_cohort_snapshots_coach_idx
  on public.vapi_cohort_snapshots(coach_email, generated_at desc);
