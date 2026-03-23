-- My Plan / 28-day sprints (VAPI-driven). Run in Supabase SQL Editor after vapi_results exists.
-- APIs use the service role; RLS blocks direct client access.

-- Optional: ensure vapi_results can record where the assessment was submitted (portal already may have this for Alfred).
ALTER TABLE IF EXISTS public.vapi_results
  ADD COLUMN IF NOT EXISTS source text;

COMMENT ON COLUMN public.vapi_results.source IS 'Assessment origin: marketing | portal | alfred | app (app treated as alfred for My Plan surface).';

CREATE TABLE IF NOT EXISTS public.sprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email text NOT NULL,
  vapi_result_id uuid,
  assessment_source text NOT NULL DEFAULT 'marketing',
  primary_surface text NOT NULL DEFAULT 'portal',
  status text NOT NULL DEFAULT 'active',
  sprint_type text NOT NULL DEFAULT 'auto',
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  coach_context text,
  coach_private_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sprints_user_email ON public.sprints (lower(user_email));
CREATE INDEX IF NOT EXISTS idx_sprints_status ON public.sprints (status);
CREATE INDEX IF NOT EXISTS idx_sprints_vapi ON public.sprints (vapi_result_id);

-- At most one active sprint per user (case-insensitive email)
CREATE UNIQUE INDEX IF NOT EXISTS sprints_one_active_per_email
  ON public.sprints (lower(user_email))
  WHERE status = 'active';

COMMENT ON TABLE public.sprints IS '28-day My Plan payload; primary_surface = portal | alfred (assessment origin / analytics; full plan is shown on both surfaces).';
COMMENT ON COLUMN public.sprints.primary_surface IS 'Where the user took the assessment that created this sprint (portal vs alfred). Does not gate which app can display the plan.';
COMMENT ON COLUMN public.sprints.payload IS 'version, title, summary, weeks[], archetype, driver, generatedAt, etc.';

ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "No direct sprints access" ON public.sprints;
CREATE POLICY "No direct sprints access" ON public.sprints
  FOR ALL USING (false) WITH CHECK (false);

GRANT ALL ON public.sprints TO service_role;
