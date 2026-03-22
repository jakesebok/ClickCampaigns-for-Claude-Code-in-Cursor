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

import { enrichResultsWithDriver } from "./_lib/vapi-driver-scoring.js";
import { enrichResultsWithJourneyman } from "../lib/vapi-journeyman-analysis.js";

function determineArchetypeFromResults(results) {
  const arenaScores = results?.arenaScores || {};
  const domainScores = { ...(results?.domainScores || {}) };
  (results?.domains || []).forEach((domain) => {
    if (domain && domain.code) {
      domainScores[domain.code] = domain.score ?? 0;
    }
  });

  const toNumber = (value) => {
    const num = typeof value === 'number' ? value : parseFloat(value);
    return Number.isFinite(num) ? num : null;
  };

  const personal = toNumber(arenaScores.Personal ?? arenaScores.Self);
  const relationships = toNumber(arenaScores.Relationships);
  const business = toNumber(arenaScores.Business);
  const overall = toNumber(results?.overall);
  const exScore = toNumber(domainScores.EX);
  const ecScore = toNumber(domainScores.EC);
  const vsScore = toNumber(domainScores.VS);

  if (personal == null || relationships == null || business == null) {
    return results?.archetype || null;
  }

  if (personal >= 8.0 && relationships >= 8.0 && business >= 8.0) {
    return 'The Architect';
  }

  const nearArchitectCount = [personal, relationships, business].filter((score) => score >= 7.5).length;
  const lowestArena = Math.min(personal, relationships, business);
  if (overall != null && overall >= 7.0 && nearArchitectCount >= 2 && lowestArena >= 6.5) {
    return 'The Journeyman';
  }

  const arenasLow = [personal, relationships, business].filter((score) => score <= 4.5).length;
  if ((overall != null && overall <= 4.5) || arenasLow >= 2) {
    return 'The Phoenix';
  }

  if (exScore != null && exScore >= 7.0 && ((ecScore != null && ecScore <= 5.0) || (vsScore != null && vsScore <= 5.0))) {
    return 'The Engine';
  }

  const highestArena = Math.max(personal, relationships, business);
  if (
    personal >= 5.0 &&
    personal <= 7.9 &&
    relationships >= 5.0 &&
    relationships <= 7.9 &&
    business >= 5.0 &&
    business <= 7.9 &&
    highestArena - lowestArena <= 2.0
  ) {
    return 'The Drifter';
  }

  if (business > personal && business > relationships && business - personal >= 2.0) {
    return 'The Performer';
  }

  if (
    business > personal &&
    business > relationships &&
    relationships < personal &&
    business - relationships >= 2.0
  ) {
    return 'The Ghost';
  }

  if (
    relationships > personal &&
    relationships > business &&
    business < personal &&
    relationships - business >= 2.0
  ) {
    return 'The Guardian';
  }

  if (
    personal > relationships &&
    personal > business &&
    business < relationships &&
    personal - business >= 2.0
  ) {
    return 'The Seeker';
  }

  return 'The Drifter';
}

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

  const enrichedResults =
    results && typeof results === 'object'
      ? enrichResultsWithDriver(results)
      : {};

  if (results && typeof results === 'object') {
    const archetype = determineArchetypeFromResults(results);
    if (archetype) {
      enrichedResults.archetype = archetype;
    }
    enrichResultsWithJourneyman(enrichedResults);
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
      results: enrichedResults,
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
