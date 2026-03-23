import { enrichResultsWithDriver } from "../vapi-driver-scoring.js";

/**
 * POST /api/vapi-assessment-complete
 * Fires immediately after a user completes the VAPI assessment
 * (72 behavioral questions + 12 importance ratings).
 *
 * Sends two emails via Resend:
 *   1. User notification with scores + portal link
 *   2. Admin notification to jacob@alignedpower.coach
 *
 * Body (JSON):
 *   email           string  — user email (optional for anon)
 *   firstName       string  — user first name
 *   lastName        string  — user last name
 *   overall         number
 *   overallTier     string
 *   arenaScores     { Personal, Relationships, Business }
 *   arenaTiers      { Personal, Relationships, Business }
 *   domains         array of { code, domain, score, tier }
 *   importanceRatings  { PH, IA, ME, AF, RS, FA, CO, WI, VS, EX, OH, EC }
 *   priorityMatrix  { criticalPriority: [...], protectAndSustain: [...], monitor: [...], overInvestment: [...] }
 *   contextualProfile  { revenueStage, teamSize, lifeStage, timeInBusiness, primaryChallenge }  (optional)
 *   assessmentNumber   number  (which assessment for this user)
 *   hasPortalAccount   boolean
 *   reflectionResponse string  (optional)
 */

const ADMIN_EMAIL       = 'jacob@alignedpower.coach';
const PORTAL_URL        = 'https://portal.alignedpower.coach';
const USER_FROM_EMAIL   = process.env.VAPI_USER_FROM_EMAIL   || 'hello@notifications.alignedpower.coach';
const ADMIN_FROM_EMAIL  = process.env.VAPI_ADMIN_FROM_EMAIL  || 'assessments@notifications.alignedpower.coach';
const ALIGNED_MOMENTUM_NAME = 'Aligned Momentum';
const ALIGNED_MOMENTUM_TAGLINE =
  "Your internal operating system is working with your goals, not against them.";
const SCATTERED_MIND_NAME = "The Scattered Mind";
const SCATTERED_MIND_TAGLINE =
  "You know exactly what matters. Your attention just won't stay there.";
const DRIVER_TIEBREAK_PRIORITY = [
  "The Achiever's Trap",
  "The Escape Artist",
  "The Pleaser's Bind",
  "The Imposter Loop",
  "The Perfectionist's Prison",
  "The Protector",
  "The Martyr Complex",
  "The Fog",
  "The Scattered Mind",
  "The Builder's Gap",
];
const DRIVER_CORE_BELIEFS = {
  "The Achiever's Trap": "I am what I produce.",
  "The Escape Artist": "If I stay busy enough, I won't have to feel this.",
  "The Pleaser's Bind": "My worth comes from being needed.",
  "The Imposter Loop": "If they really knew me, they'd know I'm not enough.",
  "The Perfectionist's Prison": "If it's not perfect, it's not safe to release.",
  "The Protector": "If I let go of control, everything falls apart.",
  "The Martyr Complex": "I have to suffer for this to count.",
  "The Fog": "I don't know what I want, so I can't commit to anything.",
  "The Scattered Mind": "I'll be able to focus when the conditions are right.",
  "The Builder's Gap": "Caring about people and doing good work should be enough. I shouldn't have to become a 'business person' to make this work.",
};
function normalizeArchetypeName(name) {
  if (name === 'The Rising Architect') return 'The Journeyman';
  return name;
}

const ARCHETYPE_TAGLINES = {
  'The Architect': "You've built a life and business that actually work together.",
  'The Journeyman':
    "You've built real skill across the board. One arena is lagging, and that's the final edge to sharpen.",
  'The Phoenix': 'In the fire. Not finished.',
  'The Engine': 'Building fast. Building wrong.',
  'The Drifter': 'Fine everywhere. Exceptional nowhere.',
  'The Performer': 'Impressive output. Crumbling foundation.',
  'The Ghost': 'Building an empire. Disappearing from your own life.',
  'The Guardian': 'All heart. Needs a vehicle.',
  'The Seeker': 'Deeply self-aware. Stuck in insight.',
};

function getTierColor(tier) {
  if (tier === 'Dialed')          return '#22C55E';
  if (tier === 'Functional')      return '#EAB308';
  if (tier === 'Below the Line')  return '#F97316';
  if (tier === 'In the Red')      return '#EF4444';
  return '#334750';
}

function ordinal(n) {
  const s = ['th','st','nd','rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function determineArchetypeServer(results) {
  const arenaScores = results.arenaScores || {};
  const domainScores = {};
  (results.domains || []).forEach(d => { if (d?.code) domainScores[d.code] = d.score; });
  const s = parseFloat(String(arenaScores.Personal ?? arenaScores.Self)) ?? null;
  const r = parseFloat(String(arenaScores.Relationships)) ?? null;
  const b = parseFloat(String(arenaScores.Business)) ?? null;
  const overall = typeof results.overall === 'number' ? results.overall : (Object.keys(domainScores).length ? Object.values(domainScores).reduce((a, v) => a + (v || 0), 0) / 12 : null);
  const exScore = domainScores.EX; const ecScore = domainScores.EC; const vsScore = domainScores.VS;
  if (s >= 8 && r >= 8 && b >= 8) return 'The Architect';
  const nearArchitectCount = [s, r, b].filter((score) => score != null && score >= 7.5).length;
  const lowestArena = Math.min(s, r, b);
  if (overall != null && overall >= 7.0 && nearArchitectCount >= 2 && lowestArena >= 6.5) {
    return 'The Journeyman';
  }
  let arenasLow = 0;
  if (s != null && s <= 4.5) arenasLow++;
  if (r != null && r <= 4.5) arenasLow++;
  if (b != null && b <= 4.5) arenasLow++;
  if (overall != null && overall <= 4.5) return 'The Phoenix';
  if (arenasLow >= 2) return 'The Phoenix';
  if (exScore != null && exScore >= 7 && ((ecScore != null && ecScore <= 5) || (vsScore != null && vsScore <= 5))) return 'The Engine';
  const allMid = s != null && r != null && b != null && s >= 5 && s <= 7.9 && r >= 5 && r <= 7.9 && b >= 5 && b <= 7.9;
  const spread = Math.max(s, r, b) - Math.min(s, r, b);
  if (allMid && spread <= 2) return 'The Drifter';
  if (s != null && r != null && b != null) {
    if (b === Math.max(s, r, b) && s === Math.min(s, r, b) && (b - s) >= 2) return 'The Performer';
    if (b === Math.max(s, r, b) && r === Math.min(s, r, b) && (b - r) >= 2) return 'The Ghost';
    if (r === Math.max(s, r, b) && b === Math.min(s, r, b) && (r - b) >= 2) return 'The Guardian';
    if (s === Math.max(s, r, b) && b === Math.min(s, r, b) && (s - b) >= 2) return 'The Seeker';
  }
  return 'The Drifter';
}

function formatScoreNumber(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(1) : '?';
}

function getScatteredMindDiagnostics(domains, importanceRatings) {
  const domainScores = buildDomainScoresMap(domains || []);
  const af = typeof domainScores.AF === 'number' ? domainScores.AF : null;
  const me = typeof domainScores.ME === 'number' ? domainScores.ME : null;
  const ex = typeof domainScores.EX === 'number' ? domainScores.EX : null;
  const oh = typeof domainScores.OH === 'number' ? domainScores.OH : null;
  const ia = typeof domainScores.IA === 'number' ? domainScores.IA : null;
  const afImportance = typeof importanceRatings?.AF === 'number' ? importanceRatings.AF : null;
  const signals = [];

  if (typeof af === 'number' && af <= 3.0) signals.push('Severe attention fragmentation');
  if (typeof ex === 'number' && ex <= 5.0) signals.push('Execution collapse');
  if (typeof oh === 'number' && oh <= 5.0) signals.push('Operational breakdown');
  if (typeof ia === 'number' && ia >= 7.0) signals.push('Alignment gap (clarity not translating)');
  if (typeof afImportance === 'number' && afImportance >= 5 && typeof af === 'number' && af <= 4.0) {
    signals.push('Importance contradiction');
  }

  return {
    gateSummary:
      'Passed (AF: ' +
      formatScoreNumber(af) +
      ' <= 5.0, ME: ' +
      formatScoreNumber(me) +
      ' >= 6.0)',
    signalsSummary: signals.length ? signals.join(', ') : 'None',
  };
}

function getLaggingArenaSummary(arenaScores = {}, personalLabel = 'Self') {
  const ranked = [
    { key: 'personal', label: personalLabel, score: parseFloat(String(arenaScores.Personal ?? arenaScores.Self ?? 0)) || 0 },
    { key: 'relationships', label: 'Relationships', score: parseFloat(String(arenaScores.Relationships ?? 0)) || 0 },
    { key: 'business', label: 'Business', score: parseFloat(String(arenaScores.Business ?? 0)) || 0 },
  ].sort((a, b) => a.score - b.score);
  return ranked[0];
}

function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildDomainScoresMap(domains) {
  const domainScores = {};
  (domains || []).forEach((domain) => {
    if (domain?.code) domainScores[domain.code] = domain.score;
  });
  return domainScores;
}

function createEmptyDriverScores() {
  return DRIVER_TIEBREAK_PRIORITY.reduce((acc, name) => {
    acc[name] = 0;
    return acc;
  }, {});
}

function createEmptyDriverGates() {
  return DRIVER_TIEBREAK_PRIORITY.reduce((acc, name) => {
    acc[name] = false;
    return acc;
  }, {});
}

function getCompositeScore(domainScores, overall) {
  if (typeof overall === 'number' && Number.isFinite(overall)) return overall;
  const values = Object.values(domainScores || {});
  return values.length ? values.reduce((sum, value) => sum + (value || 0), 0) / values.length : 0;
}

function getDriverFallbackType(domainScores, overall, assignedDriver) {
  if (assignedDriver && assignedDriver !== ALIGNED_MOMENTUM_NAME) return 'none';
  const normalizedScores = domainScores || {};
  const compositeScore = getCompositeScore(normalizedScores, overall);
  const domainsBelowThreshold = Object.values(normalizedScores).filter(
    (score) => typeof score === 'number' && score < 5.5
  ).length;
  return compositeScore >= 7.0 && domainsBelowThreshold <= 1
    ? 'aligned_momentum'
    : 'standard';
}

function getDriverState(assignedDriver, driverFallbackType) {
  if (assignedDriver === ALIGNED_MOMENTUM_NAME || driverFallbackType === 'aligned_momentum' || driverFallbackType === 'high_performer') {
    return 'aligned_momentum';
  }
  if (assignedDriver) return 'dysfunction_driver';
  return 'no_driver';
}

function getDriverSummary(source) {
  if (!source || typeof source !== 'object') {
    return {
      assignedDriver: null,
      secondaryDriver: null,
      driverScores: createEmptyDriverScores(),
      driverGates: createEmptyDriverGates(),
      topDriverScore: 0,
      secondDriverScore: 0,
      secondaryDriverScore: null,
      primaryToSecondaryMargin: 0,
      driverFallbackType: 'standard',
      driversAreCoEqual: false,
    };
  }

  const hasResponses = source.allResponses && Object.keys(source.allResponses).length > 0;
  if (hasResponses) {
    const enriched = enrichResultsWithDriver({
      domainScores: source.domainScores || buildDomainScoresMap(source.domains || []),
      importanceRatings: source.importanceRatings || source.importanceScores || {},
      arenaScores: source.arenaScores || {},
      overall: source.overall,
      allResponses: source.allResponses || {},
      responseCodingVersion: source.responseCodingVersion || null,
    });

    return {
      assignedDriver: enriched.assignedDriver || null,
      secondaryDriver: enriched.secondaryDriver || null,
      driverScores: enriched.driverScores || createEmptyDriverScores(),
      driverGates: enriched.driverGates || createEmptyDriverGates(),
      topDriverScore: typeof enriched.topDriverScore === 'number' ? enriched.topDriverScore : 0,
      secondDriverScore: typeof enriched.secondDriverScore === 'number' ? enriched.secondDriverScore : 0,
      secondaryDriverScore: typeof enriched.secondaryDriverScore === 'number' ? enriched.secondaryDriverScore : null,
      primaryToSecondaryMargin: typeof enriched.primaryToSecondaryMargin === 'number' ? enriched.primaryToSecondaryMargin : 0,
      driverState: enriched.driverState || getDriverState(
        enriched.assignedDriver || null,
        enriched.driverFallbackType || null
      ),
      driverFallbackType: enriched.driverFallbackType || getDriverFallbackType(
        enriched.domainScores || source.domainScores || buildDomainScoresMap(source.domains || []),
        enriched.overall ?? source.overall,
        enriched.assignedDriver || null
      ),
      driversAreCoEqual: !!enriched.driversAreCoEqual,
    };
  }

  if (
    typeof source.topDriverScore === 'number' &&
    typeof source.secondDriverScore === 'number' &&
    typeof source.primaryToSecondaryMargin === 'number' &&
    source.driverScores &&
    typeof source.driverScores === 'object' &&
    source.driverGates &&
    typeof source.driverGates === 'object' &&
    'assignedDriver' in source &&
    'secondaryDriver' in source &&
    'secondaryDriverScore' in source
  ) {
    const cachedPrimary =
      typeof source.assignedDriver === 'string' ? source.assignedDriver : null;
    const cachedSecondary =
      typeof source.secondaryDriver === 'string' ? source.secondaryDriver : null;
    const cachedCoEqual =
      typeof source.driversAreCoEqual === 'boolean'
        ? source.driversAreCoEqual
        : !!(
            cachedPrimary &&
            cachedPrimary !== ALIGNED_MOMENTUM_NAME &&
            cachedSecondary &&
            typeof source.topDriverScore === 'number' &&
            source.topDriverScore >= 6 &&
            typeof source.secondDriverScore === 'number' &&
            source.secondDriverScore >= 6 &&
            typeof source.primaryToSecondaryMargin === 'number' &&
            source.primaryToSecondaryMargin < 2
          );
    return {
      assignedDriver: cachedPrimary,
      secondaryDriver: cachedSecondary,
      driverScores: source.driverScores,
      driverGates: source.driverGates,
      topDriverScore: source.topDriverScore,
      secondDriverScore: source.secondDriverScore,
      secondaryDriverScore: typeof source.secondaryDriverScore === 'number' ? source.secondaryDriverScore : null,
      primaryToSecondaryMargin: source.primaryToSecondaryMargin,
      driverState: typeof source.driverState === 'string'
        ? source.driverState
        : getDriverState(
            typeof source.assignedDriver === 'string' ? source.assignedDriver : null,
            typeof source.driverFallbackType === 'string' ? source.driverFallbackType : null
          ),
      driverFallbackType: getDriverFallbackType(
        source.domainScores || buildDomainScoresMap(source.domains || []),
        source.overall,
        typeof source.assignedDriver === 'string' ? source.assignedDriver : null
      ),
      driversAreCoEqual: cachedCoEqual,
    };
  }
  if (!hasResponses) {
    return {
      assignedDriver: null,
      secondaryDriver: null,
      driverScores: createEmptyDriverScores(),
      driverGates: createEmptyDriverGates(),
      topDriverScore: 0,
      secondDriverScore: 0,
      secondaryDriverScore: null,
      primaryToSecondaryMargin: 0,
      driverState: getDriverState(
        null,
        getDriverFallbackType(
          source.domainScores || buildDomainScoresMap(source.domains || []),
          source.overall,
          null
        )
      ),
      driverFallbackType: getDriverFallbackType(
        source.domainScores || buildDomainScoresMap(source.domains || []),
        source.overall,
        null
      ),
      driversAreCoEqual: false,
    };
  }
}

function sortDriverScores(driverScores, driverGates) {
  return DRIVER_TIEBREAK_PRIORITY.map((name, index) => ({
    name,
    score: typeof driverScores?.[name] === 'number' ? driverScores[name] : 0,
    gatePassed: !!driverGates?.[name],
    index,
  })).sort((a, b) => (b.score - a.score) || (a.index - b.index));
}

function buildUserEmail({
  firstName,
  overall,
  overallTier,
  arenaScores,
  arenaTiers,
  topCriticalPriority,
  hasPortalAccount,
  archetype,
  archetypeTagline,
  laggingArenaSummary,
  driverName,
  driverCoreBelief,
  secondaryDriverName,
  secondaryDriverCoreBelief,
  driverState,
  driverFallbackType,
}) {
  const name = firstName ? `Hi ${escHtml(firstName)},` : 'Hi there,';
  const portalLink = `${PORTAL_URL}/login`;
  const signupLink = `${PORTAL_URL}/signup`;
  const ctaUrl     = hasPortalAccount ? portalLink : signupLink;
  const ctaLabel   = hasPortalAccount ? 'View My Full Results' : 'Create My Free Account';
  const loginCtaLabel = hasPortalAccount ? 'Log Into My Account' : 'Create My Free Account';

  const arenasHtml = ['Personal','Relationships','Business'].map(a => {
    const sc = arenaScores[a] ?? '?';
    const ti = arenaTiers[a]  ?? '';
    const c  = getTierColor(ti);
    return `<tr>
      <td style="padding:6px 12px;font-weight:600;color:#3A4A5C;">${escHtml(a)}</td>
      <td style="padding:6px 12px;font-weight:700;color:${c};">${escHtml(String(sc))} / 10</td>
      <td style="padding:6px 12px;color:${c};font-size:13px;">${escHtml(ti)}</td>
    </tr>`;
  }).join('');

  const overallColor = getTierColor(overallTier);
  const isScatteredMindPrimary =
    driverState === 'dysfunction_driver' && driverName === SCATTERED_MIND_NAME;
  const driverSummaryHtml = driverState === 'aligned_momentum'
    ? `<p style="margin:0 0 4px;color:#0E1624;font-size:18px;font-weight:700;">${ALIGNED_MOMENTUM_NAME}</p><p style="margin:0;color:#3A4A5C;font-size:15px;font-style:italic;">${escHtml(ALIGNED_MOMENTUM_TAGLINE)}</p>`
    : isScatteredMindPrimary
      ? `<p style="margin:0 0 4px;color:#0E1624;font-size:18px;font-weight:700;">${SCATTERED_MIND_NAME}</p><p style="margin:0;color:#3A4A5C;font-size:15px;font-style:italic;">${escHtml(SCATTERED_MIND_TAGLINE)}</p><p style="margin:8px 0 0;color:#3A4A5C;font-size:15px;line-height:1.6;"><strong>The core belief:</strong> '${escHtml(driverCoreBelief)}'</p>${secondaryDriverName ? `<p style="margin:8px 0 0;color:#0E1624;font-size:15px;line-height:1.6;"><strong>Secondary:</strong> ${escHtml(secondaryDriverName)} <span style="color:#3A4A5C;">- <em>'${escHtml(secondaryDriverCoreBelief)}'</em></span></p>` : ''}`
      : driverName && secondaryDriverName
        ? `<p style="margin:0 0 6px;color:#0E1624;font-size:15px;line-height:1.6;"><strong>Primary: ${escHtml(driverName)}</strong> <span style="color:#3A4A5C;">- <em>'${escHtml(driverCoreBelief)}'</em></span></p><p style="margin:0;color:#0E1624;font-size:15px;line-height:1.6;"><strong>Secondary: ${escHtml(secondaryDriverName)}</strong> <span style="color:#3A4A5C;">- <em>'${escHtml(secondaryDriverCoreBelief)}'</em></span></p>`
        : driverName
          ? `<p style="margin:0 0 4px;color:#0E1624;font-size:18px;font-weight:700;">${escHtml(driverName)}</p><p style="margin:0;color:#3A4A5C;font-size:15px;font-style:italic;">'${escHtml(driverCoreBelief)}'</p>`
          : driverFallbackType === 'aligned_momentum'
            ? `<p style="margin:0;color:#3A4A5C;font-size:15px;line-height:1.6;"><strong>${ALIGNED_MOMENTUM_NAME}</strong> ${escHtml(ALIGNED_MOMENTUM_TAGLINE)}</p>`
            : `<p style="margin:0;color:#3A4A5C;font-size:15px;line-height:1.6;"><strong>No clear single driver identified.</strong> Explore the Driver Library for deeper self-reflection, or discuss with your coach.</p>`;
  const driverSummaryText = driverState === 'aligned_momentum'
    ? `What's Fueling This Pattern: ${ALIGNED_MOMENTUM_NAME}\n${ALIGNED_MOMENTUM_TAGLINE}\n`
    : isScatteredMindPrimary
      ? `What's Driving This Pattern: ${SCATTERED_MIND_NAME}\n${SCATTERED_MIND_TAGLINE}\n\nThe core belief: '${driverCoreBelief}'\n${secondaryDriverName ? `Secondary: ${secondaryDriverName} - '${secondaryDriverCoreBelief}'\n` : ''}`
      : driverName && secondaryDriverName
        ? `What's Driving This Pattern\nPrimary: ${driverName} - '${driverCoreBelief}'\nSecondary: ${secondaryDriverName} - '${secondaryDriverCoreBelief}'\n`
        : driverName
          ? `What's Driving This Pattern: ${driverName}\n'${driverCoreBelief}'\n`
          : driverFallbackType === 'aligned_momentum'
            ? `What's Fueling This Pattern: ${ALIGNED_MOMENTUM_NAME}\n${ALIGNED_MOMENTUM_TAGLINE}\n`
            : `What's Driving This Pattern: No clear single driver identified.\nExplore the Driver Library for deeper self-reflection, or discuss with your coach.\n`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your VAPI Assessment Results</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDE3ED;">

  <!-- Header -->
  <tr><td style="background:#FAF9F7;padding:32px 40px;text-align:center;border-bottom:1px solid #E8E6E3;">
    <a href="${PORTAL_URL}/assessment"><img src="https://portal.alignedpower.coach/images/vapi-logo.png" alt="Values-Aligned Performance Indicator" width="180" height="auto" style="display:block;max-width:180px;height:auto;margin:0 auto;" /></a>
  </td></tr>

  <!-- Body -->
  <tr><td style="padding:40px 40px 32px;">
    <p style="margin:0 0 20px;color:#3A4A5C;font-size:16px;line-height:1.6;">${name}</p>
    <p style="margin:0 0 20px;color:#3A4A5C;font-size:16px;line-height:1.6;">Congratulations on completing the VAPI Assessment.</p>
    <p style="margin:0 0 32px;color:#3A4A5C;font-size:16px;line-height:1.6;">Taking an honest look at where you actually stand takes courage. Most people avoid it. You just did it.</p>

    <h2 style="margin:0 0 12px;color:#0E1624;font-size:18px;font-weight:700;">Your snapshot</h2>

    <!-- Overall score -->
    <div style="background:#F5F7FA;border-radius:8px;padding:20px 24px;margin-bottom:20px;border:1px solid #DDE3ED;">
      <p style="margin:0 0 4px;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">VAPI Composite Score</p>
      <p style="margin:0;font-size:36px;font-weight:700;color:${overallColor};">${escHtml(String(overall ?? '?'))} <span style="font-size:20px;font-weight:400;color:#3A4A5C;">/ 10</span> &nbsp;<span style="font-size:18px;">${escHtml(overallTier ?? '')}</span></p>
    </div>
    ${archetype ? `<div style="background:#F5F7FA;border-radius:8px;padding:16px 20px;margin-bottom:24px;border:1px solid #DDE3ED;">
      <p style="margin:0 0 4px;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Your Founder Archetype</p>
      <p style="margin:0;color:#0E1624;font-size:18px;font-weight:700;">${escHtml(archetype)}</p>
      ${archetypeTagline ? `<p style="margin:6px 0 0;color:#3A4A5C;font-size:15px;font-style:italic;">${escHtml(archetypeTagline)}</p>` : ''}
      ${laggingArenaSummary ? `<p style="margin:8px 0 0;color:#3A4A5C;font-size:14px;line-height:1.6;"><strong>Your lagging arena:</strong> ${escHtml(laggingArenaSummary.label)} (${escHtml(laggingArenaSummary.score.toFixed(1))})</p>` : ''}
    </div>` : ''}
    <div style="background:#F5F7FA;border-radius:8px;padding:16px 20px;margin-bottom:24px;border:1px solid #DDE3ED;">
      <p style="margin:0 0 4px;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">${driverState === 'aligned_momentum' ? "What's Fueling This Pattern" : "What's Driving This Pattern"}</p>
      ${driverSummaryHtml}
    </div>

    <!-- Arena scores -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      ${arenasHtml}
    </table>

    ${topCriticalPriority ? `<div style="background:#FFF3EE;border-left:4px solid #F97316;border-radius:4px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0 0 4px;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Your #1 Critical Priority</p>
      <p style="margin:0;color:#3A4A5C;font-size:16px;font-weight:600;">${escHtml(topCriticalPriority)}</p>
    </div>` : ''}

    <p style="margin:0 0 28px;color:#3A4A5C;font-size:15px;line-height:1.6;">Your full results, including all 12 domain scores, detailed interpretations, and your personalized priority matrix, are waiting for you in the portal.</p>

    <div style="text-align:center;margin-bottom:32px;">
      <a href="${ctaUrl}" style="display:inline-block;background:#FF6B1A;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">View My Full Results &#8594;</a>
    </div>

    <hr style="border:none;border-top:1px solid #DDE3ED;margin:0 0 28px;">

    <h2 style="margin:0 0 12px;color:#0E1624;font-size:18px;font-weight:700;">When you create your free portal account, you can:</h2>
    <ul style="margin:0 0 28px;padding:0 0 0 20px;color:#3A4A5C;font-size:15px;line-height:1.8;">
      <li>View your complete results with in-depth interpretations for every domain</li>
      <li>Download and print your results as a PDF</li>
      <li>Track your progress over time by retaking the assessment</li>
      <li>See exactly what changed and what to focus on next</li>
    </ul>

    <p style="margin:0 0 20px;color:#3A4A5C;font-size:15px;line-height:1.6;">This is not a one-time snapshot. The VAPI Assessment is designed to measure your growth. Come back in 30, 60, or 90 days and see how far you have moved.</p>

    <div style="text-align:center;margin-bottom:8px;">
      <a href="${ctaUrl}" style="display:inline-block;background:#0E1624;color:#FFFFFF;font-size:15px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;">${escHtml(loginCtaLabel)} &#8594;</a>
    </div>
  </td></tr>

  <!-- Footer -->
  <tr><td style="background:#F5F7FA;padding:24px 40px;text-align:center;border-top:1px solid #DDE3ED;">
    <p style="margin:0 0 8px;color:#7A8FA8;font-size:13px;">Jake Sebok</p>
    <p style="margin:0;color:#7A8FA8;font-size:12px;">You received this because you completed the VAPI Assessment. <a href="${PORTAL_URL}" style="color:#FF6B1A;">Unsubscribe</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `${name}

Congratulations on completing the VAPI Assessment.

Your VAPI Composite Score: ${overall ?? '?'} / 10 - ${overallTier ?? ''}

${archetype ? `Your Founder Archetype: ${archetype}\n${archetypeTagline ? `'${archetypeTagline}'\n` : ''}${laggingArenaSummary ? `Your lagging arena: ${laggingArenaSummary.label} (${laggingArenaSummary.score.toFixed(1)})\n` : ''}` : ''}
${driverSummaryText}

Self: ${arenaScores.Personal ?? '?'} / 10 - ${arenaTiers.Personal ?? ''}
Relationships: ${arenaScores.Relationships ?? '?'} / 10 - ${arenaTiers.Relationships ?? ''}
Business: ${arenaScores.Business ?? '?'} / 10 - ${arenaTiers.Business ?? ''}
${topCriticalPriority ? `\nYour #1 Critical Priority: ${topCriticalPriority}\n` : ''}
View your full results: ${ctaUrl}

-- Jake Sebok`;

  return { html, text };
}

function buildAdminEmail({
  email,
  firstName,
  lastName,
  overall,
  overallTier,
  arenaScores,
  arenaTiers,
  domains,
  importanceRatings,
  priorityMatrix,
  contextualProfile,
  assessmentNumber,
  hasPortalAccount,
  timestamp,
  archetype,
  laggingArenaSummary,
  driverName,
  secondaryDriverName,
  topDriverScore,
  secondaryDriverScore,
  primaryToSecondaryMargin,
  driverScores,
  driverGates,
  previousArchetypeName,
  previousDriverName,
  previousSecondaryDriverName,
  driverState,
  previousDriverState,
  driverFallbackType,
}) {
  const userName = [firstName, lastName].filter(Boolean).join(' ') || email || 'Anonymous';
  const ordinalNum = ordinal(assessmentNumber || 1);
  const accountStatus = hasPortalAccount ? 'Has portal account' : 'No account yet';
  const sortedDriverScores = sortDriverScores(driverScores, driverGates);
  const driverScoresText = sortedDriverScores
    .map((entry) => `${entry.name}: ${entry.score} points [GATE: ${entry.gatePassed ? 'passed' : 'failed'}]`)
    .join(', ');
  const primaryDriverSummary =
    driverState === 'dysfunction_driver' && driverName
      ? `${driverName} (${topDriverScore} points)`
      : 'None (threshold not met)';
  const secondaryDriverSummary = secondaryDriverName && typeof secondaryDriverScore === 'number'
    ? `${secondaryDriverName} (${secondaryDriverScore} points)`
    : 'None';
  const previousPrimaryLabel =
    previousDriverState === 'aligned_momentum'
      ? ALIGNED_MOMENTUM_NAME
      : previousDriverName || 'None';
  const currentPrimaryLabel =
    driverState === 'aligned_momentum'
      ? ALIGNED_MOMENTUM_NAME
      : driverName || 'None';
  const previousPrimarySummary = `${previousPrimaryLabel} (${previousPrimaryLabel === currentPrimaryLabel ? 'unchanged' : 'changed'})`;
  const previousSecondarySummary = `${previousSecondaryDriverName || 'None'} (${previousSecondaryDriverName === secondaryDriverName ? 'unchanged' : 'changed'})`;
  const fallbackTypeSummary =
    driverState === 'dysfunction_driver' ? 'N/A (driver was assigned)' : driverFallbackType === 'aligned_momentum' ? 'Aligned Momentum' : 'Standard';
  const driverStateSummary =
    driverState === 'aligned_momentum'
      ? 'Aligned Momentum (no dysfunction driver detected, high performer criteria met)'
      : driverState === 'dysfunction_driver'
        ? 'Dysfunction Driver'
        : 'No Driver';
  const scatteredMindDiagnostics =
    driverState === 'dysfunction_driver' && driverName === SCATTERED_MIND_NAME
      ? getScatteredMindDiagnostics(domains, importanceRatings || {})
      : null;

  const sortedDomains = [...(domains || [])].sort((a,b) => a.score - b.score);
  const domainRows = sortedDomains.map(d => {
    const c = getTierColor(d.tier);
    return `<tr>
      <td style="padding:5px 12px;color:#3A4A5C;">${escHtml(d.domain)}</td>
      <td style="padding:5px 12px;font-weight:700;color:${c};">${escHtml(String(d.score))} / 10</td>
      <td style="padding:5px 12px;color:${c};font-size:13px;">${escHtml(d.tier)}</td>
    </tr>`;
  }).join('');

  const criticalList = (priorityMatrix?.criticalPriority || []).map(d => escHtml(d.domain + ' (' + d.score + '/10)')).join(', ') || 'None';

  const cp = contextualProfile || {};
  const profileRows = [
    ['Revenue Stage', cp.revenueStage],
    ['Team Size', cp.teamSize],
    ['Life Stage', cp.lifeStage],
    ['Time in Business', cp.timeInBusiness],
    ['Primary Challenge', cp.primaryChallenge],
  ].map(([label, val]) => `<tr><td style="padding:5px 12px;color:#7A8FA8;font-size:13px;">${escHtml(label)}</td><td style="padding:5px 12px;color:#3A4A5C;font-size:13px;">${escHtml(val || 'Not provided')}</td></tr>`).join('');

  const overallColor = getTierColor(overallTier);

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>New VAPI Assessment Completed</title></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:24px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:12px;overflow:hidden;border:1px solid #DDE3ED;">
  <tr><td style="background:#FAF9F7;padding:24px 32px;text-align:center;border-bottom:1px solid #E8E6E3;">
    <a href="${PORTAL_URL}/assessment"><img src="https://portal.alignedpower.coach/images/vapi-logo.png" alt="Values-Aligned Performance Indicator" width="140" height="auto" style="display:block;max-width:140px;height:auto;margin:0 auto;" /></a>
  </td></tr>
  <tr><td style="padding:32px 32px 24px;">

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Assessment Details</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Date:</strong> ${escHtml(timestamp || new Date().toISOString())}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>User:</strong> ${escHtml(userName)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Email:</strong> ${escHtml(email || 'Not provided')}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Account Status:</strong> ${escHtml(accountStatus)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Assessment #:</strong> ${escHtml(ordinalNum)} assessment</td></tr>
      ${archetype ? `<tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Founder Archetype:</strong> ${escHtml(archetype)}</td></tr>` : ''}
      ${laggingArenaSummary ? `<tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Lagging Arena:</strong> ${escHtml(laggingArenaSummary.label)} (${escHtml(laggingArenaSummary.score.toFixed(1))})</td></tr>` : ''}
      ${previousArchetypeName ? `<tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Previous Archetype:</strong> ${escHtml(previousArchetypeName)} (${previousArchetypeName === archetype ? 'unchanged' : 'changed'})</td></tr>` : ''}
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Primary Driver:</strong> ${escHtml(primaryDriverSummary)}</td></tr>
      ${scatteredMindDiagnostics ? `<tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Gate Status:</strong> ${escHtml(scatteredMindDiagnostics.gateSummary)}</td></tr><tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Signals Fired:</strong> ${escHtml(scatteredMindDiagnostics.signalsSummary)}</td></tr>` : ''}
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Secondary Driver:</strong> ${escHtml(secondaryDriverSummary)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Driver State:</strong> ${escHtml(driverStateSummary)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Primary-Secondary Margin:</strong> ${escHtml(String(primaryToSecondaryMargin))} points</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Driver Scores:</strong> ${escHtml(driverScoresText)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Fallback Type:</strong> ${escHtml(fallbackTypeSummary)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Previous Primary Driver:</strong> ${escHtml(previousPrimarySummary)}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Previous Secondary Driver:</strong> ${escHtml(previousSecondarySummary)}</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Composite Score</td></tr>
      <tr><td style="padding:10px 12px;font-size:28px;font-weight:700;color:${overallColor};">${escHtml(String(overall ?? '?'))} <span style="font-size:16px;color:#3A4A5C;font-weight:400;">/ 10 &mdash; ${escHtml(overallTier ?? '')}</span></td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Self:</strong> ${escHtml(String(arenaScores?.Personal ?? '?'))} &mdash; ${escHtml(arenaTiers?.Personal ?? '')}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Relationships:</strong> ${escHtml(String(arenaScores?.Relationships ?? '?'))} &mdash; ${escHtml(arenaTiers?.Relationships ?? '')}</td></tr>
      <tr><td style="padding:5px 12px;color:#3A4A5C;"><strong>Business:</strong> ${escHtml(String(arenaScores?.Business ?? '?'))} &mdash; ${escHtml(arenaTiers?.Business ?? '')}</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td colspan="3" style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Domain Scores (Lowest to Highest)</td></tr>
      ${domainRows}
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Critical Priorities</td></tr>
      <tr><td style="padding:8px 12px;color:#3A4A5C;">${criticalList}</td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #DDE3ED;border-radius:8px;overflow:hidden;">
      <tr><td colspan="2" style="padding:8px 12px;background:#F5F7FA;color:#7A8FA8;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;">Contextual Profile</td></tr>
      ${profileRows}
    </table>

  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = `New VAPI Assessment Completed

Date: ${timestamp || new Date().toISOString()}
User: ${userName}
Email: ${email || 'Not provided'}
Account Status: ${accountStatus}
Assessment #: ${ordinalNum} assessment
${archetype ? `Founder Archetype: ${archetype}\n` : ''}
${laggingArenaSummary ? `Lagging Arena: ${laggingArenaSummary.label} (${laggingArenaSummary.score.toFixed(1)})\n` : ''}${previousArchetypeName ? `Previous Archetype: ${previousArchetypeName} (${previousArchetypeName === archetype ? 'unchanged' : 'changed'})\n` : ''}
Primary Driver: ${primaryDriverSummary}
${scatteredMindDiagnostics ? `Gate Status: ${scatteredMindDiagnostics.gateSummary}\nSignals Fired: ${scatteredMindDiagnostics.signalsSummary}\n` : ''}Secondary Driver: ${secondaryDriverSummary}
Secondary Driver: ${secondaryDriverSummary}
Primary-Secondary Margin: ${primaryToSecondaryMargin} points
Driver Scores: ${driverScoresText}
Driver State: ${driverStateSummary}
Fallback Type: ${fallbackTypeSummary}
Previous Primary Driver: ${previousPrimarySummary}
Previous Secondary Driver: ${previousSecondarySummary}

Composite Score: ${overall ?? '?'} / 10 - ${overallTier ?? ''}
Self: ${arenaScores?.Personal ?? '?'} - ${arenaTiers?.Personal ?? ''}
Relationships: ${arenaScores?.Relationships ?? '?'} - ${arenaTiers?.Relationships ?? ''}
Business: ${arenaScores?.Business ?? '?'} - ${arenaTiers?.Business ?? ''}

Domain Scores (Lowest to Highest):
${sortedDomains.map(d => `${d.domain}: ${d.score} / 10 - ${d.tier}`).join('\n')}

Critical Priorities: ${criticalList}

Contextual Profile:
Revenue Stage: ${cp.revenueStage || 'Not provided'}
Team Size: ${cp.teamSize || 'Not provided'}
Life Stage: ${cp.lifeStage || 'Not provided'}
Time in Business: ${cp.timeInBusiness || 'Not provided'}
Primary Challenge: ${cp.primaryChallenge || 'Not provided'}`;

  return { html, text };
}

async function lookupUserByEmail(supabaseUrl, serviceRoleKey, email) {
  // Returns { hasAccount, assessmentNumber, contextualProfile, firstName, lastName }
  const result = {
    hasAccount: false,
    assessmentNumber: 1,
    contextualProfile: null,
    firstName: null,
    lastName: null,
    previousAssessment: null,
  };
  if (!email || !supabaseUrl || !serviceRoleKey) return result;

  const emailNorm = email.trim().toLowerCase();

  // 1. Check auth.users for a portal account and pull user_metadata
  try {
    const usersRes = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?filter=${encodeURIComponent(emailNorm)}`,
      { headers: { 'apikey': serviceRoleKey, 'Authorization': `Bearer ${serviceRoleKey}` } }
    );
    if (usersRes.ok) {
      const usersJson = await usersRes.json();
      const users = usersJson.users || [];
      const match = users.find(u => (u.email || '').toLowerCase() === emailNorm);
      if (match) {
        result.hasAccount = true;
        const meta = match.user_metadata || {};
        result.contextualProfile = meta.contextual_profile || null;
        if (!result.firstName && meta.first_name) result.firstName = meta.first_name;
        if (!result.lastName  && meta.last_name)  result.lastName  = meta.last_name;
      }
    }
  } catch (e) {}

  // 2. Count prior assessments for this email
  try {
    const countRes = await fetch(
      `${supabaseUrl}/rest/v1/vapi_results?email=eq.${encodeURIComponent(emailNorm)}&select=id`,
      {
        headers: {
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`,
          'Prefer': 'count=exact',
          'Range': '0-0',
        },
      }
    );
    const contentRange = countRes.headers.get('content-range') || '';
    const match = contentRange.match(/\/(\d+)$/);
    result.assessmentNumber = (match ? parseInt(match[1], 10) : 0) + 1;
  } catch (e) {}

  try {
    const latestRes = await fetch(
      `${supabaseUrl}/rest/v1/vapi_results?email=eq.${encodeURIComponent(emailNorm)}&select=results,created_at&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
      }
    );
    if (latestRes.ok) {
      const latestRows = await latestRes.json();
      result.previousAssessment = Array.isArray(latestRows) && latestRows.length > 0 ? latestRows[0] : null;
    }
  } catch (e) {}

  return result;
}

export async function POST(request) {
  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendKey) {
    return new Response(JSON.stringify({ error: 'missing_env', message: 'RESEND_API_KEY required' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const {
    email, firstName, lastName, overall, overallTier,
    arenaScores = {}, arenaTiers = {}, domains = [],
    importanceRatings = {}, priorityMatrix = {},
    archetype: archetypeFromBody,
    allResponses = {},
    responseCodingVersion = null,
    assignedDriver = null,
    secondaryDriver = null,
    driverScores: driverScoresFromBody = null,
    driverGates: driverGatesFromBody = null,
    topDriverScore: topDriverScoreFromBody = null,
    secondDriverScore: secondDriverScoreFromBody = null,
    secondaryDriverScore: secondaryDriverScoreFromBody = null,
    primaryToSecondaryMargin: primaryToSecondaryMarginFromBody = null,
    driverFallbackType = null,
    driverState = null,
  } = body;

  let archetype =
    determineArchetypeServer({ overall, arenaScores, domains }) ||
    archetypeFromBody ||
    null;
  archetype = archetype ? normalizeArchetypeName(archetype) : null;
  const archetypeTagline = archetype ? ARCHETYPE_TAGLINES[archetype] || null : null;
  const laggingArenaSummary =
    archetype === 'The Journeyman' ? getLaggingArenaSummary(arenaScores) : null;
  const driverEvaluation = getDriverSummary({
    domains,
    domainScores: buildDomainScoresMap(domains),
    importanceRatings,
    allResponses,
    responseCodingVersion,
    assignedDriver,
    secondaryDriver,
    driverScores: driverScoresFromBody,
    driverGates: driverGatesFromBody,
    topDriverScore: topDriverScoreFromBody,
    secondDriverScore: secondDriverScoreFromBody,
    secondaryDriverScore: secondaryDriverScoreFromBody,
    primaryToSecondaryMargin: primaryToSecondaryMarginFromBody,
    driverFallbackType,
    driverState,
    overall,
  });
  const driverStateName = driverEvaluation.driverState || 'no_driver';
  const driverName =
    driverStateName === 'dysfunction_driver' ? driverEvaluation.assignedDriver || null : null;
  const driverCoreBelief = driverName ? DRIVER_CORE_BELIEFS[driverName] : null;
  const secondaryDriverName =
    driverStateName === 'dysfunction_driver' ? driverEvaluation.secondaryDriver || null : null;
  const secondaryDriverCoreBelief = secondaryDriverName
    ? DRIVER_CORE_BELIEFS[secondaryDriverName]
    : null;

  const timestamp = new Date().toISOString();

  // Server-side lookup: account status, assessment number, contextual profile
  const lookup = await lookupUserByEmail(supabaseUrl, serviceRoleKey, email);
  const hasPortalAccount = lookup.hasAccount;
  const assessmentNumber = lookup.assessmentNumber;
  const contextualProfile = lookup.contextualProfile;
  // Use metadata name if quiz didn't capture one
  const resolvedFirstName = firstName || lookup.firstName;
  const resolvedLastName  = lastName  || lookup.lastName;
  const previousDriverEvaluation = lookup.previousAssessment
    ? getDriverSummary(lookup.previousAssessment.results || {})
    : {
        assignedDriver: null,
        secondaryDriver: null,
        driverState: 'no_driver',
        driversAreCoEqual: false,
      };
  const previousArchetypeName = lookup.previousAssessment
    ? normalizeArchetypeName(
        determineArchetypeServer(lookup.previousAssessment.results || {}) ||
          lookup.previousAssessment.results?.archetype ||
          null
      )
    : null;
  const previousDriverName = previousDriverEvaluation.assignedDriver || null;
  const previousSecondaryDriverName =
    previousDriverEvaluation.secondaryDriver || null;

  // Determine #1 Critical Priority
  const criticals = priorityMatrix.criticalPriority || [];
  let topCriticalPriority = null;
  if (criticals.length > 0) {
    const sorted = [...criticals].sort((a, b) => (b.importance || 0) - (a.importance || 0));
    topCriticalPriority = sorted[0]?.domain || null;
  } else {
    const sorted = [...domains].sort((a, b) => a.score - b.score);
    topCriticalPriority = sorted[0]?.domain || null;
  }

  const results = { ok: true, userEmailSent: false, adminEmailSent: false, errors: [] };

  // Email 1: User
  if (email) {
    const { html, text } = buildUserEmail({
      firstName: resolvedFirstName,
      overall,
      overallTier,
      arenaScores,
      arenaTiers,
      topCriticalPriority,
      hasPortalAccount,
      archetype,
      archetypeTagline,
      laggingArenaSummary,
      driverName,
      driverCoreBelief,
      secondaryDriverName,
      secondaryDriverCoreBelief,
      driverState: driverStateName,
      driverFallbackType: driverEvaluation.driverFallbackType || 'standard',
    });
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `Jake Sebok <${USER_FROM_EMAIL}>`,
          to: [email.trim().toLowerCase()],
          subject: 'Your VAPI Assessment Results Are Ready',
          html,
          text,
          reply_to: process.env.VAPI_REPLY_TO || process.env.SIX_C_REPLY_TO || undefined,
        }),
      });
      if (res.ok) {
        results.userEmailSent = true;
      } else {
        const errText = await res.text();
        results.errors.push({ type: 'user_email', status: res.status, detail: errText.slice(0, 400) });
      }
    } catch (err) {
      results.errors.push({ type: 'user_email', message: String(err.message) });
    }
  }

  // Email 2: Admin
  const { html: adminHtml, text: adminText } = buildAdminEmail({
    email, firstName: resolvedFirstName, lastName: resolvedLastName,
    overall, overallTier, arenaScores, arenaTiers, domains,
    importanceRatings, priorityMatrix, contextualProfile,
    assessmentNumber, hasPortalAccount, timestamp, archetype,
    laggingArenaSummary,
    driverName,
    secondaryDriverName,
    topDriverScore: driverEvaluation.topDriverScore || 0,
    secondaryDriverScore: driverEvaluation.secondaryDriverScore ?? null,
    primaryToSecondaryMargin: driverEvaluation.primaryToSecondaryMargin || 0,
    driverScores: driverEvaluation.driverScores || createEmptyDriverScores(),
    driverGates: driverEvaluation.driverGates || createEmptyDriverGates(),
    previousArchetypeName,
    previousDriverName,
    previousSecondaryDriverName,
    driverState: driverStateName,
    previousDriverState: previousDriverEvaluation.driverState || 'no_driver',
    driverFallbackType: driverEvaluation.driverFallbackType || 'standard',
  });
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: `VAPI Assessments <${ADMIN_FROM_EMAIL}>`,
          to: [ADMIN_EMAIL],
          subject: 'New VAPI Assessment Completed',
          html: adminHtml,
          text: adminText,
        }),
    });
    if (res.ok) {
      results.adminEmailSent = true;
    } else {
      const errText = await res.text();
      results.errors.push({ type: 'admin_email', status: res.status, detail: errText.slice(0, 400) });
    }
  } catch (err) {
    results.errors.push({ type: 'admin_email', message: String(err.message) });
  }

  return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
