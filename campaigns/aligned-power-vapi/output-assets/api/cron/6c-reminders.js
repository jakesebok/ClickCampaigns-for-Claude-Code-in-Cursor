/**
 * 6C Scorecard reminder emails. Call from Vercel Cron (or manually with CRON_SECRET).
 * Schedule: once daily at 17:00 UTC (12pm Eastern). Sends based on America/New_York:
 * - Friday 12pm Eastern → "Your scorecard is available"
 * - Saturday 12pm Eastern → Saturday reminder
 * - Sunday 12pm Eastern → "One hour left to submit" (only Sunday email)
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CRON_SECRET,
 *      SIX_C_FROM_EMAIL (e.g. scorecard@notifications.alignedpower.coach), SIX_C_REPLY_TO (optional).
 */

const TZ = 'America/New_York';
const PORTAL_URL = 'https://portal.alignedpower.coach';
const SCORECARD_URL = `${PORTAL_URL}/portal/six-c-scorecard.html`;

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
  const isNoon = e.hour === 12 || e.hour === 13;
  if (e.dayOfWeek === 5 && isNoon) return 'available';
  if (e.dayOfWeek === 6 && isNoon) return 'saturday';
  if (e.dayOfWeek === 0 && isNoon) return 'one-hour-left';
  return null;
}

const SUBJECTS = {
  available:      "Your weekly CEO review is open — 6C's Scorecard",
  saturday:       "Still time this weekend — your 6C's Scorecard is waiting",
  'one-hour-left': "Last call: one hour left to submit your 6C's Scorecard",
};

const FROM_NAME = 'Jake at Aligned Power';

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
<body style="margin:0;padding:0;background:#F4ECE3;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F4ECE3;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #E0D0C4;">

  <!-- Header -->
  <tr><td style="background:#582233;padding:32px 40px;text-align:center;">
    <p style="margin:0;color:#D4AA70;font-size:12px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Aligned Power</p>
    <h1 style="margin:8px 0 0;color:#FFFFFF;font-size:26px;font-weight:700;line-height:1.2;">6C&rsquo;s Weekly Scorecard</h1>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px 40px 32px;">
    <p style="margin:0 0 24px;color:#334750;font-size:16px;line-height:1.6;">${name}</p>

    <h2 style="margin:0 0 20px;color:#582233;font-size:26px;font-weight:700;line-height:1.25;">${c.headline}</h2>

    <p style="margin:0 0 16px;color:#334750;font-size:16px;line-height:1.7;">${c.body}</p>
    <p style="margin:0 0 32px;color:#7A6A5E;font-size:14px;line-height:1.7;">${c.subtext}</p>

    ${c.urgency ? `<div style="background:#FFF8EC;border-left:4px solid #D97706;border-radius:4px;padding:12px 16px;margin-bottom:24px;">${c.urgency}</div>` : ''}

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${SCORECARD_URL}" style="display:inline-block;background:#582233;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 36px;border-radius:8px;">${c.cta}</a>
    </div>

    <hr style="border:none;border-top:1px solid #E0D0C4;margin:0 0 28px;">

    <h3 style="margin:0 0 12px;color:#582233;font-size:16px;font-weight:700;">The 6C&rsquo;s are:</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr>
        <td style="padding:5px 8px;color:#334750;font-size:14px;">&#9670; <strong>Clarity</strong></td>
        <td style="padding:5px 8px;color:#334750;font-size:14px;">&#9670; <strong>Coherence</strong></td>
        <td style="padding:5px 8px;color:#334750;font-size:14px;">&#9670; <strong>Capacity</strong></td>
      </tr>
      <tr>
        <td style="padding:5px 8px;color:#334750;font-size:14px;">&#9670; <strong>Confidence</strong></td>
        <td style="padding:5px 8px;color:#334750;font-size:14px;">&#9670; <strong>Courage</strong></td>
        <td style="padding:5px 8px;color:#334750;font-size:14px;">&#9670; <strong>Connection</strong></td>
      </tr>
    </table>

    <p style="margin:0 0 28px;color:#334750;font-size:15px;line-height:1.7;">Rate yourself honestly across each one. See what&rsquo;s holding you back and set your ONE THING to focus on next week.</p>

    <div style="text-align:center;margin-bottom:8px;">
      <a href="${SCORECARD_URL}" style="display:inline-block;background:#334750;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">Log In to My Portal &rarr;</a>
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F4ECE3;padding:24px 40px;text-align:center;border-top:1px solid #E0D0C4;">
    <p style="margin:0 0 8px;color:#7A6A5E;font-size:13px;">Jake Sebok &mdash; Aligned Power</p>
    <p style="margin:0;color:#B8A89A;font-size:12px;">You received this because you&rsquo;re an active Aligned Power client. <a href="${PORTAL_URL}" style="color:#582233;">Unsubscribe</a></p>
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

It takes just a few minutes and keeps your alignment front and center as you head into a new week. Rate yourself across Clarity, Coherence, Capacity, Confidence, Courage, and Connection — then set your ONE THING to focus on next week.

→ Fill out your scorecard: ${SCORECARD_URL}

-- Jake Sebok, Aligned Power`,
    saturday: `${name}

A quick reminder: your 6C's Scorecard for this week is still open until Sunday at 6pm Eastern.

A few minutes of reflection now makes next week sharper.

→ Complete your scorecard: ${SCORECARD_URL}

-- Jake Sebok, Aligned Power`,
    'one-hour-left': `${name}

One hour left. The window closes at 6pm Eastern today.

Log in now and get it done before it closes:
${SCORECARD_URL}

-- Jake Sebok, Aligned Power`,
  };
  return texts[type] || texts.available;
}

function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
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
        message: type ? `Would send "${type}" to active clients.` : 'No reminder scheduled for this time (Fri/Sat/Sun 12pm Eastern only).',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Scheduled send ──
  const type = getReminderType();
  if (!type) {
    return new Response(JSON.stringify({ ok: true, sent: 0, reason: 'no_reminder_scheduled_for_this_time' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  // Fetch active clients (with first name if available)
  const restUrl = `${supabaseUrl}/rest/v1/portal_active_clients?select=email,first_name&active_client=eq.true`;
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
  const clients = (Array.isArray(activeRows) ? activeRows : [])
    .map((r) => ({ email: (r.email || '').trim().toLowerCase(), firstName: r.first_name || null }))
    .filter((r) => r.email);

  if (clients.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
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

  return new Response(JSON.stringify({ ok: true, type, sent, total: clients.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
