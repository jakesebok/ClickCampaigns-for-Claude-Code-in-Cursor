"use client";

import { useState, useEffect } from "react";
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
  AlertTriangle,
  Shield,
  Eye,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DOMAIN_INTERPRETATIONS } from "@/lib/vapi/interpretations";
import { getTier, getTierColor, getPriorityMatrix, type PriorityQuadrant } from "@/lib/vapi/scoring";
import { DOMAINS } from "@/lib/vapi/quiz-data";

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity, IA: Compass, ME: Brain, AF: Focus,
  RS: Heart, FA: Home, CO: Users, WI: Globe,
  VS: Telescope, EX: Rocket, OH: Gauge, EC: Leaf,
};

const QUAD_META: Record<
  PriorityQuadrant,
  { icon: React.ElementType; color: string; bg: string; border: string; desc: string }
> = {
  "Critical Priority": {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    desc: "High importance, low score — focus here first",
  },
  "Protect & Sustain": {
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-500/15",
    border: "border-green-500/30",
    desc: "High importance, high score — don't neglect these",
  },
  Monitor: {
    icon: Eye,
    color: "text-yellow-500",
    bg: "bg-yellow-500/15",
    border: "border-yellow-500/30",
    desc: "Lower importance, lower score — keep an eye on these",
  },
  "Possible Over-Investment": {
    icon: TrendingDown,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    desc: "Lower importance, high score — could redirect energy",
  },
};

export default function PrioritiesPage() {
  const [vapiResults, setVapiResults] = useState<{ results: Array<{ id: string; domainScores: Record<string, number>; importance: Record<string, number> }> } | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/vapi")
      .then((r) => r.json())
      .then(setVapiResults)
      .catch(() => setVapiResults({ results: [] }));
  }, []);

  const latest = vapiResults?.results?.[0];
  const priorityItems = latest ? getPriorityMatrix(latest.domainScores, latest.importance || {}) : [];
  const byQuadrant = priorityItems.reduce((acc, p) => {
    if (!acc[p.quadrant]) acc[p.quadrant] = [];
    acc[p.quadrant].push(p);
    return acc;
  }, {} as Record<PriorityQuadrant, typeof priorityItems>);

  const quads: PriorityQuadrant[] = [
    "Critical Priority",
    "Protect & Sustain",
    "Monitor",
    "Possible Over-Investment",
  ];

  if (!latest) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Priorities" subtitle="Your priority matrix" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Take the VAPI assessment to see your priority matrix.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90"
            >
              Take Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Priorities" subtitle="Explore your priority matrix" />

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-4">
          {quads.map((quad) => {
            const items = byQuadrant[quad] || [];
            if (items.length === 0) return null;

            const meta = QUAD_META[quad];
            const QIcon = meta.icon;
            const isExpanded = expanded[quad] ?? false;

            return (
              <div
                key={quad}
                className={`rounded-2xl border ${meta.border} ${meta.bg} overflow-hidden shadow-sm`}
              >
                <button
                  type="button"
                  onClick={() => setExpanded((e) => ({ ...e, [quad]: !isExpanded }))}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-black/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <QIcon className={`h-4 w-4 ${meta.color}`} />
                    <span className="font-semibold">{quad}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isExpanded && (
                <div className="px-5 pb-4 space-y-2">
                  {items.map((item) => {
                    const Icon = DOMAIN_ICONS[item.domain];
                    const color = getTierColor(getTier(item.score));
                    const tier = getTier(item.score);
                    const interpretation = DOMAIN_INTERPRETATIONS[item.domain]?.[tier];
                    const isDomainExpanded = expandedDomains[item.domain] ?? false;
                    return (
                      <div
                        key={item.domain}
                        className="rounded-lg border border-border bg-card/50 p-3"
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
                            <div className="text-muted-foreground">{tier}</div>
                          </div>
                          {interpretation && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedDomains((prev) => ({
                                  ...prev,
                                  [item.domain]: !isDomainExpanded,
                                }))
                              }
                              className="p-1 rounded text-muted-foreground hover:text-foreground"
                              aria-label={isDomainExpanded ? "Hide guidance" : "Read guidance"}
                            >
                              {isDomainExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                        {isDomainExpanded && interpretation && (
                          <p className="text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border">
                            {interpretation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                    {meta.desc}
                  </p>
                </div>
                )}
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              href={`/assessment/results?id=${latest.id}`}
              className="text-sm text-accent font-medium hover:underline"
            >
              View full VAPI results →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
