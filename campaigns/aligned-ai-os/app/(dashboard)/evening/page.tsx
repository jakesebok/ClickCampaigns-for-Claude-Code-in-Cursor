/**
 * Alfred — Evening Integrity Review (mirrors VAPI portal's /evening-review).
 * Writes to shared Supabase `vapi_evening_reviews` with source='alfred'.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const DAY_TYPES = [
  { id: 'aligned', label: 'Aligned', hint: 'Honored your plan' },
  { id: 'drift', label: 'Drift', hint: 'A priority slipped' },
  { id: 'scratch', label: 'Scratch', hint: 'Ordinary, neither' },
  { id: 'win', label: 'Win', hint: 'Real forward motion' },
  { id: 'boundary', label: 'Boundary', hint: 'Said no to something' },
  { id: 'overextension', label: 'Overextension', hint: 'More than baseline' },
  { id: 'any', label: 'Just reflect', hint: 'General read' },
];

const PROMPTS: Record<string, { id: string; text: string }> = {
  aligned: { id: 'vapi-eve-01', text: 'Today honored your plan. Name one thing this alignment did not prove about you.' },
  drift: { id: 'vapi-eve-02', text: 'A priority slipped. Name the exact moment the justification arrived.' },
  scratch: { id: 'vapi-eve-03', text: 'Ordinary day. Rich on practice. Name one thing you noticed this week that you missed last week.' },
  win: { id: 'vapi-eve-04', text: 'A win. Was it conviction in the plan, or hope the plan would reward you?' },
  any: { id: 'vapi-eve-05', text: 'Your top driver had an opening today. Name the moment you felt it, or confirm it stayed quiet.' },
  boundary: { id: 'vapi-eve-06', text: 'You said no to something today. Rule-based or feeling-based? Mark both valid. Name which.' },
  overextension: { id: 'vapi-eve-07', text: 'You took on more than baseline. What specifically about today earned the extra, in one sentence?' },
};

const DRIVERS = [
  { key: 'achievers_trap', name: "Achiever's Trap" },
  { key: 'escape_artist', name: 'Escape Artist' },
  { key: 'pleasers_bind', name: "Pleaser's Bind" },
  { key: 'imposter_loop', name: 'Imposter Loop' },
  { key: 'perfectionists_prison', name: "Perfectionist's Prison" },
  { key: 'protector', name: 'Protector' },
  { key: 'martyr_complex', name: 'Martyr Complex' },
  { key: 'fog', name: 'The Fog' },
  { key: 'scattered_mind', name: 'Scattered Mind' },
  { key: 'builders_gap', name: "Builder's Gap" },
];

export default function AlfredEveningReview() {
  const [dayType, setDayType] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [honoredCount, setHonoredCount] = useState(0);
  const [drivers, setDrivers] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/New_York';
  const prompt = dayType ? PROMPTS[dayType] || PROMPTS.any : null;

  function toggleDriver(key: string) {
    const next = new Set(drivers);
    if (next.has(key)) next.delete(key); else next.add(key);
    setDrivers(next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!dayType || !prompt) { alert("Pick what today was first."); return; }
    setSaving(true);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { session } } = await supabase.auth.getSession();
    const portalBase = process.env.NEXT_PUBLIC_VAPI_PORTAL_BASE_URL || 'https://portal.alignedpower.coach';
    try {
      const r = await fetch(`${portalBase}/api/evening-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || ''}` },
        body: JSON.stringify({
          day_type: dayType,
          prompt_id: prompt.id,
          response: response.trim(),
          priorities_honored_count: honoredCount,
          drivers_echoed: Array.from(drivers),
          timezone: tz,
          source: 'alfred',
        }),
      });
      if (r.ok) setSaved(true);
    } catch {}
    setSaving(false);
  }

  if (saved) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-2xl border-2 border-[#FF6B1A] bg-[#FF6B1A]/5 p-6 text-center">
          <p className="font-serif text-2xl mb-2">Review closed.</p>
          <p className="text-muted-foreground mb-4">Tomorrow morning will be sharper because tonight was honest.</p>
          <div className="flex justify-center gap-3">
            <Link href="/chat" className="bg-[#FF6B1A] text-white px-5 py-2 rounded-lg font-semibold">Talk to Alfred</Link>
            <Link href="/dashboard" className="border-2 border-border px-5 py-2 rounded-lg font-semibold">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <p className="uppercase text-xs tracking-widest text-[#FF6B1A] font-semibold mb-1">Evening integrity review</p>
      <h1 className="font-serif text-4xl mb-2">How honest do you want to be with yourself tonight?</h1>
      <p className="text-muted-foreground mb-6">Sixty seconds. Process over outcome. Data, not a verdict.</p>

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <label className="block font-semibold mb-1">Today was</label>
          <p className="text-xs text-muted-foreground mb-4">Pick the shape that best fits.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {DAY_TYPES.map(d => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDayType(d.id)}
                className={`p-3 rounded-xl border-2 text-left ${dayType === d.id ? 'bg-primary text-white border-primary' : 'border-border'}`}
              >
                <div className="font-bold">{d.label}</div>
                <div className="text-xs opacity-70">{d.hint}</div>
              </button>
            ))}
          </div>
        </section>

        {prompt && (
          <section className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs uppercase tracking-widest text-[#FF6B1A] font-semibold mb-2">Tonight's prompt</p>
            <p className="font-serif text-lg mb-4">{prompt.text}</p>
            <textarea
              value={response}
              onChange={e => setResponse(e.target.value)}
              maxLength={2000}
              rows={4}
              className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-[#FF6B1A] focus:outline-none bg-background resize-y"
              placeholder="What comes first is probably right."
            />
          </section>
        )}

        <section className="rounded-2xl border border-border bg-card p-6">
          <label className="block font-semibold mb-1">Priorities honored today</label>
          <p className="text-xs text-muted-foreground mb-3">0 to 3. Be accurate, not dramatic.</p>
          <div className="flex gap-2">
            {[0,1,2,3].map(n => (
              <button key={n} type="button" onClick={() => setHonoredCount(n)} className={`w-12 h-12 rounded-full font-bold ${honoredCount === n ? 'bg-[#FF6B1A] text-white' : 'border-2 border-border'}`}>{n}</button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <label className="block font-semibold mb-1">Which driver had an opening?</label>
          <p className="text-xs text-muted-foreground mb-4">Optional. If one showed up, name it.</p>
          <div className="flex flex-wrap gap-2">
            {DRIVERS.map(d => (
              <button
                key={d.key}
                type="button"
                onClick={() => toggleDriver(d.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${drivers.has(d.key) ? 'bg-primary text-white border-primary' : 'border-border'}`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-[#FF6B1A] hover:bg-[#e55a0f] text-white font-semibold py-3 px-6 rounded-lg">
            {saving ? 'Closing…' : 'Close today'}
          </button>
          <Link href="/dashboard" className="border-2 border-border py-3 px-6 rounded-lg font-semibold">Not tonight</Link>
        </div>
      </form>
    </div>
  );
}
