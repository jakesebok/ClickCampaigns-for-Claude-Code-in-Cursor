// Vercel serverless: set active_client for a respondent (admin only).
// POST body: { email: string, active_client: boolean }
// Requires SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.

export async function POST(request) {
  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.PORTAL_ADMIN_EMAIL || 'jacob@alignedpower.coach').trim().toLowerCase();

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

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const active_client = body.active_client === true || body.active_client === false ? body.active_client : null;
  if (!email || active_client === null) {
    return new Response(
      JSON.stringify({ error: 'bad_request', message: 'Body must include email (string) and active_client (boolean).' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const normEmail = email.toLowerCase();
  try {
    const r = await fetch(`${url}/rest/v1/portal_active_clients`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        email: normEmail,
        active_client,
        updated_at: new Date().toISOString(),
      }),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      return new Response(
        JSON.stringify({ error: 'upsert_failed', status: r.status, body: text.slice(0, 500) }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ ok: true, email: normEmail, active_client }), {
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
