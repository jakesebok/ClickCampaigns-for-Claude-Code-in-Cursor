/**
 * Alfred — Morning Alignment Check-in (mirrors VAPI portal's /morning-checkin).
 * Writes to the shared Supabase table `vapi_morning_checkins` with source='alfred'.
 * Bi-directional: the same row is visible in VAPI portal's longitudinal + Jake's coach dashboard.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const DOMAINS = [
  { code: 'PH', name: 'Physical Health' },
  { code: 'IA', name: 'Inner Alignment' },
  { code: 'ME', name: 'Mental & Emotional' },
  { code: 'AF', name: 'Attention & Focus' },
  { code: 'RS', name: 'Relationship to Self' },
  { code: 'FA', name: 'Family' },
  { code: 'CO', name: 'Community' },
  { code: 'WI', name: 'World & Impact' },
  { code: 'VS', name: 'Vision & Strategy' },
  { code: 'EX', name: 'Execution' },
  { code: 'OH', name: 'Operational Health' },
  { code: 'EC', name: 'Ecology' },
];

type Priority = { text: string; domain_code: string | null };

export default function AlfredMorningCheckin() {
  const [priorities, setPriorities] = useState<Priority[]>([
    { text: '', domain_code: null }, { text: '', domain_code: null }, { text: '', domain_code: null },
  ]);
  const [honored, setHonored] = useState<string | null>(null);
  const [intention, setIntention] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [flag, setFlag] = useState<string | null>(null);

  const tz = typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/New_York';

  function addPriority() {
    if (priorities.length >= 5) return;
    setPriorities([...priorities, { text: '', domain_code: null }]);
  }
  function updatePriority(idx: number, field: keyof Priority, value: string | null) {
    const next = [...priorities];
    (next[idx] as any)[field] = value;
    setPriorities(next);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: { session } } = await supabase.auth.getSession();

    // Call VAPI portal's API to write bi-directionally
    const portalBase = process.env.NEXT_PUBLIC_VAPI_PORTAL_BASE_URL || 'https://portal.alignedpower.coach';
    const body = {
      priorities: priorities.filter(p => p.text.trim()),
      honored_domain: honored,
      alignment_intention: intention.trim(),
      timezone: tz,
      source: 'alfred',
    };
    try {
      const r = await fetch(`${portalBase}/api/morning-checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || ''}` },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        setSaved(true);
        // Fetch presence banner for today
        const pr = await fetch(`${portalBase}/api/presence-today`, { headers: { Authorization: `Bearer ${session?.access_token || ''}` } });
        if (pr.ok) {
          const pd = await pr.json();
          const banner = (pd.banners || []).find((b: any) => b.trigger_id === 'V-01' || b.trigger_id === 'V-04');
          if (banner) setFlag((banner.payload && banner.payload.copy) || 'Watch for your driver today.');
        }
      }
    } catch {}
    setSaving(false);
  }

  if (saved) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="rounded-2xl border-2 border-[#FF6B1A] bg-[#FF6B1A]/5 p-6">
          <p className="font-serif text-2xl mb-2">Check-in saved.</p>
          <p className="text-muted-foreground mb-4">Your day just got a spine. Alfred sees this now.</p>
          {flag && (
            <div className="mt-4 p-4 rounded-xl bg-background border border-border">
              <p className="text-[#FF6B1A] text-xs uppercase tracking-wider font-bold mb-1">Pattern preview</p>
              <p>{flag}</p>
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <Link href="/chat" className="inline-flex items-center gap-2 bg-[#FF6B1A] text-white px-5 py-2 rounded-lg font-semibold">Talk to Alfred</Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 border-2 border-border px-5 py-2 rounded-lg font-semibold">Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <p className="uppercase text-xs tracking-widest text-[#FF6B1A] font-semibold mb-1">Morning alignment</p>
      <h1 className="font-serif text-4xl mb-2">What's the shape of today?</h1>
      <p className="text-muted-foreground mb-6">Forty-five seconds. Three honest answers. The rest of your day gets sharper.</p>

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-2xl border border-border bg-card p-6">
          <label className="block font-semibold mb-1">Today, my top priorities are</label>
          <p className="text-xs text-muted-foreground mb-4">One to five. Tag each with a domain.</p>
          <div className="space-y-4">
            {priorities.map((p, i) => (
              <div key={i} className="space-y-2">
                <input
                  type="text"
                  value={p.text}
                  onChange={e => updatePriority(i, 'text', e.target.value)}
                  placeholder={`Priority ${i + 1}`}
                  className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-[#FF6B1A] focus:outline-none bg-background"
                  maxLength={200}
                />
                <div className="flex flex-wrap gap-1">
                  {DOMAINS.map(d => (
                    <button
                      key={d.code}
                      type="button"
                      onClick={() => updatePriority(i, 'domain_code', d.code)}
                      className={`px-2 py-1 rounded-md text-xs font-semibold border ${p.domain_code === d.code ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground'}`}
                      title={d.name}
                    >
                      {d.code}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={addPriority} className="mt-3 text-sm font-semibold text-[#FF6B1A]">+ Add another</button>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <label className="block font-semibold mb-1">The domain I'm honoring today is</label>
          <p className="text-xs text-muted-foreground mb-4">Pick one. The others can wait.</p>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map(d => (
              <button
                key={d.code}
                type="button"
                onClick={() => setHonored(d.code)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${honored === d.code ? 'bg-[#FF6B1A] text-white border-[#FF6B1A]' : 'border-border'}`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <label className="block font-semibold mb-1" htmlFor="intention">Today I'd feel aligned if</label>
          <p className="text-xs text-muted-foreground mb-4">One line. Whatever comes first is probably right.</p>
          <input
            id="intention"
            type="text"
            value={intention}
            onChange={e => setIntention(e.target.value)}
            maxLength={280}
            className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-[#FF6B1A] focus:outline-none bg-background"
            placeholder="e.g. I close the loop on the proposal I've been avoiding."
          />
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="bg-[#FF6B1A] hover:bg-[#e55a0f] text-white font-semibold py-3 px-6 rounded-lg">
            {saving ? 'Saving…' : 'Save morning check-in'}
          </button>
          <Link href="/dashboard" className="border-2 border-border py-3 px-6 rounded-lg font-semibold">Maybe later</Link>
        </div>
      </form>
    </div>
  );
}
