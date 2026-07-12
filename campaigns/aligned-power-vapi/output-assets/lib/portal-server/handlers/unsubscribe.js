/**
 * Unsubscribe endpoint. Mounted at /api/unsubscribe (and the pretty /unsubscribe
 * rewrite) via api/gw.js. Backs the functional unsubscribe link + the RFC 8058
 * List-Unsubscribe / List-Unsubscribe-Post headers on every portal email.
 *
 *   GET  ?u=<token>   one-click link → record opt-out → branded confirmation page
 *   GET  ?e=<email>   tokenless / mailto fallback → manual confirm form
 *   POST ?u=<token>   RFC 8058 one-click (mailbox providers POST here, no UI) → 200
 *   POST (form email) manual confirm form submit → record → confirmation page
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (already set for the portal).
 */
import {
  verifyUnsubToken,
  recordUnsubscribe,
  renderUnsubPage,
  normalizeEmail,
  isValidEmail,
} from '../email-unsubscribe.js';

function parseUrl(request) {
  const raw = request.url || '';
  return new URL(raw, raw.startsWith('http') ? undefined : 'https://internal.local');
}

function htmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

async function persist(email, source) {
  await recordUnsubscribe({
    supabaseUrl: process.env.SUPABASE_URL,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    email,
    source,
  });
}

export async function GET(request) {
  const url = parseUrl(request);
  const email = verifyUnsubToken(url.searchParams.get('u'));

  if (email) {
    try {
      await persist(email, 'one-click-link');
      return htmlResponse(renderUnsubPage({ email, state: 'done' }));
    } catch (err) {
      console.error('[unsubscribe] GET record failed', err);
      return htmlResponse(renderUnsubPage({ email, state: 'error' }), 500);
    }
  }

  // No / invalid token → manual confirm form (prefilled from ?e= when it looks valid).
  const emailParam = normalizeEmail(url.searchParams.get('e'));
  const prefill = isValidEmail(emailParam) ? emailParam : '';
  return htmlResponse(renderUnsubPage({ email: prefill, state: 'confirm' }));
}

export async function POST(request) {
  const url = parseUrl(request);

  // 1) RFC 8058 one-click: mailbox providers POST to the List-Unsubscribe URL
  //    (token in the query) with no body and expect a 2xx, no confirmation UI.
  const tokenEmail = verifyUnsubToken(url.searchParams.get('u'));
  if (tokenEmail) {
    try {
      await persist(tokenEmail, 'one-click-post');
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[unsubscribe] one-click POST failed', err);
      return new Response(JSON.stringify({ ok: false }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // 2) Manual confirm form submit (urlencoded or JSON).
  let email = '';
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await request.json();
      email = normalizeEmail(body && body.email);
    } else {
      const form = await request.formData();
      email = normalizeEmail(form.get('email'));
    }
  } catch {
    /* fall through to validation */
  }

  if (!isValidEmail(email)) {
    return htmlResponse(renderUnsubPage({ email: '', state: 'confirm', invalid: true }), 400);
  }
  try {
    await persist(email, 'manual-form');
    return htmlResponse(renderUnsubPage({ email, state: 'done' }));
  } catch (err) {
    console.error('[unsubscribe] manual form failed', err);
    return htmlResponse(renderUnsubPage({ email, state: 'error' }), 500);
  }
}
