/**
 * POST /api/save-vapi-results
 * Saves a completed VAPI assessment to the vapi_results table.
 * Uses the service role key to bypass RLS — runs server-side only.
 *
 * Body (JSON):
 *   email       string  — user email (required)
 *   firstName   string
 *   lastName    string
 *   results     object  — full results payload
 */

export async function POST(request) {
  const supabaseUrl     = process.env.SUPABASE_URL;
  const serviceRoleKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
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

  const { email, firstName, lastName, results } = body;

  if (!email) {
    return new Response(JSON.stringify({ error: 'missing_email', message: 'email is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const emailNormalized = String(email).trim().toLowerCase();

  // Direct REST insert using service role key — bypasses RLS entirely
  const res = await fetch(`${supabaseUrl}/rest/v1/vapi_results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      email: emailNormalized,
      first_name: firstName || null,
      last_name: lastName || null,
      results: results || {},
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return new Response(JSON.stringify({ error: 'insert_failed', status: res.status, detail: detail.slice(0, 500) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify({ ok: true, data }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
}
