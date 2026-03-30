# 6C Scorecard reminder emails

Reminder emails are sent to **active clients** (from `portal_active_clients`) during and immediately after the weekly scorecard window. The cron job calls `/api/cron/6c-reminders`; the API decides which email to send based on the **current Eastern day** and the **correct UTC cron hour for DST vs. standard time**.

**Who receives each email:**
- **Friday** ("Your scorecard is available"): All active clients.
- **Saturday** and **Sunday**: Only active clients who have **not yet** submitted their 6C scorecard for this week's window (Friday 12pm – Sunday 6pm Eastern). Clients who already filled it out are skipped.
- **Monday** and **Tuesday**: Only active clients who have at least one prior scored 6Cs submission, missed the most recent Friday-Sunday window, and still have not set a manual Vital Action after the window closed.

## Schedule (Eastern)

`vercel.json` defines **two** daily cron entries: `5 16 * * *` and `5 17 * * *`.
The handler accepts only the one that matches the current Eastern offset:

- **DST (EDT / UTC-4):** 16:00 UTC hour
- **Standard time (EST / UTC-5):** 17:00 UTC hour

That makes reminders reliable on Vercel Hobby, where cron timing is only guaranteed within the scheduled hour. The API sends one email based on the Eastern day:

| Day (during the noon Eastern cron hour) | Email |
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
- Schedule: `5 16 * * *` and `5 17 * * *`. The handler picks the correct one for the current Eastern offset, then sends based on Eastern time: Friday → “available”, Saturday → reminder, Sunday → “just a few hours left”, Monday/Tuesday → Vital Action catch-up for missed submissions.

After deployment, Cron runs automatically. You can confirm in Vercel → Project → Settings → Crons.

### 4. Optional env

- **SIX_C_REPLY_TO** – Reply-to address for reminder emails.

## Manual test

Without sending email (to see which type would run):

1. Call the API during the Friday-Tuesday noon Eastern cron hour (or change the server time for testing).
2. With sending: set **RESEND_API_KEY** and **CRON_SECRET**, then:

   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://your-app.vercel.app/api/cron/6c-reminders"
   ```

For **status only** (no email): add `?status=1` to the URL. For **one test email** to your inbox: add `?test_send=your@email.com`. To force a specific template during testing, add `&force_type=available|saturday|one-hour-left|monday-vital-action|tuesday-vital-action`. Forced-template test sends are restricted to `jacob@alignedpower.coach`. Full testing steps: [6c-reminders-setup-guide.md](./6c-reminders-setup-guide.md#testing-that-it-works).

## Hobby plan note

Vercel Hobby timing is only guaranteed **within the scheduled hour**. This project keeps two daily cron entries (`5 16 * * *` and `5 17 * * *`) so the noon Eastern reminder window works in both DST and standard time from Friday through Tuesday. If you upgrade to Pro, you can add more precise reminder times, such as an additional Sunday 5pm "just a few hours left" email.
