-- Email suppression list for the Aligned Power portal + jakesebok.com senders.
--
-- A row means the address opted out of non-transactional email (6C's Scorecard
-- reminders and other non-essential mail). Written by /api/unsubscribe
-- (one-click link, RFC 8058 one-click POST, and the manual confirm form), and
-- read by cron-6c-reminders BEFORE every send so opted-out clients are skipped.
--
-- Run this once in the Supabase SQL Editor, the same way as the other
-- output-assets/supabase/*.sql files. Safe to re-run (idempotent).

create table if not exists public.email_unsubscribes (
  email           text primary key,
  scope           text not null default 'all',
  source          text,
  unsubscribed_at timestamptz not null default now()
);

comment on table public.email_unsubscribes is
  'Email suppression list. A row = the address opted out of non-transactional mail. Written by /api/unsubscribe, checked by cron-6c-reminders before sending.';

-- Lock the table down: enabling RLS with NO policy blocks anon + authenticated
-- entirely. The server handlers use the service_role key, which bypasses RLS.
alter table public.email_unsubscribes enable row level security;
