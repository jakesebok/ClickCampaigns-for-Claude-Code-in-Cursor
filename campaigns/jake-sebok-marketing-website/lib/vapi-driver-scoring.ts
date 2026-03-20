type DriverName =
  | "The Achiever's Trap"
  | "The Escape Artist"
  | "The Pleaser's Bind"
  | "The Imposter Loop"
  | "The Perfectionist's Prison"
  | "The Protector"
  | "The Martyr Complex"
  | "The Fog"
  | "The Builder's Gap";

const ALIGNED_MOMENTUM_NAME = "Aligned Momentum" as const;
type AssignedDriverName = DriverName | typeof ALIGNED_MOMENTUM_NAME;
type DriverState =
  | "dysfunction_driver"
  | "aligned_momentum"
  | "no_driver";

type DriverScores = Record<DriverName, number>;
type DriverGates = Record<DriverName, boolean>;

const DRIVER_THRESHOLD = 6;
const DRIVER_MIN_MARGIN = 2;
const DRIVER_TIEBREAK_PRIORITY: DriverName[] = [
  "The Achiever's Trap",
  "The Escape Artist",
  "The Pleaser's Bind",
  "The Imposter Loop",
  "The Perfectionist's Prison",
  "The Protector",
  "The Martyr Complex",
  "The Fog",
  "The Builder's Gap",
];

const SELF_DOMAIN_CODES = ["PH", "IA", "ME", "AF"];
const RELATIONSHIPS_DOMAIN_CODES = ["RS", "FA", "CO", "WI"];
const BUSINESS_DOMAIN_CODES = ["VS", "EX", "OH", "EC"];
const ALL_DOMAIN_CODES = [
  "PH",
  "IA",
  "ME",
  "AF",
  "RS",
  "FA",
  "CO",
  "WI",
  "VS",
  "EX",
  "OH",
  "EC",
];

function createEmptyDriverScores(): DriverScores {
  return {
    "The Achiever's Trap": 0,
    "The Escape Artist": 0,
    "The Pleaser's Bind": 0,
    "The Imposter Loop": 0,
    "The Perfectionist's Prison": 0,
    "The Protector": 0,
    "The Martyr Complex": 0,
    "The Fog": 0,
    "The Builder's Gap": 0,
  };
}

function createEmptyDriverGates(): DriverGates {
  return {
    "The Achiever's Trap": false,
    "The Escape Artist": false,
    "The Pleaser's Bind": false,
    "The Imposter Loop": false,
    "The Perfectionist's Prison": false,
    "The Protector": false,
    "The Martyr Complex": false,
    "The Fog": false,
    "The Builder's Gap": false,
  };
}

function getDriverFallbackType(
  domainScores: Record<string, number>,
  compositeScore: number,
  assignedDriver: AssignedDriverName | null,
  driverState?: DriverState | null
) {
  if (driverState === "dysfunction_driver") return "none";
  if (
    driverState === "aligned_momentum" ||
    assignedDriver === ALIGNED_MOMENTUM_NAME
  ) {
    return "aligned_momentum";
  }
  if (assignedDriver) return "none";

  const domainsBelowThreshold = ALL_DOMAIN_CODES.filter(
    (code) => getNumericValue(domainScores[code], 0) < 5.5
  ).length;

  return compositeScore >= 7.0 && domainsBelowThreshold <= 1
    ? "aligned_momentum"
    : "standard";
}

function getNumericValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function countTrue(values: boolean[]) {
  return values.filter(Boolean).length;
}

function getAverageImportance(
  importanceRatings: Record<string, number>,
  domainCodes: string[]
) {
  const values = domainCodes.map((code) => getNumericValue(importanceRatings[code], 5));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getAverageScore(
  scores: Record<string, number>,
  domainCodes: string[]
) {
  const values = domainCodes.map((code) => getNumericValue(scores[code], 0));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getImportanceStdDev(importanceRatings: Record<string, number>) {
  const values = ALL_DOMAIN_CODES.map((code) => getNumericValue(importanceRatings[code], 5));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function noSingleImportanceAboveOrEqualEight(importanceRatings: Record<string, number>) {
  return ALL_DOMAIN_CODES.every(
    (code) => getNumericValue(importanceRatings[code], 5) < 8
  );
}

function noSingleImportanceAboveOrEqualSeven(importanceRatings: Record<string, number>) {
  return ALL_DOMAIN_CODES.every(
    (code) => getNumericValue(importanceRatings[code], 5) < 7
  );
}

function normalizeStoredResponses(
  allResponses: Record<string, number> | null | undefined,
  responseCodingVersion?: string | null
) {
  const reverseIds = new Set([
    "PH6",
    "IA6",
    "ME6",
    "AF6",
    "RS6",
    "FA6",
    "CO6",
    "WI6",
    "VS6",
    "EX6",
    "OH6",
    "EC6",
  ]);
  const normalized: Record<string, number> = {};
  const source = allResponses || {};

  Object.keys(source).forEach((questionId) => {
    const stored = getNumericValue(source[questionId], 4);
    normalized[questionId] =
      responseCodingVersion === "scored_v1"
        ? stored
        : reverseIds.has(questionId)
          ? 8 - stored
          : stored;
  });

  return normalized;
}

function getCompositeScore(
  domainScores: Record<string, number>,
  compositeScore: unknown
) {
  return typeof compositeScore === "number" && Number.isFinite(compositeScore)
    ? compositeScore
    : getAverageScore(domainScores, ALL_DOMAIN_CODES);
}

function getArenaScores(
  domainScores: Record<string, number>,
  rawArenaScores: Record<string, number> | null | undefined
) {
  const self = getNumericValue(
    rawArenaScores?.personal ??
      rawArenaScores?.Personal ??
      rawArenaScores?.self ??
      rawArenaScores?.Self,
    Number.NaN
  );
  const relationships = getNumericValue(
    rawArenaScores?.relationships ?? rawArenaScores?.Relationships,
    Number.NaN
  );
  const business = getNumericValue(
    rawArenaScores?.business ?? rawArenaScores?.Business,
    Number.NaN
  );

  return {
    self:
      Number.isFinite(self) && self > 0
        ? self
        : getAverageScore(domainScores, SELF_DOMAIN_CODES),
    relationships:
      Number.isFinite(relationships) && relationships > 0
        ? relationships
        : getAverageScore(domainScores, RELATIONSHIPS_DOMAIN_CODES),
    business:
      Number.isFinite(business) && business > 0
        ? business
        : getAverageScore(domainScores, BUSINESS_DOMAIN_CODES),
  };
}

function isArenaHighest(
  arenaScores: ReturnType<typeof getArenaScores>,
  key: keyof ReturnType<typeof getArenaScores>
) {
  const values = Object.values(arenaScores);
  return arenaScores[key] === Math.max(...values);
}

function isArenaLowest(
  arenaScores: ReturnType<typeof getArenaScores>,
  key: keyof ReturnType<typeof getArenaScores>
) {
  const values = Object.values(arenaScores);
  return arenaScores[key] === Math.min(...values);
}

export function enrichResultsWithDriver(results: Record<string, unknown>) {
  const domainScores = (results.domainScores as Record<string, number>) || {};
  const importanceRatings =
    (results.importanceRatings as Record<string, number>) || {};
  const scoredResponses = normalizeStoredResponses(
    (results.allResponses as Record<string, number>) || {},
    typeof results.responseCodingVersion === "string"
      ? (results.responseCodingVersion as string)
      : null
  );
  const driverScores = createEmptyDriverScores();
  const driverGates = createEmptyDriverGates();
  const businessVsSelfImportanceDelta =
    getAverageImportance(importanceRatings, BUSINESS_DOMAIN_CODES) -
    getAverageImportance(importanceRatings, SELF_DOMAIN_CODES);
  const importanceStdDev = getImportanceStdDev(importanceRatings);
  const arenaScores = getArenaScores(
    domainScores,
    (results.arenaScores as Record<string, number>) || {}
  );
  const compositeScore = getCompositeScore(domainScores, results.overall);

  const achieverLowSelfDomains = [
    getNumericValue(domainScores.PH, 0) < 5.0,
    getNumericValue(domainScores.ME, 0) < 5.0,
    getNumericValue(domainScores.IA, 0) < 5.0,
  ];
  driverGates["The Achiever's Trap"] =
    getNumericValue(domainScores.EX, 0) >= 6.0 &&
    countTrue(achieverLowSelfDomains) >= 2;
  if (driverGates["The Achiever's Trap"]) {
    if (countTrue(achieverLowSelfDomains) === 3) driverScores["The Achiever's Trap"] += 2;
    if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Achiever's Trap"] += 1;
    if (getNumericValue(importanceRatings.PH, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
    if (getNumericValue(importanceRatings.ME, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
    if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
    if (businessVsSelfImportanceDelta >= 2.0) driverScores["The Achiever's Trap"] += 2;
    if (getNumericValue(scoredResponses.PH6, 7) <= 3) driverScores["The Achiever's Trap"] += 2;
    if (isArenaHighest(arenaScores, "business")) driverScores["The Achiever's Trap"] += 1;
    if (isArenaLowest(arenaScores, "self")) driverScores["The Achiever's Trap"] += 1;
  }

  driverGates["The Protector"] =
    (getNumericValue(domainScores.OH, 0) >= 6.0 ||
      getNumericValue(domainScores.EX, 0) >= 6.0) &&
    (getNumericValue(domainScores.CO, 0) < 5.0 ||
      getNumericValue(domainScores.RS, 0) < 5.0);
  if (driverGates["The Protector"]) {
    if (
      getNumericValue(domainScores.OH, 0) >= 6.0 &&
      getNumericValue(domainScores.EX, 0) >= 6.0
    ) {
      driverScores["The Protector"] += 2;
    }
    if (
      getNumericValue(domainScores.CO, 0) < 5.0 &&
      getNumericValue(domainScores.RS, 0) < 5.0
    ) {
      driverScores["The Protector"] += 2;
    }
    if (getNumericValue(domainScores.FA, 0) < 5.0) driverScores["The Protector"] += 1;
    if (getNumericValue(domainScores.AF, 0) >= 6.0) driverScores["The Protector"] += 1;
    if (getNumericValue(importanceRatings.CO, 5) <= 5) driverScores["The Protector"] += 1;
    if (getNumericValue(importanceRatings.RS, 5) <= 5) driverScores["The Protector"] += 1;
    if (getNumericValue(importanceRatings.OH, 5) >= 7) driverScores["The Protector"] += 1;
    if (getNumericValue(scoredResponses.CO6, 7) <= 3) driverScores["The Protector"] += 2;
    if (isArenaLowest(arenaScores, "relationships")) driverScores["The Protector"] += 2;
  }

  driverGates["The Pleaser's Bind"] =
    getNumericValue(domainScores.RS, 0) < 5.0 &&
    getNumericValue(scoredResponses.RS6, 7) <= 3;
  if (driverGates["The Pleaser's Bind"]) {
    if (
      getNumericValue(domainScores.FA, 0) >= 6.0 ||
      getNumericValue(domainScores.CO, 0) >= 6.0
    ) {
      driverScores["The Pleaser's Bind"] += 2;
    }
    if (
      getNumericValue(domainScores.FA, 0) >= 6.0 &&
      getNumericValue(domainScores.CO, 0) >= 6.0
    ) {
      driverScores["The Pleaser's Bind"] += 1;
    }
    if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
    if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
    if (getNumericValue(importanceRatings.RS, 5) >= 7) driverScores["The Pleaser's Bind"] += 2;
    if (
      getNumericValue(importanceRatings.FA, 5) >= 7 ||
      getNumericValue(importanceRatings.CO, 5) >= 7
    ) {
      driverScores["The Pleaser's Bind"] += 1;
    }
    if (getNumericValue(domainScores.ME, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
    if (isArenaHighest(arenaScores, "relationships")) driverScores["The Pleaser's Bind"] += 2;
    if (isArenaLowest(arenaScores, "business")) driverScores["The Pleaser's Bind"] += 1;
  }

  driverGates["The Escape Artist"] =
    getNumericValue(domainScores.EX, 0) >= 5.5 &&
    getNumericValue(domainScores.IA, 0) < 5.0 &&
    (getNumericValue(domainScores.FA, 0) < 5.0 ||
      getNumericValue(domainScores.ME, 0) < 5.0);
  if (driverGates["The Escape Artist"]) {
    if (
      getNumericValue(domainScores.FA, 0) < 5.0 &&
      getNumericValue(domainScores.ME, 0) < 5.0
    ) {
      driverScores["The Escape Artist"] += 2;
    }
    if (getNumericValue(domainScores.EX, 0) >= 6.5) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(importanceRatings.ME, 5) <= 5) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(importanceRatings.FA, 5) <= 5) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(scoredResponses.FA6, 7) <= 3) driverScores["The Escape Artist"] += 2;
    if (getNumericValue(scoredResponses.ME6, 7) <= 3) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(domainScores.PH, 0) < 5.0) driverScores["The Escape Artist"] += 1;
    if (isArenaHighest(arenaScores, "business")) driverScores["The Escape Artist"] += 1;
    if (
      countTrue([
        getNumericValue(importanceRatings.ME, 5) <= 5,
        getNumericValue(importanceRatings.IA, 5) <= 5,
        getNumericValue(importanceRatings.FA, 5) <= 5,
      ]) >= 2
    ) {
      driverScores["The Escape Artist"] += 1;
    }
  }

  const perfectionistCapabilityDomains = [
    getNumericValue(domainScores.ME, 0) >= 6.0,
    getNumericValue(domainScores.IA, 0) >= 6.0,
    getNumericValue(domainScores.AF, 0) >= 6.0,
    getNumericValue(domainScores.VS, 0) >= 6.0,
  ];
  driverGates["The Perfectionist's Prison"] =
    getNumericValue(domainScores.EX, 0) < 5.0 &&
    countTrue(perfectionistCapabilityDomains) >= 2;
  if (driverGates["The Perfectionist's Prison"]) {
    if (getNumericValue(importanceRatings.EX, 5) >= 7) {
      driverScores["The Perfectionist's Prison"] += 2;
    }
    if (getNumericValue(domainScores.VS, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 2;
    if (getNumericValue(domainScores.ME, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
    if (getNumericValue(domainScores.IA, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
    if (getNumericValue(domainScores.AF, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
    if (getNumericValue(domainScores.RS, 0) >= 5.0) driverScores["The Perfectionist's Prison"] += 1;
    if (getNumericValue(scoredResponses.EX6, 7) <= 3) driverScores["The Perfectionist's Prison"] += 1;
    if (countTrue(perfectionistCapabilityDomains) >= 3) {
      driverScores["The Perfectionist's Prison"] += 2;
    }
    if (compositeScore >= 5.5) driverScores["The Perfectionist's Prison"] += 1;
  }

  driverGates["The Imposter Loop"] =
    getNumericValue(domainScores.EC, 0) < 5.0 &&
    (
      getNumericValue(scoredResponses.EC6, 7) <= 3 ||
      getNumericValue(domainScores.RS, 0) < 5.0
    );
  if (driverGates["The Imposter Loop"]) {
    if (getNumericValue(scoredResponses.EC6, 7) <= 3) driverScores["The Imposter Loop"] += 2;
    if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Imposter Loop"] += 2;
    if (
      getNumericValue(importanceRatings.IA, 5) >= 7 &&
      getNumericValue(domainScores.EC, 0) < 5.0
    ) {
      driverScores["The Imposter Loop"] += 2;
    }
    if (getNumericValue(domainScores.EX, 0) >= 5.0) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(importanceRatings.EC, 5) <= 5) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(scoredResponses.RS6, 7) <= 3) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(domainScores.OH, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(scoredResponses.EC5, 7) <= 4) driverScores["The Imposter Loop"] += 2;
    if (
      getNumericValue(domainScores.ME, 0) < 5.5 &&
      getNumericValue(importanceRatings.IA, 5) >= 7
    ) {
      driverScores["The Imposter Loop"] += 1;
    }
  }

  driverGates["The Martyr Complex"] =
    (getNumericValue(domainScores.WI, 0) >= 6.0 ||
      getNumericValue(domainScores.FA, 0) >= 6.0) &&
    (getNumericValue(domainScores.PH, 0) < 5.0 ||
      getNumericValue(domainScores.IA, 0) < 5.0);
  if (driverGates["The Martyr Complex"]) {
    if (
      getNumericValue(domainScores.WI, 0) >= 6.0 &&
      getNumericValue(domainScores.FA, 0) >= 6.0
    ) {
      driverScores["The Martyr Complex"] += 2;
    }
    if (
      getNumericValue(domainScores.PH, 0) < 5.0 &&
      getNumericValue(domainScores.IA, 0) < 5.0
    ) {
      driverScores["The Martyr Complex"] += 2;
    }
    if (getNumericValue(importanceRatings.WI, 5) >= 7) driverScores["The Martyr Complex"] += 1;
    if (getNumericValue(importanceRatings.FA, 5) >= 7) driverScores["The Martyr Complex"] += 1;
    if (getNumericValue(importanceRatings.PH, 5) <= 5) driverScores["The Martyr Complex"] += 1;
    if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Martyr Complex"] += 1;
    if (getNumericValue(scoredResponses.PH6, 7) <= 3) driverScores["The Martyr Complex"] += 2;
    if (isArenaHighest(arenaScores, "relationships")) driverScores["The Martyr Complex"] += 1;
    if (isArenaLowest(arenaScores, "self")) driverScores["The Martyr Complex"] += 1;
  }

  driverGates["The Fog"] =
    getNumericValue(domainScores.VS, 0) < 5.0 &&
    noSingleImportanceAboveOrEqualEight(importanceRatings);
  if (driverGates["The Fog"]) {
    if (getNumericValue(domainScores.IA, 0) < 5.0) driverScores["The Fog"] += 2;
    if (getNumericValue(domainScores.EC, 0) < 5.0) driverScores["The Fog"] += 1;
    if (importanceStdDev < 2.0) driverScores["The Fog"] += 3;
    if (getNumericValue(scoredResponses.VS6, 7) <= 3) driverScores["The Fog"] += 2;
    if (getNumericValue(importanceRatings.VS, 5) <= 5) driverScores["The Fog"] += 1;
    if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Fog"] += 1;
    if (noSingleImportanceAboveOrEqualSeven(importanceRatings)) driverScores["The Fog"] += 2;
    if (compositeScore >= 4.0 && compositeScore <= 6.5) driverScores["The Fog"] += 1;
  }

  const builderWeakBusinessDomains = BUSINESS_DOMAIN_CODES.map(
    (code) => getNumericValue(domainScores[code], 0) < 5.5
  );
  const builderStrongPersonalRelationalDomains = [
    getNumericValue(domainScores.PH, 0) >= 6.5,
    getNumericValue(domainScores.ME, 0) >= 6.5,
    getNumericValue(domainScores.IA, 0) >= 6.5,
    getNumericValue(domainScores.RS, 0) >= 6.5,
    getNumericValue(domainScores.FA, 0) >= 6.5,
    getNumericValue(domainScores.CO, 0) >= 6.5,
  ];
  driverGates["The Builder's Gap"] =
    isArenaLowest(arenaScores, "business") &&
    (arenaScores.self >= 6.0 || arenaScores.relationships >= 6.0) &&
    countTrue(builderWeakBusinessDomains) >= 2;
  if (driverGates["The Builder's Gap"]) {
    if (arenaScores.self >= 6.5 || arenaScores.relationships >= 6.5) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (arenaScores.self >= 6.5 && arenaScores.relationships >= 6.5) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (countTrue(builderWeakBusinessDomains) >= 3) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (getNumericValue(domainScores.EC, 0) >= 6.0) driverScores["The Builder's Gap"] += 2;
    if (getNumericValue(importanceRatings.EX, 5) >= 7) driverScores["The Builder's Gap"] += 1;
    if (getNumericValue(importanceRatings.VS, 5) >= 7) driverScores["The Builder's Gap"] += 1;
    if (getNumericValue(importanceRatings.OH, 5) >= 5) driverScores["The Builder's Gap"] += 1;
    if (countTrue(builderStrongPersonalRelationalDomains) >= 3) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (compositeScore >= 5.5) driverScores["The Builder's Gap"] += 1;
  }

  const rankedDrivers = DRIVER_TIEBREAK_PRIORITY.map((driverName, index) => ({
    driverName,
    score: driverScores[driverName],
    index,
  })).sort((a, b) => b.score - a.score || a.index - b.index);

  const topDriverScore = rankedDrivers[0]?.score ?? 0;
  const secondDriverScore = rankedDrivers[1]?.score ?? 0;
  const primaryToSecondaryMargin = topDriverScore - secondDriverScore;
  const dysfunctionDriver =
    rankedDrivers[0] &&
    topDriverScore >= DRIVER_THRESHOLD &&
    topDriverScore - secondDriverScore >= DRIVER_MIN_MARGIN
      ? rankedDrivers[0].driverName
      : null;
  const secondaryDriver =
    dysfunctionDriver &&
    rankedDrivers[1] &&
    secondDriverScore >= DRIVER_THRESHOLD &&
    driverGates[rankedDrivers[1].driverName] &&
    primaryToSecondaryMargin <= 3
      ? rankedDrivers[1].driverName
      : null;
  const secondaryDriverScore = secondaryDriver ? secondDriverScore : null;
  const inferredFallbackType = getDriverFallbackType(
    domainScores,
    compositeScore,
    dysfunctionDriver
  );
  const driverState: DriverState = dysfunctionDriver
    ? "dysfunction_driver"
    : inferredFallbackType === "aligned_momentum"
      ? "aligned_momentum"
      : "no_driver";
  const assignedDriver =
    dysfunctionDriver ??
    (driverState === "aligned_momentum" ? ALIGNED_MOMENTUM_NAME : null);
  const driverFallbackType = getDriverFallbackType(
    domainScores,
    compositeScore,
    assignedDriver,
    driverState
  );

  return {
    ...results,
    allResponses: scoredResponses,
    responseCodingVersion: "scored_v1",
    assignedDriver,
    secondaryDriver,
    driverScores,
    driverGates,
    topDriverScore,
    secondDriverScore,
    secondaryDriverScore,
    primaryToSecondaryMargin,
    driverState,
    driverFallbackType,
  };
}
