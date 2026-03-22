/**
 * Journeyman archetype: gap detection, classification, and display hints.
 * Used by save-vapi-results (server) and browser results UI (via type="module" or bundler).
 *
 * Exports: analyzeJourneyman, enrichResultsWithJourneyman, helpers for tests/content.
 */

const ALL_DOMAIN_CODES = ["PH", "IA", "ME", "AF", "RS", "FA", "CO", "WI", "VS", "EX", "OH", "EC"];

const ARENA_PERSONAL = "Personal";
const ARENA_RELATIONSHIPS = "Relationships";
const ARENA_BUSINESS = "Business";

const DOMAINS_BY_ARENA = {
  [ARENA_PERSONAL]: ["PH", "IA", "ME", "AF"],
  [ARENA_RELATIONSHIPS]: ["RS", "FA", "CO", "WI"],
  [ARENA_BUSINESS]: ["VS", "EX", "OH", "EC"],
};

export const JOURNEYMAN_DOMAIN_NAMES = {
  PH: "Physical Health",
  IA: "Inner Alignment",
  ME: "Mental / Emotional Health",
  AF: "Attention & Focus",
  RS: "Relationship to Self",
  FA: "Family",
  CO: "Community",
  WI: "World / Impact",
  VS: "Vision / Strategy",
  EX: "Execution",
  OH: "Operational Health",
  EC: "Ecology",
};

function toNum(value, fallback = null) {
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Merge flat domainScores with results.domains[] scores.
 */
export function buildDomainScoresMap(results) {
  const out = { ...(results?.domainScores || {}) };
  (results?.domains || []).forEach((d) => {
    if (d && d.code) {
      const s = toNum(d.score, null);
      if (s !== null) out[d.code] = s;
    }
  });
  return out;
}

export function getArenaForDomain(code) {
  if (DOMAINS_BY_ARENA[ARENA_PERSONAL].includes(code)) return ARENA_PERSONAL;
  if (DOMAINS_BY_ARENA[ARENA_RELATIONSHIPS].includes(code)) return ARENA_RELATIONSHIPS;
  if (DOMAINS_BY_ARENA[ARENA_BUSINESS].includes(code)) return ARENA_BUSINESS;
  return null;
}

/**
 * Average score for each arena; return arena with lowest average and its value.
 */
export function findLaggingArena(domainScores) {
  let best = null;
  for (const arena of [ARENA_PERSONAL, ARENA_RELATIONSHIPS, ARENA_BUSINESS]) {
    const codes = DOMAINS_BY_ARENA[arena];
    let sum = 0;
    for (const c of codes) {
      sum += toNum(domainScores[c], 0);
    }
    const avg = sum / codes.length;
    if (best === null || avg < best.average) {
      best = { arena, average: avg };
    }
  }
  return best;
}

export function getPairCode(codeA, codeB) {
  return [codeA, codeB].sort().join("_");
}

function isGapDomain(score, domainAverage, gapThreshold) {
  if (!Number.isFinite(score)) return false;
  if (score < gapThreshold) return true;
  if (domainAverage >= 7.5 && score < 6.5) return true;
  return false;
}

/**
 * @param {Record<string, number>} domainScores - all 12 codes recommended
 * @param {Record<string, number>} [importanceRatings]
 * @returns {object} journeymanAnalysis payload
 */
export function analyzeJourneyman(domainScores, importanceRatings = {}) {
  const imp = importanceRatings && typeof importanceRatings === "object" ? importanceRatings : {};

  let sum = 0;
  for (const code of ALL_DOMAIN_CODES) {
    sum += toNum(domainScores[code], 0);
  }
  const domainAverage = sum / ALL_DOMAIN_CODES.length;
  const gapThreshold = domainAverage - 1.5;

  const gapDomains = [];
  for (const code of ALL_DOMAIN_CODES) {
    const score = toNum(domainScores[code], null);
    if (score === null) continue;
    if (!isGapDomain(score, domainAverage, gapThreshold)) continue;

    const ir = toNum(imp[code], null);
    const importanceContradiction = ir !== null && ir >= 7 && score <= 6.0;

    gapDomains.push({
      code,
      domain: JOURNEYMAN_DOMAIN_NAMES[code] || code,
      score,
      arena: getArenaForDomain(code),
      gapSize: domainAverage - score,
      importanceRating: ir,
      importanceContradiction,
    });
  }

  gapDomains.sort((a, b) => a.score - b.score);

  const lagging = findLaggingArena(domainScores);

  let classification;
  /** @type {string|null} */
  let pairCode = null;
  let displayContent = {
    deepDives: [],
    pairPattern: null,
    arenaFallback: null,
    multipleGaps: false,
  };

  if (gapDomains.length === 0) {
    classification = "ARENA_PATTERN";
    displayContent = {
      deepDives: [],
      pairPattern: null,
      arenaFallback: lagging.arena,
      multipleGaps: false,
    };
  } else if (gapDomains.length === 1) {
    classification = "SINGLE_DOMAIN_GAP";
    displayContent = {
      deepDives: [gapDomains[0].code],
      pairPattern: null,
      arenaFallback: null,
      multipleGaps: false,
    };
  } else if (gapDomains.length === 2) {
    const a0 = gapDomains[0].arena;
    const a1 = gapDomains[1].arena;
    if (a0 && a0 === a1) {
      classification = "PAIRED_DOMAIN_GAP";
      pairCode = getPairCode(gapDomains[0].code, gapDomains[1].code);
      displayContent = {
        deepDives: [gapDomains[0].code, gapDomains[1].code],
        pairPattern: pairCode,
        arenaFallback: null,
        multipleGaps: false,
      };
    } else {
      classification = "SPLIT_DOMAIN_GAP";
      displayContent = {
        deepDives: [gapDomains[0].code, gapDomains[1].code],
        pairPattern: null,
        arenaFallback: null,
        multipleGaps: false,
      };
    }
  } else {
    classification = "MULTIPLE_GAPS";
    displayContent = {
      deepDives: [gapDomains[0].code, gapDomains[1].code],
      pairPattern: null,
      arenaFallback: null,
      multipleGaps: true,
    };
  }

  return {
    classification,
    domainAverage,
    gapThreshold,
    gapDomains,
    laggingArena: lagging.arena,
    laggingArenaScore: lagging.average,
    pairCode,
    displayContent,
  };
}

/**
 * Attach journeymanAnalysis when archetype is The Journeyman; otherwise remove stale field.
 */
export function enrichResultsWithJourneyman(results) {
  if (!results || typeof results !== "object") return results;

  const archetype = results.archetype;
  if (archetype !== "The Journeyman") {
    if ("journeymanAnalysis" in results) delete results.journeymanAnalysis;
    return results;
  }

  const domainScores = buildDomainScoresMap(results);
  const importanceRatings = results.importanceRatings || results.importance_ratings || {};

  results.journeymanAnalysis = analyzeJourneyman(domainScores, importanceRatings);
  return results;
}

const globalRef = typeof globalThis !== "undefined" ? globalThis : {};
if (typeof globalRef.window !== "undefined") {
  globalRef.window.VAPI_JOURNEYMAN = {
    analyzeJourneyman,
    enrichResultsWithJourneyman,
    buildDomainScoresMap,
    getArenaForDomain,
    findLaggingArena,
    getPairCode,
    JOURNEYMAN_DOMAIN_NAMES,
  };
}
