/**
 * Shared VAPI result enrichment for storage and sprint generation (portal + internal Alfred sync).
 */

import { enrichResultsWithDriver } from "./vapi-driver-scoring.js";
import { enrichResultsWithJourneyman } from "../vapi-journeyman-analysis.js";

export function determineArchetypeFromResults(results) {
  const arenaScores = results?.arenaScores || {};
  const domainScores = { ...(results?.domainScores || {}) };
  (results?.domains || []).forEach((domain) => {
    if (domain && domain.code) {
      domainScores[domain.code] = domain.score ?? 0;
    }
  });

  const toNumber = (value) => {
    const num = typeof value === "number" ? value : parseFloat(value);
    return Number.isFinite(num) ? num : null;
  };

  const personal = toNumber(arenaScores.Personal ?? arenaScores.Self);
  const relationships = toNumber(arenaScores.Relationships);
  const business = toNumber(arenaScores.Business);
  const overall = toNumber(results?.overall);
  const exScore = toNumber(domainScores.EX);
  const ecScore = toNumber(domainScores.EC);
  const vsScore = toNumber(domainScores.VS);

  if (personal == null || relationships == null || business == null) {
    return results?.archetype || null;
  }

  if (personal >= 8.0 && relationships >= 8.0 && business >= 8.0) {
    return "The Architect";
  }

  const nearArchitectCount = [personal, relationships, business].filter((score) => score >= 7.5).length;
  const lowestArena = Math.min(personal, relationships, business);
  if (overall != null && overall >= 7.0 && nearArchitectCount >= 2 && lowestArena >= 6.5) {
    return "The Journeyman";
  }

  const arenasLow = [personal, relationships, business].filter((score) => score <= 4.5).length;
  if ((overall != null && overall <= 4.5) || arenasLow >= 2) {
    return "The Phoenix";
  }

  if (exScore != null && exScore >= 7.0 && ((ecScore != null && ecScore <= 5.0) || (vsScore != null && vsScore <= 5.0))) {
    return "The Engine";
  }

  const highestArena = Math.max(personal, relationships, business);
  if (
    personal >= 5.0 &&
    personal <= 7.9 &&
    relationships >= 5.0 &&
    relationships <= 7.9 &&
    business >= 5.0 &&
    business <= 7.9 &&
    highestArena - lowestArena <= 2.0
  ) {
    return "The Drifter";
  }

  if (business > personal && business > relationships && business - personal >= 2.0) {
    return "The Performer";
  }

  if (
    business > personal &&
    business > relationships &&
    relationships < personal &&
    business - relationships >= 2.0
  ) {
    return "The Ghost";
  }

  if (
    relationships > personal &&
    relationships > business &&
    business < personal &&
    relationships - business >= 2.0
  ) {
    return "The Guardian";
  }

  if (
    personal > relationships &&
    personal > business &&
    business < relationships &&
    personal - business >= 2.0
  ) {
    return "The Seeker";
  }

  return "The Drifter";
}

/** @param {object} results — raw assessment results from client or Alfred */
export function enrichVapiResultsForStorage(results) {
  if (!results || typeof results !== "object") return {};
  const enriched = enrichResultsWithDriver(results);
  const archetype = determineArchetypeFromResults(results);
  if (archetype) {
    enriched.archetype = archetype;
  }
  enrichResultsWithJourneyman(enriched);
  return enriched;
}
