// Vercel serverless: GET/POST coach notes for a client (coach only).
// GET ?email=xxx  → { notes, updated_at, contextualProfile }
// POST { email, notes }  → upsert
// Requires SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.PORTAL_ADMIN_EMAIL || 'jacob@alignedpower.coach').trim().toLowerCase();

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
    return new Response(JSON.stringify({ error: 'missing_env' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const auth = await verifyCoach(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.status === 403 ? 'forbidden' : 'unauthorized' }), {
      status: auth.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const clientEmail = new URL(request.url).searchParams.get('email') || '';
  const norm = clientEmail.trim().toLowerCase();
  if (!norm) {
    return new Response(JSON.stringify({ error: 'bad_request', message: 'email required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const [notesRes, usersRes] = await Promise.all([
      fetch(
        `${url}/rest/v1/coach_notes?client_email=eq.${encodeURIComponent(norm)}&select=notes,updated_at`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json' } }
      ),
      fetch(
        `${url}/auth/v1/admin/users?filter=${encodeURIComponent(norm)}`,
        { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } }
      ),
    ]);
    const rows = notesRes.ok ? await notesRes.json() : [];
    const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
    let contextualProfile = null;
    if (usersRes.ok) {
      const usersJson = await usersRes.json();
      const users = usersJson.users || [];
      const match = users.find((u) => (u.email || '').toLowerCase() === norm);
      contextualProfile = match?.user_metadata?.contextual_profile || null;
    }
    return new Response(
      JSON.stringify({
        notes: row ? row.notes || '' : '',
        updated_at: row ? row.updated_at : null,
        contextualProfile,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'unexpected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  const url = process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ error: 'missing_env' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
  const auth = await verifyCoach(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.status === 403 ? 'forbidden' : 'unauthorized' }), {
      status: auth.status,
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
  const clientEmail = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const notes = typeof body.notes === 'string' ? body.notes : '';
  if (!clientEmail) {
    return new Response(JSON.stringify({ error: 'bad_request', message: 'email required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const r = await fetch(`${url}/rest/v1/coach_notes?on_conflict=client_email`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation',
      },
      body: JSON.stringify({
        client_email: clientEmail,
        notes,
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
    const rows = await r.json().catch(() => []);
    const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
    return new Response(
      JSON.stringify({ ok: true, notes, updated_at: row ? row.updated_at : new Date().toISOString() }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'unexpected' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
