-- Wave 1: VAPI Presence engine (rules engine + trigger events + version registry)
-- Additive only.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

create table if not exists public.vapi_presence_trigger_versions (
  version text primary key,
  triggers jsonb not null,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  notes text
);
create unique index if not exists vapi_presence_trigger_versions_active_idx
  on public.vapi_presence_trigger_versions(active) where active = true;
comment on table public.vapi_presence_trigger_versions is 'DB-versioned registry of presence trigger rule sets. Only one active row allowed.';

create table if not exists public.vapi_presence_trigger_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  trigger_id text not null,
  version text not null references public.vapi_presence_trigger_versions(version),
  evaluated_at timestamptz not null default now(),
  outcome text not null,
  channel text,
  action text,
  payload jsonb,
  acknowledged_at timestamptz,
  source_row_ids jsonb not null default '{}'::jsonb
);
create index if not exists vapi_presence_trigger_events_email_time_idx
  on public.vapi_presence_trigger_events(email, evaluated_at desc);
create index if not exists vapi_presence_trigger_events_trigger_idx
  on public.vapi_presence_trigger_events(trigger_id, evaluated_at desc);
comment on table public.vapi_presence_trigger_events is 'Every presence evaluation writes a row (fired, suppressed, capped, quiet-hours, no-match). Fail-loud audit.';

-- Seed the v1.0.0 trigger catalog
insert into public.vapi_presence_trigger_versions (version, triggers, active, activated_at, notes)
values (
  'v1.0.0',
  jsonb_build_object(
    'V-01', jsonb_build_object(
      'id', 'V-01',
      'pain_moment', 'post_drift_spike',
      'name', 'Post-Drift Morning Flag',
      'description', 'Fires morning after a drift day with driver echo',
      'cap_per_day', 1,
      'cap_per_week', 5,
      'priority', 'high',
      'output_channel', 'banner',
      'copy_template', 'Yesterday went sharp. {{driver}} had an opening. Pick one move:'
    ),
    'V-02', jsonb_build_object(
      'id', 'V-02',
      'pain_moment', 'driver_persistence',
      'name', 'Driver Persistence Alert',
      'description', 'Same driver echoed in 3 consecutive evening reviews',
      'cap_per_day', 1,
      'cap_per_week', 2,
      'priority', 'medium',
      'output_channel', 'push',
      'copy_template', '{{driver}} has been echoing for three days. Your pattern is speaking. The driver library has one prompt worth reading tonight.'
    ),
    'V-03', jsonb_build_object(
      'id', 'V-03',
      'pain_moment', 'missing_evening_review',
      'name', 'Evening Review Nudge',
      'description', 'Active today, no evening review by user-local 9 PM',
      'cap_per_day', 1,
      'cap_per_week', 7,
      'priority', 'low',
      'output_channel', 'push',
      'copy_template', 'Today is still open when you are ready. 60 seconds.'
    ),
    'V-04', jsonb_build_object(
      'id', 'V-04',
      'pain_moment', 'morning_misalignment',
      'name', 'Critical Priority Flag',
      'description', 'Morning priorities concentrated in Critical Priority quadrant from latest assessment',
      'cap_per_day', 1,
      'cap_per_week', 2,
      'priority', 'medium',
      'output_channel', 'banner',
      'copy_template', 'Your priorities today sit in your Critical Priority quadrant. Sharp focus or familiar avoidance? You decide.'
    ),
    'V-05', jsonb_build_object(
      'id', 'V-05',
      'pain_moment', 'overextension_streak',
      'name', 'Capacity Check',
      'description', 'Three consecutive mornings with five-plus priorities and declining evening alignment',
      'cap_per_day', 1,
      'cap_per_week', 1,
      'priority', 'high',
      'output_channel', 'drawer',
      'copy_template', 'Your days are getting fuller. Shorten the list or name what comes off. Otherwise the list will pick for you.'
    )
  ),
  true,
  now(),
  'Initial VAPI Presence trigger catalog. Five triggers ported from EdgeState Presence system.'
)
on conflict (version) do nothing;
