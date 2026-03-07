/**
 * POST /api/update-vapi-importance
 * Updates importanceRatings on an existing vapi_results row (legacy user backfill).
 * Requires authenticated user; verifies the row belongs to the user's email.
 * Uses service role key to bypass RLS.
 *
 * Body (JSON):
 *   id               string  — vapi_results row id (required)
 *   importanceRatings object  — { PH, IA, ME, AF, RS, FA, CO, WI, VS, EX, OH, EC }
 *
 * Headers:
 *   Authorization: Bearer <session.access_token>
 */

const DOM_CODES = ['PH', 'IA', 'ME', 'AF', 'RS', 'FA', 'CO', 'WI', 'VS', 'EX', 'OH', 'EC'];

async function verifyUser(request) {
  const url = process.env.SUPABASE_URL || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization') || '';
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = m ? m[1] : '';
  if (!accessToken || !url || !anonKey) return { ok: false, status: 401, email: null };
  const u = await fetch(`${url}/auth/v1/user`, {
    method: 'GET',
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!u.ok) return { ok: false, status: 401, email: null };
  const user = await u.json();
  const email = String(user?.email || '').trim().toLowerCase();
  if (!email) return { ok: false, status: 401, email: null };
  return { ok: true, status: 200, email };
}

export async function POST(request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const auth = await verifyUser(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.status === 401 ? 'unauthorized' : 'forbidden' }), {
      status: auth.status, headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'invalid_json' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const { id, importanceRatings } = body;

  if (!id || typeof id !== 'string') {
    return new Response(JSON.stringify({ error: 'missing_id', message: 'id is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  if (!importanceRatings || typeof importanceRatings !== 'object') {
    return new Response(JSON.stringify({ error: 'missing_importance', message: 'importanceRatings object is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  // Build validated ratings: only allow known domain codes, 1–10
  const validated = {};
  for (const code of DOM_CODES) {
    const v = importanceRatings[code];
    if (v != null) {
      const n = parseInt(v, 10);
      if (!isNaN(n) && n >= 1 && n <= 10) validated[code] = n;
    }
  }

  if (Object.keys(validated).length < 12) {
    return new Response(JSON.stringify({ error: 'incomplete', message: 'All 12 importance ratings are required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  // Fetch existing row and verify ownership
  const getRes = await fetch(
    `${supabaseUrl}/rest/v1/vapi_results?id=eq.${encodeURIComponent(id)}&select=id,email,results`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Accept: 'application/json',
      },
    }
  );

  if (!getRes.ok) {
    return new Response(JSON.stringify({ error: 'fetch_failed', status: getRes.status }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const rows = await getRes.json();
  const row = Array.isArray(rows) && rows[0] ? rows[0] : null;

  if (!row) {
    return new Response(JSON.stringify({ error: 'not_found', message: 'Result not found' }), {
      status: 404, headers: { 'Content-Type': 'application/json' }
    });
  }

  const rowEmail = String(row.email || '').trim().toLowerCase();
  if (rowEmail !== auth.email) {
    return new Response(JSON.stringify({ error: 'forbidden', message: 'You can only update your own results' }), {
      status: 403, headers: { 'Content-Type': 'application/json' }
    });
  }

  const existingResults = row.results && typeof row.results === 'object' ? row.results : {};
  const mergedResults = {
    ...existingResults,
    importanceRatings: validated,
  };

  const patchRes = await fetch(
    `${supabaseUrl}/rest/v1/vapi_results?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ results: mergedResults }),
    }
  );

  if (!patchRes.ok) {
    const detail = await patchRes.text();
    return new Response(JSON.stringify({ error: 'update_failed', status: patchRes.status, detail: detail.slice(0, 300) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
}
