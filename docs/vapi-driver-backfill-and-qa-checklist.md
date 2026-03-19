# VAPI Driver Backfill And QA Checklist

This checklist is written for a non-technical operator.

You do not need to run SQL in Supabase for this process.

## Before You Start

- Confirm the Alfred Vercel project is deployed with the latest code.
- Confirm the Alfred Vercel project has:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Confirm your admin email is included in the Alfred Vercel project's `ADMIN_EMAILS` env var.
- Sign into Alfred with that admin email before using the backfill URL.

If the backfill URL returns `403 Forbidden`, your email is not currently recognized as an admin.

## Run The Legacy Backfill

### Step 1: Dry Run

Open this URL while signed into Alfred:

[Dry Run URL](https://www.alfredai.coach/api/admin/vapi/backfill-drivers)

Expected result:

- a JSON response in the browser
- `mode` should be `"dry-run"`
- you should see counts for:
  - `scanned`
  - `alreadyBackfilled`
  - `eligible`
  - `skippedMissingResponses`
  - `failed`

What the counts mean:

- `alreadyBackfilled`: rows that already have driver fields
- `eligible`: older rows that can be backfilled now
- `skippedMissingResponses`: old rows that do not contain historical item-level responses and cannot be reconstructed exactly
- `failed`: rows that tried to process but threw an error

### Step 2: Execute

If the dry run looks correct, open this URL:

[Execute URL](https://www.alfredai.coach/api/admin/vapi/backfill-drivers?execute=1)

Expected result:

- `mode` should be `"execute"`
- `updated` should be greater than `0` if eligible rows existed
- `failed` should be `0`

If `skippedMissingResponses` is greater than `0`, that is expected for some very old Alfred assessments. Those rows cannot be backfilled exactly because the raw item-level response data was never stored.

## End-To-End QA

## 1. Alfred Results Page

- Sign into Alfred with a user who has at least 2 assessments.
- Open their latest results page.
- Confirm the results page includes:
  - founder archetype section
  - driver section
  - progress over time
- In progress over time, confirm the interpretation stack appears in this order:
  - composite score transition
  - archetype transition
  - driver transition
  - selected arena or domain transition

## 2. Alfred Dashboard

- Open the Alfred dashboard for the same user.
- Confirm the dashboard summary shows:
  - archetype
  - likely driver
  - core belief
- Confirm the `View Full Details` link reaches the driver section on the results page.

## 3. Portal Dashboard

- Sign into the portal with the same user email.
- Confirm the latest assessment summary shows:
  - archetype
  - likely driver
  - core belief
- In the portal progress section, confirm the same interpretation order appears:
  - composite score transition
  - archetype transition
  - driver transition
  - selected arena or domain transition

## 4. Marketing Results Page

- Complete a fresh marketing-site assessment with a test email.
- Confirm the results page shows the driver section between:
  - archetype
  - arena scores

## 5. Completion Emails

- Complete one fresh assessment from the marketing site.
- Confirm the user email includes:
  - `What's Driving This Pattern`
  - driver name
  - core belief
- Confirm the admin email includes:
  - driver name with point total
  - all 8 driver scores sorted highest to lowest
  - previous driver when that user has an earlier assessment

## 6. Cross-Platform Data Check

- Take one assessment on the marketing site.
- Sign into the portal with the same email and confirm it appears there.
- Sign into Alfred with the same email and confirm it appears there.
- If the user has multiple assessments across different platforms, confirm both portal and Alfred progress views include the full sequence in order.

## 7. Known Legacy Limitation

- Some older Alfred rows may never receive a backfilled driver.
- That is only true when the old row did not save `allResponses`.
- Do not try to fix those with manual SQL or guessed values.
- The correct long-term fix for those users is simply their next assessment, which will store the full response map and compute the driver correctly.
