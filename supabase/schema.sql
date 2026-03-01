-- VAPI User Portal Schema
-- Run this in the Supabase SQL Editor after creating your project.

-- Table: store each assessment submission (one row per completion)
create table if not exists public.vapi_results (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  first_name text,
  last_name text,
  results jsonb not null,
  created_at timestamptz not null default now()
);

-- Index for fast lookups by email (used when user logs in to portal)
create index if not exists vapi_results_email_idx on public.vapi_results (email);
create index if not exists vapi_results_created_at_idx on public.vapi_results (created_at desc);

-- RLS: enable row-level security
alter table public.vapi_results enable row level security;

-- Policies (drop first so this script can be re-run safely)
drop policy if exists "Allow anonymous insert" on public.vapi_results;
drop policy if exists "Users can read own results" on public.vapi_results;
drop policy if exists "Anon can read own results" on public.vapi_results;

-- Policy: anyone can insert (assessment form submission from landing/quiz)
create policy "Allow anonymous insert"
  on public.vapi_results for insert
  to anon
  with check (true);

-- Policy: authenticated users can only read their own results (matched by JWT email, case-insensitive)
create policy "Users can read own results"
  on public.vapi_results for select
  to authenticated
  using (
    lower(email) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

-- Policy: anon with user JWT (browser sends anon key + Bearer token) can read own results
create policy "Anon can read own results"
  on public.vapi_results for select
  to anon
  using (
    auth.uid() is not null
    and lower(email) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

-- Grant anon insert (required for client-side save from results page).
-- Without this, the RLS policy allows insert but the role has no table privilege.
grant insert on public.vapi_results to anon;
grant select on public.vapi_results to authenticated;

comment on table public.vapi_results is 'VAPI assessment results; linked to portal users by email';
