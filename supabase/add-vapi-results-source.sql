-- Add source column to vapi_results to distinguish submission origin.
-- Run in Supabase → SQL Editor.
--
-- Values: 'portal' (default) | 'marketing' | 'app'
-- - portal: submissions from portal.alignedpower.coach
-- - marketing: submissions from jakesebok.com / marketing site
-- - app: submissions from VAP Coach (vap.coach)

alter table public.vapi_results
  add column if not exists source text default 'portal';

comment on column public.vapi_results.source is 'Submission origin: portal (default), marketing, or app';
