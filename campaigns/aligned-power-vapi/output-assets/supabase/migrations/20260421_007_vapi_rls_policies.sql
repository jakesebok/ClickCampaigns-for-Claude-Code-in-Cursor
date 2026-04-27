-- Wave 1: RLS policies for all new tables
-- Service role bypasses all policies. authenticated role gets per-email access.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

alter table public.vapi_morning_checkins enable row level security;
alter table public.vapi_evening_reviews enable row level security;
alter table public.vapi_monthly_pulses enable row level security;
alter table public.vapi_presence_trigger_versions enable row level security;
alter table public.vapi_presence_trigger_events enable row level security;
alter table public.vapi_taxonomy_versions enable row level security;
alter table public.vapi_assessment_version_link enable row level security;
alter table public.vapi_coach_relationships enable row level security;
alter table public.vapi_session_briefs enable row level security;
alter table public.vapi_pattern_alerts enable row level security;
alter table public.vapi_cohort_snapshots enable row level security;
alter table public.vapi_shareable_results enable row level security;
alter table public.vapi_referral_attributions enable row level security;
alter table public.vapi_peer_marketplace_coaches enable row level security;
alter table public.vapi_notification_preferences enable row level security;
alter table public.vapi_notification_events enable row level security;
alter table public.vapi_analytics_events enable row level security;

-- Helper: user's email (lowercased)
create or replace function public.auth_email_lower() returns text language sql stable as $$
  select lower(coalesce((auth.jwt() ->> 'email')::text, ''))
$$;

-- User reads own rituals
create policy "users read own morning checkins" on public.vapi_morning_checkins
  for select using (lower(email) = public.auth_email_lower());
create policy "users read own evening reviews" on public.vapi_evening_reviews
  for select using (lower(email) = public.auth_email_lower());
create policy "users read own monthly pulses" on public.vapi_monthly_pulses
  for select using (lower(email) = public.auth_email_lower());

-- User reads own presence events
create policy "users read own presence events" on public.vapi_presence_trigger_events
  for select using (lower(email) = public.auth_email_lower());

-- User reads own notification prefs
create policy "users read own notif prefs" on public.vapi_notification_preferences
  for select using (lower(email) = public.auth_email_lower());
create policy "users update own notif prefs" on public.vapi_notification_preferences
  for update using (lower(email) = public.auth_email_lower());

-- User reads own referrals
create policy "users read own referrals out" on public.vapi_referral_attributions
  for select using (lower(referrer_email) = public.auth_email_lower());

-- User reads own shareable results
create policy "users read own shareable" on public.vapi_shareable_results
  for select using (lower(email) = public.auth_email_lower());

-- Public can resolve a share hash (read-only, no email exposed server-side; handler strips PII)
create policy "public can resolve share hash" on public.vapi_shareable_results
  for select using (true);

-- Public can browse active marketplace coaches + trigger versions + taxonomy versions
create policy "public read active marketplace coaches" on public.vapi_peer_marketplace_coaches
  for select using (active = true and approved = true);
create policy "public read active trigger version" on public.vapi_presence_trigger_versions
  for select using (active = true);
create policy "public read active taxonomy version" on public.vapi_taxonomy_versions
  for select using (active = true);

-- Coach reads: hardcoded coach email list for V1. Multi-coach upgrade later uses vapi_coach_relationships.
create or replace function public.is_vapi_coach() returns boolean language sql stable as $$
  select public.auth_email_lower() in ('jacob@alignedpower.coach','jake@alignedpower.coach')
$$;

create policy "coach reads all morning checkins" on public.vapi_morning_checkins
  for select using (public.is_vapi_coach());
create policy "coach reads all evening reviews" on public.vapi_evening_reviews
  for select using (public.is_vapi_coach());
create policy "coach reads all monthly pulses" on public.vapi_monthly_pulses
  for select using (public.is_vapi_coach());
create policy "coach reads all presence events" on public.vapi_presence_trigger_events
  for select using (public.is_vapi_coach());
create policy "coach reads relationships" on public.vapi_coach_relationships
  for select using (lower(coach_email) = public.auth_email_lower() or public.is_vapi_coach());
create policy "coach reads own session briefs" on public.vapi_session_briefs
  for select using (lower(coach_email) = public.auth_email_lower() or public.is_vapi_coach());
create policy "coach reads own pattern alerts" on public.vapi_pattern_alerts
  for select using (lower(coach_email) = public.auth_email_lower() or public.is_vapi_coach());
create policy "coach reads own cohort snapshots" on public.vapi_cohort_snapshots
  for select using (lower(coach_email) = public.auth_email_lower() or public.is_vapi_coach());
