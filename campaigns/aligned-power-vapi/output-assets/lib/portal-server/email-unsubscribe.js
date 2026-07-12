/**
 * Shared unsubscribe utilities for every portal email sender.
 *
 * Provides a *functional* unsubscribe: a signed one-click link, RFC 8058
 * List-Unsubscribe headers (Gmail/Yahoo one-click), and a Supabase-backed
 * suppression list (public.email_unsubscribes) that senders check before mailing.
 *
 * The token is HMAC-SHA256 over the lowercased email, so a link cannot be
 * forged to unsubscribe an arbitrary address, and the same value verifies on
 * click. Secret: UNSUBSCRIBE_SECRET, falling back to CRON_SECRET (already set
 * in the portal env) so this works with zero new configuration.
 */
import crypto from 'node:crypto';

export const PORTAL_URL = 'https://portal.alignedpower.coach';
export const UNSUB_MAILTO = 'unsubscribe@alignedpower.coach';
const UNSUB_TABLE = 'email_unsubscribes';

function secret() {
  return (process.env.UNSUBSCRIBE_SECRET || process.env.CRON_SECRET || '').trim();
}

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function isValidEmail(value) {
  const s = normalizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** HMAC signature (base64url) of the normalized email, or '' if no secret is configured. */
function signEmail(email) {
  const key = secret();
  if (!key) return '';
  return crypto.createHmac('sha256', key).update(normalizeEmail(email)).digest('base64url');
}

/** Opaque one-click token: base64url(email) + "." + hmac. Returns '' if no secret. */
export function makeUnsubToken(email) {
  const sig = signEmail(email);
  if (!sig) return '';
  return `${Buffer.from(normalizeEmail(email)).toString('base64url')}.${sig}`;
}

/** Returns the verified email for a token, or null if missing / invalid / tampered. */
export function verifyUnsubToken(token) {
  const raw = String(token || '');
  const dot = raw.indexOf('.');
  if (dot <= 0) return null;
  let email;
  try {
    email = Buffer.from(raw.slice(0, dot), 'base64url').toString('utf8');
  } catch {
    return null;
  }
  email = normalizeEmail(email);
  if (!email) return null;
  const expected = signEmail(email);
  const got = raw.slice(dot + 1);
  if (!expected || expected.length !== got.length) return null;
  try {
    if (!crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return email;
}

/**
 * Per-recipient unsubscribe URL. Uses a signed one-click token when a secret is
 * configured; otherwise a tokenless link that lands on the manual confirm form.
 */
export function unsubscribeUrl(email) {
  const token = makeUnsubToken(email);
  return token
    ? `${PORTAL_URL}/unsubscribe?u=${encodeURIComponent(token)}`
    : `${PORTAL_URL}/unsubscribe?e=${encodeURIComponent(normalizeEmail(email))}`;
}

/** RFC 8058 one-click List-Unsubscribe headers for the Resend `headers` payload field. */
export function unsubscribeHeaders(email) {
  return {
    'List-Unsubscribe': `<${unsubscribeUrl(email)}>, <mailto:${UNSUB_MAILTO}?subject=unsubscribe>`,
    'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
  };
}

/**
 * Fetch the full suppression set (lowercased emails). THROWS on any failure so a
 * caller can abort the send rather than mail people who opted out.
 */
export async function fetchUnsubscribedSet({ supabaseUrl, serviceKey }) {
  if (!supabaseUrl || !serviceKey) {
    throw new Error('fetchUnsubscribedSet: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }
  const res = await fetch(`${supabaseUrl}/rest/v1/${UNSUB_TABLE}?select=email`, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' },
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`email_unsubscribes fetch failed (${res.status}): ${detail.slice(0, 200)}`);
  }
  const rows = await res.json();
  const set = new Set();
  (Array.isArray(rows) ? rows : []).forEach((r) => {
    const e = normalizeEmail(r.email);
    if (e) set.add(e);
  });
  return set;
}

/** Upsert an opt-out. Idempotent. THROWS on failure (so the endpoint returns a real error). */
export async function recordUnsubscribe({ supabaseUrl, serviceKey, email, source }) {
  const e = normalizeEmail(email);
  if (!e) throw new Error('recordUnsubscribe: empty email');
  if (!supabaseUrl || !serviceKey) {
    throw new Error('recordUnsubscribe: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }
  const res = await fetch(`${supabaseUrl}/rest/v1/${UNSUB_TABLE}?on_conflict=email`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({ email: e, source: source || 'link' }),
  });
  if (!res.ok && res.status !== 409) {
    const detail = await res.text().catch(() => '');
    throw new Error(`recordUnsubscribe failed (${res.status}): ${detail.slice(0, 200)}`);
  }
}

function esc(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Branded unsubscribe page. state: 'done' | 'confirm' | 'error'.
 * `invalid` marks a rejected form submission on the confirm state.
 */
export function renderUnsubPage({ email, state, invalid }) {
  const safeEmail = esc(email);
  let inner;
  if (state === 'done') {
    inner = `
      <div style="font-size:44px;line-height:1;margin-bottom:16px;">&#10003;</div>
      <h1 style="margin:0 0 12px;color:#0E1624;font-size:24px;font-weight:700;">You&rsquo;re unsubscribed</h1>
      <p style="margin:0 0 8px;color:#3A4A5C;font-size:16px;line-height:1.6;">
        ${safeEmail ? `<strong>${safeEmail}</strong> has been` : 'You have been'} removed from
        6C&rsquo;s Scorecard reminders and other non-essential email.
      </p>
      <p style="margin:0;color:#7A8FA8;font-size:14px;line-height:1.6;">
        You may still receive one-time messages you directly request (like assessment results).
        Changed your mind? Just reply to any email and we&rsquo;ll add you back.
      </p>`;
  } else if (state === 'error') {
    inner = `
      <h1 style="margin:0 0 12px;color:#0E1624;font-size:24px;font-weight:700;">Something went wrong</h1>
      <p style="margin:0 0 8px;color:#3A4A5C;font-size:16px;line-height:1.6;">
        We couldn&rsquo;t process that unsubscribe just now. Please try again in a moment, or
        email <a href="mailto:${UNSUB_MAILTO}" style="color:#FF6B1A;">${UNSUB_MAILTO}</a> and we&rsquo;ll remove you.
      </p>`;
  } else {
    inner = `
      <h1 style="margin:0 0 12px;color:#0E1624;font-size:24px;font-weight:700;">Unsubscribe</h1>
      <p style="margin:0 0 20px;color:#3A4A5C;font-size:16px;line-height:1.6;">
        Enter your email to stop 6C&rsquo;s Scorecard reminders and other non-essential email.
      </p>
      ${invalid ? `<p style="margin:0 0 12px;color:#B45309;font-size:14px;">Please enter a valid email address.</p>` : ''}
      <form method="post" action="/unsubscribe" style="display:flex;flex-direction:column;gap:12px;">
        <input type="email" name="email" required value="${safeEmail}" placeholder="you@example.com"
          style="padding:14px 16px;border:1px solid #DDE3ED;border-radius:8px;font-size:16px;color:#0E1624;" />
        <button type="submit"
          style="background:#FF6B1A;color:#FFFFFF;font-size:15px;font-weight:700;border:none;padding:14px 20px;border-radius:8px;cursor:pointer;">
          Unsubscribe me
        </button>
      </form>`;
  }
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Unsubscribe &middot; Aligned Power</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:48px 16px;">
<tr><td align="center">
<table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDE3ED;">
  <tr><td style="background:#FAF9F7;padding:28px 40px;text-align:center;border-bottom:1px solid #E8E6E3;">
    <img src="https://portal.alignedpower.coach/images/vapi-logo.png" alt="Aligned Power" width="160" height="auto" style="display:block;max-width:160px;height:auto;margin:0 auto;" />
  </td></tr>
  <tr><td style="padding:40px;text-align:center;">${inner}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}
