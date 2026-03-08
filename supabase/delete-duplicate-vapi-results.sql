-- Delete duplicate/bogus VAPI submissions
-- Use case: Remove submissions that appear to be duplicates or not sincere
-- (e.g. two submissions 28 seconds apart from the same email on the same day)
--
-- INSTRUCTIONS:
-- 1. Replace 'EMAIL_HERE' with the actual email (e.g. marshall@active-rehab-chiro.com)
-- 2. Replace the date/time range with the correct timestamps for the bogus rows
-- 3. Run the SELECT first to verify you're targeting the right rows
-- 4. If correct, run the DELETE

-- Step 1: PREVIEW — See all rows for this email (verify which to delete)
SELECT id, email, first_name, last_name, created_at
FROM public.vapi_results
WHERE lower(email) = lower('EMAIL_HERE')
ORDER BY created_at DESC;

-- Step 2: DELETE — Remove the two bogus rows from today (adjust date/time as needed)
-- Example: if bogus rows are 2025-02-26 at 15:23:41 and 15:24:09 (UTC or your timezone)
DELETE FROM public.vapi_results
WHERE lower(email) = lower('EMAIL_HERE')
  AND created_at >= '2025-02-26 15:23:00'
  AND created_at <= '2025-02-26 15:25:00';

-- Alternative: Delete by specific IDs (safest — run SELECT first, copy the UUIDs)
-- DELETE FROM public.vapi_results WHERE id IN ('uuid-1-here', 'uuid-2-here');
