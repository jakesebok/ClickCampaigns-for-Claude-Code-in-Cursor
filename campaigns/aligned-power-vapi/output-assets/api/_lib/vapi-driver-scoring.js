const DRIVER_TIEBREAK_PRIORITY = [
  "The Achiever's Trap",
  "The Escape Artist",
  "The Pleaser's Bind",
  "The Imposter Loop",
  "The Perfectionist's Prison",
  "The Protector",
  "The Martyr Complex",
  "The Fog",
];

const SELF_DOMAIN_CODES = ["PH", "IA", "ME", "AF"];
const BUSINESS_DOMAIN_CODES = ["VS", "EX", "OH", "EC"];
const ALL_DOMAIN_CODES = ["PH", "IA", "ME", "AF", "RS", "FA", "CO", "WI", "VS", "EX", "OH", "EC"];
const REVERSE_IDS = new Set([
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

function createEmptyDriverScores() {
  return {
    "The Achiever's Trap": 0,
    "The Escape Artist": 0,
    "The Pleaser's Bind": 0,
    "The Imposter Loop": 0,
    "The Perfectionist's Prison": 0,
    "The Protector": 0,
    "The Martyr Complex": 0,
    "The Fog": 0,
  };
}

function getNumericValue(value, fallback) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function getAverageImportance(importanceRatings, domainCodes) {
  const values = domainCodes.map((code) => getNumericValue(importanceRatings[code], 5));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getImportanceStdDev(importanceRatings) {
  const values = ALL_DOMAIN_CODES.map((code) => getNumericValue(importanceRatings[code], 5));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / values.length;
  return Math.sqrt(variance);
}

function noSingleImportanceAboveOrEqualEight(importanceRatings) {
  return ALL_DOMAIN_CODES.every((code) => getNumericValue(importanceRatings[code], 5) < 8);
}

function normalizeStoredResponses(allResponses, responseCodingVersion) {
  const normalized = {};
  const source = allResponses || {};

  Object.keys(source).forEach((questionId) => {
    const stored = getNumericValue(source[questionId], 4);
    normalized[questionId] =
      responseCodingVersion === "scored_v1"
        ? stored
        : REVERSE_IDS.has(questionId)
          ? 8 - stored
          : stored;
  });

  return normalized;
}

export function enrichResultsWithDriver(results) {
  const domainScores = results.domainScores || {};
  const importanceRatings = results.importanceRatings || {};
  const scoredResponses = normalizeStoredResponses(
    results.allResponses || {},
    typeof results.responseCodingVersion === "string" ? results.responseCodingVersion : null
  );
  const driverScores = createEmptyDriverScores();
  const businessVsSelfImportanceDelta =
    getAverageImportance(importanceRatings, BUSINESS_DOMAIN_CODES) -
    getAverageImportance(importanceRatings, SELF_DOMAIN_CODES);
  const importanceStdDev = getImportanceStdDev(importanceRatings);

  if (getNumericValue(domainScores.EX, 0) >= 6.0) driverScores["The Achiever's Trap"] += 2;
  if (getNumericValue(domainScores.PH, 0) < 5.0) driverScores["The Achiever's Trap"] += 2;
  if (getNumericValue(domainScores.ME, 0) < 5.0) driverScores["The Achiever's Trap"] += 2;
  if (getNumericValue(domainScores.IA, 0) < 5.0) driverScores["The Achiever's Trap"] += 1;
  if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Achiever's Trap"] += 1;
  if (getNumericValue(importanceRatings.PH, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
  if (getNumericValue(importanceRatings.ME, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
  if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
  if (businessVsSelfImportanceDelta >= 2.0) driverScores["The Achiever's Trap"] += 2;
  if (getNumericValue(scoredResponses.PH6, 7) <= 3) driverScores["The Achiever's Trap"] += 2;

  if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Protector"] += 2;
  if (getNumericValue(domainScores.CO, 0) < 5.0) driverScores["The Protector"] += 2;
  if (getNumericValue(domainScores.OH, 0) >= 6.0) driverScores["The Protector"] += 2;
  if (getNumericValue(domainScores.EX, 0) >= 6.0) driverScores["The Protector"] += 1;
  if (getNumericValue(domainScores.FA, 0) < 5.0) driverScores["The Protector"] += 1;
  if (getNumericValue(domainScores.AF, 0) >= 6.0) driverScores["The Protector"] += 1;
  if (getNumericValue(importanceRatings.CO, 5) <= 5) driverScores["The Protector"] += 1;
  if (getNumericValue(importanceRatings.RS, 5) <= 5) driverScores["The Protector"] += 1;
  if (getNumericValue(importanceRatings.OH, 5) >= 7) driverScores["The Protector"] += 1;
  if (getNumericValue(scoredResponses.CO6, 7) <= 3) driverScores["The Protector"] += 2;

  if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Pleaser's Bind"] += 2;
  if (getNumericValue(scoredResponses.RS6, 7) <= 3) driverScores["The Pleaser's Bind"] += 3;
  if (getNumericValue(domainScores.FA, 0) >= 6.0 || getNumericValue(domainScores.CO, 0) >= 6.0) driverScores["The Pleaser's Bind"] += 2;
  if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
  if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
  if (getNumericValue(importanceRatings.RS, 5) >= 7) driverScores["The Pleaser's Bind"] += 2;
  if (getNumericValue(importanceRatings.FA, 5) >= 7 || getNumericValue(importanceRatings.CO, 5) >= 7) driverScores["The Pleaser's Bind"] += 1;
  if (getNumericValue(domainScores.ME, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;

  if (getNumericValue(domainScores.EX, 0) >= 6.0) driverScores["The Escape Artist"] += 2;
  if (getNumericValue(domainScores.ME, 0) < 5.0) driverScores["The Escape Artist"] += 2;
  if (getNumericValue(domainScores.FA, 0) < 5.0) driverScores["The Escape Artist"] += 2;
  if (getNumericValue(domainScores.IA, 0) < 5.0) driverScores["The Escape Artist"] += 2;
  if (getNumericValue(importanceRatings.ME, 5) <= 5) driverScores["The Escape Artist"] += 1;
  if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Escape Artist"] += 1;
  if (getNumericValue(importanceRatings.FA, 5) <= 5) driverScores["The Escape Artist"] += 1;
  if (getNumericValue(scoredResponses.FA6, 7) <= 3) driverScores["The Escape Artist"] += 2;
  if (getNumericValue(scoredResponses.ME6, 7) <= 3) driverScores["The Escape Artist"] += 1;

  if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Perfectionist's Prison"] += 3;
  if (getNumericValue(importanceRatings.EX, 5) >= 7) driverScores["The Perfectionist's Prison"] += 3;
  if (getNumericValue(domainScores.VS, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 2;
  if (getNumericValue(domainScores.ME, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
  if (getNumericValue(domainScores.IA, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
  if (getNumericValue(domainScores.AF, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
  if (getNumericValue(scoredResponses.EX6, 7) <= 3) driverScores["The Perfectionist's Prison"] += 2;
  if (getNumericValue(domainScores.RS, 0) >= 5.0) driverScores["The Perfectionist's Prison"] += 1;

  if (getNumericValue(domainScores.EC, 0) < 5.0) driverScores["The Imposter Loop"] += 3;
  if (getNumericValue(scoredResponses.EC6, 7) <= 3) driverScores["The Imposter Loop"] += 3;
  if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Imposter Loop"] += 2;
  if (getNumericValue(domainScores.EX, 0) >= 5.0) driverScores["The Imposter Loop"] += 1;
  if (getNumericValue(importanceRatings.EC, 5) <= 5) driverScores["The Imposter Loop"] += 1;
  if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
  if (getNumericValue(scoredResponses.RS6, 7) <= 3) driverScores["The Imposter Loop"] += 1;
  if (getNumericValue(domainScores.OH, 0) < 5.0) driverScores["The Imposter Loop"] += 1;

  if (getNumericValue(domainScores.PH, 0) < 5.0) driverScores["The Martyr Complex"] += 2;
  if (getNumericValue(domainScores.IA, 0) < 5.0) driverScores["The Martyr Complex"] += 2;
  if (getNumericValue(domainScores.WI, 0) >= 6.0) driverScores["The Martyr Complex"] += 2;
  if (getNumericValue(domainScores.FA, 0) >= 6.0) driverScores["The Martyr Complex"] += 2;
  if (getNumericValue(importanceRatings.WI, 5) >= 7) driverScores["The Martyr Complex"] += 1;
  if (getNumericValue(importanceRatings.FA, 5) >= 7) driverScores["The Martyr Complex"] += 1;
  if (getNumericValue(importanceRatings.PH, 5) <= 5) driverScores["The Martyr Complex"] += 1;
  if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Martyr Complex"] += 1;
  if (getNumericValue(scoredResponses.PH6, 7) <= 3) driverScores["The Martyr Complex"] += 2;

  if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Fog"] += 3;
  if (getNumericValue(domainScores.IA, 0) < 5.0) driverScores["The Fog"] += 2;
  if (getNumericValue(domainScores.EC, 0) < 5.0) driverScores["The Fog"] += 1;
  if (noSingleImportanceAboveOrEqualEight(importanceRatings)) driverScores["The Fog"] += 3;
  if (importanceStdDev < 2.0) driverScores["The Fog"] += 2;
  if (getNumericValue(scoredResponses.VS6, 7) <= 3) driverScores["The Fog"] += 2;
  if (getNumericValue(importanceRatings.VS, 5) <= 5) driverScores["The Fog"] += 1;

  let assignedDriver = null;
  let topDriverScore = 0;

  for (const driverName of DRIVER_TIEBREAK_PRIORITY) {
    const score = driverScores[driverName];
    if (score > topDriverScore) {
      topDriverScore = score;
      assignedDriver = driverName;
    }
  }

  if (topDriverScore < 8) {
    assignedDriver = null;
  }

  return {
    ...results,
    allResponses: scoredResponses,
    responseCodingVersion: "scored_v1",
    assignedDriver,
    driverScores,
    topDriverScore,
  };
}
