/**
 * Per-user Daily Spark text (push body is shortened in the cron handler).
 * Uses portal VAPI + 6Cs when available; otherwise rotates generic prompts.
 */

import { MORNING_PROMPTS } from "@/lib/ai/prompts";
import { fetchPortalSixCByEmail, fetchPortalVapiByEmail } from "@/lib/portal-data";
import { ALIGNED_MOMENTUM_NAME } from "@/lib/vapi/drivers";
import { SCORECARD_CATEGORIES } from "@/lib/scorecard";
import { getPriorityMatrix } from "@/lib/vapi/scoring";

type CriticalRow = { domain: string; score: number; importance: number };

function extractCriticalFromResults(r: Record<string, unknown>): CriticalRow[] {
  const pm = r.priorityMatrix as { criticalPriority?: CriticalRow[] } | undefined;
  if (Array.isArray(pm?.criticalPriority) && pm.criticalPriority.length > 0) {
    return pm.criticalPriority;
  }
  const ds = (r.domainScores as Record<string, number>) || {};
  const imp = (r.importanceRatings as Record<string, number>) || {};
  if (Object.keys(ds).length === 0 || Object.keys(imp).length === 0) return [];
  return getPriorityMatrix(ds, imp)
    .filter((p) => p.quadrant === "Critical Priority")
    .map((p) => ({
      domain: p.domainName,
      score: p.score,
      importance: p.importance,
    }));
}

export async function pickPersonalizedMorningPrompt(
  email: string,
  fallbackIndex: number
): Promise<string> {
  const safeFallback =
    MORNING_PROMPTS[Math.abs(fallbackIndex) % MORNING_PROMPTS.length];

  try {
    const [vapiRows, sixRows] = await Promise.all([
      fetchPortalVapiByEmail(email),
      fetchPortalSixCByEmail(email),
    ]);

    if (vapiRows.length > 0) {
      const r = vapiRows[0].results as Record<string, unknown>;
      const critical = extractCriticalFromResults(r);
      const top = critical.sort((a, b) => a.score - b.score)[0];
      if (top) {
        return `Good morning — your Focus Here First includes ${top.domain} (${top.score.toFixed(1)}/10, high importance). What's one honest move today that cares for that without trashing your Vital Action?`;
      }

      const driver = r.assignedDriver as string | undefined;
      const driverState = r.driverState as string | undefined;
      if (
        driver &&
        driverState === "dysfunction_driver" &&
        driver !== ALIGNED_MOMENTUM_NAME
      ) {
        return `Morning check-in: pattern "${driver}" shows up when pressure hits. What boundary protects you from it today — one sentence?`;
      }

      const arch = (r.archetype as string) || "";
      if (arch) {
        return `Good morning. You're carrying the ${arch} pattern this season. What's one thing your Vital Action needs from you before the inbox wins?`;
      }
    }

    if (sixRows.length >= 1) {
      const latest = sixRows[0].scores || {};
      let lowestKey = SCORECARD_CATEGORIES[0].key;
      let lowestVal = 101;
      for (const c of SCORECARD_CATEGORIES) {
        const v = latest[c.key];
        if (typeof v === "number" && v < lowestVal) {
          lowestVal = v;
          lowestKey = c.key;
        }
      }
      const cat = SCORECARD_CATEGORIES.find((x) => x.key === lowestKey);
      if (lowestVal <= 100 && lowestVal < 72 && cat) {
        return `Your 6Cs point to ${cat.label} (${lowestVal}%). What's one integrity move today — small, repeatable — not a hero week?`;
      }

      if (sixRows.length >= 2) {
        const prev = sixRows[1].scores || {};
        let worstLabel = "";
        let worstDelta = 0;
        for (const c of SCORECARD_CATEGORIES) {
          const a = latest[c.key] || 0;
          const b = prev[c.key] || 0;
          const d = a - b;
          if (d < worstDelta) {
            worstDelta = d;
            worstLabel = c.label;
          }
        }
        if (worstDelta < -5 && worstLabel) {
          return `${worstLabel} dipped ${worstDelta}% week over week. What actually happened — and what's the smallest repair you can make today?`;
        }
      }
    }
  } catch {
    /* fall through */
  }

  return safeFallback;
}
