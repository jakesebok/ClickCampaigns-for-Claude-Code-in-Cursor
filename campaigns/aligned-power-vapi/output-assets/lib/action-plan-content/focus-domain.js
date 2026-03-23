/**
 * Select primary focus domain for layered plan content (opener + driver modifier).
 * Uses full 12-domain scores + importance (PH..EC).
 */

import { buildDomainScoresMap } from "../vapi-journeyman-analysis.js";

const ALL_CODES = ["PH", "IA", "ME", "AF", "RS", "FA", "CO", "WI", "VS", "EX", "OH", "EC"];

function toNum(v) {
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

/**
 * @param {object} results - enriched VAPI results
 * @returns {string} domain code e.g. PH
 */
export function selectFocusDomain(results) {
  const domainScores = buildDomainScoresMap(results || {});
  const imp = results?.importanceRatings || results?.importanceScores || {};
  const importance = typeof imp === "object" && imp ? imp : {};

  /** @type {string[]} */
  const critical = [];
  for (const code of ALL_CODES) {
    const s = toNum(domainScores[code]);
    const ir = toNum(importance[code]);
    if (s !== null && s <= 6.0 && ir !== null && ir >= 7) {
      critical.push(code);
    }
  }

  if (critical.length) {
    critical.sort((a, b) => {
      const ia = toNum(importance[a]) ?? 0;
      const ib = toNum(importance[b]) ?? 0;
      if (ib !== ia) return ib - ia;
      const sa = toNum(domainScores[a]) ?? 99;
      const sb = toNum(domainScores[b]) ?? 99;
      return sa - sb;
    });
    return critical[0];
  }

  /** @type {string[]} */
  const below6 = [];
  for (const code of ALL_CODES) {
    const s = toNum(domainScores[code]);
    if (s !== null && s < 6.0) below6.push(code);
  }

  if (below6.length) {
    below6.sort((a, b) => (toNum(domainScores[a]) ?? 99) - (toNum(domainScores[b]) ?? 99));
    return below6[0];
  }

  let best = ALL_CODES[0];
  let bestScore = toNum(domainScores[best]);
  for (const code of ALL_CODES) {
    const s = toNum(domainScores[code]);
    if (s === null) continue;
    if (bestScore === null || s < bestScore) {
      bestScore = s;
      best = code;
    }
  }
  return best;
}
