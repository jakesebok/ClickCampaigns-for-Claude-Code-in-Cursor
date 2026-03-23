/**
 * 30-day plan layered content: level openers + driver modifiers.
 * Lookups return null when data is missing so sprint assembly never throws.
 */

import { OPENERS } from "./openers-data.js";
import { DRIVER_MODIFIERS } from "./drivers-modifiers-data.js";

/**
 * @param {number|null|undefined} composite - results.overall (0-10 style)
 * @returns {"high-performer"|"mid-level"|"rebuilding"}
 */
export function determineUserLevel(composite) {
  const s = typeof composite === "number" ? composite : parseFloat(composite);
  if (!Number.isFinite(s)) return "mid-level";
  if (s >= 7.0) return "high-performer";
  if (s >= 5.5) return "mid-level";
  return "rebuilding";
}

/**
 * @param {string} domainCode - PH, IA, ...
 * @param {"high-performer"|"mid-level"|"rebuilding"} levelKey
 * @returns {string|null}
 */
export function getOpenerForLevel(domainCode, levelKey) {
  try {
    const code = String(domainCode || "").trim();
    if (!code) return null;
    const row = OPENERS[code];
    if (!row || typeof row !== "object") return null;
    const t = row[levelKey];
    return typeof t === "string" && t.trim() ? t.trim() : null;
  } catch {
    return null;
  }
}

/**
 * @param {string} domainCode
 * @param {string} driverSlug - e.g. achievers-trap, aligned-momentum
 * @returns {string|null}
 */
export function getDriverModifier(domainCode, driverSlug) {
  try {
    const code = String(domainCode || "").trim();
    const slug = String(driverSlug || "").trim();
    if (!code || !slug) return null;
    const byDriver = DRIVER_MODIFIERS[slug];
    if (!byDriver || typeof byDriver !== "object") return null;
    const t = byDriver[code];
    return typeof t === "string" && t.trim() ? t.trim() : null;
  } catch {
    return null;
  }
}

export {
  vapiDriverNameToSlug,
  resolveDriverSlug,
  DOMAIN_CODES,
  LEVEL_KEYS,
  DRIVER_SLUGS,
  DRIVER_SLUG_TO_VAPI_NAME,
} from "./keys.js";
