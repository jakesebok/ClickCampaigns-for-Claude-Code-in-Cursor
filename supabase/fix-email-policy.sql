-- One-time fix: make portal results match by email case-insensitively and allow anon+JWT.
-- If you already deployed and don't see assessment results in the portal after taking the assessment
-- with the same email as your account, run this in Supabase → SQL Editor.

drop policy if exists "Users can read own results" on public.vapi_results;
drop policy if exists "Anon can read own results" on public.vapi_results;

-- Authenticated role (when request is made with user JWT as authenticated)
create policy "Users can read own results"
  on public.vapi_results for select
  to authenticated
  using (
    lower(email) = (select lower(email) from auth.users where id = auth.uid())
  );

-- Anon role with user JWT (browser often sends anon key + Bearer token; some setups use anon role)
create policy "Anon can read own results"
  on public.vapi_results for select
  to anon
  using (
    auth.uid() is not null
    and lower(email) = (select lower(email) from auth.users where id = auth.uid())
  );
