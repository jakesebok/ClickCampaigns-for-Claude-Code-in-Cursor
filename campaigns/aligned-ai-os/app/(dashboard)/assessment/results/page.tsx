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
} from "lucide-react";
import {
  getTier,
  getTierColor,
  ARCHETYPE_DESCRIPTIONS,
  getPriorityMatrix,
  type VapiTier,
  type VapiArchetype,
  type PriorityQuadrant,
} from "@/lib/vapi/scoring";
import { DOMAINS, ARENAS } from "@/lib/vapi/quiz-data";

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity,  IA: Compass, ME: Brain, AF: Focus,
  RS: Heart, FA: Home, CO: Users, WI: Globe,
  VS: Telescope, EX: Rocket, OH: Gauge, EC: Leaf,
};

const QUADRANT_META: Record<
  PriorityQuadrant,
  { icon: React.ElementType; color: string; bg: string }
> = {
  "Critical Priority": { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10" },
  "Protect & Sustain": { icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
  Monitor: { icon: Eye, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  "Possible Over-Investment": { icon: TrendingDown, color: "text-blue-400", bg: "bg-blue-400/10" },
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      fetch("/api/vapi")
        .then((r) => r.json())
        .then((data) => {
          if (data.results?.length) setResult(data.results[0]);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }

    fetch(`/api/vapi?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.result) setResult(data.result);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
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
      <header className="px-6 py-4 border-b border-border">
        <h1 className="text-lg font-semibold">VAPI Results</h1>
        <p className="text-sm text-muted-foreground">
          {new Date(result.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Overall Score */}
          <div className="rounded-2xl border border-border p-6 text-center space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Overall Score
            </h2>
            <div className="text-6xl font-bold font-serif" style={{ color: overallColor }}>
              {(result.overallScore / 10).toFixed(1)}
            </div>
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
              style={{ backgroundColor: overallColor }}
            >
              {overallTier}
            </div>
          </div>

          {/* Archetype */}
          <div className="rounded-2xl border border-border p-6 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Your Founder Archetype
            </h2>
            <h3 className="text-2xl font-serif font-bold">{archetype}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {ARCHETYPE_DESCRIPTIONS[archetype] || ""}
            </p>
          </div>

          {/* Arena Scores */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Arena Scores
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {ARENAS.map((arena) => {
                const score = (result.arenaScores[arena.key] || 0);
                const tier = getTier(score);
                const color = getTierColor(tier);

                return (
                  <div
                    key={arena.key}
                    className="rounded-xl border border-border p-5 space-y-3"
                  >
                    <h3 className="font-medium">{arena.label}</h3>
                    <div className="text-3xl font-bold font-serif" style={{ color }}>
                      {score.toFixed(1)}
                    </div>
                    <div
                      className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                      style={{ backgroundColor: color }}
                    >
                      {tier}
                    </div>
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

                  return (
                    <div
                      key={code}
                      className="flex items-center gap-3 rounded-xl border border-border p-4"
                    >
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
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Priority Matrix */}
          {result.importance &&
            Object.keys(result.importance).length > 0 && (
              <div className="space-y-3">
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
                      <div key={section.label} className="space-y-2">
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
                                className="flex items-center gap-3 rounded-lg border border-border p-3"
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
              Your APOS coach now has your VAPI scores and can help you create an
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
