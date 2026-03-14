-- Enable RLS on all public tables that were missing it.
-- Run in Supabase → SQL Editor.
--
-- The app uses DATABASE_URL (postgres connection) which bypasses RLS,
-- so the backend will continue to work. Enabling RLS with no policies
-- means anon/authenticated get no access via PostgREST — defense in depth.

alter table public.weekly_one_things enable row level security;
alter table public.context_documents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.scorecard_entries enable row level security;
alter table public.onboarding_progress enable row level security;
alter table public.users enable row level security;
