/**
 * Run: node campaigns/aligned-power-vapi/scripts/test-journeyman-analysis.mjs
 * From repo root or from output-assets (adjust import path if needed).
 */
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const libPath = join(__dirname, "../output-assets/lib/vapi-journeyman-analysis.js");

const {
  analyzeJourneyman,
  getPairCode,
  findLaggingArena,
  buildDomainScoresMap,
  enrichResultsWithJourneyman,
} = await import(libPath);

function approx(a, b, eps = 0.001) {
  return Math.abs(a - b) < eps;
}

// --- Frank Sloan ---
const frankScores = {
  PH: 5.5,
  IA: 7.3,
  ME: 8.4,
  AF: 8.2,
  RS: 7.9,
  FA: 8.2,
  CO: 7.7,
  WI: 8.4,
  VS: 8.1,
  EX: 7.7,
  OH: 8.7,
  EC: 7.0,
};
const frankImp = {
  PH: 8,
  IA: 7,
  ME: 7,
  AF: 3,
  RS: 7,
  FA: 5,
  CO: 7,
  EC: 5,
  EX: 5,
  OH: 5,
  VS: 5,
  WI: 7,
};

const frankSum = Object.values(frankScores).reduce((a, b) => a + b, 0);
const frankExpectedAvg = frankSum / 12; // spec text had 92.1; correct sum of listed scores is 93.1

const frank = analyzeJourneyman(frankScores, frankImp);
assert.equal(frank.classification, "SINGLE_DOMAIN_GAP");
assert(approx(frank.domainAverage, frankExpectedAvg));
assert(approx(frank.gapThreshold, frank.domainAverage - 1.5));
assert.equal(frank.gapDomains.length, 1);
assert.equal(frank.gapDomains[0].code, "PH");
assert.equal(frank.gapDomains[0].score, 5.5);
assert.equal(frank.gapDomains[0].importanceContradiction, true);
assert.deepEqual(frank.displayContent.deepDives, ["PH"]);
assert.equal(frank.displayContent.pairPattern, null);
assert.equal(frank.displayContent.arenaFallback, null);
assert.equal(frank.pairCode, null);

// --- Pair code alphabetical ---
assert.equal(getPairCode("OH", "EX"), "EX_OH");
assert.equal(getPairCode("EX", "OH"), "EX_OH");
assert.equal(getPairCode("IA", "PH"), "IA_PH");

// --- PAIRED_DOMAIN_GAP same arena ---
const pairedScores = { ...frankScores, PH: 5.0, IA: 5.2 };
const paired = analyzeJourneyman(pairedScores, {});
assert.equal(paired.classification, "PAIRED_DOMAIN_GAP");
assert.equal(paired.pairCode, "IA_PH");
assert.deepEqual(paired.displayContent.deepDives.sort(), ["IA", "PH"].sort());

// --- SPLIT_DOMAIN_GAP different arenas ---
const splitScores = { ...frankScores, PH: 5.0, VS: 5.0 };
const split = analyzeJourneyman(splitScores, {});
assert.equal(split.classification, "SPLIT_DOMAIN_GAP");
assert.equal(split.pairCode, null);

// --- ARENA_PATTERN no gaps ---
const strong = Object.fromEntries(
  Object.keys(frankScores).map((k) => [k, 8.0])
);
const none = analyzeJourneyman(strong, {});
assert.equal(none.classification, "ARENA_PATTERN");
assert(none.displayContent.arenaFallback != null);

// --- MULTIPLE_GAPS ---
const multiScores = { ...frankScores, PH: 4.0, IA: 4.5, ME: 4.2 };
const multi = analyzeJourneyman(multiScores, {});
assert.equal(multi.classification, "MULTIPLE_GAPS");
assert.equal(multi.displayContent.deepDives.length, 2);
assert.equal(multi.displayContent.multipleGaps, true);

// --- Edge: exactly at gap threshold (not a gap) ---
const avgTest = { ...strong, PH: 6.5 };
// domainAverage for all 8s except PH 6.5: (11*8 + 6.5)/12 = 94.5/12 = 7.875, threshold 6.375
// PH 6.5 < 6.375? false. Second: 6.5 < 6.5? false. So PH not gap
const edgeAvg = analyzeJourneyman(avgTest, {});
assert(
  !edgeAvg.gapDomains.some((g) => g.code === "PH"),
  "PH at threshold boundary should not be gap via first rule"
);

// --- Edge: 6.4 with average >= 7.5 ---
const sixFour = { ...strong, PH: 6.4 };
const g = analyzeJourneyman(sixFour, {});
assert(g.gapDomains.some((d) => d.code === "PH"), "6.4 < 6.5 with high average should gap");

// --- Edge: 6.6 with average >= 7.5 not second-rule gap ---
const sixSix = { ...strong, PH: 6.6 };
const g2 = analyzeJourneyman(sixSix, {});
assert(!g2.gapDomains.some((d) => d.code === "PH"), "6.6 should not trigger < 6.5 rule");

// --- enrichResultsWithJourneyman ---
const enriched = enrichResultsWithJourneyman({
  archetype: "The Journeyman",
  domainScores: frankScores,
  importanceRatings: frankImp,
});
assert(enriched.journeymanAnalysis.classification === "SINGLE_DOMAIN_GAP");

const notJ = enrichResultsWithJourneyman({ archetype: "The Architect", domainScores: frankScores });
assert(!("journeymanAnalysis" in notJ) || notJ.journeymanAnalysis === undefined);
// implementation deletes key
assert.equal(notJ.journeymanAnalysis, undefined);

console.log("All Journeyman analysis tests passed.");
