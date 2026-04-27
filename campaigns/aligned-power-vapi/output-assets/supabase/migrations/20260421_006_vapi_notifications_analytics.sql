-- Wave 1: Notification preferences, notification audit, analytics events
-- Additive only.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

create table if not exists public.vapi_notification_preferences (
  email text primary key,
  timezone text not null default 'America/New_York',
  morning_time time not null default '06:00',
  evening_time time not null default '17:00',
  quiet_hours_start time not null default '21:00',
  quiet_hours_end time not null default '07:00',
  channel_morning text not null default 'push',
  channel_evening text not null default 'push',
  channel_presence text not null default 'push',
  channel_coach text not null default 'email',
  push_subscription jsonb,
  sms_enabled boolean not null default false,
  sms_phone text,
  updated_at timestamptz not null default now()
);

create table if not exists public.vapi_notification_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kind text not null,
  channel text not null,
  sent_at timestamptz not null default now(),
  outcome text not null,
  error text,
  source_row_id uuid,
  retried_count int not null default 0
);
create index if not exists vapi_notification_events_email_time_idx
  on public.vapi_notification_events(email, sent_at desc);
create index if not exists vapi_notification_events_kind_time_idx
  on public.vapi_notification_events(kind, sent_at desc);

create table if not exists public.vapi_analytics_events (
  id uuid primary key default gen_random_uuid(),
  email text,
  session_id text,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  client_context jsonb,
  created_at timestamptz not null default now()
);
create index if not exists vapi_analytics_events_name_idx
  on public.vapi_analytics_events(event_name, occurred_at desc);
create index if not exists vapi_analytics_events_email_idx
  on public.vapi_analytics_events(email, occurred_at desc) where email is not null;
