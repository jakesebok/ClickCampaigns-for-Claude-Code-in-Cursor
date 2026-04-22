/**
 * VAPI Presence Engine — pure-function rules engine ported from EdgeState.
 *
 * Given a user's recent activity, evaluates V-01..V-05 triggers.
 * Writes audit row for every evaluation (fired, suppressed, no-match, error).
 * Fail-loud discipline.
 */

import { DRIVER_BY_KEY } from './vapi-taxonomy-constants.js';

function env(name) {
  const v = process.env[name];
  if (!v) throw new Error(`[vapi-presence] Missing env: ${name}`);
  return v;
}

async function supaFetch(path, opts = {}) {
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

async function getActiveTriggerVersion() {
  const r = await supaFetch('/rest/v1/vapi_presence_trigger_versions?active=eq.true&select=version,triggers&limit=1');
  if (!r.ok) throw new Error('no_active_trigger_version');
  const rows = await r.json();
  if (!rows || !rows[0]) throw new Error('no_active_trigger_version');
  return rows[0];
}

async function fetchRecent(email) {
  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString();
  const [mornings, evenings, lastResult, prefs, todaysTriggers] = await Promise.all([
    supaFetch(`/rest/v1/vapi_morning_checkins?email=eq.${encodeURIComponent(email)}&completed_at=gte.${since}&select=*&order=completed_at.desc&limit=30`).then(r => r.json()),
    supaFetch(`/rest/v1/vapi_evening_reviews?email=eq.${encodeURIComponent(email)}&completed_at=gte.${since}&select=*&order=completed_at.desc&limit=30`).then(r => r.json()),
    supaFetch(`/rest/v1/vapi_results?email=eq.${encodeURIComponent(email)}&select=results,created_at&order=created_at.desc&limit=1`).then(r => r.json()),
    supaFetch(`/rest/v1/vapi_notification_preferences?email=eq.${encodeURIComponent(email)}&select=*&limit=1`).then(r => r.json()),
    supaFetch(`/rest/v1/vapi_presence_trigger_events?email=eq.${encodeURIComponent(email)}&evaluated_at=gte.${new Date(Date.now() - 7*24*3600*1000).toISOString()}&select=trigger_id,outcome,evaluated_at&order=evaluated_at.desc&limit=50`).then(r => r.json()),
  ]);
  return { mornings: mornings || [], evenings: evenings || [], lastResult: (lastResult && lastResult[0]) || null, prefs: (prefs && prefs[0]) || null, todaysTriggers: todaysTriggers || [] };
}

function isInQuietHours(prefs) {
  if (!prefs) return false;
  const tz = prefs.timezone || 'America/New_York';
  const now = new Date();
  const hm = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(now);
  const [h, m] = hm.split(':').map(Number);
  const cur = h * 60 + m;
  const toMin = (t) => { const [hh, mm] = String(t).split(':').map(Number); return hh * 60 + mm; };
  const start = toMin(prefs.quiet_hours_start || '21:00');
  const end = toMin(prefs.quiet_hours_end || '07:00');
  if (start === end) return false;
  if (start < end) return cur >= start && cur < end;
  return cur >= start || cur < end;
}

function capExceeded(triggerId, todaysTriggers, trigger) {
  const nowMs = Date.now();
  const firedToday = todaysTriggers.filter(t => t.trigger_id === triggerId && t.outcome === 'fired' && (nowMs - Date.parse(t.evaluated_at) < 24*3600*1000)).length;
  const firedThisWeek = todaysTriggers.filter(t => t.trigger_id === triggerId && t.outcome === 'fired' && (nowMs - Date.parse(t.evaluated_at) < 7*24*3600*1000)).length;
  if (firedToday >= (trigger.cap_per_day || 1)) return 'suppressed_cap_day';
  if (firedThisWeek >= (trigger.cap_per_week || 7)) return 'suppressed_cap_week';
  return null;
}

function topDriver(lastResult) {
  if (!lastResult || !lastResult.results) return null;
  const d = lastResult.results.driver;
  if (d && d.name) return d.name;
  return null;
}

function criticalPriorityDomains(lastResult) {
  const r = lastResult && lastResult.results;
  if (!r) return [];
  const imp = r.importanceRatings || {};
  const doms = (r.domains || []).filter(d => {
    const i = Number(imp[d.code]);
    return Number.isFinite(i) && i >= 7 && Number(d.score) <= 6;
  }).map(d => d.code);
  return doms;
}

function evaluateV01(ctx) {
  const { evenings, mornings } = ctx;
  const yesterday = evenings[0];
  if (!yesterday) return null;
  const yTs = Date.parse(yesterday.completed_at);
  if (Date.now() - yTs > 24*3600*1000) return null;
  if (yesterday.day_type !== 'drift') return null;
  if (!(yesterday.drivers_echoed && yesterday.drivers_echoed.length)) return null;
  if (yesterday.priorities_honored_count != null && yesterday.priorities_honored_count > 0) return null;
  const todayMorning = mornings[0];
  if (!todayMorning) return null;
  const tMs = Date.now() - Date.parse(todayMorning.completed_at);
  if (tMs > 2*3600*1000) return null;
  const driver = DRIVER_BY_KEY[yesterday.drivers_echoed[0]];
  return { trigger_id: 'V-01', channel: 'banner', payload: { driver: driver && driver.name || 'Your top driver', context: 'post_drift_spike' } };
}

function evaluateV02(ctx) {
  const e = ctx.evenings.slice(0, 3);
  if (e.length < 3) return null;
  const first = (e[0].drivers_echoed || [])[0];
  if (!first) return null;
  if (!((e[1].drivers_echoed || []).includes(first))) return null;
  if (!((e[2].drivers_echoed || []).includes(first))) return null;
  const driver = DRIVER_BY_KEY[first];
  return { trigger_id: 'V-02', channel: 'push', payload: { driver: driver && driver.name || first, context: 'driver_persistence' } };
}

function evaluateV03(ctx) {
  const { evenings, mornings, prefs } = ctx;
  const tz = (prefs && prefs.timezone) || 'America/New_York';
  const hour = Number(new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
  if (hour < 21) return null;
  const todayIso = new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date()).replaceAll('/', '-');
  const todayMorning = mornings.find(m => m.local_date === todayIso);
  if (!todayMorning) return null;
  const todayEvening = evenings.find(ev => ev.local_date === todayIso);
  if (todayEvening) return null;
  return { trigger_id: 'V-03', channel: 'push', payload: { context: 'missing_evening_review' } };
}

function evaluateV04(ctx) {
  const { mornings, lastResult } = ctx;
  const today = mornings[0];
  if (!today) return null;
  const tMs = Date.now() - Date.parse(today.completed_at);
  if (tMs > 2*3600*1000) return null;
  const critical = criticalPriorityDomains(lastResult);
  if (!critical.length) return null;
  const prs = today.priorities || [];
  const cpCount = prs.filter(p => p.domain_code && critical.includes(p.domain_code)).length;
  if (cpCount < Math.max(2, Math.ceil(prs.length / 2))) return null;
  return { trigger_id: 'V-04', channel: 'banner', payload: { context: 'morning_misalignment', critical_domains: critical, priority_count_in_critical: cpCount } };
}

function evaluateV05(ctx) {
  const { mornings, evenings } = ctx;
  if (mornings.length < 3) return null;
  const bigMornings = mornings.slice(0, 3).every(m => (m.priorities || []).length >= 5);
  if (!bigMornings) return null;
  const recentE = evenings.slice(0, 3);
  if (recentE.length < 3) return null;
  const declining = recentE.every((e, i) => {
    if (i === 0) return true;
    const prev = recentE[i - 1];
    return (e.priorities_honored_count || 0) <= (prev.priorities_honored_count || 0);
  });
  if (!declining) return null;
  return { trigger_id: 'V-05', channel: 'drawer', payload: { context: 'overextension_streak' } };
}

const EVALUATORS = [evaluateV01, evaluateV02, evaluateV03, evaluateV04, evaluateV05];

async function writeEvent(email, version, trigger_id, outcome, channel, payload, source_row_ids = {}) {
  await supaFetch('/rest/v1/vapi_presence_trigger_events', {
    method: 'POST', prefer: 'return=minimal',
    body: JSON.stringify({ email, trigger_id, version, outcome, channel: channel || null, payload: payload || null, source_row_ids }),
  });
}

export async function evaluatePresenceForUser({ email, trigger_context }) {
  if (!email) throw new Error('email_required');
  const active = await getActiveTriggerVersion();
  const version = active.version;
  const triggerDefs = active.triggers || {};
  const ctx = await fetchRecent(email);
  const quiet = isInQuietHours(ctx.prefs);

  const results = [];
  for (const evaluator of EVALUATORS) {
    try {
      const match = evaluator(ctx);
      if (!match) continue;
      const def = triggerDefs[match.trigger_id];
      if (!def) { await writeEvent(email, version, match.trigger_id, 'unknown_trigger', null, match.payload); continue; }
      // Quiet hours gate only applies to push channel
      if (quiet && (match.channel === 'push' || def.output_channel === 'push')) {
        await writeEvent(email, version, match.trigger_id, 'suppressed_quiet_hours', null, match.payload);
        continue;
      }
      const cap = capExceeded(match.trigger_id, ctx.todaysTriggers, def);
      if (cap) { await writeEvent(email, version, match.trigger_id, cap, null, match.payload); continue; }
      const copy = (def.copy_template || '').replace(/\{\{driver\}\}/g, (match.payload && match.payload.driver) || 'your pattern');
      await writeEvent(email, version, match.trigger_id, 'fired', match.channel || def.output_channel, Object.assign({}, match.payload, { copy }));
      results.push({ trigger_id: match.trigger_id, copy, channel: match.channel || def.output_channel });
    } catch (e) {
      console.error('[vapi-presence] evaluator error', e);
      await writeEvent(email, version, 'runtime_error', 'error', null, { error: String(e && e.message || e), trigger_context });
    }
  }
  return results;
}
