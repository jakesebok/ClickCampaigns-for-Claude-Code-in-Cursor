/**
 * Build My Plan sprint payload from enriched VAPI results (server-only).
 * Reuses journeyman deep dives / pair notes / arena fallbacks when archetype is The Journeyman.
 */

import { buildDomainScoresMap, JOURNEYMAN_DOMAIN_NAMES } from "../vapi-journeyman-analysis.js";
import { JOURNEYMAN_DEEP_DIVES } from "../journeyman/index.js";
import { JOURNEYMAN_PAIR_NOTES } from "../journeyman/pairs.js";
import { JOURNEYMAN_ARENA_FALLBACKS } from "../journeyman/fallbacks.js";
import {
  determineUserLevel,
  getOpenerForLevel,
  getDriverModifier,
  resolveDriverSlug,
} from "../action-plan-content/index.js";
import { selectFocusDomain } from "../action-plan-content/focus-domain.js";

/** @param {string|undefined} s */
export function normalizeAssessmentSource(s) {
  const x = String(s || "")
    .trim()
    .toLowerCase();
  if (x === "app" || x === "alfred" || x === "aligned-ai-os" || x === "aligned_ai_os") return "alfred";
  if (x === "portal") return "portal";
  if (x === "marketing" || x === "") return "marketing";
  return x.length ? x : "marketing";
}

/** @param {string|undefined} s */
export function primarySurfaceFromSource(s) {
  return normalizeAssessmentSource(s) === "alfred" ? "alfred" : "portal";
}

function toNum(value, fallback = null) {
  const n = typeof value === "number" ? value : parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

function fmtScore(n) {
  if (n == null || !Number.isFinite(Number(n))) return "-";
  return String(Math.round(Number(n) * 10) / 10);
}

function interpolateDeepDiveStrings(dd, primaryCode, domainScores) {
  const sub = (str) => {
    if (!str) return str;
    return str
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

/**
 * Parse **Week 1: Title.** blocks from thirtyDayFocus markdown into week objects with raw body.
 * @param {string} markdown
 */
export function parseThirtyDayWeekBlocks(markdown) {
  if (!markdown || typeof markdown !== "string") return [];
  const text = markdown.replace(/\r\n/g, "\n").trim();
  const re = /\*\*Week (\d+)(?:-(\d+))?:\s*([^\*]+)\*\*/g;
  /** @type {{ weekNumber: number; theme: string; body: string }[]} */
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const start = parseInt(m[1], 10);
    const end = m[2] ? parseInt(m[2], 10) : start;
    const title = m[3].trim().replace(/\.$/, "");
    const startIdx = m.index + m[0].length;
    const rest = text.slice(startIdx);
    const nextMatch = rest.match(/\*\*Week \d+/);
    const endIdx = nextMatch ? startIdx + nextMatch.index : text.length;
    const body = text.slice(startIdx, endIdx).trim();
    for (let w = start; w <= end; w++) {
      out.push({
        weekNumber: w,
        theme: w === start ? title : `${title} (continued)`,
        body,
      });
    }
  }
  out.sort((a, b) => a.weekNumber - b.weekNumber);
  return out;
}

/**
 * @param {string} body
 * @param {number} weekNum
 */
function bulletsToTasks(body, weekNum) {
  const lines = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => /^-\s/.test(l));
  return lines.map((line, i) => {
    const description = line.replace(/^-\s*/, "").trim();
    const title = description.length > 100 ? `${description.slice(0, 97)}…` : description;
    return {
      id: `w${weekNum}-t${i + 1}`,
      title: title || `Focus step ${i + 1}`,
      description: description || title,
      completed: false,
    };
  });
}

function ensureFourWeeks(weeks) {
  const byNum = new Map();
  for (const w of weeks) {
    if (!byNum.has(w.weekNumber)) byNum.set(w.weekNumber, w);
  }
  /** @type {{ weekNumber: number; theme: string; tasks: object[]; reflectionPrompt?: string }[]} */
  const ordered = [];
  for (let n = 1; n <= 4; n++) {
    if (byNum.has(n)) {
      const w = byNum.get(n);
      ordered.push({
        weekNumber: n,
        theme: w.theme,
        tasks: w.tasks?.length ? w.tasks : [{ id: `w${n}-t1`, title: "Complete this week's focus", description: w.body || w.theme, completed: false }],
        reflectionPrompt: `What shifted for you in week ${n}? What will you carry forward?`,
      });
    } else {
      ordered.push({
        weekNumber: n,
        theme: `Week ${n}: Build momentum`,
        tasks: [
          {
            id: `w${n}-t1`,
            title: "Review your VAPI growth edge",
            description: "Re-read your assessment insights and pick one behavior to practice daily.",
            completed: false,
          },
          {
            id: `w${n}-t2`,
            title: "Book reflection time",
            description: "Block 30 minutes to journal on progress and obstacles.",
            completed: false,
          },
        ],
        reflectionPrompt: `Week ${n} reflection: what's working?`,
      });
    }
  }
  return ordered;
}

/**
 * @param {object} analysis — results.journeymanAnalysis
 * @param {Record<string, number>} domainScores
 */
function buildJourneymanWeeks(analysis, domainScores) {
  const dc = analysis?.displayContent;
  const classification = analysis?.classification;

  if (classification === "SINGLE_DOMAIN_GAP" && dc?.deepDives?.length === 1) {
    const code = dc.deepDives[0];
    const raw = JOURNEYMAN_DEEP_DIVES[code];
    if (raw) {
      const interp = interpolateDeepDiveStrings(raw, code, domainScores);
      const blocks = parseThirtyDayWeekBlocks(interp.thirtyDayFocus);
      const weeks = blocks.map((b) => ({
        weekNumber: b.weekNumber,
        theme: b.theme,
        tasks: bulletsToTasks(b.body, b.weekNumber),
        body: b.body,
      }));
      return ensureFourWeeks(weeks);
    }
  }

  if (classification === "PAIRED_DOMAIN_GAP" && dc?.pairPattern && JOURNEYMAN_PAIR_NOTES[dc.pairPattern]) {
    const note = JOURNEYMAN_PAIR_NOTES[dc.pairPattern];
    const paras = note.split(/\n\n+/).filter(Boolean);
    return ensureFourWeeks([
      { weekNumber: 1, theme: "Understand the pattern", tasks: bulletsFromText(paras[0] || note, 1), body: paras[0] || note },
      { weekNumber: 2, theme: "Stabilize the foundation", tasks: bulletsFromText(paras[1] || note, 2), body: paras[1] || note },
      { weekNumber: 3, theme: "Practice new behaviors", tasks: bulletsFromText(paras[2] || note, 3), body: paras[2] || note },
      { weekNumber: 4, theme: "Integrate and review", tasks: bulletsFromText(paras[3] || note, 4), body: paras[3] || note },
    ]);
  }

  if (classification === "ARENA_PATTERN" && analysis?.laggingArena && JOURNEYMAN_ARENA_FALLBACKS[analysis.laggingArena]) {
    const fb = JOURNEYMAN_ARENA_FALLBACKS[analysis.laggingArena];
    const body = fb.body;
    return ensureFourWeeks([
      { weekNumber: 1, theme: "Read the full picture", tasks: bulletsFromText(body.slice(0, 600), 1), body },
      { weekNumber: 2, theme: "Choose your anchor domain", tasks: bulletsFromText(body.slice(600, 1200), 2), body },
      { weekNumber: 3, theme: "Daily practice", tasks: bulletsFromText(body.slice(1200, 1800), 3), body },
      { weekNumber: 4, theme: "Review and next 90 days", tasks: bulletsFromText(body.slice(1800) || fb.title, 4), body },
    ]);
  }

  if (classification === "SPLIT_DOMAIN_GAP" || classification === "MULTIPLE_GAPS") {
    const codes = (dc?.deepDives || []).slice(0, 2);
    const parts = [];
    for (const code of codes) {
      const raw = JOURNEYMAN_DEEP_DIVES[code];
      if (raw) {
        const interp = interpolateDeepDiveStrings(raw, code, domainScores);
        parts.push(interp.thirtyDayFocus || interp.leveragePoint || raw.whyMatters);
      }
    }
    const merged = parts.join("\n\n") || "Focus on your lowest-scoring domains with consistent weekly experiments.";
    const blocks = parseThirtyDayWeekBlocks(merged);
    if (blocks.length) {
      const weeks = blocks.map((b) => ({
        weekNumber: b.weekNumber,
        theme: b.theme,
        tasks: bulletsToTasks(b.body, b.weekNumber),
        body: b.body,
      }));
      return ensureFourWeeks(weeks);
    }
    return ensureFourWeeks(
      [1, 2, 3, 4].map((n) => ({
        weekNumber: n,
        theme: `Week ${n}: Multi-domain balance`,
        tasks: bulletsFromText(merged, n),
        body: merged,
      }))
    );
  }

  return ensureFourWeeks([]);
}

/**
 * Four-week structure from one domain's Journeyman deep dive (non-Journeyman archetypes).
 * @param {string} domainCode
 * @param {Record<string, number>} domainScores
 */
function buildWeeksFromSingleDomainDeepDive(domainCode, domainScores) {
  const code = String(domainCode || "").trim();
  const raw = JOURNEYMAN_DEEP_DIVES[code];
  if (!raw) return null;
  const interp = interpolateDeepDiveStrings(raw, code, domainScores);
  const blocks = parseThirtyDayWeekBlocks(interp.thirtyDayFocus);
  if (!blocks.length) return null;
  const weeks = blocks.map((b) => ({
    weekNumber: b.weekNumber,
    theme: b.theme,
    tasks: bulletsToTasks(b.body, b.weekNumber),
    body: b.body,
  }));
  return ensureFourWeeks(weeks);
}

/**
 * Layered context: level opener replaces deep-dive whyMatters when present; other fields from deep dive.
 * @param {string} focusDomain
 * @param {"high-performer"|"mid-level"|"rebuilding"} level
 * @param {Record<string, number>} domainScores
 */
function buildPlanContext(focusDomain, level, domainScores) {
  const code = String(focusDomain || "").trim();
  const dd = JOURNEYMAN_DEEP_DIVES[code];
  const opener = getOpenerForLevel(code, level);
  const label = JOURNEYMAN_DOMAIN_NAMES[code] || code;
  /** @type {Record<string, string>} */
  const ctx = {};
  if (dd) {
    const interp = interpolateDeepDiveStrings(dd, code, domainScores);
    ctx.whyItMatters = (opener || interp.whyMatters || "").trim();
    if (interp.usuallyIndicates?.trim()) ctx.usuallyIndicates = interp.usuallyIndicates.trim();
    if (interp.hiddenCost?.trim()) ctx.hiddenCost = interp.hiddenCost.trim();
    if (interp.leveragePoint?.trim()) ctx.leveragePoint = interp.leveragePoint.trim();
    if (interp.howToKnow?.trim()) ctx.howToKnow = interp.howToKnow.trim();
  } else {
    ctx.whyItMatters = (
      opener ||
      `Your sprint centers on ${label} as the domain with the strongest signal for growth from your latest scores. Small, steady moves there compound.`
    ).trim();
  }
  const out = {};
  for (const [k, v] of Object.entries(ctx)) {
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return out;
}

function bulletsFromText(text, weekNum) {
  const chunk = String(text || "")
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const bullets = chunk.filter((l) => l.startsWith("-")).slice(0, 5);
  if (bullets.length) {
    return bulletsToTasks(bullets.join("\n"), weekNum);
  }
  const sentences = String(text || "")
    .replace(/\*\*/g, "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
  const pick = sentences.slice(0, 3);
  if (!pick.length) {
    return [
      {
        id: `w${weekNum}-t1`,
        title: "Apply this week's theme",
        description: "Take one concrete action aligned with your VAPI results.",
        completed: false,
      },
    ];
  }
  return pick.map((s, i) => ({
    id: `w${weekNum}-t${i + 1}`,
    title: s.length > 100 ? `${s.slice(0, 97)}…` : s,
    description: s,
    completed: false,
  }));
}

/**
 * @param {string} archetype
 * @param {string|null} driver
 */
function buildGenericWeeks(archetype, driver) {
  const d = driver && driver !== "Aligned Momentum" ? driver : null;
  const themes = [
    { n: 1, theme: "Awareness", blurb: `Notice how your archetype pattern (${archetype}) shows up in a typical week.` },
    { n: 2, theme: "Practice", blurb: d ? `Run one small experiment related to ${d}.` : "Run one small alignment experiment this week." },
    { n: 3, theme: "Deepen", blurb: "Repeat what worked; cut what didn't. Stack one habit." },
    { n: 4, theme: "Integrate", blurb: "Name one identity-level commitment for the next quarter." },
  ];
  return themes.map(({ n, theme, blurb }) => ({
    weekNumber: n,
    theme: `Week ${n}: ${theme}`,
    tasks: [
      {
        id: `w${n}-t1`,
        title: blurb,
        description: blurb,
        completed: false,
      },
      {
        id: `w${n}-t2`,
        title: "Check in with your coach or accountability partner",
        description: "Share one win and one obstacle.",
        completed: false,
      },
    ],
    reflectionPrompt: `Week ${n}: what did you learn about yourself?`,
  }));
}

/**
 * @param {object} results — enriched VAPI results object
 * @param {{ userEmail: string, vapiResultId?: string|null, assessmentSource?: string }} meta
 */
export function buildSprintPayload(results, meta) {
  const userEmail = String(meta.userEmail || "")
    .trim()
    .toLowerCase();
  const assessmentSource = normalizeAssessmentSource(meta.assessmentSource);
  const primary_surface = primarySurfaceFromSource(meta.assessmentSource);
  const archetype = results?.archetype || "The Drifter";
  const driver = results?.assignedDriver ?? results?.driver ?? null;
  const driverStr = typeof driver === "string" ? driver : null;
  const domainScores = buildDomainScoresMap(results);
  const focusDomain = selectFocusDomain(results);
  const level = determineUserLevel(results?.overall);
  const driverSlugForPlan = resolveDriverSlug(driverStr);
  const planContext = buildPlanContext(focusDomain, level, domainScores);
  const driverModifier = getDriverModifier(focusDomain, driverSlugForPlan);
  const focusLabel = JOURNEYMAN_DOMAIN_NAMES[focusDomain] || focusDomain;

  /** @type {ReturnType<ensureFourWeeks>} */
  let weeks;
  if (archetype === "The Journeyman" && results?.journeymanAnalysis) {
    weeks = buildJourneymanWeeks(results.journeymanAnalysis, domainScores);
  } else {
    const wd = buildWeeksFromSingleDomainDeepDive(focusDomain, domainScores);
    weeks = wd || buildGenericWeeks(archetype, driverStr);
  }

  const title = `Your 28-day plan`;
  const summary =
    archetype === "The Journeyman" && results?.journeymanAnalysis?.classification
      ? `Tailored from your Journeyman pattern (${results.journeymanAnalysis.classification.replace(/_/g, " ").toLowerCase()}). Layered focus: ${focusLabel}.`
      : `Based on your VAPI profile: ${archetype}${driverStr && driverStr !== "Aligned Momentum" ? ` · Primary driver: ${driverStr}` : ""}. Primary focus domain: ${focusLabel}.`;

  const payload = {
    version: 1,
    title,
    summary,
    archetype,
    driver: driverStr,
    focusDomain,
    focusDomainLabel: focusLabel,
    userLevel: level,
    context: planContext,
    ...(driverModifier ? { driverModifier } : {}),
    weeks,
    generatedAt: new Date().toISOString(),
  };

  return {
    user_email: userEmail,
    vapi_result_id: meta.vapiResultId || null,
    assessment_source: assessmentSource,
    primary_surface,
    status: "active",
    sprint_type: "auto",
    payload,
  };
}
