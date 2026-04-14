-- Build Your Assessment — client intake submissions (jakesebok.com)
-- Run in Supabase SQL Editor on the same project as VAPI / portal.
-- Inserts are performed only from Next.js API routes using SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).

create table if not exists public.build_assessment_intake_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  full_name text,
  payload jsonb not null default '{}'::jsonb
);

create index if not exists build_assessment_intake_email_idx
  on public.build_assessment_intake_submissions (lower(email));

create index if not exists build_assessment_intake_created_idx
  on public.build_assessment_intake_submissions (created_at desc);

comment on table public.build_assessment_intake_submissions is
  'Prospect intake for custom assessment + portal engagements; written via service role from /api/build-assessment-intake';

alter table public.build_assessment_intake_submissions enable row level security;

-- No policies for anon/authenticated: only service role (server) may read/write.
