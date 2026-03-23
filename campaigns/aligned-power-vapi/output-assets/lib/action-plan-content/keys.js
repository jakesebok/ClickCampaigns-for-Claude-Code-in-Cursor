/**
 * Index keys for 30-day action plan content (openers + driver modifiers).
 * assignedDriver from VAPI uses DISPLAY NAMES in the right column.
 */

export const DOMAIN_CODES = [
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

export const LEVEL_KEYS = /** @type {const} */ ([
  "high-performer",
  "mid-level",
  "rebuilding",
]);

/** Slug used in content files / registry */
export const DRIVER_SLUGS = /** @type {const} */ ([
  "achievers-trap",
  "escape-artist",
  "pleasers-bind",
  "imposter-loop",
  "perfectionists-prison",
  "protector",
  "martyr-complex",
  "fog",
  "scattered-mind",
  "builders-gap",
  "aligned-momentum",
]);

/** Map slug → exact VAPI assignedDriver string (or Aligned Momentum) */
export const DRIVER_SLUG_TO_VAPI_NAME = {
  "achievers-trap": "The Achiever's Trap",
  "escape-artist": "The Escape Artist",
  "pleasers-bind": "The Pleaser's Bind",
  "imposter-loop": "The Imposter Loop",
  "perfectionists-prison": "The Perfectionist's Prison",
  protector: "The Protector",
  "martyr-complex": "The Martyr Complex",
  fog: "The Fog",
  "scattered-mind": "The Scattered Mind",
  "builders-gap": "The Builder's Gap",
  "aligned-momentum": "Aligned Momentum",
};

/** Reverse map for lookup from stored results */
export function vapiDriverNameToSlug(name) {
  const n = String(name || "").trim();
  for (const [slug, display] of Object.entries(DRIVER_SLUG_TO_VAPI_NAME)) {
    if (display === n) return slug;
  }
  return null;
}

/** For sprint assembly: dysfunction driver → slug; null/Aligned Momentum → aligned-momentum */
export function resolveDriverSlug(assignedDriver) {
  const n = String(assignedDriver || "").trim();
  if (!n || n === DRIVER_SLUG_TO_VAPI_NAME["aligned-momentum"]) {
    return "aligned-momentum";
  }
  return vapiDriverNameToSlug(n) || "aligned-momentum";
}
