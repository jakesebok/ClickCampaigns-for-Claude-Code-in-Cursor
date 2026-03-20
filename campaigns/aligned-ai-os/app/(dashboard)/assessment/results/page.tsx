"use client";

import { useState, useEffect, useRef, Suspense } from "react";
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
  getRankedArenas,
  type VapiTier,
  type VapiArchetype,
  type PriorityQuadrant,
} from "@/lib/vapi/scoring";
import { ARCHETYPES_FULL } from "@/lib/vapi/archetypes-full";
import { ARCHETYPE_ACCENT_COLORS, getArchetypeIcon } from "@/lib/vapi/archetype-icons";
import { DOMAINS, ARENAS } from "@/lib/vapi/quiz-data";
import {
  ALIGNED_MOMENTUM_CONTENT,
  ALIGNED_MOMENTUM_NAME,
  DRIVER_CONTENT,
  getDriverFallbackContent,
  getDriverState,
  type VapiAssignedDriverName,
  type VapiDriverFallbackType,
  type VapiDriverName,
  type VapiDriverState,
} from "@/lib/vapi/drivers";
import { DRIVER_ACCENT_COLORS, DriverIcon } from "@/lib/vapi/driver-icons";
import { getDriverTransitionSummary } from "@/lib/vapi/driver-progress";
import { VAPI_PROGRESS_TRANSITIONS } from "@/lib/vapi/progress-transitions";

type MetricKey = "overall" | `arena:${string}` | `domain:${string}`;

function coerceDriverName(
  value: string | null | undefined
): VapiDriverName | null {
  return value && value in DRIVER_CONTENT ? (value as VapiDriverName) : null;
}

function coerceAssignedDriverName(
  value: string | null | undefined
): VapiAssignedDriverName | null {
  if (!value) return null;
  if (value === ALIGNED_MOMENTUM_NAME) return ALIGNED_MOMENTUM_NAME;
  return value in DRIVER_CONTENT ? (value as VapiDriverName) : null;
}

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity,  IA: Compass, ME: Brain, AF: Focus,
  RS: Heart, FA: Home, CO: Users, WI: Globe,
  VS: Telescope, EX: Rocket, OH: Gauge, EC: Leaf,
};

const ARENA_ICONS: Record<string, React.ElementType> = {
  personal: BarChart2,
  relationships: Heart,
  business: Briefcase,
};

function ArchetypeSection({
  archetype,
  arenaScores,
}: {
  archetype: VapiArchetype;
  arenaScores: Record<string, number>;
}) {
  const [expanded, setExpanded] = useState(false);
  const full = ARCHETYPES_FULL[archetype];
  const short = ARCHETYPE_DESCRIPTIONS[archetype] || "";
  const ArchetypeIcon = getArchetypeIcon(archetype);
  const archetypeColor = ARCHETYPE_ACCENT_COLORS[archetype];
  const rankedArenas =
    archetype === "The Rising Architect"
      ? getRankedArenas(arenaScores)
      : null;
  const laggingArena = rankedArenas?.[0];
  const secondArena = rankedArenas?.[1];
  const strongestArena = rankedArenas?.[2];

  return (
    <div className="rounded-2xl border border-border p-6 space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Your Founder Archetype
      </h2>
      <h3 className="text-2xl font-serif font-bold flex items-center gap-2">
        <ArchetypeIcon className="h-6 w-6 shrink-0" style={{ color: archetypeColor }} />
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
          {archetype === "The Rising Architect" &&
            laggingArena &&
            secondArena &&
            strongestArena && (
              <div className="rounded-xl border border-accent/25 bg-accent/5 p-4 text-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  Your Lagging Arena
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Your {laggingArena.label} arena ({laggingArena.score.toFixed(1)}) is the
                  area holding you back from full Architect status. Focus here. Your{" "}
                  {secondArena.label} ({secondArena.score.toFixed(1)}) and{" "}
                  {strongestArena.label} ({strongestArena.score.toFixed(1)}) are already
                  strong enough. Close this gap and everything reinforces.
                </p>
              </div>
            )}
          <div className="border-t border-border/70 pt-4">
            <Link
              href="/archetypes"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Learn more about all founder archetypes{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      )}
      {!full && (
        <>
          <p className="text-muted-foreground text-sm leading-relaxed">{short}</p>
          <div className="border-t border-border/70 pt-4">
            <Link
              href="/archetypes"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Learn more about all founder archetypes{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function DriverSection({
  assignedDriver,
  secondaryDriver,
  driverScores,
  topDriverScore,
  driverState,
  driverFallbackType,
}: {
  assignedDriver: string | null;
  secondaryDriver?: string | null;
  driverScores?: Record<string, number>;
  topDriverScore?: number;
  driverState?: VapiDriverState;
  driverFallbackType?: VapiDriverFallbackType;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    mechanism: false,
    cost: false,
    wayOut: false,
    alignedShowUp: false,
    alignedPossible: false,
    alignedProtect: false,
  });

  const resolvedDriverState = getDriverState({
    assignedDriver: coerceAssignedDriverName(assignedDriver),
    driverFallbackType,
  });
  const normalizedDriverState = driverState || resolvedDriverState;
  const isAlignedMomentum = normalizedDriverState === "aligned_momentum";
  const driverName =
    !isAlignedMomentum && assignedDriver && assignedDriver in DRIVER_CONTENT
      ? (assignedDriver as VapiDriverName)
      : null;
  const secondaryDriverName =
    !isAlignedMomentum && secondaryDriver && secondaryDriver in DRIVER_CONTENT
      ? (secondaryDriver as VapiDriverName)
      : null;
  const driver = driverName ? DRIVER_CONTENT[driverName] : null;
  const secondary = secondaryDriverName
    ? DRIVER_CONTENT[secondaryDriverName]
    : null;
  const strength =
    driverName && driverScores
      ? Math.max(topDriverScore ?? 0, driverScores[driverName] ?? 0)
      : topDriverScore ?? 0;
  const accent = isAlignedMomentum
    ? ALIGNED_MOMENTUM_CONTENT.colorAccent
    : driverName
      ? DRIVER_ACCENT_COLORS[driverName]
      : "#FF6B1A";
  const note =
    "This driver is identified based on patterns in your scores and priorities. It represents the most likely internal pattern producing your results. It is a hypothesis, not a diagnosis. If it resonates, it's a powerful starting point. If it doesn't fully fit, your detailed scores and intake reflection will surface a more precise picture.";
  const alignedMomentumNote =
    "Aligned Momentum reflects the current state of your internal operating system based on your VAPI scores. It is not permanent. It's maintained through ongoing practice, honest self-assessment, and the boundaries and habits that produced it. Retake the VAPI regularly to confirm this state is holding.";
  const fallbackContent = getDriverFallbackContent(driverFallbackType || "standard");

  return (
    <div
      id="driver-section"
      className="scroll-mt-24 rounded-2xl border border-border bg-gradient-to-br from-accent/5 via-card/90 to-background p-6 shadow-sm space-y-5"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {isAlignedMomentum
            ? "What&apos;s Fueling This Pattern"
            : "What&apos;s Driving This Pattern"}
        </p>
        {isAlignedMomentum ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border"
                  style={{
                    backgroundColor: `${accent}14`,
                    borderColor: `${accent}33`,
                  }}
                >
                  <DriverIcon driver={ALIGNED_MOMENTUM_NAME} size={64} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    {ALIGNED_MOMENTUM_CONTENT.name}
                  </h2>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    {ALIGNED_MOMENTUM_CONTENT.tagline}
                  </p>
                </div>
              </div>
            </div>
            <blockquote
              className="rounded-xl border-l-4 px-4 py-4 text-xl sm:text-2xl font-serif font-semibold leading-tight text-foreground"
              style={{
                borderLeftColor: accent,
                backgroundColor: `${accent}14`,
              }}
            >
              &quot;{ALIGNED_MOMENTUM_CONTENT.coreState}&quot;
            </blockquote>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ALIGNED_MOMENTUM_CONTENT.description}
            </p>
            <div className="space-y-3">
              {[
                {
                  key: "alignedShowUp",
                  title: "How This Shows Up in Your Scores",
                  body: ALIGNED_MOMENTUM_CONTENT.howThisShowsUp,
                },
                {
                  key: "alignedPossible",
                  title: "What This Makes Possible",
                  body: ALIGNED_MOMENTUM_CONTENT.whatThisMakesPossible,
                },
                {
                  key: "alignedProtect",
                  title: "How to Protect It",
                  body: ALIGNED_MOMENTUM_CONTENT.howToProtectIt,
                },
              ].map((section) => {
                const isOpen = expanded[section.key];
                return (
                  <div
                    key={section.key}
                    className="rounded-xl border border-border bg-background/70"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((current) => ({
                          ...current,
                          [section.key]: !current[section.key],
                        }))
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {section.title}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-4 py-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {section.body}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="space-y-4 border-t border-border/70 pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {alignedMomentumNote}
              </p>
              <Link
                href="/drivers"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Explore all driver patterns <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        ) : driver ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border"
                  style={{
                    backgroundColor: `${accent}14`,
                    borderColor: `${accent}33`,
                  }}
                >
                  <DriverIcon driver={driverName!} size={64} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    {driver.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Core fear:</span>{" "}
                    {driver.coreFear}
                  </p>
                </div>
              </div>
              <span
                className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{
                  borderColor: `${accent}33`,
                  backgroundColor: `${accent}14`,
                  color: accent,
                }}
              >
                Pattern strength: {strength} / {driver.maxPossible}
              </span>
            </div>
            <blockquote
              className="rounded-xl border-l-4 px-4 py-4 text-xl sm:text-2xl font-serif font-semibold leading-tight text-foreground"
              style={{
                borderLeftColor: accent,
                backgroundColor: `${accent}14`,
              }}
            >
              &quot;{driver.coreBelief}&quot;
            </blockquote>
            <p className="text-sm italic text-muted-foreground leading-relaxed">
              {driver.tagline}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {driver.description}
            </p>
            <div className="space-y-3">
              {[
                {
                  key: "mechanism" as const,
                  title: "How This Shows Up in Your Scores",
                  body: driver.mechanism,
                },
                {
                  key: "cost" as const,
                  title: "What This Is Costing You",
                  body: driver.whatItCosts,
                },
                {
                  key: "wayOut" as const,
                  title: "The Way Out",
                  body: driver.theWayOut,
                },
              ].map((section) => {
                const isOpen = expanded[section.key];
                return (
                  <div
                    key={section.key}
                    className="rounded-xl border border-border bg-background/70"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((current) => ({
                          ...current,
                          [section.key]: !current[section.key],
                        }))
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {section.title}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-4 py-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {section.body}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="space-y-4 border-t border-border/70 pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {note}
              </p>
              <Link
                href="/drivers"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Learn more about all driver patterns <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {secondary && (
              <div className="space-y-3 border-t border-border/70 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Secondary Pattern
                </p>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: `${DRIVER_ACCENT_COLORS[secondaryDriverName!]}14`,
                      borderColor: `${DRIVER_ACCENT_COLORS[secondaryDriverName!]}33`,
                    }}
                  >
                    <DriverIcon driver={secondaryDriverName!} size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {secondary.name}
                    </h3>
                    <p className="text-sm italic text-muted-foreground">
                      &quot;{secondary.coreBelief}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {secondary.tagline}
                    </p>
                    <Link
                      href="/drivers"
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                    >
                      Learn more about all driver patterns <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {fallbackContent.heading}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {fallbackContent.text}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {note}
            </p>
            {normalizedDriverState === "no_driver" && (
              <Link
                href="/drivers"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Explore all driver patterns in the Driver Library{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
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
  assignedDriver: string | null;
  secondaryDriver: string | null;
  driverScores: Record<string, number>;
  topDriverScore: number;
  secondaryDriverScore: number | null;
  primaryToSecondaryMargin: number;
  driverState: VapiDriverState;
  driverFallbackType: VapiDriverFallbackType;
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
  if (metricKey.startsWith("arena:")) return ARENA_ICONS[metricKey.slice(6)] ?? BarChart2;
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

type ProgressNarrative = {
  key: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  body: string;
  previousBelief?: string | null;
  currentBelief?: string | null;
  previousScore?: string;
  currentScore?: string;
  change?: string;
  changeDirection?: "up" | "down" | "same";
  detailLines?: string[];
  supportingNote?: string;
  linkHref?: string;
  linkLabel?: string;
};

const PROGRESS_TRANSITIONS = VAPI_PROGRESS_TRANSITIONS as Record<
  string,
  Record<string, string>
>;

function formatTransitionLabel(previousTier: VapiTier, currentTier: VapiTier) {
  return previousTier === currentTier
    ? `Maintained ${currentTier}`
    : `${previousTier} to ${currentTier}`;
}

function formatMetricScore(score: number | null, tier: VapiTier | null) {
  if (score == null) return "--";
  return `${score.toFixed(1)} / 10${tier ? ` (${tier})` : ""}`;
}

function getChangeDirection(
  change: number | null
): "up" | "down" | "same" {
  if (change == null || change === 0) return "same";
  return change > 0 ? "up" : "down";
}

function formatDriverSummaryLine(
  label: string,
  driverName: VapiDriverName | null,
  score: number | null | undefined
) {
  if (!driverName || typeof score !== "number") {
    return `${label}: None`;
  }
  return `${label}: ${driverName} (${score} points)`;
}

function formatPrimaryDriverDetailLine(
  driverState: VapiDriverState,
  driverName: VapiAssignedDriverName | null,
  score: number | null | undefined
) {
  if (driverState === "aligned_momentum" || driverName === ALIGNED_MOMENTUM_NAME) {
    return `Current state: ${ALIGNED_MOMENTUM_NAME}`;
  }
  return formatDriverSummaryLine(
    "Primary driver",
    driverName && driverName in DRIVER_CONTENT ? (driverName as VapiDriverName) : null,
    score
  );
}

function formatSecondaryDriverDetailLine(
  driverState: VapiDriverState,
  driverName: VapiDriverName | null,
  score: number | null | undefined
) {
  if (driverState === "aligned_momentum") {
    return "Secondary driver: None";
  }
  return formatDriverSummaryLine("Secondary driver", driverName, score);
}

function getSecondaryDriverTransitionNote(
  previousState: VapiDriverState,
  currentState: VapiDriverState,
  previousDriver: VapiDriverName | null,
  currentDriver: VapiDriverName | null
) {
  if (
    previousState === "aligned_momentum" ||
    currentState === "aligned_momentum"
  ) {
    return null;
  }
  if (!previousDriver && currentDriver) {
    return `A secondary pattern has emerged: ${currentDriver}. This suggests a second internal driver is becoming active alongside your primary pattern. Read more in the Driver Library.`;
  }
  if (previousDriver && !currentDriver) {
    return `Your secondary pattern (${previousDriver}) is no longer detected. Your primary driver is now more dominant, or the secondary pattern has been addressed.`;
  }
  if (previousDriver && currentDriver && previousDriver !== currentDriver) {
    return `Your secondary pattern has shifted from ${previousDriver} to ${currentDriver}. The underlying influence on your behavior is evolving. Explore both patterns in the Driver Library.`;
  }
  if (previousDriver && currentDriver && previousDriver === currentDriver) {
    return `Your secondary pattern (${currentDriver}) remains consistent alongside your primary driver.`;
  }
  return null;
}

function getMetricTransitionLookupKey(metricKey: MetricKey) {
  if (metricKey === "overall") return "overall";
  if (metricKey.startsWith("arena:")) return getMetricLabel(metricKey);
  return metricKey.slice(7);
}

function getMetricTransitionNarrative(
  previousResult: ResultData,
  currentResult: ResultData,
  metricKey: MetricKey
): ProgressNarrative | null {
  const previousScore = getMetricScore(previousResult, metricKey);
  const currentScore = getMetricScore(currentResult, metricKey);
  const previousTier = getMetricTier(previousResult, metricKey);
  const currentTier = getMetricTier(currentResult, metricKey);

  if (!previousTier || !currentTier) return null;

  const transitionLabel = formatTransitionLabel(previousTier, currentTier);
  const transitionText =
    PROGRESS_TRANSITIONS[getMetricTransitionLookupKey(metricKey)]?.[
      previousTier === currentTier
        ? `Maintained ${currentTier}`
        : `${previousTier} → ${currentTier}`
    ] ?? "";
  const change =
    previousScore != null && currentScore != null
      ? currentScore - previousScore
      : null;
  const metricLabel =
    metricKey === "overall" ? "Composite Score" : getMetricLabel(metricKey);

  return {
    key: metricKey,
    eyebrow:
      metricKey === "overall"
        ? "Composite Score Transition"
        : metricKey.startsWith("arena:")
          ? "Arena Transition"
          : "Domain Transition",
    title: metricLabel,
    subtitle: transitionLabel,
    body: transitionText,
    previousScore: `Previous: ${formatMetricScore(previousScore, previousTier)}`,
    currentScore: `Current: ${formatMetricScore(currentScore, currentTier)}`,
    change:
      change != null
        ? `Change: ${change >= 0 ? "+" : ""}${change.toFixed(1)}`
        : undefined,
    changeDirection: getChangeDirection(change),
  };
}

function getArchetypeTransitionNarrative(
  previousArchetype: string | null,
  currentArchetype: string | null
): ProgressNarrative | null {
  if (!previousArchetype && !currentArchetype) return null;

  const isArchitectFamily = (value: string | null) =>
    value === "The Architect" || value === "The Rising Architect";

  if (
    previousArchetype === "The Rising Architect" &&
    currentArchetype === "The Rising Architect"
  ) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Is Consistent",
      subtitle: "Still showing up as The Rising Architect",
      body: "You're still almost there. Your overall profile remains strong and near-integrated, but the lagging arena from your last assessment still hasn't closed the gap. The comfort of 'almost there' is the real risk at this level. You have the capability and the foundation. What you need is the willingness to give your weakest arena the same intensity you gave everything else. Look at the specific domains pulling that arena down. They are your highest-leverage targets for the next assessment period.",
    };
  }

  if (
    previousArchetype &&
    currentArchetype === "The Rising Architect" &&
    previousArchetype !== "The Architect" &&
    previousArchetype !== "The Rising Architect"
  ) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Has Shifted",
      subtitle: `${previousArchetype} to The Rising Architect`,
      body: "You've moved from an imbalanced or deficit pattern into near-integration. Most of your arenas are operating at a high level. One area is still lagging but the gap is closeable. Read your Rising Architect results carefully. The lagging arena callout shows you exactly where to focus.",
    };
  }

  if (
    previousArchetype === "The Rising Architect" &&
    currentArchetype === "The Architect"
  ) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Has Shifted",
      subtitle: "The Rising Architect to The Architect",
      body: "You closed the gap. The arena that was lagging has caught up and all three arenas are now operating at the Dialed level. You've achieved genuine integration. This is the rarest and most valuable state on this assessment. Protect it.",
    };
  }

  if (
    previousArchetype === "The Architect" &&
    currentArchetype === "The Rising Architect"
  ) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Has Shifted",
      subtitle: "The Architect to The Rising Architect",
      body: "You've lost the integration you had built. One arena has slipped below full Architect level, even though most of your profile is still strong. Read your Rising Architect results carefully. The lagging arena callout shows you exactly where to focus before the gap widens.",
    };
  }

  if (
    previousArchetype === "The Rising Architect" &&
    currentArchetype &&
    currentArchetype !== "The Architect"
  ) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Has Shifted",
      subtitle: `The Rising Architect to ${currentArchetype}`,
      body: "You've moved away from near-integration. The lagging arena that kept you just short of Architect status is no longer the only issue in the pattern. Compare your latest archetype and score breakdown carefully to see where the reinforcing cycle weakened.",
    };
  }

  if (
    previousArchetype &&
    currentArchetype === "The Architect" &&
    !isArchitectFamily(previousArchetype)
  ) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Has Shifted",
      subtitle: `${previousArchetype} to The Architect`,
      body: "You've moved into genuine integration. Your personal, relational, and business arenas are now reinforcing each other instead of competing. Protect this. The systems and habits that got you here are worth defending.",
    };
  }

  if (previousArchetype && currentArchetype && previousArchetype === currentArchetype) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Is Consistent",
      subtitle: `Still showing up as ${currentArchetype}`,
      body: `Your score shape still maps most closely to ${currentArchetype}. The same pattern across your personal, relational, and business scores is still present in your results. Revisit the archetype section above to see where this pattern is supporting you and where it is still constraining you.`,
    };
  }

  if (previousArchetype && currentArchetype) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Has Shifted",
      subtitle: `${previousArchetype} to ${currentArchetype}`,
      body: `Your latest score pattern now maps most closely to ${currentArchetype} instead of ${previousArchetype}. That suggests the way your personal, relational, and business scores relate to each other has changed. Compare the two archetype sections to see which strengths became more dominant and which constraints have surfaced.`,
    };
  }

  if (currentArchetype) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Founder Archetype Identified",
      subtitle: currentArchetype,
      body: `This assessment maps clearly to ${currentArchetype}. Use the archetype section above to understand the dominant score shape currently defining your results.`,
    };
  }

  return {
    key: "archetype",
    eyebrow: "Archetype Transition",
    title: "Founder Archetype Unclear",
    body: "Your latest assessment does not map cleanly to a single archetype pattern. Review the score breakdown to see which arena is pulling the pattern away from your prior results.",
  };
}

function getDirectionClasses(direction: "up" | "down" | "same" | undefined) {
  if (direction === "up") return "text-green-600";
  if (direction === "down") return "text-red-600";
  return "text-amber-600";
}

function getScrollIndicatorState(element: HTMLDivElement | null) {
  if (!element) {
    return { showUp: false, showDown: false };
  }
  const showUp = element.scrollTop > 8;
  const showDown =
    element.scrollHeight - element.scrollTop - element.clientHeight > 8;
  return { showUp, showDown };
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
  const priorityValues = ordered.map((entry) =>
    metricKey.startsWith("domain:") ? entry.importance?.[metricKey.slice(7)] ?? null : null
  );
  const hasPriorityLine = priorityValues.some((value) => value != null);

  if (scores.length === 0) return null;

  const width = 680;
  const height = 520;
  const padX = 48;
  const padTop = 20;
  const padBottom = 28;
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
  const priorityPoints = ordered.map((entry, index) => {
    const value = metricKey.startsWith("domain:")
      ? entry.importance?.[metricKey.slice(7)] ?? null
      : null;
    if (value == null) return null;
    const x =
      ordered.length === 1
        ? width / 2
        : padX + (index / (ordered.length - 1)) * chartWidth;
    const y = padTop + ((maxY - value) / maxY) * chartHeight;
    return { x, y, value, label: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
  });
  const priorityLinePath = priorityPoints
    .map((point, index) => {
      if (!point) return "";
      const prefix = priorityPoints.slice(0, index).some(Boolean) ? "L" : "M";
      return `${prefix} ${point.x} ${point.y}`;
    })
    .filter(Boolean)
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
        {hasPriorityLine && priorityLinePath && (
          <path
            d={priorityLinePath}
            fill="none"
            stroke="rgba(88,34,51,0.7)"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        <line
          x1={padX}
          x2={width - padX}
          y1={padTop + ((maxY - 8) / maxY) * chartHeight}
          y2={padTop + ((maxY - 8) / maxY) * chartHeight}
          stroke="rgba(212, 170, 112, 0.7)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill="hsl(var(--accent))" />
            <circle cx={point.x} cy={point.y} r="2.5" fill="white" />
            <text x={point.x} y={height - 10} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">
              {point.label}
            </text>
          </g>
        ))}
        {priorityPoints.map((point) =>
          point ? (
            <g key={`priority-${point.label}`}>
              <circle cx={point.x} cy={point.y} r="4" fill="rgba(88,34,51,0.85)" />
              <circle cx={point.x} cy={point.y} r="2" fill="white" />
            </g>
          ) : null
        )}
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
  const breakdownSidebarRef = useRef<HTMLDivElement | null>(null);
  const progressSidebarRef = useRef<HTMLDivElement | null>(null);
  const [breakdownSidebarIndicators, setBreakdownSidebarIndicators] = useState({
    showUp: false,
    showDown: false,
  });
  const [progressSidebarIndicators, setProgressSidebarIndicators] = useState({
    showUp: false,
    showDown: false,
  });

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
      const all = (allRes.results || []).map((r: {
        id: string;
        domainScores: Record<string, number>;
        arenaScores: Record<string, number>;
        overallScore: number;
        archetype: string;
        importance: Record<string, number>;
        assignedDriver?: string | null;
        secondaryDriver?: string | null;
        driverScores?: Record<string, number>;
        topDriverScore?: number;
        secondaryDriverScore?: number | null;
        primaryToSecondaryMargin?: number;
        driverState?: VapiDriverState;
        driverFallbackType?: VapiDriverFallbackType;
        createdAt: string;
      }) => ({
        id: r.id,
        domainScores: r.domainScores || {},
        arenaScores: r.arenaScores || {},
        overallScore: r.overallScore,
        archetype: r.archetype,
        importance: r.importance || {},
        assignedDriver: r.assignedDriver || null,
        secondaryDriver: r.secondaryDriver || null,
        driverScores: r.driverScores || {},
        topDriverScore: r.topDriverScore || 0,
        secondaryDriverScore: r.secondaryDriverScore ?? null,
        primaryToSecondaryMargin: r.primaryToSecondaryMargin ?? 0,
        driverState:
          r.driverState ||
          getDriverState({
            assignedDriver: coerceAssignedDriverName(r.assignedDriver),
            driverFallbackType: r.driverFallbackType || "standard",
          }),
        driverFallbackType: r.driverFallbackType || "standard",
        createdAt: r.createdAt,
      }));
      setAllResults(all);
      if (id && singleRes.result) {
        setResult({
          ...singleRes.result,
          driverState:
            singleRes.result.driverState ||
            getDriverState({
              assignedDriver: coerceAssignedDriverName(
                singleRes.result.assignedDriver
              ),
              driverFallbackType:
                singleRes.result.driverFallbackType || "standard",
            }),
          driverFallbackType: singleRes.result.driverFallbackType || "standard",
        });
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncIndicators = () => {
      setBreakdownSidebarIndicators(
        getScrollIndicatorState(breakdownSidebarRef.current)
      );
      setProgressSidebarIndicators(
        getScrollIndicatorState(progressSidebarRef.current)
      );
    };

    syncIndicators();
    window.addEventListener("resize", syncIndicators);
    return () => window.removeEventListener("resize", syncIndicators);
  }, [result, allResults, selectedMetric, selectedProgressMetric, progressView]);

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
  const ArchetypeIcon = getArchetypeIcon(archetype);
  const archetypeColor = ARCHETYPE_ACCENT_COLORS[archetype];
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
  const previousPriority =
    selectedProgressMetric.startsWith("domain:")
      ? previousProgressResult.importance?.[selectedProgressMetric.slice(7)] ?? null
      : null;
  const latestPriority =
    selectedProgressMetric.startsWith("domain:")
      ? latestProgressResult.importance?.[selectedProgressMetric.slice(7)] ?? null
      : null;
  const compositeTransition = getMetricTransitionNarrative(
    previousProgressResult,
    latestProgressResult,
    "overall"
  );
  const archetypeTransition = getArchetypeTransitionNarrative(
    previousProgressResult.archetype || null,
    latestProgressResult.archetype || null
  );
  const previousAssignedDriver = coerceAssignedDriverName(
    previousProgressResult.assignedDriver
  );
  const currentAssignedDriver = coerceAssignedDriverName(
    latestProgressResult.assignedDriver
  );
  const previousSecondaryDriver = coerceDriverName(
    previousProgressResult.secondaryDriver
  );
  const currentSecondaryDriver = coerceDriverName(
    latestProgressResult.secondaryDriver
  );
  const driverTransition = getDriverTransitionSummary(
    previousProgressResult.driverState,
    latestProgressResult.driverState,
    previousAssignedDriver,
    currentAssignedDriver
  );
  const secondaryDriverTransitionNote = getSecondaryDriverTransitionNote(
    previousProgressResult.driverState,
    latestProgressResult.driverState,
    previousSecondaryDriver,
    currentSecondaryDriver
  );
  const selectedMetricTransition =
    selectedProgressMetric === "overall"
      ? null
      : getMetricTransitionNarrative(
          previousProgressResult,
          latestProgressResult,
          selectedProgressMetric
        );
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
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
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${archetypeColor}20`, color: archetypeColor }}
                  >
                    <ArchetypeIcon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-extrabold text-foreground">
                    {archetype}
                  </span>
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
          <ArchetypeSection archetype={archetype} arenaScores={result.arenaScores} />

          <DriverSection
            assignedDriver={result.assignedDriver}
            secondaryDriver={result.secondaryDriver}
            driverScores={result.driverScores}
            topDriverScore={result.topDriverScore}
            driverState={result.driverState}
            driverFallbackType={result.driverFallbackType}
          />

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
                    <div
                      ref={breakdownSidebarRef}
                      onScroll={(event) =>
                        setBreakdownSidebarIndicators(
                          getScrollIndicatorState(event.currentTarget)
                        )
                      }
                      className="space-y-1 max-h-[370px] overflow-y-auto pr-1"
                    >
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
                    {breakdownSidebarIndicators.showUp && (
                      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-2 pb-6 bg-gradient-to-b from-background to-transparent pointer-events-none">
                        <ChevronUp className="w-5 h-5 text-foreground/70" />
                      </div>
                    )}
                    {breakdownSidebarIndicators.showDown && (
                      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-2 pt-6 bg-gradient-to-t from-background to-transparent pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-foreground/70" />
                      </div>
                    )}
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
            <div className="grid sm:grid-cols-3 gap-4 items-start sm:items-stretch">
              {ARENAS.map((arena) => {
                const score = result.arenaScores[arena.key] || 0;
                const tier = getTier(score);
                const color = getTierColor(tier);
                const isExpanded = expandedArenas[arena.key] ?? false;
                const interpretation = ARENA_INTERPRETATIONS[arena.key]?.[tier];

                return (
                  <div
                    key={arena.key}
                    className="rounded-xl border border-border bg-card/80 p-5 space-y-3 shadow-sm self-start sm:self-stretch sm:min-h-[260px] h-auto sm:h-full flex flex-col"
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
                      <div
                        ref={progressSidebarRef}
                        onScroll={(event) =>
                          setProgressSidebarIndicators(
                            getScrollIndicatorState(event.currentTarget)
                          )
                        }
                        className="space-y-1 h-full max-h-[370px] overflow-y-auto pr-1"
                      >
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
                      {progressSidebarIndicators.showUp && (
                        <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-2 pb-6 bg-gradient-to-b from-background to-transparent pointer-events-none">
                          <ChevronUp className="w-5 h-5 text-foreground/70" />
                        </div>
                      )}
                      {progressSidebarIndicators.showDown && (
                        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-2 pt-6 bg-gradient-to-t from-background to-transparent pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-foreground/70" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg text-foreground mb-2">What Changed</h3>
                  <div className="space-y-3">
                    {[
                      compositeTransition,
                      archetypeTransition,
                      {
                        key: "driver",
                        eyebrow: "Driver Transition",
                        title: driverTransition.heading,
                        subtitle: driverTransition.subheading,
                        body: driverTransition.body,
                        previousBelief: driverTransition.previousBelief,
                        currentBelief: driverTransition.currentBelief,
                        changeDirection: driverTransition.direction,
                        detailLines: [
                          formatPrimaryDriverDetailLine(
                            latestProgressResult.driverState,
                            currentAssignedDriver,
                            latestProgressResult.topDriverScore
                          ),
                          formatSecondaryDriverDetailLine(
                            latestProgressResult.driverState,
                            currentSecondaryDriver,
                            latestProgressResult.secondaryDriverScore
                          ),
                        ],
                        supportingNote: secondaryDriverTransitionNote ?? undefined,
                        linkHref: "/drivers",
                        linkLabel: "Explore all driver patterns in the Driver Library >",
                      } satisfies ProgressNarrative,
                      selectedMetricTransition,
                    ]
                      .filter((item): item is ProgressNarrative => Boolean(item))
                      .map((item) => (
                        <div
                          key={item.key}
                          className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3"
                        >
                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                              {item.eyebrow}
                            </p>
                            <h4 className="text-base font-semibold text-foreground">
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-sm text-muted-foreground">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          {(item.previousScore || item.currentScore || item.change) && (
                            <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
                              {item.previousScore && <span>{item.previousScore}</span>}
                              {item.currentScore && <span>{item.currentScore}</span>}
                              {item.change && (
                                <span
                                  className={`font-medium ${getDirectionClasses(
                                    item.changeDirection
                                  )}`}
                                >
                                  {item.change}
                                </span>
                              )}
                            </div>
                          )}
                          {(item.previousBelief || item.currentBelief) && (
                            <div className="space-y-2">
                              {item.previousBelief && item.currentBelief && item.previousBelief !== item.currentBelief ? (
                                <>
                                  <blockquote className="rounded-lg border border-border bg-background/70 px-4 py-3 text-sm italic text-muted-foreground line-through opacity-70">
                                    &quot;{item.previousBelief}&quot;
                                  </blockquote>
                                  <blockquote className="rounded-lg border-l-4 border-accent bg-background px-4 py-3 text-sm font-medium italic text-foreground">
                                    &quot;{item.currentBelief}&quot;
                                  </blockquote>
                                </>
                              ) : (
                                <blockquote className="rounded-lg border-l-4 border-accent bg-background px-4 py-3 text-sm font-medium italic text-foreground">
                                  &quot;{item.currentBelief || item.previousBelief}&quot;
                                </blockquote>
                              )}
                            </div>
                          )}
                          {item.detailLines && item.detailLines.length > 0 && (
                            <div className="space-y-1 text-sm text-muted-foreground">
                              {item.detailLines.map((line) => (
                                <p key={`${item.key}-${line}`}>{line}</p>
                              ))}
                            </div>
                          )}
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {item.body}
                          </p>
                          {item.supportingNote && (
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {item.supportingNote}
                            </p>
                          )}
                          {item.linkHref && item.linkLabel && (
                            <Link
                              href={item.linkHref}
                              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                            >
                              {item.linkLabel}
                            </Link>
                          )}
                        </div>
                      ))}
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
