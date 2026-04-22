/**
 * Morning Alignment Check-in handler.
 *
 * POST /api/morning-checkin { priorities:[{text,domain_code}], honored_domain, alignment_intention, timezone }
 * GET  /api/morning-checkin?date=YYYY-MM-DD — returns today's (or specified) check-in if any
 */

import { DOMAIN_BY_CODE } from '../vapi-taxonomy-constants.js';

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`[morning-checkin] Missing env: ${name}`);
  return v;
}

function todayLocalIso(tz) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: tz || 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' });
    return formatter.format(new Date());
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
  }
}

async function getAuthEmail(req) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const url = env('SUPABASE_URL');
  const anon = env('SUPABASE_ANON_KEY');
  const r = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: anon, Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.email && String(u.email).toLowerCase()) || null;
}

async function supaFetch(path, opts = {}) {
  const url = env('SUPABASE_URL');
  const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY');
  const headers = Object.assign({
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    Prefer: opts.prefer || 'return=representation',
  }, opts.headers || {});
  return fetch(`${url}${path}`, { ...opts, headers });
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const email = await getAuthEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  const priorities = Array.isArray(body.priorities) ? body.priorities.slice(0, 5).map(p => ({
    text: String(p && p.text || '').trim().slice(0, 280),
    domain_code: DOMAIN_BY_CODE[p && p.domain_code] ? p.domain_code : null,
  })).filter(p => p.text) : [];
  const honored_domain = DOMAIN_BY_CODE[body.honored_domain] ? body.honored_domain : null;
  const alignment_intention = (body.alignment_intention ? String(body.alignment_intention).trim().slice(0, 280) : '') || null;
  const timezone = body.timezone || 'America/New_York';
  const local_date = body.local_date || todayLocalIso(timezone);
  const source = body.source === 'alfred' ? 'alfred' : 'portal';

  const payload = { email, priorities, honored_domain, alignment_intention, timezone, source, local_date, completed_at: new Date().toISOString() };

  // Upsert on (email, local_date)
  const res = await supaFetch(`/rest/v1/vapi_morning_checkins?on_conflict=email,local_date`, {
    method: 'POST',
    prefer: 'resolution=merge-duplicates,return=representation',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[morning-checkin] upsert failed', res.status, err);
    return new Response(JSON.stringify({ error: 'db_write_failed', detail: err }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const rows = await res.json();
  const row = Array.isArray(rows) ? rows[0] : rows;

  // Fire presence evaluation for this user (post-hoc). Never blocks response.
  fetch(`${env('SUPABASE_URL').replace('.supabase.co','.supabase.co')}`).catch(() => {});
  try {
    const { evaluatePresenceForUser } = await import('../vapi-presence-engine.js');
    await evaluatePresenceForUser({ email, trigger_context: 'morning_checkin' });
  } catch (e) {
    console.error('[morning-checkin] presence evaluation failed', e);
    // Fail-loud audit row
    await supaFetch('/rest/v1/vapi_presence_trigger_events', {
      method: 'POST',
      prefer: 'return=minimal',
      body: JSON.stringify({ email, trigger_id: 'presence_runtime_error', version: 'v1.0.0', outcome: 'error', payload: { error: String(e && e.message || e), context: 'morning_checkin' } }),
    }).catch(() => {});
  }

  return new Response(JSON.stringify({ ok: true, checkin: row }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(request) {
  const email = await getAuthEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const url = new URL(request.url, 'https://internal.local');
  const date = url.searchParams.get('date') || todayLocalIso(url.searchParams.get('tz') || 'America/New_York');
  const res = await supaFetch(`/rest/v1/vapi_morning_checkins?email=eq.${encodeURIComponent(email)}&local_date=eq.${date}&select=*&limit=1`);
  if (!res.ok) {
    return new Response(JSON.stringify({ error: 'db_read_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const rows = await res.json();
  return new Response(JSON.stringify({ ok: true, checkin: rows[0] || null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
