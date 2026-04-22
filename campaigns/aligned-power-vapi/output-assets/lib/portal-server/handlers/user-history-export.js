/**
 * User-owned export — PDF + CSV of complete VAPI history.
 * GET /api/user-history-export?format=csv or format=html
 *   csv: returns CSV file
 *   html: returns printable HTML (user prints to PDF)
 */

import { DOMAINS } from '../vapi-taxonomy-constants.js';

function env(n){ const v=process.env[n]; if(!v) throw new Error('missing env: '+n); return v; }
async function authEmail(req){
  const a = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!a.startsWith('Bearer ')) return null;
  const r = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: a } });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.email && String(u.email).toLowerCase()) || null;
}
async function supa(path){
  return fetch(`${env('SUPABASE_URL')}${path}`, { headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}` } });
}

function csvEscape(v) { if (v == null) return ''; const s = String(v); return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g,'""')}"` : s; }

export async function GET(request) {
  const email = await authEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401 });
  const url = new URL(request.url, 'https://internal.local');
  const format = (url.searchParams.get('format') || 'html').toLowerCase();
  const enc = encodeURIComponent(email);

  const [a,m,e,p,sc,sp] = await Promise.all([
    supa(`/rest/v1/vapi_results?email=eq.${enc}&select=results,created_at&order=created_at.asc`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_morning_checkins?email=eq.${enc}&select=*&order=completed_at.desc`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_evening_reviews?email=eq.${enc}&select=*&order=completed_at.desc`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_monthly_pulses?email=eq.${enc}&select=*&order=completed_at.desc`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/six_c_submissions?email=eq.${enc}&select=*&order=created_at.desc`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/sprints?user_email=eq.${enc}&select=*&order=updated_at.desc`).then(r => r.ok ? r.json() : []),
  ]);

  if (format === 'csv') {
    let csv = 'Aligned Performance — personal data export\n';
    csv += `Exported for: ${email}\nExported at: ${new Date().toISOString()}\n\n`;
    csv += 'ASSESSMENTS\n';
    csv += 'completed_at,archetype,primary_driver,overall_score,arena_personal,arena_relationships,arena_business\n';
    a.forEach(r => {
      const x = r.results || {};
      csv += [r.created_at, x.archetype, (x.driver && x.driver.name) || '', x.overall || '', x.arenaScores?.Personal || '', x.arenaScores?.Relationships || '', x.arenaScores?.Business || ''].map(csvEscape).join(',') + '\n';
    });
    csv += '\nMORNING CHECK-INS\n';
    csv += 'completed_at,local_date,honored_domain,alignment_intention,num_priorities\n';
    m.forEach(r => { csv += [r.completed_at, r.local_date, r.honored_domain || '', r.alignment_intention || '', (r.priorities || []).length].map(csvEscape).join(',') + '\n'; });
    csv += '\nEVENING REVIEWS\n';
    csv += 'completed_at,local_date,day_type,prompt_id,priorities_honored,drivers_echoed,response\n';
    e.forEach(r => { csv += [r.completed_at, r.local_date, r.day_type, r.prompt_id, r.priorities_honored_count ?? '', (r.drivers_echoed || []).join(';'), r.response || ''].map(csvEscape).join(',') + '\n'; });
    csv += '\nMONTHLY PULSES\n';
    csv += 'completed_at,local_month,composite_delta,notes\n';
    p.forEach(r => { csv += [r.completed_at, r.local_month, r.delta_vs_last_full?.composite_delta ?? '', r.notes || ''].map(csvEscape).join(',') + '\n'; });
    csv += '\nSIX-C SCORECARDS\n';
    csv += 'created_at,vital_action\n';
    sc.forEach(r => { csv += [r.created_at, r.one_thing_to_improve || ''].map(csvEscape).join(',') + '\n'; });
    return new Response(csv, { status: 200, headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename="aligned-performance-export-${email.replace(/[^a-z0-9]/gi,'_')}.csv"` } });
  }

  // HTML print-to-PDF version
  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>Aligned Performance — Your Export</title>
<style>
  body{font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#0E1624;max-width:720px;margin:40px auto;padding:0 24px;}
  h1{font-size:28px;border-bottom:2px solid #FF6B1A;padding-bottom:6px;margin-bottom:6px;}
  h2{font-size:18px;margin-top:28px;border-left:3px solid #FF6B1A;padding-left:8px;}
  h3{font-size:14px;margin-top:16px;text-transform:uppercase;letter-spacing:.15em;color:#7A8FA8;}
  .meta{color:#7A8FA8;font-size:13px;margin-bottom:16px;}
  table{border-collapse:collapse;width:100%;font-size:12px;margin-top:8px;}
  th,td{padding:6px 8px;border-bottom:1px solid #DDE3ED;text-align:left;vertical-align:top;}
  th{background:#F5F7FA;font-weight:700;}
  .small{font-size:11px;color:#7A8FA8;}
  @media print { body{max-width:100%;margin:0;padding:20px;} }
  @page { size: Letter; margin: 0.5in; }
</style></head>
<body onload="setTimeout(()=>window.print(),500)">
<h1>Aligned Performance — Your Export</h1>
<div class="meta">Exported for <strong>${email}</strong> on ${new Date().toLocaleString()}</div>
<p>This document contains your full assessment, check-in, review, and scorecard history. You own this data. If you ever stop being a user, you keep this export.</p>

<h2>Assessment trajectory</h2>
${a.length ? `<table><tr><th>Date</th><th>Archetype</th><th>Primary driver</th><th>Overall</th></tr>
${a.map(r => `<tr><td>${new Date(r.created_at).toLocaleDateString()}</td><td>${(r.results?.archetype) || '—'}</td><td>${(r.results?.driver?.name) || '—'}</td><td>${r.results?.overall || '—'}</td></tr>`).join('')}
</table>` : '<p class="small">No assessments yet.</p>'}

<h2>Morning check-ins (recent 30)</h2>
${m.slice(0,30).map(r => `<h3>${r.local_date}</h3><p><strong>Honored:</strong> ${r.honored_domain || '—'} · <strong>Priorities:</strong> ${(r.priorities || []).map(p => p.text).join(' · ')}<br><em>${r.alignment_intention || ''}</em></p>`).join('') || '<p class="small">None yet.</p>'}

<h2>Evening integrity reviews (recent 30)</h2>
${e.slice(0,30).map(r => `<h3>${r.local_date} — ${r.day_type}</h3><p class="small">${r.prompt_text}</p><p>${r.response || '—'}</p><p class="small">Priorities honored: ${r.priorities_honored_count ?? '—'}/3 · Drivers: ${(r.drivers_echoed || []).join(', ') || 'none'}</p>`).join('') || '<p class="small">None yet.</p>'}

<h2>Monthly pulses</h2>
${p.length ? `<table><tr><th>Month</th><th>Composite delta</th><th>Notes</th></tr>
${p.map(r => `<tr><td>${r.local_month}</td><td>${r.delta_vs_last_full?.composite_delta ?? '—'}</td><td>${r.notes || ''}</td></tr>`).join('')}
</table>` : '<p class="small">None yet.</p>'}

<h2>Six-C Scorecards (recent)</h2>
${sc.slice(0,12).map(r => `<h3>${new Date(r.created_at).toLocaleDateString()}</h3><p class="small">Vital Action: ${r.one_thing_to_improve || '—'}</p>`).join('') || '<p class="small">None yet.</p>'}

<h2>Active sprint</h2>
${sp[0] ? `<p><strong>${sp[0].payload?.title || 'Sprint'}</strong> (${sp[0].status}) · updated ${new Date(sp[0].updated_at).toLocaleDateString()}</p>` : '<p class="small">No active sprint.</p>'}

<hr><p class="small">portal.alignedpower.coach · Generated by the Aligned Performance Portal</p>
</body></html>`;
  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
