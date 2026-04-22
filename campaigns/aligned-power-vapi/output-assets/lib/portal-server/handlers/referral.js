/**
 * Referral: generate an invite code, track clicks/conversions.
 * POST /api/referral       — create a referral code for the current user.
 * GET  /api/referral?code= — resolve a code to the referrer.
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

function makeCode(email){
  const base = email.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 8).toLowerCase() || 'friend';
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

export async function POST(request){
  const email = await authEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const code = makeCode(email);
  const r = await supa('/rest/v1/vapi_referral_attributions', {
    method: 'POST',
    body: JSON.stringify({ referrer_email: email, invite_code: code }),
  });
  if (!r.ok) {
    const err = await r.text();
    return new Response(JSON.stringify({ error: 'write_failed', detail: err }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ ok: true, code, url: `https://portal.alignedpower.coach/assessment?ref=${code}` }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(request){
  const url = new URL(request.url, 'https://internal.local');
  const code = (url.searchParams.get('code') || '').trim();
  if (!code) return new Response(JSON.stringify({ error: 'code_required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  const r = await supa(`/rest/v1/vapi_referral_attributions?invite_code=eq.${encodeURIComponent(code)}&select=referrer_email&limit=1`);
  if (!r.ok) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  const rows = await r.json();
  if (!rows.length) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  await supa(`/rest/v1/vapi_referral_attributions?invite_code=eq.${encodeURIComponent(code)}`, {
    method: 'PATCH', prefer: 'return=minimal',
    body: JSON.stringify({ clicked_at: new Date().toISOString() }),
  }).catch(() => {});
  return new Response(JSON.stringify({ ok: true, referrer_email_domain: rows[0].referrer_email.split('@')[1] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
