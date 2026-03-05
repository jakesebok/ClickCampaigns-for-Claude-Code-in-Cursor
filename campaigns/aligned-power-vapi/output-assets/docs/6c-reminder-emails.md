# 6C Scorecard reminder emails

Reminder emails are sent to **active clients** (from `portal_active_clients`) during the weekly scorecard window. The cron job calls `/api/cron/6c-reminders`; the API decides which email to send based on **current time in America/New_York**.

## Schedule (Eastern)

| When (Eastern)     | Email |
|--------------------|--------|
| Friday 12:00–12:59 | "Your scorecard is available for this week" |
| Saturday 12:00–12:59 | "Reminder: Get your scorecard in this weekend" |
| Sunday 12:00–12:59 | "Final day: Submit by 6pm today" |
| Sunday 15:00–15:59 (3pm) | "About 3 hours left to submit" |

## Setup

**→ Step-by-step guide:** [6c-reminders-setup-guide.md](./6c-reminders-setup-guide.md) — adding RESEND_API_KEY and CRON_SECRET in Vercel, and verifying your “from” domain in Resend.

Summary:

- **Resend:** Emails are sent via [Resend](https://resend.com). Create an API key and add **RESEND_API_KEY** in Vercel. Verify your domain in Resend so you can send from e.g. `scorecard@alignedpower.coach`, or set **6C_FROM_EMAIL** to a verified address.
- **Cron secret:** Generate a random string (e.g. `openssl rand -hex 32`) and add **CRON_SECRET** in Vercel. Vercel Cron sends `Authorization: Bearer <CRON_SECRET>` when it runs.

### 3. Vercel Cron

`vercel.json` in this folder already defines:

- Path: `/api/cron/6c-reminders`
- Schedule: `0 16,17,19,20 * * 0,5,6` (4 times per day on Fri/Sat/Sun, UTC). The API only sends when the current Eastern time matches one of the windows above.

After deployment, Cron runs automatically. You can confirm in Vercel → Project → Settings → Crons.

### 4. Optional env

- **6C_REPLY_TO** – Reply-to address for reminder emails.

## Manual test

Without sending email (to see which type would run):

1. Call the API when it’s Friday 12pm Eastern (or change the server time for testing).  
2. With sending: set **RESEND_API_KEY** and **CRON_SECRET**, then:

   ```bash
   curl -H "Authorization: Bearer YOUR_CRON_SECRET" "https://your-app.vercel.app/api/cron/6c-reminders"
   ```

Response example: `{"ok":true,"type":"available","sent":3,"total":3}`.

## One-hour-left email (optional)

The current “3 hours left” email runs at Sunday 3pm Eastern. To add a “1 hour left” email at Sunday 5pm Eastern:

1. In `api/cron/6c-reminders.js`, add a branch for `e.dayOfWeek === 0 && e.hour === 17` and a subject/body for the 1-hour reminder.
2. Add a cron time that lands in the 17:00 hour Eastern on Sunday (e.g. 22:00 UTC for EDT) in `vercel.json` if needed.
