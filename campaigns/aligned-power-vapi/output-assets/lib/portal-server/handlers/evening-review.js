/**
 * Evening Integrity Review handler.
 *
 * POST /api/evening-review { day_type, prompt_id, response, priorities_honored_count, drivers_echoed:[], timezone }
 * GET  /api/evening-review?date=YYYY-MM-DD
 */

import { EVENING_PROMPTS, DAY_TYPES, DRIVER_BY_KEY } from '../vapi-taxonomy-constants.js';

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`[evening-review] Missing env: ${name}`);
  return v;
}

function todayLocalIso(tz) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: tz || 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(new Date());
  } catch (e) { return new Date().toISOString().slice(0, 10); }
}

async function getAuthEmail(req) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const r = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, {
    headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.email && String(u.email).toLowerCase()) || null;
}

async function supaFetch(path, opts = {}) {
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

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const email = await getAuthEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  const day_type = DAY_TYPES.find(d => d.id === body.day_type) ? body.day_type : 'any';
  const prompt = EVENING_PROMPTS.find(p => p.id === body.prompt_id) || EVENING_PROMPTS.find(p => p.day_type === day_type) || EVENING_PROMPTS[4];
  const response = body.response ? String(body.response).trim().slice(0, 2000) : null;
  const priorities_honored_count = Number.isInteger(body.priorities_honored_count) ? Math.max(0, Math.min(3, body.priorities_honored_count)) : null;
  const drivers_echoed = Array.isArray(body.drivers_echoed) ? body.drivers_echoed.filter(k => !!DRIVER_BY_KEY[k]) : [];
  const timezone = body.timezone || 'America/New_York';
  const local_date = body.local_date || todayLocalIso(timezone);
  const source = body.source === 'alfred' ? 'alfred' : 'portal';

  // Find today's morning check-in (for cross-ref)
  let morning_checkin_id = null;
  try {
    const mres = await supaFetch(`/rest/v1/vapi_morning_checkins?email=eq.${encodeURIComponent(email)}&local_date=eq.${local_date}&select=id&limit=1`);
    if (mres.ok) {
      const rows = await mres.json();
      if (rows && rows[0]) morning_checkin_id = rows[0].id;
    }
  } catch {}

  const payload = {
    email, day_type, prompt_id: prompt.id, prompt_text: prompt.text, response,
    priorities_honored_count, drivers_echoed, morning_checkin_id,
    timezone, source, local_date, completed_at: new Date().toISOString(),
  };

  const res = await supaFetch(`/rest/v1/vapi_evening_reviews?on_conflict=email,local_date`, {
    method: 'POST', prefer: 'resolution=merge-duplicates,return=representation',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[evening-review] upsert failed', res.status, err);
    return new Response(JSON.stringify({ error: 'db_write_failed', detail: err }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const rows = await res.json();
  const row = Array.isArray(rows) ? rows[0] : rows;

  try {
    const { evaluatePresenceForUser } = await import('../vapi-presence-engine.js');
    await evaluatePresenceForUser({ email, trigger_context: 'evening_review' });
  } catch (e) {
    console.error('[evening-review] presence evaluation failed', e);
    await supaFetch('/rest/v1/vapi_presence_trigger_events', {
      method: 'POST', prefer: 'return=minimal',
      body: JSON.stringify({ email, trigger_id: 'presence_runtime_error', version: 'v1.0.0', outcome: 'error', payload: { error: String(e && e.message || e), context: 'evening_review' } }),
    }).catch(() => {});
  }

  return new Response(JSON.stringify({ ok: true, review: row }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(request) {
  const email = await getAuthEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const url = new URL(request.url, 'https://internal.local');
  const date = url.searchParams.get('date') || todayLocalIso(url.searchParams.get('tz') || 'America/New_York');
  const res = await supaFetch(`/rest/v1/vapi_evening_reviews?email=eq.${encodeURIComponent(email)}&local_date=eq.${date}&select=*&limit=1`);
  if (!res.ok) return new Response(JSON.stringify({ error: 'db_read_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const rows = await res.json();
  return new Response(JSON.stringify({ ok: true, review: rows[0] || null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
