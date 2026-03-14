-- Add explicit deny policies to satisfy Supabase linter (RLS enabled but no policy).
-- Run in Supabase → SQL Editor.
--
-- These tables are accessed only via DATABASE_URL (postgres connection), which bypasses RLS.
-- We add policies that explicitly deny anon/authenticated so the linter sees "a policy exists."
-- Backend behavior is unchanged.

create policy "deny_anon_auth"
  on public.context_documents for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "deny_anon_auth"
  on public.conversations for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "deny_anon_auth"
  on public.messages for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "deny_anon_auth"
  on public.onboarding_progress for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "deny_anon_auth"
  on public.scorecard_entries for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "deny_anon_auth"
  on public.users for all
  to anon, authenticated
  using (false)
  with check (false);

create policy "deny_anon_auth"
  on public.weekly_one_things for all
  to anon, authenticated
  using (false)
  with check (false);
