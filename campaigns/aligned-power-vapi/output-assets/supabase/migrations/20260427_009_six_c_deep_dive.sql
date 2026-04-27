-- 20260427_009_six_c_deep_dive
--
-- Adds support for the score-driven deep-dive scorecard format.
-- Old entries continue to work as-is (deep_dive_dimension stays NULL,
-- weekly_review.reflections retains the legacy 6-entry shape).
-- New entries populate deep_dive_dimension and richer keys in weekly_review
-- JSONB (deepDive, quickTaps).
--
-- Strictly additive per the VAPI data-model conventions: no existing column
-- or row is modified.

alter table public.six_c_submissions
  add column if not exists deep_dive_dimension text;

comment on column public.six_c_submissions.deep_dive_dimension is
  'Which 6C dimension the user picked for the weekly deep-dive reflection (clarity | coherence | capacity | confidence | courage | connection). NULL on legacy entries that asked all 6 reflections.';

create index if not exists six_c_submissions_deep_dive_dimension_idx
  on public.six_c_submissions(deep_dive_dimension)
  where deep_dive_dimension is not null;

-- weekly_review JSONB shape (new entries):
--   {
--     "deepDive": {
--       "dimension": "capacity",
--       "mode": "diagnostic",
--       "response": "...",
--       "signal": "low_score"
--     },
--     "quickTaps": {
--       "clarity": "steady",
--       "coherence": "needs_attention",
--       "courage": "cant_tell",
--       ...
--     }
--   }
-- Legacy entries retain their { "reflections": { ... } } shape.
-- Display code branches on the presence of deep_dive_dimension.
