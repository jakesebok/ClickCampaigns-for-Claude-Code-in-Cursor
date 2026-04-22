/**
 * Cron handler: morning + evening ritual reminders + presence sweep.
 * Invoked by vercel.json cron entries every 15 min.
 * For each user with notification prefs matching the current 15-min window, dispatch a reminder.
 * Then for all active users, evaluate presence.
 */

import { notify } from '../vapi-notify.js';
import { evaluatePresenceForUser } from '../vapi-presence-engine.js';

function env(n) { const v = process.env[n]; if (!v) throw new Error('missing env: ' + n); return v; }

async function supa(path) {
  return fetch(`${env('SUPABASE_URL')}${path}`, {
    headers: { apikey: env('SUPABASE_SERVICE_ROLE_KEY'), Authorization: `Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}` },
  });
}

function nowInTz(tz) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
  const h = parts.find(p => p.type === 'hour').value;
  const m = parts.find(p => p.type === 'minute').value;
  return `${h}:${m}`;
}

function minutesDiff(a, b) {
  const [ah, am] = a.split(':').map(Number);
  const [bh, bm] = b.split(':').map(Number);
  return Math.abs((ah * 60 + am) - (bh * 60 + bm));
}

async function todayLocalIso(tz) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date());
}

export async function GET(request) {
  // Auth: simple shared secret in x-vercel-cron or ?cron_secret
  const url = new URL(request.url, 'https://internal.local');
  const secret = request.headers.get('x-vercel-cron') || url.searchParams.get('cron_secret') || '';
  // Vercel sets x-vercel-cron automatically for scheduled invocations; allow if present.
  if (!secret && !request.headers.get('x-vercel-cron')) {
    // Still allow manual trigger if VAPI_CRON_SECRET matches
    const provided = url.searchParams.get('cron_secret') || '';
    if (!env('VAPI_CRON_SECRET') || provided !== env('VAPI_CRON_SECRET')) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
  }

  const prefsRes = await supa('/rest/v1/vapi_notification_preferences?select=*&limit=200');
  const prefsRows = prefsRes.ok ? await prefsRes.json() : [];
  const dispatched = [];

  for (const prefs of prefsRows) {
    try {
      const tz = prefs.timezone || 'America/New_York';
      const cur = nowInTz(tz);
      const today = await todayLocalIso(tz);

      // Morning reminder — within 15 min of morning_time, not yet checked in today
      if (minutesDiff(cur, (prefs.morning_time || '06:00').slice(0,5)) <= 7) {
        const r = await supa(`/rest/v1/vapi_morning_checkins?email=eq.${encodeURIComponent(prefs.email)}&local_date=eq.${today}&select=id&limit=1`);
        if (r.ok) {
          const rows = await r.json();
          if (!rows.length) {
            await notify({
              email: prefs.email,
              kind: 'morning_reminder',
              title: 'Today, in 45 seconds.',
              body: 'Three priorities. One honored domain. One intention. That is the whole thing.',
              url: '/morning-checkin',
              prefs,
              channelOverride: prefs.channel_morning,
            });
            dispatched.push({ email: prefs.email, kind: 'morning_reminder' });
          }
        }
      }

      // Evening reminder — within 15 min of evening_time, not yet reviewed today
      if (minutesDiff(cur, (prefs.evening_time || '17:00').slice(0,5)) <= 7) {
        const r = await supa(`/rest/v1/vapi_evening_reviews?email=eq.${encodeURIComponent(prefs.email)}&local_date=eq.${today}&select=id&limit=1`);
        if (r.ok) {
          const rows = await r.json();
          if (!rows.length) {
            await notify({
              email: prefs.email,
              kind: 'evening_reminder',
              title: 'Close the day with one honest line.',
              body: 'Sixty seconds. Process over outcome. Data, not a verdict.',
              url: '/evening-review',
              prefs,
              channelOverride: prefs.channel_evening,
            });
            dispatched.push({ email: prefs.email, kind: 'evening_reminder' });
          }
        }
      }

      // Presence sweep — always try
      try {
        const fired = await evaluatePresenceForUser({ email: prefs.email, trigger_context: 'cron_sweep' });
        for (const f of fired) {
          if (f.channel === 'push') {
            await notify({
              email: prefs.email,
              kind: `presence_${f.trigger_id.toLowerCase()}`,
              title: 'Aligned Performance',
              body: f.copy,
              url: '/dashboard',
              prefs,
              channelOverride: prefs.channel_presence,
            });
          }
        }
      } catch (e) {
        console.error('[cron-ritual-reminders] presence sweep failed for', prefs.email, e);
      }
    } catch (e) {
      console.error('[cron-ritual-reminders] row error', prefs.email, e);
    }
  }

  return new Response(JSON.stringify({ ok: true, dispatched, considered: prefsRows.length }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
