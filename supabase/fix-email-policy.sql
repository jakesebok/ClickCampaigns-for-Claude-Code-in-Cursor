-- One-time fix: make portal results match by email case-insensitively.
-- If you already deployed and don't see assessment results in the portal after taking the assessment
-- with the same email as your account, run this in Supabase → SQL Editor.

drop policy if exists "Users can read own results" on public.vapi_results;

create policy "Users can read own results"
  on public.vapi_results for select
  to authenticated
  using (
    lower(email) = (select lower(email) from auth.users where id = auth.uid())
  );
