/**
 * Builds the portal's vapi_results.results JSON format from Aligned Freedom Coach scoring data.
 * The portal (and marketing site) expect this structure for display.
 */
import { DOMAINS, ARENAS } from "./quiz-data";
import { getTier, getPriorityMatrix } from "./scoring";
import type {
  VapiDriverGates,
  VapiDriverName,
  VapiDriverScores,
} from "./drivers";

export type PortalVapiResults = {
  overall: number;
  overallTier: string;
  domains: { code: string; domain: string; score: number; arena: string; tier: string }[];
  top3?: { code: string; domain: string; score: number; arena: string; tier: string }[];
  bottom3?: { code: string; domain: string; score: number; arena: string; tier: string }[];
  arenaScores: Record<string, number>;
  arenaTiers?: Record<string, string>;
  domainScores: Record<string, number>;
  importanceRatings: Record<string, number>;
  priorityMatrix: { criticalPriority: unknown[]; protectAndSustain: unknown[]; monitor: unknown[]; overInvestment: unknown[] };
  archetype: string;
  assignedDriver?: VapiDriverName | null;
  driverScores?: VapiDriverScores;
  driverGates?: VapiDriverGates;
  topDriverScore?: number;
  secondDriverScore?: number;
  allResponses?: Record<string, number>;
  responseCodingVersion?: string;
  firstName?: string;
  lastName?: string;
};

export function buildPortalResultsFormat(params: {
  domainScores: Record<string, number>;
  arenaScores: Record<string, number>;
  overall: number;
  archetype: string;
  importance: Record<string, number>;
  assignedDriver?: VapiDriverName | null;
  driverScores?: VapiDriverScores;
  driverGates?: VapiDriverGates;
  topDriverScore?: number;
  secondDriverScore?: number;
  allResponses?: Record<string, number>;
  responseCodingVersion?: string;
  firstName?: string;
  lastName?: string;
}): PortalVapiResults {
  const {
    domainScores,
    arenaScores,
    overall,
    archetype,
    importance,
    assignedDriver,
    driverScores,
    driverGates,
    topDriverScore,
    secondDriverScore,
    allResponses,
    responseCodingVersion,
    firstName,
    lastName,
  } = params;

  const domains = DOMAINS.map((d) => {
    const score = domainScores[d.code] || 0;
    const arenaLabel = d.arena === "personal" ? "Personal" : d.arena === "relationships" ? "Relationships" : "Business";
    return {
      code: d.code,
      domain: d.name,
      score,
      arena: arenaLabel,
      tier: getTier(score),
    };
  });

  const arenaTiers: Record<string, string> = {};
  for (const a of ARENAS) {
    const score = arenaScores[a.key] || 0;
    arenaTiers[a.label] = getTier(score);
  }

  const pm = getPriorityMatrix(domainScores, importance);
  const priorityMatrix = {
    criticalPriority: pm.filter((p) => p.quadrant === "Critical Priority").map((p) => ({ code: p.domain, domain: p.domainName, score: p.score, importance: p.importance })),
    protectAndSustain: pm.filter((p) => p.quadrant === "Protect & Sustain").map((p) => ({ code: p.domain, domain: p.domainName, score: p.score, importance: p.importance })),
    monitor: pm.filter((p) => p.quadrant === "Monitor").map((p) => ({ code: p.domain, domain: p.domainName, score: p.score, importance: p.importance })),
    overInvestment: pm.filter((p) => p.quadrant === "Possible Over-Investment").map((p) => ({ code: p.domain, domain: p.domainName, score: p.score, importance: p.importance })),
  };

  const top3 = domains.slice().sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, 3);
  const bottom3 = domains.slice().sort((a, b) => (a.score || 0) - (b.score || 0)).slice(0, 3);

  return {
    overall,
    overallTier: getTier(overall),
    domains,
    top3,
    bottom3,
    arenaScores: {
      Personal: arenaScores.personal ?? 0,
      Relationships: arenaScores.relationships ?? 0,
      Business: arenaScores.business ?? 0,
    },
    arenaTiers,
    domainScores,
    importanceRatings: importance,
    priorityMatrix,
    archetype,
    assignedDriver: assignedDriver ?? null,
    driverScores: driverScores || undefined,
    driverGates: driverGates || undefined,
    topDriverScore: topDriverScore ?? undefined,
    secondDriverScore: secondDriverScore ?? undefined,
    allResponses: allResponses || undefined,
    responseCodingVersion: responseCodingVersion || undefined,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
  };
}
