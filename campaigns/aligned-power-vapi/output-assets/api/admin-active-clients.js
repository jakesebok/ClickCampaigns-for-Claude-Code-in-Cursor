// Vercel serverless: return all portal_active_clients (admin only).
// Same auth as admin-results. Used so admin UI can show active-client toggles.

export async function GET(request) {
  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const ADMIN_EMAIL = 'jacob@alignedpower.coach';

  if (!url || !anonKey || !serviceKey) {
    return new Response(
      JSON.stringify({ error: 'missing_env', message: 'Missing Supabase env vars.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = m ? m[1] : '';
  if (!accessToken) {
    return new Response(JSON.stringify({ error: 'missing_token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let userEmail = '';
  try {
    const u = await fetch(`${url}/auth/v1/user`, {
      method: 'GET',
      headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
    });
    if (!u.ok) {
      return new Response(JSON.stringify({ error: 'invalid_token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const user = await u.json();
    userEmail = String(user?.email || '').trim().toLowerCase();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'auth_check_failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (userEmail !== ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: 'forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const restUrl = `${url}/rest/v1/portal_active_clients?select=email,active_client`;
    const r = await fetch(restUrl, {
      method: 'GET',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Accept: 'application/json',
      },
    });

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      return new Response(
        JSON.stringify({ error: 'rest_failed', status: r.status, body: text.slice(0, 500) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const rows = await r.json();
    return new Response(JSON.stringify({ rows }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'unexpected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
