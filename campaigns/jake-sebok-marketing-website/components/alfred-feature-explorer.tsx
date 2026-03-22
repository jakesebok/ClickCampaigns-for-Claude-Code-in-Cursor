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
 * - app/(dashboard)/assessment/results/page.tsx — results depth pattern
 * - app/(dashboard)/scorecard/page.tsx, priorities/page.tsx, blueprint/page.tsx — More menu screens
 *
 * Demo data (Vital Action text, 6Cs numbers, sample coach reply) is illustrative; UI strings match the app.
 */

import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import {
  Activity,
  BarChart3,
  BarChart2,
  BatteryCharging,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Crosshair,
  FileText,
  Ghost,
  DollarSign,
  Heart,
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

type AppTab =
  | "dashboard"
  | "coach"
  | "voice"
  | "results"
  | "drivers"
  | "scorecard"
  | "priorities"
  | "blueprint"
  | "archetypes"
  | "settings";
type CoachPhase = "home" | "category" | "thread";
type DriversPhase = "list" | "escapeDetail";
type TourFocus = "leverage" | "weekly" | "priorities" | "pattern";

const MORE_ROUTE_TABS: AppTab[] = ["scorecard", "priorities", "blueprint", "archetypes", "settings"];

function isMoreRouteTab(t: AppTab): boolean {
  return MORE_ROUTE_TABS.includes(t);
}

const DASHBOARD_TOUR = [
  {
    id: "leverage",
    kicker: "Your week",
    title: "One commitment, always in sight",
    body: "Your Vital Action is the non-negotiable you chose when the noise was quiet. Seeing it first cuts decision fatigue: you stop re-litigating the week every morning, protect time for what actually moves revenue and identity, and build calendar honesty before the week frays.",
    focus: "leverage" as const,
  },
  {
    id: "weekly",
    kicker: "Performance rhythm",
    title: "A weekly honest read you can act on",
    body: "The 6Cs scorecard is a fast integrity check on how you are actually operating—not a judgment wall. When you submit it on rhythm, you catch drift early, name the one category that is quietly stealing capacity, and give Alfred a truthful signal so your weekly review becomes execution coaching instead of spreadsheet shame.",
    focus: "weekly" as const,
  },
  {
    id: "priorities",
    kicker: "Ground truth",
    title: "Scores weighted by what you said matters",
    body: "Your composite VAPI read plus Focus Here First is the difference between guessing where you are strong and knowing where you are borrowing from the future. You get a ranked, importance-aware picture so you correct course mid-quarter—not after the year is gone.",
    focus: "priorities" as const,
  },
  {
    id: "pattern",
    kicker: "Self-awareness",
    title: "Archetype and driver: how you perform under stress",
    body: "Archetype and likely driver translate your assessment into a language for your patterns—so coaching is not generic advice. When Alfred references them, recommendations fit how you actually behave when pressure hits, and View Full Details opens the full library depth when you are ready to go there.",
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
  { label: "Connection", icon: Users, pct: 28 },
] as const;

/** Average of SIX_CS_DEMO pcts (matches app getOverallScore rounding). */
const OVERALL_6C = Math.round(
  SIX_CS_DEMO.reduce((sum, c) => sum + c.pct, 0) / SIX_CS_DEMO.length
);

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

  const goMoreDestination = (label: (typeof MORE_LINKS)[number]["label"] | "Settings") => {
    setMoreOpen(false);
    setPaused(true);
    if (label === "6Cs Scorecard") selectTab("scorecard");
    else if (label === "Priorities") selectTab("priorities");
    else if (label === "Blueprint") selectTab("blueprint");
    else if (label === "Assessment Results") selectTab("results");
    else if (label === "Archetype Library") selectTab("archetypes");
    else if (label === "Driver Library") {
      setTab("drivers");
      setDriversPhase("list");
    } else if (label === "Settings") selectTab("settings");
  };

  const leftTitleAndBody = () => {
    if (tab === "scorecard") {
      return {
        kicker: "6Cs scorecard",
        title: "A weekly operating rhythm, not a vibe check",
        body: "Structured prompts across Clarity through Connection turn subjective weeks into comparable data. Over time you see which dimension quietly erodes execution, catch the story you tell when you are overloaded, and give Alfred a clean signal for planning and accountability—without living in a spreadsheet.",
      };
    }
    if (tab === "priorities") {
      return {
        kicker: "Priorities",
        title: "Importance × score, not generic advice",
        body: "The matrix maps what you said matters against how you are actually performing. Critical Priority surfaces the leaks that will hurt you if ignored; Protect & Sustain guards what is already working; the other quadrants show where you may be over-investing or under-watching. It is the map for where to spend this month’s focus.",
      };
    }
    if (tab === "blueprint") {
      return {
        kicker: "Alignment Blueprint",
        title: "The context layer behind every answer",
        body: "North Star, values, Becoming, revenue math, Vital Action, and boundaries live in one living document. When you coach with Alfred, he is not guessing—he is reasoning from the same strategic clarity you committed to, so plans and pushes stay aligned with the life you said you want.",
      };
    }
    if (tab === "archetypes") {
      return {
        kicker: "Archetype library",
        title: "Nine founder patterns, same assessment spine",
        body: "Your archetype is a shorthand for how strength and shadow tend to show up across arenas. Browsing the library helps you decode tension faster, name what you are optimizing for, and have sharper conversations with Alfred about tradeoffs—before a blind spot becomes an expensive quarter.",
      };
    }
    if (tab === "settings") {
      return {
        kicker: "Settings",
        title: "Account, notifications, and preferences",
        body: "In the live app, this is where you tune how Alfred reaches you, manage account details, and adjust experience settings. The demo shows the same information architecture so you know what to expect when you onboard.",
      };
    }
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
          body: "These prompts are the same strings production sends—schedule building, leverage outcomes, ruthless cuts, and a minimum viable week when chaos hits. Use them to see how Alfred operationalizes your blueprint when the calendar gets loud.",
        };
      }
      return {
        kicker: "Coach tab",
        title: "Fire Starters from your real prompt library",
        body: "In this demo, only Weekly Planning is tappable so you can drill into sub-prompts and the long schedule example. The other categories are shown exactly as they appear in the app; open ALFRED to run Strategy, Inner Work, VAPI, and the rest with full streaming replies.",
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
        kicker: "Assessment results",
        title: "Depth you can act on—not a single number",
        body: "The full results surface mirrors /assessment/results: composite tier, archetype story, arena and domain breakdowns, interpretations, priority patterns, and driver tie-ins. It is the reference you return to when you are deciding what to fix first and what to protect.",
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
    <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] gap-10 lg:gap-14 xl:gap-16 items-center">
      <div className="order-2 lg:order-1 min-w-0 space-y-6 lg:py-4">
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
        <div className="relative w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[300px]">
          <div
            className="relative w-full rounded-[2.5rem] border-[6px] border-[#1a2332] bg-[#1a2332] shadow-[0_28px_70px_-18px_rgba(14,22,36,0.55),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
            style={{ aspectRatio: "9 / 19" }}
          >
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[2rem]">
              <div className="h-1 shrink-0 bg-ap-accent" aria-hidden />

              <div className="relative flex flex-1 min-h-0 flex-col bg-[#0E1624] text-white/90">
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
                      onSelectWeekly={() => {
                        setCoachCategory("Weekly Planning");
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
                  {tab === "results" && <ResultsDeepScreen />}
                  {tab === "drivers" && (
                    <DriversScreen
                      phase={driversPhase}
                      onOpenEscape={() => setDriversPhase("escapeDetail")}
                      onBackList={() => setDriversPhase("list")}
                    />
                  )}
                  {tab === "scorecard" && <ScorecardDemoScreen />}
                  {tab === "priorities" && <PrioritiesDemoScreen />}
                  {tab === "blueprint" && <BlueprintDemoScreen />}
                  {tab === "archetypes" && <ArchetypesDemoScreen />}
                  {tab === "settings" && <SettingsDemoScreen />}
                </div>

                {moreOpen && (
                  <div
                    className="absolute inset-0 z-20 flex flex-col justify-end bg-black/50"
                    onClick={() => setMoreOpen(false)}
                  >
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
                            className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-left text-sm font-medium hover:bg-white/5 text-white/90"
                            onClick={() => goMoreDestination(item.label)}
                          >
                            <item.icon className="h-5 w-5 text-ap-accent shrink-0" />
                            {item.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          className="flex w-full items-center justify-between px-3 py-3 mt-2 border-t border-white/10 text-sm text-white/80 hover:bg-white/5 rounded-xl"
                          onClick={() => goMoreDestination("Settings")}
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
                      moreOpen || isMoreRouteTab(tab)
                        ? "text-ap-accent"
                        : "text-white/45 hover:text-white/80"
                    }`}
                  >
                    <MoreHorizontal className="h-5 w-5" />
                    More
                  </button>
                </nav>
              </div>
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
  onSelectWeekly,
  onBackCategory,
  onBackFromThread,
  onPickPrompt,
}: {
  phase: CoachPhase;
  category: string | null;
  threadPrompt: (typeof WEEKLY_PLANNING_PROMPTS)[number] | null;
  onSelectWeekly: () => void;
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
              {FIRE_STARTER_CATEGORIES.map((cat) => {
                const isWeekly = cat === "Weekly Planning";
                if (isWeekly) {
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={onSelectWeekly}
                      className="w-full text-left px-3 py-2.5 rounded-xl border-2 border-ap-accent/50 bg-ap-accent/10 hover:bg-ap-accent/15 text-[11px] font-medium text-white transition-colors shadow-[0_0_0_1px_rgba(255,107,26,0.12)]"
                    >
                      <span className="block text-[9px] font-semibold uppercase tracking-wider text-ap-accent mb-1">
                        Try in demo
                      </span>
                      {cat}
                    </button>
                  );
                }
                return (
                  <div
                    key={cat}
                    className="w-full text-left px-3 py-2.5 rounded-xl border border-white/5 bg-white/[0.02] text-[11px] font-medium text-white/38 select-none"
                    title="Open ALFRED to explore this category in the full app."
                  >
                    {cat}
                  </div>
                );
              })}
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

const ARCHETYPE_LIBRARY_DEMO_TITLE = "The 9 Founder Archetypes";

function ResultsDeepScreen() {
  const arenaRow = [
    { label: "Personal", icon: BarChart2, score: "6.2", note: "Habits & health baseline" },
    { label: "Relationships", icon: Heart, score: "4.1", note: "Presence vs achievement tradeoff" },
    { label: "Business", icon: Briefcase, score: "7.8", note: "Execution engine strong" },
  ] as const;
  const domainSamples = [
    { code: "RS", name: "Relationships", score: "3.8", flag: "Focus Here First" },
    { code: "FA", name: "Family", score: "4.0", flag: "Focus Here First" },
    { code: "EX", name: "Execution", score: "8.1", flag: "Protect & sustain" },
    { code: "ME", name: "Mental / Emotional", score: "3.2", flag: "Critical priority" },
  ] as const;

  return (
    <div className="p-3 pb-6 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2 mb-1">
        <p className="text-[9px] font-medium text-ap-accent uppercase tracking-wider">Your Results</p>
        <h1 className="text-sm font-semibold text-white mt-1">Assessment results</h1>
        <p className="text-[9px] text-white/45 mt-0.5">Mirrors /assessment/results structure (condensed)</p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Composite VAPI</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold font-cormorant tabular-nums text-white">7.4</span>
          <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-amber-500 text-[#0E1624] mb-1">Functional</span>
        </div>
        <p className="text-[10px] text-white/55 leading-relaxed">
          You have some systems and predictability, but it is patchy. This is where leverage lives—tighten the machine
          before drift becomes a crisis.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Founder archetype</p>
        <div className="flex items-start gap-2">
          <Ghost className="h-5 w-5 shrink-0 mt-0.5" style={{ color: GHOST_ARCHETYPE_ACCENT }} />
          <div className="min-w-0">
            <h2 className="text-base font-cormorant font-bold text-white leading-tight">The Ghost</h2>
            <p className="text-[10px] italic text-white/55 mt-1">{GHOST_ARCHETYPE.tagline}</p>
            <p className="text-[10px] text-white/50 mt-2 leading-relaxed line-clamp-4">{GHOST_ARCHETYPE.description}</p>
            <p className="text-[10px] font-medium text-ap-accent mt-2">Explore archetype →</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Arena breakdown</p>
        <div className="grid grid-cols-3 gap-1.5">
          {arenaRow.map(({ label, icon: Icon, score, note }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-[#0E1624]/80 p-2">
              <Icon className="h-3.5 w-3.5 text-ap-accent mb-1" />
              <p className="text-[9px] font-semibold text-white/80">{label}</p>
              <p className="text-lg font-cormorant font-bold text-white tabular-nums">{score}</p>
              <p className="text-[8px] text-white/40 leading-snug mt-1">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Domains & interpretations</p>
        <div className="space-y-1.5">
          {domainSamples.map((d) => (
            <div
              key={d.code}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0E1624]/60 px-2 py-1.5"
            >
              <span className="text-[9px] font-mono text-white/35 w-6">{d.code}</span>
              <span className="text-[10px] text-white/80 flex-1 truncate">{d.name}</span>
              <span className="text-[10px] font-bold tabular-nums text-amber-200/90">{d.score}</span>
            </div>
          ))}
        </div>
        <p className="text-[9px] text-white/45 leading-relaxed">
          Each domain expands to the same interpretation blocks as production (strengths, watch-outs, coaching hooks).
        </p>
      </section>

      <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-red-300/90">Focus here first</p>
        <p className="text-[10px] text-white/75 leading-relaxed">
          Ranked leaks where importance outruns score—so you stop debating what to fix and start protecting what is
          already working.
        </p>
        <div className="space-y-1">
          <FocusRow icon={Users} name="Relationships" score={3.8} />
          <FocusRow icon={Activity} name="Family" score={4.0} />
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Priority matrix snapshot</p>
        <div className="grid grid-cols-2 gap-1.5 text-[8px]">
          <div className="rounded-lg border border-red-500/25 bg-red-500/10 p-2 text-white/80">
            <p className="font-semibold text-red-300">Critical</p>
            <p className="text-white/50 mt-1">2 domains</p>
          </div>
          <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-2 text-white/80">
            <p className="font-semibold text-emerald-300">Protect</p>
            <p className="text-white/50 mt-1">Execution, ops</p>
          </div>
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/10 p-2 text-white/80">
            <p className="font-semibold text-amber-200">Monitor</p>
            <p className="text-white/50 mt-1">Watch lightly</p>
          </div>
          <div className="rounded-lg border border-sky-500/20 bg-sky-500/10 p-2 text-white/80">
            <p className="font-semibold text-sky-300">Over-invest?</p>
            <p className="text-white/50 mt-1">Redirect energy</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-ap-accent/25 bg-ap-accent/10 p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Driver tie-in</p>
        <p className="text-[10px] text-white/80 leading-relaxed">
          Likely driver: <span className="font-semibold text-ap-accent">{ESCAPE_ARTIST_DRIVER.name}</span> — patterns
          from scoring feed the same driver narrative you will see in Coach and Library.
        </p>
      </section>

      <section className="rounded-2xl border border-dashed border-white/15 p-3">
        <p className="text-[9px] text-white/45 leading-relaxed">
          Full app adds comparative wheels, expandable archetype sections, lagging-arena callouts for Rising Architect,
          transition summaries, and deep links into Priorities and Blueprint from each block.
        </p>
        <p className="text-[10px] font-medium text-ap-accent mt-2">Explore My Score (wheel) →</p>
      </section>
    </div>
  );
}

function ScorecardDemoScreen() {
  const cats = [
    { label: "Clarity", icon: Crosshair, pct: 72, open: true },
    { label: "Coherence", icon: Link2, pct: 68, open: false },
    { label: "Capacity", icon: BatteryCharging, pct: 55, open: false },
  ] as const;
  return (
    <div className="p-3 pb-5 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2">
        <h1 className="text-sm font-semibold text-white">6Cs Scorecard</h1>
        <p className="text-[10px] text-white/45 mt-1">Weekly submission window · same categories as production</p>
      </header>
      <div className="rounded-xl border border-ap-accent/20 bg-ap-accent/10 px-2.5 py-2 text-[9px] text-white/80 leading-relaxed">
        Answer once per window. Reflection + “one thing” capture what actually happened—feeds Alfred and your review.
      </div>
      <div className="space-y-2">
        {cats.map(({ label, icon: Icon, pct, open }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
            <div className="flex items-center justify-between px-2.5 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <Icon className="h-3.5 w-3.5 text-ap-accent shrink-0" />
                <span className="text-[11px] font-semibold text-white truncate">{label}</span>
              </div>
              <span className="text-xs font-bold tabular-nums text-white">{pct}%</span>
            </div>
            {open && (
              <div className="border-t border-white/10 px-2.5 py-2 space-y-1.5 bg-[#0E1624]/80">
                <p className="text-[8px] text-white/40 uppercase tracking-wider">5 questions · 1–5 scale</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className={`flex-1 h-6 rounded-md border text-[9px] flex items-center justify-center ${
                        n === 4 ? "border-ap-accent bg-ap-accent/20 text-white" : "border-white/10 text-white/35"
                      }`}
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-dashed border-white/15 px-2.5 py-2 text-[9px] text-white/45">
        Submit locks the week; history builds trend lines Alfred uses in planning prompts.
      </div>
    </div>
  );
}

function PrioritiesDemoScreen() {
  const cells = [
    { title: "Critical", sub: "High importance · low score", tone: "border-red-500/30 bg-red-500/10 text-red-200" },
    { title: "Protect", sub: "High importance · high score", tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200" },
    { title: "Monitor", sub: "Lower priority watch list", tone: "border-amber-500/25 bg-amber-500/10 text-amber-100" },
    { title: "Over-invest?", sub: "Strong score · lower stated priority", tone: "border-sky-500/25 bg-sky-500/10 text-sky-200" },
  ] as const;
  return (
    <div className="p-3 pb-5 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2">
        <h1 className="text-sm font-semibold text-white">Priorities</h1>
        <p className="text-[10px] text-white/45 mt-1">Explore your priority matrix</p>
      </header>
      <div className="grid grid-cols-2 gap-1.5">
        {cells.map((c) => (
          <div key={c.title} className={`rounded-xl border p-2 ${c.tone}`}>
            <p className="text-[10px] font-bold">{c.title}</p>
            <p className="text-[8px] opacity-80 mt-1 leading-snug">{c.sub}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5 space-y-1.5">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Example row</p>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-ap-accent shrink-0" />
          <span className="text-[10px] text-white/80 flex-1">Physical Health</span>
          <span className="text-[9px] text-red-300 font-semibold">Critical</span>
        </div>
        <p className="text-[9px] text-white/45 leading-relaxed">
          Tap any domain in-app for the full interpretation block from DOMAIN_INTERPRETATIONS.
        </p>
      </div>
    </div>
  );
}

function BlueprintDemoScreen() {
  const sections = [
    { icon: Target, label: "North Star Stack" },
    { icon: Heart, label: "Core Values" },
    { icon: DollarSign, label: "Revenue + Operations" },
    { icon: Crosshair, label: "Vital Action (90 Days)" },
  ] as const;
  return (
    <div className="p-3 pb-5 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-sm font-semibold text-white">Alignment Blueprint</h1>
          <p className="text-[9px] text-white/45 mt-1">Version 3 · Updated Mar 18, 2026</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[8px] text-white/40">Context depth</p>
          <p className="text-[10px] font-bold text-ap-accent">78%</p>
        </div>
      </header>
      <div className="flex flex-wrap gap-1">
        {sections.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.05] px-2 py-1 text-[8px] text-white/70"
          >
            <Icon className="h-3 w-3 text-ap-accent" />
            {label}
          </span>
        ))}
      </div>
      <div className="rounded-xl border border-white/10 bg-[#0E1624]/80 p-2.5 space-y-2">
        <p className="text-[10px] font-semibold text-white">North Star Stack</p>
        <p className="text-[9px] text-white/55 leading-relaxed">
          Becoming: present CEO and partner · Real Reasons: time sovereignty, legacy with kids · Driving Fire: build the
          OS without sacrificing the marriage.
        </p>
        <p className="text-[9px] text-white/40 italic">Markdown sections match /blueprint rendering in production.</p>
      </div>
    </div>
  );
}

function ArchetypesDemoScreen() {
  const rows = [
    { name: "The Ghost", active: true },
    { name: "The Operator", active: false },
    { name: "The Visionary", active: false },
  ] as const;
  return (
    <div className="p-3 pb-5 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2">
        <p className="text-[9px] font-semibold text-ap-accent uppercase tracking-wider">Library</p>
        <h1 className="text-sm font-semibold text-white mt-1">{ARCHETYPE_LIBRARY_DEMO_TITLE}</h1>
        <p className="text-[10px] text-white/45 mt-1 leading-relaxed">
          Same archetype essays as /archetypes—browse patterns before you lock your story.
        </p>
      </header>
      <div className="space-y-1.5">
        {rows.map(({ name, active }) => (
          <div
            key={name}
            className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${
              active ? "border-ap-accent/40 bg-ap-accent/10" : "border-white/10 bg-white/[0.03]"
            }`}
          >
            <span className={`text-[11px] font-medium flex-1 min-w-0 ${active ? "text-white" : "text-white/50"}`}>
              {name}
            </span>
            {active ? <span className="text-[8px] font-bold uppercase text-ap-accent shrink-0">Yours</span> : null}
            <ChevronRight className="h-4 w-4 text-white/30 shrink-0" />
          </div>
        ))}
      </div>
      <p className="text-[9px] text-white/40 leading-relaxed">
        Full entries include strength, shadow, constraint, growth path, and program phase—mirroring archetypes-full.ts.
      </p>
    </div>
  );
}

function SettingsDemoScreen() {
  const rows = ["Account & profile", "Notifications", "Appearance / theme", "Privacy & data", "Sign out"] as const;
  return (
    <div className="p-3 pb-5 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2">
        <h1 className="text-sm font-semibold text-white">Settings</h1>
        <p className="text-[10px] text-white/45 mt-1">Account controls and preferences</p>
      </header>
      <div className="rounded-xl border border-white/10 divide-y divide-white/10 overflow-hidden">
        {rows.map((label) => (
          <div
            key={label}
            className="flex items-center justify-between px-2.5 py-2.5 text-[11px] text-white/80 bg-white/[0.02]"
          >
            <span>{label}</span>
            <ChevronRight className="h-4 w-4 text-white/25" />
          </div>
        ))}
      </div>
      <p className="text-[9px] text-white/40 leading-relaxed">
        Demo only—connects to live account screens inside ALFRED.
      </p>
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
