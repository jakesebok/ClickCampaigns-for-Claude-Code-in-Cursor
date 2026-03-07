-- Coach notes: one notes block per client, editable by coach.
-- Run this in Supabase SQL Editor.

CREATE TABLE IF NOT EXISTS public.coach_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_email text UNIQUE NOT NULL,
  notes text,
  updated_at timestamptz DEFAULT now()
);

-- RLS: block direct access; coach notes API uses service role (bypasses RLS).
ALTER TABLE public.coach_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct access" ON public.coach_notes
  FOR ALL USING (false) WITH CHECK (false);

GRANT ALL ON public.coach_notes TO service_role;
