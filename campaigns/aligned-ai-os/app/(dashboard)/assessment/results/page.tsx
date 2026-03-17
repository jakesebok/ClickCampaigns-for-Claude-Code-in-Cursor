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
} from "lucide-react";
import { VapiWheel } from "@/components/vapi-wheel";
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

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity,  IA: Compass, ME: Brain, AF: Focus,
  RS: Heart, FA: Home, CO: Users, WI: Globe,
  VS: Telescope, EX: Rocket, OH: Gauge, EC: Leaf,
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

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [result, setResult] = useState<ResultData | null>(null);
  const [allResults, setAllResults] = useState<ResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArenas, setExpandedArenas] = useState<Record<string, boolean>>({});
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

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
          <div className="rounded-2xl border border-border bg-card/80 p-6 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="flex-1 space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Overall Score
                </h2>
                <div className="flex items-end gap-3">
                  <span
                    className="text-5xl sm:text-6xl font-bold font-serif"
                    style={{ color: overallColor }}
                  >
                    {(result.overallScore / 10).toFixed(1)}
                  </span>
                  <span
                    className="text-sm font-medium mb-1 px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: overallColor }}
                  >
                    {overallTier}
                  </span>
                </div>
                {archetype && (
                  <p className="text-sm text-muted-foreground">
                    {archetype}
                  </p>
                )}
                {topStrengths.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                      Top Strengths
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {topStrengths.map((d) => {
                        const Icon = DOMAIN_ICONS[d.code];
                        const c = getTierColor(getTier(d.score));
                        return (
                          <div key={d.code} className="flex items-center gap-1.5 text-xs">
                            {Icon && <Icon className="h-3 w-3 shrink-0" style={{ color: c }} />}
                            <span>{d.name.split(" ")[0]}</span>
                            <span className="font-medium" style={{ color: c }}>{d.score.toFixed(1)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center shrink-0">
                <VapiWheel domainScores={result.domainScores} />
              </div>
            </div>
          </div>

          {/* Archetype — expandable with full content */}
          <ArchetypeSection archetype={archetype} />

          {/* Progress Over Time — when 2+ assessments */}
          {allResults.length >= 2 && (
            <div id="progress-over-time" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress Over Time
              </h2>
              <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
                <div className="flex flex-col gap-4">
                  {[...allResults]
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map((r, i) => {
                      const score = r.overallScore / 10;
                      const tier = getTier(score);
                      const color = getTierColor(tier);
                      const pct = Math.min(100, (score / 10) * 100);
                      return (
                        <div key={r.id} className="space-y-1.5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {new Date(r.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span className="font-medium" style={{ color }}>
                              {score.toFixed(1)} — {tier}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${pct}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* Arena Scores */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Arena Scores
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {ARENAS.map((arena) => {
                const score = result.arenaScores[arena.key] || 0;
                const tier = getTier(score);
                const color = getTierColor(tier);
                const isExpanded = expandedArenas[arena.key] ?? false;
                const interpretation = ARENA_INTERPRETATIONS[arena.key]?.[tier];

                return (
                  <div
                    key={arena.key}
                    className="rounded-xl border border-border bg-card/80 p-5 space-y-3 shadow-sm"
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
                    {interpretation && (
                      <button
                        type="button"
                        onClick={() => setExpandedArenas((e) => ({ ...e, [arena.key]: !isExpanded }))}
                        className="flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {isExpanded ? "Hide" : "Read interpretation"}
                      </button>
                    )}
                    {isExpanded && interpretation && (
                      <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border">
                        {interpretation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Domain Breakdown */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Domain Breakdown
            </h2>
            {ARENAS.map((arena) => (
              <div key={arena.key} className="space-y-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider pt-2">
                  {arena.label}
                </h3>
                {arena.domains.map((code) => {
                  const domain = DOMAINS.find((d) => d.code === code)!;
                  const score = result.domainScores[code] || 0;
                  const tier = getTier(score);
                  const color = getTierColor(tier);
                  const Icon = DOMAIN_ICONS[code];
                  const imp = result.importance?.[code];
                  const isExpanded = expandedDomains[code] ?? false;
                  const interpretation = DOMAIN_INTERPRETATIONS[code]?.[tier];

                  return (
                    <div
                      key={code}
                      className="rounded-xl border border-border bg-card/80 p-4 shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="h-5 w-5 text-accent shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{domain.name}</span>
                            {imp != null && (
                              <span className="text-xs text-muted-foreground">
                                (importance: {imp}/10)
                              </span>
                            )}
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full mt-1.5">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${(score / 10) * 100}%`,
                                backgroundColor: color,
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm font-bold" style={{ color }}>
                            {score.toFixed(1)}
                          </div>
                          <div className="text-[10px]" style={{ color }}>
                            {tier}
                          </div>
                        </div>
                        {interpretation && (
                          <button
                            type="button"
                            onClick={() => setExpandedDomains((e) => ({ ...e, [code]: !isExpanded }))}
                            className="p-1 rounded text-muted-foreground hover:text-foreground"
                            aria-label={isExpanded ? "Hide interpretation" : "Read interpretation"}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
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
            ))}
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
                        <div className="grid sm:grid-cols-2 gap-2">
                          {section.items.map((item) => {
                            const Icon = DOMAIN_ICONS[item.domain];
                            const tier = getTier(item.score);
                            const color = getTierColor(tier);
                            return (
                              <div
                                key={item.domain}
                                className="flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"
                              >
                                {Icon && <Icon className="h-4 w-4 text-accent" />}
                                <div className="flex-1">
                                  <span className="text-sm">{item.domainName}</span>
                                </div>
                                <div className="text-right text-xs">
                                  <div className="font-medium" style={{ color }}>
                                    {item.score.toFixed(1)}
                                  </div>
                                  <div className="text-muted-foreground">
                                    imp: {item.importance}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                )}
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
