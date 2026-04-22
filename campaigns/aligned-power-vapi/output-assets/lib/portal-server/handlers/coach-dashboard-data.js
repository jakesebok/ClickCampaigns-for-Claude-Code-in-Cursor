/**
 * Coach dashboard data aggregate.
 * GET /api/coach-dashboard-data — roster, per-client quick metrics, recent pattern alerts, cohort snapshot data.
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
const COACHES = new Set(['jacob@alignedpower.coach', 'jake@alignedpower.coach']);
async function supa(path) {
  return fetch(`${env('SUPABASE_URL')}${path}`, { headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}` } });
}

export async function GET(request) {
  const email = await authEmail(request);
  if (!email || !COACHES.has(email)) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });

  const [activeR, resultsR, alertsR] = await Promise.all([
    supa('/rest/v1/portal_active_clients?select=email,active_client&order=email.asc').then(r => r.ok ? r.json() : []),
    supa('/rest/v1/vapi_results?select=email,results,created_at&order=created_at.desc&limit=500').then(r => r.ok ? r.json() : []),
    supa('/rest/v1/vapi_pattern_alerts?select=*&order=detected_at.desc&limit=30').then(r => r.ok ? r.json() : []),
  ]);

  const latestByEmail = new Map();
  for (const row of resultsR) {
    if (!latestByEmail.has(row.email)) latestByEmail.set(row.email, row);
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
  const since = encodeURIComponent(sevenDaysAgo);

  // For each active client, grab a quick signal snapshot
  const roster = await Promise.all((activeR || []).filter(r => r.active_client).map(async (row) => {
    const e = row.email;
    const enc = encodeURIComponent(e);
    const [mR, evR] = await Promise.all([
      supa(`/rest/v1/vapi_morning_checkins?email=eq.${enc}&completed_at=gte.${since}&select=local_date,completed_at&order=completed_at.desc&limit=10`).then(r => r.ok ? r.json() : []),
      supa(`/rest/v1/vapi_evening_reviews?email=eq.${enc}&completed_at=gte.${since}&select=day_type,drivers_echoed,completed_at&order=completed_at.desc&limit=10`).then(r => r.ok ? r.json() : []),
    ]);
    const latest = latestByEmail.get(e) || null;
    const lastActivity = Math.max(
      (mR[0] && new Date(mR[0].completed_at).getTime()) || 0,
      (evR[0] && new Date(evR[0].completed_at).getTime()) || 0
    );
    const daysSilent = lastActivity ? Math.floor((Date.now() - lastActivity) / (24 * 3600 * 1000)) : null;
    const driftCount = evR.filter(x => x.day_type === 'drift').length;
    const status = (daysSilent == null || daysSilent > 10) ? 'dormant'
                 : driftCount >= 3 ? 'pattern_alert'
                 : daysSilent > 3 ? 'drifting'
                 : 'active';
    return {
      email: e,
      archetype: latest && latest.results && latest.results.archetype || null,
      primary_driver: latest && latest.results && latest.results.driver && latest.results.driver.name || null,
      overall: latest && latest.results && latest.results.overall || null,
      last_assessment_at: latest && latest.created_at || null,
      last_ritual_at: lastActivity ? new Date(lastActivity).toISOString() : null,
      days_silent: daysSilent,
      status,
      drift_count_7d: driftCount,
      morning_count_7d: mR.length,
      evening_count_7d: evR.length,
    };
  }));

  // Cohort aggregate
  const archetypeDistribution = {};
  const driverActivation = {};
  resultsR.forEach(r => {
    const a = r.results && r.results.archetype;
    if (a) archetypeDistribution[a] = (archetypeDistribution[a] || 0) + 1;
    const d = r.results && r.results.driver && r.results.driver.name;
    if (d) driverActivation[d] = (driverActivation[d] || 0) + 1;
  });

  return new Response(JSON.stringify({
    ok: true,
    roster,
    alerts: alertsR,
    cohort: {
      archetype_distribution: archetypeDistribution,
      driver_activation: driverActivation,
      active_client_count: roster.length,
      at_risk_count: roster.filter(r => r.status === 'pattern_alert' || r.status === 'dormant').length,
    },
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
