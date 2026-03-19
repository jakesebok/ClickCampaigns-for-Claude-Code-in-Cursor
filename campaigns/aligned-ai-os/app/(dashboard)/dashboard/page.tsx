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
} from "lucide-react";
import { getTier, getTierColor, ARCHETYPE_DESCRIPTIONS, getPriorityMatrix, type VapiArchetype } from "@/lib/vapi/scoring";
import { ARCHETYPE_ACCENT_COLORS, getArchetypeIcon } from "@/lib/vapi/archetype-icons";
import { ARENAS, DOMAINS } from "@/lib/vapi/quiz-data";
import { SCORECARD_CATEGORIES, getOverallScore } from "@/lib/scorecard";
import {
  getScorecardWindow,
  getMostRecentScorecardWindow,
  isDateInScorecardWindow,
  isSameEasternCalendarWeek,
} from "@/lib/scorecard-window";

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
  const [vapiResults, setVapiResults] = useState<VapiResult[]>([]);
  const [scorecardEntries, setScorecardEntries] = useState<ScorecardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [trialBanner, setTrialBanner] = useState<TrialBanner | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/vapi").then((r) => r.json()).catch(() => ({ results: [] })),
      fetch("/api/scorecard").then((r) => r.json()).catch(() => ({ entries: [], currentWeek: null })),
      fetch("/api/settings").then((r) => r.json()).catch(() => null),
    ]).then(([vapiData, scorecardData, settings]) => {
      setVapiResults(vapiData.results || []);
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
  const displayedScorecard =
    currentWindowSubmitted || showFirstSubmissionFallback ? latestScorecard : null;
  let currentOneThing: string | null = null;
  if (latestScorecard?.notes) {
    try {
      const parsed = JSON.parse(latestScorecard.notes) as { oneThing?: string };
      currentOneThing = parsed.oneThing || null;
    } catch {
      currentOneThing = null;
    }
  }
  const archetype = latestVapi?.archetype as VapiArchetype | undefined;
  const ArchetypeIcon = archetype ? getArchetypeIcon(archetype) : null;
  const archetypeColor = archetype ? ARCHETYPE_ACCENT_COLORS[archetype] : undefined;
  const priorityItems = latestVapi
    ? getPriorityMatrix(latestVapi.domainScores, latestVapi.importance || {})
    : [];
  const criticalPriorities = priorityItems.filter((p) => p.quadrant === "Critical Priority");
  const visibleCriticalPriorities = criticalPriorities.slice(0, 3);
  const focusPlaceholders = Math.max(0, 3 - visibleCriticalPriorities.length);

  const topStrengths = latestVapi
    ? DOMAINS.map((d) => ({ ...d, score: latestVapi.domainScores[d.code] || 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
    : [];

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-4xl mx-auto space-y-6">
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
            <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-5 flex items-center gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  This Week&apos;s Vital Action
                </p>
                <p className="font-medium truncate">{currentOneThing}</p>
              </div>
              <Link
                href="/scorecard"
                className="shrink-0 text-accent hover:text-accent/80 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
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
                  This Week&apos;s Vital Action
                </p>
                <p className="font-medium text-muted-foreground">
                  Complete your 6Cs scorecard to set this week&apos;s Vital Action.
                </p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-accent" />
            </Link>
          )}

          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Your alignment at a glance
          </h2>

          {/* Score Cards Row */}
          <div className="grid sm:grid-cols-2 gap-4 -mt-2">
            {/* 6Cs Latest */}
            {displayedScorecard ? (
              <Link href="/scorecard" className="block order-1 sm:order-2">
                <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-3 hover:border-accent/30 transition-colors shadow-sm h-full min-h-[280px] flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-muted-foreground">
                        6Cs Score
                      </span>
                      <span className="text-[10px] font-medium text-green-600 dark:text-green-400 px-1.5 py-0.5 rounded bg-green-500/10">
                        {currentWindowSubmitted ? "Submitted" : "First submission"}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
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
                  <div className="grid grid-cols-3 gap-2">
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
                </div>
              </Link>
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
            ) : !hasAnyScorecards && scorecardWindow.canSubmit ? (
              <Link href="/scorecard" className="block order-1 sm:order-2">
                <div className="rounded-2xl border-2 border-accent/40 bg-accent/5 p-5 space-y-3 hover:border-accent/60 transition-colors shadow-sm h-full min-h-[280px] flex flex-col items-center justify-center text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/20">
                    <ClipboardCheck className="h-6 w-6 text-accent" />
                  </div>
                  <p className="font-semibold text-accent">6Cs Scorecard Available</p>
                  <p className="text-sm text-muted-foreground">{scorecardWindow.message}</p>
                  <p className="text-xs font-mono text-muted-foreground">{scorecardWindow.countdownMessage}</p>
                  <span className="text-sm font-medium text-accent">Fill Out Scorecard →</span>
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
                <Link href={`/assessment/results?id=${latestVapi.id}`} className="block">
                  <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-3 hover:border-accent/30 transition-colors shadow-sm h-full flex flex-col justify-between">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Founder Archetype
                    </h2>
                    <div className="space-y-3">
                      <h3 className="text-xl font-serif font-bold flex items-center gap-2">
                        {ArchetypeIcon && (
                          <ArchetypeIcon className="h-5 w-5 shrink-0" style={{ color: archetypeColor }} />
                        )}
                        {archetype}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-5">
                        {ARCHETYPE_DESCRIPTIONS[archetype]}
                      </p>
                    </div>
                    <p className="text-xs text-accent font-medium">Explore archetype →</p>
                  </div>
                </Link>
              )}

              {/* Critical Priorities — always expanded */}
              {criticalPriorities.length > 0 && (
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
                    {visibleCriticalPriorities.map((item) => {
                      const Icon = DOMAIN_ICONS[item.domain];
                      const color = getTierColor(getTier(item.score));
                      return (
                        <div
                          key={item.domain}
                          className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"
                        >
                          {Icon && <Icon className="h-4 w-4 text-accent" />}
                          <span className="text-sm flex-1">{item.domainName}</span>
                          <span className="text-sm font-bold" style={{ color }}>
                            {item.score.toFixed(1)}
                          </span>
                        </div>
                      );
                    })}
                    {Array.from({ length: focusPlaceholders }, (_, index) => (
                      <div
                        key={`placeholder-${index}`}
                        className="rounded-lg border border-border bg-card/30 p-3 h-[58px] opacity-0 pointer-events-none"
                        aria-hidden
                      />
                    ))}
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
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  6Cs Trend
                </h2>
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
