"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  MessageSquare,
  ArrowRight,
  BarChart3,
  AlertTriangle,
  Shield,
  Eye,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  UserCircle,
  BarChart2,
  Briefcase,
} from "lucide-react";
import {
  VapiBreakdownWheel,
  VapiComparativeWheel,
} from "@/components/vapi-wheel";
import { PageHeader } from "@/components/page-header";
import { DOMAIN_INTERPRETATIONS, ARENA_INTERPRETATIONS } from "@/lib/vapi/interpretations";
import {
  getTier,
  getTierColor,
  ARCHETYPE_DESCRIPTIONS,
  getPriorityMatrix,
  type VapiTier,
  type VapiArchetype,
  type PriorityQuadrant,
} from "@/lib/vapi/scoring";
import { ARCHETYPES_FULL } from "@/lib/vapi/archetypes-full";
import { DOMAINS, ARENAS } from "@/lib/vapi/quiz-data";

type MetricKey = "overall" | `arena:${string}` | `domain:${string}`;

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity,  IA: Compass, ME: Brain, AF: Focus,
  RS: Heart, FA: Home, CO: Users, WI: Globe,
  VS: Telescope, EX: Rocket, OH: Gauge, EC: Leaf,
};

const ARENA_ICONS: Record<string, React.ElementType> = {
  personal: UserCircle,
  relationships: Heart,
  business: Briefcase,
};

function ArchetypeSection({ archetype }: { archetype: VapiArchetype }) {
  const [expanded, setExpanded] = useState(false);
  const full = ARCHETYPES_FULL[archetype];
  const short = ARCHETYPE_DESCRIPTIONS[archetype] || "";

  return (
    <div className="rounded-2xl border border-border p-6 space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Your Founder Archetype
      </h2>
      <h3 className="text-2xl font-serif font-bold flex items-center gap-2">
        <UserCircle className="h-6 w-6 text-accent shrink-0" />
        {archetype}
      </h3>
      {full && (
        <>
          <p className="text-muted-foreground text-sm italic">{full.tagline}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {short}
          </p>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Show less" : "Explore archetype"}
          </button>
          {expanded && full && (
            <div className="space-y-4 pt-4 border-t border-border text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Full description</h4>
                <p className="text-muted-foreground leading-relaxed">{full.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">Strength</h4>
                <p className="text-muted-foreground leading-relaxed">{full.strength}</p>
              </div>
              <div>
                <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Shadow</h4>
                <p className="text-muted-foreground leading-relaxed">{full.shadow}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Constraint</h4>
                <p className="text-muted-foreground leading-relaxed">{full.constraint}</p>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-1">Growth path</h4>
                <p className="text-muted-foreground leading-relaxed">{full.growthPath}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Program phase</h4>
                <p className="text-muted-foreground leading-relaxed">{full.programPhase}</p>
              </div>
            </div>
          )}
        </>
      )}
      {!full && <p className="text-muted-foreground text-sm leading-relaxed">{short}</p>}
    </div>
  );
}

const QUADRANT_META: Record<
  PriorityQuadrant,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  "Critical Priority": { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/15", border: "border-red-500/30" },
  "Protect & Sustain": { icon: Shield, color: "text-green-500", bg: "bg-green-500/15", border: "border-green-500/30" },
  Monitor: { icon: Eye, color: "text-yellow-500", bg: "bg-yellow-500/15", border: "border-yellow-500/30" },
  "Possible Over-Investment": { icon: TrendingDown, color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
};

type ResultData = {
  id: string;
  domainScores: Record<string, number>;
  arenaScores: Record<string, number>;
  overallScore: number;
  archetype: string;
  importance: Record<string, number>;
  createdAt: string;
};

function getMetricLabel(metricKey: MetricKey): string {
  if (metricKey === "overall") return "Overall Score";
  if (metricKey.startsWith("arena:")) {
    const key = metricKey.slice(6);
    return ARENAS.find((arena) => arena.key === key)?.label ?? key;
  }
  const code = metricKey.slice(7);
  return DOMAINS.find((domain) => domain.code === code)?.name ?? code;
}

function getMetricIcon(metricKey: MetricKey): React.ElementType {
  if (metricKey === "overall") return BarChart2;
  if (metricKey.startsWith("arena:")) return ARENA_ICONS[metricKey.slice(6)] ?? UserCircle;
  return DOMAIN_ICONS[metricKey.slice(7)] ?? Activity;
}

function getMetricScore(result: ResultData, metricKey: MetricKey): number | null {
  if (metricKey === "overall") return result.overallScore / 10;
  if (metricKey.startsWith("arena:")) return result.arenaScores[metricKey.slice(6)] ?? null;
  return result.domainScores[metricKey.slice(7)] ?? null;
}

function getMetricTier(result: ResultData, metricKey: MetricKey): VapiTier | null {
  const score = getMetricScore(result, metricKey);
  return score == null ? null : getTier(score);
}

function getMetricInterpretation(result: ResultData, metricKey: MetricKey): string {
  const tier = getMetricTier(result, metricKey);
  if (!tier) return "";
  if (metricKey === "overall") return "";
  if (metricKey.startsWith("arena:")) {
    return ARENA_INTERPRETATIONS[metricKey.slice(6)]?.[tier] ?? "";
  }
  return DOMAIN_INTERPRETATIONS[metricKey.slice(7)]?.[tier] ?? "";
}

function ProgressLineChart({
  results,
  metricKey,
}: {
  results: ResultData[];
  metricKey: MetricKey;
}) {
  const ordered = [...results].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const scores = ordered
    .map((entry) => getMetricScore(entry, metricKey))
    .filter((score): score is number => score != null);

  if (scores.length === 0) return null;

  const width = 680;
  const height = 260;
  const padX = 48;
  const padTop = 20;
  const padBottom = 36;
  const chartHeight = height - padTop - padBottom;
  const chartWidth = width - padX * 2;
  const maxY = 10;

  const points = ordered.map((entry, index) => {
    const score = getMetricScore(entry, metricKey) ?? 0;
    const x =
      ordered.length === 1
        ? width / 2
        : padX + (index / (ordered.length - 1)) * chartWidth;
    const y = padTop + ((maxY - score) / maxY) * chartHeight;
    return { x, y, score, label: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {[0, 2, 4, 6, 8, 10].map((tick) => {
          const y = padTop + ((maxY - tick) / maxY) * chartHeight;
          return (
            <g key={tick}>
              <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="4 4" />
              <text x={padX - 12} y={y + 4} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">
                {tick}
              </text>
            </g>
          );
        })}
        <path d={linePath} fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill="hsl(var(--accent))" />
            <circle cx={point.x} cy={point.y} r="2.5" fill="white" />
            <text x={point.x} y={height - 10} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [result, setResult] = useState<ResultData | null>(null);
  const [allResults, setAllResults] = useState<ResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArenas, setExpandedArenas] = useState<Record<string, boolean>>({});
  const [expandedPriorityDomains, setExpandedPriorityDomains] = useState<Record<string, boolean>>({});
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("overall");
  const [selectedProgressMetric, setSelectedProgressMetric] = useState<MetricKey>("overall");
  const [arenaCardsExpanded, setArenaCardsExpanded] = useState(false);
  const [breakdownDropdownOpen, setBreakdownDropdownOpen] = useState(false);
  const [progressDropdownOpen, setProgressDropdownOpen] = useState(false);
  const [progressView, setProgressView] = useState<"line" | "wheel">("line");

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#where-to-focus") {
      const el = document.getElementById("where-to-focus");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  useEffect(() => {
    const load = async () => {
      const [allRes, singleRes] = await Promise.all([
        fetch("/api/vapi").then((r) => r.json()).catch(() => ({ results: [] })),
        id ? fetch(`/api/vapi?id=${id}`).then((r) => r.json()).catch(() => ({})) : Promise.resolve({}),
      ]);
      const all = (allRes.results || []).map((r: { id: string; domainScores: Record<string, number>; arenaScores: Record<string, number>; overallScore: number; archetype: string; importance: Record<string, number>; createdAt: string }) => ({
        id: r.id,
        domainScores: r.domainScores || {},
        arenaScores: r.arenaScores || {},
        overallScore: r.overallScore,
        archetype: r.archetype,
        importance: r.importance || {},
        createdAt: r.createdAt,
      }));
      setAllResults(all);
      if (id && singleRes.result) {
        setResult(singleRes.result);
      } else if (all.length) {
        setResult(all[0]);
      } else {
        setResult(null);
      }
    };
    load().finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      const expanded = window.innerWidth >= 640;
      setArenaCardsExpanded(expanded);
      if (expanded) {
        setExpandedArenas(
          Object.fromEntries(ARENAS.map((arena) => [arena.key, true]))
        );
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">
          Loading results...
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">No results found.</p>
        <button
          onClick={() => router.push("/assessment")}
          className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium"
        >
          Take the Assessment
        </button>
      </div>
    );
  }

  const overallTier = getTier(result.overallScore / 10);
  const overallColor = getTierColor(overallTier);
  const archetype = result.archetype as VapiArchetype;
  const priorityMatrix = getPriorityMatrix(
    result.domainScores,
    result.importance || {}
  );

  const topStrengths = DOMAINS.map((d) => ({ ...d, score: result.domainScores[d.code] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const priorityFocusAreas = DOMAINS.map((d) => ({ ...d, score: result.domainScores[d.code] || 0 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const criticalPriorities = priorityMatrix.filter(
    (p) => p.quadrant === "Critical Priority"
  );
  const protectSustain = priorityMatrix.filter(
    (p) => p.quadrant === "Protect & Sustain"
  );
  const monitor = priorityMatrix.filter((p) => p.quadrant === "Monitor");
  const overInvestment = priorityMatrix.filter(
    (p) => p.quadrant === "Possible Over-Investment"
  );
  const selectedMetricScore = getMetricScore(result, selectedMetric);
  const selectedMetricTier = getMetricTier(result, selectedMetric);
  const selectedMetricColor = selectedMetricTier
    ? getTierColor(selectedMetricTier)
    : overallColor;
  const selectedMetricInterpretation = getMetricInterpretation(result, selectedMetric);
  const sortedResults = [...allResults].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latestProgressResult = sortedResults[0] ?? result;
  const previousProgressResult = sortedResults[1] ?? result;
  const previousProgressScore = getMetricScore(previousProgressResult, selectedProgressMetric);
  const latestProgressScore = getMetricScore(latestProgressResult, selectedProgressMetric);
  const previousProgressTier = getMetricTier(previousProgressResult, selectedProgressMetric);
  const latestProgressTier = getMetricTier(latestProgressResult, selectedProgressMetric);
  const progressChange =
    previousProgressScore != null && latestProgressScore != null
      ? latestProgressScore - previousProgressScore
      : null;
  const previousPriority =
    selectedProgressMetric.startsWith("domain:")
      ? previousProgressResult.importance?.[selectedProgressMetric.slice(7)] ?? null
      : null;
  const latestPriority =
    selectedProgressMetric.startsWith("domain:")
      ? latestProgressResult.importance?.[selectedProgressMetric.slice(7)] ?? null
      : null;
  const metricGroups: Array<{ label: string; items: MetricKey[] }> = [
    { label: "Composite", items: ["overall"] },
    { label: "Arena", items: ARENAS.map((arena) => `arena:${arena.key}` as MetricKey) },
    { label: "Domain", items: DOMAINS.map((domain) => `domain:${domain.code}` as MetricKey) },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Assessment Results"
        subtitle={new Date(result.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      />

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Overall Score + Wheel (matches dashboard alignment at a glance) */}
          <div className="rounded-2xl border border-border bg-card/80 p-6 space-y-6 shadow-sm overflow-visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10 py-4 border-t border-border/60">
              <div className={`flex flex-wrap items-baseline gap-3 ${archetype ? "" : "sm:col-span-2"}`}>
                <span
                  className="text-5xl sm:text-6xl font-bold font-serif"
                  style={{ color: overallColor }}
                >
                  {(result.overallScore / 10).toFixed(1)}
                </span>
                <span className="text-lg text-muted-foreground">/ 10</span>
                <span
                  className="font-semibold px-3 py-1.5 rounded-full text-sm text-white"
                  style={{ backgroundColor: overallColor }}
                >
                  {overallTier}
                </span>
              </div>
              {archetype && (
                <div className="flex flex-col items-start gap-2">
                  <span className="text-sm font-extrabold text-foreground">
                    {archetype}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ARCHETYPE_DESCRIPTIONS[archetype]}
                  </p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-1 border-b border-border/50 w-fit">
                  Top 3 strengths
                </p>
                <ul className="space-y-2.5 mt-2">
                  {topStrengths.map((d) => {
                    const Icon = DOMAIN_ICONS[d.code];
                    const color = getTierColor(getTier(d.score));
                    return (
                      <li key={d.code} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-1.5 text-foreground">
                          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                          {d.name}
                        </span>
                        <span className="font-semibold shrink-0 tabular-nums" style={{ color }}>
                          {d.score.toFixed(1)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-1 border-b border-border/50 w-fit">
                  Priority focus areas
                </p>
                <ul className="space-y-2.5 mt-2">
                  {priorityFocusAreas.map((d) => {
                    const Icon = DOMAIN_ICONS[d.code];
                    const color = getTierColor(getTier(d.score));
                    return (
                      <li key={d.code} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-1.5 text-foreground">
                          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                          {d.name}
                        </span>
                        <span className="font-semibold shrink-0 tabular-nums" style={{ color }}>
                          {d.score.toFixed(1)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Archetype — expandable with full content */}
          <ArchetypeSection archetype={archetype} />

          {/* Explore Your Score */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Explore Your Score
            </h2>
            <p className="text-sm text-muted-foreground">
              Dig into your composite, arena, and domain scores. Choose a metric from the menu or tap a wedge on the wheel.
            </p>
            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm border-l-4 border-l-accent">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {getMetricLabel(selectedMetric)}
                    </p>
                    <div className="lg:hidden relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setBreakdownDropdownOpen((open) => !open)}
                        className="inline-flex items-center gap-1 rounded-full py-1 px-2.5 border border-border bg-background text-[10px] font-medium uppercase tracking-wider text-foreground hover:border-foreground/30 transition-colors max-w-[110px]"
                        aria-haspopup="listbox"
                        aria-expanded={breakdownDropdownOpen}
                      >
                        <span className="truncate">{getMetricLabel(selectedMetric)}</span>
                        <ChevronDown
                          className="w-3 h-3 text-muted-foreground flex-shrink-0 transition-transform"
                          style={{ transform: breakdownDropdownOpen ? "rotate(180deg)" : undefined }}
                        />
                      </button>
                      {breakdownDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 z-20 w-52 bg-background border border-border rounded-lg shadow-lg overflow-hidden max-h-[280px] overflow-y-auto">
                          <div className="space-y-0.5 p-1.5">
                            {metricGroups.map((group) => (
                              <div key={group.label}>
                                <div className="text-[10px] font-semibold text-foreground mt-1.5 first:mt-0 px-2 py-0.5">
                                  {group.label}
                                </div>
                                {group.items.map((metricKey) => {
                                  const Icon = getMetricIcon(metricKey);
                                  const isSelected = selectedMetric === metricKey;
                                  return (
                                    <button
                                      key={`dropdown-${metricKey}`}
                                      type="button"
                                      onClick={() => {
                                        setSelectedMetric(metricKey);
                                        setBreakdownDropdownOpen(false);
                                      }}
                                      className={`flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors border ${
                                        isSelected
                                          ? "bg-foreground text-background border-foreground"
                                          : "border-transparent text-foreground hover:bg-secondary hover:border-border"
                                      }`}
                                    >
                                      <Icon className="w-3 h-3 flex-shrink-0" />
                                      {getMetricLabel(metricKey)}
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap mb-4">
                    <span className="text-4xl sm:text-5xl font-bold font-serif text-foreground">
                      {selectedMetricScore != null ? selectedMetricScore.toFixed(1) : "—"}
                    </span>
                    <span className="text-xl text-muted-foreground">/ 10</span>
                    {selectedMetricTier && (
                      <span
                        className="font-semibold px-3 py-1 rounded-full text-sm text-white"
                        style={{ backgroundColor: selectedMetricColor }}
                      >
                        {selectedMetricTier}
                      </span>
                    )}
                  </div>
                  <VapiBreakdownWheel
                    domainScores={result.domainScores}
                    metricKey={selectedMetric}
                    onMetricSelect={(metricKey) => setSelectedMetric(metricKey as MetricKey)}
                  />
                  <p className="lg:hidden text-center text-xs text-muted-foreground mt-3">
                    Tap a domain to explore your score
                  </p>
                </div>
                <div className="hidden lg:flex lg:w-52 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-4 flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Metric
                  </p>
                  <div className="relative flex-1 min-h-0">
                    <div className="space-y-1 max-h-[370px] overflow-y-auto pr-1">
                      {metricGroups.map((group) => (
                        <div key={`sidebar-${group.label}`}>
                          <div className="text-sm font-semibold text-foreground mt-3 first:mt-0">
                            {group.label}
                          </div>
                          {group.items.map((metricKey) => {
                            const Icon = getMetricIcon(metricKey);
                            const isSelected = selectedMetric === metricKey;
                            return (
                              <button
                                key={`sidebar-${metricKey}`}
                                type="button"
                                onClick={() => setSelectedMetric(metricKey)}
                                className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                                  isSelected
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-transparent text-foreground hover:bg-secondary hover:border-border"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                {getMetricLabel(metricKey)}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {selectedMetricInterpretation && (
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedMetricInterpretation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Arena Scores */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Arena Scores
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 items-start">
              {ARENAS.map((arena) => {
                const score = result.arenaScores[arena.key] || 0;
                const tier = getTier(score);
                const color = getTierColor(tier);
                const isExpanded = expandedArenas[arena.key] ?? false;
                const interpretation = ARENA_INTERPRETATIONS[arena.key]?.[tier];

                return (
                  <div
                    key={arena.key}
                    className="rounded-xl border border-border bg-card/80 p-5 space-y-3 shadow-sm self-start sm:min-h-[260px] flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{arena.label}</h3>
                      <div
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: color }}
                      >
                        {tier}
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-serif" style={{ color }}>
                      {score.toFixed(1)}
                    </div>
                    {!arenaCardsExpanded && interpretation && (
                      <button
                        type="button"
                        onClick={() => setExpandedArenas((e) => ({ ...e, [arena.key]: !isExpanded }))}
                        className="flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {isExpanded ? "Hide" : "Read interpretation"}
                      </button>
                    )}
                    {(arenaCardsExpanded || isExpanded) && interpretation && (
                      <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border mt-auto">
                        {interpretation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Matrix / Where to Focus */}
          {result.importance &&
            Object.keys(result.importance).length > 0 && (
              <div id="where-to-focus" className="space-y-3 scroll-mt-6">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Priority Matrix
                </h2>

                {[
                  { label: "Critical Priority", items: criticalPriorities, desc: "High importance, low score — focus here first" },
                  { label: "Protect & Sustain", items: protectSustain, desc: "High importance, high score — don't neglect these" },
                  { label: "Monitor", items: monitor, desc: "Lower importance, lower score — keep an eye on these" },
                  { label: "Possible Over-Investment", items: overInvestment, desc: "Lower importance, high score — could redirect energy" },
                ].map(
                  (section) =>
                    section.items.length > 0 && (
                      <div
                        key={section.label}
                        className={`rounded-2xl border ${QUADRANT_META[section.label as PriorityQuadrant].border} ${QUADRANT_META[section.label as PriorityQuadrant].bg} p-4 space-y-3 shadow-sm`}
                      >
                        <div className="flex items-center gap-2">
                          {(() => {
                            const meta = QUADRANT_META[section.label as PriorityQuadrant];
                            const QIcon = meta.icon;
                            return (
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${meta.bg} ${meta.color}`}>
                                <QIcon className="h-3.5 w-3.5" />
                                {section.label}
                              </div>
                            );
                          })()}
                          <span className="text-xs text-muted-foreground">
                            {section.desc}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2 items-start">
                          {section.items.map((item) => {
                            const Icon = DOMAIN_ICONS[item.domain];
                            const tier = getTier(item.score);
                            const color = getTierColor(tier);
                            const interpretation = DOMAIN_INTERPRETATIONS[item.domain]?.[tier];
                            const isExpanded = expandedPriorityDomains[item.domain] ?? false;
                            return (
                              <div
                                key={item.domain}
                                className="rounded-lg border border-border bg-card/50 p-3 self-start"
                              >
                                <div className="flex items-center gap-3">
                                  {Icon && <Icon className="h-4 w-4 text-accent" />}
                                  <div className="flex-1">
                                    <span className="text-sm">{item.domainName}</span>
                                    <div className="text-muted-foreground text-xs mt-0.5">
                                      Priority: {item.importance}/10
                                    </div>
                                  </div>
                                  <div className="text-right text-xs">
                                    <div className="font-medium" style={{ color }}>
                                      {item.score.toFixed(1)}
                                    </div>
                                    <div className="text-muted-foreground">
                                      {tier}
                                    </div>
                                  </div>
                                  {interpretation && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedPriorityDomains((prev) => ({
                                          ...prev,
                                          [item.domain]: !isExpanded,
                                        }))
                                      }
                                      className="p-1 rounded text-muted-foreground hover:text-foreground"
                                      aria-label={isExpanded ? "Hide guidance" : "Read guidance"}
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                                {isExpanded && interpretation && (
                                  <p className="text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border">
                                    {interpretation}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                )}
              </div>
            )}

          {/* Progress Over Time — portal-style line graph */}
          {allResults.length >= 2 && (
            <div id="progress-over-time" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress Over Time
              </h2>
              <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">View:</span>
                    <div className="inline-flex rounded-lg border border-border p-0.5 bg-secondary/40" role="tablist" aria-label="Progress view">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={progressView === "line"}
                        onClick={() => setProgressView("line")}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          progressView === "line"
                            ? "bg-background border border-border shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Line Graph
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={progressView === "wheel"}
                        onClick={() => setProgressView("wheel")}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          progressView === "wheel"
                            ? "bg-background border border-border shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Wheel Comparison
                      </button>
                    </div>
                  </div>
                  <div className="lg:hidden flex items-center gap-2 relative">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Metric:</span>
                    <button
                      type="button"
                      onClick={() => setProgressDropdownOpen((open) => !open)}
                      className="inline-flex items-center gap-1 rounded-full py-1 px-2.5 border border-border bg-background text-[10px] font-medium uppercase tracking-wider text-foreground hover:border-foreground/30 transition-colors max-w-[120px]"
                      aria-haspopup="listbox"
                      aria-expanded={progressDropdownOpen}
                    >
                      <span className="truncate">{getMetricLabel(selectedProgressMetric)}</span>
                      <ChevronDown
                        className="w-3 h-3 text-muted-foreground flex-shrink-0 transition-transform"
                        style={{ transform: progressDropdownOpen ? "rotate(180deg)" : undefined }}
                      />
                    </button>
                    {progressDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 z-20 w-52 bg-background border border-border rounded-lg shadow-lg overflow-hidden max-h-[280px] overflow-y-auto">
                        <div className="space-y-0.5 p-1.5">
                          {metricGroups.map((group) => (
                            <div key={`progress-dropdown-${group.label}`}>
                              <div className="text-[10px] font-semibold text-foreground mt-1.5 first:mt-0 px-2 py-0.5">
                                {group.label}
                              </div>
                              {group.items.map((metricKey) => {
                                const Icon = getMetricIcon(metricKey);
                                const isSelected = selectedProgressMetric === metricKey;
                                return (
                                  <button
                                    key={`progress-dropdown-${metricKey}`}
                                    type="button"
                                    onClick={() => {
                                      setSelectedProgressMetric(metricKey);
                                      setProgressDropdownOpen(false);
                                    }}
                                    className={`flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors border ${
                                      isSelected
                                        ? "bg-foreground text-background border-foreground"
                                        : "border-transparent text-foreground hover:bg-secondary hover:border-border"
                                    }`}
                                  >
                                    <Icon className="w-3 h-3 flex-shrink-0" />
                                    {getMetricLabel(metricKey)}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 min-w-0 relative">
                    {progressView === "line" ? (
                      <ProgressLineChart results={allResults} metricKey={selectedProgressMetric} />
                    ) : (
                      <div className="flex flex-col items-center w-full">
                        <VapiComparativeWheel
                          previousDomainScores={previousProgressResult.domainScores}
                          currentDomainScores={latestProgressResult.domainScores}
                          metricKey={selectedProgressMetric}
                          onMetricSelect={(metricKey) =>
                            setSelectedProgressMetric(metricKey as MetricKey)
                          }
                        />
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 w-full text-xs text-muted-foreground">
                          <div className="flex flex-col gap-y-1 items-start">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-gray-500" />
                              Most Recent ({new Date(latestProgressResult.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-gray-400/50" />
                              Previous ({new Date(previousProgressResult.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
                            </span>
                          </div>
                          <div className="flex flex-col gap-y-1 items-start">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-green-500" />
                              Improved
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-red-500" />
                              Declined
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:flex lg:w-52 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-4 flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Metric
                    </p>
                    <div className="relative flex-1 min-h-0 max-h-[370px]">
                      <div className="space-y-1 h-full max-h-[370px] overflow-y-auto pr-1">
                        {metricGroups.map((group) => (
                          <div key={`progress-sidebar-${group.label}`}>
                            <div className="text-sm font-semibold text-foreground mt-3 first:mt-0">
                              {group.label}
                            </div>
                            {group.items.map((metricKey) => {
                              const Icon = getMetricIcon(metricKey);
                              const isSelected = selectedProgressMetric === metricKey;
                              return (
                                <button
                                  key={`progress-sidebar-${metricKey}`}
                                  type="button"
                                  onClick={() => setSelectedProgressMetric(metricKey)}
                                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                                    isSelected
                                      ? "bg-foreground text-background border-foreground"
                                      : "border-transparent text-foreground hover:bg-secondary hover:border-border"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                  {getMetricLabel(metricKey)}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg text-foreground mb-2">What Changed</h3>
                  <div className="pl-1 w-fit grid grid-cols-[auto_auto] gap-x-0 items-center">
                    <span
                      className={`flex items-center justify-center text-4xl font-bold leading-none w-12 flex-shrink-0 ${
                        progressChange != null && progressChange > 0
                          ? "text-green-600"
                          : progressChange != null && progressChange < 0
                            ? "text-red-600"
                            : "text-amber-600"
                      }`}
                      aria-hidden="true"
                    >
                      {progressChange != null ? (progressChange > 0 ? "↑" : progressChange < 0 ? "↓" : "→") : "→"}
                    </span>
                    <div className="min-w-0 grid grid-cols-[auto_auto] gap-x-3 gap-y-1 items-center">
                      <div className="flex flex-col gap-y-1">
                        <span className="font-semibold text-muted-foreground">
                          {getMetricLabel(selectedProgressMetric)}: {previousProgressTier && latestProgressTier
                            ? previousProgressTier === latestProgressTier
                              ? latestProgressTier
                              : `${previousProgressTier} → ${latestProgressTier}`
                            : "Score change"}
                        </span>
                        <span className={`text-sm font-medium ${
                          progressChange != null && progressChange > 0
                            ? "text-green-600"
                            : progressChange != null && progressChange < 0
                              ? "text-red-600"
                              : "text-muted-foreground"
                        }`}>
                          Change: {progressChange != null ? `${progressChange >= 0 ? "+" : ""}${progressChange.toFixed(1)}` : "—"}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground flex flex-col gap-y-1">
                        <span>
                          Previous: {previousProgressScore != null ? `${previousProgressScore.toFixed(1)} / 10${previousProgressTier ? ` (${previousProgressTier})` : ""}` : "—"}
                        </span>
                        <span>
                          Current: {latestProgressScore != null ? `${latestProgressScore.toFixed(1)} / 10${latestProgressTier ? ` (${latestProgressTier})` : ""}` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedProgressMetric.startsWith("domain:") &&
                    previousPriority != null &&
                    latestPriority != null &&
                    Math.abs(latestPriority - previousPriority) >= 3 && (
                      <div className="mt-3 p-3 bg-secondary/40 border border-border rounded-lg">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                          Priority Shift
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          You rated {getMetricLabel(selectedProgressMetric)} as {previousPriority}/10 priority last time and {latestPriority}/10 this time.
                          {latestPriority > previousPriority
                            ? " This area has become significantly more important to you."
                            : " This area has moved down your priority list."}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl border border-border p-6 space-y-4 bg-secondary/30">
            <h2 className="font-serif font-bold text-lg">
              What to Do With These Results
            </h2>
            <p className="text-sm text-muted-foreground">
              ALFRED now has your VAPI scores and can help you create an
              action plan based on your priority areas. Start a coaching conversation
              to turn these insights into weekly priorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/chat"
                className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Talk to Your Coach
              </Link>
              <Link
                href="/assessment"
                className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Retake Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">
            Loading results...
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
