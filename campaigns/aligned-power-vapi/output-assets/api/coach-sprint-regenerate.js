/**
 * POST /api/coach-sprint-regenerate
 * Coach: rebuild active sprint from client's latest vapi_results row.
 * Body: { email: string }
 */

import { enrichVapiResultsForStorage } from "./_lib/vapi-enrich-for-storage.js";
import { buildSprintPayload } from "./_lib/sprint-from-vapi.js";
import { upsertActiveSprint } from "./_lib/sprint-upsert.js";

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
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!supabaseUrl || !serviceKey) {
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

  const clientEmail = String(body.email || "")
    .trim()
    .toLowerCase();
  if (!clientEmail) {
    return new Response(JSON.stringify({ error: "missing_email" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const vapiUrl = `${supabaseUrl}/rest/v1/vapi_results?email=eq.${encodeURIComponent(clientEmail)}&select=id,results,source&order=created_at.desc&limit=1`;
  const vRes = await fetch(vapiUrl, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: "application/json" },
  });
  if (!vRes.ok) {
    return new Response(JSON.stringify({ error: "vapi_fetch_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const vRows = await vRes.json();
  const vRow = Array.isArray(vRows) && vRows[0] ? vRows[0] : null;
  if (!vRow || !vRow.results) {
    return new Response(JSON.stringify({ error: "no_vapi_results" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const enriched = enrichVapiResultsForStorage(
    typeof vRow.results === "object" ? { ...vRow.results } : {}
  );
  const assessmentSource = typeof vRow.source === "string" && vRow.source ? vRow.source : "portal";
  const sprintRow = buildSprintPayload(enriched, {
    userEmail: clientEmail,
    vapiResultId: vRow.id,
    assessmentSource,
  });
  sprintRow.sprint_type = "coach-modified";

  try {
    const existingUrl = `${supabaseUrl}/rest/v1/sprints?user_email=eq.${encodeURIComponent(clientEmail)}&status=eq.active&select=coach_context,coach_private_notes&limit=1`;
    const exRes = await fetch(existingUrl, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: "application/json" },
    });
    const exRows = exRes.ok ? await exRes.json() : [];
    const ex = Array.isArray(exRows) && exRows[0] ? exRows[0] : null;
    if (ex) {
      sprintRow.coach_context = ex.coach_context ?? null;
      sprintRow.coach_private_notes = ex.coach_private_notes ?? null;
    }
  } catch {
    /* keep */
  }

  try {
    const row = await upsertActiveSprint({ supabaseUrl, serviceKey, row: sprintRow });
    return new Response(JSON.stringify({ ok: true, sprint: row }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[coach-sprint-regenerate]", e);
    return new Response(JSON.stringify({ error: "upsert_failed", message: String(e?.message || e).slice(0, 200) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
