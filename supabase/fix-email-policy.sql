-- One-time fix: make portal results match by email case-insensitively.
-- Uses the JWT email claim (no read on auth.users), so no "permission denied for table users".
-- Run this in Supabase → SQL Editor.

drop policy if exists "Users can read own results" on public.vapi_results;
drop policy if exists "Anon can read own results" on public.vapi_results;

-- Match rows where email (lowercase) equals the signed-in user's email from the JWT.
create policy "Users can read own results"
  on public.vapi_results for select
  to authenticated
  using (
    lower(email) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

create policy "Anon can read own results"
  on public.vapi_results for select
  to anon
  using (
    auth.uid() is not null
    and lower(email) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );
