# 6C Scorecard reminder emails

Reminder emails are sent to **active clients** (from `portal_active_clients`) during and immediately after the weekly scorecard window. The cron job calls `/api/cron/6c-reminders`; the API decides which email to send based on the **current Eastern day**. To make Vercel Hobby more reliable, the project runs multiple fallback cron hours and uses **Resend idempotency keys** so redundant attempts do not create duplicate emails. On **Friday**, the reminder is only allowed after the scorecard window opens at **12pm Eastern**.

**Who receives each email:**
- **Friday** ("Your scorecard is available"): All active clients.
- **Saturday** and **Sunday**: Only active clients who have **not yet** submitted their 6C scorecard for this week's window (Friday 12pm – Sunday 6pm Eastern). Clients who already filled it out are skipped.
- **Monday** and **Tuesday**: Only active clients who have at least one prior scored 6Cs submission, missed the most recent Friday-Sunday window, and still have not set a manual Vital Action after the window closed.

## Schedule (Eastern)

`vercel.json` defines **three** daily cron entries: `5 15 * * *`, `5 16 * * *`, and `5 17 * * *`.

That gives the reminder system multiple fallback attempts. Friday reminders are only allowed once the scorecard window is open at 12pm Eastern; Saturday through Tuesday reminders use the existing 11am-noon Eastern fallback window. The API sends one email based on the Eastern day, and Resend idempotency prevents duplicate sends if more than one cron attempt lands on the same day:

| Day (during the fallback reminder window) | Email |
|-------------------------------------|--------|
| Friday | "Your scorecard is available for this week" |
| Saturday | "Reminder: Get your scorecard in this weekend" |
| Sunday | "Just a few hours left to submit" (only Sunday email) |
| Monday | "Kick the week off right — set your Vital Action" |
| Tuesday | "Still time to set this week's Vital Action" |

## Setup

**→ Step-by-step guide:** [6c-reminders-setup-guide.md](./6c-reminders-setup-guide.md) — adding RESEND_API_KEY and CRON_SECRET in Vercel, and verifying your “from” domain in Resend.

Summary:

- **Resend:** Emails are sent via [Resend](https://resend.com). Create an API key and add **RESEND_API_KEY** in Vercel. Verify your domain in Resend so you can send from e.g. `scorecard@alignedpower.coach`, or set **SIX_C_FROM_EMAIL** to a verified address.
- **Cron secret:** Generate a random string (e.g. `openssl rand -hex 32`) and add **CRON_SECRET** in Vercel. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when it runs.

### 3. Vercel Cron

`vercel.json` in this folder already defines:

- Path: `/api/cron/6c-reminders`
- Schedule: `5 15 * * *`, `5 16 * * *`, and `5 17 * * *`. The handler only allows Friday sends after the Friday scorecard window opens at 12pm Eastern, then uses the existing fallback timing for the other reminder days: Friday → “available”, Saturday → reminder, Sunday → “just a few hours left”, Monday/Tuesday → Vital Action catch-up for missed submissions.

After deployment, Cron runs automatically. You can confirm in Vercel → Project → Settings → Crons.

### 4. Optional env

- **SIX_C_REPLY_TO** – Reply-to address for reminder emails.

## Manual test

Without sending email (to see which type would run):

1. Call the API during the Friday-Tuesday fallback reminder hours (or change the server time for testing).
2. With sending: set **RESEND_API_KEY** and **CRON_SECRET**, then:

   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://your-app.vercel.app/api/cron/6c-reminders"
   ```

For **status only** (no email): add `?status=1` to the URL. For **one test email** to your inbox: add `?test_send=your@email.com`. To force a specific template during testing, add `&force_type=available|saturday|one-hour-left|monday-vital-action|tuesday-vital-action`. Forced-template test sends are restricted to `jacob@alignedpower.coach`. Full testing steps: [6c-reminders-setup-guide.md](./6c-reminders-setup-guide.md#testing-that-it-works).

## Hobby plan note

Vercel Hobby timing is only guaranteed **within the scheduled hour**. This project keeps three daily cron entries (`5 15 * * *`, `5 16 * * *`, and `5 17 * * *`) so Friday-Tuesday reminders get multiple fallback attempts. Friday is explicitly gated so the “scorecard is available” email cannot go out before the noon Eastern window opens. The handler sends based on the Eastern day, and Resend idempotency keys prevent duplicate emails if more than one attempt runs successfully.
