/**
 * Presence today — returns today's active banners/drawer messages for the current user.
 * GET /api/presence-today
 */

function env(n) { const v = process.env[n]; if (!v) throw new Error(`missing env: ${n}`); return v; }

async function getAuthEmail(req) {
  const a = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!a.startsWith('Bearer ')) return null;
  const r = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: a } });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.email && String(u.email).toLowerCase()) || null;
}

async function supaFetch(path) {
  return fetch(`${env('SUPABASE_URL')}${path}`, {
    headers: {
      apikey: env('SUPABASE_SERVICE_ROLE_KEY'),
      Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}`,
    },
  });
}

export async function GET(request) {
  const email = await getAuthEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  const since = new Date(Date.now() - 12 * 3600 * 1000).toISOString();
  const r = await supaFetch(`/rest/v1/vapi_presence_trigger_events?email=eq.${encodeURIComponent(email)}&outcome=eq.fired&evaluated_at=gte.${since}&select=*&order=evaluated_at.desc&limit=5`);
  if (!r.ok) return new Response(JSON.stringify({ ok: true, banners: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  const rows = await r.json();
  const banners = (rows || []).filter(row => ['banner','drawer'].includes(row.channel) && !row.acknowledged_at);
  return new Response(JSON.stringify({ ok: true, banners }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(request) {
  const email = await getAuthEmail(request);
  if (!email) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  let body; try { body = await request.json(); } catch { body = {}; }
  const { event_id, action } = body;
  if (!event_id) return new Response(JSON.stringify({ error: 'event_id_required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  await fetch(`${env('SUPABASE_URL')}/rest/v1/vapi_presence_trigger_events?id=eq.${event_id}&email=eq.${encodeURIComponent(email)}`, {
    method: 'PATCH',
    headers: {
      apikey: env('SUPABASE_SERVICE_ROLE_KEY'),
      Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ acknowledged_at: new Date().toISOString(), action: action || 'dismiss' }),
  });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
