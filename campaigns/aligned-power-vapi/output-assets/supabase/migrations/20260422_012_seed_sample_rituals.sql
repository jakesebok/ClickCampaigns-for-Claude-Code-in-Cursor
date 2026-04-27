-- Wave 1 demo seed: morning check-ins, evening reviews, and pattern alerts for the sample clients
-- Run after 20260422_011_seed_sample_clients_part2.sql.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

-- Morning check-ins
-- Maya: 7 mornings (active)
INSERT INTO public.vapi_morning_checkins (email, completed_at, local_date, priorities, honored_domain, alignment_intention, timezone)
SELECT 'sample-maya@axiom.demo', (now()::date - d)::timestamptz + interval '6 hours', (now()::date - d),
  '[{"text":"Finish Q2 plan draft","domain_code":"VS"},{"text":"Call mom","domain_code":"FA"},{"text":"Strength session 30 min","domain_code":"PH"}]'::jsonb,
  'VS', 'I close the loop on the thing I have been avoiding.', 'America/New_York'
FROM generate_series(0,6) d
ON CONFLICT (email, local_date) DO NOTHING;

-- Darren: 5 mornings (overextended)
INSERT INTO public.vapi_morning_checkins (email, completed_at, local_date, priorities, honored_domain, alignment_intention, timezone)
SELECT 'sample-darren@axiom.demo', (now()::date - d)::timestamptz + interval '7 hours', (now()::date - d),
  '[{"text":"Ship pitch","domain_code":"EX"},{"text":"Kids pickup","domain_code":"FA"},{"text":"Walk dog","domain_code":"PH"},{"text":"Investor calls","domain_code":"VS"},{"text":"Board update","domain_code":"VS"},{"text":"Demo prep","domain_code":"EX"}]'::jsonb,
  'EX', 'I finish the pitch without another delay.', 'America/New_York'
FROM generate_series(0,4) d
ON CONFLICT (email, local_date) DO NOTHING;

-- Sara: 7 mornings (clean)
INSERT INTO public.vapi_morning_checkins (email, completed_at, local_date, priorities, honored_domain, alignment_intention, timezone)
SELECT 'sample-sara@axiom.demo', (now()::date - d)::timestamptz + interval '5 hours 45 minutes', (now()::date - d),
  '[{"text":"Team one-on-ones","domain_code":"OH"},{"text":"Strategic writing","domain_code":"VS"},{"text":"Walk and coffee with John","domain_code":"FA"}]'::jsonb,
  'OH', 'I end the day feeling present, not productive.', 'America/New_York'
FROM generate_series(0,6) d
ON CONFLICT (email, local_date) DO NOTHING;

-- Leo: 3 mornings (sporadic)
INSERT INTO public.vapi_morning_checkins (email, completed_at, local_date, priorities, honored_domain, alignment_intention, timezone)
SELECT 'sample-leo@axiom.demo', (now()::date - d)::timestamptz + interval '6 hours 30 minutes', (now()::date - d),
  '[{"text":"Deep work","domain_code":"AF"},{"text":"Feedback session","domain_code":"OH"}]'::jsonb,
  'AF', 'I trust my voice in the feedback session.', 'America/New_York'
FROM (VALUES (0),(2),(4)) AS t(d)
ON CONFLICT (email, local_date) DO NOTHING;

-- Evening reviews
-- Maya: 7 days, 2 drift days (the V-02 driver-persistence pattern)
INSERT INTO public.vapi_evening_reviews (email, completed_at, local_date, day_type, prompt_id, prompt_text, response, priorities_honored_count, drivers_echoed, timezone)
SELECT 'sample-maya@axiom.demo', (now()::date - d)::timestamptz + interval '17 hours 15 minutes', (now()::date - d),
  CASE WHEN d IN (1,4) THEN 'drift' ELSE 'aligned' END,
  CASE WHEN d IN (1,4) THEN 'vapi-eve-02' ELSE 'vapi-eve-01' END,
  CASE WHEN d IN (1,4) THEN 'A priority slipped. Name the exact moment the justification arrived.' ELSE 'Today honored your plan. Name one thing this alignment did not prove about you.' END,
  CASE WHEN d IN (1,4) THEN 'Took the meeting I could have declined. Justification arrived the second I saw her name in the calendar.' ELSE 'That I needed to do it all to prove worth. Still true on some days. Not today.' END,
  CASE WHEN d IN (1,4) THEN 1 ELSE 3 END,
  CASE WHEN d IN (1,4) THEN ARRAY['achievers_trap','pleasers_bind'] ELSE ARRAY[]::text[] END,
  'America/New_York'
FROM generate_series(0,6) d
ON CONFLICT (email, local_date) DO NOTHING;

-- Darren: 4 consecutive drift days (high-severity pattern alert candidate)
INSERT INTO public.vapi_evening_reviews (email, completed_at, local_date, day_type, prompt_id, prompt_text, response, priorities_honored_count, drivers_echoed, timezone)
SELECT 'sample-darren@axiom.demo', (now()::date - d)::timestamptz + interval '19 hours', (now()::date - d),
  'drift', 'vapi-eve-02', 'A priority slipped. Name the exact moment the justification arrived.',
  'Told myself I would ship tomorrow. Tomorrow arrived. Still told myself tomorrow.',
  0, ARRAY['escape_artist','fog'], 'America/New_York'
FROM generate_series(0,3) d
ON CONFLICT (email, local_date) DO NOTHING;

-- Sara: 7 days, mostly aligned
INSERT INTO public.vapi_evening_reviews (email, completed_at, local_date, day_type, prompt_id, prompt_text, response, priorities_honored_count, drivers_echoed, timezone)
SELECT 'sample-sara@axiom.demo', (now()::date - d)::timestamptz + interval '17 hours 30 minutes', (now()::date - d),
  CASE WHEN d = 3 THEN 'scratch' ELSE 'aligned' END,
  CASE WHEN d = 3 THEN 'vapi-eve-03' ELSE 'vapi-eve-01' END,
  CASE WHEN d = 3 THEN 'Ordinary day. Rich on practice.' ELSE 'Today honored your plan.' END,
  CASE WHEN d = 3 THEN 'Noticed I stopped apologizing in the team call. First time.' ELSE 'That I needed more to be enough.' END,
  3, ARRAY[]::text[], 'America/New_York'
FROM generate_series(0,6) d
ON CONFLICT (email, local_date) DO NOTHING;

-- Leo: 3 evenings, mostly drift (Imposter Loop persistence)
INSERT INTO public.vapi_evening_reviews (email, completed_at, local_date, day_type, prompt_id, prompt_text, response, priorities_honored_count, drivers_echoed, timezone) VALUES
  ('sample-leo@axiom.demo', now() - interval '1 day' + interval '20 hours', (now()::date - 1), 'drift', 'vapi-eve-02', 'A priority slipped. Name the exact moment the justification arrived.', 'Felt my voice get smaller after the first pushback. Folded.', 1, ARRAY['imposter_loop'], 'America/New_York'),
  ('sample-leo@axiom.demo', now() - interval '3 days' + interval '20 hours', (now()::date - 3), 'drift', 'vapi-eve-02', 'A priority slipped. Name the exact moment the justification arrived.', 'Same pattern.', 1, ARRAY['imposter_loop','pleasers_bind'], 'America/New_York'),
  ('sample-leo@axiom.demo', now() - interval '5 days' + interval '20 hours', (now()::date - 5), 'aligned', 'vapi-eve-01', 'Today honored your plan.', 'Got through the whole agenda without rehashing.', 2, ARRAY[]::text[], 'America/New_York')
ON CONFLICT (email, local_date) DO NOTHING;

-- Pattern alerts for Jake's coach dashboard demo
INSERT INTO public.vapi_pattern_alerts (coach_email, client_email, alert_type, severity, payload) VALUES
  ('jacob@alignedpower.coach', 'sample-darren@axiom.demo', 'drift_streak', 'high',
   '{"summary":"Four consecutive evening reviews marked drift. Escape Artist echoed all four days.","trigger_id":"V-02","suggested_action":"Open the next session with the specific moment he started telling himself tomorrow."}'::jsonb),
  ('jacob@alignedpower.coach', 'sample-leo@axiom.demo', 'driver_persistence', 'normal',
   '{"summary":"Imposter Loop echoed three of last five evenings. Pattern forming around feedback situations.","trigger_id":"V-02","suggested_action":"Name the fold pattern. The fold is the data."}'::jsonb),
  ('jacob@alignedpower.coach', 'sample-maya@axiom.demo', 'driver_persistence', 'low',
   '{"summary":"Achievers Trap echoing weekly. Still the primary driver from onboarding. Execution score climbing as Physical Health stays flat.","trigger_id":"V-02","suggested_action":"Ask what her body tells her on the days she says yes to one more thing."}'::jsonb);
