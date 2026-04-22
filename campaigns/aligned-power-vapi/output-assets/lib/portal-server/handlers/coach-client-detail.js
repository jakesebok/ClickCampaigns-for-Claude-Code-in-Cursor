/**
 * Per-client detailed view data for Jake's coach admin.
 * GET /api/coach-client-detail?email=<client_email>
 *
 * Returns: assessments, trajectory, driver history, ritual streak, recent
 * morning/evening, pattern alerts, presence event log, latest pre-session brief.
 */

function env(n){ const v=process.env[n]; if(!v) throw new Error('missing env: '+n); return v; }
async function authEmail(req){
  const a = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!a.startsWith('Bearer ')) return null;
  const r = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: a } });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.email && String(u.email).toLowerCase()) || null;
}
const COACHES = new Set(['jacob@alignedpower.coach', 'jake@alignedpower.coach']);
async function supa(path){
  return fetch(`${env('SUPABASE_URL')}${path}`, { headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}` } });
}

export async function GET(request) {
  const coachEmail = await authEmail(request);
  if (!coachEmail || !COACHES.has(coachEmail)) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });

  const url = new URL(request.url, 'https://internal.local');
  const client = (url.searchParams.get('email') || '').toLowerCase();
  if (!client) return new Response(JSON.stringify({ error: 'email_required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  const enc = encodeURIComponent(client);
  const [assessR, morningR, eveningR, pulsesR, presenceR, alertsR, briefsR, notesR, sprintR] = await Promise.all([
    supa(`/rest/v1/vapi_results?email=eq.${enc}&select=id,results,created_at&order=created_at.asc`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_morning_checkins?email=eq.${enc}&select=*&order=completed_at.desc&limit=30`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_evening_reviews?email=eq.${enc}&select=*&order=completed_at.desc&limit=30`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_monthly_pulses?email=eq.${enc}&select=*&order=completed_at.asc`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_presence_trigger_events?email=eq.${enc}&outcome=eq.fired&select=*&order=evaluated_at.desc&limit=20`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_pattern_alerts?client_email=eq.${enc}&coach_email=eq.${encodeURIComponent(coachEmail)}&select=*&order=detected_at.desc&limit=10`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_session_briefs?client_email=eq.${enc}&coach_email=eq.${encodeURIComponent(coachEmail)}&select=*&order=generated_at.desc&limit=5`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/coach_notes?client_email=eq.${enc}&select=notes,updated_at&limit=1`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/sprints?user_email=eq.${enc}&select=payload,updated_at,status&order=updated_at.desc&limit=1`).then(r => r.ok ? r.json() : []),
  ]);

  const trajectory = assessR.map(a => ({
    date: a.created_at,
    archetype: (a.results && a.results.archetype) || 'Unassigned',
    primary_driver: (a.results && a.results.driver && a.results.driver.name) || null,
    overall: (a.results && a.results.overall) || null,
  }));

  const driverHistory = {};
  eveningR.forEach(e => {
    (e.drivers_echoed || []).forEach(d => {
      driverHistory[d] = driverHistory[d] || { key: d, count: 0, last_echoed: null };
      driverHistory[d].count += 1;
      if (!driverHistory[d].last_echoed || e.completed_at > driverHistory[d].last_echoed) driverHistory[d].last_echoed = e.completed_at;
    });
  });

  const today = new Date().toISOString().slice(0,10);
  const dates = new Set([...morningR.map(m => m.local_date), ...eveningR.map(e => e.local_date)]);
  let streak = 0;
  const cur = new Date();
  for (let i = 0; i < 60; i++) {
    const d = cur.toISOString().slice(0,10);
    if (dates.has(d)) streak += 1;
    else if (d !== today) break;
    cur.setDate(cur.getDate() - 1);
  }

  return new Response(JSON.stringify({
    ok: true,
    client_email: client,
    latest_assessment: trajectory[trajectory.length-1] || null,
    trajectory,
    morning_checkins: morningR,
    evening_reviews: eveningR,
    monthly_pulses: pulsesR,
    presence_fired: presenceR,
    pattern_alerts: alertsR,
    session_briefs: briefsR,
    coach_notes: (notesR[0] && notesR[0].notes) || '',
    notes_updated_at: (notesR[0] && notesR[0].updated_at) || null,
    latest_sprint: sprintR[0] || null,
    driver_history: Object.values(driverHistory).sort((a,b) => b.count - a.count),
    ritual_streak: streak,
    summary: {
      assessments_count: assessR.length,
      morning_7d: morningR.filter(m => Date.parse(m.completed_at) > Date.now() - 7*24*3600*1000).length,
      evening_7d: eveningR.filter(e => Date.parse(e.completed_at) > Date.now() - 7*24*3600*1000).length,
      drift_count_7d: eveningR.filter(e => e.day_type === 'drift' && Date.parse(e.completed_at) > Date.now() - 7*24*3600*1000).length,
    },
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
