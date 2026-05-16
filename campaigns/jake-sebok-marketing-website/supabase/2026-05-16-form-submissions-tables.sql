-- ============================================================================
-- Marketing site form submissions — Supabase tables (2026-05-16)
--
-- Creates two tables to replace Formspree for:
--   - The contact form at jakesebok.com/contact
--   - The Work With Me application form at jakesebok.com/work-with-me/apply
--
-- HOW TO RUN (Supabase dashboard → SQL Editor):
--   1. Open the Aligned Power "Client Dashboard" project (the one the
--      marketing site already uses for build-intake + VAPI results).
--   2. Click SQL Editor → "+ New query".
--   3. Paste this entire file and click Run.
--   4. Confirm "Success. No rows returned" and that both tables appear in
--      Database → Tables.
--
-- Safe to re-run: every CREATE uses IF NOT EXISTS.
-- ============================================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL    DEFAULT now(),
  email       text        NOT NULL,
  name        text        NOT NULL,
  message     text        NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_email_lower
  ON contact_submissions (LOWER(email));


CREATE TABLE IF NOT EXISTS apply_submissions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz NOT NULL    DEFAULT now(),
  email       text        NOT NULL,
  name        text        NOT NULL,
  business    text        NOT NULL,
  revenue     text        NOT NULL,
  why         text        NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_apply_submissions_created_at
  ON apply_submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_apply_submissions_email_lower
  ON apply_submissions (LOWER(email));
