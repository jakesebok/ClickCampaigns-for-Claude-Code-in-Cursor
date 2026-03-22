/**
 * PATCH /api/sprint-patch-me
 * Merge task completion + week reflections into the active sprint payload.
 *
 * Body: { taskUpdates?: { [taskId]: boolean }, weekReflections?: { [weekNumber]: string } }
 */

async function verifyUser(request) {
  const url = process.env.SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || "";
  const authHeader = request.headers.get("authorization") || request.headers.get("Authorization") || "";
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  const accessToken = m ? m[1] : "";
  if (!accessToken || !url || !anonKey) return { ok: false, email: null };
  const u = await fetch(`${url}/auth/v1/user`, {
    method: "GET",
    headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
  });
  if (!u.ok) return { ok: false, email: null };
  const user = await u.json();
  const email = String(user?.email || "")
    .trim()
    .toLowerCase();
  if (!email) return { ok: false, email: null };
  return { ok: true, email };
}

export async function PATCH(request) {
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

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const taskUpdates = body.taskUpdates && typeof body.taskUpdates === "object" ? body.taskUpdates : null;
  const weekReflections =
    body.weekReflections && typeof body.weekReflections === "object" ? body.weekReflections : null;
  if (!taskUpdates && !weekReflections) {
    return new Response(JSON.stringify({ error: "nothing_to_patch" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const findUrl = `${supabaseUrl}/rest/v1/sprints?user_email=eq.${encodeURIComponent(auth.email)}&status=eq.active&select=id,payload&limit=1`;
  const findRes = await fetch(findUrl, {
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: "application/json" },
  });
  if (!findRes.ok) {
    return new Response(JSON.stringify({ error: "fetch_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const rows = await findRes.json();
  const row = Array.isArray(rows) && rows[0] ? rows[0] : null;
  if (!row) {
    return new Response(JSON.stringify({ error: "no_sprint" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = { ...(row.payload || {}) };
  if (!payload.weeks || !Array.isArray(payload.weeks)) {
    return new Response(JSON.stringify({ error: "invalid_payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (taskUpdates) {
    for (const w of payload.weeks) {
      if (!w.tasks || !Array.isArray(w.tasks)) continue;
      for (const t of w.tasks) {
        if (t && t.id in taskUpdates) {
          t.completed = !!taskUpdates[t.id];
        }
      }
    }
  }

  if (weekReflections) {
    payload.weekReflections = { ...(payload.weekReflections || {}) };
    for (const [k, v] of Object.entries(weekReflections)) {
      if (typeof v === "string") payload.weekReflections[k] = v;
    }
  }

  const patchUrl = `${supabaseUrl}/rest/v1/sprints?id=eq.${encodeURIComponent(row.id)}`;
  const patchRes = await fetch(patchUrl, {
    method: "PATCH",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      payload,
      updated_at: new Date().toISOString(),
    }),
  });

  if (!patchRes.ok) {
    const t = await patchRes.text();
    return new Response(JSON.stringify({ error: "patch_failed", detail: t.slice(0, 200) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const data = await patchRes.json();
  const out = Array.isArray(data) ? data[0] : data;
  return new Response(JSON.stringify({ ok: true, sprint: out }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
