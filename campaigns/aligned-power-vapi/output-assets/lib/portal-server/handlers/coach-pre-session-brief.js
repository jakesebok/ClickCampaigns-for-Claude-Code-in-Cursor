/**
 * Coach Pre-Session Brief generator.
 *
 * POST /api/coach-pre-session-brief { client_email, session_scheduled_at }
 *  → generates a brief using Anthropic (Claude) with per-client context.
 * GET  /api/coach-pre-session-brief?client_email=&since=ISO
 *  → returns recent briefs for a client.
 *
 * Only the coach (jacob@alignedpower.coach) can invoke.
 */

function env(n) { const v = process.env[n]; if (!v) return null; return v; }
async function authEmail(req) {
  const a = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  if (!a.startsWith('Bearer ')) return null;
  const r = await fetch(`${env('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: a } });
  if (!r.ok) return null;
  const u = await r.json();
  return (u && u.email && String(u.email).toLowerCase()) || null;
}
const COACHES = new Set(['jacob@alignedpower.coach', 'jake@alignedpower.coach']);
function isCoach(email) { return COACHES.has(email); }

async function supa(path, opts = {}) {
  return fetch(`${env('SUPABASE_URL')}${path}`, {
    ...opts,
    headers: Object.assign({
      apikey: env('SUPABASE_SERVICE_ROLE_KEY'),
      Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}`,
      'Content-Type': 'application/json',
      Prefer: opts.prefer || 'return=representation',
    }, opts.headers || {}),
  });
}

async function gatherClientContext(clientEmail) {
  const enc = encodeURIComponent(clientEmail);
  const [aR, mR, eR, pR, sR, scR] = await Promise.all([
    supa(`/rest/v1/vapi_results?email=eq.${enc}&select=results,created_at&order=created_at.desc&limit=2`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_morning_checkins?email=eq.${enc}&select=*&order=completed_at.desc&limit=10`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_evening_reviews?email=eq.${enc}&select=*&order=completed_at.desc&limit=10`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/vapi_monthly_pulses?email=eq.${enc}&select=*&order=completed_at.desc&limit=2`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/sprints?user_email=eq.${enc}&select=payload,status,updated_at&order=updated_at.desc&limit=1`).then(r => r.ok ? r.json() : []),
    supa(`/rest/v1/six_c_submissions?email=eq.${enc}&select=scores,one_thing_to_improve,created_at&order=created_at.desc&limit=3`).then(r => r.ok ? r.json() : []),
  ]);
  return { assessments: aR, mornings: mR, evenings: eR, pulses: pR, sprint: sR[0] || null, scorecards: scR };
}

function buildSystemPrompt() {
  return `You are a pre-session briefing agent for Jake Sebok's Aligned Performance coaching practice. Output a tight, readable brief (200-260 words, no preamble, no sign-off) for Jake to skim 2 hours before a session. Use plain text with short sections labeled "Recent", "Patterns", "Suggested angle". No emoji. No em-dashes. No "I hope this helps." Be specific: cite exact driver names, exact domain codes, exact dates. If data is sparse, say so directly. The voice is Jake's: direct, unsentimental, kind. Never moralize. Your job is to give Jake a clear read on where this client is today, what is actually moving, and one honest angle to open the session with.`;
}

function buildUserPrompt(clientEmail, context, scheduledAt) {
  const latest = context.assessments[0];
  const prior = context.assessments[1];
  const latestResults = latest && latest.results || {};
  return `Client email: ${clientEmail}
Session scheduled: ${scheduledAt}

Latest assessment (${latest ? new Date(latest.created_at).toISOString().slice(0,10) : 'none'}):
- Archetype: ${latestResults.archetype || 'unassigned'}
- Primary driver: ${latestResults.driver && latestResults.driver.name || 'none'}
- Overall: ${latestResults.overall || 'n/a'}
- Arena scores: ${JSON.stringify(latestResults.arenaScores || {})}

Prior assessment (${prior ? new Date(prior.created_at).toISOString().slice(0,10) : 'none'}):
- Archetype: ${prior && prior.results && prior.results.archetype || 'n/a'}
- Primary driver: ${prior && prior.results && prior.results.driver && prior.results.driver.name || 'n/a'}

Last 10 morning check-ins (priorities, honored domain):
${context.mornings.map(m => `- ${m.local_date}: [${(m.priorities || []).map(p => p.domain_code || '—').join(',')}] honored=${m.honored_domain || '—'}`).join('\n') || 'none'}

Last 10 evening reviews (day_type, drivers echoed, priorities honored):
${context.evenings.map(e => `- ${e.local_date}: ${e.day_type} drivers=[${(e.drivers_echoed || []).join(',')}] honored=${e.priorities_honored_count || 0}/3`).join('\n') || 'none'}

Last monthly pulse:
${context.pulses[0] ? `- ${context.pulses[0].local_month}: composite delta ${context.pulses[0].delta_vs_last_full && context.pulses[0].delta_vs_last_full.composite_delta}` : 'none'}

Latest Six-C scorecard:
${context.scorecards[0] ? `- ${context.scorecards[0].created_at.slice(0,10)}: ${JSON.stringify(context.scorecards[0].scores)} Vital: ${context.scorecards[0].one_thing_to_improve || '—'}` : 'none'}

Active Sprint:
${context.sprint ? `- ${context.sprint.payload && context.sprint.payload.title || 'Sprint active'}` : 'none'}

Write the brief now.`;
}

async function generateBrief(clientEmail, scheduledAt, context) {
  const key = env('ANTHROPIC_API_KEY');
  if (!key) return { text: buildDeterministicBrief(clientEmail, scheduledAt, context), model: 'deterministic_fallback', fallback: true };
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 700,
        system: buildSystemPrompt(),
        messages: [{ role: 'user', content: buildUserPrompt(clientEmail, context, scheduledAt) }],
      }),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error('[pre-session-brief] anthropic error', err);
      return { text: buildDeterministicBrief(clientEmail, scheduledAt, context), model: 'deterministic_fallback', fallback: true };
    }
    const j = await res.json();
    const text = (j.content || []).map(b => b.type === 'text' ? b.text : '').join('\n').trim();
    return { text, model: j.model, fallback: false };
  } catch (e) {
    return { text: buildDeterministicBrief(clientEmail, scheduledAt, context), model: 'deterministic_fallback', fallback: true, error: String(e) };
  }
}

function buildDeterministicBrief(clientEmail, scheduledAt, context) {
  const latest = context.assessments[0];
  const arch = latest && latest.results && latest.results.archetype;
  const driver = latest && latest.results && latest.results.driver && latest.results.driver.name;
  const recentEve = context.evenings.slice(0, 3);
  const drifts = recentEve.filter(e => e.day_type === 'drift').length;
  const driversSeen = new Set();
  recentEve.forEach(e => (e.drivers_echoed || []).forEach(d => driversSeen.add(d)));
  const streakDrivers = Array.from(driversSeen).slice(0, 3).join(', ');
  return [
    'Recent',
    `${context.mornings.length} morning check-ins and ${context.evenings.length} evening reviews on file. ${drifts}/${recentEve.length} recent days marked drift.`,
    '',
    'Patterns',
    `${arch || 'No archetype assigned yet'}. ${driver ? `Primary driver: ${driver}.` : 'No driver assigned.'}${streakDrivers ? ` Drivers echoing this week: ${streakDrivers}.` : ''}`,
    '',
    'Suggested angle',
    driver ? `Open by asking which of the last three days felt most like ${driver}, and which felt least.` : 'Open by asking which of the last three days felt most aligned, and which felt least. Let the pattern come from them.',
  ].join('\n');
}

export async function POST(request) {
  const coachEmail = await authEmail(request);
  if (!coachEmail || !isCoach(coachEmail)) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  let body; try { body = await request.json(); } catch { body = {}; }
  const client_email = String(body.client_email || '').toLowerCase().trim();
  const scheduled = body.session_scheduled_at || new Date(Date.now() + 2 * 3600 * 1000).toISOString();
  if (!client_email) return new Response(JSON.stringify({ error: 'client_email_required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

  const ctx = await gatherClientContext(client_email);
  const generated = await generateBrief(client_email, scheduled, ctx);
  const brief = {
    summary: generated.text,
    model: generated.model,
    counts: {
      mornings: ctx.mornings.length, evenings: ctx.evenings.length,
      assessments: ctx.assessments.length, pulses: ctx.pulses.length,
    },
    signals: {
      recent_day_types: ctx.evenings.slice(0, 7).map(e => e.day_type),
      recent_drivers: Array.from(new Set(ctx.evenings.slice(0, 7).flatMap(e => e.drivers_echoed || []))),
    },
    generated_at: new Date().toISOString(),
  };
  const ins = await supa('/rest/v1/vapi_session_briefs', {
    method: 'POST', prefer: 'return=representation',
    body: JSON.stringify({
      coach_email: coachEmail,
      client_email,
      session_scheduled_at: scheduled,
      brief,
      generator_version: 'v1.0.0',
    }),
  });
  const rows = ins.ok ? await ins.json() : null;
  return new Response(JSON.stringify({ ok: true, brief: Array.isArray(rows) ? rows[0] : rows }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function GET(request) {
  const coachEmail = await authEmail(request);
  if (!coachEmail || !isCoach(coachEmail)) return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
  const url = new URL(request.url, 'https://internal.local');
  const client = (url.searchParams.get('client_email') || '').toLowerCase();
  if (!client) return new Response(JSON.stringify({ error: 'client_email_required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  const r = await supa(`/rest/v1/vapi_session_briefs?client_email=eq.${encodeURIComponent(client)}&coach_email=eq.${encodeURIComponent(coachEmail)}&order=generated_at.desc&limit=5`);
  if (!r.ok) return new Response(JSON.stringify({ error: 'db_read_failed' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  const briefs = await r.json();
  return new Response(JSON.stringify({ ok: true, briefs }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
