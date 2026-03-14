-- Add contextual_profile to users (portal intake questions).
-- Run in Supabase → SQL Editor.
alter table public.users
  add column if not exists contextual_profile jsonb;

comment on column public.users.contextual_profile is 'Portal-style intake: revenueStage, teamSize, lifeStage, timeInBusiness, primaryChallenge';
