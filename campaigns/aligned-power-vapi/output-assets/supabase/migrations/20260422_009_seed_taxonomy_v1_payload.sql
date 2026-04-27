-- Wave 1 follow-up: Seed v1.0.0 of vapi_taxonomy_versions with the actual VAPI payload.
-- Idempotent: UPDATE only the v1.0.0 row. Safe to re-run.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

UPDATE public.vapi_taxonomy_versions
SET
  questions = '[
    {"code":"PH","domain":"Physical Health","arena":"Personal","items_per_domain":6,"scale":"1-10","reverse_items":1,"weight_tiers":{"anchor":1,"standard":3,"supporting":2}},
    {"code":"IA","domain":"Inner Alignment","arena":"Personal"},
    {"code":"ME","domain":"Mental & Emotional Health","arena":"Personal"},
    {"code":"AF","domain":"Attention & Focus","arena":"Personal"},
    {"code":"RS","domain":"Relationship to Self","arena":"Relationships"},
    {"code":"FA","domain":"Family","arena":"Relationships"},
    {"code":"CO","domain":"Community","arena":"Relationships"},
    {"code":"WI","domain":"World & Impact","arena":"Relationships"},
    {"code":"VS","domain":"Vision & Strategy","arena":"Business"},
    {"code":"EX","domain":"Execution","arena":"Business"},
    {"code":"OH","domain":"Operational Health","arena":"Business"},
    {"code":"EC","domain":"Ecology","arena":"Business"}
  ]'::jsonb,
  archetype_definitions = '{"archetypes":[
    {"key":"the_architect","name":"The Architect","tier":"integrated","priority":1,"rule":"all_arenas_gte_8_and_no_domain_lt_7"},
    {"key":"the_journeyman","name":"The Journeyman","tier":"progressing","priority":2,"rule":"composite_gte_7_with_lagging_arena"},
    {"key":"the_performer","name":"The Performer","tier":"high_functioning","priority":3,"rule":"business_gte_8_personal_lt_6"},
    {"key":"the_engine","name":"The Engine","tier":"high_functioning","priority":4,"rule":"execution_gte_8_low_reflection"},
    {"key":"the_phoenix","name":"The Phoenix","tier":"rising","priority":5,"rule":"low_to_mid_ascending_trajectory"},
    {"key":"the_seeker","name":"The Seeker","tier":"mid","priority":6,"rule":"functional_with_inner_alignment_focus"},
    {"key":"the_guardian","name":"The Guardian","tier":"mid","priority":7,"rule":"relationships_strong_business_weak"},
    {"key":"the_drifter","name":"The Drifter","tier":"below","priority":8,"rule":"composite_lt_5_scattered"},
    {"key":"the_ghost","name":"The Ghost","tier":"crisis","priority":9,"rule":"composite_lt_4_with_dignity"}
  ]}'::jsonb,
  driver_definitions = '{"drivers":[
    {"key":"achievers_trap","name":"The Achievers Trap","program_phase":"Phase 2"},
    {"key":"escape_artist","name":"The Escape Artist","program_phase":"Phase 3"},
    {"key":"pleasers_bind","name":"The Pleasers Bind","program_phase":"Phase 2"},
    {"key":"imposter_loop","name":"The Imposter Loop","program_phase":"Phase 3"},
    {"key":"perfectionists_prison","name":"The Perfectionists Prison","program_phase":"Phase 4"},
    {"key":"protector","name":"The Protector","program_phase":"Phase 2"},
    {"key":"martyr_complex","name":"The Martyr Complex","program_phase":"Phase 4"},
    {"key":"fog","name":"The Fog","program_phase":"Phase 1"},
    {"key":"scattered_mind","name":"The Scattered Mind","program_phase":"Phase 1"},
    {"key":"builders_gap","name":"The Builders Gap","program_phase":"Phase 3"},
    {"key":"aligned_momentum","name":"Aligned Momentum","program_phase":"Phase 5"}
  ]}'::jsonb,
  scoring_rules = '{
    "domain_score":"weighted_avg_of_items",
    "arena_score":"avg_of_domains",
    "composite":"avg_of_arenas",
    "tier_bands":{
      "dialed":{"min":7.0},
      "functional":{"min":5.5,"max":6.99},
      "below":{"min":4.0,"max":5.49},
      "critical":{"max":3.99}
    }
  }'::jsonb,
  priority_matrix_copy = '{
    "critical_priority":{"template":"{{domain}} is low-scoring and highly important. This is where movement pays compounding returns."},
    "protect_and_sustain":{"template":"{{domain}} is strong and matters. Protect this. Do not trade it for a lower-leverage domain."},
    "monitor":{"template":"{{domain}} is low-scoring but low importance right now. Watch it, do not invest in it."},
    "overinvestment":{"template":"{{domain}} scores high but is not a current priority. Consider whether the attention is earned."}
  }'::jsonb,
  notes = 'Current production VAPI taxonomy. 12 domains, 3 arenas, 72 questions, 9 archetypes, 10+1 drivers. Scoring rules match the VAPI engine in vapi-driver-scoring.js.'
WHERE version = 'v1.0.0';
