"use client";

/**
 * Marketing-site mock of the authenticated ALFRED dashboard.
 * Layout and labels mirror the real app:
 * @see campaigns/aligned-ai-os/app/(dashboard)/dashboard/page.tsx
 * Data is illustrative only (no live API).
 */

import { useCallback, useEffect, useRef, useState } from "react";

type ExplorerStep = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  /** Region to ring-highlight in the faux device */
  focus:
    | "priorities"
    | "pattern"
    | "weekly"
    | "northstar"
    | "becoming"
    | "leverage";
};

const STEPS: ExplorerStep[] = [
  {
    id: "priorities",
    kicker: "Your baseline",
    title: "Priorities from your own words",
    body: "The assessment does not just score you. It lines up what you said matters with where you are actually investing attention, so every conversation starts from your truth, not a template.",
    focus: "priorities",
  },
  {
    id: "pattern",
    kicker: "Structure",
    title: "Archetype and pattern in the loop",
    body: "You get language for how you tend to overdrive, drift, or protect. The coach uses that shape so nudges feel specific instead of generic pep talk.",
    focus: "pattern",
  },
  {
    id: "weekly",
    kicker: "Rhythm",
    title: "A weekly check you can actually keep",
    body: "You score the week in straightforward terms, add a short reflection, and the coach tracks where you are steady and where you are slipping, in real time, without turning life into a spreadsheet.",
    focus: "weekly",
  },
  {
    id: "northstar",
    kicker: "What usually goes quiet",
    title: "Ends, values, and the world you are building",
    body: "The outcomes you actually want (not just the tactics), the lines you will not cross, and the future you are working toward stay in active memory instead of buried in a folder.",
    focus: "northstar",
  },
  {
    id: "becoming",
    kicker: "Identity",
    title: "Who you are becoming, not only what you are doing",
    body: "Personal, professional, and relational growth stay connected so urgency does not erase the person you are trying to grow into.",
    focus: "becoming",
  },
  {
    id: "leverage",
    kicker: "Execution",
    title: "Moves that carry the vision, plus one that changes everything",
    body: "The coach holds the business actions that keep the plan honest week to week, and the single commitment that, done well, makes the rest easier or unnecessary.",
    focus: "leverage",
  },
];

const INTERVAL_MS = 5500;

const SIX_C_LABELS = ["Clarity", "Coherence", "Capacity", "Confidence", "Courage", "Connection"] as const;

function focusClass(active: boolean, hoverable: boolean) {
  return [
    active
      ? "ring-2 ring-[var(--ap-accent)] ring-offset-2 ring-offset-[#0E1624] z-10 scale-[1.01] transition-all duration-500"
      : "opacity-[0.42] transition-all duration-500",
    hoverable ? "cursor-pointer lg:hover:opacity-100" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function AlfredFeatureExplorer() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const step = STEPS[index];

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTick();
    if (paused || reduceMotion) return;
    tickRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % STEPS.length);
    }, INTERVAL_MS);
    return clearTick;
  }, [paused, reduceMotion, clearTick]);

  const go = (dir: -1 | 1) => {
    setPaused(true);
    setIndex((i) => (i + dir + STEPS.length) % STEPS.length);
  };

  const jumpToFocus = (focus: ExplorerStep["focus"]) => {
    const i = STEPS.findIndex((s) => s.focus === focus);
    if (i >= 0) {
      setPaused(true);
      setIndex(i);
    }
  };

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] gap-10 lg:gap-14 items-center">
      <div className="order-2 lg:order-1 min-w-0">
        <p
          className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-2"
          aria-live="polite"
        >
          {step.kicker}
        </p>
        <h3 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary leading-tight mb-4">
          {step.title}
        </h3>
        <p className="text-ap-mid font-medium leading-relaxed text-base sm:text-lg mb-8">
          {step.body}
        </p>

        <div
          className="flex flex-wrap items-center gap-3 mb-6"
          role="group"
          aria-label="Tour controls"
        >
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="inline-flex items-center justify-center rounded-full border border-ap-border bg-white px-4 py-2 text-sm font-semibold text-ap-primary hover:border-ap-accent hover:text-gradient-accent transition-colors"
          >
            {paused || reduceMotion ? "Play tour" : "Pause"}
          </button>
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex items-center justify-center rounded-full border border-ap-border bg-white px-3 py-2 text-sm font-semibold text-ap-primary hover:border-ap-accent transition-colors"
            aria-label="Previous highlight"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex items-center justify-center rounded-full border border-ap-border bg-white px-3 py-2 text-sm font-semibold text-ap-primary hover:border-ap-accent transition-colors"
            aria-label="Next highlight"
          >
            →
          </button>
        </div>

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Feature highlights">
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              onClick={() => {
                setPaused(true);
                setIndex(i);
              }}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-ap-accent" : "w-2 bg-ap-border hover:bg-ap-muted"
              }`}
              aria-label={`Show: ${s.title}`}
            />
          ))}
        </div>
      </div>

      <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
        <div className="relative w-full max-w-[320px]">
          <div
            className="relative rounded-[2.5rem] border-[6px] border-[#151c2e] bg-[#151c2e] shadow-[0_25px_60px_-15px_rgba(14,22,36,0.45),0_0_0_1px_rgba(255,255,255,0.06)_inset] overflow-hidden"
            style={{ aspectRatio: "9 / 19" }}
          >
            {/* Match app shell: orange hairline + dark dashboard surface (#0E1624 brand navy) */}
            <div className="absolute inset-0 flex flex-col bg-[#0E1624]">
              <div className="h-1 shrink-0 bg-ap-accent" aria-hidden />
              <div className="h-9 shrink-0 flex items-center justify-between px-3 border-b border-white/[0.08]">
                <span className="text-[11px] font-semibold text-white/90 tracking-tight">Dashboard</span>
                <span className="h-1.5 w-10 rounded-full bg-white/15" aria-hidden />
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2.5 space-y-2.5">
                {/* Same order as aligned-ai-os dashboard: Vital Action first */}
                <div
                  role="presentation"
                  onMouseEnter={() => jumpToFocus("leverage")}
                  className={`rounded-2xl border-2 border-ap-accent/35 bg-ap-accent/[0.07] p-3 ${focusClass(step.focus === "leverage", true)}`}
                >
                  <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider mb-1">
                    This Week&apos;s Vital Action
                  </p>
                  <p className="text-[11px] text-white/90 font-medium leading-snug">
                    The one move that makes the rest of the week simpler.
                  </p>
                </div>

                <p className="text-[9px] font-medium text-white/45 uppercase tracking-wider px-0.5">
                  Your alignment at a glance
                </p>

                {/* VAPI + Focus Here First: both reflect “what you said matters” */}
                <div
                  role="presentation"
                  onMouseEnter={() => jumpToFocus("priorities")}
                  className={`space-y-2 ${focusClass(step.focus === "priorities", true)}`}
                >
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="h-2 w-2 rounded-full bg-ap-accent/80" aria-hidden />
                      <span className="text-[10px] font-medium text-white/50">VAPI Score</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-white font-serif tabular-nums">7.4</span>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-emerald-600 text-white mb-1">
                        Strong
                      </span>
                    </div>
                    <p className="text-[10px] text-white/55 mt-1 leading-snug">Sample archetype label</p>
                  </div>
                  <div className="rounded-2xl border border-red-500/35 bg-red-500/10 p-3 shadow-sm">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-red-400 text-[10px]" aria-hidden>
                        ▲
                      </span>
                      <span className="text-[9px] font-medium text-white/50 uppercase tracking-wider">
                        Focus Here First
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {["Domain A", "Domain B", "Domain C"].map((name, idx) => (
                        <div
                          key={name}
                          className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0E1624]/80 px-2 py-1.5"
                        >
                          <span className="text-[10px] text-white/70 flex-1 truncate">{name}</span>
                          <span className="text-[10px] font-bold tabular-nums text-amber-400">
                            {(4.2 + idx * 0.3).toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div
                  role="presentation"
                  onMouseEnter={() => jumpToFocus("weekly")}
                  className={`rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-sm ${focusClass(step.focus === "weekly", true)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-sm border border-ap-accent/60" aria-hidden />
                      <span className="text-[10px] font-medium text-white/50">6Cs Score</span>
                    </div>
                    <span className="text-[9px] text-white/40">Submitted</span>
                  </div>
                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-2xl font-bold tabular-nums text-emerald-400 font-serif">72%</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {SIX_C_LABELS.map((label, i) => {
                      const pct = [68, 74, 62, 70, 65, 78][i];
                      return (
                        <div
                          key={label}
                          className="flex flex-col items-center rounded-xl border border-white/10 bg-[#0E1624]/60 py-1.5 px-1"
                        >
                          <span className="text-[8px] font-semibold uppercase tracking-wide text-white/40 text-center leading-tight">
                            {label.slice(0, 3)}
                          </span>
                          <span className="text-sm font-bold tabular-nums text-white/90">{pct}%</span>
                          <div className="w-full h-1 rounded-full bg-white/10 mt-0.5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-ap-accent/90"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  role="presentation"
                  onMouseEnter={() => jumpToFocus("pattern")}
                  className={`rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-sm ${focusClass(step.focus === "pattern", true)}`}
                >
                  <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider mb-2">
                    Founder Archetype
                  </p>
                  <p className="text-sm font-serif font-bold text-white mb-1">Steward Builder</p>
                  <p className="text-[10px] text-white/55 italic leading-snug mb-3">
                    Short tagline that sounds like you, not a horoscope.
                  </p>
                  <div className="border-t border-white/10 pt-2 space-y-1">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-white/40">
                      Likely Driver
                    </p>
                    <p className="text-[11px] font-semibold text-white/90">Pattern name</p>
                    <p className="text-[10px] text-white/50 leading-snug">
                      One line the app uses to name the default story under stress.
                    </p>
                  </div>
                </div>

                <div
                  role="presentation"
                  onMouseEnter={() => jumpToFocus("northstar")}
                  className={`rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-sm ${focusClass(step.focus === "northstar", true)}`}
                >
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="h-2.5 w-2 border border-white/30 rounded-sm" aria-hidden />
                    <span className="text-[10px] font-medium text-white/50">Alignment Blueprint</span>
                  </div>
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    Mission, values, and the end states you said you want, kept in view for every chat.
                  </p>
                </div>

                <div
                  role="presentation"
                  onMouseEnter={() => jumpToFocus("becoming")}
                  className={`rounded-2xl border border-white/10 bg-white/[0.05] p-3 shadow-sm ${focusClass(step.focus === "becoming", true)}`}
                >
                  <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider mb-2">
                    Who you are becoming
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {["Personal", "Professional", "Relational"].map((label) => (
                      <span
                        key={label}
                        className="text-[9px] px-2 py-1 rounded-full bg-white/10 text-white/75 font-medium"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-ap-muted mt-4 max-w-[300px] mx-auto leading-relaxed">
            Mock dashboard modeled on the live ALFRED app layout (sample data). On desktop, hover a panel to jump the
            tour; use the controls on the left to pause or step.
          </p>
        </div>
      </div>
    </div>
  );
}
