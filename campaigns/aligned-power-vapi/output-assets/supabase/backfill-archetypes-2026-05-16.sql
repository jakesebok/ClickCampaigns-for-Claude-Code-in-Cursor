-- ============================================================================
-- Archetype backfill — Phoenix gate widening (2026-05-16)
--
-- Recomputes the archetype for every vapi_results row using the current canonical
-- logic from lib/portal-server/vapi-enrich-for-storage.js, including the newly
-- added Phoenix trigger:
--     overall <= 5.0 AND min(personal, relationships, business) <= 3.5
--
-- HOW TO RUN (Supabase dashboard → SQL Editor):
--   1. Open the Aligned Power "Client Dashboard" project.
--   2. Click SQL Editor in the left sidebar, then "+ New query".
--   3. Paste this entire file into the editor.
--   4. To preview: highlight ONLY the STEP 1 block and click Run.
--      You'll see one row per archetype that would change. No writes happen.
--   5. To apply: highlight ONLY the STEP 2 block and click Run.
--      That UPDATEs each row's results.archetype. No other field is touched.
--
-- Optional: test on a single user first by uncommenting the WHERE clauses
-- marked "TEST FILTER" in both steps.
-- ============================================================================


-- =================================================================
-- STEP 1: DRY-RUN — preview which rows would change
-- =================================================================
WITH scored AS (
  SELECT
    id,
    email,
    first_name,
    last_name,
    created_at,
    results->>'archetype' AS stored_archetype,
    NULLIF(results->>'overall', '')::numeric AS overall,
    NULLIF(results->'arenaScores'->>'Personal', '')::numeric AS personal,
    NULLIF(results->'arenaScores'->>'Relationships', '')::numeric AS relationships,
    NULLIF(results->'arenaScores'->>'Business', '')::numeric AS business,
    NULLIF(results->'domainScores'->>'EX', '')::numeric AS ex,
    NULLIF(results->'domainScores'->>'EC', '')::numeric AS ec,
    NULLIF(results->'domainScores'->>'VS', '')::numeric AS vs
  FROM vapi_results
  -- TEST FILTER (uncomment to limit to one user):
  -- WHERE LOWER(email) = 'holy.nutrition129@gmail.com'
),
flagged AS (
  SELECT *,
    LEAST(personal, relationships, business)    AS lowest_arena,
    GREATEST(personal, relationships, business) AS highest_arena,
    (CASE WHEN personal      >= 7.5 THEN 1 ELSE 0 END
   + CASE WHEN relationships >= 7.5 THEN 1 ELSE 0 END
   + CASE WHEN business      >= 7.5 THEN 1 ELSE 0 END) AS near_architect_count,
    (CASE WHEN personal      <= 4.5 THEN 1 ELSE 0 END
   + CASE WHEN relationships <= 4.5 THEN 1 ELSE 0 END
   + CASE WHEN business      <= 4.5 THEN 1 ELSE 0 END) AS arenas_low
  FROM scored
),
computed AS (
  SELECT *,
    CASE
      WHEN personal IS NULL OR relationships IS NULL OR business IS NULL
        THEN stored_archetype
      -- Priority 1: Architect
      WHEN personal >= 8.0 AND relationships >= 8.0 AND business >= 8.0
        THEN 'The Architect'
      -- Priority 2: Journeyman
      WHEN overall >= 7.0 AND near_architect_count >= 2 AND lowest_arena >= 6.5
        THEN 'The Journeyman'
      -- Priority 3: Phoenix (including the new third gate)
      WHEN overall <= 4.5                           THEN 'The Phoenix'
      WHEN arenas_low >= 2                          THEN 'The Phoenix'
      WHEN overall <= 5.0 AND lowest_arena <= 3.5   THEN 'The Phoenix'  -- NEW
      -- Priority 4: Engine
      WHEN ex >= 7.0 AND (ec <= 5.0 OR vs <= 5.0)
        THEN 'The Engine'
      -- Priority 5: Drifter narrow (matches storage logic)
      WHEN personal      >= 5.0 AND personal      <= 7.9
       AND relationships >= 5.0 AND relationships <= 7.9
       AND business      >= 5.0 AND business      <= 7.9
       AND (highest_arena - lowest_arena) <= 2.0
        THEN 'The Drifter'
      -- Priority 6: Performer
      WHEN business > personal AND business > relationships
       AND (business - personal) >= 2.0
        THEN 'The Performer'
      -- Priority 7: Ghost
      WHEN business > personal AND business > relationships
       AND relationships < personal AND (business - relationships) >= 2.0
        THEN 'The Ghost'
      -- Priority 8: Guardian
      WHEN relationships > personal AND relationships > business
       AND business < personal AND (relationships - business) >= 2.0
        THEN 'The Guardian'
      -- Priority 9: Seeker
      WHEN personal > relationships AND personal > business
       AND business < relationships AND (personal - business) >= 2.0
        THEN 'The Seeker'
      -- Fallback
      ELSE 'The Drifter'
    END AS computed_archetype
  FROM flagged
)
SELECT
  email,
  TRIM(BOTH ' ' FROM COALESCE(first_name,'') || ' ' || COALESCE(last_name,'')) AS name,
  ROUND(personal, 1)      AS personal,
  ROUND(relationships, 1) AS relationships,
  ROUND(business, 1)      AS business,
  ROUND(overall, 1)       AS overall,
  stored_archetype,
  computed_archetype
FROM computed
WHERE stored_archetype IS DISTINCT FROM computed_archetype
ORDER BY created_at DESC;


-- =================================================================
-- STEP 2: APPLY — write the changes
-- Only run this after reviewing STEP 1 output and confirming it looks right.
-- =================================================================
WITH scored AS (
  SELECT
    id,
    results,
    results->>'archetype' AS stored_archetype,
    NULLIF(results->>'overall', '')::numeric AS overall,
    NULLIF(results->'arenaScores'->>'Personal', '')::numeric AS personal,
    NULLIF(results->'arenaScores'->>'Relationships', '')::numeric AS relationships,
    NULLIF(results->'arenaScores'->>'Business', '')::numeric AS business,
    NULLIF(results->'domainScores'->>'EX', '')::numeric AS ex,
    NULLIF(results->'domainScores'->>'EC', '')::numeric AS ec,
    NULLIF(results->'domainScores'->>'VS', '')::numeric AS vs
  FROM vapi_results
  -- TEST FILTER (uncomment to limit to one user):
  -- WHERE LOWER(email) = 'holy.nutrition129@gmail.com'
),
flagged AS (
  SELECT *,
    LEAST(personal, relationships, business)    AS lowest_arena,
    GREATEST(personal, relationships, business) AS highest_arena,
    (CASE WHEN personal      >= 7.5 THEN 1 ELSE 0 END
   + CASE WHEN relationships >= 7.5 THEN 1 ELSE 0 END
   + CASE WHEN business      >= 7.5 THEN 1 ELSE 0 END) AS near_architect_count,
    (CASE WHEN personal      <= 4.5 THEN 1 ELSE 0 END
   + CASE WHEN relationships <= 4.5 THEN 1 ELSE 0 END
   + CASE WHEN business      <= 4.5 THEN 1 ELSE 0 END) AS arenas_low
  FROM scored
),
computed AS (
  SELECT id, stored_archetype,
    CASE
      WHEN personal IS NULL OR relationships IS NULL OR business IS NULL
        THEN stored_archetype
      WHEN personal >= 8.0 AND relationships >= 8.0 AND business >= 8.0
        THEN 'The Architect'
      WHEN overall >= 7.0 AND near_architect_count >= 2 AND lowest_arena >= 6.5
        THEN 'The Journeyman'
      WHEN overall <= 4.5                           THEN 'The Phoenix'
      WHEN arenas_low >= 2                          THEN 'The Phoenix'
      WHEN overall <= 5.0 AND lowest_arena <= 3.5   THEN 'The Phoenix'
      WHEN ex >= 7.0 AND (ec <= 5.0 OR vs <= 5.0)   THEN 'The Engine'
      WHEN personal      >= 5.0 AND personal      <= 7.9
       AND relationships >= 5.0 AND relationships <= 7.9
       AND business      >= 5.0 AND business      <= 7.9
       AND (highest_arena - lowest_arena) <= 2.0
        THEN 'The Drifter'
      WHEN business > personal AND business > relationships
       AND (business - personal) >= 2.0
        THEN 'The Performer'
      WHEN business > personal AND business > relationships
       AND relationships < personal AND (business - relationships) >= 2.0
        THEN 'The Ghost'
      WHEN relationships > personal AND relationships > business
       AND business < personal AND (relationships - business) >= 2.0
        THEN 'The Guardian'
      WHEN personal > relationships AND personal > business
       AND business < relationships AND (personal - business) >= 2.0
        THEN 'The Seeker'
      ELSE 'The Drifter'
    END AS computed_archetype
  FROM flagged
)
UPDATE vapi_results AS v
SET results = jsonb_set(v.results, '{archetype}', to_jsonb(c.computed_archetype))
FROM computed c
WHERE v.id = c.id
  AND c.stored_archetype IS DISTINCT FROM c.computed_archetype;
