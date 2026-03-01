-- One-time fix: allow anonymous inserts into vapi_results.
-- If new VAPI assessment results are not being stored, run ONLY this file in Supabase → SQL Editor.
--
-- This file contains only GRANTs. It does NOT create or drop any policies.
-- If you see an error about "policy ... already exists", that came from running
-- schema.sql (or another script), not from this file. Run only the two lines below.
--
-- Cause: RLS policy "Allow anonymous insert" allows the operation, but the anon role
-- must also have the table privilege. These grants provide it.

grant insert on public.vapi_results to anon;
grant select on public.vapi_results to authenticated;
