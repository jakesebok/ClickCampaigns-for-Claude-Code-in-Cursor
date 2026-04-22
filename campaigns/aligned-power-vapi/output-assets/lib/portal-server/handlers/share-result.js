/**
 * Shareable results link — public resolve by hash.
 * POST /api/share-result — create a share link for the user's latest assessment.
 * GET  /api/share-result?hash=XXX — public resolve (anonymized).
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
async function supa(path, opts = {}){
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

function makeHash(){
  const chars = 'abcdefghijkmnpqrstuvwxyz0123456789';
  let s = '';
  for (let i = 0; i < 10; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export async function POST(request){
  const email = await authEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const r = await supa(`/rest/v1/vapi_results?email=eq.${encodeURIComponent(email)}&select=id,results&order=created_at.desc&limit=1`);
  if (!r.ok) return new Response(JSON.stringify({ error: 'no_results' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const rows = await r.json();
  if (!rows.length) return new Response(JSON.stringify({ error: 'no_assessment' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  const hash = makeHash();
  const ins = await supa('/rest/v1/vapi_shareable_results', {
    method: 'POST',
    body: JSON.stringify({
      hash, email,
      vapi_result_id: rows[0].id,
      archetype_label: (rows[0].results && rows[0].results.archetype) || 'Unassigned',
      primary_driver_label: (rows[0].results && rows[0].results.driver && rows[0].results.driver.name) || null,
      expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    }),
  });
  if (!ins.ok) {
    const err = await ins.text();
    return new Response(JSON.stringify({ error: 'write_failed', detail: err }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ ok: true, hash, url: `https://portal.alignedpower.coach/share/${hash}` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(request){
  const url = new URL(request.url, 'https://internal.local');
  const hash = (url.searchParams.get('hash') || '').trim();
  if (!hash) return new Response(JSON.stringify({ error: 'hash_required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  const r = await supa(`/rest/v1/vapi_shareable_results?hash=eq.${encodeURIComponent(hash)}&select=archetype_label,primary_driver_label,created_at&limit=1`);
  if (!r.ok) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  const rows = await r.json();
  if (!rows.length) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  // Fire-and-forget view count increment
  await supa(`/rest/v1/vapi_shareable_results?hash=eq.${encodeURIComponent(hash)}`, {
    method: 'PATCH', prefer: 'return=minimal',
    body: JSON.stringify({ view_count: (rows[0].view_count || 0) + 1 }),
  }).catch(() => {});
  return new Response(JSON.stringify({ ok: true, share: rows[0] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
