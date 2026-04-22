/**
 * Notification preferences: timezone, morning_time, evening_time, quiet hours, channels, push_subscription.
 * GET  /api/notification-prefs
 * POST /api/notification-prefs (upsert)
 */

function env(n) { const v = process.env[n]; if (!v) throw new Error('missing env: ' + n); return v; }
async function authEmail(req) {
  const a = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!a.startsWith('Bearer ')) return null;
  const r = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: a } });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.email && String(u.email).toLowerCase()) || null;
}
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

const DEFAULTS = {
  timezone: 'America/New_York',
  morning_time: '06:00',
  evening_time: '17:00',
  quiet_hours_start: '21:00',
  quiet_hours_end: '07:00',
  channel_morning: 'push',
  channel_evening: 'push',
  channel_presence: 'push',
  channel_coach: 'email',
  sms_enabled: false,
};

export async function GET(request) {
  const email = await authEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const r = await supa(`/rest/v1/vapi_notification_preferences?email=eq.${encodeURIComponent(email)}&select=*&limit=1`);
  if (!r.ok) return new Response(JSON.stringify({ error: 'db_read_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const rows = await r.json();
  const prefs = rows[0] || Object.assign({ email }, DEFAULTS);
  return new Response(JSON.stringify({ ok: true, prefs }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request) {
  const email = await authEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  let body; try { body = await request.json(); } catch { body = {}; }
  const row = {
    email,
    timezone: body.timezone || DEFAULTS.timezone,
    morning_time: body.morning_time || DEFAULTS.morning_time,
    evening_time: body.evening_time || DEFAULTS.evening_time,
    quiet_hours_start: body.quiet_hours_start || DEFAULTS.quiet_hours_start,
    quiet_hours_end: body.quiet_hours_end || DEFAULTS.quiet_hours_end,
    channel_morning: body.channel_morning || DEFAULTS.channel_morning,
    channel_evening: body.channel_evening || DEFAULTS.channel_evening,
    channel_presence: body.channel_presence || DEFAULTS.channel_presence,
    channel_coach: body.channel_coach || DEFAULTS.channel_coach,
    sms_enabled: !!body.sms_enabled,
    sms_phone: body.sms_phone || null,
    push_subscription: body.push_subscription || null,
    updated_at: new Date().toISOString(),
  };
  const r = await supa('/rest/v1/vapi_notification_preferences?on_conflict=email', {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: JSON.stringify(row),
  });
  if (!r.ok) {
    const err = await r.text();
    console.error('[notification-prefs] upsert failed', err);
    return new Response(JSON.stringify({ error: 'db_write_failed', detail: err }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const rows = await r.json();
  return new Response(JSON.stringify({ ok: true, prefs: Array.isArray(rows) ? rows[0] : rows }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
