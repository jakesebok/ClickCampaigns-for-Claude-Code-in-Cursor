/**
 * 6C Scorecard reminder emails. Call from Vercel Cron (or manually with CRON_SECRET).
 * Schedule: once daily at 17:05 UTC (12:05pm Eastern). Sends 5 min after scorecard opens.
 * - Friday 12:05pm Eastern → "Your scorecard is available"
 * - Saturday 12:05pm Eastern → Saturday reminder
 * - Sunday 12:05pm Eastern → "One hour left to submit" (only Sunday email)
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CRON_SECRET,
 *      SIX_C_FROM_EMAIL (e.g. scorecard@notifications.alignedpower.coach), SIX_C_REPLY_TO (optional).
 */

const TZ = 'America/New_York';
const PORTAL_URL = 'https://portal.alignedpower.coach';
const SCORECARD_URL = `${PORTAL_URL}/scorecard`;

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
  // 17:05 UTC = 12:05pm EST (winter) or 1:05pm EDT (summer); Vercel Hobby ±1hr window
  const isReminderHour = e.hour >= 11 && e.hour <= 14;
  if (e.dayOfWeek === 5 && isReminderHour) return 'available';
  if (e.dayOfWeek === 6 && isReminderHour) return 'saturday';
  if (e.dayOfWeek === 0 && isReminderHour) return 'one-hour-left';
  return null;
}

const SUBJECTS = {
  available:      "Your weekly CEO review is open — 6C's Scorecard",
  saturday:       "Still time this weekend — your 6C's Scorecard is waiting",
  'one-hour-left': "Last call: one hour left to submit your 6C's Scorecard",
};

const FROM_NAME = 'Jake Sebok';

// Returns full branded HTML email
function buildHtmlEmail({ type, firstName }) {
  const name = firstName ? `Hi ${firstName},` : 'Hi there,';

  const content = {
    available: {
      headline: "Your scorecard<br>is open this weekend.",
      body: `Your weekly 6C's Scorecard is available now through <strong>Sunday at 6pm Eastern</strong>. It takes just a few minutes and keeps your alignment front and center as you head into a new week.`,
      subtext: `This is your weekly CEO review — a quick honest look at where you actually stand across the six dimensions of an aligned life.`,
      cta: 'Fill Out My Scorecard →',
      urgency: null,
    },
    saturday: {
      headline: "Don't lose the week<br>without reviewing it.",
      body: `Your 6C's Scorecard for this week is still open until <strong>Sunday at 6pm Eastern</strong>. A few minutes of reflection now makes next week sharper.`,
      subtext: `Most people skip the review and wonder why the same patterns keep showing up. You're here because you're not most people.`,
      cta: 'Complete My Scorecard →',
      urgency: null,
    },
    'one-hour-left': {
      headline: "One hour left.<br>Don't let the week slip.",
      body: `The window closes at <strong>6pm Eastern today</strong>. Your 6C's Scorecard takes less than five minutes — and it's the five minutes that set the direction for everything else next week.`,
      subtext: `Log in now and get it done before the window closes.`,
      cta: 'Submit Now — Closes at 6pm →',
      urgency: `<p style="margin:0;font-size:13px;color:#B45309;font-weight:600;">⏱ Closes today at 6pm Eastern</p>`,
    },
  };

  const c = content[type] || content.available;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${SUBJECTS[type]}</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDE3ED;">

  <!-- Header -->
  <tr><td style="background:#FAF9F7;padding:32px 40px;text-align:center;border-bottom:1px solid #E8E6E3;">
    <a href="${PORTAL_URL}"><img src="https://portal.alignedpower.coach/images/vapi-logo.png" alt="Values-Aligned Performance Indicator" width="180" height="auto" style="display:block;max-width:180px;height:auto;margin:0 auto;" /></a>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px 40px 32px;">
    <p style="margin:0 0 24px;color:#3A4A5C;font-size:16px;line-height:1.6;">${name}</p>

    <h2 style="margin:0 0 20px;color:#0E1624;font-size:26px;font-weight:700;line-height:1.25;">${c.headline}</h2>

    <p style="margin:0 0 16px;color:#3A4A5C;font-size:16px;line-height:1.7;">${c.body}</p>
    <p style="margin:0 0 32px;color:#7A6A5E;font-size:14px;line-height:1.7;">${c.subtext}</p>

    ${c.urgency ? `<div style="background:#FFF8EC;border-left:4px solid #D97706;border-radius:4px;padding:12px 16px;margin-bottom:24px;">${c.urgency}</div>` : ''}

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${SCORECARD_URL}" style="display:inline-block;background:#FF6B1A;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 36px;border-radius:8px;">${c.cta}</a>
    </div>

    <hr style="border:none;border-top:1px solid #DDE3ED;margin:0 0 28px;">

    <h3 style="margin:0 0 12px;color:#0E1624;font-size:16px;font-weight:700;">The 6C&rsquo;s are:</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:5px 8px;color:#3A4A5C;font-size:14px;">&#9670; <strong>Clarity</strong></td>
        <td style="padding:5px 8px;color:#3A4A5C;font-size:14px;">&#9670; <strong>Coherence</strong></td>
        <td style="padding:5px 8px;color:#3A4A5C;font-size:14px;">&#9670; <strong>Capacity</strong></td>
      </tr>
      <tr>
        <td style="padding:5px 8px;color:#3A4A5C;font-size:14px;">&#9670; <strong>Confidence</strong></td>
        <td style="padding:5px 8px;color:#3A4A5C;font-size:14px;">&#9670; <strong>Courage</strong></td>
        <td style="padding:5px 8px;color:#3A4A5C;font-size:14px;">&#9670; <strong>Connection</strong></td>
      </tr>
    </table>

    <p style="margin:0 0 28px;color:#3A4A5C;font-size:15px;line-height:1.7;">Rate yourself honestly across each one. See what&rsquo;s holding you back and set your Vital Action to focus on next week.</p>

    <div style="text-align:center;margin-bottom:8px;">
      <a href="${SCORECARD_URL}" style="display:inline-block;background:#0E1624;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">Log In to My Portal &rarr;</a>
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F5F7FA;padding:24px 40px;text-align:center;border-top:1px solid #DDE3ED;">
    <p style="margin:0 0 8px;color:#7A8FA8;font-size:13px;">Jake Sebok</p>
    <p style="margin:0;color:#7A8FA8;font-size:12px;">You received this because you&rsquo;re an active client. <a href="${PORTAL_URL}" style="color:#FF6B1A;">Unsubscribe</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// Plain-text fallback
function buildTextEmail({ type, firstName }) {
  const name = firstName ? `Hi ${firstName},` : 'Hi there,';
  const texts = {
    available: `${name}

Your weekly 6C's Scorecard is open now through Sunday at 6pm Eastern.

It takes just a few minutes and keeps your alignment front and center as you head into a new week. Rate yourself across Clarity, Coherence, Capacity, Confidence, Courage, and Connection — then set your Vital Action to focus on next week.

→ Fill out your scorecard: ${SCORECARD_URL}

-- Jake Sebok`,
    saturday: `${name}

A quick reminder: your 6C's Scorecard for this week is still open until Sunday at 6pm Eastern.

A few minutes of reflection now makes next week sharper.

→ Complete your scorecard: ${SCORECARD_URL}

-- Jake Sebok`,
    'one-hour-left': `${name}

One hour left. The window closes at 6pm Eastern today.

Log in now and get it done before it closes:
${SCORECARD_URL}

-- Jake Sebok`,
  };
  return texts[type] || texts.available;
}

function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

/** Returns { opensAt, closesAt } for this week's scorecard window (Friday 12pm – Sunday 6pm Eastern) as ISO strings. */
function getThisWeekWindowBounds() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const o = {};
  parts.forEach((p) => { o[p.type] = p.value; });
  const dayNames = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
  const dow = dayNames[o.weekday] ?? 0;
  const y = parseInt(o.year, 10) || 2025;
  const m = parseInt(o.month, 10) || 1;
  const d = parseInt(o.day, 10) || 1;
  const hour = parseInt(o.hour, 10) || 0;
  // Eastern offset: EDT (Apr–Oct) = 4, EST = 5 (matches six-c-window.js)
  const offset = (m >= 4 && m <= 10) ? 4 : 5;
  // Friday noon that started this week's window (Sat: yesterday, Sun: 2 days ago, Fri: today)
  let fd = d;
  if (dow === 6) fd = d - 1;
  else if (dow === 0) fd = d - 2;
  const fridayNoonUtc = new Date(Date.UTC(y, m - 1, fd, 12 + offset, 0));
  // Sunday 6pm that closes this week's window (Sat: tomorrow, Sun: today, Fri: in 2 days)
  let sd = d;
  if (dow === 5 && hour >= 12) sd = d + 2;
  else if (dow === 6) sd = d + 1;
  const sunday6pmUtc = new Date(Date.UTC(y, m - 1, sd, 18 + offset, 0));
  return {
    opensAt: fridayNoonUtc.toISOString(),
    closesAt: sunday6pmUtc.toISOString(),
  };
}

export async function GET(request) {
  const url = request.url ? new URL(request.url) : null;
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const secret = (authHeader.replace(/^Bearer\s+/i, '').trim() || (url && url.searchParams.get('secret')) || '').trim();
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  if (cronSecret && secret !== cronSecret) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.SIX_C_FROM_EMAIL || 'scorecard@notifications.alignedpower.coach';
  const fromLine = `${FROM_NAME} <${fromEmail}>`;

  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  // ── Test send ──
  const testSendEmail = url && url.searchParams.get('test_send');
  if (testSendEmail) {
    if (!isValidEmail(testSendEmail)) {
      return new Response(JSON.stringify({ error: 'invalid_email', message: 'test_send must be a valid email address' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'missing_env', message: 'RESEND_API_KEY required to send test email' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const type = 'available';
    const html = buildHtmlEmail({ type, firstName: null });
    const text = buildTextEmail({ type, firstName: null });
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: fromLine,
          to: [testSendEmail.trim().toLowerCase()],
          subject: '[Test] ' + SUBJECTS[type],
          html,
          text,
          reply_to: process.env.SIX_C_REPLY_TO || undefined,
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        const hint = res.status === 403
          ? ' Set SIX_C_FROM_EMAIL in Vercel to the exact address you verified in Resend.'
          : '';
        return new Response(
          JSON.stringify({ ok: false, error: 'resend_failed', status: res.status, detail: errText.slice(0, 500), hint: hint || undefined }),
          { status: 502, headers: { 'Content-Type': 'application/json' } }
        );
      }
      const data = await res.json().catch(() => ({}));
      return new Response(JSON.stringify({ ok: true, test_send: true, to: testSendEmail, id: data.id || null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: 'send_error', message: String(err.message) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // ── Status check ──
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
        message: type ? `Would send "${type}" to active clients (Sat/Sun: only those who haven't submitted this week).` : 'No reminder scheduled for this time (Fri/Sat/Sun 12:05pm Eastern only).',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Scheduled send ──
  const type = getReminderType();
  if (!type) {
    return new Response(JSON.stringify({ ok: true, sent: 0, reason: 'no_reminder_scheduled_for_this_time' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Fetch active clients (portal_active_clients has email, active_client, updated_at only)
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
  let clients = (Array.isArray(activeRows) ? activeRows : [])
    .map((r) => ({ email: (r.email || '').trim().toLowerCase(), firstName: null }))
    .filter((r) => r.email);

  // Friday: send to all. Saturday/Sunday: only to those who haven't submitted this week.
  if (type === 'saturday' || type === 'one-hour-left') {
    const { opensAt, closesAt } = getThisWeekWindowBounds();
    const subsUrl = `${supabaseUrl}/rest/v1/six_c_submissions?select=email&created_at=gte.${encodeURIComponent(opensAt)}&created_at=lte.${encodeURIComponent(closesAt)}`;
    const subsRes = await fetch(subsUrl, {
      method: 'GET',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: 'application/json',
      },
    });
    const submittedEmails = new Set();
    if (subsRes.ok) {
      const subs = await subsRes.json();
      (Array.isArray(subs) ? subs : []).forEach((r) => {
        const e = (r.email || '').trim().toLowerCase();
        if (e) submittedEmails.add(e);
      });
    }
    clients = clients.filter((c) => !submittedEmails.has(c.email));
  }

  if (clients.length === 0) {
    const totalActive = (Array.isArray(activeRows) ? activeRows : []).length;
    return new Response(JSON.stringify({
      ok: true,
      sent: 0,
      ...(totalActive > 0 && type !== 'available' && { skipped: totalActive, reason: 'all_already_submitted_this_week' }),
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'RESEND_API_KEY required to send emails' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  let sent = 0;
  for (const client of clients) {
    const html = buildHtmlEmail({ type, firstName: client.firstName });
    const text = buildTextEmail({ type, firstName: client.firstName });
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: fromLine,
          to: [client.email],
          subject: SUBJECTS[type],
          html,
          text,
          reply_to: process.env.SIX_C_REPLY_TO || undefined,
        }),
      });
      if (res.ok) sent++;
      else console.error('[6c-reminders] Resend error for', client.email, await res.text());
    } catch (err) {
      console.error('[6c-reminders] Send error for', client.email, err);
    }
  }

  const totalActive = (Array.isArray(activeRows) ? activeRows : []).length;
  const skipped = totalActive - clients.length;
  return new Response(JSON.stringify({
    ok: true,
    type,
    sent,
    total: clients.length,
    ...(skipped > 0 && { skipped, reason: 'already_submitted_this_week' }),
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
