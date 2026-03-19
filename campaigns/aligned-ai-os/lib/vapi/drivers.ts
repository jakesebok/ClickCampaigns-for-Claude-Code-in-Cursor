import { DOMAINS } from "./quiz-data";

export type VapiDriverName =
  | "The Achiever's Trap"
  | "The Escape Artist"
  | "The Pleaser's Bind"
  | "The Imposter Loop"
  | "The Perfectionist's Prison"
  | "The Protector"
  | "The Martyr Complex"
  | "The Fog";

export type VapiDriverScores = Record<VapiDriverName, number>;
export type VapiDriverGates = Record<VapiDriverName, boolean>;

export type VapiDriverContent = {
  name: VapiDriverName;
  coreBelief: string;
  coreFear: string;
  tagline: string;
  description: string;
  mechanism: string;
  whatItCosts: string;
  theWayOut: string;
  programPhase: string;
  maxPossible: number;
};

export type VapiDriverEvaluation = {
  assignedDriver: VapiDriverName | null;
  driverScores: VapiDriverScores;
  driverGates: VapiDriverGates;
  topDriverScore: number;
  secondDriverScore: number;
};

export const DRIVER_THRESHOLD = 6;
export const DRIVER_MIN_MARGIN = 2;

export const DRIVER_TIEBREAK_PRIORITY: VapiDriverName[] = [
  "The Achiever's Trap",
  "The Escape Artist",
  "The Pleaser's Bind",
  "The Imposter Loop",
  "The Perfectionist's Prison",
  "The Protector",
  "The Martyr Complex",
  "The Fog",
];

export const DRIVER_CONTENT: Record<VapiDriverName, VapiDriverContent> = {
  "The Achiever's Trap": {
    name: "The Achiever's Trap",
    coreBelief: "I am what I produce.",
    coreFear: "Without output, I'm worthless.",
    tagline:
      "Your identity is fused with your productivity. You can't stop performing because stopping feels like disappearing.",
    description:
      "Somewhere along the way, you learned that your value comes from what you produce. Maybe it was a parent who only noticed you when you succeeded. Maybe it was a culture that rewarded grinding and punished rest. Whatever the origin, the belief took root: you are only as valuable as your last result. This drives extraordinary output but it also drives the pattern your VAPI scores reveal. Your business executes because you've made execution the condition for self-worth. Your health, emotional stability, and inner alignment suffer because they don't produce visible results, so they get deprioritized. Rest doesn't feel restful. It feels dangerous. And no achievement ever fully satisfies because the belief underneath it is insatiable.",
    mechanism:
      "This driver produces high Execution scores paired with low Physical Health, low Mental/Emotional Health, and low Inner Alignment. Your Business domains are prioritized because they're where you feel valuable. Your Self domains are neglected because they don't produce measurable output. The importance ratings confirm it: you've rated Business domains higher than Self domains because that's where your identity lives.",
    whatItCosts:
      "Your body is paying the bill for your productivity. Your emotional health is eroding underneath the performance. Your inner life has been deferred to 'someday' for so long that you may not even know what you want outside of achievement. And the cruelest part: the more you achieve, the more you need to achieve, because the hole this pattern is trying to fill can't be filled by output.",
    theWayOut:
      "The exit isn't stopping. It's decoupling your identity from your output. You need to experience being valuable while producing nothing. That sounds simple and it will be the hardest thing you do in this program. We'll identify the belief underneath the pattern, trace it to its origin, and give the part of you that's been running this program a new role. The goal isn't to kill your drive. It's to make it optional instead of compulsive.",
    programPhase:
      "Phase 3: Internal Alignment. The parts work here is central. The 'productive = worthy' belief needs to be identified, honored for what it was protecting, and reassigned.",
    maxPossible: 12,
  },
  "The Protector": {
    name: "The Protector",
    coreBelief: "If I let go of control, everything falls apart.",
    coreFear: "Vulnerability, chaos, being dependent on others.",
    tagline:
      "You've built walls so effective that nothing gets in. Including the people who could actually help.",
    description:
      "You learned early that depending on others was dangerous. Maybe people let you down. Maybe chaos was your childhood normal and control became your survival strategy. Whatever the origin, you built an operating system around self-reliance, structure, and control. Your business reflects this: your systems are strong, your execution is disciplined, and your operations are tight. But your relationships reflect the cost: you don't let people in. Your self-trust is low because you trust your systems more than yourself. Your community is thin because vulnerability feels like weakness. You've built a fortress. It's effective. And it's isolating.",
    mechanism:
      "This driver produces high Operational Health and Execution paired with low Relationship to Self and low Community. You've invested in the controllable, measurable parts of life (systems, processes, output) and underinvested in the uncontrollable, vulnerable parts (trust, connection, being known). Your importance ratings often reflect low priority on relational domains because you've convinced yourself you don't need them.",
    whatItCosts:
      "You're efficient but alone. The control that protects you also imprisons you. You can't delegate fully because trusting others feels reckless. You can't form deep friendships because being seen feels exposed. You can't trust your own instincts because you've outsourced judgment to your systems. The fortress works until it doesn't, and when it breaks, there's nobody inside it with you.",
    theWayOut:
      "The exit isn't dismantling your systems. They're valuable. It's building the capacity to function without them. We'll identify what vulnerability actually threatens in your nervous system, trace the origin of the control pattern, and create small, structured experiments in letting go. The goal isn't to make you less organized. It's to make you less dependent on organization for your sense of safety.",
    programPhase:
      "Phase 3: Internal Alignment. The core work is redefining safety as something that can include other people, not just structures.",
    maxPossible: 13,
  },
  "The Pleaser's Bind": {
    name: "The Pleaser's Bind",
    coreBelief: "My worth comes from being needed.",
    coreFear: "Rejection, abandonment, not being enough on my own.",
    tagline:
      "You pour into everyone else and wonder why there's nothing left for your own goals.",
    description:
      "You've built a life around making others comfortable. You're generous and widely liked. But underneath that generosity is a transaction: you give so you'll be needed, because being needed feels safe. Your self-trust is low because you constantly override your own needs. Your execution suffers because you can't say no to others long enough to say yes to your own work. Your strategy is unclear because other people's priorities crowd out your own.",
    mechanism:
      "Low Relationship to Self paired with relatively high Family or Community. Reverse-scored RS6 confirms the pattern: you agreed you frequently people-please or abandon your needs. Your RS importance rating is often high because you KNOW self-trust matters but can't hold it when someone else needs something.",
    whatItCosts:
      "Your boundaries are negotiable, so your time and priorities are always up for grabs. Your business underperforms because your best hours go to other people's needs. The resentment building underneath the generosity is quiet but real. The approval you're chasing would survive you saying no far more often than you think.",
    theWayOut:
      "The exit isn't becoming selfish. It's learning that your needs are not negotiable. We'll trace the 'needed = loved' belief to its origin, identify where the pleasing pattern is strongest, and build a practice of holding boundaries even when guilt shows up. The goal is to include yourself in the list of people you care about.",
    programPhase:
      "Phase 3: Internal Alignment into Phase 4: Aligned Action. Belief work first, then boundaries and decision rules installed into the PAOS.",
    maxPossible: 12,
  },
  "The Escape Artist": {
    name: "The Escape Artist",
    coreBelief: "If I stay busy enough, I won't have to feel this.",
    coreFear:
      "Facing the emotional pain, relational tension, or void underneath the activity.",
    tagline: "Your business isn't just your business. It's your hiding place.",
    description:
      "You execute and produce. From the outside it looks like ambition. From the inside you know the truth: work is a shield. When you stop, the feelings catch up. The tension in your marriage. The emptiness underneath the success. The grief or anger you never processed. So you don't stop. The VAPI captures it: execution is strong because staying busy is survival. Emotional health, inner alignment, and family are low because those are exactly the areas you're running from.",
    mechanism:
      "High Execution paired with low Mental/Emotional Health, low Family, and low Inner Alignment. Reverse-scored items confirm: agreeing with emotional absence around family and running on empty emotionally. Importance ratings are the tell: you've rated the domains you're avoiding as low priority, which is rationalization layered on top of avoidance.",
    whatItCosts:
      "You're productive but not present. Your family feels your absence. Your emotional health is deteriorating underneath because feelings don't disappear when you outrun them. They compound. The thing you're avoiding doesn't shrink with neglect. It grows.",
    theWayOut:
      "The exit is turning around and facing what you've been running from. We'll identify what you're actually avoiding (usually one or two specific things, not the vague cloud it feels like), build emotional capacity to face it, and create space for the conversations and feelings you've been deferring. The goal isn't to stop working. It's to stop using work as anesthesia.",
    programPhase:
      "Phase 1: Awareness (extended) into Phase 3: Internal Alignment. The Escape Artist often needs a longer Phase 1 because the avoidance means they haven't fully confronted what's underneath.",
    maxPossible: 12,
  },
  "The Perfectionist's Prison": {
    name: "The Perfectionist's Prison",
    coreBelief: "If it's not perfect, it's not safe to release.",
    coreFear: "Judgment, exposure, being revealed as inadequate.",
    tagline: "You know exactly what to do. You just can't seem to do it.",
    description:
      "You have everything except the ability to act. Self-awareness is solid. Strategy might be clear. Emotional health is decent. But when it's time to execute, something locks up. Projects stay at 90%. Launches get pushed. Emails sit in drafts. It's not laziness. It's protection: if you never ship, you can never be judged. If you never fully commit, you can never fully fail. The VAPI confirms it: Execution is low while other Self domains are strong, and your Execution importance is high because you desperately want to act but the internal brake is stronger than the accelerator.",
    mechanism:
      "Low Execution paired with adequate or strong Mental/Emotional Health, Inner Alignment, and Attention/Focus. The key signal is high Execution importance: the gap isn't motivation or awareness. It's an internal block. Vision/Strategy may also be strong, confirming you have the plan but can't pull the trigger.",
    whatItCosts:
      "Your potential is stranded. You have the insight, plan, capability, and desire, all locked behind perfectionism disguised as high standards. Opportunities pass. Competitors ship. Your business stalls. The internal frustration of knowing what to do while watching yourself not do it creates a shame cycle that makes the next attempt harder.",
    theWayOut:
      "The exit is shipping imperfectly on purpose. We'll identify the fear underneath the perfectionism (usually a childhood experience of harsh judgment), reduce the threat response your nervous system attaches to imperfect output, and build a practice of releasing at 80%. The goal isn't lowering your standards. It's separating your safety from your output quality.",
    programPhase:
      "Phase 3: Internal Alignment into Phase 4: Aligned Action. Root belief work first, then structured execution rhythms that make shipping a system rather than a decision.",
    maxPossible: 12,
  },
  "The Imposter Loop": {
    name: "The Imposter Loop",
    coreBelief: "If they really knew me, they'd know I'm not enough.",
    coreFear: "Being exposed, visibility, success itself.",
    tagline: "You're building something you secretly believe you don't deserve.",
    description:
      "Part of you suspects that your success is borrowed time. That the business works despite you, not because of you. That if people saw the real picture, the doubt, the chaos, the gaps, they'd lose confidence. So you keep the mask tight. You don't build systems that would expose how fragile things are. You don't align the business with who you actually are because that would require being honest about who that is. Your Ecology score is low because at some level you know the model isn't right but admitting that feels like admitting YOU aren't right.",
    mechanism:
      "Low Ecology paired with low Relationship to Self. EC6 reverse-scored item confirms: you agreed you suspect you're building something that looks impressive but would trap you if it scaled. RS is low because imposter patterns erode self-trust. EC importance is often low because you're avoiding the alignment question entirely.",
    whatItCosts:
      "You're building on a foundation of self-doubt. Every win feels temporary. Every compliment feels unearned. You can't fully invest in scaling because part of you doesn't believe you deserve what's on the other side. The self-sabotage isn't random. It's your system protecting you from the exposure that success would bring.",
    theWayOut:
      "The exit is separating your worth from your performance and building a business you'd be proud to be seen inside of. We'll trace the imposter belief to its origin, dismantle the false narrative that you're not enough, and redesign the parts of your business that don't actually fit you so the model becomes something you trust. When the destination feels safe, the sabotage stops.",
    programPhase:
      "Phase 2: Strategic Clarity into Phase 3: Internal Alignment. Redesign what you're building first so it's genuinely yours, then address the belief that you don't deserve it.",
    maxPossible: 12,
  },
  "The Martyr Complex": {
    name: "The Martyr Complex",
    coreBelief: "I have to suffer for this to count.",
    coreFear: "Ease, receiving, being perceived as selfish.",
    tagline: "You sacrifice yourself for others and call it purpose.",
    description:
      "You give endlessly to family and causes while your own body and inner life deteriorate. Your World/Impact scores are strong. Your Family presence is genuine. But your Physical Health and Inner Alignment are suffering because somewhere you learned that your needs come last. That selflessness is the price of being good. That ease is suspicious and suffering is noble. The pattern is invisible to you because everyone around you reinforces it. They praise your generosity while you quietly fall apart.",
    mechanism:
      "Low Physical Health and low Inner Alignment paired with high World/Impact and high Family. Importance ratings confirm: you've rated contribution and family as top priorities while rating your own health and alignment as low. PH6 reverse-scored confirms: you agreed you sacrifice your body to meet demands.",
    whatItCosts:
      "You're running on a depleting resource. The generosity that defines you is being funded by your health, your joy, and your sense of self. The people you serve would be horrified to know the real cost. Your body will eventually present the bill. And the resentment you're not allowing yourself to feel is building underneath the noble surface.",
    theWayOut:
      "The exit is redefining service to include yourself. We'll identify the belief that your needs are less important than everyone else's, trace it to its origin, and build a new operating definition of generosity that doesn't require self-destruction. The goal isn't to stop giving. It's to stop bleeding.",
    programPhase:
      "Phase 3: Internal Alignment. The core belief that 'ease = selfishness' needs to be directly confronted and reassigned.",
    maxPossible: 12,
  },
  "The Fog": {
    name: "The Fog",
    coreBelief: "I don't know what I want, so I can't commit to anything.",
    coreFear: "Commitment, being wrong, missing out.",
    tagline:
      "You're not lost because you lack intelligence. You're lost because choosing feels dangerous.",
    description:
      "You're smart, capable, and stuck. Your Vision/Strategy is low because you genuinely can't seem to lock in a direction. Your Inner Alignment is low because you've disconnected from what you actually want. Your importance ratings are flat because nothing feels clearly more important than anything else. The fog feels like confusion but it's actually protection. If you never choose, you can never choose wrong. If you stay in exploration mode, you never have to face the vulnerability of commitment.",
    mechanism:
      "Low Vision/Strategy and low Inner Alignment. The key diagnostic signal is flat importance ratings: no domain rated 8 or above, and the standard deviation across all 12 ratings is below 2.0. Everything feels equally (un)important, which is the emotional signature of someone avoiding commitment. VS6 reverse-scored confirms: you agreed you spend time chasing new ideas and reacting to urgency rather than following a plan.",
    whatItCosts:
      "Years. The fog is comfortable but it's expensive. Every month without a clear direction is a month of scattered effort, wasted resources, and mounting frustration. Your capability isn't the problem. Your willingness to commit is. The longer you stay in the fog, the more your confidence erodes because you accumulate evidence that you can't follow through, when the truth is you never fully decided.",
    theWayOut:
      "The exit is deciding. Not finding the perfect answer. Deciding. We'll identify what commitment actually threatens in your system (usually a fear of being wrong, being trapped, or missing a better option), reduce the emotional charge around choosing, and build a 90-day commitment practice where you pick a direction and stay with it long enough to learn from it. Clarity comes from action, not from more thinking.",
    programPhase:
      "Phase 2: Strategic Clarity. The Fog needs the most intensive Phase 2. Building the North Star Stack, Revenue Bridge, and Domino Plan gives them a direction that's connected to their values and life rather than abstract business goals.",
    maxPossible: 13,
  },
};

export const DRIVER_FALLBACK = {
  heading: "No Clear Driver Identified",
  text: "Your score pattern doesn't map strongly to a single internal driver. This can mean one of several things: your pattern is genuinely complex and influenced by multiple drivers rather than one dominant one, you're in a transitional period where old patterns are shifting, or the behavioral data from the assessment needs to be supplemented with deeper reflection. This is not a problem. It simply means the quantitative data alone can't pinpoint the root cause with enough confidence. Your detailed domain scores, archetype, and priority matrix still provide a clear picture of where to focus. If you're working with a coach, your intake reflection and first session will surface what the numbers alone couldn't.",
};

const QUESTION_BY_ID = new Map(
  DOMAINS.flatMap((domain) =>
    domain.questions.map((question) => [question.id, question] as const)
  )
);

const ALL_DRIVER_NAMES = DRIVER_TIEBREAK_PRIORITY.slice();
const SELF_DOMAIN_CODES = ["PH", "IA", "ME", "AF"];
const RELATIONSHIPS_DOMAIN_CODES = ["RS", "FA", "CO", "WI"];
const BUSINESS_DOMAIN_CODES = ["VS", "EX", "OH", "EC"];
const ALL_DOMAIN_CODES = DOMAINS.map((domain) => domain.code);

function createEmptyDriverScores(): VapiDriverScores {
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

function createEmptyDriverGates(): VapiDriverGates {
  return {
    "The Achiever's Trap": false,
    "The Escape Artist": false,
    "The Pleaser's Bind": false,
    "The Imposter Loop": false,
    "The Perfectionist's Prison": false,
    "The Protector": false,
    "The Martyr Complex": false,
    "The Fog": false,
  };
}

function getNumericValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function countTrue(values: boolean[]) {
  return values.filter(Boolean).length;
}

function getAverageImportance(
  importanceRatings: Record<string, number>,
  domainCodes: string[]
) {
  const values = domainCodes.map((code) => getNumericValue(importanceRatings[code], 5));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getImportanceStdDev(importanceRatings: Record<string, number>) {
  const values = ALL_DOMAIN_CODES.map((code) => getNumericValue(importanceRatings[code], 5));
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function noSingleImportanceAboveOrEqualEight(importanceRatings: Record<string, number>) {
  return ALL_DOMAIN_CODES.every(
    (code) => getNumericValue(importanceRatings[code], 5) < 8
  );
}

function noSingleImportanceAboveOrEqualSeven(importanceRatings: Record<string, number>) {
  return ALL_DOMAIN_CODES.every(
    (code) => getNumericValue(importanceRatings[code], 5) < 7
  );
}

function getAverageScore(
  scores: Record<string, number>,
  domainCodes: string[]
) {
  const values = domainCodes.map((code) => getNumericValue(scores[code], 0));
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getCompositeScore(
  domainScores: Record<string, number>,
  compositeScore?: number | null
) {
  if (typeof compositeScore === "number" && Number.isFinite(compositeScore)) {
    return compositeScore;
  }

  return getAverageScore(domainScores, ALL_DOMAIN_CODES);
}

function getArenaScores(
  domainScores: Record<string, number>,
  rawArenaScores?: Record<string, number> | null
) {
  const self =
    getNumericValue(
      rawArenaScores?.personal ??
        rawArenaScores?.Personal ??
        rawArenaScores?.self ??
        rawArenaScores?.Self,
      Number.NaN
    ) || 0;
  const relationships =
    getNumericValue(
      rawArenaScores?.relationships ?? rawArenaScores?.Relationships,
      Number.NaN
    ) || 0;
  const business =
    getNumericValue(
      rawArenaScores?.business ?? rawArenaScores?.Business,
      Number.NaN
    ) || 0;

  return {
    self:
      Number.isFinite(self) && self > 0
        ? self
        : getAverageScore(domainScores, SELF_DOMAIN_CODES),
    relationships:
      Number.isFinite(relationships) && relationships > 0
        ? relationships
        : getAverageScore(domainScores, RELATIONSHIPS_DOMAIN_CODES),
    business:
      Number.isFinite(business) && business > 0
        ? business
        : getAverageScore(domainScores, BUSINESS_DOMAIN_CODES),
  };
}

function isArenaHighest(
  arenaScores: ReturnType<typeof getArenaScores>,
  key: keyof ReturnType<typeof getArenaScores>
) {
  const values = Object.values(arenaScores);
  return arenaScores[key] === Math.max(...values);
}

function isArenaLowest(
  arenaScores: ReturnType<typeof getArenaScores>,
  key: keyof ReturnType<typeof getArenaScores>
) {
  const values = Object.values(arenaScores);
  return arenaScores[key] === Math.min(...values);
}

function getResponseScore(
  responses: Record<string, number>,
  questionId: string,
  responseCodingVersion?: string | null
) {
  const question = QUESTION_BY_ID.get(questionId);
  const stored = getNumericValue(responses[questionId], 4);

  if (!question) return stored;
  if (responseCodingVersion === "scored_v1") return stored;
  return question.reverse ? 8 - stored : stored;
}

export function normalizeResponsesFromStoredMap(
  responses: Record<string, number> | null | undefined,
  responseCodingVersion?: string | null
) {
  const normalized: Record<string, number> = {};

  for (const domain of DOMAINS) {
    for (const question of domain.questions) {
      normalized[question.id] = getResponseScore(
        responses || {},
        question.id,
        responseCodingVersion
      );
    }
  }

  return normalized;
}

export function flattenGroupedAnswersToScoredResponses(
  answers: Record<string, number[]>
) {
  const normalized: Record<string, number> = {};

  for (const domain of DOMAINS) {
    const domainAnswers = answers[domain.code] || [];
    domain.questions.forEach((question, index) => {
      const raw = getNumericValue(domainAnswers[index], 4);
      normalized[question.id] = question.reverse ? 8 - raw : raw;
    });
  }

  return normalized;
}

export function determineDriver(input: {
  domainScores: Record<string, number>;
  importanceRatings: Record<string, number>;
  scoredResponses: Record<string, number>;
  arenaScores?: Record<string, number> | null;
  compositeScore?: number | null;
}): VapiDriverEvaluation {
  const {
    domainScores,
    importanceRatings,
    scoredResponses,
    arenaScores: rawArenaScores,
    compositeScore,
  } = input;
  const driverScores = createEmptyDriverScores();
  const driverGates = createEmptyDriverGates();
  const businessVsSelfImportanceDelta =
    getAverageImportance(importanceRatings, BUSINESS_DOMAIN_CODES) -
    getAverageImportance(importanceRatings, SELF_DOMAIN_CODES);
  const importanceStdDev = getImportanceStdDev(importanceRatings);
  const normalizedArenaScores = getArenaScores(domainScores, rawArenaScores);
  const normalizedCompositeScore = getCompositeScore(domainScores, compositeScore);

  const achieverLowSelfDomains = [
    getNumericValue(domainScores.PH, 0) < 5.0,
    getNumericValue(domainScores.ME, 0) < 5.0,
    getNumericValue(domainScores.IA, 0) < 5.0,
  ];
  driverGates["The Achiever's Trap"] =
    getNumericValue(domainScores.EX, 0) >= 6.0 &&
    countTrue(achieverLowSelfDomains) >= 2;
  if (driverGates["The Achiever's Trap"]) {
    if (countTrue(achieverLowSelfDomains) === 3) driverScores["The Achiever's Trap"] += 2;
    if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Achiever's Trap"] += 1;
    if (getNumericValue(importanceRatings.PH, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
    if (getNumericValue(importanceRatings.ME, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
    if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Achiever's Trap"] += 1;
    if (businessVsSelfImportanceDelta >= 2.0) driverScores["The Achiever's Trap"] += 2;
    if (getNumericValue(scoredResponses.PH6, 7) <= 3) driverScores["The Achiever's Trap"] += 2;
    if (isArenaHighest(normalizedArenaScores, "business")) driverScores["The Achiever's Trap"] += 1;
    if (isArenaLowest(normalizedArenaScores, "self")) driverScores["The Achiever's Trap"] += 1;
  }

  driverGates["The Protector"] =
    (getNumericValue(domainScores.OH, 0) >= 6.0 ||
      getNumericValue(domainScores.EX, 0) >= 6.0) &&
    (getNumericValue(domainScores.CO, 0) < 5.0 ||
      getNumericValue(domainScores.RS, 0) < 5.0);
  if (driverGates["The Protector"]) {
    if (
      getNumericValue(domainScores.OH, 0) >= 6.0 &&
      getNumericValue(domainScores.EX, 0) >= 6.0
    ) {
      driverScores["The Protector"] += 2;
    }
    if (
      getNumericValue(domainScores.CO, 0) < 5.0 &&
      getNumericValue(domainScores.RS, 0) < 5.0
    ) {
      driverScores["The Protector"] += 2;
    }
    if (getNumericValue(domainScores.FA, 0) < 5.0) driverScores["The Protector"] += 1;
    if (getNumericValue(domainScores.AF, 0) >= 6.0) driverScores["The Protector"] += 1;
    if (getNumericValue(importanceRatings.CO, 5) <= 5) driverScores["The Protector"] += 1;
    if (getNumericValue(importanceRatings.RS, 5) <= 5) driverScores["The Protector"] += 1;
    if (getNumericValue(importanceRatings.OH, 5) >= 7) driverScores["The Protector"] += 1;
    if (getNumericValue(scoredResponses.CO6, 7) <= 3) driverScores["The Protector"] += 2;
    if (isArenaLowest(normalizedArenaScores, "relationships")) driverScores["The Protector"] += 2;
  }

  driverGates["The Pleaser's Bind"] =
    getNumericValue(domainScores.RS, 0) < 5.0 &&
    getNumericValue(scoredResponses.RS6, 7) <= 3;
  if (driverGates["The Pleaser's Bind"]) {
    if (
      getNumericValue(domainScores.FA, 0) >= 6.0 ||
      getNumericValue(domainScores.CO, 0) >= 6.0
    ) {
      driverScores["The Pleaser's Bind"] += 2;
    }
    if (
      getNumericValue(domainScores.FA, 0) >= 6.0 &&
      getNumericValue(domainScores.CO, 0) >= 6.0
    ) {
      driverScores["The Pleaser's Bind"] += 1;
    }
    if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
    if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
    if (getNumericValue(importanceRatings.RS, 5) >= 7) driverScores["The Pleaser's Bind"] += 2;
    if (
      getNumericValue(importanceRatings.FA, 5) >= 7 ||
      getNumericValue(importanceRatings.CO, 5) >= 7
    ) {
      driverScores["The Pleaser's Bind"] += 1;
    }
    if (getNumericValue(domainScores.ME, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
    if (isArenaHighest(normalizedArenaScores, "relationships")) driverScores["The Pleaser's Bind"] += 2;
    if (isArenaLowest(normalizedArenaScores, "business")) driverScores["The Pleaser's Bind"] += 1;
  }

  driverGates["The Escape Artist"] =
    getNumericValue(domainScores.EX, 0) >= 5.5 &&
    getNumericValue(domainScores.IA, 0) < 5.0 &&
    (getNumericValue(domainScores.FA, 0) < 5.0 ||
      getNumericValue(domainScores.ME, 0) < 5.0);
  if (driverGates["The Escape Artist"]) {
    if (
      getNumericValue(domainScores.FA, 0) < 5.0 &&
      getNumericValue(domainScores.ME, 0) < 5.0
    ) {
      driverScores["The Escape Artist"] += 2;
    }
    if (getNumericValue(domainScores.EX, 0) >= 6.5) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(importanceRatings.ME, 5) <= 5) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(importanceRatings.FA, 5) <= 5) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(scoredResponses.FA6, 7) <= 3) driverScores["The Escape Artist"] += 2;
    if (getNumericValue(scoredResponses.ME6, 7) <= 3) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(domainScores.PH, 0) < 5.0) driverScores["The Escape Artist"] += 1;
    if (isArenaHighest(normalizedArenaScores, "business")) driverScores["The Escape Artist"] += 1;
    if (
      countTrue([
        getNumericValue(importanceRatings.ME, 5) <= 5,
        getNumericValue(importanceRatings.IA, 5) <= 5,
        getNumericValue(importanceRatings.FA, 5) <= 5,
      ]) >= 2
    ) {
      driverScores["The Escape Artist"] += 1;
    }
  }

  const perfectionistCapabilityDomains = [
    getNumericValue(domainScores.ME, 0) >= 6.0,
    getNumericValue(domainScores.IA, 0) >= 6.0,
    getNumericValue(domainScores.AF, 0) >= 6.0,
    getNumericValue(domainScores.VS, 0) >= 6.0,
  ];
  driverGates["The Perfectionist's Prison"] =
    getNumericValue(domainScores.EX, 0) < 5.0 &&
    countTrue(perfectionistCapabilityDomains) >= 2;
  if (driverGates["The Perfectionist's Prison"]) {
    if (getNumericValue(importanceRatings.EX, 5) >= 7) {
      driverScores["The Perfectionist's Prison"] += 2;
    }
    if (getNumericValue(domainScores.VS, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 2;
    if (getNumericValue(domainScores.ME, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
    if (getNumericValue(domainScores.IA, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
    if (getNumericValue(domainScores.AF, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
    if (getNumericValue(domainScores.RS, 0) >= 5.0) driverScores["The Perfectionist's Prison"] += 1;
    if (getNumericValue(scoredResponses.EX6, 7) <= 3) driverScores["The Perfectionist's Prison"] += 1;
    if (countTrue(perfectionistCapabilityDomains) >= 3) {
      driverScores["The Perfectionist's Prison"] += 2;
    }
    if (normalizedCompositeScore >= 5.5) driverScores["The Perfectionist's Prison"] += 1;
  }

  driverGates["The Imposter Loop"] =
    getNumericValue(domainScores.EC, 0) < 5.0 &&
    getNumericValue(scoredResponses.EC6, 7) <= 3;
  if (driverGates["The Imposter Loop"]) {
    if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Imposter Loop"] += 2;
    if (getNumericValue(domainScores.EX, 0) >= 5.0) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(importanceRatings.EC, 5) <= 5) driverScores["The Imposter Loop"] += 2;
    if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(scoredResponses.RS6, 7) <= 3) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(domainScores.OH, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(importanceRatings.RS, 5) >= 7) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(scoredResponses.EC5, 7) <= 4) driverScores["The Imposter Loop"] += 2;
    if (isArenaLowest(normalizedArenaScores, "business")) driverScores["The Imposter Loop"] += 1;
  }

  driverGates["The Martyr Complex"] =
    (getNumericValue(domainScores.WI, 0) >= 6.0 ||
      getNumericValue(domainScores.FA, 0) >= 6.0) &&
    (getNumericValue(domainScores.PH, 0) < 5.0 ||
      getNumericValue(domainScores.IA, 0) < 5.0);
  if (driverGates["The Martyr Complex"]) {
    if (
      getNumericValue(domainScores.WI, 0) >= 6.0 &&
      getNumericValue(domainScores.FA, 0) >= 6.0
    ) {
      driverScores["The Martyr Complex"] += 2;
    }
    if (
      getNumericValue(domainScores.PH, 0) < 5.0 &&
      getNumericValue(domainScores.IA, 0) < 5.0
    ) {
      driverScores["The Martyr Complex"] += 2;
    }
    if (getNumericValue(importanceRatings.WI, 5) >= 7) driverScores["The Martyr Complex"] += 1;
    if (getNumericValue(importanceRatings.FA, 5) >= 7) driverScores["The Martyr Complex"] += 1;
    if (getNumericValue(importanceRatings.PH, 5) <= 5) driverScores["The Martyr Complex"] += 1;
    if (getNumericValue(importanceRatings.IA, 5) <= 5) driverScores["The Martyr Complex"] += 1;
    if (getNumericValue(scoredResponses.PH6, 7) <= 3) driverScores["The Martyr Complex"] += 2;
    if (isArenaHighest(normalizedArenaScores, "relationships")) driverScores["The Martyr Complex"] += 1;
    if (isArenaLowest(normalizedArenaScores, "self")) driverScores["The Martyr Complex"] += 1;
  }

  driverGates["The Fog"] =
    getNumericValue(domainScores.VS, 0) < 5.0 &&
    noSingleImportanceAboveOrEqualEight(importanceRatings);
  if (driverGates["The Fog"]) {
    if (getNumericValue(domainScores.IA, 0) < 5.0) driverScores["The Fog"] += 2;
    if (getNumericValue(domainScores.EC, 0) < 5.0) driverScores["The Fog"] += 1;
    if (importanceStdDev < 2.0) driverScores["The Fog"] += 3;
    if (getNumericValue(scoredResponses.VS6, 7) <= 3) driverScores["The Fog"] += 2;
    if (getNumericValue(importanceRatings.VS, 5) <= 5) driverScores["The Fog"] += 1;
    if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Fog"] += 1;
    if (noSingleImportanceAboveOrEqualSeven(importanceRatings)) driverScores["The Fog"] += 2;
    if (normalizedCompositeScore >= 4.0 && normalizedCompositeScore <= 6.5) {
      driverScores["The Fog"] += 1;
    }
  }

  const rankedDrivers = ALL_DRIVER_NAMES.map((driverName, index) => ({
    driverName,
    score: driverScores[driverName],
    index,
  })).sort((a, b) => b.score - a.score || a.index - b.index);

  const winningDriver = rankedDrivers[0];
  const runnerUp = rankedDrivers[1];
  const topDriverScore = winningDriver?.score ?? 0;
  const secondDriverScore = runnerUp?.score ?? 0;
  const assignedDriver =
    winningDriver &&
    topDriverScore >= DRIVER_THRESHOLD &&
    topDriverScore - secondDriverScore >= DRIVER_MIN_MARGIN
      ? winningDriver.driverName
      : null;

  return {
    assignedDriver,
    driverScores,
    driverGates,
    topDriverScore,
    secondDriverScore,
  };
}
