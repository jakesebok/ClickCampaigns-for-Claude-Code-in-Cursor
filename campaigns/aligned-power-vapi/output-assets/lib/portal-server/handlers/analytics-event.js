/**
 * Lightweight analytics event ingestion.
 * POST /api/analytics-event { event_name, properties, session_id }
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

export async function POST(request){
  let body; try { body = await request.json(); } catch { body = {}; }
  if (!body.event_name || typeof body.event_name !== 'string') return new Response(JSON.stringify({ error: 'event_name_required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  const email = await authEmail(request);
  const ua = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const payload = {
    email,
    session_id: body.session_id || null,
    event_name: String(body.event_name).slice(0, 64),
    properties: body.properties || {},
    client_context: { user_agent: ua.slice(0, 255), path: body.path || null, referrer: referer.slice(0, 255) },
  };
  const r = await fetch(`${env('SUPABASE_URL')}/rest/v1/vapi_analytics_events`, {
    method: 'POST',
    headers: {
      apikey: env('SUPABASE_SERVICE_ROLE_KEY'),
      Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.text();
    console.error('[analytics-event] write failed', err);
    return new Response(JSON.stringify({ error: 'write_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
