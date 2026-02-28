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

-- Policy: anyone can insert (assessment form submission from landing/quiz)
create policy "Allow anonymous insert"
  on public.vapi_results for insert
  to anon
  with check (true);

-- Policy: authenticated users can only read their own results (matched by email, case-insensitive)
create policy "Users can read own results"
  on public.vapi_results for select
  to authenticated
  using (
    lower(email) = (select lower(email) from auth.users where id = auth.uid())
  );

-- Optional: grant anon insert (required for client-side save from results page)
-- Service role can do anything; anon can insert only.

comment on table public.vapi_results is 'VAPI assessment results; linked to portal users by email';
