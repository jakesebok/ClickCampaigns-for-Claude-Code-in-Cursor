/**
 * Longitudinal intelligence data endpoint.
 * GET /api/longitudinal — returns trajectory, driver history, importance drift, matrix movement, streak.
 */

import { DOMAINS } from '../vapi-taxonomy-constants.js';

function env(n) { const v = process.env[n]; if (!v) throw new Error('missing env: ' + n); return v; }
async function authEmail(req) {
  const a = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!a.startsWith('Bearer ')) return null;
  const r = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: a } });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.email && String(u.email).toLowerCase()) || null;
}
async function supa(path) {
  return fetch(`${env('SUPABASE_URL')}${path}`, {
    headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}` },
  });
}

function isoDay(dt) { return new Date(dt).toISOString().slice(0,10); }

export async function GET(request) {
  const email = await authEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  const emailEnc = encodeURIComponent(email);
  const [assessmentsR, eveningsR, morningsR, pulsesR] = await Promise.all([
    supa(`/rest/v1/vapi_results?email=eq.${emailEnc}&select=id,results,created_at&order=created_at.asc`),
    supa(`/rest/v1/vapi_evening_reviews?email=eq.${emailEnc}&select=local_date,day_type,drivers_echoed,priorities_honored_count,completed_at&order=completed_at.desc&limit=120`),
    supa(`/rest/v1/vapi_morning_checkins?email=eq.${emailEnc}&select=local_date,completed_at&order=completed_at.desc&limit=120`),
    supa(`/rest/v1/vapi_monthly_pulses?email=eq.${emailEnc}&select=*&order=completed_at.asc`),
  ]);
  const assessments = assessmentsR.ok ? await assessmentsR.json() : [];
  const evenings = eveningsR.ok ? await eveningsR.json() : [];
  const mornings = morningsR.ok ? await morningsR.json() : [];
  const pulses = pulsesR.ok ? await pulsesR.json() : [];

  // Trajectory
  const trajectory = assessments.map(a => ({
    id: a.id,
    date: a.created_at,
    archetype: (a.results && a.results.archetype) || 'Unassigned',
    overall: (a.results && a.results.overall) || null,
    primary_driver: (a.results && a.results.driver && a.results.driver.name) || null,
  }));

  // Driver activation history (from evenings)
  const driverHistory = {};
  evenings.forEach(e => {
    (e.drivers_echoed || []).forEach(d => {
      if (!driverHistory[d]) driverHistory[d] = { key: d, count: 0, last_echoed: null };
      driverHistory[d].count += 1;
      if (!driverHistory[d].last_echoed || e.completed_at > driverHistory[d].last_echoed) driverHistory[d].last_echoed = e.completed_at;
    });
  });

  // Importance drift — first vs last assessment
  let importanceDrift = null;
  if (assessments.length >= 2) {
    const first = assessments[0].results || {};
    const last = assessments[assessments.length - 1].results || {};
    const firstImp = first.importanceRatings || {};
    const lastImp = last.importanceRatings || {};
    importanceDrift = DOMAINS.map(d => ({
      code: d.code,
      name: d.name,
      from: Number(firstImp[d.code]) || null,
      to: Number(lastImp[d.code]) || null,
      delta: (Number(lastImp[d.code]) || 0) - (Number(firstImp[d.code]) || 0),
    }));
  }

  // Matrix movement — domain quadrant per assessment
  const matrixMovement = assessments.map(a => {
    const imp = (a.results && a.results.importanceRatings) || {};
    const doms = (a.results && a.results.domains) || [];
    return {
      date: a.created_at,
      domains: doms.map(d => ({
        code: d.code,
        score: Number(d.score),
        importance: Number(imp[d.code]) || null,
        quadrant: classifyQuadrant(Number(d.score), Number(imp[d.code])),
      })),
    };
  });

  // Ritual streak
  const todayIso = new Date().toISOString().slice(0, 10);
  const dateSet = new Set([...mornings.map(m => m.local_date), ...evenings.map(e => e.local_date)]);
  let streak = 0;
  let cursor = new Date();
  for (let i = 0; i < 120; i++) {
    const d = cursor.toISOString().slice(0, 10);
    if (dateSet.has(d)) streak += 1;
    else if (d !== todayIso) break;
    cursor.setDate(cursor.getDate() - 1);
  }

  // Heatmap last 90 days
  const heatmap = [];
  const hm = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(hm); d.setDate(hm.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const morning = mornings.some(m => m.local_date === iso);
    const evening = evenings.some(e => e.local_date === iso);
    heatmap.push({ date: iso, morning, evening, level: (morning ? 1 : 0) + (evening ? 1 : 0) });
  }

  return new Response(JSON.stringify({
    ok: true,
    trajectory,
    driver_history: Object.values(driverHistory).sort((a, b) => b.count - a.count),
    importance_drift: importanceDrift,
    matrix_movement: matrixMovement,
    streak,
    heatmap,
    pulses_count: pulses.length,
    assessments_count: assessments.length,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

function classifyQuadrant(score, importance) {
  if (!Number.isFinite(score) || !Number.isFinite(importance)) return 'unknown';
  const hi = score >= 7;
  const imp = importance >= 7;
  if (!hi && imp) return 'critical';
  if (hi && imp) return 'protect';
  if (!hi && !imp) return 'monitor';
  return 'overinvest';
}
