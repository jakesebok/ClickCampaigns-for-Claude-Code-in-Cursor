# 6C Scorecard reminder emails

Reminder emails are sent to **active clients** (from `portal_active_clients`) during the weekly scorecard window. The cron job calls `/api/cron/6c-reminders`; the API decides which email to send based on **current time in America/New_York**.

**Who receives each email:**
- **Friday** ("Your scorecard is available"): All active clients.
- **Saturday** and **Sunday**: Only active clients who have **not yet** submitted their 6C scorecard for this week's window (Friday 12pm – Sunday 6pm Eastern). Clients who already filled it out are skipped.

## Schedule (Eastern)

The cron runs **once per day** at 17:05 UTC (12:05pm Eastern, 5 min after scorecard opens). The API sends one email based on the day:

| Day (when cron runs at 12:05pm Eastern) | Email |
|-------------------------------------|--------|
| Friday | "Your scorecard is available for this week" |
| Saturday | "Reminder: Get your scorecard in this weekend" |
| Sunday | "One hour left to submit" (only Sunday email) |

## Setup

**→ Step-by-step guide:** [6c-reminders-setup-guide.md](./6c-reminders-setup-guide.md) — adding RESEND_API_KEY and CRON_SECRET in Vercel, and verifying your “from” domain in Resend.

Summary:

- **Resend:** Emails are sent via [Resend](https://resend.com). Create an API key and add **RESEND_API_KEY** in Vercel. Verify your domain in Resend so you can send from e.g. `scorecard@alignedpower.coach`, or set **SIX_C_FROM_EMAIL** to a verified address.
- **Cron secret:** Generate a random string (e.g. `openssl rand -hex 32`) and add **CRON_SECRET** in Vercel. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when it runs.

### 3. Vercel Cron

`vercel.json` in this folder already defines:

- Path: `/api/cron/6c-reminders`
- Schedule: `5 17 * * *` (once daily at 17:05 UTC = 12:05pm EST). This satisfies Vercel Hobby’s “one run per day” limit. The API sends based on Eastern time: Friday → “available”, Saturday → reminder, Sunday → “one hour left” only.

After deployment, Cron runs automatically. You can confirm in Vercel → Project → Settings → Crons.

### 4. Optional env

- **SIX_C_REPLY_TO** – Reply-to address for reminder emails.

## Manual test

Without sending email (to see which type would run):

1. Call the API when it’s Friday 12:05pm Eastern (or change the server time for testing).  
2. With sending: set **RESEND_API_KEY** and **CRON_SECRET**, then:

   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://your-app.vercel.app/api/cron/6c-reminders"
   ```

For **status only** (no email): add `?status=1` to the URL. For **one test email** to your inbox: add `?test_send=your@email.com`. Full testing steps: [6c-reminders-setup-guide.md](./6c-reminders-setup-guide.md#testing-that-it-works).

## Hobby plan note

Vercel Hobby allows only **one cron run per day**. The schedule is set to `5 17 * * *` (once daily at 12:05pm Eastern). If you upgrade to Pro, you can run multiple times per day and add e.g. Friday/Saturday/Sunday 12:05pm emails plus an additional Sunday 5pm "one hour left" email.

