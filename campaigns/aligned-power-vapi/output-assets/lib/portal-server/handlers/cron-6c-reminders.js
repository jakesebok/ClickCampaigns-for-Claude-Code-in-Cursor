/**
 * 6C Scorecard reminder emails. Call from Vercel Cron (or manually with CRON_SECRET).
 * Schedule: three daily cron entries at 15:05, 16:05, and 17:05 UTC.
 * The handler accepts any configured fallback hour around the Eastern midday
 * reminder window and relies on Resend idempotency keys so redundant attempts
 * do not create duplicate emails.
 * - Friday noon Eastern hour → "Your scorecard is available"
 * - Saturday noon Eastern hour → Saturday reminder
 * - Sunday noon Eastern hour → "Just a few hours left to submit"
 * - Monday/Tuesday noon Eastern hour → Vital Action catch-up for missed submissions
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, CRON_SECRET,
 *      SIX_C_FROM_EMAIL (e.g. scorecard@alignedpower.coach), SIX_C_REPLY_TO (optional).
 */

const TZ = 'America/New_York';
const PORTAL_URL = 'https://portal.alignedpower.coach';
const SCORECARD_URL = `${PORTAL_URL}/scorecard`;
const DASHBOARD_URL = `${PORTAL_URL}/dashboard`;
const CONFIGURED_CRON_UTC_HOURS = [15, 16, 17];

function nowInEastern(date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const o = {};
  parts.forEach((p) => { o[p.type] = p.value; });
  const dayNames = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
  return {
    dayOfWeek: dayNames[o.weekday] ?? 0,
    hour: parseInt(o.hour, 10) || 0,
    minute: parseInt(o.minute, 10) || 0,
  };
}

function getExpectedCronUtcHour(date = new Date()) {
  const offsetMinutes = getEasternOffsetMinutes(date);
  return offsetMinutes === -4 * 60 ? 16 : 17;
}

function isInConfiguredCronHour(date = new Date()) {
  return CONFIGURED_CRON_UTC_HOURS.includes(date.getUTCHours());
}

function isInFallbackReminderWindow(date = new Date()) {
  const eastern = nowInEastern(date);
  if (eastern.dayOfWeek === 5) {
    return eastern.hour >= 12 && eastern.hour <= 13;
  }
  if (eastern.dayOfWeek === 6 || eastern.dayOfWeek === 0 || eastern.dayOfWeek === 1 || eastern.dayOfWeek === 2) {
    return eastern.hour >= 11 && eastern.hour <= 12;
  }
  return false;
}

function getReminderType(date = new Date()) {
  if (!isInConfiguredCronHour(date) || !isInFallbackReminderWindow(date)) return null;
  const e = nowInEastern(date);
  if (e.dayOfWeek === 5) return 'available';
  if (e.dayOfWeek === 6) return 'saturday';
  if (e.dayOfWeek === 0) return 'one-hour-left';
  if (e.dayOfWeek === 1) return 'monday-vital-action';
  if (e.dayOfWeek === 2) return 'tuesday-vital-action';
  return null;
}

function hasMeaningfulScores(row) {
  if (!row || typeof row.scores !== 'object' || row.scores === null) return false;
  return Object.values(row.scores).some((value) => typeof value === 'number' && Number.isFinite(value));
}

const SUBJECTS = {
  available:      "Your weekly CEO review is open — 6C's Scorecard",
  saturday:       "Still time this weekend — your 6C's Scorecard is waiting",
  'one-hour-left': "Last call: just a few hours left to submit your 6C's Scorecard",
  'monday-vital-action': "Kick the week off right — set your Vital Action",
  'tuesday-vital-action': "Still time to set this week's Vital Action",
};

const FROM_NAME = 'Jake Sebok';
const FORCED_TEST_RECIPIENT = 'jacob@alignedpower.coach';

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function normalizeOneThing(value) {
  return String(value || '').trim();
}

function getEasternDateKey(date = new Date()) {
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return fmt.format(date);
}

function isReminderType(value) {
  return value === 'available'
    || value === 'saturday'
    || value === 'one-hour-left'
    || value === 'monday-vital-action'
    || value === 'tuesday-vital-action';
}

function isVitalActionReminderType(value) {
  return value === 'monday-vital-action' || value === 'tuesday-vital-action';
}

function buildSixCsDetailsHtml() {
  return `
    <h3 style="margin:0 0 12px;color:#0E1624;font-size:16px;font-weight:700;">The 6C&rsquo;s are:</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;table-layout:fixed;">
      <tr>
        <td width="50%" style="padding:6px 8px;color:#3A4A5C;font-size:14px;white-space:nowrap;">&#9670; <strong>Clarity</strong></td>
        <td width="50%" style="padding:6px 8px;color:#3A4A5C;font-size:14px;white-space:nowrap;">&#9670; <strong>Coherence</strong></td>
      </tr>
      <tr>
        <td width="50%" style="padding:6px 8px;color:#3A4A5C;font-size:14px;white-space:nowrap;">&#9670; <strong>Capacity</strong></td>
        <td width="50%" style="padding:6px 8px;color:#3A4A5C;font-size:14px;white-space:nowrap;">&#9670; <strong>Confidence</strong></td>
      </tr>
      <tr>
        <td width="50%" style="padding:6px 8px;color:#3A4A5C;font-size:14px;white-space:nowrap;">&#9670; <strong>Courage</strong></td>
        <td width="50%" style="padding:6px 8px;color:#3A4A5C;font-size:14px;white-space:nowrap;">&#9670; <strong>Connection</strong></td>
      </tr>
    </table>
    <p style="margin:0 0 28px;color:#3A4A5C;font-size:15px;line-height:1.7;">Rate yourself honestly across each one. See what&rsquo;s holding you back and set your Vital Action to focus on next week.</p>`;
}

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
      primaryUrl: SCORECARD_URL,
      detailsHtml: buildSixCsDetailsHtml(),
      footerCta: 'Log In to My Portal &rarr;',
    },
    saturday: {
      headline: "Don't lose the week<br>without reviewing it.",
      body: `Your 6C's Scorecard for this week is still open until <strong>Sunday at 6pm Eastern</strong>. A few minutes of reflection now makes next week sharper.`,
      subtext: `Most people skip the review and wonder why the same patterns keep showing up. You're here because you're not most people.`,
      cta: 'Complete My Scorecard →',
      urgency: null,
      primaryUrl: SCORECARD_URL,
      detailsHtml: buildSixCsDetailsHtml(),
      footerCta: 'Log In to My Portal &rarr;',
    },
    'one-hour-left': {
      headline: "Just a few hours left.<br>Don't let the week slip.",
      body: `The window closes at <strong>6pm Eastern today</strong>. Your 6C's Scorecard takes less than five minutes — and it's the five minutes that set the direction for everything else next week.`,
      subtext: `Log in now and get it done before the window closes.`,
      cta: 'Submit Now — Closes at 6pm →',
      urgency: `<p style="margin:0;font-size:13px;color:#B45309;font-weight:600;">⏱ Closes today at 6pm Eastern</p>`,
      primaryUrl: SCORECARD_URL,
      detailsHtml: buildSixCsDetailsHtml(),
      footerCta: 'Log In to My Portal &rarr;',
    },
    'monday-vital-action': {
      headline: "Kick the week off right.<br>Set your Vital Action.",
      body: `You missed this weekend&rsquo;s 6C's Scorecard, but you can still set your <strong>Vital Action</strong> for the week ahead. It takes less than a minute and keeps your focus front and center.`,
      subtext: `No full scorecard or 6C reflections this time. Just the one move that would make everything else easier or unnecessary this week.`,
      cta: 'Set My Vital Action →',
      urgency: `<p style="margin:0;font-size:13px;color:#0E1624;font-weight:600;">You can still set it now and keep this week from drifting.</p>`,
      primaryUrl: DASHBOARD_URL,
      detailsHtml: `
    <div style="background:#FAF9F7;border:1px solid #E8E6E3;border-radius:10px;padding:18px 20px;margin-bottom:28px;">
      <p style="margin:0 0 10px;color:#0E1624;font-size:15px;font-weight:700;">What you can do now</p>
      <p style="margin:0;color:#3A4A5C;font-size:14px;line-height:1.7;">Open your dashboard and set the single move ALFRED should keep front and center this week. Your full scorecard stays closed until Friday at 12pm Eastern.</p>
    </div>`,
      footerCta: 'Open My Dashboard &rarr;',
    },
    'tuesday-vital-action': {
      headline: "Still time to set this week&rsquo;s<br>Vital Action.",
      body: `If the scorecard window slipped by, don&rsquo;t let the whole week drift with it. You can still set your <strong>Vital Action</strong> and give this week a clear anchor.`,
      subtext: `It takes less than a minute inside your dashboard, and it stays visible at the top of your portal and ALFRED dashboard all week.`,
      cta: 'Set My Vital Action →',
      urgency: null,
      primaryUrl: DASHBOARD_URL,
      detailsHtml: `
    <div style="background:#FAF9F7;border:1px solid #E8E6E3;border-radius:10px;padding:18px 20px;margin-bottom:28px;">
      <p style="margin:0 0 10px;color:#0E1624;font-size:15px;font-weight:700;">What you can do now</p>
      <p style="margin:0;color:#3A4A5C;font-size:14px;line-height:1.7;">Skip the full review for now and just choose the one move that matters most. The dashboard will keep it front and center until the next scorecard window opens.</p>
    </div>`,
      footerCta: 'Open My Dashboard &rarr;',
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
      <a href="${c.primaryUrl}" style="display:inline-block;background:#FF6B1A;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:16px 36px;border-radius:8px;">${c.cta}</a>
    </div>

    <hr style="border:none;border-top:1px solid #DDE3ED;margin:0 0 28px;">

    ${c.detailsHtml}

    <div style="text-align:center;margin-bottom:8px;">
      <a href="${c.primaryUrl}" style="display:inline-block;background:#0E1624;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">${c.footerCta}</a>
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

Just a few hours left. The window closes at 6pm Eastern today.

Log in now and get it done before it closes:
${SCORECARD_URL}

-- Jake Sebok`,
    'monday-vital-action': `${name}

You missed this weekend's 6C's Scorecard, but you can still set your Vital Action for the week ahead.

No full scorecard or 6C reflections this time. Just the one move that would make everything else easier or unnecessary this week.

→ Set your Vital Action: ${DASHBOARD_URL}

-- Jake Sebok`,
    'tuesday-vital-action': `${name}

Still time to set this week's Vital Action.

If the scorecard window slipped by, don't let the whole week drift with it. Open your dashboard and choose the one move that matters most this week.

→ Set your Vital Action: ${DASHBOARD_URL}

-- Jake Sebok`,
  };
  return texts[type] || texts.available;
}

function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function getEasternOffsetMinutes(date) {
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'shortOffset' });
  const parts = fmt.formatToParts(date);
  const tzName = (parts.find((p) => p.type === 'timeZoneName') || {}).value || '';
  const match = tzName.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  const hours = parseInt(match[2] || '0', 10) || 0;
  const minutes = parseInt(match[3] || '0', 10) || 0;
  return sign * ((hours * 60) + minutes);
}

function easternLocalToUtc(year, month, day, hour, minute) {
  let utcMs = Date.UTC(year, month - 1, day, hour, minute || 0, 0, 0);
  for (let i = 0; i < 2; i += 1) {
    const offsetMinutes = getEasternOffsetMinutes(new Date(utcMs));
    utcMs = Date.UTC(year, month - 1, day, hour, minute || 0, 0, 0) - (offsetMinutes * 60 * 1000);
  }
  return new Date(utcMs);
}

function shiftEasternDate(parts, days, hour, minute) {
  const normalized = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days, hour, minute || 0, 0, 0));
  return easternLocalToUtc(
    normalized.getUTCFullYear(),
    normalized.getUTCMonth() + 1,
    normalized.getUTCDate(),
    normalized.getUTCHours(),
    normalized.getUTCMinutes()
  );
}

function getScorecardWindow(date = new Date()) {
  const now = date;
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
  const eastern = {
    dayOfWeek: dayNames[o.weekday] ?? 0,
    year: parseInt(o.year, 10) || 2025,
    month: parseInt(o.month, 10) || 1,
    day: parseInt(o.day, 10) || 1,
    hour: parseInt(o.hour, 10) || 0,
    minute: parseInt(o.minute, 10) || 0,
  };
  const inWindow = (eastern.dayOfWeek === 5 && eastern.hour >= 12) || eastern.dayOfWeek === 6 || (eastern.dayOfWeek === 0 && eastern.hour < 18);
  let daysToFriday = (5 - eastern.dayOfWeek + 7) % 7;
  if (eastern.dayOfWeek === 5 && eastern.hour >= 12) daysToFriday += 7;
  const nextOpen = shiftEasternDate(eastern, daysToFriday, 12, 0);
  const nextClose = shiftEasternDate(eastern, daysToFriday + 2, 18, 0);
  return {
    opensAt: (inWindow
      ? shiftEasternDate(eastern, eastern.dayOfWeek === 5 ? 0 : eastern.dayOfWeek === 6 ? -1 : -2, 12, 0)
      : nextOpen).toISOString(),
    closesAt: (inWindow
      ? shiftEasternDate(eastern, eastern.dayOfWeek === 5 ? 2 : eastern.dayOfWeek === 6 ? 1 : 0, 18, 0)
      : nextClose).toISOString(),
    nextOpen: nextOpen.toISOString(),
  };
}

function getThisWeekWindowBounds(date = new Date()) {
  const { opensAt, closesAt } = getScorecardWindow(date);
  return { opensAt, closesAt };
}

function getMostRecentWindowBounds(date = new Date()) {
  const currentWindow = getScorecardWindow(date);
  const eastern = nowInEastern(date);
  const inWindow = (eastern.dayOfWeek === 5 && eastern.hour >= 12) || eastern.dayOfWeek === 6 || (eastern.dayOfWeek === 0 && eastern.hour < 18);
  if (inWindow) {
    return {
      opensAt: currentWindow.opensAt,
      closesAt: currentWindow.closesAt,
      nextOpen: new Date(new Date(currentWindow.opensAt).getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString(),
    };
  }
  return {
    opensAt: new Date(new Date(currentWindow.opensAt).getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString(),
    closesAt: new Date(new Date(currentWindow.closesAt).getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString(),
    nextOpen: currentWindow.nextOpen || currentWindow.opensAt,
  };
}

function isWithinWindow(dateValue, bounds, options = {}) {
  const timestamp = new Date(dateValue).getTime();
  if (!Number.isFinite(timestamp)) return false;
  const startTs = new Date(bounds.opensAt).getTime();
  const endTs = new Date(bounds.closesAt).getTime();
  const startOk = options.startExclusive ? timestamp > startTs : timestamp >= startTs;
  const endOk = options.endExclusive ? timestamp < endTs : timestamp <= endTs;
  return startOk && endOk;
}

function hasManualVitalAction(row) {
  return !!(row && !hasMeaningfulScores(row) && normalizeOneThing(row.one_thing_to_improve));
}

async function fetchClientSixCRows({ supabaseUrl, serviceKey, email }) {
  const rowsUrl = `${supabaseUrl}/rest/v1/six_c_submissions?select=created_at,scores,one_thing_to_improve&email=eq.${encodeURIComponent(email)}&order=created_at.desc`;
  const rowsRes = await fetch(rowsUrl, {
    method: 'GET',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Accept: 'application/json',
    },
  });
  if (!rowsRes.ok) {
    throw new Error(`six_c_submissions fetch failed (${rowsRes.status})`);
  }
  const rows = await rowsRes.json();
  return Array.isArray(rows) ? rows : [];
}

async function shouldSendVitalActionReminder({ email, supabaseUrl, serviceKey, mostRecentWindow }) {
  const rows = await fetchClientSixCRows({ supabaseUrl, serviceKey, email });
  const hasAnyScoredSubmission = rows.some((row) => hasMeaningfulScores(row));
  if (!hasAnyScoredSubmission) return false;
  const submittedMostRecentScorecard = rows.some((row) =>
    hasMeaningfulScores(row) && isWithinWindow(row.created_at, mostRecentWindow)
  );
  if (submittedMostRecentScorecard) return false;
  const hasManualPostWindowVitalAction = rows.some((row) =>
    hasManualVitalAction(row) && isWithinWindow(row.created_at, {
      opensAt: mostRecentWindow.closesAt,
      closesAt: mostRecentWindow.nextOpen,
    }, { startExclusive: true, endExclusive: true })
  );
  return !hasManualPostWindowVitalAction;
}

export async function GET(request) {
  const url = request.url ? new URL(request.url) : null;
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const secret = (authHeader.replace(/^Bearer\s+/i, '').trim() || (url && url.searchParams.get('secret')) || '').trim();
  const forcedTypeRaw = url && url.searchParams.get('force_type');
  const forcedType = isReminderType(forcedTypeRaw) ? forcedTypeRaw : null;
  const cronSecret = (process.env.CRON_SECRET || '').trim();
  if (!cronSecret) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'CRON_SECRET required' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  if (secret !== cronSecret) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.SIX_C_FROM_EMAIL || 'scorecard@alignedpower.coach';
  const fromLine = `${FROM_NAME} <${fromEmail}>`;

  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  // ── Test send ──
  const testSendEmail = url && url.searchParams.get('test_send');
  if (testSendEmail) {
    const normalizedTestEmail = normalizeEmail(testSendEmail);
    if (!isValidEmail(normalizedTestEmail)) {
      return new Response(JSON.stringify({ error: 'invalid_email', message: 'test_send must be a valid email address' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (forcedType && normalizedTestEmail !== FORCED_TEST_RECIPIENT) {
      return new Response(
        JSON.stringify({
          error: 'forbidden_test_recipient',
          message: `Forced reminder tests may only send to ${FORCED_TEST_RECIPIENT}.`,
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!resendKey) {
      return new Response(JSON.stringify({ error: 'missing_env', message: 'RESEND_API_KEY required to send test email' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    const type = forcedType || 'available';
    const html = buildHtmlEmail({ type, firstName: null });
    const text = buildTextEmail({ type, firstName: null });
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: fromLine,
          to: [normalizedTestEmail],
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
      return new Response(JSON.stringify({
        ok: true,
        test_send: true,
        forcedType: type,
        to: normalizedTestEmail,
        id: data.id || null,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: 'send_error', message: String(err.message) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  // ── Status check ──
  const statusOnly = url && (url.searchParams.get('status') === '1' || url.searchParams.get('status') === 'true');
  if (statusOnly) {
    const now = new Date();
    const e = nowInEastern(now);
    const type = forcedType || getReminderType(now);
    const message = !type
      ? 'No reminder scheduled for this time (Fri/Tue during the configured fallback cron hours only).'
      : isVitalActionReminderType(type)
        ? `Would send "${type}" to active clients who missed the most recent scored 6Cs window and have not set a Vital Action yet. Redundant cron attempts are deduped with Resend idempotency keys.`
        : `Would send "${type}" to active clients (Sat/Sun: only those who haven't submitted a scored 6Cs this week). Redundant cron attempts are deduped with Resend idempotency keys.`;
    return new Response(
      JSON.stringify({
        ok: true,
        status: true,
        eastern: { dayOfWeek: e.dayOfWeek, hour: e.hour, minute: e.minute },
        utc: { hour: now.getUTCHours(), minute: now.getUTCMinutes() },
        configuredUtcHours: CONFIGURED_CRON_UTC_HOURS,
        expectedUtcHour: getExpectedCronUtcHour(now),
        reminderType: type,
        forcedType,
        message,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // ── Scheduled send ──
  const type = getReminderType(new Date());
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
    const subsUrl = `${supabaseUrl}/rest/v1/six_c_submissions?select=email,scores&created_at=gte.${encodeURIComponent(opensAt)}&created_at=lte.${encodeURIComponent(closesAt)}`;
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
        if (!hasMeaningfulScores(r)) return;
        const e = (r.email || '').trim().toLowerCase();
        if (e) submittedEmails.add(e);
      });
    }
    clients = clients.filter((c) => !submittedEmails.has(c.email));
  } else if (isVitalActionReminderType(type)) {
    const mostRecentWindow = getMostRecentWindowBounds();
    const eligibility = await Promise.all(clients.map(async (client) => {
      try {
        const eligible = await shouldSendVitalActionReminder({
          email: client.email,
          supabaseUrl,
          serviceKey,
          mostRecentWindow,
        });
        return eligible ? client : null;
      } catch (err) {
        console.error('[6c-reminders] Vital Action eligibility error for', client.email, err);
        return null;
      }
    }));
    clients = eligibility.filter(Boolean);
  }

  if (clients.length === 0) {
    const totalActive = (Array.isArray(activeRows) ? activeRows : []).length;
    const skippedReason = isVitalActionReminderType(type)
      ? 'all_already_set_vital_action_or_ineligible'
      : 'all_already_submitted_this_week';
    return new Response(JSON.stringify({
      ok: true,
      sent: 0,
      ...(totalActive > 0 && type !== 'available' && { skipped: totalActive, reason: skippedReason }),
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'RESEND_API_KEY required to send emails' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  let sent = 0;
  let failed = 0;
  let deduped = 0;
  const reminderDateKey = getEasternDateKey();
  for (const client of clients) {
    const html = buildHtmlEmail({ type, firstName: client.firstName });
    const text = buildTextEmail({ type, firstName: client.firstName });
    const idempotencyKey = `6c-reminder/${type}/${reminderDateKey}/${client.email}`;
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendKey}`,
          'Idempotency-Key': idempotencyKey,
        },
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
      else if (res.status === 409) {
        deduped++;
        console.info('[6c-reminders] Resend deduped request for', client.email, idempotencyKey, await res.text());
      } else {
        failed++;
        console.error('[6c-reminders] Resend error for', client.email, await res.text());
      }
    } catch (err) {
      failed++;
      console.error('[6c-reminders] Send error for', client.email, err);
    }
  }

  const totalActive = (Array.isArray(activeRows) ? activeRows : []).length;
  const skipped = totalActive - clients.length;
  const skippedReason = isVitalActionReminderType(type)
    ? 'already_set_vital_action_or_ineligible'
    : 'already_submitted_this_week';
  return new Response(JSON.stringify({
    ok: true,
    type,
    sent,
    deduped,
    failed,
    total: clients.length,
    ...(skipped > 0 && { skipped, reason: skippedReason }),
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
