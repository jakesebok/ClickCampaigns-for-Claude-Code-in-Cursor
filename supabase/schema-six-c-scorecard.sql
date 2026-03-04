-- 6C's Scorecard: active clients + weekly submissions
-- Run after schema.sql. Requires vapi_results to exist.

-- Table: which portal users are "active clients" (get access to 6C's scorecard)
create table if not exists public.portal_active_clients (
  email text primary key,
  active_client boolean not null default false,
  updated_at timestamptz not null default now()
);

comment on table public.portal_active_clients is 'Marks which users are active clients and can access the 6C scorecard. Updated by admin only.';

alter table public.portal_active_clients enable row level security;

drop policy if exists "Users can read own active client status" on public.portal_active_clients;
create policy "Users can read own active client status"
  on public.portal_active_clients for select
  to authenticated
  using (lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', ''))));

drop policy if exists "Anon can read own active client status" on public.portal_active_clients;
create policy "Anon can read own active client status"
  on public.portal_active_clients for select
  to anon
  using (
    auth.uid() is not null
    and lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

-- No insert/update policy for authenticated/anon: only service role (admin API) can write.
grant select on public.portal_active_clients to authenticated;
grant select on public.portal_active_clients to anon;

-- Table: weekly 6C submissions (one row per week per user)
create table if not exists public.six_c_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  -- Section A: 6C scores (each 0–100, from total of 5 questions × 4)
  scores jsonb not null default '{}',
  -- One main priority for improvement (from weekly review)
  one_thing_to_improve text,
  -- Optional: full weekly review answers
  weekly_review jsonb
);

comment on table public.six_c_submissions is 'Weekly 6C scorecard submissions. scores: { clarity, coherence, capacity, confidence, courage, connection } each 0-100.';

create index if not exists six_c_submissions_email_idx on public.six_c_submissions (email);
create index if not exists six_c_submissions_created_at_idx on public.six_c_submissions (created_at desc);

alter table public.six_c_submissions enable row level security;

drop policy if exists "Users can read own 6c submissions" on public.six_c_submissions;
create policy "Users can read own 6c submissions"
  on public.six_c_submissions for select
  to authenticated
  using (lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', ''))));

drop policy if exists "Anon can read own 6c submissions" on public.six_c_submissions;
create policy "Anon can read own 6c submissions"
  on public.six_c_submissions for select
  to anon
  using (
    auth.uid() is not null
    and lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

drop policy if exists "Users can insert own 6c submissions" on public.six_c_submissions;
create policy "Users can insert own 6c submissions"
  on public.six_c_submissions for insert
  to authenticated
  with check (lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', ''))));

drop policy if exists "Anon can insert own 6c submissions" on public.six_c_submissions;
create policy "Anon can insert own 6c submissions"
  on public.six_c_submissions for insert
  to anon
  with check (
    auth.uid() is not null
    and lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

grant select, insert on public.six_c_submissions to authenticated;
grant select, insert on public.six_c_submissions to anon;
