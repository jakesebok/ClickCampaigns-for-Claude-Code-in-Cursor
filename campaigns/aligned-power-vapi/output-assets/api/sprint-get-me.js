/**
 * GET /api/sprint-get-me
 * Returns the caller's active sprint (any primary_surface). Portal UI filters by primary_surface.
 * Authorization: Bearer <supabase access token>
 */

async function verifyUser(request) {
  const url = process.env.SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization") || "";
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = m ? m[1] : "";
  if (!accessToken || !url || !anonKey) return { ok: false, status: 401, email: null };
  const u = await fetch(`${url}/auth/v1/user`, {
    method: "GET",
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!u.ok) return { ok: false, status: 401, email: null };
  const user = await u.json();
  const email = String(user?.email || "")
    .trim()
    .toLowerCase();
  if (!email) return { ok: false, status: 401, email: null };
  return { ok: true, email };
}

export async function GET(request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return new Response(JSON.stringify({ error: "missing_env" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const auth = await verifyUser(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const email = auth.email;
  const url = `${supabaseUrl}/rest/v1/sprints?user_email=eq.${encodeURIComponent(email)}&status=eq.active&select=*&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: "application/json" },
  });
  if (!res.ok) {
    return new Response(JSON.stringify({ error: "fetch_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const rows = await res.json();
  const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
  return new Response(JSON.stringify({ sprint: row }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
