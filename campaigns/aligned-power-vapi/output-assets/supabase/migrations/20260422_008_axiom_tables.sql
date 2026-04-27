-- Axiom business tables (shared Supabase, but axiom_* prefix distinct from vapi_* and alfred tables)
-- Additive only.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.
-- Depends on: 20260421_007_vapi_rls_policies (uses public.is_vapi_coach() helper)

create table if not exists public.axiom_intake_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  full_name text,
  phone text,
  payload jsonb not null default '{}'::jsonb,
  fit_score numeric(4,2),
  recommended_tier text,
  routing text,
  reviewed_at timestamptz,
  review_notes text
);
create index if not exists axiom_intake_submissions_email_idx on public.axiom_intake_submissions(email, created_at desc);
create index if not exists axiom_intake_submissions_routing_idx on public.axiom_intake_submissions(routing, created_at desc);

create table if not exists public.axiom_engagements (
  client_slug text primary key,
  client_name text,
  client_email text not null,
  tier text,
  fee_quoted numeric(10,2),
  status text not null default 'active',
  current_phase text,
  last_phase_completed text,
  started_at timestamptz default now(),
  delivered_at timestamptz,
  intake_payload jsonb,
  scoping_call_transcript text,
  scoping_call_date timestamptz,
  uploaded_materials jsonb,
  audience text,
  tone_slider int,
  stance_slider int,
  faith text,
  dignity_rule text,
  response_scale text,
  reading_level text,
  lexicon_exclusions text[],
  transcripts_excerpt text,
  voice_guide jsonb,
  updated_at timestamptz default now()
);
create index if not exists axiom_engagements_email_idx on public.axiom_engagements(client_email);
create index if not exists axiom_engagements_phase_idx on public.axiom_engagements(current_phase) where status = 'active';

create table if not exists public.axiom_pipeline_events (
  id uuid primary key default gen_random_uuid(),
  client_slug text not null,
  phase text not null,
  status text not null,
  payload jsonb,
  occurred_at timestamptz not null default now()
);
create index if not exists axiom_pipeline_events_client_idx on public.axiom_pipeline_events(client_slug, occurred_at desc);
create index if not exists axiom_pipeline_events_phase_idx on public.axiom_pipeline_events(phase, occurred_at desc);

create table if not exists public.axiom_agent_events (
  id uuid primary key default gen_random_uuid(),
  agent_id text not null,
  client_slug text,
  started_at timestamptz,
  completed_at timestamptz,
  status text not null,
  attempt int default 0,
  model text,
  tokens_in int default 0,
  tokens_out int default 0,
  voice_check jsonb,
  error text
);
create index if not exists axiom_agent_events_agent_idx on public.axiom_agent_events(agent_id, completed_at desc);
create index if not exists axiom_agent_events_client_idx on public.axiom_agent_events(client_slug, completed_at desc);

-- Referral tracking for Axiom (coach-to-coach referrals)
create table if not exists public.axiom_referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_email text not null,
  referee_email text,
  code text unique,
  created_at timestamptz default now(),
  clicked_at timestamptz,
  intake_submitted_at timestamptz,
  signed_at timestamptz,
  tier_signed text,
  fee_signed numeric(10,2),
  commission_amount numeric(10,2),
  commission_status text default 'pending'
);
create index if not exists axiom_referrals_referrer_idx on public.axiom_referrals(referrer_email);

alter table public.axiom_intake_submissions enable row level security;
alter table public.axiom_engagements enable row level security;
alter table public.axiom_pipeline_events enable row level security;
alter table public.axiom_agent_events enable row level security;
alter table public.axiom_referrals enable row level security;

-- Only coach admin reads these (service-role writes via API)
create policy "coach reads axiom intake" on public.axiom_intake_submissions for select using (public.is_vapi_coach());
create policy "coach reads axiom engagements" on public.axiom_engagements for select using (public.is_vapi_coach());
create policy "coach reads axiom pipeline" on public.axiom_pipeline_events for select using (public.is_vapi_coach());
create policy "coach reads axiom agent events" on public.axiom_agent_events for select using (public.is_vapi_coach());
create policy "coach reads axiom referrals" on public.axiom_referrals for select using (public.is_vapi_coach());
