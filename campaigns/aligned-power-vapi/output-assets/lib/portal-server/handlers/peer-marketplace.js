/**
 * Peer marketplace (forward-compatible).
 * GET /api/peer-marketplace — list active approved coaches + counts.
 */

function env(n){ const v = process.env[n]; if (!v) throw new Error('missing env: ' + n); return v; }
async function supa(path){
  return fetch(`${env('SUPABASE_URL')}${path}`, { headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}` } });
}

const MIN_COACHES_FOR_LIVE = 5;

export async function GET(request){
  const r = await supa('/rest/v1/vapi_peer_marketplace_coaches?select=*&order=created_at.asc');
  if (!r.ok) return new Response(JSON.stringify({ ok: true, is_live: false, coaches: [], count: 0 }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  const coaches = await r.json();
  const approved = (coaches || []).filter(c => c.approved && c.active);
  const is_live = approved.length >= MIN_COACHES_FOR_LIVE;
  return new Response(JSON.stringify({
    ok: true,
    is_live,
    coaches: is_live ? approved : [],
    count: approved.length,
    min_for_live: MIN_COACHES_FOR_LIVE,
    message: is_live ? null : 'Peer coaches matched to your archetype will appear here when the Axiom network goes live. You will see this first.',
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
