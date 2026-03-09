-- Add source column to vapi_results to distinguish marketing vs portal submissions.
-- Run in Supabase → SQL Editor.
--
-- Values: 'portal' (default) | 'marketing'
-- - portal: submissions from portal.alignedpower.coach
-- - marketing: submissions from jakesebok.com / marketing site

alter table public.vapi_results
  add column if not exists source text default 'portal';

comment on column public.vapi_results.source is 'Submission origin: portal (default) or marketing';
