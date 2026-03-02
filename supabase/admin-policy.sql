-- Admin read-all policy for vapi_results
-- Run in Supabase SQL Editor. Allows jacob@alignedpower.coach to SELECT all rows.

drop policy if exists "Admin can read all results" on public.vapi_results;

create policy "Admin can read all results"
  on public.vapi_results for select
  to authenticated
  using (
    lower(trim(coalesce(auth.jwt() ->> 'email', ''))) = 'jacob@alignedpower.coach'
  );

-- Optional: allow same admin via anon key when Bearer token is present (e.g. portal using anon key)
drop policy if exists "Anon admin can read all results" on public.vapi_results;

create policy "Anon admin can read all results"
  on public.vapi_results for select
  to anon
  using (
    auth.uid() is not null
    and lower(trim(coalesce(auth.jwt() ->> 'email', ''))) = 'jacob@alignedpower.coach'
  );
