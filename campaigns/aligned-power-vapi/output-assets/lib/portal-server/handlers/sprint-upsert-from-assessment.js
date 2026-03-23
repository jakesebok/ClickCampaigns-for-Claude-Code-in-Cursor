/**
 * POST /api/sprint-upsert-from-assessment
 * Internal: creates/updates active sprint from VAPI-shaped results (used by Alfred after save).
 *
 * Headers: x-sprint-sync-secret — must match process.env.PORTAL_SPRINT_SYNC_SECRET (or SPRINT_SYNC_SECRET)
 *
 * Body: { email, results, assessment_source?, vapi_result_id? }
 */

import { enrichVapiResultsForStorage } from "../vapi-enrich-for-storage.js";
import { buildSprintPayload } from "../sprint-from-vapi.js";
import { upsertActiveSprint } from "../sprint-upsert.js";

function verifySyncSecret(request) {
  const secret = process.env.PORTAL_SPRINT_SYNC_SECRET || process.env.SPRINT_SYNC_SECRET || "";
  if (!secret) return false;
  const h = request.headers.get("x-sprint-sync-secret") || "";
  return h === secret;
}

export async function POST(request) {
  if (!verifySyncSecret(request)) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "missing_env" }), {
      status: 500,
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

  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  if (!email) {
    return new Response(JSON.stringify({ error: "missing_email" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rawResults = body.results && typeof body.results === "object" ? body.results : null;
  if (!rawResults) {
    return new Response(JSON.stringify({ error: "missing_results" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const enriched = enrichVapiResultsForStorage(rawResults);
  const sprintRow = buildSprintPayload(enriched, {
    userEmail: email,
    vapiResultId: body.vapi_result_id || null,
    assessmentSource: body.assessment_source,
  });

  try {
    const row = await upsertActiveSprint({ supabaseUrl, serviceKey: serviceRoleKey, row: sprintRow });
    return new Response(JSON.stringify({ ok: true, sprint: row }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[sprint-upsert-from-assessment]", e);
    return new Response(
      JSON.stringify({ error: "upsert_failed", message: String(e && e.message ? e.message : e).slice(0, 200) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
