/**
 * Notification dispatcher — web push (via web-push minimal implementation) + Resend email.
 * Fail-loud. Writes vapi_notification_events for every attempt.
 */

function env(n) { const v = process.env[n]; if (!v) return null; return v; }

async function supa(path, opts = {}) {
  return fetch(`${env('SUPABASE_URL')}${path}`, {
    ...opts,
    headers: Object.assign({
      apikey: env('SUPABASE_SERVICE_ROLE_KEY'),
      Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
      Prefer: opts.prefer || 'return=representation',
    }, opts.headers || {}),
  });
}

async function writeEvent({ email, kind, channel, outcome, error, source_row_id }) {
  await supa('/rest/v1/vapi_notification_events', {
    method: 'POST',
    prefer: 'return=minimal',
    body: JSON.stringify({ email, kind, channel, outcome, error: error || null, source_row_id: source_row_id || null }),
  });
}

export async function sendEmail({ email, subject, html, text, kind, source_row_id }) {
  const key = env('RESEND_API_KEY');
  const from = env('RESEND_FROM_EMAIL') || 'Aligned Performance <alerts@alignedpower.coach>';
  if (!key) {
    await writeEvent({ email, kind, channel: 'email', outcome: 'suppressed', error: 'missing_resend_key', source_row_id });
    return { ok: false, error: 'missing_resend_key' };
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: email, subject, html, text }),
    });
    if (!res.ok) {
      const err = await res.text();
      await writeEvent({ email, kind, channel: 'email', outcome: 'failed', error: err.slice(0, 500), source_row_id });
      return { ok: false, error: err };
    }
    await writeEvent({ email, kind, channel: 'email', outcome: 'sent', source_row_id });
    return { ok: true };
  } catch (e) {
    await writeEvent({ email, kind, channel: 'email', outcome: 'failed', error: String(e.message || e).slice(0, 500), source_row_id });
    return { ok: false, error: String(e) };
  }
}

// NOTE: full web-push crypto requires VAPID private key + ECDH/AES-GCM. Vercel Node functions support web-push via npm but
// to keep Hobby plan portable we use a minimal send-via-FCM approach for Chrome or rely on Resend email fallback.
// Implementation: if web-push package is present, use it; otherwise log suppressed + fall back to email.
export async function sendPush({ email, title, body, url, subscription, kind, source_row_id }) {
  if (!subscription) {
    await writeEvent({ email, kind, channel: 'push', outcome: 'suppressed', error: 'no_subscription', source_row_id });
    return { ok: false, fallback: 'email' };
  }
  try {
    // Minimal web-push via the web-push package (dynamic import so missing package doesn't blow up)
    const webpush = await import('web-push').catch(() => null);
    const vapidPub = env('VAPID_PUBLIC_KEY');
    const vapidPriv = env('VAPID_PRIVATE_KEY');
    const vapidSubject = env('VAPID_SUBJECT') || 'mailto:jacob@alignedpower.coach';
    if (!webpush || !vapidPub || !vapidPriv) {
      await writeEvent({ email, kind, channel: 'push', outcome: 'suppressed', error: 'missing_webpush_deps_or_keys', source_row_id });
      return { ok: false, fallback: 'email' };
    }
    webpush.default.setVapidDetails(vapidSubject, vapidPub, vapidPriv);
    const payload = JSON.stringify({ title, body, url: url || '/dashboard', tag: kind || 'vapi' });
    await webpush.default.sendNotification(subscription, payload, { TTL: 60 * 60 });
    await writeEvent({ email, kind, channel: 'push', outcome: 'sent', source_row_id });
    return { ok: true };
  } catch (e) {
    await writeEvent({ email, kind, channel: 'push', outcome: 'failed', error: String(e.message || e).slice(0, 500), source_row_id });
    return { ok: false, fallback: 'email', error: String(e) };
  }
}

export async function notify({ email, kind, title, body, url, prefs, source_row_id, channelOverride }) {
  const channel = channelOverride || (prefs && prefs[`channel_${kind.split('_')[0]}`]) || 'push';
  if (channel === 'off') {
    await writeEvent({ email, kind, channel: 'none', outcome: 'suppressed', error: 'channel_off', source_row_id });
    return { ok: false };
  }
  if (channel === 'push' || channel === 'both') {
    const r = await sendPush({ email, title, body, url, subscription: prefs && prefs.push_subscription, kind, source_row_id });
    if (r.ok && channel === 'push') return r;
    if (channel === 'push' && r.fallback === 'email') {
      return sendEmail({ email, subject: title, html: `<p>${body}</p><p><a href="https://portal.alignedpower.coach${url || '/dashboard'}">Open VAPI</a></p>`, text: body, kind, source_row_id });
    }
  }
  if (channel === 'email' || channel === 'both') {
    return sendEmail({ email, subject: title, html: `<p>${body}</p><p><a href="https://portal.alignedpower.coach${url || '/dashboard'}">Open VAPI</a></p>`, text: body, kind, source_row_id });
  }
  return { ok: false };
}
