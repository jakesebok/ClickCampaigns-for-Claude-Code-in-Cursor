"use client";

/**
 * Interactive mock of authenticated ALFRED (Aligned Freedom Coach).
 *
 * Sources (campaigns/aligned-ai-os):
 * - app/(dashboard)/layout.tsx — mobile bottom nav, More menu pattern
 * - app/(dashboard)/dashboard/page.tsx — dashboard section order, 6Cs layout, VAPI, Focus Here First, archetype + driver
 * - app/(dashboard)/chat/page.tsx — header, welcome copy, Fire Starters, textarea + Send, streaming assistant + Loader2
 * - lib/ai/prompts.ts — Weekly Planning prompt strings
 * - app/(dashboard)/drivers/page.tsx — Driver Library layout, primary driver banner, detail sections
 * - lib/vapi/drivers.ts, driver-library.ts, archetypes-full.ts, scoring.ts — copy in alfred-feature-explorer-data.ts
 * - app/(dashboard)/voice/page.tsx — idle voice marketing copy
 * - app/(dashboard)/assessment/results/page.tsx — results depth pattern
 * - app/(dashboard)/scorecard/page.tsx, priorities/page.tsx, blueprint/page.tsx — More menu screens
 *
 * Demo data (Vital Action text, 6Cs numbers, sample coach reply) is illustrative; UI strings match the app.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ComponentType } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  BarChart2,
  BatteryCharging,
  Bell,
  BookOpen,
  Brain,
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardCheck,
  Compass,
  Crosshair,
  Eye,
  FileText,
  Focus,
  Gauge,
  Ghost,
  DollarSign,
  Globe,
  Heart,
  Home,
  LayoutDashboard,
  Leaf,
  Link2,
  Loader2,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Rocket,
  Send,
  Settings,
  Shield,
  ShieldCheck,
  Target,
  Telescope,
  TrendingDown,
  Users,
  X,
  Zap,
} from "lucide-react";
import {
  ARCHETYPE_LIBRARY_ROWS_DEMO,
  ARCHETYPE_LIBRARY_SUBTITLE_DEMO,
  ASSESSMENT_DRIVER_SECTION_NOTE,
  CHAT_SUBTITLE,
  COACH_DEMO_INNER_THREAD_OPENER,
  COACH_DEMO_WEEKLY_THREAD_OPENER,
  DEMO_COMPOSITE_VAPI_SCORE,
  DEMO_FOCUS_HERE_FIRST_DOMAINS,
  DEMO_PRIORITY_MATRIX_BY_QUADRANT,
  DEMO_RESULTS_DOMAIN_SAMPLES,
  DRIVER_LIBRARY_ORDER_LIST,
  DRIVER_LIBRARY_SUBTITLE,
  DRIVER_LIBRARY_TITLE,
  WEEKLY_DEMO_CASUAL_USER_MESSAGE,
  WEEKLY_PLANNING_DEMO_TURNS,
  ESCAPE_ARTIST_ACCENT,
  ESCAPE_ARTIST_DRIVER,
  ESCAPE_ARTIST_LIBRARY,
  FIRE_STARTER_CATEGORIES,
  GHOST_ARCHETYPE,
  GHOST_ARCHETYPE_ACCENT,
  GHOST_ARCHETYPE_DESCRIPTION,
  INNER_WORK_BELIEFS_PROMPTS,
  INNER_WORK_DEMO_CASUAL_USER_MESSAGE,
  INNER_WORK_DEMO_LABEL,
  INNER_WORK_LIMITING_BELIEF_DEMO_TURNS,
  SAMPLE_SCHEDULE_REPLY,
  WEEKLY_PLANNING_DEMO_LABEL,
  WEEKLY_PLANNING_PROMPTS,
  demoVapiGetTier,
  demoVapiTierColor,
  type DemoPriorityQuadrant,
} from "./alfred-feature-explorer-data";

type CoachThreadPrompt =
  | null
  | { family: "weekly"; item: (typeof WEEKLY_PLANNING_PROMPTS)[number] }
  | { family: "inner"; item: (typeof INNER_WORK_BELIEFS_PROMPTS)[number] };

function isCoachFullDemoThread(p: NonNullable<CoachThreadPrompt>): boolean {
  return (
    (p.family === "weekly" && p.item.label === WEEKLY_PLANNING_DEMO_LABEL) ||
    (p.family === "inner" && p.item.label === INNER_WORK_DEMO_LABEL)
  );
}

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

/** Icons for `DEMO_FOCUS_HERE_FIRST_DOMAINS` (matches production DOMAIN_ICONS). */
const DEMO_FHF_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  PH: Activity,
  CO: Users,
  EC: Leaf,
};

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
    body: "Archetype and likely driver translate your assessment into a language for your patterns, so coaching is not generic advice. When Alfred references them, recommendations fit how you actually behave when pressure hits. When you want the deeper read, the Archetype and Driver libraries unpack those patterns: what is underneath, what it is costing you, and how to move forward.",
    focus: "pattern" as const,
  },
];

/** Weekly Planning thread stop in the full app tour (must match a WEEKLY_PLANNING_PROMPTS label). */
const TOUR_WEEKLY_THREAD_PROMPT =
  WEEKLY_PLANNING_PROMPTS.find((p) => p.label === WEEKLY_PLANNING_DEMO_LABEL) ?? WEEKLY_PLANNING_PROMPTS[0];

const TOUR_INNER_THREAD_PROMPT =
  INNER_WORK_BELIEFS_PROMPTS.find((p) => p.label === INNER_WORK_DEMO_LABEL) ?? INNER_WORK_BELIEFS_PROMPTS[0];

type AppTourStep =
  | { kind: "dashboard"; focus: TourFocus; dotLabel: string }
  | { kind: "coach_home"; dotLabel: string }
  | { kind: "coach_weekly"; dotLabel: string }
  | { kind: "coach_thread"; dotLabel: string }
  | { kind: "coach_inner"; dotLabel: string }
  | { kind: "coach_inner_thread"; dotLabel: string }
  | { kind: "voice"; dotLabel: string }
  | { kind: "results"; dotLabel: string }
  | { kind: "drivers_list"; dotLabel: string }
  | { kind: "drivers_detail"; dotLabel: string }
  | { kind: "more_tab"; tab: "scorecard" | "priorities" | "blueprint" | "archetypes" | "settings"; dotLabel: string };

const APP_TOUR_STEPS: AppTourStep[] = [
  ...DASHBOARD_TOUR.map(
    (s): AppTourStep => ({
      kind: "dashboard",
      focus: s.focus,
      dotLabel: s.title,
    })
  ),
  { kind: "coach_home", dotLabel: "Coach — Fire Starters" },
  { kind: "coach_weekly", dotLabel: "Coach — Weekly planning menu" },
  { kind: "coach_thread", dotLabel: "Coach — Weekly planning thread" },
  { kind: "coach_inner", dotLabel: "Coach — Inner Work menu" },
  { kind: "coach_inner_thread", dotLabel: "Coach — Limiting belief thread" },
  { kind: "voice", dotLabel: "Voice" },
  { kind: "results", dotLabel: "Assessment results" },
  { kind: "drivers_list", dotLabel: "Driver library" },
  { kind: "drivers_detail", dotLabel: "Driver — full profile" },
  { kind: "more_tab", tab: "scorecard", dotLabel: "6Cs scorecard" },
  { kind: "more_tab", tab: "priorities", dotLabel: "Priorities" },
  { kind: "more_tab", tab: "blueprint", dotLabel: "Alignment Blueprint" },
  { kind: "more_tab", tab: "archetypes", dotLabel: "Archetype library" },
  { kind: "more_tab", tab: "settings", dotLabel: "Settings" },
];

const APP_TOUR_STEP_COUNT = APP_TOUR_STEPS.length;

function firstTourIndexForNavTab(tab: AppTab): number {
  switch (tab) {
    case "dashboard":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "dashboard" && s.focus === "leverage");
    case "coach":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "coach_home");
    case "voice":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "voice");
    case "results":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "results");
    case "drivers":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "drivers_list");
    case "scorecard":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "more_tab" && s.tab === "scorecard");
    case "priorities":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "more_tab" && s.tab === "priorities");
    case "blueprint":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "more_tab" && s.tab === "blueprint");
    case "archetypes":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "more_tab" && s.tab === "archetypes");
    case "settings":
      return APP_TOUR_STEPS.findIndex((s) => s.kind === "more_tab" && s.tab === "settings");
    default:
      return 0;
  }
}

/** Default dwell on each tour stop when auto-advancing (ms). */
const TOUR_DEFAULT_DWELL_MS = 6000;
/** Longer dwell for Coach chat-thread demos so the scripted conversation can play. */
const TOUR_CHAT_THREAD_DWELL_MS = 22000;

function tourStepDwellMs(step: AppTourStep): number {
  if (step.kind === "coach_thread" || step.kind === "coach_inner_thread") return TOUR_CHAT_THREAD_DWELL_MS;
  return TOUR_DEFAULT_DWELL_MS;
}

/** Scroll *only* the phone body—never call scrollIntoView (it scrolls the whole page). */
function scrollPhoneForDashboardFocus(
  container: HTMLElement,
  target: HTMLElement,
  mode: "top" | "center",
  behavior: ScrollBehavior
) {
  const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
  if (mode === "top") {
    container.scrollTo({ top: 0, behavior });
    return;
  }
  const cRect = container.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  const targetTop = container.scrollTop + (tRect.top - cRect.top);
  const targetH = target.offsetHeight;
  const viewH = container.clientHeight;
  const centeredTop = targetTop - (viewH - targetH) / 2;
  const nextTop = Math.min(maxScroll, Math.max(0, centeredTop));
  container.scrollTo({ top: nextTop, behavior });
}

function dashboardFocusScrollMode(focus: TourFocus): "top" | "center" {
  if (focus === "leverage" || focus === "weekly") return "top";
  return "center";
}

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
      ? "ring-2 ring-[var(--ap-accent)] ring-offset-2 ring-offset-[#0E1624] z-10 scale-[1.01] transition-[opacity,transform,box-shadow] duration-500 ease-out"
      : "opacity-[0.38] transition-opacity duration-500 ease-out",
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

export type AlfredFeatureExplorerEmbed = "marketing" | "app-dark";

export function AlfredFeatureExplorer({ embed = "marketing" }: { embed?: AlfredFeatureExplorerEmbed } = {}) {
  const isAppDark = embed === "app-dark";
  const [tab, setTab] = useState<AppTab>("dashboard");
  const [coachPhase, setCoachPhase] = useState<CoachPhase>("home");
  const [coachCategory, setCoachCategory] = useState<string | null>(null);
  const [coachThreadPrompt, setCoachThreadPrompt] = useState<CoachThreadPrompt>(null);
  const [coachDemoReplayKey, setCoachDemoReplayKey] = useState(0);
  const [driversPhase, setDriversPhase] = useState<DriversPhase>("list");
  const [moreOpen, setMoreOpen] = useState(false);

  const [tourIndex, setTourIndex] = useState(0);
  const [dashboardFocus, setDashboardFocus] = useState<TourFocus>("leverage");
  const [paused, setPaused] = useState(false);
  const [phoneHover, setPhoneHover] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phoneScrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [sectionInView, setSectionInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setSectionInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        setSectionInView(entry.isIntersecting && entry.intersectionRatio >= 0.12);
      },
      { root: null, threshold: [0, 0.12, 0.15, 0.25, 0.5] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const clearTick = useCallback(() => {
    if (tickRef.current !== null) {
      clearTimeout(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  useEffect(() => {
    const step = APP_TOUR_STEPS[tourIndex];
    setMoreOpen(false);
    switch (step.kind) {
      case "dashboard":
        setTab("dashboard");
        setDashboardFocus(step.focus);
        setCoachPhase("home");
        setCoachCategory(null);
        setCoachThreadPrompt(null);
        setDriversPhase("list");
        break;
      case "coach_home":
        setTab("coach");
        setCoachPhase("home");
        setCoachCategory(null);
        setCoachThreadPrompt(null);
        setDriversPhase("list");
        break;
      case "coach_weekly":
        setTab("coach");
        setCoachPhase("category");
        setCoachCategory("Weekly Planning");
        setCoachThreadPrompt(null);
        setDriversPhase("list");
        break;
      case "coach_thread":
        setTab("coach");
        setCoachPhase("thread");
        setCoachCategory("Weekly Planning");
        setCoachThreadPrompt({ family: "weekly", item: TOUR_WEEKLY_THREAD_PROMPT });
        setCoachDemoReplayKey((k) => k + 1);
        setDriversPhase("list");
        break;
      case "coach_inner":
        setTab("coach");
        setCoachPhase("category");
        setCoachCategory("Inner Work + Beliefs");
        setCoachThreadPrompt(null);
        setDriversPhase("list");
        break;
      case "coach_inner_thread":
        setTab("coach");
        setCoachPhase("thread");
        setCoachCategory("Inner Work + Beliefs");
        setCoachThreadPrompt({ family: "inner", item: TOUR_INNER_THREAD_PROMPT });
        setCoachDemoReplayKey((k) => k + 1);
        setDriversPhase("list");
        break;
      case "voice":
        setTab("voice");
        setCoachPhase("home");
        setCoachCategory(null);
        setCoachThreadPrompt(null);
        setDriversPhase("list");
        break;
      case "results":
        setTab("results");
        setCoachPhase("home");
        setCoachCategory(null);
        setCoachThreadPrompt(null);
        setDriversPhase("list");
        break;
      case "drivers_list":
        setTab("drivers");
        setCoachPhase("home");
        setCoachCategory(null);
        setCoachThreadPrompt(null);
        setDriversPhase("list");
        break;
      case "drivers_detail":
        setTab("drivers");
        setCoachPhase("home");
        setCoachCategory(null);
        setCoachThreadPrompt(null);
        setDriversPhase("escapeDetail");
        break;
      case "more_tab":
        setTab(step.tab);
        setCoachPhase("home");
        setCoachCategory(null);
        setCoachThreadPrompt(null);
        setDriversPhase("list");
        break;
    }
  }, [tourIndex]);

  useEffect(() => {
    clearTick();
    if (paused || reduceMotion || phoneHover || !sectionInView) return;
    const step = APP_TOUR_STEPS[tourIndex];
    const ms = tourStepDwellMs(step);
    tickRef.current = setTimeout(() => {
      setTourIndex((i) => (i + 1) % APP_TOUR_STEP_COUNT);
    }, ms);
    return clearTick;
  }, [tourIndex, paused, reduceMotion, phoneHover, sectionInView, clearTick]);

  /** Non-dashboard tabs: smooth scroll to top inside the phone only. */
  useEffect(() => {
    const container = phoneScrollRef.current;
    if (!container || tab === "dashboard") return;
    container.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [tab, reduceMotion]);

  /** Dashboard: auto-scroll inside the phone only while the same conditions as the auto-tour timer (not when paused or hovering the phone). */
  useEffect(() => {
    if (tab !== "dashboard") return;
    if (paused || reduceMotion || phoneHover || !sectionInView) return;
    const container = phoneScrollRef.current;
    if (!container) return;
    const el = container.querySelector(`[data-tour-section="${dashboardFocus}"]`);
    if (!(el instanceof HTMLElement)) return;
    const behavior: ScrollBehavior = reduceMotion ? "auto" : "smooth";
    const mode = dashboardFocusScrollMode(dashboardFocus);
    const id = window.requestAnimationFrame(() => {
      scrollPhoneForDashboardFocus(container, el, mode, behavior);
    });
    return () => window.cancelAnimationFrame(id);
  }, [tab, dashboardFocus, reduceMotion, paused, phoneHover, sectionInView]);

  const goTour = (dir: -1 | 1) => {
    setPaused(true);
    setTourIndex((i) => (i + dir + APP_TOUR_STEP_COUNT) % APP_TOUR_STEP_COUNT);
  };

  const jumpTourFocus = (focus: TourFocus) => {
    const globalIndex = APP_TOUR_STEPS.findIndex((s) => s.kind === "dashboard" && s.focus === focus);
    if (globalIndex >= 0) {
      setPaused(true);
      setTourIndex(globalIndex);
    }
  };

  const openDriversToEscape = () => {
    const idx = APP_TOUR_STEPS.findIndex((s) => s.kind === "drivers_detail");
    setPaused(true);
    if (idx >= 0) setTourIndex(idx);
  };

  const selectTab = (next: AppTab) => {
    setPaused(true);
    setMoreOpen(false);
    const idx = firstTourIndexForNavTab(next);
    if (idx >= 0) setTourIndex(idx);
  };

  const goMoreDestination = (label: (typeof MORE_LINKS)[number]["label"] | "Settings") => {
    setMoreOpen(false);
    setPaused(true);
    if (label === "6Cs Scorecard") {
      const i = firstTourIndexForNavTab("scorecard");
      if (i >= 0) setTourIndex(i);
    } else if (label === "Priorities") {
      const i = firstTourIndexForNavTab("priorities");
      if (i >= 0) setTourIndex(i);
    } else if (label === "Blueprint") {
      const i = firstTourIndexForNavTab("blueprint");
      if (i >= 0) setTourIndex(i);
    } else if (label === "Assessment Results") {
      const i = firstTourIndexForNavTab("results");
      if (i >= 0) setTourIndex(i);
    } else if (label === "Archetype Library") {
      const i = firstTourIndexForNavTab("archetypes");
      if (i >= 0) setTourIndex(i);
    } else if (label === "Driver Library") {
      const i = firstTourIndexForNavTab("drivers");
      if (i >= 0) setTourIndex(i);
    } else if (label === "Settings") {
      const i = firstTourIndexForNavTab("settings");
      if (i >= 0) setTourIndex(i);
    }
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
        title: "You decide how Alfred shows up",
        body: "Account details, how and when Daily Sparks reach you, and experience preferences live in one place—no scavenger hunt through mystery menus. When you tune delivery, the product stays encouraging instead of noisy, which protects focus and trust during hard weeks. The deeper win is psychological: configuration feels like choosing a coaching relationship, not tolerating defaults that fight your rhythm.",
      };
    }
    if (tab === "coach") {
      if (coachPhase === "thread" && coachThreadPrompt) {
        const label = coachThreadPrompt.item.label;
        const isWeeklyScheduleDemo =
          coachThreadPrompt.family === "weekly" && label === WEEKLY_PLANNING_DEMO_LABEL;
        const isInnerLimitingBeliefDemo =
          coachThreadPrompt.family === "inner" && label === INNER_WORK_DEMO_LABEL;
        if (isWeeklyScheduleDemo) {
          return {
            kicker: "Coach",
            title: "Weekly Planning, with room to go deep",
            body: "Multi-bubble thread: opener, your casual line in the composer, then Alfred streams answers in separate bubbles—with deliberate pauses between turns so you can read before the next beat. The script is sample copy; in your account it is generated from your blueprint, Vital Action, QC math, and boundaries.",
          };
        }
        if (isInnerLimitingBeliefDemo) {
          return {
            kicker: "Coach",
            title: "Find the belief, then stress-test it against your Real Reasons",
            body: "The preview types like a real person would—messy, no jargon about frameworks—while Alfred still weaves in what you already put in your blueprint (presence at home, Vital Action, and what you said matters). Each turn is its own bubble with space to read before the next message. Live chat does the same from your actual data.",
          };
        }
        return {
          kicker: "Coach",
          title: "Coaching frames, not blank-chat roulette",
          body: `The frame you see is how Alfred opens “${label}”—a deliberate question instead of generic brainstorming. In the app, answers pull from your blueprint, scores, driver pattern, and commitments. This preview only expands into long written examples for “${WEEKLY_PLANNING_DEMO_LABEL}” and “${INNER_WORK_DEMO_LABEL}”; choose those prompts in the mock to see full illustrations.`,
        };
      }
      if (coachPhase === "category" && coachCategory === "Weekly Planning") {
        return {
          kicker: "Fire Starters",
          title: "Weekly Planning",
          body: "These starters walk you through building the schedule, naming leverage outcomes, making ruthless cuts, and sizing a minimum viable week when chaos hits—so the calendar stops being a wish list. They translate your Alignment Blueprint into concrete tradeoffs instead of leaving you to invent structure from scratch. You leave with a week you can defend and boundaries you can name out loud. Stack enough of those weeks and you stop losing quarters to quiet drift.",
        };
      }
      if (coachPhase === "category" && coachCategory === "Inner Work + Beliefs") {
        return {
          kicker: "Fire Starters",
          title: "Inner Work + Beliefs",
          body: "These prompts are for the layer strategy slides past: the belief underneath the frustration, the avoidance dressed up as productivity, shame masquerading as standards, and the hard conversation you keep rescheduling. Alfred threads them through your driver narrative and blueprint so you are not performing insight—you are negotiating with a pattern that has a name.",
        };
      }
      return {
        kicker: "Coach tab",
        title: "Organized prompts, not a blank chat",
        body: "Fire Starters sort coaching by the week you are actually in—weekly planning, strategy, sales, marketing and messaging, nervous-system execution, review, inner work, VAPI sense-making, and deep patterns—so you are not guessing what to ask first. Weekly Planning is where the calendar collides with your Vital Action, boundaries, and quota reality. Marketing + Messaging turns your Real Reasons into hooks and narratives. Inner Work + Beliefs is where stuckness gets language: the belief under “I can’t,” parts in conflict, and the self-sabotage loop—always tied back to what you said actually matters.",
      };
    }
    if (tab === "voice") {
      return {
        kicker: "Voice",
        title: "Speak with Alfred",
        body: "Core beliefs rarely shift when you are only typing—you can edit away the uncomfortable truth. Voice keeps mindset work embodied: you hear your own story out loud, stay with the feeling long enough to question it, and rehearse a new stance in live dialogue instead of silent draft mode. That back-and-forth is what loosens fixed narratives and makes identity-level change stick. In ALFRED, Voice is tuned for that inner-work rhythm; live sessions start when you are in the app.",
      };
    }
    if (tab === "results") {
      return {
        kicker: "Assessment results",
        title: "Depth you can act on—not a single number",
        body: "You get a composite read, archetype story, arena and domain breakdowns, interpretations, priority patterns, and driver tie-ins—so the assessment becomes a map, not a vanity score. That depth turns “I feel off” into named leaks and named strengths you can defend under pressure. You stop debating what to fix first because the page ranks urgency against what you said matters. The compounding benefit is confidence: you return to one trusted reference when the quarter gets noisy, instead of re-inventing the diagnosis every time.",
      };
    }
    if (tab === "drivers") {
      if (driversPhase === "escapeDetail") {
        return {
          kicker: "Driver Library",
          title: "Turn a label into a playbook",
          body: "A driver profile names the pattern beneath the pattern—how it shows up in life, what it costs, and what “healthy” looks like for you. Reading the full write-up turns a label into language you can use in Coach, in marriage, and in leadership without shame spirals. When the story is explicit, you can negotiate with it instead of obeying it. The payoff is behavioral: you finally have a playbook for the exit that fits your actual constraints—not a meme about discipline.",
        };
      }
      return {
        kicker: "Driver Library",
        title: "From signal to story",
        body: "The banner spotlights your primary driver so you are not drowning in psychology jargon on a Tuesday night. Opening a profile delivers the long-form narrative—how the pattern reads in scores, relationships, and execution, plus the path out. That continuity matters because founders stop treating symptoms and start working the root. Tap The Escape Artist in the preview to feel how deep the library goes before you are in the live app.",
      };
    }
    {
      const dash = DASHBOARD_TOUR.find((s) => s.focus === dashboardFocus) ?? DASHBOARD_TOUR[0];
      return {
        kicker: dash.kicker,
        title: dash.title,
        body: dash.body,
      };
    }
  };

  const left = leftTitleAndBody();

  return (
    <div
      ref={sectionRef}
      className="grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] gap-10 lg:gap-14 xl:gap-16 items-center w-full min-w-0"
    >
      <div className="order-2 lg:order-1 min-w-0 space-y-6 lg:py-4">
        <div>
          <p className="font-outfit text-[10px] font-semibold uppercase tracking-[0.22em] text-ap-accent mb-2">
            {left.kicker}
          </p>
          <h3
            className={`font-outfit font-bold text-2xl sm:text-3xl leading-tight mb-4 ${
              isAppDark ? "text-foreground" : "text-ap-primary"
            }`}
          >
            {left.title}
          </h3>
          <p
            className={`font-medium leading-relaxed text-base sm:text-lg ${
              isAppDark ? "text-muted-foreground" : "text-ap-mid"
            }`}
          >
            {left.body}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3" role="group" aria-label="App tour controls">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              isAppDark
                ? "border-border bg-secondary text-foreground hover:border-accent hover:text-accent"
                : "border-ap-border bg-white text-ap-primary hover:border-ap-accent hover:text-gradient-accent"
            }`}
          >
            {paused || reduceMotion ? "Play tour" : "Pause"}
          </button>
          <button
            type="button"
            onClick={() => goTour(-1)}
            className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
              isAppDark
                ? "border-border bg-secondary text-foreground hover:border-accent"
                : "border-ap-border bg-white text-ap-primary hover:border-ap-accent"
            }`}
            aria-label="Previous tour stop"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => goTour(1)}
            className={`inline-flex items-center justify-center rounded-full border px-3 py-2 text-sm font-semibold transition-colors ${
              isAppDark
                ? "border-border bg-secondary text-foreground hover:border-accent"
                : "border-ap-border bg-white text-ap-primary hover:border-ap-accent"
            }`}
            aria-label="Next tour stop"
          >
            →
          </button>
          <span
            className={`text-sm font-medium tabular-nums ${isAppDark ? "text-muted-foreground" : "text-ap-muted"}`}
            aria-live="polite"
          >
            {tourIndex + 1} / {APP_TOUR_STEP_COUNT}
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 max-w-xl" role="tablist" aria-label="Tour stops">
          {APP_TOUR_STEPS.map((s, i) => (
            <button
              key={`tour-stop-${i}`}
              type="button"
              role="tab"
              aria-selected={i === tourIndex}
              onClick={() => {
                setPaused(true);
                setTourIndex(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                i === tourIndex
                  ? "w-6 bg-ap-accent"
                  : isAppDark
                    ? "w-1.5 bg-border hover:bg-muted-foreground/40"
                    : "w-1.5 bg-ap-border hover:bg-ap-muted"
              }`}
              aria-label={`Tour: ${s.dotLabel}`}
            />
          ))}
        </div>

        {paused && (
          <p className={`text-sm font-medium max-w-xl ${isAppDark ? "text-muted-foreground" : "text-ap-muted"}`}>
            Tour paused—use the phone&apos;s bottom nav or More menu to explore. Play resumes from this stop, or use the
            dots to jump.
          </p>
        )}
      </div>

      <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
        <div
          className="relative w-full max-w-[260px] sm:max-w-[280px] lg:max-w-[300px]"
          onMouseEnter={() => setPhoneHover(true)}
          onMouseLeave={() => setPhoneHover(false)}
        >
          <div
            className="relative w-full rounded-[2.5rem] border-2 border-black bg-neutral-950 shadow-[0_28px_70px_-18px_rgba(14,22,36,0.55),0_0_0_1px_rgba(255,255,255,0.05)_inset] transition-shadow duration-300 ease-out"
            style={{ aspectRatio: "9 / 19" }}
          >
            <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[2rem]">
              <div className="h-1 shrink-0 bg-ap-accent" aria-hidden />

              <div className="relative flex flex-1 min-h-0 flex-col bg-[#0E1624] text-white/90">
                <div
                  ref={phoneScrollRef}
                  className="alfred-phone-scroll flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth"
                >
                  {tab === "dashboard" && (
                    <DashboardScreen
                      tourFocus={dashboardFocus}
                      onJumpFocus={jumpTourFocus}
                      onViewDriverDetails={openDriversToEscape}
                    />
                  )}
                  {tab === "coach" && (
                    <CoachScreen
                      phase={coachPhase}
                      category={coachCategory}
                      threadPrompt={coachThreadPrompt}
                      reduceMotion={reduceMotion}
                      coachDemoReplayKey={coachDemoReplayKey}
                      onSelectWeekly={() => {
                        setCoachCategory("Weekly Planning");
                        setCoachPhase("category");
                      }}
                      onSelectInnerWork={() => {
                        setCoachCategory("Inner Work + Beliefs");
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
                        setCoachDemoReplayKey((k) => k + 1);
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
                      setPaused(true);
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

          <p
            className={`text-center text-xs mt-4 max-w-[320px] mx-auto leading-relaxed ${
              isAppDark ? "text-muted-foreground" : "text-ap-muted"
            }`}
          >
            This is an interactive preview of ALFRED—labels and layout match what subscribers use, so you can feel the
            product rhythm before you log in. Coach replies here use illustrative sample context; in your account,
            answers ground in your assessment, blueprint, scorecard, and commitments.
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
  const vapiComposite = DEMO_COMPOSITE_VAPI_SCORE;
  const vapiTierLabel = demoVapiGetTier(vapiComposite);
  const vapiTierColor = demoVapiTierColor(vapiComposite);

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
        data-tour-section="leverage"
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
        data-tour-section="weekly"
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
        data-tour-section="priorities"
        role="presentation"
        onMouseEnter={() => onJumpFocus("priorities")}
        className={`space-y-2 rounded-2xl ${focusClass(tourFocus === "priorities", true)}`}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Activity className="h-3.5 w-3.5 text-ap-accent" />
            <span className="text-[10px] font-medium text-white/50">VAPI Score</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold font-cormorant tabular-nums text-white">
              {vapiComposite.toFixed(1)}
            </span>
            <span
              className="text-[9px] font-medium px-1.5 py-0.5 rounded text-white mb-0.5"
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
            {DEMO_FOCUS_HERE_FIRST_DOMAINS.map((d) => {
              const Icon = DEMO_FHF_ICONS[d.code] ?? Activity;
              return <FocusRow key={d.code} icon={Icon} name={d.name} score={d.score} />;
            })}
          </div>
        </div>
      </div>

      <div
        data-tour-section="pattern"
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
      <span
        className="text-[10px] font-bold tabular-nums shrink-0"
        style={{ color: demoVapiTierColor(score) }}
      >
        {score.toFixed(1)}
      </span>
    </div>
  );
}

type CoachDemoBubble = { role: "user" | "assistant"; content: string };

type CoachDemoChatSequenceProps = {
  replayKey: number;
  variant: "weekly" | "inner";
  opener: string;
  firstUserMessage: string;
  scriptTurns: readonly CoachDemoBubble[];
  reduceMotion: boolean;
  onBack: () => void;
};

/** Slower pacing + pauses between bubbles so the demo is readable. Weekly and Inner both use multi-bubble scripts. */
function CoachDemoChatSequence(props: CoachDemoChatSequenceProps) {
  const { replayKey, opener, reduceMotion, onBack, scriptTurns, firstUserMessage, variant } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const [messages, setMessages] = useState<CoachDemoBubble[]>([]);
  const [streamBuffer, setStreamBuffer] = useState("");
  const [composerValue, setComposerValue] = useState("");
  const [thinking, setThinking] = useState(false);
  const [pendingUserTarget, setPendingUserTarget] = useState<string | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, streamBuffer, composerValue, thinking, reduceMotion]);

  useLayoutEffect(() => {
    const ta = composerRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const maxH = 120;
    const sh = ta.scrollHeight;
    const next = Math.min(maxH, Math.max(36, sh));
    ta.style.height = `${next}px`;
    ta.style.overflowY = sh > maxH ? "auto" : "hidden";
  }, [composerValue]);

  useEffect(() => {
    let cancelled = false;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        setTimeout(() => {
          if (!cancelled) resolve();
        }, ms);
      });

    /** Typing: faster than the previous “slow” pass, still readable between beats. */
    const OPEN_MS_PER_CHAR = 17;
    const READ_AFTER_OPENER_MS = 550;
    const USER_MS_PER_CHAR = 13;
    const PAUSE_BEFORE_SEND_MS = 420;
    const READ_AFTER_USER_BUBBLE_MS = 720;
    const THINKING_FIRST_MS = 1600;
    const THINKING_BETWEEN_MS = 1450;
    const STREAM_CHUNK_CHARS = 11;
    const STREAM_CHUNK_MS = 20;
    const READ_AFTER_ASSISTANT_MS = 880;

    async function streamAssistant(text: string) {
      setStreamBuffer("");
      for (let pos = 0; pos <= text.length; pos += STREAM_CHUNK_CHARS) {
        if (cancelled) return;
        setStreamBuffer(text.slice(0, Math.min(text.length, pos + STREAM_CHUNK_CHARS)));
        await sleep(STREAM_CHUNK_MS);
      }
      if (cancelled) return;
      setMessages((m) => [...m, { role: "assistant", content: text }]);
      setStreamBuffer("");
      await sleep(READ_AFTER_ASSISTANT_MS);
    }

    async function typeUserInComposer(text: string) {
      setPendingUserTarget(text);
      setComposerValue("");
      for (let i = 0; i <= text.length; i++) {
        if (cancelled) return;
        setComposerValue(text.slice(0, i));
        await sleep(USER_MS_PER_CHAR);
      }
      await sleep(PAUSE_BEFORE_SEND_MS);
      if (cancelled) return;
      setComposerValue("");
      setPendingUserTarget(null);
      setMessages((m) => [...m, { role: "user", content: text }]);
      await sleep(READ_AFTER_USER_BUBBLE_MS);
    }

    async function run() {
      setMessages([]);
      setStreamBuffer("");
      setComposerValue("");
      setThinking(false);
      setPendingUserTarget(null);

      if (reduceMotion) {
        setMessages([{ role: "assistant", content: opener }, { role: "user", content: firstUserMessage }, ...scriptTurns]);
        return;
      }

      for (let i = 1; i <= opener.length; i++) {
        if (cancelled) return;
        setMessages([{ role: "assistant", content: opener.slice(0, i) }]);
        await sleep(OPEN_MS_PER_CHAR);
      }
      await sleep(READ_AFTER_OPENER_MS);
      if (cancelled) return;

      await typeUserInComposer(firstUserMessage);
      if (cancelled) return;

      setThinking(true);
      await sleep(THINKING_FIRST_MS);
      if (cancelled) return;
      setThinking(false);

      for (const turn of scriptTurns) {
        if (cancelled) return;
        if (turn.role === "assistant") {
          setThinking(true);
          await sleep(THINKING_BETWEEN_MS);
          if (cancelled) return;
          setThinking(false);
          await streamAssistant(turn.content);
        } else {
          await typeUserInComposer(turn.content);
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [opener, reduceMotion, replayKey, variant, firstUserMessage, scriptTurns]);

  const canSendDemo =
    pendingUserTarget !== null &&
    composerValue === pendingUserTarget &&
    !thinking &&
    streamBuffer === "";

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-3 scroll-smooth"
      >
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {messages
          .filter((msg) => msg.content.length > 0)
          .map((msg, idx) => (
          <div
            key={`demo-msg-${idx}-${msg.role}-${msg.content.slice(0, 12)}`}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[92%] rounded-2xl px-3 py-2.5 leading-relaxed ${
                msg.role === "user"
                  ? "bg-ap-accent text-white text-[11px]"
                  : "bg-white/[0.06] border border-white/10 text-[10px] text-white/85"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-3 py-2.5 bg-white/[0.06] border border-white/10"
              aria-label="Coach is thinking"
            >
              <Loader2 className="h-4 w-4 animate-spin text-white/45" aria-hidden />
            </div>
          </div>
        )}

        {streamBuffer.length > 0 && (
          <div className="flex justify-start">
            <div className="max-w-[95%] rounded-2xl px-3 py-2.5 bg-white/[0.06] border border-white/10 text-[10px] text-white/80 leading-relaxed">
              <p className="whitespace-pre-wrap">{streamBuffer}</p>
            </div>
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-white/10 p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={composerRef}
            readOnly
            value={composerValue}
            rows={1}
            placeholder="Ask your coach anything..."
            className="flex-1 resize-none rounded-xl border border-white/10 bg-[#0E1624] px-3 py-2 text-[10px] text-white/90 placeholder:text-white/35 focus:outline-none focus:ring-1 focus:ring-ap-accent/35 min-h-[36px] max-h-[120px] leading-snug"
          />
          <button
            type="button"
            disabled={!canSendDemo}
            className={`h-9 w-9 shrink-0 rounded-xl bg-ap-accent text-white flex items-center justify-center transition-transform disabled:opacity-35 disabled:cursor-not-allowed disabled:scale-100 ${
              canSendDemo ? "ring-2 ring-white/70 scale-105" : ""
            }`}
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CoachScreen({
  phase,
  category,
  threadPrompt,
  reduceMotion,
  coachDemoReplayKey,
  onSelectWeekly,
  onSelectInnerWork,
  onBackCategory,
  onBackFromThread,
  onPickPrompt,
}: {
  phase: CoachPhase;
  category: string | null;
  threadPrompt: CoachThreadPrompt;
  reduceMotion: boolean;
  coachDemoReplayKey: number;
  onSelectWeekly: () => void;
  onSelectInnerWork: () => void;
  onBackCategory: () => void;
  onBackFromThread: () => void;
  onPickPrompt: (p: NonNullable<CoachThreadPrompt>) => void;
}) {
  const showAnimatedFullDemo =
    phase === "thread" && threadPrompt !== null && isCoachFullDemoThread(threadPrompt);

  return (
    <div className="flex flex-col flex-1 min-h-0 min-w-0 w-full text-left">
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

      {showAnimatedFullDemo && threadPrompt ? (
        <CoachDemoChatSequence
          variant={threadPrompt.family === "weekly" ? "weekly" : "inner"}
          replayKey={coachDemoReplayKey}
          opener={
            threadPrompt.family === "weekly"
              ? COACH_DEMO_WEEKLY_THREAD_OPENER
              : COACH_DEMO_INNER_THREAD_OPENER
          }
          firstUserMessage={
            threadPrompt.family === "weekly"
              ? WEEKLY_DEMO_CASUAL_USER_MESSAGE
              : INNER_WORK_DEMO_CASUAL_USER_MESSAGE
          }
          scriptTurns={
            threadPrompt.family === "weekly"
              ? WEEKLY_PLANNING_DEMO_TURNS
              : INNER_WORK_LIMITING_BELIEF_DEMO_TURNS
          }
          reduceMotion={reduceMotion}
          onBack={onBackFromThread}
        />
      ) : (
        <>
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 min-h-0">
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
                const isInner = cat === "Inner Work + Beliefs";
                if (isWeekly || isInner) {
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={isWeekly ? onSelectWeekly : onSelectInnerWork}
                      className="alfred-coach-weekly-highlight w-full text-left px-3 py-2.5 rounded-xl border-2 border-ap-accent/80 bg-ap-accent/15 hover:bg-ap-accent/22 text-[11px] font-semibold text-white transition-colors"
                    >
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
              {WEEKLY_PLANNING_PROMPTS.map((p) => {
                const featured = p.label === WEEKLY_PLANNING_DEMO_LABEL;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => onPickPrompt({ family: "weekly", item: p })}
                    className={
                      featured
                        ? "alfred-coach-weekly-highlight w-full text-left px-3 py-2.5 rounded-xl border-2 border-ap-accent/80 bg-ap-accent/15 hover:bg-ap-accent/22 text-[11px] font-semibold text-white transition-colors"
                        : "w-full text-left px-3 py-2.5 rounded-xl border border-white/10 hover:border-ap-accent/40 hover:bg-ap-accent/10 text-[11px] text-white/85 transition-colors"
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
              <div className="w-full text-left px-3 py-2.5 rounded-xl border border-dashed border-white/15 text-[11px] text-white/45 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Something else
              </div>
            </div>
          </div>
        )}

        {phase === "category" && category === "Inner Work + Beliefs" && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onBackCategory}
              className="flex items-center gap-1 text-[11px] text-white/50 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <h2 className="text-sm font-semibold text-white">Inner Work + Beliefs</h2>
            <div className="space-y-2">
              {INNER_WORK_BELIEFS_PROMPTS.map((p) => {
                const featured = p.label === INNER_WORK_DEMO_LABEL;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => onPickPrompt({ family: "inner", item: p })}
                    className={
                      featured
                        ? "alfred-coach-weekly-highlight w-full text-left px-3 py-2.5 rounded-xl border-2 border-ap-accent/80 bg-ap-accent/15 hover:bg-ap-accent/22 text-[11px] font-semibold text-white transition-colors"
                        : "w-full text-left px-3 py-2.5 rounded-xl border border-white/10 hover:border-ap-accent/40 hover:bg-ap-accent/10 text-[11px] text-white/85 transition-colors"
                    }
                  >
                    {p.label}
                  </button>
                );
              })}
              <div className="w-full text-left px-3 py-2.5 rounded-xl border border-dashed border-white/15 text-[11px] text-white/45 flex items-center gap-2">
                <MessageSquare className="h-3.5 w-3.5" />
                Something else
              </div>
            </div>
          </div>
        )}

        {phase === "thread" && threadPrompt && !isCoachFullDemoThread(threadPrompt) && (
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
                {threadPrompt.item.prompt}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-[95%] rounded-2xl px-3 py-2.5 bg-white/[0.06] border border-white/10 text-[10px] text-white/80 leading-relaxed space-y-2 whitespace-pre-wrap">
                {threadPrompt.family === "weekly" && threadPrompt.item.label === WEEKLY_PLANNING_DEMO_LABEL ? (
                  SAMPLE_SCHEDULE_REPLY
                ) : threadPrompt.family === "weekly" ? (
                  <>
                    <p>
                      In the live app, Alfred answers from your blueprint, Vital Action, 6Cs rhythm, and quota context so
                      the week stays grounded in what you already committed to—not a generic planning template.
                    </p>
                    <p>
                      This preview shows the full written walkthrough for{" "}
                      <span className="text-ap-accent">{WEEKLY_PLANNING_DEMO_LABEL}</span> only. Tap Back and choose that
                      prompt to see it.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      In the live app, Alfred threads inner-work prompts through your blueprint, Real Reasons, Vital
                      Action, and assessment context—so you are not getting canned therapy quotes.
                    </p>
                    <p>
                      The long sample conversation appears for{" "}
                      <span className="text-ap-accent">{INNER_WORK_DEMO_LABEL}</span>. Tap Back and choose that prompt to
                      read it.
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
        </>
      )}
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

/** Demo `topDriverScore` for pattern strength pill (production uses scored VAPI). */
const DEMO_RESULTS_DRIVER_PATTERN_STRENGTH = 8;

function ResultsDriverPatternSection() {
  const [expanded, setExpanded] = useState({
    mechanism: false,
    cost: false,
    wayOut: false,
  });
  const accent = ESCAPE_ARTIST_ACCENT;
  const d = ESCAPE_ARTIST_DRIVER;

  const accordionSections = [
    { key: "mechanism" as const, title: "How This Shows Up in Your Scores", body: d.mechanism },
    { key: "cost" as const, title: "What This Is Costing You", body: d.whatItCosts },
    { key: "wayOut" as const, title: "The Way Out", body: d.theWayOut },
  ];

  return (
    <section
      id="driver-section"
      className="rounded-2xl border border-white/10 bg-gradient-to-br from-ap-accent/[0.12] via-white/[0.04] to-[#0E1624]/90 p-3 shadow-sm space-y-2.5"
    >
      <p className="text-[9px] font-medium text-white/50 uppercase tracking-wider">
        What&apos;s Driving This Pattern
      </p>

      <div className="flex flex-col gap-2">
        <div className="flex items-start gap-2.5">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
            style={{
              backgroundColor: `${accent}14`,
              borderColor: `${accent}33`,
            }}
          >
            <EscapeArtistGlyph size={28} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h2 className="text-sm font-cormorant font-bold text-white leading-tight">{d.name}</h2>
            <p className="text-[9px] text-white/55 leading-snug">
              <span className="font-semibold text-white/80">Core fear:</span> {d.coreFear}
            </p>
          </div>
        </div>
        <span
          className="inline-flex w-fit items-center rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider"
          style={{
            borderColor: `${accent}33`,
            backgroundColor: `${accent}14`,
            color: accent,
          }}
        >
          Pattern strength: {DEMO_RESULTS_DRIVER_PATTERN_STRENGTH} / {d.maxPossible}
        </span>
      </div>

      <blockquote
        className="rounded-xl border-l-4 px-2.5 py-2 text-[11px] font-cormorant font-semibold leading-snug text-white"
        style={{
          borderLeftColor: accent,
          backgroundColor: `${accent}14`,
        }}
      >
        &quot;{d.coreBelief}&quot;
      </blockquote>

      <p className="text-[9px] italic text-white/50 leading-relaxed">{d.tagline}</p>
      <p className="text-[9px] text-white/55 leading-relaxed">{d.description}</p>

      <div className="space-y-1.5">
        {accordionSections.map((section) => {
          const isOpen = expanded[section.key];
          return (
            <div key={section.key} className="rounded-xl border border-white/10 bg-[#0E1624]/70">
              <button
                type="button"
                onClick={() =>
                  setExpanded((cur) => ({ ...cur, [section.key]: !cur[section.key] }))
                }
                className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left"
                aria-expanded={isOpen}
              >
                <span className="text-[9px] font-semibold text-white/90 leading-snug">{section.title}</span>
                {isOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 shrink-0 text-white/45" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/45" />
                )}
              </button>
              {isOpen && (
                <div className="border-t border-white/10 px-2.5 py-2">
                  <p className="text-[8px] leading-relaxed text-white/55">{section.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-white/10 pt-2.5">
        <p className="text-[8px] leading-relaxed text-white/45">{ASSESSMENT_DRIVER_SECTION_NOTE}</p>
        <p className="text-[9px] font-medium text-ap-accent">Learn more about all driver patterns →</p>
      </div>
    </section>
  );
}

function ResultsDeepScreen() {
  const arenaRow = [
    { label: "Personal", icon: BarChart2, score: 6.2, note: "Habits & health baseline" },
    { label: "Relationships", icon: Heart, score: 4.1, note: "Presence vs achievement tradeoff" },
    { label: "Business", icon: Briefcase, score: 7.8, note: "Execution engine strong" },
  ] as const;
  const vapiComposite = DEMO_COMPOSITE_VAPI_SCORE;
  const compositeTier = demoVapiGetTier(vapiComposite);
  const compositeTierColor = demoVapiTierColor(vapiComposite);

  return (
    <div className="p-3 pb-6 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2 mb-1">
        <p className="text-[9px] font-medium text-ap-accent uppercase tracking-wider">Your Results</p>
        <h1 className="text-sm font-semibold text-white mt-1">Assessment results</h1>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Composite VAPI</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold font-cormorant tabular-nums text-white">
            {vapiComposite.toFixed(1)}
          </span>
          <span
            className="text-[9px] font-semibold px-2 py-0.5 rounded text-white mb-1"
            style={{ backgroundColor: compositeTierColor }}
          >
            {compositeTier}
          </span>
        </div>
        <p className="text-[10px] text-white/55 leading-relaxed">
          Mid-pack overall: business systems run hot while personal and relationship arenas need attention. Same story as
          your Focus Here First list—this is where leverage lives before drift becomes a crisis.
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

      <ResultsDriverPatternSection />

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Arena breakdown</p>
        <div className="grid grid-cols-3 gap-1.5">
          {arenaRow.map(({ label, icon: Icon, score, note }) => (
            <div key={label} className="rounded-xl border border-white/10 bg-[#0E1624]/80 p-2">
              <Icon className="h-3.5 w-3.5 text-ap-accent mb-1" />
              <p className="text-[9px] font-semibold text-white/80">{label}</p>
              <p
                className="text-lg font-cormorant font-bold tabular-nums"
                style={{ color: demoVapiTierColor(score) }}
              >
                {score.toFixed(1)}
              </p>
              <p className="text-[8px] text-white/40 leading-snug mt-1">{note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Domains & interpretations</p>
        <div className="space-y-1.5">
          {DEMO_RESULTS_DOMAIN_SAMPLES.map((d) => (
            <div
              key={d.code}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0E1624]/60 px-2 py-1.5"
            >
              <span className="text-[9px] font-mono text-white/35 w-6">{d.code}</span>
              <span className="text-[10px] text-white/80 flex-1 truncate">{d.name}</span>
              <span
                className="text-[10px] font-bold tabular-nums shrink-0"
                style={{ color: demoVapiTierColor(d.score) }}
              >
                {d.score.toFixed(1)}
              </span>
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
          {DEMO_FOCUS_HERE_FIRST_DOMAINS.map((d) => {
            const Icon = DEMO_FHF_ICONS[d.code] ?? Activity;
            return <FocusRow key={d.code} icon={Icon} name={d.name} score={d.score} />;
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 space-y-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Priority matrix snapshot</p>
        <div className="grid grid-cols-2 gap-1.5 text-[8px]">
          <div className="rounded-lg border border-red-500/25 bg-red-500/10 p-2 text-white/80">
            <p className="font-semibold text-red-300">Critical</p>
            <p className="text-white/50 mt-1">3 domains (Focus Here First)</p>
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

      <section className="rounded-2xl border border-dashed border-white/15 p-3">
        <p className="text-[9px] text-white/45 leading-relaxed">
          Full app adds comparative wheels, expandable archetype sections, lagging-arena callouts for The Journeyman,
          transition summaries, and deep links into Priorities and Blueprint from each block.
        </p>
        <p className="text-[10px] font-medium text-ap-accent mt-2">Explore My Score (wheel) →</p>
      </section>
    </div>
  );
}

function ScorecardDemoScreen() {
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
        {SIX_CS_DEMO.map(({ label, icon: Icon, pct }, idx) => {
          const open = idx === 0;
          const c = scoreBarColor(pct);
          return (
            <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
              <div className="flex items-center justify-between px-2.5 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: c }} />
                  <span className="text-[11px] font-semibold text-white truncate">{label}</span>
                </div>
                <span className="text-xs font-bold tabular-nums" style={{ color: c }}>
                  {pct}%
                </span>
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
          );
        })}
      </div>
      <div className="rounded-xl border border-dashed border-white/15 px-2.5 py-2 text-[9px] text-white/45">
        Submit locks the week; history builds trend lines Alfred uses in planning prompts.
      </div>
    </div>
  );
}

const PRIORITY_QUAD_UI: Record<
  DemoPriorityQuadrant,
  { Icon: typeof AlertTriangle; shell: string; title: string; desc: string }
> = {
  "Critical Priority": {
    Icon: AlertTriangle,
    shell: "border-red-500/30 bg-red-500/10",
    title: "text-red-300",
    desc: "High importance, low score — focus here first",
  },
  "Protect & Sustain": {
    Icon: Shield,
    shell: "border-emerald-500/30 bg-emerald-500/10",
    title: "text-emerald-300",
    desc: "High importance, high score — don't neglect these",
  },
  Monitor: {
    Icon: Eye,
    shell: "border-amber-500/25 bg-amber-500/10",
    title: "text-amber-200",
    desc: "Lower importance, lower score — keep an eye on these",
  },
  "Possible Over-Investment": {
    Icon: TrendingDown,
    shell: "border-sky-500/25 bg-sky-500/10",
    title: "text-sky-200",
    desc: "Lower importance, high score — could redirect energy",
  },
};

const PRIORITY_DOMAIN_ICON: Record<string, ComponentType<{ className?: string }>> = {
  PH: Activity,
  IA: Compass,
  ME: Brain,
  AF: Focus,
  RS: Heart,
  FA: Home,
  CO: Users,
  WI: Globe,
  VS: Telescope,
  EX: Rocket,
  OH: Gauge,
  EC: Leaf,
};

function PrioritiesDemoScreen() {
  const [expandedQuad, setExpandedQuad] = useState<Record<DemoPriorityQuadrant, boolean>>({
    "Critical Priority": true,
    "Protect & Sustain": false,
    Monitor: false,
    "Possible Over-Investment": false,
  });

  return (
    <div className="p-3 pb-5 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2">
        <h1 className="text-sm font-semibold text-white">Priorities</h1>
        <p className="text-[10px] text-white/45 mt-1">Explore your priority matrix</p>
      </header>
      <p className="text-[9px] text-white/45 leading-relaxed">
        Same quadrants as /priorities: importance you stated in the VAPI vs domain scores. Expand a section to see
        domains, scores, and tiers.
      </p>
      <div className="space-y-2 max-h-[min(340px,62vh)] overflow-y-auto pr-0.5">
        {DEMO_PRIORITY_MATRIX_BY_QUADRANT.map(({ quadrant, items }) => {
          const meta = PRIORITY_QUAD_UI[quadrant];
          const QIcon = meta.Icon;
          const isOpen = expandedQuad[quadrant];
          return (
            <div key={quadrant} className={`rounded-xl border overflow-hidden shadow-sm ${meta.shell}`}>
              <button
                type="button"
                onClick={() => setExpandedQuad((e) => ({ ...e, [quadrant]: !e[quadrant] }))}
                className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left hover:bg-black/10 transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <QIcon className={`h-3.5 w-3.5 shrink-0 ${meta.title}`} />
                  <span className={`text-[10px] font-semibold truncate ${meta.title}`}>{quadrant}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-3.5 w-3.5 shrink-0 text-white/50" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 shrink-0 text-white/50" />
                )}
              </button>
              <p className="px-2.5 pb-1.5 text-[8px] text-white/50 leading-snug">{meta.desc}</p>
              {isOpen && (
                <div className="border-t border-white/10 bg-[#0E1624]/80 px-2 py-2 space-y-1.5">
                  {items.map((item) => {
                    const Icon = PRIORITY_DOMAIN_ICON[item.code] ?? Activity;
                    const tier = demoVapiGetTier(item.score);
                    const col = demoVapiTierColor(item.score);
                    return (
                      <div
                        key={item.code}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5"
                      >
                        <Icon className="h-3.5 w-3.5 text-ap-accent shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] text-white/90 leading-tight">{item.name}</p>
                          <p className="text-[8px] text-white/40 mt-0.5">Priority {item.importance}/10</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-semibold tabular-nums" style={{ color: col }}>
                            {item.score.toFixed(1)}
                          </p>
                          <p className="text-[8px] text-white/45">{tier}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[8px] text-white/40 leading-relaxed">
        In-app, each row links to Coach with your priority context preloaded.
      </p>
    </div>
  );
}

function BlueprintDemoScreen() {
  const sections = [
    { icon: Target, label: "North Star Stack" },
    { icon: Heart, label: "Core Values" },
    { icon: Compass, label: "The Future You" },
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
      <p className="text-[9px] text-white/45 leading-relaxed">
        Sample user: B2B founder, <span className="text-white/70">The Ghost</span> +{" "}
        <span className="text-white/70">Escape Artist</span> pattern. Blueprint is what Alfred loads into Coach so you
        are not re-pasting your life story every week.
      </p>
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
          <span className="text-white/75">Identity:</span> Calm, present CEO who closes without living in Slack.{" "}
          <span className="text-white/75">Real Reasons:</span> Kid bedtimes, marriage not last on the list, proof I can
          build without disappearing. <span className="text-white/75">Driving Fire:</span> Replace hero-mode revenue with
          a system that runs when I step away.
        </p>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#0E1624]/80 p-2.5 space-y-1.5">
        <p className="text-[10px] font-semibold text-white">Core Values (top 3)</p>
        <ul className="text-[9px] text-white/55 leading-relaxed list-disc pl-3.5 space-y-0.5">
          <li>Integrity over performative hustle</li>
          <li>Family edges are real edges (dinner, weekends)</li>
          <li>Depth with a small circle over wide shallow network</li>
        </ul>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#0E1624]/80 p-2.5 space-y-1.5">
        <p className="text-[10px] font-semibold text-white">The Future You · 12 months</p>
        <p className="text-[9px] text-white/55 leading-relaxed">
          Revenue stable with a real bench (not just me). Mornings owned for strategy and QCs, not notifications. Partner
          says I am “here” again; two close friendships feel reciprocal, not transactional.
        </p>
      </div>
      <div className="rounded-xl border border-white/10 bg-[#0E1624]/80 p-2.5 space-y-1.5">
        <p className="text-[10px] font-semibold text-white">Revenue + Operations</p>
        <p className="text-[9px] text-white/55 leading-relaxed">
          Bridge this quarter: <span className="text-white/80">12 qualified conversations / week</span>, ~28% close,
          average deal in band with current offer. Bottleneck is outbound + follow-up, not delivery. Ops: one weekly
          pipeline review, CRM hygiene Friday 4 p.m.
        </p>
      </div>
      <div className="rounded-xl border border-ap-accent/30 bg-ap-accent/10 p-2.5 space-y-1">
        <p className="text-[10px] font-semibold text-white">Vital Action (90 days)</p>
        <p className="text-[9px] text-white/80 leading-relaxed">
          Defend <span className="font-semibold">two 90-minute morning focus blocks</span> Mon–Thu before Slack or email.
          Non-negotiables already in context: <span className="font-semibold">dinner by 6:30</span>,{" "}
          <span className="font-semibold">no Slack after 8 p.m.</span>
        </p>
      </div>
      <p className="text-[8px] text-white/40 leading-relaxed">
        Full app renders your uploaded Strategic Clarity / onboarding answers as markdown here—the same text Alfred sees
        in Coach.
      </p>
    </div>
  );
}

function ArchetypesDemoScreen() {
  return (
    <div className="p-3 pb-5 space-y-3 text-left">
      <header className="border-b border-white/10 pb-2">
        <p className="text-[9px] font-semibold text-ap-accent uppercase tracking-wider">Archetype Library</p>
        <h1 className="text-sm font-semibold text-white mt-1">{ARCHETYPE_LIBRARY_DEMO_TITLE}</h1>
        <p className="text-[9px] text-white/45 mt-1 leading-relaxed">{ARCHETYPE_LIBRARY_SUBTITLE_DEMO}</p>
      </header>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2">
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45">Your current archetype</p>
        <p className="text-[10px] text-white/85 mt-1">
          <span className="font-semibold text-ap-accent">The Ghost</span>
          <span className="text-white/45"> · matches your latest VAPI</span>
        </p>
      </div>
      <div>
        <p className="text-[8px] font-semibold uppercase tracking-wider text-white/45 mb-1">Explore</p>
        <p className="text-[11px] font-cormorant font-bold text-white">Pick an archetype</p>
        <p className="text-[9px] text-white/45 mt-0.5 leading-snug">
          Same nine profiles and essays as /archetypes—scroll to browse.
        </p>
      </div>
      <div className="space-y-1 max-h-[min(300px,55vh)] overflow-y-auto pr-0.5">
        {ARCHETYPE_LIBRARY_ROWS_DEMO.map((row) => {
          const isYours = row.name === "The Ghost";
          return (
            <div
              key={row.name}
              className={`flex w-full items-start gap-2 rounded-xl border px-2 py-2 text-left ${
                isYours ? "border-ap-accent/35 bg-ap-accent/10" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  isYours ? "" : "border-white/10 bg-white/[0.04]"
                }`}
                style={
                  isYours
                    ? {
                        backgroundColor: `${GHOST_ARCHETYPE_ACCENT}18`,
                        borderColor: `${GHOST_ARCHETYPE_ACCENT}44`,
                      }
                    : undefined
                }
              >
                {isYours ? (
                  <Ghost className="h-4 w-4" style={{ color: GHOST_ARCHETYPE_ACCENT }} />
                ) : (
                  <span className="text-[9px] font-bold text-white/30">+</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <span className={`text-[10px] font-semibold leading-snug ${isYours ? "text-white" : "text-white/65"}`}>
                    {row.name}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/25" />
                </div>
                <p className="text-[8px] text-white/45 mt-1 leading-snug line-clamp-2">{row.tagline}</p>
                {isYours ? (
                  <span
                    className="mt-1 inline-block rounded-full px-2 py-0.5 text-[7px] font-bold uppercase tracking-wide text-ap-accent"
                    style={{ backgroundColor: `${GHOST_ARCHETYPE_ACCENT}22` }}
                  >
                    Your pattern
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[8px] text-white/40 leading-relaxed">
        Full profile: strength, shadow, constraint, growth path, program phase (archetypes-full.ts).
      </p>
    </div>
  );
}

function SettingsDemoScreen() {
  const rows = ["Account & profile", "Daily Sparks", "Appearance / theme", "Privacy & data", "Sign out"] as const;
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
          <p className="px-3 py-2 text-[8px] font-semibold uppercase tracking-wider text-white/45">
            The 10 dysfunction drivers
          </p>
          <div className="max-h-[min(280px,52vh)] overflow-y-auto">
            {DRIVER_LIBRARY_ORDER_LIST.map((name) => {
              const isEscape = name === ESCAPE_ARTIST_DRIVER.name;
              if (isEscape) {
                return (
                  <button
                    key={name}
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
                        <span className="text-[11px] font-semibold text-white leading-snug">{name}</span>
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
                );
              }
              return (
                <div
                  key={name}
                  className="flex w-full items-center gap-3 border-t border-white/10 bg-[#0E1624]/80 p-3 opacity-[0.42] pointer-events-none select-none grayscale"
                  aria-hidden
                >
                  <div className="h-10 w-10 rounded-xl bg-white/5 shrink-0" />
                  <span className="text-[10px] text-white/45 flex-1 min-w-0">{name}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/15" />
                </div>
              );
            })}
          </div>
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
