/**
 * Coach cohort intelligence PDF export (print-optimized HTML).
 * GET /api/cohort-pdf-export
 * Coach-only. Anonymized by default.
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
  const email = await authEmail(request);
  if (!email || !COACHES.has(email)) return new Response('Forbidden', { status: 403 });

  const [activeR, resultsR, alertsR, morningR, eveningR] = await Promise.all([
    supa('/rest/v1/portal_active_clients?select=email,active_client').then(r => r.ok ? r.json() : []),
    supa('/rest/v1/vapi_results?select=email,results,created_at&order=created_at.desc&limit=200').then(r => r.ok ? r.json() : []),
    supa('/rest/v1/vapi_pattern_alerts?select=*&order=detected_at.desc&limit=50').then(r => r.ok ? r.json() : []),
    supa('/rest/v1/vapi_morning_checkins?select=email,completed_at&order=completed_at.desc&limit=500').then(r => r.ok ? r.json() : []),
    supa('/rest/v1/vapi_evening_reviews?select=email,day_type,drivers_echoed,completed_at&order=completed_at.desc&limit=500').then(r => r.ok ? r.json() : []),
  ]);

  const activeEmails = new Set((activeR || []).filter(r => r.active_client).map(r => r.email));
  const latestByEmail = new Map();
  for (const row of resultsR) if (!latestByEmail.has(row.email)) latestByEmail.set(row.email, row);

  // Aggregates
  const archDist = {};
  const driverDist = {};
  const arenaAvg = { Personal: [], Relationships: [], Business: [] };
  const compositeVals = [];
  for (const email of activeEmails) {
    const latest = latestByEmail.get(email);
    if (!latest || !latest.results) continue;
    const a = latest.results.archetype;
    if (a) archDist[a] = (archDist[a] || 0) + 1;
    const d = latest.results.driver && latest.results.driver.name;
    if (d) driverDist[d] = (driverDist[d] || 0) + 1;
    if (typeof latest.results.overall === 'number') compositeVals.push(latest.results.overall);
    const as = latest.results.arenaScores || {};
    if (typeof as.Personal === 'number') arenaAvg.Personal.push(as.Personal);
    if (typeof as.Relationships === 'number') arenaAvg.Relationships.push(as.Relationships);
    if (typeof as.Business === 'number') arenaAvg.Business.push(as.Business);
  }
  const avg = arr => arr.length ? (arr.reduce((s,x)=>s+x,0) / arr.length).toFixed(2) : '—';

  // Last 30 days activity
  const since30 = Date.now() - 30*24*3600*1000;
  const morning30 = morningR.filter(m => activeEmails.has(m.email) && Date.parse(m.completed_at) > since30).length;
  const evening30 = eveningR.filter(e => activeEmails.has(e.email) && Date.parse(e.completed_at) > since30).length;

  const driverActivations = {};
  eveningR.filter(e => activeEmails.has(e.email) && Date.parse(e.completed_at) > since30).forEach(e => {
    (e.drivers_echoed || []).forEach(d => driverActivations[d] = (driverActivations[d] || 0) + 1);
  });

  const topArchetype = Object.entries(archDist).sort((a,b) => b[1]-a[1])[0];
  const topDriverAtRisk = Object.entries(driverActivations).sort((a,b) => b[1]-a[1])[0];

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Aligned Performance — Cohort Intelligence</title>
<style>
  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0E1624;max-width:720px;margin:40px auto;padding:0 24px;}
  h1{font-size:26px;border-bottom:2px solid #FF6B1A;padding-bottom:6px;}
  h2{font-size:18px;margin-top:28px;border-left:3px solid #FF6B1A;padding-left:8px;}
  .meta{color:#7A8FA8;font-size:13px;}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:12px;}
  .kpi{border:1px solid #DDE3ED;padding:10px;border-radius:8px;text-align:center;}
  .kpi .n{font-size:26px;font-weight:800;color:#0E1624;}
  .kpi .l{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:#7A8FA8;margin-top:2px;}
  table{border-collapse:collapse;width:100%;font-size:13px;margin-top:10px;}
  th,td{padding:6px 8px;border-bottom:1px solid #DDE3ED;text-align:left;}
  th{background:#F5F7FA;}
  .bar{background:#FF6B1A;height:8px;border-radius:2px;display:inline-block;}
  .anon-note{font-size:11px;color:#7A8FA8;font-style:italic;margin-top:6px;}
  @page { size: Letter; margin: 0.5in; }
  @media print { body{max-width:100%;margin:0;} }
</style></head>
<body onload="setTimeout(()=>window.print(),400)">
<h1>Cohort Intelligence Brief</h1>
<div class="meta">Generated ${new Date().toLocaleDateString()} · Coach: ${email} · Fully anonymized</div>

<div class="kpi-grid">
  <div class="kpi"><div class="n">${activeEmails.size}</div><div class="l">Active clients</div></div>
  <div class="kpi"><div class="n">${avg(compositeVals)}</div><div class="l">Avg composite</div></div>
  <div class="kpi"><div class="n">${morning30}</div><div class="l">Mornings · 30d</div></div>
  <div class="kpi"><div class="n">${evening30}</div><div class="l">Evenings · 30d</div></div>
</div>

<h2>Arena averages</h2>
<table>
<tr><th>Arena</th><th>Avg score</th><th></th></tr>
${['Personal','Relationships','Business'].map(k => {
  const v = Number(avg(arenaAvg[k]));
  const w = Number.isFinite(v) ? Math.round(v*10) : 0;
  return `<tr><td>${k}</td><td>${avg(arenaAvg[k])}</td><td><span class="bar" style="width:${w}%"></span></td></tr>`;
}).join('')}
</table>

<h2>Archetype distribution</h2>
<table>
<tr><th>Archetype</th><th>Count</th><th></th></tr>
${Object.entries(archDist).sort((a,b)=>b[1]-a[1]).map(([k,v]) => {
  const w = activeEmails.size ? Math.round(v/activeEmails.size*100) : 0;
  return `<tr><td>${k}</td><td>${v}</td><td><span class="bar" style="width:${w}%"></span></td></tr>`;
}).join('')}
</table>
${topArchetype ? `<p class="meta">Most common: <strong>${topArchetype[0]}</strong> (${topArchetype[1]} of ${activeEmails.size}).</p>` : ''}

<h2>Driver activation — last 30 days</h2>
<table>
<tr><th>Driver</th><th>Activation count</th></tr>
${Object.entries(driverActivations).sort((a,b)=>b[1]-a[1]).map(([k,v]) => `<tr><td>${k.replace(/_/g,' ')}</td><td>${v}</td></tr>`).join('') || '<tr><td colspan="2">No driver activations in the last 30 days.</td></tr>'}
</table>
${topDriverAtRisk ? `<p class="meta">Pattern to watch: <strong>${topDriverAtRisk[0].replace(/_/g,' ')}</strong> echoed ${topDriverAtRisk[1]} times across the cohort in 30d.</p>` : ''}

<h2>Pattern alerts (recent)</h2>
${alertsR.slice(0,10).map(a => `<p><strong>${a.alert_type.replace(/_/g,' ')}</strong> · ${new Date(a.detected_at).toLocaleDateString()} · ${(a.payload && a.payload.summary) || ''}</p>`).join('') || '<p class="meta">No pattern alerts in the recent window.</p>'}

<p class="anon-note">All data fully anonymized. No client names, no identifying detail. Suitable for public marketing or private strategic review.</p>
</body></html>`;
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
