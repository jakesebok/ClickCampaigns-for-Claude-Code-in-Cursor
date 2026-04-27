-- Wave 1: Ritual infrastructure (morning check-ins, evening reviews, monthly pulses)
-- Additive only. No existing tables modified.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

create table if not exists public.vapi_morning_checkins (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  completed_at timestamptz not null default now(),
  local_date date not null,
  priorities jsonb not null default '[]'::jsonb,
  honored_domain text,
  alignment_intention text,
  timezone text not null default 'America/New_York',
  source text not null default 'portal',
  created_at timestamptz not null default now()
);
create unique index if not exists vapi_morning_checkins_email_date_idx
  on public.vapi_morning_checkins(email, local_date);
create index if not exists vapi_morning_checkins_completed_at_idx
  on public.vapi_morning_checkins(email, completed_at desc);
comment on table public.vapi_morning_checkins is 'Daily morning alignment check-in (Brendon Burchard HPP adapted). One row per user per local calendar date.';

create table if not exists public.vapi_evening_reviews (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  completed_at timestamptz not null default now(),
  local_date date not null,
  day_type text not null,
  prompt_id text not null,
  prompt_text text not null,
  response text,
  priorities_honored_count int,
  drivers_echoed text[] not null default '{}',
  morning_checkin_id uuid references public.vapi_morning_checkins(id) on delete set null,
  timezone text not null default 'America/New_York',
  source text not null default 'portal',
  created_at timestamptz not null default now()
);
create unique index if not exists vapi_evening_reviews_email_date_idx
  on public.vapi_evening_reviews(email, local_date);
create index if not exists vapi_evening_reviews_completed_at_idx
  on public.vapi_evening_reviews(email, completed_at desc);
comment on table public.vapi_evening_reviews is 'Evening integrity review (post-trade-scorecard-modeled, outcome-keyed prompts). One row per user per local calendar date.';

create table if not exists public.vapi_monthly_pulses (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  completed_at timestamptz not null default now(),
  local_month date not null,
  domain_scores jsonb not null,
  importance_ratings jsonb not null,
  delta_vs_last_full jsonb,
  notes text,
  timezone text not null default 'America/New_York',
  source text not null default 'portal',
  created_at timestamptz not null default now()
);
create unique index if not exists vapi_monthly_pulses_email_month_idx
  on public.vapi_monthly_pulses(email, local_month);
create index if not exists vapi_monthly_pulses_completed_at_idx
  on public.vapi_monthly_pulses(email, completed_at desc);
comment on table public.vapi_monthly_pulses is 'Monthly lightweight 12-domain pulse (bridge between weekly Six-C and quarterly full reassessment).';
