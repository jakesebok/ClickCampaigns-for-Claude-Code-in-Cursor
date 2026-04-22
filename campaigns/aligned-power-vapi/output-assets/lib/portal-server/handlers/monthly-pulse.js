/**
 * Monthly Domain Pulse handler.
 *
 * POST /api/monthly-pulse { domain_scores, importance_ratings, notes, timezone }
 * GET  /api/monthly-pulse?month=YYYY-MM-01
 */

import { DOMAIN_BY_CODE } from '../vapi-taxonomy-constants.js';

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`[monthly-pulse] Missing env: ${name}`);
  return v;
}

function firstOfLocalMonth(tz) {
  const iso = new Intl.DateTimeFormat('en-CA', { timeZone: tz || 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return iso.slice(0, 7) + '-01';
}

async function getAuthEmail(req) {
  const a = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!a.startsWith('Bearer ')) return null;
  const r = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: a } });
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

function sanitizeDomainMap(raw, range) {
  const out = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const code of Object.keys(DOMAIN_BY_CODE)) {
    const v = Number(raw[code]);
    if (Number.isFinite(v) && v >= range[0] && v <= range[1]) out[code] = v;
  }
  return out;
}

async function computeDeltaVsLastFull(email, domain_scores, importance_ratings) {
  try {
    const r = await supaFetch(`/rest/v1/vapi_results?email=eq.${encodeURIComponent(email)}&select=results,created_at&order=created_at.desc&limit=1`);
    if (!r.ok) return null;
    const rows = await r.json();
    if (!rows || !rows[0]) return null;
    const baseline = rows[0].results || {};
    const baselineDomains = (baseline.domains || []).reduce((acc, d) => { acc[d.code] = Number(d.score); return acc; }, {});
    const baselineImportance = baseline.importanceRatings || {};
    const domain_deltas = {};
    let sumDelta = 0, count = 0;
    for (const [code, score] of Object.entries(domain_scores)) {
      const prev = Number(baselineDomains[code]);
      if (Number.isFinite(prev)) {
        domain_deltas[code] = Number((score - prev).toFixed(2));
        sumDelta += (score - prev);
        count += 1;
      }
    }
    const composite_delta = count ? Number((sumDelta / count).toFixed(2)) : null;
    const importance_deltas = {};
    for (const [code, imp] of Object.entries(importance_ratings)) {
      const prev = Number(baselineImportance[code]);
      if (Number.isFinite(prev)) importance_deltas[code] = Number((imp - prev).toFixed(2));
    }
    return { domain_deltas, composite_delta, importance_deltas };
  } catch (e) {
    console.error('[monthly-pulse] delta computation failed', e);
    return null;
  }
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { body = {}; }
  const email = await getAuthEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const timezone = body.timezone || 'America/New_York';
  const local_month = body.local_month || firstOfLocalMonth(timezone);
  const domain_scores = sanitizeDomainMap(body.domain_scores, [1, 10]);
  const importance_ratings = sanitizeDomainMap(body.importance_ratings, [1, 10]);
  if (Object.keys(domain_scores).length !== 12 || Object.keys(importance_ratings).length !== 12) {
    return new Response(JSON.stringify({ error: 'invalid_payload', detail: 'All 12 domain scores and importance ratings required (1-10).' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
  const notes = body.notes ? String(body.notes).trim().slice(0, 2000) : null;
  const delta_vs_last_full = await computeDeltaVsLastFull(email, domain_scores, importance_ratings);
  const payload = { email, domain_scores, importance_ratings, delta_vs_last_full, notes, timezone, local_month, source: body.source === 'alfred' ? 'alfred' : 'portal', completed_at: new Date().toISOString() };
  const res = await supaFetch(`/rest/v1/vapi_monthly_pulses?on_conflict=email,local_month`, {
    method: 'POST', prefer: 'resolution=merge-duplicates,return=representation',
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error('[monthly-pulse] upsert failed', res.status, err);
    return new Response(JSON.stringify({ error: 'db_write_failed', detail: err }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const rows = await res.json();
  return new Response(JSON.stringify({ ok: true, pulse: Array.isArray(rows) ? rows[0] : rows }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(request) {
  const email = await getAuthEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const url = new URL(request.url, 'https://internal.local');
  const month = url.searchParams.get('month') || firstOfLocalMonth(url.searchParams.get('tz') || 'America/New_York');
  const res = await supaFetch(`/rest/v1/vapi_monthly_pulses?email=eq.${encodeURIComponent(email)}&local_month=eq.${month}&select=*&limit=1`);
  if (!res.ok) return new Response(JSON.stringify({ error: 'db_read_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const rows = await res.json();
  return new Response(JSON.stringify({ ok: true, pulse: rows[0] || null }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
