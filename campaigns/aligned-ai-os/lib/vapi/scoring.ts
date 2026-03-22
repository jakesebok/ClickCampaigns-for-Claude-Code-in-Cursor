import { DOMAINS, ARENAS } from "./quiz-data";

export type VapiScores = {
  domains: Record<string, number>;
  arenas: Record<string, number>;
  overall: number;
};

export type VapiTier = "Dialed" | "Functional" | "Below the Line" | "In the Red";

export type VapiArchetype =
  | "The Architect"
  | "The Journeyman"
  | "The Phoenix"
  | "The Engine"
  | "The Drifter"
  | "The Performer"
  | "The Ghost"
  | "The Guardian"
  | "The Seeker";

export type PriorityQuadrant =
  | "Critical Priority"
  | "Protect & Sustain"
  | "Monitor"
  | "Possible Over-Investment";

export type PriorityItem = {
  domain: string;
  domainName: string;
  score: number;
  importance: number;
  quadrant: PriorityQuadrant;
};

export type VapiArenaKey = "personal" | "relationships" | "business";

export type RankedArena = {
  key: VapiArenaKey;
  label: "Personal" | "Self" | "Relationships" | "Business";
  score: number;
};

export function scoreQuestion(raw: number, reverse: boolean): number {
  return reverse ? 8 - raw : raw;
}

export function scoreDomain(answers: number[], domain: typeof DOMAINS[number]): number {
  const scored = domain.questions.map((q, i) =>
    scoreQuestion(answers[i] || 4, q.reverse)
  );
  const weightedSum = scored.reduce(
    (sum, val, i) => sum + val * domain.questions[i].weight,
    0
  );
  const raw = ((weightedSum - 6.0) / 36.0) * 10;
  return Math.round(Math.max(0, Math.min(10, raw)) * 10) / 10;
}

export function calculateScores(
  answers: Record<string, number[]>
): VapiScores {
  const domains: Record<string, number> = {};

  for (const domain of DOMAINS) {
    domains[domain.code] = scoreDomain(answers[domain.code] || [], domain);
  }

  const arenas: Record<string, number> = {};
  for (const arena of ARENAS) {
    const arenaScores = arena.domains.map((d) => domains[d] || 0);
    arenas[arena.key] =
      Math.round(
        (arenaScores.reduce((a, b) => a + b, 0) / arenaScores.length) * 10
      ) / 10;
  }

  const allScores = Object.values(domains);
  const overall =
    Math.round(
      (allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10
    ) / 10;

  return { domains, arenas, overall };
}

/** Maps legacy stored archetype names to the current canonical name. */
export function normalizeVapiArchetypeName(
  name: string | null | undefined
): string | null {
  if (name == null || name === "") return null;
  if (name === "The Rising Architect") return "The Journeyman";
  return name;
}

export function getTier(score: number): VapiTier {
  if (score >= 8) return "Dialed";
  if (score >= 6) return "Functional";
  if (score >= 4) return "Below the Line";
  return "In the Red";
}

export function getTierColor(tier: VapiTier): string {
  switch (tier) {
    case "Dialed":
      return "#22C55E";
    case "Functional":
      return "#EAB308";
    case "Below the Line":
      return "#F97316";
    case "In the Red":
      return "#EF4444";
  }
}

export function getArchetype(arenas: Record<string, number>, domains: Record<string, number>): VapiArchetype {
  const p = arenas.personal || 0;
  const r = arenas.relationships || 0;
  const b = arenas.business || 0;
  const allArenas = [p, r, b];
  const spread = Math.max(...allArenas) - Math.min(...allArenas);
  const belowCount = allArenas.filter((a) => a <= 4.5).length;
  const arenasNearArchitect = allArenas.filter((a) => a >= 7.5).length;
  const lowestArena = Math.min(...allArenas);

  if (p >= 8 && r >= 8 && b >= 8) return "The Architect";
  const overall = (p + r + b) / 3;
  if (overall >= 7.0 && arenasNearArchitect >= 2 && lowestArena >= 6.5) {
    return "The Journeyman";
  }
  if (overall <= 4.5 || belowCount >= 2) return "The Phoenix";
  if ((domains.EX || 0) >= 7 && ((domains.EC || 0) <= 5 || (domains.VS || 0) <= 5))
    return "The Engine";
  const allMid = p >= 5 && p <= 7.9 && r >= 5 && r <= 7.9 && b >= 5 && b <= 7.9;
  if (allMid && spread <= 2) return "The Drifter";
  if (b === Math.max(...allArenas) && p === Math.min(...allArenas) && spread >= 2)
    return "The Performer";
  if (b === Math.max(...allArenas) && r === Math.min(...allArenas) && spread >= 2)
    return "The Ghost";
  if (r === Math.max(...allArenas) && b === Math.min(...allArenas) && spread >= 2)
    return "The Guardian";
  if (p === Math.max(...allArenas) && b === Math.min(...allArenas) && spread >= 2)
    return "The Seeker";
  return "The Drifter";
}

export function getRankedArenas(
  arenas: Record<string, number>,
  options?: { personalLabel?: "Personal" | "Self" }
): RankedArena[] {
  const personalLabel = options?.personalLabel ?? "Personal";
  const ranked: RankedArena[] = [
    { key: "personal", label: personalLabel, score: arenas.personal || 0 },
    { key: "relationships", label: "Relationships", score: arenas.relationships || 0 },
    { key: "business", label: "Business", score: arenas.business || 0 },
  ];
  return ranked.sort((a, b) => a.score - b.score);
}

export function getPriorityMatrix(
  domainScores: Record<string, number>,
  importance: Record<string, number>
): PriorityItem[] {
  return DOMAINS.map((d) => {
    const score = domainScores[d.code] || 0;
    const imp = importance[d.code] || 5;
    let quadrant: PriorityQuadrant;

    if (imp >= 7 && score < 6) quadrant = "Critical Priority";
    else if (imp >= 7 && score >= 6) quadrant = "Protect & Sustain";
    else if (imp < 7 && score < 6) quadrant = "Monitor";
    else quadrant = "Possible Over-Investment";

    return { domain: d.code, domainName: d.name, score, importance: imp, quadrant };
  });
}

export const ARCHETYPE_DESCRIPTIONS: Record<VapiArchetype, string> = {
  "The Architect":
    "You're aligned across all three arenas. Your life, relationships, and business are working together. The work now is maintenance, refinement, and protecting what you've built.",
  "The Journeyman":
    "You're performing at a high level across all three arenas. One arena is still trailing. Closing that gap is the work that moves you from skilled to fully integrated.",
  "The Phoenix":
    "You're in a season of rebuilding. Multiple areas need attention. This isn't failure — it's the foundation for your next chapter. Start with the one area that would create the most relief.",
  "The Engine":
    "You can execute, but your direction or sustainability is off. You're powerful — the question is whether you're aimed at the right target and whether you can sustain the pace.",
  "The Drifter":
    "You're functional across the board but not thriving anywhere. Everything is 'fine.' The risk is coasting. Pick one arena to go deep on this quarter.",
  "The Performer":
    "Your business is strong but your personal foundation is cracking. You're performing at a high level — but at what cost? The body and mind are keeping score.",
  "The Ghost":
    "Business is strong but relationships are fading. You're building something impressive — but the people who matter are watching you disappear. Reconnect before the distance becomes permanent.",
  "The Guardian":
    "Relationships are strong but business is lagging. You show up beautifully for others — now it's time to show up for your vision with the same commitment.",
  "The Seeker":
    "You've done deep personal work but your business hasn't caught up. The inner alignment is there — now channel it into strategy and execution.",
};
