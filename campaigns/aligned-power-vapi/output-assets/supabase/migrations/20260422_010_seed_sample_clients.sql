-- Wave 1 demo seed: anonymized [SAMPLE] clients for the coach dashboard demo.
-- Idempotent: deletes any existing sample-* rows first, then re-inserts.
-- Easy to purge: DELETE FROM public.vapi_results WHERE email LIKE 'sample-%@axiom.demo';
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

-- Cleanup
DELETE FROM public.vapi_evening_reviews WHERE email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_morning_checkins WHERE email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_results WHERE email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_pattern_alerts WHERE client_email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_coach_relationships WHERE client_email LIKE 'sample-%@axiom.demo';
DELETE FROM public.portal_active_clients WHERE email LIKE 'sample-%@axiom.demo';
DELETE FROM public.vapi_notification_preferences WHERE email LIKE 'sample-%@axiom.demo';

-- Active client flag
INSERT INTO public.portal_active_clients (email, active_client) VALUES
  ('sample-maya@axiom.demo', true),
  ('sample-darren@axiom.demo', true),
  ('sample-sara@axiom.demo', true),
  ('sample-leo@axiom.demo', true)
ON CONFLICT (email) DO UPDATE SET active_client = EXCLUDED.active_client;

-- Coach relationships
INSERT INTO public.vapi_coach_relationships (coach_email, client_email, status, started_at) VALUES
  ('jacob@alignedpower.coach', 'sample-maya@axiom.demo',   'active', now() - interval '90 days'),
  ('jacob@alignedpower.coach', 'sample-darren@axiom.demo', 'active', now() - interval '75 days'),
  ('jacob@alignedpower.coach', 'sample-sara@axiom.demo',   'active', now() - interval '120 days'),
  ('jacob@alignedpower.coach', 'sample-leo@axiom.demo',    'active', now() - interval '40 days')
ON CONFLICT (coach_email, client_email) DO NOTHING;

-- Notification prefs (so cron has rows to process)
INSERT INTO public.vapi_notification_preferences (email, timezone, morning_time, evening_time) VALUES
  ('sample-maya@axiom.demo',   'America/New_York',    '06:00', '17:00'),
  ('sample-darren@axiom.demo', 'America/New_York',    '06:30', '19:00'),
  ('sample-sara@axiom.demo',   'America/Los_Angeles', '06:00', '17:30'),
  ('sample-leo@axiom.demo',    'America/Chicago',     '07:00', '17:00')
ON CONFLICT (email) DO NOTHING;

-- vapi_results — full spec-compliant payloads (5 rows: 2 for Maya showing trajectory, 1 each for Darren/Sara/Leo)
-- Tier strings exactly as VAPI engine uses: Dialed | Functional | Below the Line | In the Red

-- Maya — earlier (90 days ago): The Performer, Below the Line composite
INSERT INTO public.vapi_results (email, first_name, last_name, source, created_at, results) VALUES
('sample-maya@axiom.demo', '[SAMPLE] Maya', 'Chen', 'marketing', now() - interval '90 days', jsonb_build_object(
  'overall', 5.8,
  'overallTier', 'Below the Line',
  'archetype', 'The Performer',
  'driver', jsonb_build_object('name', 'The Achievers Trap'),
  'arenaScores', jsonb_build_object('Personal', 5.2, 'Relationships', 6.0, 'Business', 7.1),
  'arenaTiers', jsonb_build_object('Personal', 'Below the Line', 'Relationships', 'Functional', 'Business', 'Functional'),
  'domainScores', jsonb_build_object('PH',4.5,'IA',5.2,'ME',5.8,'AF',5.5,'RS',5.5,'FA',6.2,'CO',6.0,'WI',6.3,'VS',7.5,'EX',8.0,'OH',6.5,'EC',6.4),
  'domains', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','arena','Personal','score',4.5,'tier','Below the Line'),
    jsonb_build_object('code','IA','domain','Inner Alignment','arena','Personal','score',5.2,'tier','Below the Line'),
    jsonb_build_object('code','ME','domain','Mental & Emotional Health','arena','Personal','score',5.8,'tier','Below the Line'),
    jsonb_build_object('code','AF','domain','Attention & Focus','arena','Personal','score',5.5,'tier','Below the Line'),
    jsonb_build_object('code','RS','domain','Relationship to Self','arena','Relationships','score',5.5,'tier','Below the Line'),
    jsonb_build_object('code','FA','domain','Family','arena','Relationships','score',6.2,'tier','Functional'),
    jsonb_build_object('code','CO','domain','Community','arena','Relationships','score',6.0,'tier','Functional'),
    jsonb_build_object('code','WI','domain','World & Impact','arena','Relationships','score',6.3,'tier','Functional'),
    jsonb_build_object('code','VS','domain','Vision & Strategy','arena','Business','score',7.5,'tier','Functional'),
    jsonb_build_object('code','EX','domain','Execution','arena','Business','score',8.0,'tier','Dialed'),
    jsonb_build_object('code','OH','domain','Operational Health','arena','Business','score',6.5,'tier','Functional'),
    jsonb_build_object('code','EC','domain','Ecology','arena','Business','score',6.4,'tier','Functional')
  ),
  'importanceRatings', jsonb_build_object('PH',9,'IA',8,'ME',9,'AF',7,'RS',8,'FA',9,'CO',5,'WI',6,'VS',9,'EX',9,'OH',7,'EC',6),
  'top3', jsonb_build_array(
    jsonb_build_object('code','EX','domain','Execution','score',8.0,'tier','Dialed'),
    jsonb_build_object('code','VS','domain','Vision & Strategy','score',7.5,'tier','Functional'),
    jsonb_build_object('code','OH','domain','Operational Health','score',6.5,'tier','Functional')
  ),
  'bottom3', jsonb_build_array(
    jsonb_build_object('code','PH','domain','Physical Health','score',4.5,'tier','Below the Line'),
    jsonb_build_object('code','IA','domain','Inner Alignment','score',5.2,'tier','Below the Line'),
    jsonb_build_object('code','AF','domain','Attention & Focus','score',5.5,'tier','Below the Line')
  ),
  'priorityMatrix', jsonb_build_object(
    'criticalPriority', jsonb_build_array(
      jsonb_build_object('code','PH','domain','Physical Health','score',4.5,'importance',9,'tier','Below the Line'),
      jsonb_build_object('code','IA','domain','Inner Alignment','score',5.2,'importance',8,'tier','Below the Line'),
      jsonb_build_object('code','ME','domain','Mental & Emotional Health','score',5.8,'importance',9,'tier','Below the Line'),
      jsonb_build_object('code','AF','domain','Attention & Focus','score',5.5,'importance',7,'tier','Below the Line'),
      jsonb_build_object('code','RS','domain','Relationship to Self','score',5.5,'importance',8,'tier','Below the Line')
    ),
    'protectAndSustain', jsonb_build_array(
      jsonb_build_object('code','FA','domain','Family','score',6.2,'importance',9,'tier','Functional'),
      jsonb_build_object('code','VS','domain','Vision & Strategy','score',7.5,'importance',9,'tier','Functional'),
      jsonb_build_object('code','EX','domain','Execution','score',8.0,'importance',9,'tier','Dialed'),
      jsonb_build_object('code','OH','domain','Operational Health','score',6.5,'importance',7,'tier','Functional')
    ),
    'monitor', jsonb_build_array(
      jsonb_build_object('code','CO','domain','Community','score',6.0,'importance',5,'tier','Functional'),
      jsonb_build_object('code','EC','domain','Ecology','score',6.4,'importance',6,'tier','Functional'),
      jsonb_build_object('code','WI','domain','World & Impact','score',6.3,'importance',6,'tier','Functional')
    ),
    'overInvestment', jsonb_build_array()
  ),
  'acquiescence', false,
  'allResponses', jsonb_build_object(),
  'contextualProfile', jsonb_build_object('revenueStage','growth','teamSize','6-10','lifeStage','active-family','timeInBusiness','5+_years','primaryChallenge','sustainable-execution')
));

-- See migrations 20260422_010_seed_sample_clients_part2.sql for the remaining 4 vapi_results rows
-- and 20260422_011_seed_sample_rituals.sql for morning/evening/alerts seed.
