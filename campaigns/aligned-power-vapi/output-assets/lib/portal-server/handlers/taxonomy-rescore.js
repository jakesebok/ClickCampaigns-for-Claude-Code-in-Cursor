/**
 * Taxonomy rescore (placeholder for v1.0.0 — no alternate version yet).
 * POST /api/taxonomy-rescore { vapi_result_id, target_version }
 *
 * Currently returns the stored results unchanged because only v1.0.0 is active.
 * Infrastructure is in place for future versions. Audit-grade by design.
 */

function env(n){ const v = process.env[n]; if (!v) throw new Error('missing env: ' + n); return v; }
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

export async function POST(request){
  const email = await authEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  let body; try { body = await request.json(); } catch { body = {}; }
  const id = body.vapi_result_id;
  const target = body.target_version || 'v1.0.0';
  if (!id) return new Response(JSON.stringify({ error: 'vapi_result_id_required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  const [verR, resR] = await Promise.all([
    supa(`/rest/v1/vapi_taxonomy_versions?version=eq.${encodeURIComponent(target)}&select=version,active&limit=1`),
    supa(`/rest/v1/vapi_results?id=eq.${encodeURIComponent(id)}&email=eq.${encodeURIComponent(email)}&select=results&limit=1`),
  ]);
  if (!verR.ok) return new Response(JSON.stringify({ error: 'version_lookup_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const vers = await verR.json();
  if (!vers.length) return new Response(JSON.stringify({ error: 'version_not_found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  const results = resR.ok ? await resR.json() : [];
  if (!results.length) return new Response(JSON.stringify({ error: 'result_not_found_or_not_owned' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

  // Only v1.0.0 supported today. Return original.
  return new Response(JSON.stringify({
    ok: true, target_version: target, rescored: false,
    reason: target === 'v1.0.0' ? 'same_as_current' : 'version_rescore_not_implemented',
    results: results[0].results,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
