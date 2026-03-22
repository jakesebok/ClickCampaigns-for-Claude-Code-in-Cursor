/**
 * Upsert the single active sprint for a user (service role REST).
 * @param {object} opts
 * @param {string} opts.supabaseUrl
 * @param {string} opts.serviceKey
 * @param {object} opts.row — user_email, vapi_result_id, assessment_source, primary_surface, status, sprint_type, payload, coach_context?, coach_private_notes?
 */

export async function upsertActiveSprint({ supabaseUrl, serviceKey, row }) {
  const email = String(row.user_email || "")
    .trim()
    .toLowerCase();
  if (!email) throw new Error("user_email required");

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const findUrl = `${supabaseUrl}/rest/v1/sprints?user_email=eq.${encodeURIComponent(email)}&status=eq.active&select=id,coach_context,coach_private_notes&limit=1`;
  const findRes = await fetch(findUrl, { headers });
  if (!findRes.ok) {
    const t = await findRes.text();
    throw new Error(`sprints find failed: ${findRes.status} ${t.slice(0, 200)}`);
  }
  const existing = await findRes.json();
  const prev = Array.isArray(existing) && existing[0] ? existing[0] : null;

  const now = new Date().toISOString();
  const patchBody = {
    vapi_result_id: row.vapi_result_id,
    assessment_source: row.assessment_source,
    primary_surface: row.primary_surface,
    payload: row.payload,
    sprint_type: row.sprint_type || "auto",
    updated_at: now,
  };

  if (prev) {
    const patchUrl = `${supabaseUrl}/rest/v1/sprints?id=eq.${encodeURIComponent(prev.id)}`;
    const patchRes = await fetch(patchUrl, {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify(patchBody),
    });
    if (!patchRes.ok) {
      const t = await patchRes.text();
      throw new Error(`sprints patch failed: ${patchRes.status} ${t.slice(0, 200)}`);
    }
    const data = await patchRes.json();
    return Array.isArray(data) ? data[0] : data;
  }

  const insertBody = {
    user_email: email,
    vapi_result_id: row.vapi_result_id,
    assessment_source: row.assessment_source,
    primary_surface: row.primary_surface,
    status: "active",
    sprint_type: row.sprint_type || "auto",
    payload: row.payload,
    coach_context: row.coach_context ?? null,
    coach_private_notes: row.coach_private_notes ?? null,
    created_at: now,
    updated_at: now,
  };

  const postRes = await fetch(`${supabaseUrl}/rest/v1/sprints`, {
    method: "POST",
    headers: { ...headers, Prefer: "return=representation" },
    body: JSON.stringify(insertBody),
  });
  if (!postRes.ok) {
    const t = await postRes.text();
    throw new Error(`sprints insert failed: ${postRes.status} ${t.slice(0, 200)}`);
  }
  const data = await postRes.json();
  return Array.isArray(data) ? data[0] : data;
}
