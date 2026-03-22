/**
 * POST /api/coach-sprint-save
 * Coach updates coach_context, coach_private_notes, optional full payload, sprint_type.
 * Body: { sprintId: string, coach_context?, coach_private_notes?, payload?, sprint_type? }
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

export async function POST(request) {
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

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sprintId = typeof body.sprintId === "string" ? body.sprintId.trim() : "";
  if (!sprintId) {
    return new Response(JSON.stringify({ error: "missing_sprintId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const patch = { updated_at: new Date().toISOString() };
  if (typeof body.coach_context === "string") patch.coach_context = body.coach_context;
  if (typeof body.coach_private_notes === "string") patch.coach_private_notes = body.coach_private_notes;
  if (body.payload && typeof body.payload === "object") {
    patch.payload = body.payload;
    patch.sprint_type = "coach-modified";
  }
  if (typeof body.sprint_type === "string") patch.sprint_type = body.sprint_type;

  if (Object.keys(patch).length <= 1) {
    return new Response(JSON.stringify({ error: "no_fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const patchUrl = `${url}/rest/v1/sprints?id=eq.${encodeURIComponent(sprintId)}`;
  const res = await fetch(patchUrl, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    const t = await res.text();
    return new Response(JSON.stringify({ error: "patch_failed", detail: t.slice(0, 200) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const data = await res.json();
  const row = Array.isArray(data) ? data[0] : data;
  return new Response(JSON.stringify({ ok: true, sprint: row }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
