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
 *   source      string  — optional: marketing | portal (default marketing)
 */

import { enrichVapiResultsForStorage } from "./_lib/vapi-enrich-for-storage.js";
import { buildSprintPayload } from "./_lib/sprint-from-vapi.js";
import { upsertActiveSprint } from "./_lib/sprint-upsert.js";

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

  const { email, firstName, lastName, results, source } = body;

  if (!email) {
    return new Response(JSON.stringify({ error: 'missing_email', message: 'email is required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
  }

  const enrichedResults =
    results && typeof results === 'object' ? enrichVapiResultsForStorage(results) : {};

  const emailNormalized = String(email).trim().toLowerCase();
  const assessmentSource = typeof source === 'string' && source.trim() ? source.trim() : 'marketing';

  // Direct REST insert using service role key — bypasses RLS entirely
  const insertPayload = {
    email: emailNormalized,
    first_name: firstName || null,
    last_name: lastName || null,
    results: enrichedResults,
    source: assessmentSource,
  };

  const res = await fetch(`${supabaseUrl}/rest/v1/vapi_results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceRoleKey,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(insertPayload),
  });

  if (!res.ok) {
    const detail = await res.text();
    const retryWithoutSource =
      res.status === 400 &&
      /source|column/i.test(detail) &&
      'source' in insertPayload;
    if (retryWithoutSource) {
      delete insertPayload.source;
      const res2 = await fetch(`${supabaseUrl}/rest/v1/vapi_results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(insertPayload),
      });
      if (!res2.ok) {
        const d2 = await res2.text();
        return new Response(JSON.stringify({ error: 'insert_failed', status: res2.status, detail: d2.slice(0, 500) }), {
          status: 500, headers: { 'Content-Type': 'application/json' }
        });
      }
      const data2 = await res2.json();
      const row2 = Array.isArray(data2) ? data2[0] : data2;
      try {
        const sprintRow = buildSprintPayload(enrichedResults, {
          userEmail: emailNormalized,
          vapiResultId: row2?.id || null,
          assessmentSource,
        });
        await upsertActiveSprint({ supabaseUrl, serviceKey: serviceRoleKey, row: sprintRow });
      } catch (e) {
        console.error('[save-vapi-results] sprint upsert failed', e);
      }
      return new Response(JSON.stringify({ ok: true, data: data2, sprint_note: 'run supabase/sprints.sql + add vapi_results.source if missing' }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }
    return new Response(JSON.stringify({ error: 'insert_failed', status: res.status, detail: detail.slice(0, 500) }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  const data = await res.json();
  const row0 = Array.isArray(data) ? data[0] : data;
  try {
    const sprintRow = buildSprintPayload(enrichedResults, {
      userEmail: emailNormalized,
      vapiResultId: row0?.id || null,
      assessmentSource,
    });
    await upsertActiveSprint({ supabaseUrl, serviceKey: serviceRoleKey, row: sprintRow });
  } catch (e) {
    console.error('[save-vapi-results] sprint upsert failed', e);
  }

  return new Response(JSON.stringify({ ok: true, data }), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
}
