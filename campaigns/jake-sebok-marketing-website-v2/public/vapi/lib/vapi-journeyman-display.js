/**
 * Builds "Your Growth Edge" HTML for The Journeyman on VAPI results (and portal).
 * Depends on vapi-journeyman-analysis.js (side effect: window.VAPI_JOURNEYMAN).
 */

import { enrichResultsWithJourneyman, buildDomainScoresMap, JOURNEYMAN_DOMAIN_NAMES } from "./vapi-journeyman-analysis.js";
import { JOURNEYMAN_DEEP_DIVES, JOURNEYMAN_PAIR_NOTES, JOURNEYMAN_ARENA_FALLBACKS } from "./journeyman/index.js";

const ARENA_LABEL = { Personal: "Self", Relationships: "Relationships", Business: "Business" };

const DOMAIN_CODES_ALL = ["PH", "IA", "ME", "AF", "RS", "FA", "CO", "WI", "VS", "EX", "OH", "EC"];

function fmtScore(n) {
  if (n == null || n === "" || !Number.isFinite(Number(n))) return "-";
  return String(Math.round(Number(n) * 10) / 10);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** **bold** and escape rest */
function inlineFormat(str) {
  if (!str) return "";
  return str.split(/(\*\*[^*]+\*\*)/g).map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return "<strong>" + escapeHtml(part.slice(2, -2)) + "</strong>";
    }
    return escapeHtml(part);
  }).join("");
}

function blockToHtml(block) {
  const lines = block.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    if (/^\s*-\s/.test(lines[i])) {
      const items = [];
      while (i < lines.length && /^\s*-\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*-\s*/, ""));
        i++;
      }
      out.push(
        '<ul class="list-disc pl-5 space-y-1.5 mb-4 text-[var(--ap-secondary)]">' +
          items.map((it) => "<li>" + inlineFormat(it) + "</li>").join("") +
          "</ul>"
      );
    } else {
      let j = i;
      while (j < lines.length && !/^\s*-\s/.test(lines[j])) j++;
      const para = lines.slice(i, j).join("\n").trim();
      if (para) {
        out.push(
          '<p class="text-[var(--ap-secondary)] leading-relaxed mb-3">' + inlineFormat(para) + "</p>"
        );
      }
      i = j;
    }
  }
  return out.join("");
}

function richFieldToHtml(text) {
  if (!text) return "";
  return text
    .split(/\n\n+/)
    .map((block) => blockToHtml(block))
    .join("");
}

function interpolateDeepDiveStrings(dd, primaryCode, domainScores) {
  const sub = (s) => {
    if (!s) return s;
    return s
      .replace(/\[score\]/g, fmtScore(domainScores[primaryCode]))
      .replace(/\[AF_score\]/g, fmtScore(domainScores.AF))
      .replace(/\[ME_score\]/g, fmtScore(domainScores.ME))
      .replace(/\[EC_score\]/g, fmtScore(domainScores.EC))
      .replace(/\[VS_score\]/g, fmtScore(domainScores.VS))
      .replace(/\[EX_score\]/g, fmtScore(domainScores.EX));
  };
  return {
    whyMatters: sub(dd.whyMatters),
    usuallyIndicates: sub(dd.usuallyIndicates),
    hiddenCost: sub(dd.hiddenCost),
    leveragePoint: sub(dd.leveragePoint),
    thirtyDayFocus: sub(dd.thirtyDayFocus),
    howToKnow: sub(dd.howToKnow),
  };
}

const SECTION_HEADERS = {
  whyMatters: "Why this matters at your level",
  usuallyIndicates: "What this usually indicates",
  hiddenCost: "The hidden cost",
  leveragePoint: "The leverage point",
  thirtyDayFocus: "The 30-day focus",
  howToKnow: "How to know it's working",
};

function buildDeepDiveSectionsHtml(interpolated, expanded) {
  const wrap = expanded ? "" : "";
  const sectionClass = expanded ? "mb-6" : "border-t border-[var(--ap-border)]/70 pt-4 mt-4 first:border-0 first:pt-0 first:mt-0";
  let h = "";
  const keys = ["whyMatters", "usuallyIndicates", "hiddenCost", "leveragePoint", "thirtyDayFocus", "howToKnow"];
  keys.forEach((key) => {
    const content = interpolated[key];
    if (!content) return;
    h +=
      '<div class="' +
      sectionClass +
      ' journeyman-deep-section">' +
      '<h4 class="text-sm font-extrabold text-[var(--ap-primary)] uppercase tracking-wider mb-2">' +
      escapeHtml(SECTION_HEADERS[key]) +
      "</h4>" +
      richFieldToHtml(content) +
      "</div>";
  });
  return h;
}

function scoreContextBanner(gd, domainAverage) {
  const gap = gd.score != null && domainAverage != null ? domainAverage - gd.score : null;
  const gapTxt = gap != null && Number.isFinite(gap) ? " (" + fmtScore(gap) + " below your " + fmtScore(domainAverage) + " domain average)" : "";
  return (
    '<div class="rounded-lg border border-amber-200 bg-amber-50/90 px-4 py-3 mb-4">' +
    '<p class="text-sm font-semibold text-amber-900">' +
    escapeHtml(JOURNEYMAN_DOMAIN_NAMES[gd.code] || gd.domain || gd.code) +
    ": <span class=\"tabular-nums\">" +
    fmtScore(gd.score) +
    "</span> / 10" +
    escapeHtml(gapTxt) +
    "</p></div>"
  );
}

function importanceCalloutHtml(gd) {
  if (!gd || !gd.importanceContradiction) return "";
  const ir = gd.importanceRating != null ? fmtScore(gd.importanceRating) : "7+";
  const name = escapeHtml(JOURNEYMAN_DOMAIN_NAMES[gd.code] || gd.domain || gd.code);
  return (
    '<div class="rounded-xl border-2 border-[var(--ap-accent)]/40 bg-[var(--ap-accent)]/10 p-4 mb-6">' +
    '<p class="text-sm font-semibold text-[var(--ap-primary)] mb-1">Known gap, not a blind spot</p>' +
    '<p class="text-sm text-[var(--ap-secondary)] leading-relaxed">' +
    "You rated " +
    name +
    " as highly important (" +
    ir +
    " out of 10) but scored " +
    fmtScore(gd.score) +
    ". This isn't a blind spot - it's a known gap you haven't addressed. That distinction matters. You don't need awareness; you need action. The reflection prompts below will help, but the real question is: what has prevented you from closing a gap you already knew existed?" +
    "</p></div>"
  );
}

function buildSingleDeepDiveHtml(code, domainScores, gapDomainMeta, domainAverage, expanded) {
  const dd = JOURNEYMAN_DEEP_DIVES[code];
  if (!dd) return '<p class="text-sm text-[var(--ap-muted)]">Deep dive content not found for ' + escapeHtml(code) + ".</p>";
  const interp = interpolateDeepDiveStrings(dd, code, domainScores);
  return buildDeepDiveSectionsHtml(interp, expanded);
}

/**
 * @param {object} results - VAPI results (mutated with journeymanAnalysis if missing)
 * @param {object} [opts]
 * @param {function(string): string} [opts.escapeHtml]
 * @returns {string} HTML fragment or empty string
 */
export function buildJourneymanGrowthEdgeHtml(results, opts) {
  if (!results || typeof results !== "object") return "";
  const esc = opts && opts.escapeHtml ? opts.escapeHtml : escapeHtml;

  enrichResultsWithJourneyman(results);
  if (results.archetype !== "The Journeyman" || !results.journeymanAnalysis) return "";

  const ja = results.journeymanAnalysis;
  const domainScores = buildDomainScoresMap(results);
  const dc = ja.displayContent || {};
  const classification = ja.classification;

  let subheading = "";
  const lagArena = ja.laggingArena || "Personal";
  const arenaHuman = ARENA_LABEL[lagArena] || lagArena;

  if (classification === "SINGLE_DOMAIN_GAP") {
    const code = dc.deepDives && dc.deepDives[0];
    const name = code ? JOURNEYMAN_DOMAIN_NAMES[code] || code : "";
    subheading = name + ": Your Specific Growth Edge";
  } else if (classification === "PAIRED_DOMAIN_GAP") {
    const a0 = ja.gapDomains[0] && ja.gapDomains[0].arena;
    subheading = "Two Connected Gaps in Your " + (ARENA_LABEL[a0] || a0) + " Arena";
  } else if (classification === "SPLIT_DOMAIN_GAP") {
    subheading = "Two Distinct Growth Edges";
  } else if (classification === "ARENA_PATTERN") {
    subheading = "Your " + arenaHuman + " Arena Is Trailing";
  } else if (classification === "MULTIPLE_GAPS") {
    subheading = "Prioritize These Two Growth Edges";
  }

  let body = "";

  if (classification === "SINGLE_DOMAIN_GAP") {
    const code = dc.deepDives[0];
    const gd = ja.gapDomains.find((g) => g.code === code) || ja.gapDomains[0];
    body += scoreContextBanner(gd, ja.domainAverage);
    body += importanceCalloutHtml(gd);
    body += buildSingleDeepDiveHtml(code, domainScores, gd, ja.domainAverage, true);
  } else if (classification === "PAIRED_DOMAIN_GAP") {
    const note = JOURNEYMAN_PAIR_NOTES[dc.pairPattern];
    if (note) {
      body +=
        '<div class="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-bg)] p-4 mb-6">' +
        '<p class="text-xs font-semibold uppercase tracking-wider text-[var(--ap-muted)] mb-2">Connected pattern</p>' +
        '<div class="text-[15px] text-[var(--ap-secondary)] leading-relaxed">' +
        richFieldToHtml(note) +
        "</div></div>";
    }
    dc.deepDives.forEach((code) => {
      const gd = ja.gapDomains.find((g) => g.code === code);
      body += '<details class="journeyman-pair-domain border border-[var(--ap-border)] rounded-xl mb-4 overflow-hidden" open>';
      body +=
        '<summary class="cursor-pointer px-4 py-3 font-semibold text-[var(--ap-primary)] bg-white hover:bg-[var(--ap-bg)] list-none flex items-center justify-between [&::-webkit-details-marker]:hidden">' +
        esc(JOURNEYMAN_DOMAIN_NAMES[code] || code) +
        (gd ? ' <span class="text-amber-700 tabular-nums font-bold">' + fmtScore(gd.score) + " / 10</span>" : "") +
        '<i data-lucide="chevron-down" class="w-4 h-4 journeyman-chevron shrink-0 transition-transform"></i></summary>';
      body += '<div class="px-4 pb-4 pt-0 bg-white">';
      body += importanceCalloutHtml(gd);
      body += buildSingleDeepDiveHtml(code, domainScores, gd, ja.domainAverage, true);
      body += "</div></details>";
    });
  } else if (classification === "SPLIT_DOMAIN_GAP") {
    body +=
      '<div class="rounded-lg border border-[var(--ap-border)] bg-[var(--ap-bg)] p-4 mb-6">' +
      '<p class="text-sm text-[var(--ap-secondary)] leading-relaxed">' +
      "You have two unrelated growth edges in different arenas. Address them <strong>sequentially</strong>, not simultaneously." +
      "</p></div>";
    dc.deepDives.forEach((code, idx) => {
      const gd = ja.gapDomains.find((g) => g.code === code);
      body += '<details class="journeyman-split-domain border border-[var(--ap-border)] rounded-xl mb-4 overflow-hidden"' + (idx === 0 ? " open" : "") + ">";
      body +=
        '<summary class="cursor-pointer px-4 py-3 font-semibold text-[var(--ap-primary)] bg-white hover:bg-[var(--ap-bg)] list-none flex items-center justify-between [&::-webkit-details-marker]:hidden">' +
        esc(JOURNEYMAN_DOMAIN_NAMES[code] || code) +
        (gd ? ' <span class="text-amber-700 tabular-nums font-bold">' + fmtScore(gd.score) + " / 10</span>" : "") +
        '<i data-lucide="chevron-down" class="w-4 h-4 journeyman-chevron shrink-0 transition-transform"></i></summary>';
      body += '<div class="px-4 pb-4 pt-0 bg-white">';
      body += scoreContextBanner(gd, ja.domainAverage);
      body += importanceCalloutHtml(gd);
      body += buildSingleDeepDiveHtml(code, domainScores, gd, ja.domainAverage, true);
      body += "</div></details>";
    });
  } else if (classification === "ARENA_PATTERN") {
    const arenaKey = dc.arenaFallback || lagArena;
    const fb = JOURNEYMAN_ARENA_FALLBACKS[arenaKey];
    if (fb) {
      body += '<h3 class="text-lg font-bold text-[var(--ap-primary)] mb-3">' + esc(fb.title) + "</h3>";
      body += '<div class="text-[15px] text-[var(--ap-secondary)] leading-relaxed mb-6">' + richFieldToHtml(fb.body) + "</div>";
    }
    const codes =
      arenaKey === "Personal"
        ? ["PH", "IA", "ME", "AF"]
        : arenaKey === "Relationships"
          ? ["RS", "FA", "CO", "WI"]
          : ["VS", "EX", "OH", "EC"];
    body += '<p class="text-sm font-semibold text-[var(--ap-muted)] mb-2">Domain scores in this arena</p>';
    body += '<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">';
    codes.forEach((c) => {
      body +=
        '<div class="rounded-lg border border-[var(--ap-border)] px-3 py-2 text-center">' +
        '<p class="text-xs text-[var(--ap-muted)] leading-tight">' +
        esc(JOURNEYMAN_DOMAIN_NAMES[c] || c) +
        "</p>" +
        '<p class="text-lg font-bold tabular-nums text-[var(--ap-primary)]">' +
        fmtScore(domainScores[c]) +
        "</p></div>";
    });
    body += "</div>";
    body +=
      '<p class="text-sm text-[var(--ap-secondary)] italic">No single domain stands out - the arena as a whole needs elevation.</p>';
  } else if (classification === "MULTIPLE_GAPS") {
    body +=
      '<div class="rounded-lg border border-amber-200 bg-amber-50/90 p-4 mb-6">' +
      '<p class="text-sm text-amber-950 leading-relaxed">' +
      "<strong>Several areas need attention.</strong> Focus on these two first - they're your lowest scores and will yield the highest leverage if improved." +
      "</p></div>";
    dc.deepDives.forEach((code, idx) => {
      const gd = ja.gapDomains.find((g) => g.code === code);
      body += '<details class="journeyman-multi-domain border border-[var(--ap-border)] rounded-xl mb-4 overflow-hidden"' + (idx === 0 ? " open" : "") + ">";
      body +=
        '<summary class="cursor-pointer px-4 py-3 font-semibold text-[var(--ap-primary)] bg-white hover:bg-[var(--ap-bg)] list-none flex items-center justify-between [&::-webkit-details-marker]:hidden">' +
        esc(JOURNEYMAN_DOMAIN_NAMES[code] || code) +
        (gd ? ' <span class="text-amber-700 tabular-nums font-bold">' + fmtScore(gd.score) + " / 10</span>" : "") +
        '<i data-lucide="chevron-down" class="w-4 h-4 journeyman-chevron shrink-0 transition-transform"></i></summary>';
      body += '<div class="px-4 pb-4 pt-0 bg-white">';
      body += scoreContextBanner(gd, ja.domainAverage);
      body += importanceCalloutHtml(gd);
      body += buildSingleDeepDiveHtml(code, domainScores, gd, ja.domainAverage, true);
      body += "</div></details>";
    });
  }

  const accent = "#4A7C9B";
  const html =
    '<section id="journeyman-growth-edge" class="journeyman-growth-edge bg-white rounded-2xl border border-[var(--ap-border)] shadow-lg overflow-hidden mb-10 relative" style="border-left:4px solid ' +
    accent +
    ';">' +
    '<div class="p-6 sm:p-8">' +
    '<p class="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style="color:' +
    accent +
    '">Your Growth Edge</p>' +
    '<h3 class="text-xl sm:text-2xl font-extrabold text-[var(--ap-primary)] mb-4">' +
    esc(subheading) +
    "</h3>" +
    body +
    "</div></section>";

  return html;
}

const g = typeof globalThis !== "undefined" ? globalThis : {};
if (g.window) {
  g.window.VAPI_JOURNEYMAN_DISPLAY = { buildJourneymanGrowthEdgeHtml };
}
