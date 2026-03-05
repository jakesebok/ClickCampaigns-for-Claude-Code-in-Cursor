/**
 * 6C Scorecard reminder emails. Call from Vercel Cron (or manually with CRON_SECRET).
 * Sends to active clients based on current time in America/New_York:
 * - Friday 12:00–12:59 → "Your scorecard is available"
 * - Saturday 12:00–12:59 → Saturday reminder
 * - Sunday 12:00–12:59 → "Final day to submit"
 * - Sunday 15:00–15:59 (3pm) → "3 hours left"
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CRON_SECRET,
 *      6C_FROM_EMAIL (e.g. scorecard@alignedpower.coach), 6C_REPLY_TO (optional).
 */

const TZ = 'America/New_York';

function nowInEastern() {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const o = {};
  parts.forEach((p) => { o[p.type] = p.value; });
  const dayNames = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
  return {
    dayOfWeek: dayNames[o.weekday] ?? 0,
    hour: parseInt(o.hour, 10) || 0,
    minute: parseInt(o.minute, 10) || 0,
  };
}

function getReminderType() {
  const e = nowInEastern();
  if (e.dayOfWeek === 5 && e.hour === 12) return 'available';
  if (e.dayOfWeek === 6 && e.hour === 12) return 'saturday';
  if (e.dayOfWeek === 0 && e.hour === 12) return 'sunday';
  if (e.dayOfWeek === 0 && e.hour === 15) return 'three-hours-left';
  return null;
}

const SUBJECTS = {
  available: "Your 6C's Scorecard is available for this week",
  saturday: "Reminder: Get your 6C's Scorecard in this weekend",
  sunday: "Final day: Submit your 6C's Scorecard by 6pm today",
  'three-hours-left': "About 3 hours left to submit your 6C's Scorecard",
};

const BODIES = {
  available: `Your weekly CEO review is open.

Fill out your 6C's Scorecard between now and Sunday 6pm (Eastern). It only takes a few minutes and keeps your alignment and planning on track.

→ Log in to your portal and complete your scorecard when you're ready.`,
  saturday: `This is a friendly reminder: your 6C's Scorecard for the week is open until Sunday 6pm (Eastern).

Take a few minutes to complete your weekly CEO review so you can plan better for next week.

→ Log in to your portal to fill it out.`,
  sunday: `Today is the last day to submit your 6C's Scorecard for the week. The window closes at 6pm Eastern.

If you haven't already, log in and complete your weekly review so you don't miss the cycle.

→ Submit your scorecard before 6pm.`,
  'three-hours-left': `You have about 3 hours left to submit your 6C's Scorecard for the week. The window closes at 6pm Eastern.

Don't miss your weekly CEO review—log in and complete it soon.

→ Submit your scorecard before 6pm.`,
};

export async function GET(request) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const secret = authHeader.replace(/^Bearer\s+/i, '') || (request.url ? new URL(request.url).searchParams.get('secret') : '');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && secret !== cronSecret) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env['6C_FROM_EMAIL'] || process.env.RESEND_FROM_EMAIL || 'scorecard@alignedpower.coach';

  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const type = getReminderType();
  if (!type) {
    return new Response(JSON.stringify({ ok: true, sent: 0, reason: 'no_reminder_scheduled_for_this_time' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  const restUrl = `${supabaseUrl}/rest/v1/portal_active_clients?select=email&active_client=eq.true`;
  const restRes = await fetch(restUrl, {
    method: 'GET',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Accept: 'application/json',
    },
  });
  if (!restRes.ok) {
    return new Response(JSON.stringify({ error: 'supabase_failed', status: restRes.status }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const activeRows = await restRes.json();
  const emails = (Array.isArray(activeRows) ? activeRows : []).map((r) => (r.email || '').trim().toLowerCase()).filter(Boolean);
  if (emails.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'RESEND_API_KEY required to send emails' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const subject = SUBJECTS[type];
  const body = BODIES[type];
  const html = body.split('\n\n').map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('') + '<p style="margin-top:1em;color:#666;font-size:12px;">Aligned Power Portal · 6C\'s Weekly Scorecard</p>';

  let sent = 0;
  for (const to of emails) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
          reply_to: process.env['6C_REPLY_TO'] || undefined,
        }),
      });
      if (res.ok) sent++;
      else console.error('[6c-reminders] Resend error for', to, await res.text());
    } catch (err) {
      console.error('[6c-reminders] Send error for', to, err);
    }
  }

  return new Response(JSON.stringify({ ok: true, type, sent, total: emails.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
