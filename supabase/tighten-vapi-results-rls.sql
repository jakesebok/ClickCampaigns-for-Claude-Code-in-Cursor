-- Tighten vapi_results RLS policies (addresses linter warnings).
-- Run in Supabase → SQL Editor AFTER enable-rls-on-all-tables.sql.
--
-- Drops overly permissive policies and replaces with slightly restricted ones.
-- Assessment form still works: anonymous insert requires non-empty email.

-- Drop all existing policies (including duplicates)
drop policy if exists "Allow anonymous insert" on public.vapi_results;
drop policy if exists "anon_insert" on public.vapi_results;
drop policy if exists "authenticated_all" on public.vapi_results;
drop policy if exists "Users can read own results" on public.vapi_results;
drop policy if exists "Anon can read own results" on public.vapi_results;

-- Insert: anon can insert only if email is non-empty (slightly less permissive than true)
create policy "anon_insert_with_email"
  on public.vapi_results for insert
  to anon
  with check (email is not null and length(trim(email)) > 0);

-- Select: authenticated users can read only their own results (by JWT email)
create policy "authenticated_select_own"
  on public.vapi_results for select
  to authenticated
  using (
    lower(email) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

-- Grants (unchanged)
grant insert on public.vapi_results to anon;
grant select on public.vapi_results to authenticated;
