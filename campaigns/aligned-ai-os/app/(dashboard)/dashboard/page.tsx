"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import {
  Activity,
  Compass,
  Brain,
  Focus,
  Heart,
  Home,
  Users,
  Globe,
  Telescope,
  Rocket,
  Gauge,
  Leaf,
  Crosshair,
  Link2,
  BatteryCharging,
  ShieldCheck,
  Zap,
  Users as UsersIcon,
  ArrowRight,
  Target,
  ClipboardCheck,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  UserCircle,
  ListChecks,
} from "lucide-react";
import { getTier, getTierColor, ARCHETYPE_DESCRIPTIONS, getPriorityMatrix, type VapiArchetype } from "@/lib/vapi/scoring";
import { ARCHETYPES_FULL } from "@/lib/vapi/archetypes-full";
import { ARCHETYPE_ACCENT_COLORS, getArchetypeIcon } from "@/lib/vapi/archetype-icons";
import { ARENAS, DOMAINS } from "@/lib/vapi/quiz-data";
import {
  ALIGNED_MOMENTUM_CONTENT,
  ALIGNED_MOMENTUM_NAME,
  DRIVER_CONTENT,
  getDriverState,
  type VapiAssignedDriverName,
  type VapiDriverFallbackType,
  type VapiDriverName,
  type VapiDriverState,
} from "@/lib/vapi/drivers";
import { DriverIcon } from "@/lib/vapi/driver-icons";
import { SCORECARD_CATEGORIES, getOverallScore } from "@/lib/scorecard";
import {
  chatQueryUrl,
  buildArchetypeCoachPrompt,
  buildDashboardPriorityPrompt,
  buildSixCsTrendCoachPrompt,
} from "@/lib/chat-deep-links";
import {
  getScorecardWindow,
  getMostRecentScorecardWindow,
  isDateInScorecardWindow,
  isSameEasternCalendarWeek,
} from "@/lib/scorecard-window";
import { MyPlanDashboardReminder } from "@/components/my-plan-callouts";

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity, IA: Compass, ME: Brain, AF: Focus,
  RS: Heart, FA: Home, CO: Users, WI: Globe,
  VS: Telescope, EX: Rocket, OH: Gauge, EC: Leaf,
};

const SCORECARD_ICONS: Record<string, React.ElementType> = {
  crosshair: Crosshair,
  link: Link2,
  "battery-charging": BatteryCharging,
  "shield-check": ShieldCheck,
  zap: Zap,
  users: UsersIcon,
};

type VapiResult = {
  id: string;
  domainScores: Record<string, number>;
  arenaScores: Record<string, number>;
  overallScore: number;
  archetype: string;
  importance: Record<string, number>;
  assignedDriver: string | null;
  driverScores: Record<string, number>;
  topDriverScore: number;
  driverState: VapiDriverState;
  driverFallbackType: VapiDriverFallbackType;
  createdAt: string;
};

type ScorecardEntry = {
  id: string;
  createdAt: string;
  weekStart: string;
  scores: Record<string, number>;
  notes: string | null;
};

type TrialBanner = {
  daysLeft: number;
  isActive: boolean;
};

type DashboardSprint = {
  id: string;
  primary_surface: string;
  payload: {
    title?: string;
    summary?: string;
    weeks?: { weekNumber: number; tasks?: { completed?: boolean }[] }[];
  };
};

const QUAD_COLORS: Record<string, string> = {
  "Critical Priority": "bg-red-500/15 border-red-500/30",
  "Protect & Sustain": "bg-green-500/15 border-green-500/30",
  Monitor: "bg-yellow-500/15 border-yellow-500/30",
  "Possible Over-Investment": "bg-blue-500/15 border-blue-500/30",
};

function getScorecardScoreColor(score: number) {
  if (score <= 30) return "#ef4444";
  if (score <= 55) return "#f97316";
  if (score <= 79) return "#eab308";
  return "#22c55e";
}

export default function DashboardPage() {
  const coerceAssignedDriverName = (
    value: string | null | undefined
  ): VapiAssignedDriverName | null => {
    if (!value) return null;
    if (value === ALIGNED_MOMENTUM_NAME) return ALIGNED_MOMENTUM_NAME;
    return value in DRIVER_CONTENT ? (value as VapiDriverName) : null;
  };

  const [vapiResults, setVapiResults] = useState<VapiResult[]>([]);
  const [scorecardEntries, setScorecardEntries] = useState<ScorecardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [vitalActionExpanded, setVitalActionExpanded] = useState(false);
  const [trialBanner, setTrialBanner] = useState<TrialBanner | null>(null);
  const [activeSprint, setActiveSprint] = useState<DashboardSprint | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/vapi", { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => ({ results: [] })),
      fetch("/api/scorecard").then((r) => r.json()).catch(() => ({ entries: [], currentWeek: null })),
      fetch("/api/settings").then((r) => r.json()).catch(() => null),
      fetch("/api/sprint/me").then((r) => r.json()).catch(() => ({ sprint: null })),
    ]).then(([vapiData, scorecardData, settings, sprintData]) => {
      setVapiResults(
        (vapiData.results || []).map((row: VapiResult) => ({
          ...row,
          driverState:
            row.driverState ||
            getDriverState({
              assignedDriver: coerceAssignedDriverName(row.assignedDriver),
              driverFallbackType: row.driverFallbackType || "standard",
            }),
          driverFallbackType: row.driverFallbackType || "standard",
        }))
      );
      const allEntries = [
        ...(scorecardData.currentWeek ? [scorecardData.currentWeek] : []),
        ...(scorecardData.entries || []),
      ];
      setScorecardEntries(allEntries);

      if (settings && settings.trialEndsAt && settings.subscriptionStatus !== "active") {
        const ends = new Date(settings.trialEndsAt).getTime();
        const now = Date.now();
        const msLeft = ends - now;
        if (msLeft > 0) {
          const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
          setTrialBanner({ daysLeft, isActive: true });
        }
      }

      const sp = sprintData?.sprint as DashboardSprint | null | undefined;
      setActiveSprint(sp && sp.id ? sp : null);

      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  const scorecardWindow = getScorecardWindow();
  const mostRecentScorecardWindow = getMostRecentScorecardWindow(scorecardWindow);
  const latestVapi = vapiResults[0] || null;
  const scoredEntries = scorecardEntries.filter(
    (e) => e.scores && Object.keys(e.scores).length > 0
  );
  const latestScorecard = scoredEntries[0] || null;
  const hasAnyScorecards = scoredEntries.length > 0;
  const currentWindowSubmitted = scorecardWindow.canSubmit
    ? scoredEntries.some((e) =>
        isDateInScorecardWindow(e.createdAt, {
          opensAt: scorecardWindow.opensAt,
          closesAt: scorecardWindow.closesAt,
        })
      )
    : scoredEntries.some((e) =>
        isDateInScorecardWindow(e.createdAt, mostRecentScorecardWindow)
      );
  const showFirstSubmissionFallback =
    scoredEntries.length === 1 &&
    !!latestScorecard &&
    !currentWindowSubmitted &&
    isSameEasternCalendarWeek(latestScorecard.createdAt);
  const showSubmissionWindowCtas =
    scorecardWindow.canSubmit && !currentWindowSubmitted;
  const submissionWindowUrgent =
    showSubmissionWindowCtas &&
    scorecardWindow.hoursLeft > 0 &&
    scorecardWindow.hoursLeft <= 6;
  const displayedScorecard =
    currentWindowSubmitted || showFirstSubmissionFallback ? latestScorecard : null;
  let currentOneThing: string | null = null;
  let currentReflections: Record<string, string> = {};
  if (latestScorecard?.notes) {
    try {
      const parsed = JSON.parse(latestScorecard.notes) as {
        oneThing?: string;
        reflections?: Record<string, string>;
      };
      currentOneThing = parsed.oneThing || null;
      currentReflections = parsed.reflections || {};
    } catch {
      currentOneThing = null;
      currentReflections = {};
    }
  }
  const visibleReflections = SCORECARD_CATEGORIES.map((category) => ({
    key: category.key,
    label: category.label,
    value: currentReflections[category.key]?.trim() || "",
  })).filter((reflection) => reflection.value);
  const archetype = latestVapi?.archetype as VapiArchetype | undefined;
  const ArchetypeIcon = archetype ? getArchetypeIcon(archetype) : null;
  const archetypeColor = archetype ? ARCHETYPE_ACCENT_COLORS[archetype] : undefined;
  const archetypeTagline = archetype ? ARCHETYPES_FULL[archetype]?.tagline : "";
  const driverName =
    latestVapi?.assignedDriver &&
    latestVapi.assignedDriver in DRIVER_CONTENT
      ? (latestVapi.assignedDriver as VapiDriverName)
      : null;
  const driverState = latestVapi
    ? latestVapi.driverState ||
      getDriverState({
        assignedDriver: coerceAssignedDriverName(latestVapi.assignedDriver),
        driverFallbackType: latestVapi.driverFallbackType || "standard",
      })
    : "no_driver";
  const isAlignedMomentum =
    driverState === "aligned_momentum" ||
    latestVapi?.assignedDriver === ALIGNED_MOMENTUM_NAME;
  const driver = driverName ? DRIVER_CONTENT[driverName] : null;
  const dashboardDriverName: VapiAssignedDriverName | null = isAlignedMomentum
    ? ALIGNED_MOMENTUM_NAME
    : driverName;
  const driverFallbackLabel = "No clear driver identified";
  const priorityItems = latestVapi
    ? getPriorityMatrix(latestVapi.domainScores, latestVapi.importance || {})
    : [];
  const criticalPriorities = priorityItems
    .filter((p) => p.quadrant === "Critical Priority")
    .sort((a, b) => a.score - b.score);
  const nonCriticalPriorities = priorityItems
    .filter((p) => p.quadrant !== "Critical Priority")
    .sort((a, b) => a.score - b.score);
  const focusHereFirstItems = [
    ...criticalPriorities.slice(0, 3),
    ...nonCriticalPriorities.slice(0, Math.max(0, 3 - criticalPriorities.length)),
  ].slice(0, 3);

  let sprintProgressLabel: string | null = null;
  if (activeSprint?.payload?.weeks?.length) {
    let done = 0;
    let total = 0;
    for (const w of activeSprint.payload.weeks) {
      for (const t of w.tasks || []) {
        total += 1;
        if (t.completed) done += 1;
      }
    }
    if (total > 0) {
      sprintProgressLabel = `Progress: ${done} of ${total} actions (${Math.round((100 * done) / total)}%).`;
    }
  }

  const archetypeDriverSummary = isAlignedMomentum
    ? `state: ${ALIGNED_MOMENTUM_NAME}`
    : driver
      ? `likely driver "${driver.name}"`
      : latestVapi?.assignedDriver
        ? `assigned pattern "${latestVapi.assignedDriver}"`
        : "";

  let sixCsCoachHref: string | null = null;
  if (scoredEntries.length >= 1) {
    const latestS = scoredEntries[0].scores || {};
    const prevS = scoredEntries[1]?.scores;
    let weakest = {
      label: SCORECARD_CATEGORIES[0].label,
      val: 101,
    };
    for (const c of SCORECARD_CATEGORIES) {
      const v = latestS[c.key] || 0;
      if (v < weakest.val) weakest = { label: c.label, val: v };
    }
    let declineLabel: string | undefined;
    let declineDelta: number | undefined;
    if (prevS) {
      let worstD = 0;
      for (const c of SCORECARD_CATEGORIES) {
        const d = (latestS[c.key] || 0) - (prevS[c.key] || 0);
        if (d < worstD) {
          worstD = d;
          declineLabel = c.label;
          declineDelta = d;
        }
      }
    }
    sixCsCoachHref = chatQueryUrl(
      buildSixCsTrendCoachPrompt({
        weakestLabel: weakest.label,
        weakestPct: weakest.val,
        declinedLabel: declineLabel,
        declineDelta: declineDelta,
      })
    );
  }

  const topStrengths = latestVapi
    ? DOMAINS.map((d) => ({ ...d, score: latestVapi.domainScores[d.code] || 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];
  const latestScorecardOverall = latestScorecard
    ? getOverallScore(latestScorecard.scores)
    : null;
  const latestScorecardDate = latestScorecard
    ? new Date(latestScorecard.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-4xl mx-auto space-y-6">
          <MyPlanDashboardReminder hasAssessment={vapiResults.length > 0} />

          {trialBanner?.isActive && (
            <div className="rounded-2xl border border-amber-400/60 bg-amber-500/10 px-4 py-3 flex items-center justify-between gap-3 text-sm">
              <div className="space-y-0.5">
                <p className="font-medium text-amber-900 dark:text-amber-200">
                  Your free trial ends in {trialBanner.daysLeft} day{trialBanner.daysLeft === 1 ? "" : "s"}.
                </p>
                <p className="text-xs text-amber-900/80 dark:text-amber-200/80">
                  Choose a plan now to keep ALFRED active without interruption.
                </p>
              </div>
              <Link
                href="/subscribe"
                className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-amber-500 text-amber-950 px-3 py-1.5 text-xs font-semibold hover:bg-amber-400 transition-colors"
              >
                Add payment
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
          {/* Vital Action — top, front and center (from latest 6Cs scorecard) */}
          {currentOneThing ? (
            <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-5">
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    This Week's Vital Action
                  </p>
                  <p className="font-medium leading-snug whitespace-pre-wrap break-words">
                    {currentOneThing}
                  </p>
                </div>
              </div>
              {showSubmissionWindowCtas && (
                <div
                  className={`mt-4 rounded-xl border p-4 ${
                    submissionWindowUrgent
                      ? "border-amber-500/40 bg-amber-500/10"
                      : "border-accent/20 bg-background/70"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                          submissionWindowUrgent
                            ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        {submissionWindowUrgent ? (
                          <AlertTriangle className="h-3.5 w-3.5" />
                        ) : (
                          <ClipboardCheck className="h-3.5 w-3.5" />
                        )}
                        {submissionWindowUrgent ? "Closes today" : "Weekly review open"}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground">
                          Update your Vital Action for this week
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Complete your 6Cs review and choose the one move ALFRED should keep
                          front and center next.
                        </p>
                      </div>
                      {scorecardWindow.countdownMessage && (
                        <p className="text-xs font-medium text-muted-foreground">
                          {scorecardWindow.countdownMessage}
                        </p>
                      )}
                    </div>
                    <Link
                      href="/scorecard"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Update in 6Cs
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
              {visibleReflections.length > 0 && (
                <>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setVitalActionExpanded((open) => !open)}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
                      aria-expanded={vitalActionExpanded}
                      aria-controls="vital-action-reflections"
                    >
                      {vitalActionExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span>View my 6C reflections</span>
                    </button>
                  </div>
                  {vitalActionExpanded && (
                    <div
                      id="vital-action-reflections"
                      className="mt-4 pt-4 border-t border-border/60 space-y-2"
                    >
                      {visibleReflections.map((reflection) => (
                        <div
                          key={reflection.key}
                          className="rounded-xl border border-border bg-background/60 px-4 py-3"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                            {reflection.label}
                          </p>
                          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words">
                            {reflection.value}
                          </p>
                        </div>
                      ))}
                      <div className="pt-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setVitalActionExpanded(false)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors"
                        >
                          <ChevronUp className="h-4 w-4" />
                          <span>Collapse</span>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : showSubmissionWindowCtas ? (
            <Link href="/scorecard" className="block group">
              <div
                className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-colors ${
                  submissionWindowUrgent
                    ? "border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60"
                    : "border-accent/30 bg-card hover:border-accent/50"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent/70 to-transparent" />
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        submissionWindowUrgent
                          ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {submissionWindowUrgent ? (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      ) : (
                        <ClipboardCheck className="h-3.5 w-3.5" />
                      )}
                      {submissionWindowUrgent ? "Closes today" : "Weekly review open"}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        This Week&apos;s Vital Action
                      </p>
                      <p className="mt-1 text-lg font-semibold leading-snug">
                        Set the move ALFRED should anchor this week
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Complete your 6Cs review to choose the one action that makes everything else
                      easier or unnecessary.
                    </p>
                    {scorecardWindow.countdownMessage && (
                      <p className="text-xs font-medium text-muted-foreground">
                        {scorecardWindow.countdownMessage}
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                      Complete weekly review
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/scorecard"
              className="block rounded-2xl border-2 border-dashed border-accent/30 bg-accent/5 p-5 flex items-center gap-4 hover:border-accent/50 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  This Week's Vital Action
                </p>
                <p className="font-medium text-muted-foreground">
                  Complete your 6Cs scorecard to set this week&apos;s Vital Action.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-accent" />
            </Link>
          )}

          {activeSprint ? (
            <Link
              href="/my-plan"
              className="block rounded-2xl border-2 border-primary/20 bg-card p-5 shadow-sm transition-colors hover:border-accent/40 hover:bg-accent/5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div className="flex gap-4 items-start min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ListChecks className="h-5 w-5 text-accent" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Your 28-day sprint
                    </p>
                    <h3 className="text-lg font-semibold text-foreground leading-tight mt-0.5">
                      {activeSprint.payload?.title || "My Plan"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1 line-clamp-2">
                      {activeSprint.payload?.summary || "Your personalized focus from VAPI."}
                    </p>
                    {sprintProgressLabel ? (
                      <p className="text-xs text-muted-foreground mt-2 font-medium">{sprintProgressLabel}</p>
                    ) : null}
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground sm:ml-auto">
                  Open My Plan
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ) : null}

          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Your alignment at a glance
          </h2>

          {/* Score Cards Row */}
          <div className="grid sm:grid-cols-2 gap-4 -mt-2">
            {/* 6Cs Latest */}
            {displayedScorecard ? (
              <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-3 shadow-sm h-full min-h-[280px] flex flex-col order-1 sm:order-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ClipboardCheck className="h-4 w-4 text-accent shrink-0" />
                    <span className="text-sm font-medium text-muted-foreground">
                      6Cs Score
                    </span>
                    <span className="text-[10px] font-medium text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded bg-green-500/10 shrink-0">
                      {currentWindowSubmitted ? "Submitted" : "First submission"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground text-right shrink-0">
                    {currentWindowSubmitted
                      ? `Week of ${new Date(displayedScorecard.weekStart).toLocaleDateString()}`
                      : `Submitted ${new Date(displayedScorecard.createdAt).toLocaleDateString()}`}
                  </span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span
                    className="text-4xl font-bold font-serif"
                    style={{ color: getScorecardScoreColor(getOverallScore(displayedScorecard.scores)) }}
                  >
                    {getOverallScore(displayedScorecard.scores)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 flex-1">
                  {SCORECARD_CATEGORIES.map((c) => {
                    const Icon = SCORECARD_ICONS[c.icon];
                    const pct = displayedScorecard.scores[c.key] || 0;
                    const scoreColor = getScorecardScoreColor(pct);
                    return (
                      <div
                        key={c.key}
                        className="flex flex-col items-center p-2.5 rounded-xl border border-border bg-background/50"
                      >
                        {Icon && <Icon className="h-5 w-5 mb-1" style={{ color: scoreColor }} />}
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {c.label}
                        </p>
                        <p className="text-lg font-bold tabular-nums" style={{ color: scoreColor }}>{pct}%</p>
                        <div className="w-full h-1.5 rounded-full bg-muted/50 mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: scoreColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-border">
                  <Link
                    href="/scorecard"
                    className="text-xs text-accent font-medium hover:underline"
                  >
                    Open scorecard →
                  </Link>
                  {sixCsCoachHref && (
                    <Link
                      href={sixCsCoachHref}
                      className="text-xs text-accent font-medium hover:underline"
                    >
                      Coach on 6Cs →
                    </Link>
                  )}
                </div>
              </div>
            ) : !currentWindowSubmitted && hasAnyScorecards && scorecardWindow.status !== "open" ? (
              <div className="rounded-2xl border border-dashed border-border p-5 space-y-3 flex flex-col items-center justify-center text-center min-h-[280px] order-1 sm:order-2">
                <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">6Cs Scorecard</p>
                <p className="text-sm text-muted-foreground">
                  {(() => {
                    const start = new Date(mostRecentScorecardWindow.opensAt).toLocaleDateString();
                    const end = new Date(mostRecentScorecardWindow.closesAt).toLocaleDateString();
                    return start === end
                      ? `No data available for the week of ${start}.`
                      : `No data available for the week of ${start} – ${end}.`;
                  })()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Your next scorecard will be available Friday at 12pm.
                </p>
              </div>
            ) : showSubmissionWindowCtas ? (
              <Link href="/scorecard" className="block order-1 sm:order-2 group">
                <div
                  className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-colors h-full min-h-[280px] flex flex-col ${
                    submissionWindowUrgent
                      ? "border-amber-500/40 bg-amber-500/10 hover:border-amber-500/60"
                      : "border-accent/30 bg-card hover:border-accent/50"
                  }`}
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent via-accent/70 to-transparent" />
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                        submissionWindowUrgent
                          ? "bg-amber-500/15 text-amber-800 dark:text-amber-300"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {submissionWindowUrgent ? (
                        <AlertTriangle className="h-3.5 w-3.5" />
                      ) : (
                        <ClipboardCheck className="h-3.5 w-3.5" />
                      )}
                      {submissionWindowUrgent ? "Closes today" : "Weekly review open"}
                    </div>
                    <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-accent/10 shrink-0">
                      <ClipboardCheck className="h-5 w-5 text-accent" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      6Cs Scorecard
                    </p>
                    <h3 className="text-2xl font-serif font-bold leading-tight">
                      {hasAnyScorecards
                        ? "Run this week's 6Cs review"
                        : "Start your first 6Cs review"}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {hasAnyScorecards
                        ? "Review the six dimensions, catch drift early, and reset the Vital Action ALFRED should anchor next."
                        : "Use your first weekly review to see what's steady, what's leaking, and what this week's Vital Action needs to be."}
                    </p>
                  </div>

                  <div className="mt-5 space-y-2">
                    <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        Submission Window
                      </p>
                      <p className="mt-1 text-sm font-medium text-foreground">
                        Open through Sunday at 6pm Eastern
                      </p>
                      {scorecardWindow.countdownMessage && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {scorecardWindow.countdownMessage}
                        </p>
                      )}
                    </div>
                    {latestScorecardOverall !== null ? (
                      <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          Last Completed
                        </p>
                        <div className="mt-1 flex items-end gap-2">
                          <span
                            className="text-2xl font-bold font-serif"
                            style={{ color: getScorecardScoreColor(latestScorecardOverall) }}
                          >
                            {latestScorecardOverall}%
                          </span>
                          {latestScorecardDate && (
                            <span className="text-xs text-muted-foreground mb-1">
                              on {latestScorecardDate}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-border/60 bg-background/70 px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                          What You&apos;ll Set
                        </p>
                        <p className="mt-1 text-sm text-foreground">
                          Six scores, reflections, and your Vital Action for the week ahead.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-5 flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {hasAnyScorecards ? "Pick up your weekly rhythm" : "First weekly review"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90">
                      Open weekly review
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5 space-y-3 flex flex-col items-center justify-center text-center min-h-[280px] order-1 sm:order-2">
                <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium">6Cs Scorecard</p>
                <p className="text-sm text-muted-foreground">{scorecardWindow.message}</p>
                <Link
                  href="/scorecard"
                  className="text-xs text-muted-foreground hover:text-accent transition-colors"
                >
                  View scorecard page
                </Link>
              </div>
            )}

            {/* VAPI Overall */}
            {latestVapi ? (
              <Link href={`/assessment/results?id=${latestVapi.id}`} className="block order-2 sm:order-1">
                <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-3 hover:border-accent/30 transition-colors shadow-sm h-full min-h-[280px] flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-muted-foreground">
                          VAPI Score
                        </span>
                      </div>
                      <div className="flex items-end gap-3">
                        <span
                          className="text-4xl font-bold font-serif"
                          style={{ color: getTierColor(getTier(latestVapi.overallScore / 10)) }}
                        >
                          {(latestVapi.overallScore / 10).toFixed(1)}
                        </span>
                        <span
                          className="text-sm font-medium mb-1 px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: getTierColor(getTier(latestVapi.overallScore / 10)) }}
                        >
                          {getTier(latestVapi.overallScore / 10)}
                        </span>
                      </div>
                      {archetype && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {archetype}
                        </p>
                      )}
                    </div>
                    {topStrengths.length > 0 && (
                      <div className="shrink-0 text-right">
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                          Top Strengths
                        </p>
                        {topStrengths.map((d) => {
                          const Icon = DOMAIN_ICONS[d.code];
                          const c = getTierColor(getTier(d.score));
                          return (
                            <div key={d.code} className="flex items-center justify-end gap-1.5 text-xs mb-1">
                              {Icon && <Icon className="h-3 w-3 shrink-0" style={{ color: c }} />}
                              <span className="truncate">{d.name.split(" ")[0]}</span>
                              <span className="font-medium shrink-0" style={{ color: c }}>{d.score.toFixed(1)}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {archetype && (
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 w-full">
                      {ARCHETYPE_DESCRIPTIONS[archetype]}
                    </p>
                  )}
                  <p className="text-xs font-medium text-accent pt-1">
                    Explore My Score →
                  </p>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5 space-y-3 flex flex-col items-center justify-center text-center order-2 sm:order-1">
                <Activity className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Take the VAPI to understand where you&apos;re aligned and where you&apos;re not
                </p>
                <Link
                  href="/assessment"
                  className="text-sm text-accent font-medium hover:underline"
                >
                  Start Assessment
                </Link>
              </div>
            )}
          </div>

          {/* Archetype + Critical Priorities */}
          {latestVapi && (
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Archetype */}
              {archetype && (
                <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-3 shadow-sm h-full flex flex-col justify-between">
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Founder Archetype
                  </h2>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                      {ArchetypeIcon && (
                        <ArchetypeIcon className="h-5 w-5 shrink-0" style={{ color: archetypeColor }} />
                      )}
                      {archetype}
                    </h3>
                    {archetypeTagline ? (
                      <p className="text-sm italic text-muted-foreground leading-relaxed">
                        {archetypeTagline}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ARCHETYPE_DESCRIPTIONS[archetype]}
                      </p>
                    )}
                    <div className="border-t border-border pt-4 space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {isAlignedMomentum
                          ? "What's Fueling This"
                          : "Likely Driver"}
                      </p>
                      {isAlignedMomentum ? (
                        <>
                          <div className="flex items-center gap-2">
                            <DriverIcon
                              driver={dashboardDriverName!}
                              size={18}
                              className="h-[18px] w-[18px] shrink-0"
                            />
                            <p className="text-sm font-semibold text-foreground">
                              {ALIGNED_MOMENTUM_CONTENT.name}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            &quot;{ALIGNED_MOMENTUM_CONTENT.coreState}&quot;
                          </p>
                        </>
                      ) : driver ? (
                        <>
                          <div className="flex items-center gap-2">
                            <DriverIcon
                              driver={dashboardDriverName!}
                              size={18}
                              className="h-[18px] w-[18px] shrink-0"
                            />
                            <p className="text-sm font-semibold text-foreground">
                              {driver.name}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            &quot;{driver.coreBelief}&quot;
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {driverFallbackLabel}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 border-t border-border">
                    <Link
                      href={`/assessment/results?id=${latestVapi.id}`}
                      className="text-xs text-accent font-medium hover:underline"
                    >
                      {driver || isAlignedMomentum
                        ? "View full assessment →"
                        : "View assessment →"}
                    </Link>
                    <Link
                      href={chatQueryUrl(
                        buildArchetypeCoachPrompt(archetype, archetypeDriverSummary)
                      )}
                      className="text-xs text-accent font-medium hover:underline"
                    >
                      Coach this archetype →
                    </Link>
                  </div>
                </div>
              )}

              {/* Critical Priorities — always expanded */}
              {focusHereFirstItems.length > 0 && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Focus Here First
                      </h2>
                    </div>
                    <Link
                      href={`/assessment/results?id=${latestVapi.id}#where-to-focus`}
                      className="text-xs text-accent font-medium hover:underline"
                    >
                      Explore More →
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {focusHereFirstItems.map((item) => {
                      const Icon = DOMAIN_ICONS[item.domain];
                      const color = getTierColor(getTier(item.score));
                      return (
                        <Link
                          key={item.domain}
                          href={chatQueryUrl(buildDashboardPriorityPrompt(item))}
                          className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3 hover:border-accent/40 transition-colors"
                        >
                          {Icon && <Icon className="h-4 w-4 text-accent" />}
                          <span className="text-sm flex-1">{item.domainName}</span>
                          <span className="text-xs text-muted-foreground hidden sm:inline">
                            Coach →
                          </span>
                          <span className="text-sm font-bold shrink-0" style={{ color }}>
                            {item.score.toFixed(1)}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Arena Breakdown */}
          {latestVapi && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Arena Breakdown
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {ARENAS.map((arena) => {
                  const score = latestVapi.arenaScores[arena.key] || 0;
                  const tier = getTier(score);
                  const color = getTierColor(tier);

                  return (
                    <div
                      key={arena.key}
                      className="rounded-xl border border-border bg-card/80 p-4 space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{arena.label}</h3>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded text-white"
                          style={{ backgroundColor: color }}
                        >
                          {tier}
                        </span>
                      </div>
                      <div className="text-2xl font-bold font-serif" style={{ color }}>
                        {score.toFixed(1)}
                      </div>
                      <div className="space-y-1.5">
                        {arena.domains.map((code) => {
                          const domain = DOMAINS.find((d) => d.code === code)!;
                          const dScore = latestVapi.domainScores[code] || 0;
                          const dColor = getTierColor(getTier(dScore));
                          const Icon = DOMAIN_ICONS[code];
                          return (
                            <div key={code} className="flex items-center gap-2">
                              {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-accent" />}
                              <span className="text-xs text-muted-foreground flex-1 truncate">
                                {domain.name}
                              </span>
                              <div className="w-16 h-1.5 bg-muted rounded-full">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${(dScore / 10) * 100}%`,
                                    backgroundColor: dColor,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium w-6 text-right" style={{ color: dColor }}>
                                {dScore.toFixed(1)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6Cs History Trend */}
          {scorecardEntries.length > 1 && (
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <TrendingUp className="h-4 w-4 text-accent shrink-0" />
                  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    6Cs Trend
                  </h2>
                </div>
                {sixCsCoachHref && (
                  <Link
                    href={sixCsCoachHref}
                    className="text-xs text-accent font-medium hover:underline shrink-0 whitespace-nowrap"
                  >
                    Coach on 6Cs →
                  </Link>
                )}
              </div>
              <div className="rounded-xl border border-border overflow-hidden w-full min-w-0">
                <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: "touch" }}>
                  <table className="w-full text-sm" style={{ tableLayout: "fixed" }}>
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left px-2 py-2 font-medium text-muted-foreground w-[22%]">
                          Week
                        </th>
                        {SCORECARD_CATEGORIES.map((c) => (
                          <th key={c.key} className="text-center px-0.5 py-2 font-medium text-muted-foreground text-[10px] w-[10%]">
                            {c.label.slice(0, 3)}
                          </th>
                        ))}
                        <th className="text-center px-1 py-2 font-medium text-muted-foreground w-[12%]">
                          Avg
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scorecardEntries.slice(0, 8).map((entry) => (
                        <tr key={entry.id} className="border-b border-border last:border-0">
                          <td className="px-2 py-2 text-muted-foreground truncate text-xs">
                            {new Date(entry.weekStart).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          {SCORECARD_CATEGORIES.map((c) => (
                            <td key={c.key} className="text-center px-0.5 py-2 font-medium text-xs">
                              {entry.scores[c.key] || 0}%
                            </td>
                          ))}
                          <td className="text-center px-1 py-2 font-bold text-accent text-xs">
                            {getOverallScore(entry.scores)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Results Over Time — only when >1 assessment */}
          {vapiResults.length > 1 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Results Over Time
              </h2>
              <div className="space-y-2">
                {(historyExpanded ? vapiResults : vapiResults.slice(0, 1)).map((r) => {
                  const tier = getTier(r.overallScore / 10);
                  const color = getTierColor(tier);
                  return (
                    <Link
                      key={r.id}
                      href={`/assessment/results?id=${r.id}`}
                      className="flex items-center justify-between rounded-xl border border-border bg-card/80 p-4 hover:border-accent/30 transition-colors shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.archetype}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold font-serif" style={{ color }}>
                          {(r.overallScore / 10).toFixed(1)}
                        </div>
                        <div className="text-xs" style={{ color }}>
                          {tier}
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {vapiResults.length > 1 && !historyExpanded && (
                  <button
                    type="button"
                    onClick={() => setHistoryExpanded(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-accent/30 transition-colors"
                  >
                    <ChevronDown className="h-4 w-4" />
                    View {vapiResults.length - 1} more
                  </button>
                )}
                {historyExpanded && vapiResults.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setHistoryExpanded(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronUp className="h-4 w-4" />
                    Show less
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 pb-4">
            <Link
              href="/chat"
              className="flex items-center gap-3 rounded-xl border border-border bg-card/80 p-4 hover:border-accent/30 transition-colors shadow-sm"
            >
              <MessageSquare className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Talk to Coach</span>
            </Link>
            <Link
              href="/assessment"
              className="flex items-center gap-3 rounded-xl border border-border bg-card/80 p-4 hover:border-accent/30 transition-colors shadow-sm"
            >
              <Activity className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">
                {latestVapi ? "Retake VAPI" : "Take VAPI"}
              </span>
            </Link>
            <Link
              href="/priorities"
              className="flex items-center gap-3 rounded-xl border border-border bg-card/80 p-4 hover:border-accent/30 transition-colors shadow-sm"
            >
              <AlertTriangle className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Priorities</span>
            </Link>
            <Link
              href="/scorecard"
              className="flex items-center gap-3 rounded-xl border border-border bg-card/80 p-4 hover:border-accent/30 transition-colors shadow-sm"
            >
              <ClipboardCheck className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">Weekly 6Cs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
