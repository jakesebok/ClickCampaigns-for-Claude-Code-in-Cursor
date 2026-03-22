/**
 * Shared text blocks appended to Alfred's master context for chat + voice.
 * Keeps VAPI / 6Cs / driver / Focus Here First in sync everywhere.
 */

import type { PortalSixCRow, PortalVapiRow } from "@/lib/portal-data";
import { DOMAINS, ARENAS } from "@/lib/vapi/quiz-data";
import {
  getTier,
  getPriorityMatrix,
  ARCHETYPE_DESCRIPTIONS,
  normalizeVapiArchetypeName,
  type VapiArchetype,
} from "@/lib/vapi/scoring";
import { SCORECARD_CATEGORIES, getOverallScore } from "@/lib/scorecard";

type CriticalRow = {
  code?: string;
  domain: string;
  score: number;
  importance: number;
};

function parseResults(row: PortalVapiRow): Record<string, unknown> {
  const r = row.results;
  return r && typeof r === "object" ? (r as Record<string, unknown>) : {};
}

/**
 * VAPI block: domains, arenas, archetype one-liner, Focus Here First (critical priority),
 * driver pattern — matches dashboard semantics where possible.
 */
export function formatVapiCoachContext(row: PortalVapiRow | null | undefined): string {
  if (!row) return "";

  const r = parseResults(row);
  const ds = (r.domainScores as Record<string, number>) || {};
  const as2 = (r.arenaScores as Record<string, number>) || {};
  const overall = typeof r.overall === "number" ? r.overall : 0;
  const tier = getTier(overall);
  const rawArch = (r.archetype as string) || "";
  const archetypeNorm = normalizeVapiArchetypeName(rawArch) || rawArch;

  let ctx = `\n\n---\nVAPI ASSESSMENT (${new Date(row.created_at).toLocaleDateString()})`;
  ctx += `\nOverall: ${overall.toFixed(1)}/10 — ${tier}`;
  ctx += `\nFounder Archetype: ${archetypeNorm}`;
  const archKey = archetypeNorm as VapiArchetype;
  if (archKey && ARCHETYPE_DESCRIPTIONS[archKey]) {
    ctx += `\nArchetype essence (for coaching tone): ${ARCHETYPE_DESCRIPTIONS[archKey]}`;
  }

  for (const arena of ARENAS) {
    const arenaScore = as2[arena.label] ?? as2[arena.key] ?? 0;
    ctx += `\n\n${arena.label}: ${arenaScore.toFixed(1)}/10 — ${getTier(arenaScore)}`;
    for (const code of arena.domains) {
      const domain = DOMAINS.find((d) => d.code === code)!;
      ctx += `\n  ${domain.name}: ${(ds[code] || 0).toFixed(1)} — ${getTier(ds[code] as number || 0)}`;
    }
  }

  const importance = (r.importanceRatings as Record<string, number>) || {};
  let criticalRows: CriticalRow[] = [];
  const pm = r.priorityMatrix as
    | { criticalPriority?: CriticalRow[] }
    | undefined;
  if (Array.isArray(pm?.criticalPriority) && pm.criticalPriority.length > 0) {
    criticalRows = pm.criticalPriority.map((x) => ({
      code: x.code,
      domain: x.domain,
      score: x.score,
      importance: x.importance,
    }));
  } else if (Object.keys(ds).length > 0 && Object.keys(importance).length > 0) {
    const computed = getPriorityMatrix(ds, importance).filter(
      (p) => p.quadrant === "Critical Priority"
    );
    criticalRows = computed.map((p) => ({
      code: p.domain,
      domain: p.domainName,
      score: p.score,
      importance: p.importance,
    }));
  }

  if (criticalRows.length > 0) {
    ctx += `\n\nFOCUS HERE FIRST (Critical Priority — high importance, low score; prioritize these when advising plans):`;
    for (const c of criticalRows.slice(0, 6)) {
      ctx += `\n  • ${c.domain} (${c.score.toFixed(1)}/10, importance ${c.importance}/10)`;
    }
  }

  const assigned = r.assignedDriver as string | null | undefined;
  const driverState = r.driverState as string | undefined;
  const secondary = r.secondaryDriver as string | undefined;
  if (assigned || driverState) {
    ctx += `\n\nDRIVER PATTERN (VAPI):`;
    if (assigned) ctx += `\n  Primary: ${assigned}`;
    if (driverState) ctx += `\n  State: ${driverState}`;
    if (secondary) ctx += `\n  Secondary: ${secondary}`;
    ctx += `\n  Coach for exits, boundaries, and language that fits this pattern — not generic discipline advice.`;
  }

  return ctx;
}

function summarizeWeeklyReview(wr: Record<string, unknown> | null | undefined): string {
  if (!wr || typeof wr !== "object") return "";
  try {
    const s = JSON.stringify(wr);
    if (s.length <= 1500) return s;
    return `${s.slice(0, 1500)}…`;
  } catch {
    return "";
  }
}

/**
 * Recent 6Cs submissions: scores, Vital Action line, week-over-week deltas, weekly_review payload.
 */
export function formatScorecardCoachContext(entries: PortalSixCRow[]): string {
  if (!entries.length) return "";

  let ctx = `\n\n---\nRECENT 6Cs SCORECARDS`;

  if (entries.length >= 2) {
    const latest = entries[0];
    const prev = entries[1];
    const latestScores = latest.scores || {};
    const prevScores = prev.scores || {};

    const deltas: { label: string; delta: number; current: number }[] = [];
    for (const c of SCORECARD_CATEGORIES) {
      const a = latestScores[c.key] || 0;
      const b = prevScores[c.key] || 0;
      deltas.push({ label: c.label, delta: a - b, current: a });
    }
    deltas.sort((x, y) => x.delta - y.delta);
    const worst = deltas[0];
    const best = deltas[deltas.length - 1];

    let lowest = { label: SCORECARD_CATEGORIES[0].label, val: 101 as number };
    for (const c of SCORECARD_CATEGORIES) {
      const v = latestScores[c.key];
      if (typeof v === "number" && v < lowest.val) {
        lowest = { label: c.label, val: v };
      }
    }

    ctx += `\n\n6Cs SNAPSHOT (most recent vs prior submission):`;
    ctx += `\n  Lowest this week: ${lowest.label} (${lowest.val}%)`;
    ctx += `\n  Largest change vs prior: ${worst.label} (${worst.delta >= 0 ? "+" : ""}${worst.delta}%)`;
    ctx += `\n  Best improvement vs prior: ${best.label} (${best.delta >= 0 ? "+" : ""}${best.delta}%)`;
  }

  for (const entry of entries.slice(0, 4)) {
    const scores = entry.scores || {};
    const overall = getOverallScore(scores);
    ctx += `\n\nWeek of ${new Date(entry.created_at).toLocaleDateString()}: overall ${overall}%`;
    for (const c of SCORECARD_CATEGORIES) {
      ctx += `\n  ${c.label}: ${scores[c.key] || 0}%`;
    }
    if (entry.one_thing_to_improve) {
      ctx += `\n  Stated Vital Action / one thing to improve: ${entry.one_thing_to_improve}`;
    }
    const wr = entry.weekly_review;
    if (wr && typeof wr === "object") {
      const flat = wr as Record<string, unknown>;
      if (Object.keys(flat).length > 0) {
        ctx += `\n  Weekly review (structured): ${summarizeWeeklyReview(flat)}`;
      }
    }
  }

  return ctx;
}
