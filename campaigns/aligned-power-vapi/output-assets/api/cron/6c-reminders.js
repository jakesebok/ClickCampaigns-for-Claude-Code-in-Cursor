/**
 * 6C Scorecard reminder emails. Call from Vercel Cron (or manually with CRON_SECRET).
 * Schedule: once daily at 22:00 UTC (5pm Eastern). Sends based on America/New_York:
 * - Friday 5pm Eastern → "Your scorecard is available"
 * - Saturday 5pm Eastern → Saturday reminder
 * - Sunday 5pm Eastern → "One hour left to submit" (only Sunday email)
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
  const is5pm = e.hour === 17 || e.hour === 18;
  if (e.dayOfWeek === 5 && is5pm) return 'available';
  if (e.dayOfWeek === 6 && is5pm) return 'saturday';
  if (e.dayOfWeek === 0 && is5pm) return 'one-hour-left';
  return null;
}

const SUBJECTS = {
  available: "Your 6C's Scorecard is available for this week",
  saturday: "Reminder: Get your 6C's Scorecard in this weekend",
  'one-hour-left': "One hour left to submit your 6C's Scorecard",
};

const BODIES = {
  available: `Your weekly CEO review is open.

Fill out your 6C's Scorecard between now and Sunday 6pm (Eastern). It only takes a few minutes and keeps your alignment and planning on track.

→ Log in to your portal and complete your scorecard when you're ready.`,
  saturday: `This is a friendly reminder: your 6C's Scorecard for the week is open until Sunday 6pm (Eastern).

Take a few minutes to complete your weekly CEO review so you can plan better for next week.

→ Log in to your portal to fill it out.`,
  'one-hour-left': `You have one hour left to submit your 6C's Scorecard for the week. The window closes at 6pm Eastern.

Don't miss your weekly CEO review—log in and complete it now.

→ Submit your scorecard before 6pm.`,
};

function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export async function GET(request) {
  const url = request.url ? new URL(request.url) : null;
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const secret = authHeader.replace(/^Bearer\s+/i, '') || (url && url.searchParams.get('secret')) || '';
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

  const testSendEmail = url && url.searchParams.get('test_send');
  if (testSendEmail) {
    if (!isValidEmail(testSendEmail)) {
      return new Response(JSON.stringify({ error: 'invalid_email', message: 'test_send must be a valid email address' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'missing_env', message: 'RESEND_API_KEY required to send test email' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const subject = SUBJECTS.available;
    const body = BODIES.available;
    const html = body.split('\n\n').map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('') + '<p style="margin-top:1em;color:#999;font-size:12px;">[Test email — 6C reminders]</p>';
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: fromEmail,
          to: [testSendEmail.trim().toLowerCase()],
          subject: '[Test] ' + subject,
          html,
          reply_to: process.env['6C_REPLY_TO'] || undefined,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        return new Response(JSON.stringify({ ok: false, error: 'resend_failed', status: res.status, detail: errText.slice(0, 500) }), { status: 502, headers: { 'Content-Type': 'application/json' } });
      }
      const data = await res.json().catch(() => ({}));
      return new Response(JSON.stringify({ ok: true, test_send: true, to: testSendEmail, id: data.id || null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: 'send_error', message: String(err.message) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  const statusOnly = url && (url.searchParams.get('status') === '1' || url.searchParams.get('status') === 'true');
  if (statusOnly) {
    const e = nowInEastern();
    const type = getReminderType();
    return new Response(
      JSON.stringify({
        ok: true,
        status: true,
        eastern: { dayOfWeek: e.dayOfWeek, hour: e.hour, minute: e.minute },
        reminderType: type,
        message: type ? `Would send "${type}" to active clients.` : 'No reminder scheduled for this time (Fri/Sat/Sun 5pm Eastern only).',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
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
