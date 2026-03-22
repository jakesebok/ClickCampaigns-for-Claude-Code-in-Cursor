/**
 * GET /api/coach-sprints
 * Lists active sprints (coach only). Optional ?email= for one client.
 */

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.PORTAL_ADMIN_EMAIL || "jacob@alignedpower.coach")
  .trim()
  .toLowerCase();

async function verifyCoach(request) {
  const url = process.env.SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization") || "";
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = m ? m[1] : "";
  if (!accessToken || !url || !anonKey) return { ok: false, status: 401 };
  const u = await fetch(`${url}/auth/v1/user`, {
    method: "GET",
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!u.ok) return { ok: false, status: 401 };
  const user = await u.json();
  const email = String(user?.email || "")
    .trim()
    .toLowerCase();
  if (email !== ADMIN_EMAIL) return { ok: false, status: 403 };
  return { ok: true };
}

export async function GET(request) {
  const url = process.env.SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ error: "missing_env" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const auth = await verifyCoach(request);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.status === 403 ? "forbidden" : "unauthorized" }), {
      status: auth.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const oneEmail = new URL(request.url).searchParams.get("email");
  let restUrl = `${url}/rest/v1/sprints?status=eq.active&select=*&order=updated_at.desc`;
  if (oneEmail) {
    const norm = oneEmail.trim().toLowerCase();
    restUrl = `${url}/rest/v1/sprints?user_email=eq.${encodeURIComponent(norm)}&status=eq.active&select=*`;
  }

  const res = await fetch(restUrl, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: "application/json" },
  });
  if (!res.ok) {
    return new Response(JSON.stringify({ error: "fetch_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const sprints = await res.json();
  return new Response(JSON.stringify({ sprints: Array.isArray(sprints) ? sprints : [] }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
