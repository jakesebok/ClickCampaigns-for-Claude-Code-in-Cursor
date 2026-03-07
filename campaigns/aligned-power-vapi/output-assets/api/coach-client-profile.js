/**
 * GET /api/coach-client-profile?email=xxx
 * Returns a client's intake context (contextual_profile from user_metadata).
 * Coach only. Uses service role to read auth.users.
 */

const ADMIN_EMAIL = 'jacob@alignedpower.coach';

async function verifyCoach(request) {
  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = m ? m[1] : '';
  if (!accessToken || !url || !anonKey) return { ok: false, status: 401 };
  const u = await fetch(`${url}/auth/v1/user`, {
    method: 'GET',
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!u.ok) return { ok: false, status: 401 };
  const user = await u.json();
  const email = String(user?.email || '').trim().toLowerCase();
  if (email !== ADMIN_EMAIL) return { ok: false, status: 403 };
  return { ok: true };
}

export async function GET(request) {
  const url = process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ error: 'missing_env' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  const auth = await verifyCoach(request);
  if (!auth.ok) {
    return new Response(
      JSON.stringify({ error: auth.status === 403 ? 'forbidden' : 'unauthorized' }),
      { status: auth.status, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const clientEmail = new URL(request.url).searchParams.get('email') || '';
  const emailNorm = clientEmail.trim().toLowerCase();
  if (!emailNorm) {
    return new Response(
      JSON.stringify({ error: 'bad_request', message: 'email required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const usersRes = await fetch(
      `${url}/auth/v1/admin/users?filter=${encodeURIComponent(emailNorm)}`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      }
    );
    if (!usersRes.ok) {
      return new Response(
        JSON.stringify({ error: 'auth_failed', status: usersRes.status }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    const usersJson = await usersRes.json();
    const users = usersJson.users || [];
    const match = users.find((u) => (u.email || '').toLowerCase() === emailNorm);
    const contextualProfile = match?.user_metadata?.contextual_profile || null;

    return new Response(
      JSON.stringify({ contextualProfile }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'unexpected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
