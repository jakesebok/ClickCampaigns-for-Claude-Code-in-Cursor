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
} from "lucide-react";
import { getTier, getTierColor, ARCHETYPE_DESCRIPTIONS, getPriorityMatrix, type VapiArchetype } from "@/lib/vapi/scoring";
import { ARENAS, DOMAINS } from "@/lib/vapi/quiz-data";
import { SCORECARD_CATEGORIES, getOverallScore } from "@/lib/scorecard";

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
  weekStart: string;
  scores: Record<string, number>;
  notes: string | null;
};

type OneThing = {
  oneThing: string;
  weekStart: string;
};

const QUAD_COLORS: Record<string, string> = {
  "Critical Priority": "bg-red-500/15 border-red-500/30",
  "Protect & Sustain": "bg-green-500/15 border-green-500/30",
  Monitor: "bg-yellow-500/15 border-yellow-500/30",
  "Possible Over-Investment": "bg-blue-500/15 border-blue-500/30",
};

export default function DashboardPage() {
  const [vapiResults, setVapiResults] = useState<VapiResult[]>([]);
  const [scorecardEntries, setScorecardEntries] = useState<ScorecardEntry[]>([]);
  const [oneThing, setOneThing] = useState<OneThing | null>(null);
  const [loading, setLoading] = useState(true);
  const [focusExpanded, setFocusExpanded] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/vapi").then((r) => r.json()).catch(() => ({ results: [] })),
      fetch("/api/scorecard").then((r) => r.json()).catch(() => ({ entries: [], currentWeek: null })),
      fetch("/api/one-thing").then((r) => r.json()).catch(() => ({ current: null })),
    ]).then(([vapiData, scorecardData, oneThingData]) => {
      setVapiResults(vapiData.results || []);
      const allEntries = [
        ...(scorecardData.currentWeek ? [scorecardData.currentWeek] : []),
        ...(scorecardData.entries || []),
      ];
      setScorecardEntries(allEntries);
      setOneThing(oneThingData.current || null);
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

  const latestVapi = vapiResults[0] || null;
  const latestScorecard = scorecardEntries[0] || null;
  const archetype = latestVapi?.archetype as VapiArchetype | undefined;
  const priorityItems = latestVapi
    ? getPriorityMatrix(latestVapi.domainScores, latestVapi.importance || {})
    : [];
  const criticalPriorities = priorityItems.filter((p) => p.quadrant === "Critical Priority");

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
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Your alignment at a glance
          </h2>
          {/* Vital Action Banner */}
          {oneThing && (
            <div className="rounded-2xl border-2 border-accent/30 bg-accent/5 p-5 flex items-center gap-4">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  This Week&apos;s Vital Action
                </p>
                <p className="font-medium truncate">{oneThing.oneThing}</p>
              </div>
              <Link
                href="/one-thing"
                className="shrink-0 text-accent hover:text-accent/80 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}

          {/* Score Cards Row */}
          <div className="grid sm:grid-cols-2 gap-4 -mt-2">
            {/* VAPI Overall */}
            {latestVapi ? (
              <Link href={`/assessment/results?id=${latestVapi.id}`} className="block">
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
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5 space-y-3 flex flex-col items-center justify-center text-center">
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

            {/* 6Cs Latest */}
            {latestScorecard ? (
              <Link href="/scorecard" className="block">
                <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-3 hover:border-accent/30 transition-colors shadow-sm h-full min-h-[280px] flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium text-muted-foreground">
                        6Cs Score
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Week of {new Date(latestScorecard.weekStart).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-end gap-3 mb-3">
                    <span className="text-4xl font-bold font-serif text-accent">
                      {getOverallScore(latestScorecard.scores)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {SCORECARD_CATEGORIES.map((c) => {
                      const Icon = SCORECARD_ICONS[c.icon];
                      const pct = latestScorecard.scores[c.key] || 0;
                      return (
                        <div
                          key={c.key}
                          className="flex flex-col items-center p-2.5 rounded-xl border border-border bg-background/50"
                        >
                          {Icon && <Icon className="h-5 w-5 text-accent mb-1" />}
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            {c.label}
                          </p>
                          <p className="text-lg font-bold tabular-nums text-accent">{pct}%</p>
                          <div className="w-full h-1.5 rounded-full bg-muted/50 mt-1 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-accent transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-5 space-y-3 flex flex-col items-center justify-center text-center">
                <ClipboardCheck className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  Complete your weekly 6Cs scorecard to track alignment
                </p>
                <Link
                  href="/scorecard"
                  className="text-sm text-accent font-medium hover:underline"
                >
                  Fill Out Scorecard
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
                  <div className="rounded-2xl border border-border bg-card/80 p-5 space-y-3 hover:border-accent/30 transition-colors shadow-sm">
                    <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      Founder Archetype
                    </h2>
                    <h3 className="text-xl font-serif font-bold">{archetype}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                      {ARCHETYPE_DESCRIPTIONS[archetype]}
                    </p>
                    <p className="text-xs text-accent font-medium">Explore archetype →</p>
                  </div>
                </Link>
              )}

              {/* Critical Priorities */}
              {criticalPriorities.length > 0 && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 space-y-3 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setFocusExpanded(!focusExpanded)}
                    className="w-full flex items-center justify-between gap-2 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        Focus Here First
                      </h2>
                    </div>
                    {focusExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  <div className="space-y-2">
                    {criticalPriorities.slice(0, 4).map((item) => {
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
                  </div>
                  {focusExpanded && (
                    <p className="text-xs text-muted-foreground pt-2 border-t border-border">
                      High importance, low score — focus here first. These domains matter most to you but need attention.
                    </p>
                  )}
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
                          return (
                            <div key={code} className="flex items-center gap-2">
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
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  6Cs Trend
                </h2>
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/30">
                        <th className="text-left px-4 py-2 font-medium text-muted-foreground">
                          Week
                        </th>
                        {SCORECARD_CATEGORIES.map((c) => (
                          <th key={c.key} className="text-center px-2 py-2 font-medium text-muted-foreground">
                            {c.label.slice(0, 4)}
                          </th>
                        ))}
                        <th className="text-center px-3 py-2 font-medium text-muted-foreground">
                          Avg
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scorecardEntries.slice(0, 8).map((entry) => (
                        <tr key={entry.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                            {new Date(entry.weekStart).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          {SCORECARD_CATEGORIES.map((c) => (
                            <td key={c.key} className="text-center px-2 py-2 font-medium">
                              {entry.scores[c.key] || 0}%
                            </td>
                          ))}
                          <td className="text-center px-3 py-2 font-bold text-accent">
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
