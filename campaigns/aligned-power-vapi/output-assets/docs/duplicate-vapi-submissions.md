# Duplicate or Bogus VAPI Submissions

## How submissions get into the database

1. **User completes the quiz** (vapi-quiz.html) → results stored in `sessionStorage`
2. **User is redirected to vapi-results.html** → page loads
3. **On load**, vapi-results.html calls `/api/save-vapi-results` with the results → one row is inserted into `vapi_results`

There is **no duplicate prevention**. Each time the results page loads with valid data in sessionStorage, a new row is inserted (unless `vapiResultsSaved` is set in sessionStorage from a prior save in the same browser session).

## How duplicate/bogus rows can appear

1. **Double submission** — User completes quiz, lands on results page (save #1). User hits back, re-submits, or opens results in another tab before sessionStorage is cleared → second save.
2. **Rapid refresh** — If the user refreshes vapi-results.html before the save completes, or if there's a race, two requests could fire. The `vapiResultsSaved` flag reduces this but isn't foolproof.
3. **Direct API calls** — The `/api/save-vapi-results` endpoint has no authentication. Anyone who knows the API could POST arbitrary JSON and insert rows. There is no rate limiting.
4. **Browser quirks** — Multiple tabs, session restore, or extensions could cause unexpected behavior.

## Removing bogus rows

Use the SQL script: **supabase/delete-duplicate-vapi-results.sql**

1. Open Supabase Dashboard → SQL Editor
2. Copy the contents of `delete-duplicate-vapi-results.sql`
3. Replace `EMAIL_HERE` with the actual email
4. Adjust the date/time range to match the bogus submissions
5. Run the `SELECT` first to verify
6. Run the `DELETE` to remove them

## Future prevention (optional)

To reduce duplicates, you could:

- **Client-side**: Disable the submit button after click, or add a "saving..." state that blocks duplicate navigations
- **Server-side**: Reject inserts when the same email has a row with `created_at` within the last 1–2 minutes (cooldown)
- **Server-side**: Add rate limiting to `/api/save-vapi-results`
