"use client";

/**
 * Interactive mock of authenticated ALFRED (Aligned Freedom Coach).
 *
 * Sources (campaigns/aligned-ai-os):
 * - app/(dashboard)/layout.tsx — mobile bottom nav, More menu pattern
 * - app/(dashboard)/dashboard/page.tsx — dashboard section order, 6Cs layout, VAPI, Focus Here First, archetype + driver
 * - app/(dashboard)/chat/page.tsx — header, welcome copy, Fire Starters from SUGGESTED_QUESTIONS
 * - lib/ai/prompts.ts — Weekly Planning prompt strings
 * - app/(dashboard)/drivers/page.tsx — Driver Library layout, primary driver banner, detail sections
 * - lib/vapi/drivers.ts, driver-library.ts, archetypes-full.ts, scoring.ts — copy in alfred-feature-explorer-data.ts
 * - app/(dashboard)/voice/page.tsx — idle voice marketing copy
 *
 * Demo data (Vital Action text, 6Cs numbers, sample coach reply) is illustrative; UI strings match the app.
 */

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import {
  Activity,
  BarChart3,
  BatteryCharging,
  Bell,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Crosshair,
  FileText,
  Ghost,
  LayoutDashboard,
  Leaf,
  Link2,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Settings,
  ShieldCheck,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  CHAT_SUBTITLE,
  DRIVER_LIBRARY_SUBTITLE,
  DRIVER_LIBRARY_TITLE,
  DRIVER_ORDER_PREVIEW,
  ESCAPE_ARTIST_ACCENT,
  ESCAPE_ARTIST_DRIVER,
  ESCAPE_ARTIST_LIBRARY,
  FIRE_STARTER_CATEGORIES,
  GHOST_ARCHETYPE,
  GHOST_ARCHETYPE_ACCENT,
  GHOST_ARCHETYPE_DESCRIPTION,
  SAMPLE_SCHEDULE_REPLY,
  WEEKLY_PLANNING_PROMPTS,
} from "./alfred-feature-explorer-data";

type AppTab = "dashboard" | "coach" | "voice" | "results" | "drivers";
type CoachPhase = "home" | "category" | "thread";
type DriversPhase = "list" | "escapeDetail";
type TourFocus = "leverage" | "weekly" | "priorities" | "pattern";

const DASHBOARD_TOUR = [
  {
    id: "leverage",
    kicker: "Execution",
    title: "Vital Action stays above the fold",
    body: "Same as the live app: your Vital Action is the first heavy card on the dashboard so the week has a spine before you scroll.",
    focus: "leverage" as const,
  },
  {
    id: "weekly",
    kicker: "Rhythm",
    title: "6Cs where you see it on mobile",
    body: "On a phone, your latest 6Cs card sits directly under Vital Action, with the same icons, labels, and color logic as production.",
    focus: "weekly" as const,
  },
  {
    id: "priorities",
    kicker: "Baseline",
    title: "VAPI + Focus Here First",
    body: "Under that, the dashboard surfaces your composite read and the domains that need attention first, pulled from your real assessment logic in the app.",
    focus: "priorities" as const,
  },
  {
    id: "pattern",
    kicker: "Structure",
    title: "Archetype + driver, then deeper",
    body: "Founder Archetype and Likely Driver use the same library copy as ALFRED. “View Full Details” is how users jump into the Driver Library in the product.",
    focus: "pattern" as const,
  },
];

const INTERVAL_MS = 5500;

const SIX_CS_DEMO = [
  { label: "Clarity", icon: Crosshair, pct: 84 },
  { label: "Coherence", icon: Link2, pct: 88 },
  { label: "Capacity", icon: BatteryCharging, pct: 68 },
  { label: "Confidence", icon: ShieldCheck, pct: 76 },
  { label: "Courage", icon: Zap, pct: 84 },
  { label: "Connection", icon: Users, pct: 32 },
] as const;

const OVERALL_6C = 77;

function scoreBarColor(pct: number): string {
  if (pct <= 30) return "#ef4444";
  if (pct <= 55) return "#f97316";
  if (pct <= 79) return "#eab308";
  return "#22c55e";
}

function focusClass(active: boolean, hoverable: boolean) {
  return [
    active
      ? "ring-2 ring-[var(--ap-accent)] ring-offset-2 ring-offset-[#0E1624] z-10 scale-[1.01] transition-all duration-500"
      : "opacity-[0.38] transition-all duration-500",
    hoverable ? "cursor-pointer lg:hover:opacity-100" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

function EscapeArtistGlyph({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      stroke={ESCAPE_ARTIST_ACCENT}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 14h24v36H16z" />
      <path d="M40 16l8 6v20l-8 6z" />
      <circle cx="31" cy="25" r="3" />
      <path d="M31 28l-3 7l7 5" />
      <path d="M28 35l-6 4" />
      <path d="M30 35l3 9" />
      <path d="M35 33l6 4" />
    </svg>
  );
}

const MORE_LINKS = [
  { label: "6Cs Scorecard", icon: ClipboardCheck },
  { label: "Priorities", icon: BarChart3 },
  { label: "Blueprint", icon: FileText },
  { label: "Assessment Results", icon: Activity },
  { label: "Archetype Library", icon: BookOpen },
  { label: "Driver Library", icon: Brain },
] as const;

export function AlfredFeatureExplorer() {
  const [tab, setTab] = useState<AppTab>("dashboard");
  const [coachPhase, setCoachPhase] = useState<CoachPhase>("home");
  const [coachCategory, setCoachCategory] = useState<string | null>(null);
  const [coachThreadPrompt, setCoachThreadPrompt] = useState<(typeof WEEKLY_PLANNING_PROMPTS)[number] | null>(null);
  const [driversPhase, setDriversPhase] = useState<DriversPhase>("list");
  const [moreOpen, setMoreOpen] = useState(false);

  const [tourIndex, setTourIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tourStep = DASHBOARD_TOUR[tourIndex];
  const tourFocus = tourStep.focus;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const clearTick = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTick();
    if (tab !== "dashboard" || paused || reduceMotion) return;
    tickRef.current = setInterval(() => {
      setTourIndex((i) => (i + 1) % DASHBOARD_TOUR.length);
    }, INTERVAL_MS);
    return clearTick;
  }, [tab, paused, reduceMotion, clearTick]);

  const goTour = (dir: -1 | 1) => {
    setPaused(true);
    setTourIndex((i) => (i + dir + DASHBOARD_TOUR.length) % DASHBOARD_TOUR.length);
  };

  const jumpTourFocus = (focus: TourFocus) => {
    const i = DASHBOARD_TOUR.findIndex((s) => s.focus === focus);
    if (i >= 0) {
      setPaused(true);
      setTourIndex(i);
    }
  };

  const openDriversToEscape = () => {
    setTab("drivers");
    setDriversPhase("escapeDetail");
    setPaused(true);
  };

  const selectTab = (next: AppTab) => {
    setTab(next);
    setMoreOpen(false);
    if (next === "coach") {
      setCoachPhase("home");
      setCoachCategory(null);
      setCoachThreadPrompt(null);
    }
    if (next === "drivers") {
      setDriversPhase("list");
    }
  };

  const leftTitleAndBody = () => {
    if (tab === "coach") {
      if (coachPhase === "thread" && coachThreadPrompt) {
        const isFullDemo = coachThreadPrompt.label === "Create weekly schedule";
        return {
          kicker: "Coach",
          title: isFullDemo ? "Prompt + full sample reply" : "Exact prompt string",
          body: isFullDemo
            ? `The orange bubble is the exact Weekly Planning prompt from lib/ai/prompts.ts. Alfred answers over streaming with your Alignment Blueprint, VAPI, 6Cs, Vital Action, and QC math loaded. The gray bubble is a written illustration of that kind of answer, not a live API response.`
            : `The orange bubble shows the real prompt sent for “${coachThreadPrompt.label}.” In production, Alfred responds with your context. This demo only expands the long sample for “Create weekly schedule.”`,
        };
      }
      if (coachPhase === "category" && coachCategory === "Weekly Planning") {
        return {
          kicker: "Fire Starters",
          title: "Weekly Planning",
          body: "These four buttons mirror the Weekly Planning category in the Coach tab. Each label maps to the prompt string defined in SUGGESTED_QUESTIONS inside the ALFRED codebase.",
        };
      }
      return {
        kicker: "Coach tab",
        title: "Same Fire Starters as production",
        body: "Categories and copy come straight from SUGGESTED_QUESTIONS in lib/ai/prompts.ts. Tap Weekly Planning to see the nested prompt list, then run the schedule builder to preview how Alfred weaves Vital Action, QC quota, and boundaries into a week.",
      };
    }
    if (tab === "voice") {
      return {
        kicker: "Voice",
        title: "Speak with Alfred",
        body: "Idle-state copy matches the Voice screen in the app: live session, inner-work friendly, mic disclaimer. Starting a session requires the real app and OpenAI Realtime credentials.",
      };
    }
    if (tab === "results") {
      return {
        kicker: "Results",
        title: "Assessment snapshot",
        body: "The Results tab in the bottom nav routes to /assessment/results in ALFRED. Here you see the same composite read pattern the dashboard links to before you open the full wheel and domains.",
      };
    }
    if (tab === "drivers") {
      if (driversPhase === "escapeDetail") {
        return {
          kicker: "Driver Library",
          title: "The Escape Artist (full profile)",
          body: "Every heading and paragraph inside the phone is copied from lib/vapi/drivers.ts and lib/vapi/driver-library.ts—the same blocks the Driver Library page renders for each pattern, including how it shows up in scores and the path out.",
        };
      }
      return {
        kicker: "Driver Library",
        title: "Primary driver → full write-up",
        body: "The banner language matches the mobile Driver Library index in the app. Tap The Escape Artist to open the same long-form sections users read on /drivers.",
      };
    }
    return {
      kicker: tourStep.kicker,
      title: tourStep.title,
      body: tourStep.body,
    };
  };

  const left = leftTitleAndBody();

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] gap-10 lg:gap-12 items-start">
      <div className="order-2 lg:order-1 min-w-0 space-y-6">
        <div>
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-2">
            {left.kicker}
          </p>
          <h3 className="font-outfit font-bold text-2xl sm:text-3xl text-ap-primary leading-tight mb-4">
            {left.title}
          </h3>
          <p className="text-ap-mid font-medium leading-relaxed text-base sm:text-lg">{left.body}</p>
        </div>

        {tab === "dashboard" && (
          <div
            className="flex flex-wrap items-center gap-3"
            role="group"
            aria-label="Dashboard tour controls"
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
              onClick={() => goTour(-1)}
              className="inline-flex items-center justify-center rounded-full border border-ap-border bg-white px-3 py-2 text-sm font-semibold text-ap-primary hover:border-ap-accent transition-colors"
              aria-label="Previous tour stop"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => goTour(1)}
              className="inline-flex items-center justify-center rounded-full border border-ap-border bg-white px-3 py-2 text-sm font-semibold text-ap-primary hover:border-ap-accent transition-colors"
              aria-label="Next tour stop"
            >
              →
            </button>
          </div>
        )}

        {tab === "dashboard" && (
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Dashboard highlights">
            {DASHBOARD_TOUR.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === tourIndex}
                onClick={() => {
                  setPaused(true);
                  setTourIndex(i);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === tourIndex ? "w-8 bg-ap-accent" : "w-2 bg-ap-border hover:bg-ap-muted"
                }`}
                aria-label={`Highlight: ${s.title}`}
              />
            ))}
          </div>
        )}

        {tab !== "dashboard" && (
          <p className="text-sm text-ap-muted font-medium">
            Tip: use the bottom navigation inside the phone to move between Dashboard, Coach, Voice, Results, and More.
          </p>
        )}
      </div>

      <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
        <div className="relative w-full max-w-[340px]">
          <div
            className="relative flex flex-col rounded-[2.5rem] border-[6px] border-[#151c2e] bg-[#151c2e] shadow-[0_25px_60px_-15px_rgba(14,22,36,0.45)] overflow-hidden"
            style={{ height: "min(72vh, 620px)", maxHeight: "620px" }}
          >
            <div className="h-1 shrink-0 bg-ap-accent" aria-hidden />

            <div className="flex-1 min-h-0 flex flex-col bg-[#0E1624] text-white/90">
              <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                {tab === "dashboard" && (
                  <DashboardScreen
                    tourFocus={tourFocus}
                    onJumpFocus={jumpTourFocus}
                    onViewDriverDetails={openDriversToEscape}
                  />
                )}
                {tab === "coach" && (
                  <CoachScreen
                    phase={coachPhase}
                    category={coachCategory}
                    threadPrompt={coachThreadPrompt}
                    onSelectCategory={(c) => {
                      setCoachCategory(c);
                      setCoachPhase("category");
                    }}
                    onBackCategory={() => {
                      setCoachPhase("home");
                      setCoachCategory(null);
                      setCoachThreadPrompt(null);
                    }}
                    onBackFromThread={() => {
                      setCoachPhase("category");
                      setCoachThreadPrompt(null);
                    }}
                    onPickPrompt={(p) => {
                      setCoachThreadPrompt(p);
                      setCoachPhase("thread");
                    }}
                  />
                )}
                {tab === "voice" && <VoiceIdleScreen />}
                {tab === "results" && <ResultsPreviewScreen />}
                {tab === "drivers" && (
                  <DriversScreen
                    phase={driversPhase}
                    onOpenEscape={() => setDriversPhase("escapeDetail")}
                    onBackList={() => setDriversPhase("list")}
                  />
                )}
              </div>

              {moreOpen && (
                <div className="absolute inset-0 z-20 flex flex-col justify-end bg-black/50" onClick={() => setMoreOpen(false)}>
                  <div
                    className="rounded-t-2xl border-t border-white/10 bg-[#121a28] max-h-[55%] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <span className="font-semibold text-sm">Menu</span>
                      <button
                        type="button"
                        className="p-2 rounded-lg text-white/60 hover:bg-white/10"
                        aria-label="Close menu"
                        onClick={() => setMoreOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <nav className="p-2">
                      {MORE_LINKS.map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-medium hover:bg-white/5"
                          onClick={() => setMoreOpen(false)}
                        >
                          <item.icon className="h-5 w-5 text-ap-accent shrink-0" />
                          {item.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-3 mt-2 border-t border-white/10 text-sm text-white/60"
                        onClick={() => setMoreOpen(false)}
                      >
                        <span>Settings</span>
                        <Settings className="h-4 w-4 text-ap-accent" />
                      </button>
                    </nav>
                  </div>
                </div>
              )}

              <nav className="shrink-0 border-t border-white/10 bg-[#121a28] flex justify-around items-center py-1.5 px-0.5">
                <NavPill
                  active={tab === "dashboard"}
                  icon={LayoutDashboard}
                  label="Dashboard"
                  onClick={() => selectTab("dashboard")}
                />
                <NavPill
                  active={tab === "coach"}
                  icon={MessageSquare}
                  label="Coach"
                  onClick={() => selectTab("coach")}
                />
                <NavPill active={tab === "voice"} icon={Mic} label="Voice" onClick={() => selectTab("voice")} />
                <NavPill
                  active={tab === "results"}
                  icon={Activity}
                  label="Results"
                  onClick={() => selectTab("results")}
                />
                <button
                  type="button"
                  onClick={() => {
                    setMoreOpen((o) => !o);
                  }}
                  className={`flex flex-col items-center gap-0.5 px-1.5 py-1 text-[10px] max-w-[64px] ${
                    moreOpen ? "text-ap-accent" : "text-white/45 hover:text-white/80"
                  }`}
                >
                  <MoreHorizontal className="h-5 w-5" />
                  More
                </button>
              </nav>
            </div>
          </div>

          <p className="text-center text-xs text-ap-muted mt-4 max-w-[320px] mx-auto leading-relaxed">
            Interactive demo of ALFRED UI. Copy and layout trace to{" "}
            <span className="text-ap-mid">campaigns/aligned-ai-os</span>. Coach reply is illustrative sample data.
          </p>
        </div>
      </div>
    </div>
  );
}

function NavPill({
  active,
  icon: Icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-1.5 py-1 text-[10px] max-w-[68px] ${
        active ? "text-ap-accent" : "text-white/45 hover:text-white/80"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="truncate w-full text-center leading-tight">{label}</span>
    </button>
  );
}

function DashboardScreen({
  tourFocus,
  onJumpFocus,
  onViewDriverDetails,
}: {
  tourFocus: TourFocus;
  onJumpFocus: (f: TourFocus) => void;
  onViewDriverDetails: () => void;
}) {
  const vapiTierColor = "#EAB308";
  const vapiTierLabel = "Functional";

  return (
    <div className="p-3 pb-4 space-y-3 text-left">
      <header className="flex items-center justify-between gap-2 px-1 pb-2 border-b border-white/10">
        <h1 className="text-sm font-semibold text-white">Dashboard</h1>
        <button
          type="button"
          className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Notifications"
          onMouseEnter={() => onJumpFocus("leverage")}
        >
          <Bell className="h-5 w-5" />
        </button>
      </header>

      <div
        role="presentation"
        onMouseEnter={() => onJumpFocus("leverage")}
        className={`rounded-2xl border-2 border-ap-accent/40 bg-ap-accent/[0.08] p-3 ${focusClass(tourFocus === "leverage", true)}`}
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-xl bg-ap-accent/15 flex items-center justify-center">
            <Target className="h-4 w-4 text-ap-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider mb-1">
              This Week&apos;s Vital Action
            </p>
            <p className="text-[12px] font-medium text-white leading-snug">
              Set and defend my focus work time blocks this week.
            </p>
          </div>
        </div>
      </div>

      <p className="text-[9px] font-medium text-white/45 uppercase tracking-wider px-0.5">
        Your alignment at a glance
      </p>

      <div
        role="presentation"
        onMouseEnter={() => onJumpFocus("weekly")}
        className={`rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-sm ${focusClass(tourFocus === "weekly", true)}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ClipboardCheck className="h-3.5 w-3.5 text-ap-accent" />
            <span className="text-[10px] font-medium text-white/50">6Cs Score</span>
          </div>
          <span className="text-[9px] text-white/40">Submitted</span>
        </div>
        <div className="flex items-end gap-2 mb-3">
          <span
            className="text-2xl font-bold tabular-nums font-cormorant leading-none"
            style={{ color: scoreBarColor(OVERALL_6C) }}
          >
            {OVERALL_6C}%
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {SIX_CS_DEMO.map(({ label, icon: Icon, pct }) => {
            const c = scoreBarColor(pct);
            return (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl border border-white/10 bg-[#0E1624]/80 py-2 px-1"
              >
                <Icon className="h-4 w-4 mb-1" style={{ color: c }} />
                <span className="text-[9px] font-semibold text-white/45 text-center leading-tight">{label}</span>
                <span className="text-sm font-bold tabular-nums" style={{ color: c }}>
                  {pct}%
                </span>
                <div className="w-full h-1 rounded-full bg-white/10 mt-1 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: c }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        role="presentation"
        onMouseEnter={() => onJumpFocus("priorities")}
        className={`space-y-2 ${focusClass(tourFocus === "priorities", true)}`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Activity className="h-3.5 w-3.5 text-ap-accent" />
            <span className="text-[10px] font-medium text-white/50">VAPI Score</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold font-cormorant tabular-nums text-white">7.4</span>
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded text-[#0E1624] mb-0.5"
              style={{ backgroundColor: vapiTierColor }}
            >
              {vapiTierLabel}
            </span>
          </div>
          <p className="text-[10px] text-white/55 mt-1 leading-snug">The Ghost</p>
          <p className="text-[10px] text-white/50 mt-2 leading-relaxed">{GHOST_ARCHETYPE_DESCRIPTION}</p>
          <p className="text-[10px] font-medium text-ap-accent mt-2">Explore My Score →</p>
        </div>

        <div className="rounded-2xl border border-red-500/35 bg-red-500/10 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-red-400 text-[10px]" aria-hidden>
              ▲
            </span>
            <span className="text-[9px] font-medium text-white/50 uppercase tracking-wider">Focus Here First</span>
          </div>
          <div className="space-y-1.5">
            <FocusRow icon={Activity} name="Physical Health" score={3.5} />
            <FocusRow icon={Users} name="Community" score={4.2} />
            <FocusRow icon={Leaf} name="Ecology" score={4.5} />
          </div>
        </div>
      </div>

      <div
        role="presentation"
        onMouseEnter={() => onJumpFocus("pattern")}
        className={`rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-3 ${focusClass(tourFocus === "pattern", true)}`}
      >
        <div>
          <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider mb-2">Founder Archetype</p>
          <h2 className="text-base font-cormorant font-bold text-white flex items-center gap-2">
            <Ghost className="h-4 w-4 shrink-0" style={{ color: GHOST_ARCHETYPE_ACCENT }} />
            The Ghost
          </h2>
          <p className="text-[10px] text-white/55 italic mt-1 leading-relaxed">{GHOST_ARCHETYPE.tagline}</p>
          <p className="text-[10px] text-white/50 mt-2 leading-relaxed">{GHOST_ARCHETYPE.description}</p>
        </div>
        <div className="border-t border-white/10 pt-3 space-y-2">
          <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-white/40">Likely Driver</p>
          <div className="flex items-center gap-2">
            <EscapeArtistGlyph size={18} />
            <span className="text-[11px] font-semibold text-white">{ESCAPE_ARTIST_DRIVER.name}</span>
          </div>
          <p className="text-[10px] text-white/55 leading-relaxed italic">{ESCAPE_ARTIST_DRIVER.tagline}</p>
          <p className="text-[10px] text-white/50 leading-relaxed">
            <span className="font-semibold text-white/70">Core fear:</span> {ESCAPE_ARTIST_DRIVER.coreFear}
          </p>
        </div>
        <button
          type="button"
          onClick={onViewDriverDetails}
          className="text-[10px] font-medium text-ap-accent w-full text-left hover:underline"
        >
          View Full Details →
        </button>
      </div>
    </div>
  );
}

function FocusRow({
  icon: Icon,
  name,
  score,
}: {
  icon: ComponentType<{ className?: string }>;
  name: string;
  score: number;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0E1624]/80 px-2 py-1.5">
      <Icon className="h-3.5 w-3.5 text-ap-accent shrink-0" />
      <span className="text-[10px] text-white/75 flex-1 truncate">{name}</span>
      <span className="text-[10px] font-bold tabular-nums text-amber-300">{score.toFixed(1)}</span>
    </div>
  );
}

function CoachScreen({
  phase,
  category,
  threadPrompt,
  onSelectCategory,
  onBackCategory,
  onBackFromThread,
  onPickPrompt,
}: {
  phase: CoachPhase;
  category: string | null;
  threadPrompt: (typeof WEEKLY_PLANNING_PROMPTS)[number] | null;
  onSelectCategory: (c: string) => void;
  onBackCategory: () => void;
  onBackFromThread: () => void;
  onPickPrompt: (p: (typeof WEEKLY_PLANNING_PROMPTS)[number]) => void;
}) {
  return (
    <div className="flex flex-col min-h-full text-left">
      <header className="flex items-start justify-between gap-2 px-3 py-3 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-white">ALFRED</h1>
          <p className="text-[11px] text-white/50 leading-snug">{CHAT_SUBTITLE}</p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            type="button"
            className="p-2 rounded-lg text-white/50 hover:bg-white/5"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>
          <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-white/45">
            <Mic className="h-3.5 w-3.5" />
            Voice
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {phase === "home" && (
          <>
            <div className="rounded-2xl px-3 py-2.5 bg-white/[0.06] border border-white/10">
              <p className="text-[11px] leading-relaxed text-white/90">
                Hi, I&apos;m <span className="font-semibold">ALFRED</span>, your Aligned Freedom Coach. What would you
                like to work on today?
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {FIRE_STARTER_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onSelectCategory(cat)}
                  className="w-full text-left px-3 py-2.5 rounded-xl border border-white/10 hover:border-ap-accent/40 hover:bg-ap-accent/10 text-[11px] font-medium text-white/90 transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </>
        )}

        {phase === "category" && category === "Weekly Planning" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onBackCategory}
              className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="text-sm font-semibold text-white">Weekly Planning</h2>
            <div className="space-y-2">
              {WEEKLY_PLANNING_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onPickPrompt(p)}
                  className="w-full text-left px-3 py-2.5 rounded-xl border border-white/10 hover:border-ap-accent/40 hover:bg-ap-accent/10 text-[11px] text-white/85 transition-colors"
                >
                  {p.label}
                </button>
              ))}
              <div className="w-full text-left px-3 py-2.5 rounded-xl border border-dashed border-white/15 text-[11px] text-white/45 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Something else
              </div>
            </div>
          </div>
        )}

        {phase === "category" && category && category !== "Weekly Planning" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onBackCategory}
              className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="text-sm font-semibold text-white">{category}</h2>
            <p className="text-[11px] text-white/50 leading-relaxed">
              In the app, this category expands to its Fire Starter list from{" "}
              <span className="text-white/70">lib/ai/prompts.ts</span>. For this demo, open{" "}
              <span className="text-ap-accent">Weekly Planning</span> to see the full drill-down and a sample reply.
            </p>
          </div>
        )}

        {phase === "thread" && threadPrompt && (
          <div className="space-y-3 pb-4">
            <button
              type="button"
              onClick={onBackFromThread}
              className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex justify-end">
              <div className="max-w-[92%] rounded-2xl px-3 py-2 bg-ap-accent text-white text-[11px] leading-relaxed">
                {threadPrompt.prompt}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[95%] rounded-2xl px-3 py-2.5 bg-white/[0.06] border border-white/10 text-[10px] text-white/80 leading-relaxed space-y-2 whitespace-pre-wrap">
                {threadPrompt.label === "Create weekly schedule" ? (
                  SAMPLE_SCHEDULE_REPLY
                ) : (
                  <>
                    <p>
                      In the live app, Alfred streams an answer that pulls from your Alignment Blueprint (Real Reasons,
                      Driving Fire, values, Becoming), your Vital Action, weekly QC quota, revenue bridge, and the
                      boundaries you have on family time—exactly the way the system prompt in{" "}
                      <span className="text-white/90">lib/ai/prompts.ts</span> describes.
                    </p>
                    <p>
                      This short demo only includes the long-form written example for{" "}
                      <span className="text-ap-accent">Create weekly schedule</span>. Tap Back, choose that prompt, and
                      you will see a full illustration of the personalized planning voice.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-3 shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 rounded-xl border border-white/10 bg-[#0E1624] px-3 py-2 text-[10px] text-white/35">
            Ask your coach anything...
          </div>
          <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-white/40">
            <ChevronRight className="h-4 w-4 -rotate-45" />
          </div>
        </div>
      </div>
    </div>
  );
}

function VoiceIdleScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] px-4 py-8 text-center bg-[#0c0a09]">
      <div className="w-16 h-16 rounded-full bg-ap-accent/15 flex items-center justify-center mb-4">
        <Mic className="h-8 w-8 text-ap-accent" />
      </div>
      <h2 className="text-lg font-cormorant font-bold text-white mb-2">Speak With Your Coach</h2>
      <p className="text-[10px] text-white/50 leading-relaxed mb-4">
        A live voice conversation with Alfred. Ideal for inner work, belief shifts, and NLP exercises — close your eyes,
        speak freely, and let the process unfold.
      </p>
      <div className="w-full text-left rounded-xl border border-white/10 p-3 mb-4">
        <h3 className="text-[10px] font-medium text-white/70 mb-1.5">Best for:</h3>
        <ul className="space-y-1 text-[9px] text-white/45">
          <li>• Submodality shifts and belief change work</li>
          <li>• Parts negotiation and Six-Step Reframing</li>
          <li>• Anchoring and state management</li>
          <li>• Timeline and re-imprint processes</li>
          <li>• Any time you need to think out loud</li>
        </ul>
      </div>
      <div className="w-full py-3 rounded-xl bg-ap-accent text-white text-xs font-medium">Start Voice Session</div>
      <p className="text-[8px] text-white/25 mt-3 leading-relaxed">
        Uses your microphone. Voice sessions use OpenAI Realtime for natural conversation. Your Alignment Blueprints,
        VAPI scores, and 6Cs data are loaded automatically.
      </p>
    </div>
  );
}

function ResultsPreviewScreen() {
  return (
    <div className="p-4 space-y-4">
      <p className="text-[9px] font-medium text-ap-accent uppercase tracking-wider">Your Results</p>
      <h2 className="text-lg font-cormorant font-bold text-white">Your VAPI™ Scores</h2>
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
        <p className="text-[10px] text-white/55 mb-2">Latest snapshot</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold font-cormorant text-white">7.4</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500 text-[#0E1624] font-semibold mb-1">Functional</span>
        </div>
        <p className="text-[10px] text-white/50 mt-2">The Ghost · Tap through arenas and domains in the full app.</p>
        <p className="text-[10px] font-medium text-ap-accent mt-3">Open full results →</p>
      </div>
    </div>
  );
}

function DriversScreen({
  phase,
  onOpenEscape,
  onBackList,
}: {
  phase: DriversPhase;
  onOpenEscape: () => void;
  onBackList: () => void;
}) {
  if (phase === "list") {
    return (
      <div className="p-3 pb-4 space-y-4">
        <header className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
          <h1 className="text-sm font-semibold text-white">Driver Library</h1>
          <button type="button" className="p-2 rounded-lg text-white/50 hover:bg-white/5" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
        </header>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-ap-accent">Driver Library</p>
          <h2 className="text-lg font-cormorant font-bold text-white mt-1 leading-tight">{DRIVER_LIBRARY_TITLE}</h2>
          <p className="text-[10px] text-white/50 mt-2 leading-relaxed">{DRIVER_LIBRARY_SUBTITLE}</p>
        </div>
        <div className="rounded-2xl border border-ap-accent/25 bg-ap-accent/10 px-3 py-3 text-[10px] text-white/90 leading-relaxed">
          Your primary driver:{" "}
          <button type="button" className="font-semibold text-ap-accent hover:underline" onClick={onOpenEscape}>
            {ESCAPE_ARTIST_DRIVER.name}
          </button>
          . Your secondary driver: None identified.
        </div>
        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-3 py-2 border-b border-white/10 bg-gradient-to-r from-ap-accent/10 to-transparent">
            <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Explore</p>
            <p className="text-sm font-cormorant font-bold text-white">Pick a pattern</p>
            <p className="text-[9px] text-white/45 mt-0.5">Full profiles open one at a time—use back to browse the rest.</p>
          </div>
          <p className="px-3 py-2 text-[8px] font-semibold uppercase tracking-wider text-white/45">Dysfunction patterns</p>
          <button
            type="button"
            onClick={onOpenEscape}
            className="flex w-full items-start gap-3 border-t border-white/10 bg-white/[0.03] p-3 text-left hover:bg-white/[0.06]"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: `${ESCAPE_ARTIST_ACCENT}14`,
                borderColor: `${ESCAPE_ARTIST_ACCENT}40`,
              }}
            >
              <EscapeArtistGlyph size={26} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-semibold text-white leading-snug">{ESCAPE_ARTIST_DRIVER.name}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-white/40" />
              </div>
              <p className="text-[9px] italic text-white/45 mt-1 line-clamp-2">{ESCAPE_ARTIST_DRIVER.tagline}</p>
              <span
                className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide"
                style={{ backgroundColor: `${ESCAPE_ARTIST_ACCENT}22`, color: ESCAPE_ARTIST_ACCENT }}
              >
                Primary
              </span>
            </div>
          </button>
          {DRIVER_ORDER_PREVIEW.map((name) => (
            <div
              key={name}
              className="flex w-full items-center gap-3 border-t border-white/10 bg-[#0E1624]/80 p-3 opacity-50"
            >
              <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0" />
              <span className="text-[10px] text-white/50">{name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 pb-6 space-y-4 text-left">
      <button
        type="button"
        onClick={onBackList}
        className="flex items-center gap-1 text-[11px] font-semibold text-white/80 hover:text-white sticky top-0 bg-[#0E1624] py-2 z-10"
      >
        <ChevronLeft className="h-4 w-4" />
        All patterns
      </button>

      <div className="flex gap-3 items-start">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border"
          style={{
            backgroundColor: `${ESCAPE_ARTIST_ACCENT}14`,
            borderColor: `${ESCAPE_ARTIST_ACCENT}33`,
          }}
        >
          <EscapeArtistGlyph size={32} />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-cormorant font-bold text-white leading-tight">{ESCAPE_ARTIST_DRIVER.name}</h2>
          <blockquote className="text-sm font-cormorant italic text-white/90 mt-2 leading-snug">
            &quot;{ESCAPE_ARTIST_DRIVER.coreBelief}&quot;
          </blockquote>
          <p className="text-[10px] text-white/55 mt-2">
            <span className="font-semibold text-white/80">Core fear:</span> {ESCAPE_ARTIST_DRIVER.coreFear}
          </p>
          <p className="text-[10px] italic text-white/45 mt-1">{ESCAPE_ARTIST_DRIVER.tagline}</p>
        </div>
      </div>

      <div
        className="rounded-xl border px-3 py-2 text-[10px] font-semibold"
        style={{
          backgroundColor: `${ESCAPE_ARTIST_ACCENT}16`,
          borderColor: `${ESCAPE_ARTIST_ACCENT}33`,
          color: ESCAPE_ARTIST_ACCENT,
        }}
      >
        This is your primary driver pattern.
      </div>

      <SectionBlock title="The Pattern" body={ESCAPE_ARTIST_DRIVER.description} />
      <SectionBlock title="How This Shows Up in Your Scores" body={ESCAPE_ARTIST_DRIVER.mechanism} />
      <SectionBlock title="What This Is Costing You" body={ESCAPE_ARTIST_DRIVER.whatItCosts} />
      <SectionBlock title="The Way Out" body={ESCAPE_ARTIST_DRIVER.theWayOut} />

      <div
        className="rounded-xl border px-3 py-3"
        style={{
          backgroundColor: `${ESCAPE_ARTIST_ACCENT}10`,
          borderColor: `${ESCAPE_ARTIST_ACCENT}24`,
        }}
      >
        <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/45">Where this gets addressed</p>
        <p className="text-[10px] text-white/85 mt-1.5 leading-relaxed">{ESCAPE_ARTIST_DRIVER.programPhase}</p>
      </div>

      <BulletSection title="How to Know If This Is You" items={ESCAPE_ARTIST_LIBRARY.howToKnowThisIsYou} filled />
      <BulletSection title="How to Know If This Isn't You" items={ESCAPE_ARTIST_LIBRARY.howToKnowThisIsntYou} filled={false} />

      <div className="space-y-2">
        <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">Reflection Prompts</h3>
        <p className="text-[10px] text-white/45 leading-relaxed">
          If this pattern resonates, sit with these questions. Don&apos;t rush. Write your answers somewhere private.
        </p>
        <ol className="space-y-2 text-[10px] text-white/55 leading-relaxed">
          {ESCAPE_ARTIST_LIBRARY.reflectionPrompts.map((prompt, index) => (
            <li key={index} className="flex gap-2">
              <span className="font-semibold text-white/80 shrink-0">{index + 1}.</span>
              <span>{prompt}</span>
            </li>
          ))}
        </ol>
      </div>

      <SectionBlock title="How This Relates to Other Patterns" body={ESCAPE_ARTIST_LIBRARY.relationshipToOtherDrivers} />
    </div>
  );
}

function SectionBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{title}</h3>
      <p className="text-[10px] text-white/55 leading-relaxed">{body}</p>
    </div>
  );
}

function BulletSection({
  title,
  items,
  filled,
}: {
  title: string;
  items: readonly string[];
  filled: boolean;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">{title}</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.slice(0, 40)} className="flex gap-2 text-[10px] text-white/55 leading-relaxed">
            <span
              className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${filled ? "bg-ap-accent" : "bg-white/20"}`}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
