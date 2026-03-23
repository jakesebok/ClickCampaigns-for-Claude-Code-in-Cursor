# Portal + VAPI + Alfred Copy Audit (Active Paths)

This document compiles currently active, user-surfaced copy for the `aligned-ai-os` app, including portal/dashboard UI copy, VAPI interpretation copy, progress/change copy, archetype/driver libraries, sprint copy, and push notification copy. It also includes coach prompt templates that users trigger directly (prefilled prompt starters).

Canonical treatment used here: copy is listed once per source and referenced where reused. Dynamic placeholders are normalized as `[placeholder]`.
## 1) VAPI Tier Logic (Who Gets What)
Users receive most interpretation copy by score tier. Tier assignment is deterministic from score thresholds: `Dialed (>=8)`, `Functional (>=6)`, `Below the Line (>=4)`, `In the Red (<4)`. Composite, arena, and domain-specific interpretations key off these tiers.

### Tier Threshold Logic (`lib/vapi/scoring.ts`)

```text
import { DOMAINS, ARENAS } from "./quiz-data";

export type VapiScores = {
  domains: Record<string, number>;
  arenas: Record<string, number>;
  overall: number;
};

export type VapiTier = "Dialed" | "Functional" | "Below the Line" | "In the Red";

export type VapiArchetype =
  | "The Architect"
  | "The Journeyman"
  | "The Phoenix"
  | "The Engine"
  | "The Drifter"
  | "The Performer"
  | "The Ghost"
  | "The Guardian"
  | "The Seeker";

export type PriorityQuadrant =
  | "Critical Priority"
  | "Protect & Sustain"
  | "Monitor"
  | "Possible Over-Investment";

export type PriorityItem = {
  domain: string;
  domainName: string;
  score: number;
  importance: number;
  quadrant: PriorityQuadrant;
};

export type VapiArenaKey = "personal" | "relationships" | "business";

export type RankedArena = {
  key: VapiArenaKey;
  label: "Personal" | "Self" | "Relationships" | "Business";
  score: number;
};

export function scoreQuestion(raw: number, reverse: boolean): number {
  return reverse ? 8 - raw : raw;
}

export function scoreDomain(answers: number[], domain: typeof DOMAINS[number]): number {
  const scored = domain.questions.map((q, i) =>
    scoreQuestion(answers[i] || 4, q.reverse)
  );
  const weightedSum = scored.reduce(
    (sum, val, i) => sum + val * domain.questions[i].weight,
    0
  );
  const raw = ((weightedSum - 6.0) / 36.0) * 10;
  return Math.round(Math.max(0, Math.min(10, raw)) * 10) / 10;
}

export function calculateScores(
  answers: Record<string, number[]>
): VapiScores {
  const domains: Record<string, number> = {};

  for (const domain of DOMAINS) {
    domains[domain.code] = scoreDomain(answers[domain.code] || [], domain);
  }

  const arenas: Record<string, number> = {};
  for (const arena of ARENAS) {
    const arenaScores = arena.domains.map((d) => domains[d] || 0);
    arenas[arena.key] =
      Math.round(
        (arenaScores.reduce((a, b) => a + b, 0) / arenaScores.length) * 10
      ) / 10;
  }

  const allScores = Object.values(domains);
  const overall =
    Math.round(
      (allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10
    ) / 10;

  return { domains, arenas, overall };
}

/** Maps legacy stored archetype names to the current canonical name. */
export function normalizeVapiArchetypeName(
  name: string | null | undefined
): string | null {
  if (name == null || name === "") return null;
  if (name === "The Rising Architect") return "The Journeyman";
  return name;
}

export function getTier(score: number): VapiTier {
  if (score >= 8) return "Dialed";
  if (score >= 6) return "Functional";
  if (score >= 4) return "Below the Line";
  return "In the Red";
}

export function getTierColor(tier: VapiTier): string {
  switch (tier) {
    case "Dialed":
      return "#22C55E";
    case "Functional":
      return "#EAB308";
    case "Below the Line":
      return "#F97316";
    case "In the Red":
      return "#EF4444";
  }
}

export function getArchetype(arenas: Record<string, number>, domains: Record<string, number>): VapiArchetype {
  const p = arenas.personal || 0;
  const r = arenas.relationships || 0;
  const b = arenas.business || 0;
  const allArenas = [p, r, b];
  const spread = Math.max(...allArenas) - Math.min(...allArenas);
  const belowCount = allArenas.filter((a) => a <= 4.5).length;
  const arenasNearArchitect = allArenas.filter((a) => a >= 7.5).length;
  const lowestArena = Math.min(...allArenas);

  if (p >= 8 && r >= 8 && b >= 8) return "The Architect";
  const overall = (p + r + b) / 3;
  if (overall >= 7.0 && arenasNearArchitect >= 2 && lowestArena >= 6.5) {
    return "The Journeyman";
  }
  if (overall <= 4.5 || belowCount >= 2) return "The Phoenix";
  if ((domains.EX || 0) >= 7 && ((domains.EC || 0) <= 5 || (domains.VS || 0) <= 5))
    return "The Engine";
  const allMid = p >= 5 && p <= 7.9 && r >= 5 && r <= 7.9 && b >= 5 && b <= 7.9;
  if (allMid && spread <= 2) return "The Drifter";
  if (b === Math.max(...allArenas) && p === Math.min(...allArenas) && spread >= 2)
    return "The Performer";
  if (b === Math.max(...allArenas) && r === Math.min(...allArenas) && spread >= 2)
    return "The Ghost";
  if (r === Math.max(...allArenas) && b === Math.min(...allArenas) && spread >= 2)
    return "The Guardian";
  if (p === Math.max(...allArenas) && b === Math.min(...allArenas) && spread >= 2)
    return "The Seeker";
  return "The Drifter";
}

export function getRankedArenas(
  arenas: Record<string, number>,
  options?: { personalLabel?: "Personal" | "Self" }
): RankedArena[] {
  const personalLabel = options?.personalLabel ?? "Personal";
  const ranked: RankedArena[] = [
    { key: "personal", label: personalLabel, score: arenas.personal || 0 },
    { key: "relationships", label: "Relationships", score: arenas.relationships || 0 },
    { key: "business", label: "Business", score: arenas.business || 0 },
  ];
  return ranked.sort((a, b) => a.score - b.score);
}

export function getPriorityMatrix(
  domainScores: Record<string, number>,
  importance: Record<string, number>
): PriorityItem[] {
  return DOMAINS.map((d) => {
    const score = domainScores[d.code] || 0;
    const imp = importance[d.code] || 5;
    let quadrant: PriorityQuadrant;

    if (imp >= 7 && score < 6) quadrant = "Critical Priority";
    else if (imp >= 7 && score >= 6) quadrant = "Protect & Sustain";
    else if (imp < 7 && score < 6) quadrant = "Monitor";
    else quadrant = "Possible Over-Investment";

    return { domain: d.code, domainName: d.name, score, importance: imp, quadrant };
  });
}

export const ARCHETYPE_DESCRIPTIONS: Record<VapiArchetype, string> = {
  "The Architect":
    "You're aligned across all three arenas. Your life, relationships, and business are working together. The work now is maintenance, refinement, and protecting what you've built.",
  "The Journeyman":
    "You're performing at a high level across all three arenas. One arena is still trailing. Closing that gap is the work that moves you from skilled to fully integrated.",
  "The Phoenix":
    "You're in a season of rebuilding. Multiple areas need attention. This isn't failure — it's the foundation for your next chapter. Start with the one area that would create the most relief.",
  "The Engine":
    "You can execute, but your direction or sustainability is off. You're powerful — the question is whether you're aimed at the right target and whether you can sustain the pace.",
  "The Drifter":
    "You're functional across the board but not thriving anywhere. Everything is 'fine.' The risk is coasting. Pick one arena to go deep on this quarter.",
  "The Performer":
    "Your business is strong but your personal foundation is cracking. You're performing at a high level — but at what cost? The body and mind are keeping score.",
  "The Ghost":
    "Business is strong but relationships are fading. You're building something impressive — but the people who matter are watching you disappear. Reconnect before the distance becomes permanent.",
  "The Guardian":
    "Relationships are strong but business is lagging. You show up beautifully for others — now it's time to show up for your vision with the same commitment.",
  "The Seeker":
    "You've done deep personal work but your business hasn't caught up. The inner alignment is there — now channel it into strategy and execution.",
};
```

## 2) Composite + Arena + Domain Interpretation Copy
The results page selects interpretation text by metric key (arena/domain) + calculated tier. Composite uses its own transition copy; domain and arena use static tier-based interpretation blocks.

### Domain + Arena Interpretations (`lib/vapi/interpretations.ts`)

```text
/**
 * VAPI domain and arena interpretation text (from portal).
 */
import type { VapiTier } from "./scoring";

export const DOMAIN_INTERPRETATIONS: Record<string, Record<VapiTier, string>> = {
  PH: {
    Dialed: "Your body is an asset, not a liability. You've built habits that hold without willpower. Sleep, nutrition, and movement are locked in. You have the energy and resilience to sustain what you're building.",
    Functional: "You're generally taking care of yourself, but there are cracks. Maybe sleep slips under stress, or nutrition goes sideways during busy weeks. You're functional, but you're leaving energy and clarity on the table.",
    "Below the Line": "Your body is starting to work against you. Inconsistent sleep, reactive eating, sporadic movement. You're borrowing energy you'll have to pay back. This isn't just a health issue; it's a performance and decision-making issue.",
    "In the Red": "This is a crisis you're normalizing. You're running on fumes, and it's affecting everything: your thinking, your patience, your capacity. No strategy, system, or mindset work will hold if your body is in revolt.",
  },
  IA: {
    Dialed: "You're living intentionally. Your days reflect your values, you make space for what nourishes you, and you're not deferring your life to 'someday.' This alignment creates a quiet confidence that compounds.",
    Functional: "You're mostly aligned, but there's drift. Some of your time is still going to things that don't match what you say matters. You probably feel it as a low-grade tension.",
    "Below the Line": "You're living more from obligation than intention. The things that fill you up keep getting pushed to the margins. You're productive, maybe even successful, but something feels hollow.",
    "In the Red": "You've lost the thread. Most of your days are dictated by other people's expectations, fear, or autopilot. You may not even be able to articulate what you actually want anymore.",
  },
  ME: {
    Dialed: "Your inner world is stable. You can weather storms without losing yourself, your self-talk supports rather than attacks you, and your pace is sustainable. This emotional steadiness is the foundation for everything else.",
    Functional: "You're generally stable, but stress still gets in more than you'd like. You can regulate, but it takes effort. You're managing, not thriving.",
    "Below the Line": "Your emotional health is fragile. You're reactive more often than you admit, your self-talk is harsh, and your pace is powered by cortisol, not clarity.",
    "In the Red": "You're running on survival mode. Overwhelm, reactivity, or emotional numbness is your baseline. Your mind feels like a battlefield, not an ally.",
  },
  AF: {
    Dialed: "You own your attention. You can go deep without needing panic to start, you catch avoidance early, and your inputs are curated. In a distraction economy, this is a superpower.",
    Functional: "You can focus when it matters, but you're still losing time to distraction, context-switching, or reactive mode. You're productive, but you know there's another gear you're not hitting.",
    "Below the Line": "Distraction is costing you real money and real progress. You're spending too much time in reactive mode: email, Slack, social media, other people's urgency.",
    "In the Red": "Your attention is not your own. The phone, the feeds, the constant context-switching. You've lost the ability to go deep without forcing it through panic or deadlines.",
  },
  RS: {
    Dialed: "You trust yourself. You keep your word to yourself, hold boundaries without guilt, and don't abandon your position to manage other people's feelings. This self-trust is the foundation of every other relationship.",
    Functional: "You have a decent relationship with yourself, but it's inconsistent. You sometimes people-please, override your needs, or break promises to yourself when the pressure mounts.",
    "Below the Line": "Self-trust is eroded. You break commitments to yourself regularly, override your instincts to keep others comfortable, and your boundaries are suggestions more than rules.",
    "In the Red": "You've abandoned yourself. You're so tuned to what everyone else needs that you've lost your own signal. You can't name what you want without checking if it's okay with someone else first.",
  },
  FA: {
    Dialed: "You're genuinely present with the people who matter most. You communicate openly, repair quickly, and your family feels your investment, not just your income.",
    Functional: "You care deeply, but your presence is inconsistent. Work bleeds in. You're physically there but sometimes mentally gone. Your family gets a version of you, but probably not your best version.",
    "Below the Line": "The people closest to you are feeling the distance. You're giving your business your best energy and your family the leftovers.",
    "In the Red": "You're losing ground with the people who matter most, and you might already know it. Emotional absence, unresolved tension, or flat-out neglect is your baseline.",
  },
  CO: {
    Dialed: "You have real belonging. You're known, not just connected. Your social world includes people who challenge you, support you, and tell you the truth. This is rare for founders.",
    Functional: "You have some good relationships, but your social world is thinner than it should be. You might be relying on a small number of people or letting friendships run on autopilot.",
    "Below the Line": "You're more isolated than you admit. Your social circle is small, transactional, or stale. Loneliness is a strategic liability.",
    "In the Red": "You're alone in this, and it's affecting more than you realize. No real friends, no real community, no one who sees the full picture.",
  },
  WI: {
    Dialed: "Your work is connected to something larger than yourself, and it shows. You contribute with integrity, consistency, and genuine alignment. This sense of purpose fuels everything else.",
    Functional: "You care about impact, but it's inconsistent. Some weeks you're connected to the bigger purpose; other weeks you're head-down in survival mode.",
    "Below the Line": "Impact has slipped to the back burner. You're focused on your own business and your own problems, and contribution feels like a luxury you can't afford right now.",
    "In the Red": "You've lost connection to why any of this matters beyond your own survival or success. Everything feels self-referential.",
  },
  VS: {
    Dialed: "You know exactly where you're going and why. Your strategy is clear, simple, and you can say 'no' without anxiety. You're not guessing, chasing, or reacting. You're choosing.",
    Functional: "You have a general sense of direction, but it's not locked in. You say 'no' sometimes, but you also get pulled by shiny objects or FOMO.",
    "Below the Line": "You're guessing. Your direction changes with your mood, the market, or whoever you talked to last. You can't explain your strategy simply because you don't have one.",
    "In the Red": "There is no strategy. You're reacting to whatever is loudest, chasing whatever seems promising, and hoping something sticks.",
  },
  EX: {
    Dialed: "You ship. Consistently. You don't need motivation, urgency, or pressure to get your highest-leverage work done each week. You have a system, a rhythm, and the discipline to follow through.",
    Functional: "You're generally productive, but inconsistent. Good weeks and bad weeks. You get the big things done eventually, but often later than planned or with more friction than necessary.",
    "Below the Line": "You're busy but not effective. You start more than you finish, your calendar doesn't match your priorities, and avoidance is winning more often than you admit.",
    "In the Red": "You're not executing. You're planning, intending, and starting, but not finishing, shipping, or following through. Weeks go by without meaningful output.",
  },
  OH: {
    Dialed: "Your business runs on systems, data, and predictability. Not you. You know your numbers, your bottleneck, and your next lever. You're building infrastructure that compounds.",
    Functional: "You have some systems, some data, some predictability, but it's patchy. You know your numbers roughly, but you'd struggle under scrutiny.",
    "Below the Line": "Your business is unpredictable and over-reliant on you. You can't forecast confidently, your systems are fragile or nonexistent, and you're probably over-capacity without admitting it.",
    "In the Red": "Your business has no operational foundation. Every month feels like starting over. You don't know your real numbers, there's no reliable pipeline, and you are the single point of failure.",
  },
  EC: {
    Dialed: "Your business is safe to grow. What you're building would make your life better in every dimension: health, relationships, freedom, pride. You're not building a profitable prison.",
    Functional: "Your business mostly aligns with what you want, but there are parts that don't sit right. Maybe the model demands more of you than you want to give.",
    "Below the Line": "There's a real tension between what you're building and what you actually want. Parts of your business feel misaligned. This misalignment is likely the hidden driver behind procrastination, resistance, or chronic overwhelm.",
    "In the Red": "You're building something you don't actually want. The model doesn't match your nervous system, the goal isn't safe to achieve, and some part of you knows it, which is why you keep sabotaging or stalling.",
  },
};

export const ARENA_INTERPRETATIONS: Record<string, Record<VapiTier, string>> = {
  personal: {
    Dialed: "Your personal foundation is rock-solid. Energy, alignment, emotional regulation, and focus are all working for you, not against you. This is the engine that makes everything else possible.",
    Functional: "Your foundation is decent but has gaps. You're generally okay, but stress, inconsistency, or neglect in one area is creating drag on the rest. Shoring up your weakest Personal domain would lift everything.",
    "Below the Line": "Your personal foundation is unstable. Health, alignment, emotional resilience, and focus should be fueling your life and business. Instead, they're working against you more than for you.",
    "In the Red": "You're running on empty. Your personal infrastructure is in crisis, and everything you're trying to build sits on top of it. No business strategy will hold until you stabilize yourself first.",
  },
  relationships: {
    Dialed: "Your relational world is strong. You trust yourself, you're present with your people, you belong to real community, and you're contributing beyond yourself. This isn't just nice to have. It's a strategic advantage.",
    Functional: "Your relationships are generally okay, but there are cracks you're tolerating. Maybe it's self-trust, maybe it's family presence, maybe it's isolation. Something is weaker than it should be.",
    "Below the Line": "Your relational world is depleted. Isolation, self-abandonment, family tension, or disconnection from purpose is taking a real toll, even if you've convinced yourself it's fine.",
    "In the Red": "You're relationally bankrupt. The people in your life, including you, aren't getting what they need. This level of disconnection is not sustainable.",
  },
  business: {
    Dialed: "Your business is clear, executing, operationally sound, and ecologically clean. You know where you're going, you're doing the work, your systems support you, and the goal is safe to pursue.",
    Functional: "Your business fundamentals are okay but not locked in. There's probably one area, whether that's clarity, execution, systems, or alignment, that's creating friction.",
    "Below the Line": "Your business is underperforming relative to your potential, and the cause is structural, not effort. Strategy is foggy, execution is inconsistent, operations are fragile, or the model itself is misaligned.",
    "In the Red": "Your business is in survival mode. No clear strategy, inconsistent execution, no systems, and possibly a model that's working against you. This isn't a growth phase. It's a crisis disguised as hustle.",
  },
};
```

## 3) Assessment Questions + Scale Labels (Source Copy Users Answer)
Every user sees this question bank during VAPI. Question text is fixed and contributes to downstream score narratives.

### Question Bank + Scale Labels (`lib/vapi/quiz-data.ts`)

```text
export type VapiQuestion = {
  id: string;
  domain: string;
  text: string;
  reverse: boolean;
  weight: number;
};

export type VapiDomain = {
  code: string;
  name: string;
  arena: "personal" | "relationships" | "business";
  questions: VapiQuestion[];
};

export const SCALE_LABELS = [
  "Strongly Agree",
  "Agree",
  "Somewhat Agree",
  "Neither Agree Nor Disagree",
  "Somewhat Disagree",
  "Disagree",
  "Strongly Disagree",
];

export const SCALE_VALUES = [7, 6, 5, 4, 3, 2, 1];

const W = [1.2, 1.2, 1.0, 1.0, 0.8, 0.8];

export const ARENAS = [
  { key: "personal", label: "Personal", domains: ["PH", "IA", "ME", "AF"] },
  { key: "relationships", label: "Relationships", domains: ["RS", "FA", "CO", "WI"] },
  { key: "business", label: "Business", domains: ["VS", "EX", "OH", "EC"] },
] as const;

export const DOMAINS: VapiDomain[] = [
  {
    code: "PH",
    name: "Physical Health",
    arena: "personal",
    questions: [
      { id: "PH1", domain: "PH", text: "I slept 7 or more hours and woke feeling genuinely rested on at least 5 out of 7 mornings each week.", reverse: false, weight: W[0] },
      { id: "PH2", domain: "PH", text: "I had steady physical energy from morning to evening without needing caffeine, sugar, or stimulants to avoid an afternoon crash.", reverse: false, weight: W[1] },
      { id: "PH3", domain: "PH", text: "I exercised, trained, or moved my body intentionally at least 3 times per week.", reverse: false, weight: W[2] },
      { id: "PH4", domain: "PH", text: "I planned and ate regular, balanced meals that supported my energy rather than skipping meals, stress-eating, or defaulting to convenience food.", reverse: false, weight: W[3] },
      { id: "PH5", domain: "PH", text: "My exercise, sleep, and nutrition routines stayed consistent for the full 30 days without needing a health scare or a burst of guilt to get back on track.", reverse: false, weight: W[4] },
      { id: "PH6", domain: "PH", text: "I regularly sacrificed sleep, skipped meals, or neglected my body to keep up with work demands.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "IA",
    name: "Inner Alignment",
    arena: "personal",
    questions: [
      { id: "IA1", domain: "IA", text: "When I looked at how I spent my time each week, the majority went toward things I genuinely chose rather than things I felt trapped into doing.", reverse: false, weight: W[0] },
      { id: "IA2", domain: "IA", text: "I scheduled and protected time each week for activities that bring me joy or meaning, such as hobbies, experiences, or personal projects.", reverse: false, weight: W[1] },
      { id: "IA3", domain: "IA", text: "Outside of work, I was genuinely present and engaged in my life rather than mentally elsewhere, distracted by business problems, or going through the motions.", reverse: false, weight: W[2] },
      { id: "IA4", domain: "IA", text: "If someone compared my calendar and bank statement from the past 30 days to my stated values, they would find an obvious and consistent match.", reverse: false, weight: W[3] },
      { id: "IA5", domain: "IA", text: "I engaged in reflection, play, creativity, or restorative experiences on a recurring weekly basis as a standing priority, not as a reward for being productive.", reverse: false, weight: W[4] },
      { id: "IA6", domain: "IA", text: "Most of my week was consumed by tasks I felt obligated to do rather than things I genuinely wanted or chose to do.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "ME",
    name: "Mental / Emotional Health",
    arena: "personal",
    questions: [
      { id: "ME1", domain: "ME", text: "When I faced a stressful situation or setback this month, I returned to a calm, clear-headed state within hours rather than days.", reverse: false, weight: W[0] },
      { id: "ME2", domain: "ME", text: "When I faced pressure from a difficult client, a conflict, or a missed goal, I paused and responded deliberately instead of reacting, avoiding, or shutting down.", reverse: false, weight: W[1] },
      { id: "ME3", domain: "ME", text: "When I made a mistake or fell short this month, I spoke to myself the way I'd speak to someone I respect rather than with shame, contempt, or harsh criticism.", reverse: false, weight: W[2] },
      { id: "ME4", domain: "ME", text: "My daily pace over the past 30 days was genuinely sustainable without relying on adrenaline, caffeine, or last-minute pressure to get through my weeks.", reverse: false, weight: W[3] },
      { id: "ME5", domain: "ME", text: "I made important decisions this month with confidence and clarity, without excessive rumination, anxiety spirals, or needing reassurance from others before acting.", reverse: false, weight: W[4] },
      { id: "ME6", domain: "ME", text: "Over the past 30 days, I frequently snapped at people, felt on the verge of tears or rage, or noticed I was running on empty emotionally.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "AF",
    name: "Attention & Focus",
    arena: "personal",
    questions: [
      { id: "AF1", domain: "AF", text: "In my work, I consistently entered deep, focused work on my most important tasks without needing a deadline or crisis to get started.", reverse: false, weight: W[0] },
      { id: "AF2", domain: "AF", text: "During focused work hours, I kept my phone silenced or out of reach, closed email and social media, and did not let other people's urgency interrupt my deep work.", reverse: false, weight: W[1] },
      { id: "AF3", domain: "AF", text: "In my work schedule, I blocked off dedicated focus time and actually kept those blocks intact at least 80% of the time.", reverse: false, weight: W[2] },
      { id: "AF4", domain: "AF", text: "During my workday, when I caught myself scrolling, doing busywork, or slipping into 'research mode,' I recognized the avoidance and redirected to the real task quickly.", reverse: false, weight: W[3] },
      { id: "AF5", domain: "AF", text: "At the end of most workdays, my time had gone toward my highest-priority tasks rather than notifications, other people's requests, or whatever felt easiest.", reverse: false, weight: W[4] },
      { id: "AF6", domain: "AF", text: "During my workdays, I lost significant time to distraction, context-switching, or low-value tasks most weeks this month.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "RS",
    name: "Relationship to Self",
    arena: "relationships",
    questions: [
      { id: "RS1", domain: "RS", text: "I kept the promises I made to myself, and when I said I'd do something, I followed through without renegotiating or making excuses.", reverse: false, weight: W[0] },
      { id: "RS2", domain: "RS", text: "In my relationships, I held my position on things that mattered to me even when others pushed back, disagreed, or expressed disappointment.", reverse: false, weight: W[1] },
      { id: "RS3", domain: "RS", text: "When a partner, friend, or colleague asked what I wanted or needed, I stated it directly without over-explaining, apologizing, or deflecting.", reverse: false, weight: W[2] },
      { id: "RS4", domain: "RS", text: "I enforced a personal boundary this month by saying no, pushing back, or protecting my time, even when it made someone uncomfortable or cost me approval.", reverse: false, weight: W[3] },
      { id: "RS5", domain: "RS", text: "When I reflected on the promises I kept to myself, the way I spoke to myself, and the standards I held this month, I felt genuine self-respect.", reverse: false, weight: W[4] },
      { id: "RS6", domain: "RS", text: "In my relationships, I frequently people-pleased, said yes when I meant no, or abandoned what I needed to avoid tension or disapproval.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "FA",
    name: "Family",
    arena: "relationships",
    questions: [
      { id: "FA1", domain: "FA", text: "With my family, I was patient, present, and emotionally available rather than irritable, rushed, or giving them whatever energy was left after work.", reverse: false, weight: W[0] },
      { id: "FA2", domain: "FA", text: "When I was with my family, I put my phone away, made eye contact, and gave them my full attention rather than just my physical presence.", reverse: false, weight: W[1] },
      { id: "FA3", domain: "FA", text: "With my family, I communicated honestly and respectfully during difficult or uncomfortable conversations rather than avoiding, stonewalling, or getting defensive.", reverse: false, weight: W[2] },
      { id: "FA4", domain: "FA", text: "When tension or conflict arose in my family, I repaired quickly instead of letting distance, resentment, or silence build.", reverse: false, weight: W[3] },
      { id: "FA5", domain: "FA", text: "I made intentional, protected time for family rather than giving them whatever was left over after work.", reverse: false, weight: W[4] },
      { id: "FA6", domain: "FA", text: "I was emotionally absent, distracted, or checked out around my family more often than I'd like to admit.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "CO",
    name: "Community",
    arena: "relationships",
    questions: [
      { id: "CO1", domain: "CO", text: "Outside of family and work, I have at least two or three people who know the real me, including my struggles, my goals, and what's actually going on in my life.", reverse: false, weight: W[0] },
      { id: "CO2", domain: "CO", text: "Outside of work, I actively invested time and energy into friendships or communities that support growth, honesty, and real connection.", reverse: false, weight: W[1] },
      { id: "CO3", domain: "CO", text: "In the past 30 days, I intentionally shared meals, calls, or activities with friends or community members who energize me and reflect my values.", reverse: false, weight: W[2] },
      { id: "CO4", domain: "CO", text: "In my friendships and communities, I felt genuinely welcomed and known rather than performing, masking, or going through the motions socially.", reverse: false, weight: W[3] },
      { id: "CO5", domain: "CO", text: "After spending time with friends or in community this month, I consistently felt energized and supported rather than drained, performing, or relieved it was over.", reverse: false, weight: W[4] },
      { id: "CO6", domain: "CO", text: "Outside of work and family, I was socially isolated, withdrawn, or mostly surrounded by relationships that felt shallow or draining this month.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "WI",
    name: "World / Impact",
    arena: "relationships",
    questions: [
      { id: "WI1", domain: "WI", text: "In the past 30 days, I gave my time, skills, or resources to a cause, community, or mission beyond my own business or personal gain.", reverse: false, weight: W[0] },
      { id: "WI2", domain: "WI", text: "I used my specific strengths and expertise to help others this month through mentoring, teaching, creating, or serving in a way that felt aligned with who I am.", reverse: false, weight: W[1] },
      { id: "WI3", domain: "WI", text: "Beyond my own business goals, I am actively building or contributing to something that will create positive impact for others over the long term.", reverse: false, weight: W[2] },
      { id: "WI4", domain: "WI", text: "My contribution to others this month was planned and consistent rather than a one-off, a guilt response, or something I did for appearances.", reverse: false, weight: W[3] },
      { id: "WI5", domain: "WI", text: "I contributed to others this month without posting about it, expecting recognition, or needing anyone to notice. It was genuine, not performative.", reverse: false, weight: W[4] },
      { id: "WI6", domain: "WI", text: "I was so consumed by my own goals or survival that meaningful contribution to others fell off my radar.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "VS",
    name: "Vision / Strategy",
    arena: "business",
    questions: [
      { id: "VS1", domain: "VS", text: "I can clearly articulate where my business is heading over the next 12 to 18 months, why it matters to me personally, and draw a direct line from my revenue targets to the specific life outcomes they exist to create.", reverse: false, weight: W[0] },
      { id: "VS2", domain: "VS", text: "In my business, I said 'no' to opportunities, projects, or requests that didn't fit my current strategic priorities, even when they were tempting.", reverse: false, weight: W[1] },
      { id: "VS3", domain: "VS", text: "In my business, I had clear priorities and a strategy simple enough to explain to someone in under 60 seconds.", reverse: false, weight: W[2] },
      { id: "VS4", domain: "VS", text: "In my business, the decisions I made this month matched my values, my season of life, and my actual capacity rather than just what seemed exciting or urgent.", reverse: false, weight: W[3] },
      { id: "VS5", domain: "VS", text: "If someone asked me about my business direction right now, I could answer confidently and concisely without hesitation, contradictions, or listing five different priorities.", reverse: false, weight: W[4] },
      { id: "VS6", domain: "VS", text: "In my business, I spent significant time chasing new ideas, second-guessing my direction, or reacting to whatever felt most urgent rather than following a plan.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "EX",
    name: "Execution",
    arena: "business",
    questions: [
      { id: "EX1", domain: "EX", text: "At the end of each week in my business, I had completed the specific priorities I planned at the start of the week without needing to cram, scramble, or rely on external accountability to finish.", reverse: false, weight: W[0] },
      { id: "EX2", domain: "EX", text: "In my business, I finished and shipped more than I started, and my output was tangible and moved things forward.", reverse: false, weight: W[1] },
      { id: "EX3", domain: "EX", text: "In my business, my calendar reflected my actual priorities rather than meetings I didn't need, other people's demands, or whatever felt easiest.", reverse: false, weight: W[2] },
      { id: "EX4", domain: "EX", text: "In my business, I followed a structured weekly rhythm where I set clear outcomes at the start of each week, protected my non-negotiable work blocks, and completed a weekly review of my progress.", reverse: false, weight: W[3] },
      { id: "EX5", domain: "EX", text: "In my business, when I noticed I was avoiding a hard task by procrastinating, doing busywork, or switching to easy wins, I caught it and got back on track quickly.", reverse: false, weight: W[4] },
      { id: "EX6", domain: "EX", text: "In my business, I frequently procrastinated on high-impact work, started things I didn't finish, or let weeks pass without meaningful output.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "OH",
    name: "Operational Health",
    arena: "business",
    questions: [
      { id: "OH1", domain: "OH", text: "I can predict, within a reasonable range, how many qualified conversations my business generates per month and my conversion rate from conversation to paid client.", reverse: false, weight: W[0] },
      { id: "OH2", domain: "OH", text: "In my business, I have a weekly review system where I track key metrics like leads, conversions, revenue, and capacity and use that data to make decisions.", reverse: false, weight: W[1] },
      { id: "OH3", domain: "OH", text: "My delivery and operations workload fit inside sustainable capacity, and I wasn't silently running over-capacity to keep things afloat.", reverse: false, weight: W[2] },
      { id: "OH4", domain: "OH", text: "I can name my biggest operational bottleneck right now and have a specific, actionable plan to address it.", reverse: false, weight: W[3] },
      { id: "OH5", domain: "OH", text: "My business is becoming less dependent on me through delegation, automation, or documented SOPs, and I can point to specific recent evidence of that progress.", reverse: false, weight: W[4] },
      { id: "OH6", domain: "OH", text: "My business felt unpredictable, and I couldn't reliably forecast revenue, leads, or capacity from month to month.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "EC",
    name: "Ecology",
    arena: "business",
    questions: [
      { id: "EC1", domain: "EC", text: "If I achieved my current business goals exactly as planned, my health, relationships, happiness, and personal freedom would all improve rather than suffer.", reverse: false, weight: W[0] },
      { id: "EC2", domain: "EC", text: "In my business, the way I sell, deliver, and lead matches who I actually am. I don't have to fake a persona, override my instincts, or perform to make it work.", reverse: false, weight: W[1] },
      { id: "EC3", domain: "EC", text: "My business model fits how I'm wired and doesn't require me to constantly push past exhaustion, dread, or resistance just to keep it running.", reverse: false, weight: W[2] },
      { id: "EC4", domain: "EC", text: "If my business became 10x more of what it already is today, I would feel more free, more energized, and more proud of how I operate rather than more burnt out, more trapped, or more desperate to escape.", reverse: false, weight: W[3] },
      { id: "EC5", domain: "EC", text: "In my business, when it was time to do the hard growth work like selling, launching, or following up, I didn't stall, self-sabotage, or find reasons to delay.", reverse: false, weight: W[4] },
      { id: "EC6", domain: "EC", text: "In my business, part of me suspects I'm building something that looks impressive on the outside but would make me feel more trapped if it actually scaled.", reverse: true, weight: W[5] },
    ],
  },
];

export const IMPORTANCE_DOMAINS = [
  { section: "Self", domains: [
    { code: "PH", label: "Physical Health" },
    { code: "IA", label: "Inner Alignment" },
    { code: "ME", label: "Mental / Emotional Health" },
    { code: "AF", label: "Attention & Focus" },
  ]},
  { section: "Relationships", domains: [
    { code: "RS", label: "Relationship to Self" },
    { code: "FA", label: "Family" },
    { code: "CO", label: "Community" },
    { code: "WI", label: "World / Impact" },
  ]},
  { section: "Business", domains: [
    { code: "VS", label: "Vision / Strategy" },
    { code: "EX", label: "Execution" },
    { code: "OH", label: "Operational Health" },
    { code: "EC", label: "Ecology" },
  ]},
];
```

## 4) Archetype Assignment Logic + Core Archetype Description Copy
Archetype shown to a user is selected from arena/domain score shape rules. Users then see short description, full profile content, and library detail copy.

### Archetype Logic + Short Descriptions (`lib/vapi/scoring.ts`, `ARCHETYPE_DESCRIPTIONS`)

```text
import { DOMAINS, ARENAS } from "./quiz-data";

export type VapiScores = {
  domains: Record<string, number>;
  arenas: Record<string, number>;
  overall: number;
};

export type VapiTier = "Dialed" | "Functional" | "Below the Line" | "In the Red";

export type VapiArchetype =
  | "The Architect"
  | "The Journeyman"
  | "The Phoenix"
  | "The Engine"
  | "The Drifter"
  | "The Performer"
  | "The Ghost"
  | "The Guardian"
  | "The Seeker";

export type PriorityQuadrant =
  | "Critical Priority"
  | "Protect & Sustain"
  | "Monitor"
  | "Possible Over-Investment";

export type PriorityItem = {
  domain: string;
  domainName: string;
  score: number;
  importance: number;
  quadrant: PriorityQuadrant;
};

export type VapiArenaKey = "personal" | "relationships" | "business";

export type RankedArena = {
  key: VapiArenaKey;
  label: "Personal" | "Self" | "Relationships" | "Business";
  score: number;
};

export function scoreQuestion(raw: number, reverse: boolean): number {
  return reverse ? 8 - raw : raw;
}

export function scoreDomain(answers: number[], domain: typeof DOMAINS[number]): number {
  const scored = domain.questions.map((q, i) =>
    scoreQuestion(answers[i] || 4, q.reverse)
  );
  const weightedSum = scored.reduce(
    (sum, val, i) => sum + val * domain.questions[i].weight,
    0
  );
  const raw = ((weightedSum - 6.0) / 36.0) * 10;
  return Math.round(Math.max(0, Math.min(10, raw)) * 10) / 10;
}

export function calculateScores(
  answers: Record<string, number[]>
): VapiScores {
  const domains: Record<string, number> = {};

  for (const domain of DOMAINS) {
    domains[domain.code] = scoreDomain(answers[domain.code] || [], domain);
  }

  const arenas: Record<string, number> = {};
  for (const arena of ARENAS) {
    const arenaScores = arena.domains.map((d) => domains[d] || 0);
    arenas[arena.key] =
      Math.round(
        (arenaScores.reduce((a, b) => a + b, 0) / arenaScores.length) * 10
      ) / 10;
  }

  const allScores = Object.values(domains);
  const overall =
    Math.round(
      (allScores.reduce((a, b) => a + b, 0) / allScores.length) * 10
    ) / 10;

  return { domains, arenas, overall };
}

/** Maps legacy stored archetype names to the current canonical name. */
export function normalizeVapiArchetypeName(
  name: string | null | undefined
): string | null {
  if (name == null || name === "") return null;
  if (name === "The Rising Architect") return "The Journeyman";
  return name;
}

export function getTier(score: number): VapiTier {
  if (score >= 8) return "Dialed";
  if (score >= 6) return "Functional";
  if (score >= 4) return "Below the Line";
  return "In the Red";
}

export function getTierColor(tier: VapiTier): string {
  switch (tier) {
    case "Dialed":
      return "#22C55E";
    case "Functional":
      return "#EAB308";
    case "Below the Line":
      return "#F97316";
    case "In the Red":
      return "#EF4444";
  }
}

export function getArchetype(arenas: Record<string, number>, domains: Record<string, number>): VapiArchetype {
  const p = arenas.personal || 0;
  const r = arenas.relationships || 0;
  const b = arenas.business || 0;
  const allArenas = [p, r, b];
  const spread = Math.max(...allArenas) - Math.min(...allArenas);
  const belowCount = allArenas.filter((a) => a <= 4.5).length;
  const arenasNearArchitect = allArenas.filter((a) => a >= 7.5).length;
  const lowestArena = Math.min(...allArenas);

  if (p >= 8 && r >= 8 && b >= 8) return "The Architect";
  const overall = (p + r + b) / 3;
  if (overall >= 7.0 && arenasNearArchitect >= 2 && lowestArena >= 6.5) {
    return "The Journeyman";
  }
  if (overall <= 4.5 || belowCount >= 2) return "The Phoenix";
  if ((domains.EX || 0) >= 7 && ((domains.EC || 0) <= 5 || (domains.VS || 0) <= 5))
    return "The Engine";
  const allMid = p >= 5 && p <= 7.9 && r >= 5 && r <= 7.9 && b >= 5 && b <= 7.9;
  if (allMid && spread <= 2) return "The Drifter";
  if (b === Math.max(...allArenas) && p === Math.min(...allArenas) && spread >= 2)
    return "The Performer";
  if (b === Math.max(...allArenas) && r === Math.min(...allArenas) && spread >= 2)
    return "The Ghost";
  if (r === Math.max(...allArenas) && b === Math.min(...allArenas) && spread >= 2)
    return "The Guardian";
  if (p === Math.max(...allArenas) && b === Math.min(...allArenas) && spread >= 2)
    return "The Seeker";
  return "The Drifter";
}

export function getRankedArenas(
  arenas: Record<string, number>,
  options?: { personalLabel?: "Personal" | "Self" }
): RankedArena[] {
  const personalLabel = options?.personalLabel ?? "Personal";
  const ranked: RankedArena[] = [
    { key: "personal", label: personalLabel, score: arenas.personal || 0 },
    { key: "relationships", label: "Relationships", score: arenas.relationships || 0 },
    { key: "business", label: "Business", score: arenas.business || 0 },
  ];
  return ranked.sort((a, b) => a.score - b.score);
}

export function getPriorityMatrix(
  domainScores: Record<string, number>,
  importance: Record<string, number>
): PriorityItem[] {
  return DOMAINS.map((d) => {
    const score = domainScores[d.code] || 0;
    const imp = importance[d.code] || 5;
    let quadrant: PriorityQuadrant;

    if (imp >= 7 && score < 6) quadrant = "Critical Priority";
    else if (imp >= 7 && score >= 6) quadrant = "Protect & Sustain";
    else if (imp < 7 && score < 6) quadrant = "Monitor";
    else quadrant = "Possible Over-Investment";

    return { domain: d.code, domainName: d.name, score, importance: imp, quadrant };
  });
}

export const ARCHETYPE_DESCRIPTIONS: Record<VapiArchetype, string> = {
  "The Architect":
    "You're aligned across all three arenas. Your life, relationships, and business are working together. The work now is maintenance, refinement, and protecting what you've built.",
  "The Journeyman":
    "You're performing at a high level across all three arenas. One arena is still trailing. Closing that gap is the work that moves you from skilled to fully integrated.",
  "The Phoenix":
    "You're in a season of rebuilding. Multiple areas need attention. This isn't failure — it's the foundation for your next chapter. Start with the one area that would create the most relief.",
  "The Engine":
    "You can execute, but your direction or sustainability is off. You're powerful — the question is whether you're aimed at the right target and whether you can sustain the pace.",
  "The Drifter":
    "You're functional across the board but not thriving anywhere. Everything is 'fine.' The risk is coasting. Pick one arena to go deep on this quarter.",
  "The Performer":
    "Your business is strong but your personal foundation is cracking. You're performing at a high level — but at what cost? The body and mind are keeping score.",
  "The Ghost":
    "Business is strong but relationships are fading. You're building something impressive — but the people who matter are watching you disappear. Reconnect before the distance becomes permanent.",
  "The Guardian":
    "Relationships are strong but business is lagging. You show up beautifully for others — now it's time to show up for your vision with the same commitment.",
  "The Seeker":
    "You've done deep personal work but your business hasn't caught up. The inner alignment is there — now channel it into strategy and execution.",
};
```


### Archetype Full Profiles (`lib/vapi/archetypes-full.ts`)

```text
import type { VapiArchetype } from "./scoring";

export type ArchetypeFull = {
  tagline: string;
  description: string;
  strength: string;
  shadow: string;
  constraint: string;
  growthPath: string;
  programPhase: string;
};

export const ARCHETYPES_FULL: Record<VapiArchetype, ArchetypeFull> = {
  "The Architect": {
    tagline: "You've built a life and business that actually work together.",
    description:
      "The Architect builds on a solid personal foundation. Your relationships are real. Your business is clear, executing, and aligned with who you actually are. This isn't perfection, and it's not balance in some idealized sense. It's integration. The way you live reinforces the way you work, and vice versa.",
    strength:
      "True integration. Your arenas reinforce each other instead of competing. Health fuels focus. Relationships provide resilience. Business creates freedom. And the whole system compounds.",
    shadow:
      "Complacency. When everything is working, the urgency to maintain it fades. The biggest threat to The Architect isn't failure. It's the slow, invisible drift that happens when you stop auditing because things feel good.",
    constraint:
      "Maintaining the standard. Your challenge is sustainability and continued growth at a high level, not fixing something broken.",
    growthPath:
      "The Architect's path is deepening, not fixing. The work is staying honest, raising the ceiling, and expanding your impact without sacrificing what you've built. Mastery isn't a destination. It's a practice.",
    programPhase:
      "Phase 5: Embodied Execution. You don't need to find clarity or remove blocks. You need to sustain and deepen what's already working.",
  },
  "The Journeyman": {
    tagline:
      "You've built real skill across the board. One arena is lagging, and that's the final edge to sharpen.",
    description:
      "You're performing at a high level across all three arenas. Your composite score reflects genuine, broad strength, not luck, not a good week, but the result of real work over time. You're not in crisis anywhere. You're not propping up one area by sacrificing another. The foundation is solid. But you're not yet an Architect. One arena is trailing the others, and that gap is what separates skilled from masterful. The Journeyman has proven their craft and works with independence and competence. What remains is the final refinement that turns journeyman into master. Your trajectory is clear. Your task now is to identify the lagging arena, understand what's keeping it from matching the others, and close that gap. When you do, you'll have the integrated strength that defines the Architect.",
    strength:
      "Broad competence across all three arenas with a composite score that reflects genuine, sustained capability. You've done the work to get here.",
    shadow:
      "One arena lags behind the others, creating a ceiling on your overall integration. The gap isn't large, but it's meaningful.",
    constraint:
      "Identify the specific domains within your lagging arena that are pulling the score down. Concentrate your next phase of work there while maintaining what's already strong.",
    growthPath:
      "Closing the gap moves you from Journeyman to Architect: fully integrated strength across Business, Relationships, and Self with no arena holding you back.",
    programPhase:
      "Phase 5: Embodied Execution. Like The Architect, you don't need to find clarity or remove deep internal blocks. You need targeted work on a specific gap while maintaining everything else. The coaching work is about precision and accountability, not excavation.",
  },
  "The Phoenix": {
    tagline: "In the fire. Not finished.",
    description:
      "The Phoenix is the founder whose life and business are in serious deficit across multiple areas. Your health, relationships, business, and emotional state may all be below where they need to be. This isn't a rough patch. It's a crisis, even if it doesn't look like one from the outside. But you're here. You took the assessment and answered honestly. That's the first act of rebuilding.",
    strength:
      "Honesty and resilience. You're still in the game. You're still trying. That matters more than any score on this assessment.",
    shadow:
      "The risk is overwhelm. When everything is broken, the temptation is either to try to fix all of it at once, which is impossible, or to give up entirely, which is unnecessary.",
    constraint:
      "Compounding deficits. Each weak area is making the others worse. The solution is ruthless triage: identify the one domain that would create the most relief and focus there first.",
    growthPath:
      "The Phoenix's path is rebuilding from the ground up, one domain at a time. You're building toward The Architect, but the bridge starts with stabilization. Not optimization. Not strategy. Stabilization.",
    programPhase:
      "Phase 1: Awareness. The Phoenix needs the longest, most honest Phase 1 to fully map the situation, identify the true starting point, and build the psychological safety to begin rebuilding without shame.",
  },
  "The Engine": {
    tagline: "Building fast. Building wrong.",
    description:
      "The Engine can execute—that's not the problem. You ship, you grind, you produce, you follow through. The problem is that the machine you've built is pointed in the wrong direction. Your business model doesn't fit who you are, or your strategy doesn't connect to what you actually want. You're the founder with a gas pedal and no steering wheel.",
    strength:
      "Execution discipline. You can do the work. You have the systems, the rhythm, and the follow-through. This is the hardest capability to build and you already have it.",
    shadow:
      "Execution without alignment is the most expensive mistake a founder can make. You're spending your rarest resource, disciplined action, on something that doesn't serve your actual life.",
    constraint:
      "Ecological misalignment. The destination isn't safe, so part of you is fighting the journey even while another part forces execution forward.",
    growthPath:
      "The Engine's path is stopping long enough to redirect. You don't need to learn how to execute. You need to make sure what you're executing on is worth the effort.",
    programPhase:
      "Phase 2: Strategic Clarity into Phase 3: Internal Alignment. The Engine needs to redefine the destination first, then address the internal beliefs keeping them locked into a model that doesn't fit.",
  },
  "The Drifter": {
    tagline: "Fine everywhere. Exceptional nowhere.",
    description:
      "The Drifter is the most comfortable and most dangerous archetype. Nothing is broken. Nothing is in crisis. Everything is 'fine.' Your health is okay. Your relationships are decent. Your business is functional. And that's exactly the problem. You're operating in a zone where there's never enough pain to force change and never enough excellence to create momentum.",
    strength:
      "Balance and stability. You haven't sacrificed any arena entirely, and you have a foundation in every area to build on.",
    shadow:
      "'Good enough' is the enemy of great. You're using the absence of crisis as permission to avoid the harder work of building something exceptional.",
    constraint:
      "A lack of strategic intensity. The Drifter doesn't have a broken area to fix. They have a missing commitment to excellence in any one area.",
    growthPath:
      "The Drifter's path is choosing. Picking the arena or domain that matters most right now and driving it from Functional to Dialed. One area of excellence creates a cascade that lifts everything else.",
    programPhase:
      "Phase 2: Strategic Clarity. The Drifter needs a vision that's compelling enough to break through the comfort of 'fine.'",
  },
  "The Performer": {
    tagline: "Impressive output. Crumbling foundation.",
    description:
      "The Performer looks like they have it together from the outside. The business is producing. The revenue is there. But underneath the performance, your personal foundation is cracking. Your sleep is inconsistent. Your emotional regulation is strained. Your pace is unsustainable. You've been running on willpower, adrenaline, and the fear of what happens if you slow down.",
    strength:
      "Drive, execution, and the ability to produce under pressure. You know how to get things done, and people respect your output.",
    shadow:
      "You've confused output with health. You've built your identity around productivity, and slowing down feels like dying.",
    constraint:
      "A nervous system running in perpetual overdrive. You don't have an execution problem. You have a sustainability problem disguised as success.",
    growthPath:
      "The Performer's path is learning that sustainable output requires a foundation that can hold it. The bridge runs through your body and your nervous system, not through more hustle.",
    programPhase:
      "Phase 3: Internal Alignment. The belief driving The Performer is usually some version of 'I'm only valuable when I'm producing.' Until that belief is addressed, no health protocol will stick.",
  },
  "The Ghost": {
    tagline: "Building an empire. Disappearing from your own life.",
    description:
      "The Ghost has strong business metrics. You might even have your personal health and habits together. But the people in your life are experiencing your absence. Your family gets whatever's left after work takes its share. Your friendships are thin or transactional. You've optimized for achievement and accidentally optimized away the connections that make achievement meaningful.",
    strength:
      "Professional focus and the ability to build something real. You don't get distracted by social noise, and your work ethic is genuine.",
    shadow:
      "Isolation dressed up as independence. You tell yourself you don't need people, but the truth is you've stopped letting people in.",
    constraint:
      "A belief that connection is a luxury or a vulnerability rather than a strategic and emotional necessity. Often paired with a fear of being truly seen.",
    growthPath:
      "The Ghost's path is learning that relationships aren't a distraction from the mission. They're the infrastructure that makes the mission sustainable.",
    programPhase:
      "Phase 2: Strategic Clarity. The Ghost needs to redefine success to include relational health, not just business performance.",
  },
  "The Guardian": {
    tagline: "All heart. Needs a vehicle.",
    description:
      "The Guardian pours into people beautifully. Your family feels your presence. Your friendships are real. But your business isn't reflecting your capability. Your strategy is unclear, your execution is inconsistent, or you're undercharging and over-delivering. You give endlessly to others and struggle to build the engine that funds the life you want.",
    strength:
      "Relational depth, genuine generosity, and the ability to make people feel seen. These are rare and invaluable qualities.",
    shadow:
      "Chronic self-sacrifice disguised as service. You may be using relationships as a hiding place from the harder, lonelier work of building something for yourself.",
    constraint:
      "A belief that business success and relational integrity are in tension. Often paired with discomfort around self-promotion, pricing, or claiming space for yourself.",
    growthPath:
      "The Guardian's path is learning that building a strong business IS an act of service, because it funds, sustains, and amplifies everything you care about.",
    programPhase:
      "Phase 2: Strategic Clarity. The Guardian needs a vision that explicitly connects business results to the relational and impact outcomes they already care about.",
  },
  "The Seeker": {
    tagline: "Deeply self-aware. Stuck in insight.",
    description:
      "The Seeker has done the inner work. Your health habits might be solid. You understand your patterns, your values, and what you want. But your business isn't reflecting any of it. The strategy is unclear or constantly shifting. Execution is inconsistent. You have extraordinary self-knowledge and almost no traction.",
    strength:
      "Self-awareness, emotional intelligence, and a genuine commitment to personal growth. You understand yourself at a depth most founders never reach.",
    shadow:
      "Insight without action becomes its own trap. You may be using self-development as a sophisticated form of procrastination: always preparing, never launching.",
    constraint:
      "A gap between internal clarity and external execution. Often driven by perfectionism, fear of failure, or a belief that the right insight will eventually make action effortless.",
    growthPath:
      "The Seeker's path is learning that execution IS the final form of self-development. The bridge is built by doing, not by understanding more.",
    programPhase:
      "Phase 4: Aligned Action. The Seeker doesn't need more clarity. They need a system that translates their awareness into rhythms, boundaries, and structures that produce output.",
  },
};
```


### Archetype Library Long-Form Copy (`lib/vapi/archetype-library.ts`)

```text
import type { VapiArchetype } from "./scoring";

export type ArchetypeLibraryContent = {
  howToKnowThisIsYou: string[];
  howToKnowThisIsntYou: string[];
  reflectionPrompts: string[];
  relationshipToOtherArchetypes: string;
  commonDrivers: string;
};

export const ARCHETYPE_LIBRARY_TITLE = "The 9 Founder Archetypes";

export const ARCHETYPE_LIBRARY_SUBTITLE =
  "Your archetype reflects how your energy, attention, and effort are distributed across the three arenas of your life: Self, Relationships, and Business. It reveals the shape of your current operating pattern, not who you are, but how you're operating right now. As your scores change, your archetype can change with them. Reading all nine will help you understand where you've been, where you are, and what you're building toward.";

export const ARCHETYPE_LIBRARY_EMPTY_RESULTS_BANNER =
  "Take the VAPI Assessment to discover your current founder archetype.";

export const ARCHETYPE_LIBRARY_FOOTER_HEADING =
  "Ready to Change Your Operating Pattern?";

export const ARCHETYPE_LIBRARY_FOOTER_TEXT =
  "Your archetype isn't permanent. It's a reflection of how you're operating today. The Aligned Power Program is a 12-month coaching partnership designed to help you build toward The Architect: full integration across your health, relationships, and business.";

export const ARCHETYPE_LIBRARY_ORDER: VapiArchetype[] = [
  "The Architect",
  "The Journeyman",
  "The Performer",
  "The Ghost",
  "The Guardian",
  "The Seeker",
  "The Drifter",
  "The Engine",
  "The Phoenix",
];

export function getArchetypeSectionId(archetype: VapiArchetype): string {
  return `archetype-${String(archetype)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}`;
}

export const ARCHETYPE_LIBRARY_CONTENT: Record<
  VapiArchetype,
  ArchetypeLibraryContent
> = {
  "The Architect": {
    howToKnowThisIsYou: [
      "Your life genuinely feels integrated. Your business supports your health rather than undermining it.",
      "Your closest relationships feel your presence, not just your proximity",
      "You have energy at the end of the day, not just at the beginning",
      "You can name your strategy, your boundaries, and your priorities without hesitation",
      "Your business could run for a week without you and nothing critical would break",
      "When you look at your calendar, it reflects what you actually value",
      "People who know you well would say you seem grounded, present, and clear",
    ],
    howToKnowThisIsntYou: [
      "If any arena feels like it's being propped up by sacrificing another, you're not here yet",
      "If your health, relationships, or business would collapse under moderate stress, the integration isn't real",
      "If you feel like you're performing well but running on fumes, you may be a Performer, not an Architect",
      "If you're strong in two arenas but neglecting a third, you're likely The Journeyman",
      "The Architect doesn't just look good on paper. It FEELS sustainable in your body.",
    ],
    reflectionPrompts: [
      "What is the one area of your life that would be the first to slip if you stopped actively maintaining it? That's your vulnerability point. What system or practice is protecting it right now?",
      "When was the last time you audited whether your daily reality still matches your stated values? Is there a gap forming that you've been too comfortable to notice?",
      "If someone followed you for a week with a camera, would the footage match the story you tell about your life? Where would the discrepancies show up?",
      "What would need to change in your external circumstances (a business crisis, a health scare, a relationship conflict) to knock you out of this integrated state? How prepared are you for that disruption?",
      "Are you growing or maintaining? There's a difference. The Architect who stops growing eventually starts drifting. What's your next edge?",
    ],
    relationshipToOtherArchetypes:
      "The Architect is the destination that every other archetype is building toward, but it's most closely related to The Journeyman, which represents the near-miss. If your scores drop in one arena, you'll likely transition to The Journeyman first before falling further. The most common regression paths from Architect are: to The Journeyman (one arena softens), to Performer (Self arena collapses while Business stays strong), or to Ghost (Relationships arena erodes while you're focused elsewhere). The Architect's greatest long-term risk is becoming a Drifter through complacency, where 'good enough' replaces the intentional maintenance that built the integration in the first place.",
    commonDrivers:
      "The Architect typically shows 'No Driver Identified' with the High Performer fallback. If a driver does appear, it's usually faint and represents a residual pattern rather than an active one. The most common residual drivers are The Achiever's Trap (old habits of tying identity to output) or The Protector (lingering control patterns), but these are typically secondary drivers at low point totals rather than dominant patterns.",
  },
  "The Journeyman": {
    howToKnowThisIsYou: [
      "Your composite score is 7.0 or above, reflecting genuine strength across the board",
      "At least two of your three arenas score 7.5 or higher",
      "Your lowest arena is still 6.5 or above, functional, not broken",
      "You don't have any single area in crisis, but you can feel that one arena isn't keeping pace with the others",
      "You've put in real work to get here. This isn't accidental or temporary.",
      "You're close to having it all dialed, and that proximity is both motivating and slightly frustrating",
      "People who know your situation would say you're doing well across the board, but you know there's a gap you haven't fully closed",
    ],
    howToKnowThisIsntYou: [
      "If any arena is below 6.0, you likely have a more significant imbalance that places you in a different archetype (Guardian, Seeker, Performer, or Ghost)",
      "If all three arenas are above 8.0 with a composite of 8.0+, you're an Architect, not a Journeyman",
      "If your composite is below 7.0, you're likely a Drifter or one of the imbalance archetypes",
      "The Journeyman is defined by being close to full integration. If you have major gaps or major strengths without the broad foundation, another archetype fits better.",
    ],
    reflectionPrompts: [
      "Look at your lagging arena. Without checking the specific domain scores, what's your gut sense about what's pulling it down? Your intuition likely already knows where the gap is. Name it.",
      "What would it take to bring your lagging arena up by 0.5 to 1.0 points over the next 90 days? Not a complete overhaul, just consistent attention. What specific actions would that require?",
      "What are you currently doing to maintain your two stronger arenas? Make sure any focus on the lagging arena doesn't come at the cost of what's already working. How will you protect those foundations?",
      "What has prevented you from closing this gap already? Is it attention? Priority? Skill? Belief? Something structural? Name the actual barrier, not the surface-level excuse.",
      "Imagine you close this gap and reach Architect-level integration. What becomes possible that isn't possible now? How would your experience of your business, relationships, and self actually change? Make it concrete.",
    ],
    relationshipToOtherArchetypes:
      "The Journeyman sits directly below The Architect in the progression. The difference is narrow but meaningful: The Architect has closed all the gaps, while The Journeyman has one arena still trailing. The Journeyman is most commonly confused with The Drifter because both show relatively balanced scores. The difference is altitude: The Drifter is balanced in the middle (composite 5.5-6.5) while The Journeyman is balanced near the top (composite 7.0+). The most common path to Journeyman is from one of the imbalance archetypes (Guardian, Seeker, Performer) after the weak arena has been strengthened. The path forward from Journeyman is singular: close the gap in the lagging arena and become The Architect.",
    commonDrivers:
      "The Journeyman often shows no driver at all, or Aligned Momentum, because the psychological patterns that produce dysfunction have largely been addressed. When a driver does appear, it's typically a mild or residual version of whatever pattern was present before they reached this level. The Fog occasionally appears when the Journeyman has broad strength but hasn't fully clarified what's next. The Builder's Gap occasionally appears when the lagging arena is Business and the gap is specifically in operational systems or execution.",
  },
  "The Performer": {
    howToKnowThisIsYou: [
      "Your business results are the thing people compliment you on most, but privately you're exhausted",
      "You can push through almost anything when you need to, but you need to more often than you'd like",
      "Your health has taken a backseat to your business for longer than you originally intended",
      "You know you're running unsustainably but you don't know how to stop without everything falling apart",
      "You feel a spike of anxiety when you imagine reducing your output by 30%",
      "People close to you have told you to slow down. You've explained why you can't. You're not sure you believe your own explanation anymore.",
      "Your identity and your productivity are difficult to separate. Who are you if you're not performing?",
    ],
    howToKnowThisIsntYou: [
      "If your business is struggling alongside everything else, you're likely a Phoenix or a Drifter, not a Performer",
      "If your health, sleep, and energy feel sustainable, the Performer pattern doesn't fit",
      "If you can take a full week off without guilt or anxiety, this isn't your archetype",
      "If your Self arena scores are strong, the Performer label doesn't apply even if your Business scores are high",
      "The Performer's defining feature is the gap between external results and internal cost. If that gap doesn't exist, look elsewhere.",
    ],
    reflectionPrompts: [
      "If your business revenue stayed exactly the same but you could only work 25 hours a week, what would you cut? What would you delegate? And what does your resistance to that thought tell you about what's really driving the current pace?",
      "When did you last feel genuinely rested, not just recovered enough to work again, but actually rested? If you can't remember, how long has this pattern been running?",
      "Strip away your business results, your title, your revenue, your reputation. What's left? How do you describe yourself without referencing what you've built or what you produce?",
      "What would the people who love you most say about the cost of your current pace if they were being completely honest? Have you asked them? What are you afraid they'd say?",
      "Imagine a version of your life where your business produces 80% of current results but your health, energy, and presence are fully restored. Would you take that trade? If not, what does that tell you about what you're actually optimizing for?",
    ],
    relationshipToOtherArchetypes:
      "The Performer is most commonly confused with The Ghost. Both have strong Business scores. The difference is where the sacrifice shows up. The Performer sacrifices their personal foundation (health, emotional regulation, alignment, focus). The Ghost sacrifices their relationships (family presence, community, connection, contribution). Some founders are both simultaneously, which shows up as high Business with both Self AND Relationships lagging. If that's you, the archetype algorithm catches whichever gap is larger, but the reality is you're a Performer AND a Ghost. The Performer's most common improvement path is to The Journeyman, which happens when they rebuild their Self arena while maintaining Business. The most common regression is to Phoenix, which happens when the unsustainable pace finally collapses.",
    commonDrivers:
      "The Performer is most commonly paired with The Achiever's Trap (identity fused with output), The Escape Artist (using work to avoid something painful), or The Protector (using control and discipline as safety mechanisms). When you see a Performer, the driver tells you WHY they're performing at this unsustainable level. The Achiever performs because producing IS their identity. The Escape Artist performs because stopping means feeling. The Protector performs because their systems and output are the only things they trust.",
  },
  "The Ghost": {
    howToKnowThisIsYou: [
      "You can name your business metrics more easily than you can name what your partner or closest friend is currently struggling with",
      "You've missed events, dinners, or milestones because of work and justified it as temporary, but the temporary has lasted months or years",
      "If you're honest, the people closest to you are getting a diminished version of you and have been for a while",
      "You feel more comfortable in a work context than in an intimate or vulnerable personal one",
      "You've been told some version of 'you're never really here' by someone who matters to you",
      "Your social life is mostly professional. The friendships that remain feel thin or transactional.",
      "You sometimes feel a quiet emptiness after a big win because there's nobody who really knows what it took or what it means",
    ],
    howToKnowThisIsntYou: [
      "Your closest relationships feel genuinely nourished and the people in your life feel your presence",
      "You have at least 2-3 people who know the full, unfiltered truth about your life and struggles",
      "You make consistent, protected time for family and friendships that doesn't get overridden by work",
      "Your Relationships arena scores are Functional or above across all four domains",
      "If people who love you were surveyed about your presence and availability, they'd give you a strong rating",
      "The Ghost is defined by relational absence alongside professional strength. If your relationships feel healthy, this isn't you.",
    ],
    reflectionPrompts: [
      "When was the last time you had a conversation with someone you care about where you were fully present, no phone nearby, no mental to-do list running, no part of you wishing you could get back to work? How long ago was that? What does the answer tell you?",
      "If the three people closest to you wrote an honest letter about what it's like to be in a relationship with you right now, what would they say? Not the cruel version. The honest version.",
      "What are you getting from work that you're not getting from your relationships? Is it control, predictability, validation, or a sense of competence? What does that tell you about what feels safe versus what feels vulnerable?",
      "Think about a moment in the past year where you chose work over a relationship and you knew, in the moment, that you were making the wrong choice. What was the situation? What were you afraid would happen if you chose the relationship instead?",
      "If your business disappeared tomorrow, which relationships would survive? Which ones have enough depth and investment to hold? If that list is shorter than you'd like, that's not a scheduling problem. It's a priority problem.",
    ],
    relationshipToOtherArchetypes:
      "The Ghost is most commonly confused with The Performer. Both have strong Business scores and both are sacrificing something to maintain them. The difference is what's being sacrificed. The Performer sacrifices Self (health, emotions, alignment). The Ghost sacrifices Relationships (family, community, connection, contribution). In practice, many founders are a blend of both, but the archetype algorithm catches whichever deficit is larger. The Ghost's most common improvement path is to The Journeyman, which happens when they invest in Relationships while maintaining Business. The most common regression is to Phoenix, which happens when the isolation compounds into emotional crisis or the relationships deteriorate past the point of easy repair.",
    commonDrivers:
      "The Ghost is most commonly paired with The Protector (walls keep people out), The Escape Artist (work is a hiding place from relational vulnerability), or The Achiever's Trap (relationships can't compete with the dopamine of output). When you see a Ghost, the driver reveals the WHY behind the isolation. The Protector isolates through control and self-reliance. The Escape Artist isolates through constant activity. The Achiever isolates because relationships don't produce measurable results.",
  },
  "The Guardian": {
    howToKnowThisIsYou: [
      "You're the person everyone comes to for support, advice, or a listening ear, and you genuinely love that role",
      "Your clients, friends, or family would describe you as deeply caring, generous, and present",
      "You know your business should be further along than it is, but every time you sit down to work ON the business, someone needs something",
      "You undercharge, over-deliver, or give away too much of your time and expertise for free",
      "The idea of being aggressive about sales, marketing, or pricing makes you uncomfortable",
      "You've been told you're 'too nice' for business or that you need to be more ruthless. That advice felt wrong in your body.",
      "You secretly worry that building a bigger business will change who you are or compromise the quality of your relationships",
    ],
    howToKnowThisIsntYou: [
      "If your Business scores are strong and your Relationships scores are weak, you're the inverse of this pattern (likely a Ghost or Performer)",
      "If you don't struggle with pricing, sales, or business structure, the Guardian's core tension isn't present",
      "If you prioritize your own business goals as easily as you prioritize other people's needs, this isn't you",
      "If your relational generosity doesn't come at the expense of your business traction, you may be an Architect or Journeyman who happens to be relationally strong",
      "The Guardian's defining feature is that relational strength and business weakness coexist, and the relational strength is part of what prevents the business from growing",
    ],
    reflectionPrompts: [
      "How much revenue did you leave on the table in the past 12 months through undercharging, over-delivering, discounting, or doing free work? Be specific. What could that money have funded in your life or your family's life?",
      "When you imagine charging what your work is genuinely worth and enforcing that price without apology, what emotion comes up? Guilt? Fear? Unworthiness? Where did you learn that earning well and caring deeply couldn't coexist?",
      "Who in your life benefits from you staying small? Not maliciously, but structurally. Whose comfort depends on you being available, affordable, and accommodating? What would shift in those relationships if your business demanded more of your time and attention?",
      "Think of someone you admire who runs a thriving business AND shows up with genuine warmth and generosity. They exist. What do they do differently from you? Is it possible they're not less caring than you, but simply better boundaried?",
      "If you could build the business infrastructure your gifts deserve, systems that let you serve more people at a higher level without burning out, would the people in your life support that? If so, what's actually stopping you? If not, what does that tell you about those relationships?",
    ],
    relationshipToOtherArchetypes:
      "The Guardian is the mirror image of The Ghost and The Performer. Where those archetypes over-invest in Business at the expense of Self or Relationships, The Guardian over-invests in Relationships at the expense of Business. The Guardian's most common improvement path is to The Journeyman, which happens when they build Business fundamentals while maintaining relational strength. The most common lateral shift is to Seeker, which happens when a Guardian turns inward and starts doing personal development work but still doesn't build the business. The most common regression is to Phoenix, which happens when the financial strain of an underbuilt business eventually collapses the personal and relational stability that was holding everything together.",
    commonDrivers:
      "The Guardian is most commonly paired with The Builder's Gap (strong foundation, unbuilt business machine), The Pleaser's Bind (can't say no, can't prioritize own work), or The Martyr Complex (believes sacrifice is required for service). When you see a Guardian, the driver explains WHY the business hasn't been built. The Builder's Gap Guardian has the aligned model but hasn't constructed the infrastructure. The Pleaser Guardian keeps giving away the time they should be spending on business. The Martyr Guardian believes that profiting from their gifts would somehow taint the gift.",
  },
  "The Seeker": {
    howToKnowThisIsYou: [
      "You could talk about your values, your patterns, and your growth edge with impressive clarity, but your business results don't reflect that insight",
      "You've invested significant time and money in self-development: courses, books, coaching, therapy, retreats, journaling practices",
      "You often feel like you're one more insight away from everything clicking, but that feeling has persisted for months or years",
      "Your friends might describe you as 'the most self-aware person I know' and you feel a mix of pride and frustration at that label",
      "You start business initiatives with energy and clarity but lose momentum before they produce results",
      "You understand WHY you procrastinate, what your inner critic is protecting, and what your attachment style is, but that understanding hasn't translated into consistent output",
      "You're more comfortable in reflection mode than in execution mode",
    ],
    howToKnowThisIsntYou: [
      "If you're not particularly self-aware and your struggles feel confusing rather than understood, this isn't you",
      "If your business is executing well but your personal life is suffering, you're likely a Performer or Ghost",
      "If you lack self-awareness AND lack business traction, you may be in The Fog or The Phoenix",
      "If your execution is strong but pointed in the wrong direction, you're The Engine",
      "The Seeker's defining feature is high self-knowledge paired with low external output. If both are low or both are high, a different archetype fits better.",
    ],
    reflectionPrompts: [
      "Make a list of every self-development program, course, book, coach, or retreat you've invested in over the past 3 years. Next to each one, write the specific, measurable business outcome it produced. If most entries are blank, what does that pattern tell you about how you've been using personal growth?",
      "What would you lose if you stopped seeking and started building? Not what you'd gain. What would you lose? Is it the identity of being a 'growth-oriented person'? The safety of always preparing? The excuse of not being ready yet?",
      "If you were banned from consuming any self-development content for 90 days, no books, no podcasts, no courses, no frameworks, and you could only execute on what you already know, what would you build? You already know the answer. Why haven't you built it?",
      "Is there a part of you that believes understanding a problem IS solving it? Where did you learn that insight equals progress? What if the final lesson you need to learn is that the only remaining teacher is action?",
      "Think about someone you know who has less self-awareness than you but better business results. What do they do that you don't? The answer is almost certainly simpler and less elegant than you'd like it to be.",
    ],
    relationshipToOtherArchetypes:
      "The Seeker is the inverse of The Performer. The Performer acts without enough self-awareness. The Seeker is aware without enough action. In theory, combining the Seeker's insight with the Performer's execution would create an Architect. The Seeker's most common improvement path is to The Journeyman, which happens when they finally translate their self-knowledge into consistent business output. The most common lateral shift is to Guardian, which happens when a Seeker channels their energy into relationships and service instead of business building, adding relational richness but still not solving the business gap. The most common regression is to Drifter, which happens when the Seeker's awareness becomes so generalized that it loses its edge and everything settles into comfortable mediocrity.",
    commonDrivers:
      "The Seeker is most commonly paired with The Perfectionist's Prison (knows the plan but can't ship because of fear of judgment), The Fog (has self-awareness but can't commit to a direction), or The Builder's Gap (has the personal foundation but hasn't built the business machine). When you see a Seeker, the driver explains the specific block between insight and action. The Perfectionist Seeker is afraid of imperfection. The Fog Seeker can't choose among too many options. The Builder's Gap Seeker has the aligned model but resists the operational work of building it.",
  },
  "The Drifter": {
    howToKnowThisIsYou: [
      "Nothing in your life is in crisis but nothing excites you either",
      "If someone asked what you're building toward, your answer would be vague or change depending on the day",
      "You've been at roughly this level of performance for a while and the plateau has started to feel normal",
      "You don't have a strong pull toward any single priority. Everything feels equally important or equally unimportant.",
      "You're not unhappy enough to change and not fulfilled enough to feel proud",
      "You describe your life and business as 'fine' or 'good enough' more often than you'd like to admit",
      "The idea of going all-in on one thing makes you uncomfortable because it means letting other things slide",
    ],
    howToKnowThisIsntYou: [
      "If any arena is clearly strong while another is clearly struggling, you're not a Drifter. You have an imbalance, not a plateau.",
      "If your composite score is above 7.5, you're likely The Journeyman, not a Drifter",
      "If your composite is below 4.5, you're likely a Phoenix",
      "If you have clear passion and direction but can't execute, you're a Seeker or Perfectionist's Prison, not a Drifter",
      "The Drifter's defining feature is the absence of extremes. If you feel strong emotions about your situation, whether frustration, ambition, fear, or excitement, a different archetype probably fits.",
    ],
    reflectionPrompts: [
      "When was the last time you felt genuinely fired up about something in your business or life? Not interested. Not curious. Actually on fire. If you can't remember, how long have you been drifting?",
      "If someone forced you to pick one arena and make it exceptional within 6 months, even if the other two stayed where they are, which would you choose? The one that came to mind first is probably the one you've been afraid to commit to. Why?",
      "What are you getting from staying in the middle? Safety from failure? Protection from judgment? The ability to keep all options open? What would you have to give up to break out of this plateau?",
      "Imagine two versions of your life five years from now. Version A: everything is roughly the same as it is today. Version B: you went all-in on something and it worked. Now imagine Version C: you went all-in and it didn't work. Which version scares you most? If C scares you more than A, you've found the fear that's keeping you stuck.",
      "Who in your life is comfortable with you staying exactly where you are? And who would challenge you to want more? Which group do you spend more time with?",
    ],
    relationshipToOtherArchetypes:
      "The Drifter is most commonly confused with The Journeyman because both show relatively balanced scores. The difference is altitude. The Journeyman is balanced near the top with a composite of 7.0+ and specific domains in the Dialed range. The Drifter is balanced in the middle with Functional-range scores and nothing exceptional. The Drifter's most common improvement path is to any of the imbalance archetypes first (Guardian, Seeker, Performer) as they start investing heavily in one area, and then to The Journeyman as the other areas catch up. Going directly from Drifter to Architect is rare because it requires simultaneous improvement across all three arenas. The most common regression is to Phoenix, which happens when the comfortable middle erodes and multiple areas slide below the line.",
    commonDrivers:
      "The Drifter is most commonly paired with The Fog (can't commit to a direction), The Builder's Gap (has values but hasn't built the machine), or no driver at all. The Fog Drifter can't choose what to focus on. The Builder's Gap Drifter has relational and personal strength but hasn't translated it into business. When a Drifter shows no driver, it often means the plateau isn't driven by a deep psychological pattern but by a lack of strategic commitment. That's a Phase 2 problem, not a Phase 3 problem.",
  },
  "The Engine": {
    howToKnowThisIsYou: [
      "You're proud of your work ethic and discipline but quietly unsure whether you're building the right thing",
      "You have a nagging feeling that if your business succeeded fully as currently designed, you wouldn't actually want the life it creates",
      "You execute consistently but feel a subtle dread or resistance when you think about what's ahead at scale",
      "You've noticed that you procrastinate specifically on the big strategic decisions while executing perfectly on the daily tasks",
      "People praise your output and you feel a disconnect because the output doesn't feel meaningful",
      "You've considered pivoting your model but the idea of starting over after building so much momentum feels wasteful",
      "Your body or emotions are sending signals that something is off, but your results keep telling you to stay the course",
    ],
    howToKnowThisIsntYou: [
      "If your execution is inconsistent or weak, you're not The Engine. The Engine's defining feature is strong execution pointed in the wrong direction.",
      "If your business model feels aligned and you're excited about what success would look like, the ecological misalignment isn't present",
      "If you struggle with discipline, consistency, and follow-through, other archetypes fit better",
      "If all your Business domains are low, not just Ecology and Strategy, you're more likely a Guardian, Seeker, or Phoenix",
      "The Engine is specifically about capability without alignment. If you lack the capability, or if you have both capability and alignment, look elsewhere.",
    ],
    reflectionPrompts: [
      "Imagine your business succeeds completely on its current trajectory. You hit every revenue target, every growth milestone, everything you're currently working toward. Describe the life that creates. What does a typical Tuesday look like? Now ask yourself honestly: do you want that Tuesday?",
      "If you could keep your execution discipline but redirect it toward anything, with zero switching cost and zero judgment from anyone, what would you build? How different is that from what you're currently building?",
      "What would you have to admit to yourself if you acknowledged that the current model isn't right? What sunk cost, what identity, what external expectation would you have to let go of?",
      "Think about the resistance you feel toward the big strategic decisions you keep deferring. Is that resistance laziness, or is it intelligence? Is part of you refusing to commit fully to a direction it knows isn't right?",
      "If a trusted advisor looked at your business model and said 'This is well-executed but it's not the right model for who you are,' how would you feel? Defensive? Relieved? If relieved, you already have your answer.",
    ],
    relationshipToOtherArchetypes:
      "The Engine is most commonly confused with The Performer because both show strong execution. The difference is the source of tension. The Performer's problem is sustainability. They're building the right thing but burning themselves out doing it. The Engine's problem is direction. They're executing sustainably but building the wrong thing. The Engine's most common improvement path is to Performer first (they fix the strategy but the execution intensity creates personal strain), then to The Journeyman as they rebalance. Going directly to The Journeyman requires simultaneously fixing the model AND maintaining the execution, which is possible but demanding. The most common regression is to Phoenix, which happens when the misalignment eventually produces a crisis of meaning that collapses motivation and output simultaneously.",
    commonDrivers:
      "The Engine is most commonly paired with The Imposter Loop (building something they don't believe they deserve or that doesn't feel authentically theirs), The Escape Artist (using execution to avoid confronting the strategic question), or The Achiever's Trap (can't stop executing even when the direction is wrong because output is identity). When you see an Engine, the driver explains WHY they keep building in the wrong direction. The Imposter Engine doesn't trust themselves to choose correctly. The Escape Engine is avoiding the vulnerability of strategic honesty. The Achiever Engine can't stop producing long enough to question the trajectory.",
  },
  "The Phoenix": {
    howToKnowThisIsYou: [
      "Multiple areas of your life feel broken simultaneously and you're not sure which one to fix first",
      "You feel overwhelmed more often than not, and the overwhelm has become your baseline rather than an exception",
      "You used to be more capable than this. You can remember a version of yourself that functioned at a higher level, and the distance between then and now is painful.",
      "Getting through the day takes most of your energy. There's little left for building, planning, or connecting.",
      "You may be hiding how bad things actually are from the people around you",
      "You took this assessment and the scores confirmed what you already feared but hadn't quantified",
      "Despite all of this, you're still here. You showed up. You answered honestly. That means something.",
    ],
    howToKnowThisIsntYou: [
      "If only one arena is struggling while the others are solid, you're likely an imbalance archetype, not a Phoenix",
      "If your composite is above 5.0, the crisis isn't systemic enough for this classification",
      "If you feel frustrated but capable, that's closer to a Drifter, Seeker, or Guardian than a Phoenix",
      "If your primary emotion is boredom rather than overwhelm, look at The Drifter",
      "The Phoenix is defined by the depth and breadth of the deficit. If the struggles are localized rather than pervasive, a different archetype fits.",
    ],
    reflectionPrompts: [
      "If you could stabilize just ONE thing in your life right now, the one change that would give you the most relief and the most capacity to address everything else, what would it be? Don't overthink it. The first answer is probably right. That's your starting point.",
      "What are you carrying right now that nobody fully knows about? Not the version you share with people. The full weight of it. What would it feel like to put even part of that weight down?",
      "When did this start? Can you identify the event, the period, or the decision where things began to compound? Understanding the origin doesn't fix it, but it can help you stop blaming yourself for being in a situation that may have been triggered by something outside your control.",
      "What is one thing you were doing when you were functioning at your best that you've completely stopped doing? Not a complicated system. A simple habit or practice that used to ground you. Could you restart it this week?",
      "What would you need to hear from someone who truly understood your situation? Say it to yourself right now. Write it down. You probably already know what you need. You just need permission to start.",
    ],
    relationshipToOtherArchetypes:
      "The Phoenix is the crisis state that any other archetype can fall into when enough things break simultaneously. It's not a personality type. It's a situational reality. The most common paths INTO the Phoenix are from The Performer (burnout collapses everything), The Ghost (isolation compounds into emotional crisis), and The Engine (misalignment produces a crisis of meaning). The most common paths OUT of the Phoenix are to The Guardian (relationships stabilize first), The Seeker (self-awareness rebuilds first), or The Drifter (everything stabilizes to a functional-but-flat baseline). Going from Phoenix directly to Architect or The Journeyman in a single assessment period would be extraordinary and would represent one of the most significant transformations a person can make.",
    commonDrivers:
      "The Phoenix often shows no driver because the crisis is too broad for any single driver pattern to emerge clearly. When a driver is detected, it's usually the pattern that CAUSED the collapse rather than the current state: The Achiever's Trap (burned out from unsustainable output), The Escape Artist (whatever was being avoided finally caught up), or The Martyr Complex (gave everything away until there was nothing left). Identifying the driver that preceded the Phoenix state is valuable for coaching because it reveals what not to rebuild when the recovery begins.",
  },
};
```

## 5) Driver Assignment Logic + Driver Interpretation Copy
Driver copy depends on algorithmic gate + scoring. If a dysfunction driver wins threshold/margin rules, user sees that driver content. If not, fallback can resolve to Aligned Momentum or No Clear Driver Identified text.

### Driver Logic + Primary Driver Content (`lib/vapi/drivers.ts`)

```text
import { DOMAINS } from "./quiz-data";

export type VapiDriverName =
  | "The Achiever's Trap"
  | "The Escape Artist"
  | "The Pleaser's Bind"
  | "The Imposter Loop"
  | "The Perfectionist's Prison"
  | "The Protector"
  | "The Martyr Complex"
  | "The Fog"
  | "The Scattered Mind"
  | "The Builder's Gap";

export const ALIGNED_MOMENTUM_NAME = "Aligned Momentum" as const;

export type VapiAssignedDriverName =
  | VapiDriverName
  | typeof ALIGNED_MOMENTUM_NAME;

export type VapiDriverScores = Record<VapiDriverName, number>;
export type VapiDriverGates = Record<VapiDriverName, boolean>;
export type VapiDriverFallbackType = "none" | "aligned_momentum" | "standard";
export type VapiDriverState =
  | "dysfunction_driver"
  | "aligned_momentum"
  | "no_driver";

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

export type VapiAlignedMomentumContent = {
  name: typeof ALIGNED_MOMENTUM_NAME;
  tagline: string;
  colorAccent: string;
  coreState: string;
  description: string;
  howThisShowsUp: string;
  whatThisMakesPossible: string;
  howToProtectIt: string;
};

export type VapiDriverEvaluation = {
  assignedDriver: VapiAssignedDriverName | null;
  secondaryDriver: VapiDriverName | null;
  driverScores: VapiDriverScores;
  driverGates: VapiDriverGates;
  topDriverScore: number;
  secondDriverScore: number;
  secondaryDriverScore: number | null;
  primaryToSecondaryMargin: number;
  driverState: VapiDriverState;
  driverFallbackType: VapiDriverFallbackType;
  /** True when primary + secondary both scored ≥ threshold and margin &lt; MIN_MARGIN (co-equal patterns). */
  driversAreCoEqual: boolean;
};

export const DRIVER_THRESHOLD = 6;
export const DRIVER_MIN_MARGIN = 2;
const DRIVER_SECONDARY_THRESHOLD = 4;

export const DRIVER_TIEBREAK_PRIORITY: VapiDriverName[] = [
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
      "Part of you suspects that your success is borrowed time. That the business works despite you, not because of you. That if people saw the real picture, the doubt, the chaos, the gaps, they'd lose confidence. So you keep the mask tight. But there's another layer: you may also feel that the business itself isn't a true expression of who you are. It's functional but it doesn't feel like yours. The model works but it doesn't match your depth, your values, or the unique way you see the world. So you're caught between two forces: the fear that you're not enough for what you're building, and the suspicion that what you're building isn't enough for who you are. Your Ecology score is low because at some level you know the model isn't right. Your Relationship to Self is strained because you can't trust your own judgment when part of you is always questioning whether you belong in the room you built.",
    mechanism:
      "Low Ecology paired with low Relationship to Self. EC6 reverse-scored confirms: you agreed you suspect you're building something that looks impressive but would trap you if it scaled. RS is low because imposter patterns erode self-trust. The broadened signal also checks for high Inner Alignment importance paired with low Ecology, which captures the variant where someone deeply values authenticity but feels their business doesn't reflect it. This 'inauthenticity' variant is as damaging as the classic 'not enough' variant because both create internal resistance to growth.",
    whatItCosts:
      "You're building on a foundation of self-doubt. Every win feels temporary. Every compliment feels unearned. You can't fully invest in scaling because part of you doesn't believe you deserve what's on the other side. The self-sabotage isn't random. It's your system protecting you from the exposure that success would bring.",
    theWayOut:
      "The exit is separating your worth from your performance and building a business you'd be proud to be seen inside of. We'll trace the imposter belief to its origin, dismantle the false narrative that you're not enough, and redesign the parts of your business that don't actually fit you so the model becomes something you trust. When the destination feels safe, the sabotage stops.",
    programPhase:
      "Phase 2: Strategic Clarity into Phase 3: Internal Alignment. Redesign what you're building first so it's genuinely yours, then address the belief that you don't deserve it.",
    maxPossible: 14,
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
  "The Scattered Mind": {
    name: "The Scattered Mind",
    coreBelief: "I'll be able to focus when the conditions are right.",
    coreFear:
      "That the conditions will never be right. That this is just how your mind works. That the gap between what you know you're capable of and what you actually produce will never close.",
    tagline:
      "You know exactly what matters. Your attention just won't stay there.",
    description:
      "Your mind moves. It always has. When you sit down to do something that matters, your attention holds for a few minutes and then splinters. You find yourself somewhere else, another tab, another thought, another task, without remembering the decision to leave. It's not that you don't care. You care deeply. It's not that you're avoiding something painful. Your emotional life is stable. It's that sustained attention doesn't come naturally, and the world is full of things that pull you away. So you adapt. You work in bursts. You rely on deadlines and pressure to create focus. You start things with clarity and watch them fragment before completion. You build workarounds instead of systems because systems require the sustained effort your mind resists. And underneath it all, there's a quiet exhaustion from fighting your own attention every single day.",
    mechanism:
      "Attention & Focus is compromised while Mental/Emotional Health is functional or high, which is the key differentiator from The Escape Artist. Your scores show fragmentation without emotional avoidance: low AF paired with weak Execution and Operational Health, plus high Inner Alignment or high AF importance. You know what matters. You care about it. Your attention just won't stay with it long enough to build momentum.",
    whatItCosts:
      "The things that matter most to you require sustained effort to build. Relationships deepen through presence. Businesses grow through consistent execution. Skills develop through deliberate practice. But sustained effort is exactly what your scattered attention makes difficult. So you stay in motion without accumulating momentum. You have insights that never become implementations. You have starts that never become finishes. The people around you see someone capable and aligned who somehow doesn't produce at the level they expect. And you see the same thing, which is the hardest part, knowing that the gap isn't about clarity or motivation or values. It's about a mind that won't stay where you point it.",
    theWayOut:
      "The Scattered Mind isn't addressed through more insight about yourself. You already understand the pattern. It's addressed through structure that works with your mind instead of against it. That means environment design: removing the things that pull your attention, creating physical spaces that support focus, building friction between you and distraction. It means rhythm design: working in shorter blocks with built-in breaks, using body-doubling or accountability to create external structure, protecting your highest-attention hours for your most important work. It means system design: externalizing your memory and commitments so your mind doesn't have to hold everything, simplifying your task landscape so there are fewer places for attention to scatter. And for some people, it means exploring whether ADHD is part of the picture, not as a label but as a door to strategies and support designed specifically for minds that work this way. The goal isn't to become someone with effortless focus. The goal is to build a life where your particular mind can do its best work.",
    programPhase:
      "Phase 1 (Physical + Environmental Foundation) and Phase 2 (Strategic Clarity + Structure). The Scattered Mind is addressed through external scaffolding: environment design, rhythm and routine, systems that reduce cognitive load. Phase 3 work may surface secondary patterns once attention is stabilized, but the primary intervention is structural.",
    maxPossible: 10,
  },
  "The Builder's Gap": {
    name: "The Builder's Gap",
    coreBelief:
      "Caring about people and doing good work should be enough. I shouldn't have to become a 'business person' to make this work.",
    coreFear:
      "That building real business infrastructure will force me to become someone cold, transactional, or inauthentic.",
    tagline:
      "You have everything except the machine. The foundation is strong but the business hasn't been built to match it.",
    description:
      "You're not broken. You're not in crisis. You're not avoiding something painful or running from something scary. You're genuinely strong in the areas that most founders neglect: your health, your emotional regulation, your relationships, your sense of self. The people in your life feel your presence. Your values are clear. Your business model even makes sense on paper. But the business itself isn't built. Your strategy shifts more than it should. Your execution is inconsistent. Your operations are fragile or nonexistent. You know what you want to build and why it matters. You just haven't built the infrastructure to make it real. The gap isn't internal. It's structural. But here's the part that makes this a driver and not just a skills gap: there's a reason you haven't built it, and that reason is usually a quiet belief that building a real business machine means becoming someone you don't want to be.",
    mechanism:
      "This driver produces a distinctive signature: strong Self and Relationships arena scores paired with a Business arena that's clearly the weakest. Multiple Business domains sit below 5.5 while personal and relational domains are Functional or Dialed. The telling signal is often a healthy Ecology score (6.0+), which means the business model itself is aligned with who you are. The problem isn't what you're building. It's that you haven't built the systems, strategy, and execution rhythms to bring it to life. Importance ratings typically confirm the pattern: you rate Business domains as high priority because you know they need work, but the work keeps not getting done.",
    whatItCosts:
      "Your gifts are stranded. The relationships you've built, the trust people have in you, the aligned model you've designed, none of it reaches its potential because the business infrastructure doesn't exist to deliver it at scale. You're probably underearning relative to your capability. You may be over-delivering to a small number of people because you don't have the systems to serve more. The people who need what you offer can't find you, buy from you, or experience your full value because the machine between your gift and your market hasn't been built. Every month this continues, the gap between your potential impact and your actual impact widens.",
    theWayOut:
      "The exit is accepting that building business infrastructure is not a betrayal of who you are. It's the vehicle that lets who you are reach the people who need it. Systems aren't cold. They're how you scale your warmth. Strategy isn't corporate. It's how you focus your energy. Operations aren't soulless. They're how you stop being the bottleneck so your actual gift can breathe. We'll identify the specific belief that's kept you from building the machine, reframe business-building as an act of service rather than a compromise of values, and then install the strategy, execution rhythm, and operational basics that translate your strengths into a functioning business.",
    programPhase:
      "Phase 2: Strategic Clarity into Phase 4: Aligned Action. The Builder's Gap needs strategic clarity first (what exactly am I building and in what order) and then an operating system to execute it. Phase 3 may be lighter than other drivers unless the belief that 'business = inauthentic' runs deep.",
    maxPossible: 14,
  },
};

export const ALIGNED_MOMENTUM_CONTENT: VapiAlignedMomentumContent = {
  name: ALIGNED_MOMENTUM_NAME,
  tagline:
    "Your internal operating system is working with your goals, not against them.",
  colorAccent: "#B8960C",
  coreState:
    "Your beliefs support your ambition. Your habits serve your vision. Your nervous system trusts the direction you're heading.",
  description:
    "Most founders who take this assessment discover an internal pattern working against them: a belief, a fear, or a coping strategy that silently sabotages their results across multiple domains. You don't have one. That's not a neutral finding. It's a significant one. Your internal operating system is aligned with what you're building. Your beliefs support your ambition rather than undermining it. Your habits serve your vision rather than contradicting it. Your nervous system trusts the direction you're heading rather than pumping the brakes. This alignment is what allows you to perform at a high level across multiple arenas simultaneously without the burnout, self-sabotage, or internal warfare that most founders experience. It's not the absence of a problem. It's the presence of something most people spend years trying to build.",
  howThisShowsUp:
    "Your scores are strong across the board with no more than one isolated gap. Your importance ratings and your actual performance are congruent, meaning you're investing where you say it matters. Your reverse-scored items don't reveal hidden contradictions between what you believe and how you behave. The typical signatures of dysfunction drivers, identity fused with output, chronic avoidance, people-pleasing, perfectionist paralysis, ecological misalignment, are absent or minimal. Your system is clean.",
  whatThisMakesPossible:
    "When your internal operating system isn't fighting your goals, everything compounds in the right direction. Your health supports your focus. Your focus supports your execution. Your execution supports your business. Your business supports your relationships. Your relationships support your resilience. And your resilience supports your health. This is the reinforcing cycle that most founders never experience because a dysfunction driver somewhere in the chain breaks the loop. Your loop is intact. That's your greatest strategic advantage and it's invisible to everyone competing with you who's still fighting themselves.",
  howToProtectIt:
    "Aligned Momentum is not permanent. It's maintained. The practices, boundaries, relationships, and self-awareness that produced this state require ongoing investment. The most common threats are complacency, assuming the work is done, lifestyle creep, gradually adding demands that erode your margins, and unprocessed change, a life transition that shifts your internal landscape without you noticing. Protect this state by continuing to audit honestly, retaking this assessment regularly, and treating your alignment as an asset that requires maintenance rather than an achievement you can file away.",
};

export const DRIVER_STANDARD_FALLBACK = {
  heading: "No Clear Driver Identified",
  text: "Your score pattern doesn't map strongly to a single internal driver. This can mean one of several things: your pattern is genuinely complex and influenced by multiple drivers rather than one dominant one, you're in a transitional period where old patterns are shifting, or the behavioral data from the assessment needs to be supplemented with deeper reflection. This is not a problem. It simply means the quantitative data alone can't pinpoint the root cause with enough confidence. Your detailed domain scores, archetype, and priority matrix still provide a clear picture of where to focus. If you're working with a coach, your intake reflection and first session will surface what the numbers alone couldn't. You can also explore all 10 driver patterns in the Driver Library to see if one resonates through self-reflection rather than algorithmic detection.",
};

export const DRIVER_FALLBACK = DRIVER_STANDARD_FALLBACK;

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
    "The Scattered Mind": 0,
    "The Builder's Gap": 0,
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
    "The Scattered Mind": false,
    "The Builder's Gap": false,
  };
}

export function getDriverFallbackContent(
  fallbackType: VapiDriverFallbackType
) {
  return fallbackType === "standard"
    ? DRIVER_STANDARD_FALLBACK
    : {
        heading: ALIGNED_MOMENTUM_CONTENT.name,
        text: ALIGNED_MOMENTUM_CONTENT.description,
      };
}

export function getDriverFallbackType(params: {
  domainScores: Record<string, number>;
  compositeScore?: number | null;
  assignedDriver?: VapiAssignedDriverName | null;
  driverState?: VapiDriverState | null;
}): VapiDriverFallbackType {
  if (params.driverState === "dysfunction_driver") {
    return "none";
  }

  if (
    params.driverState === "aligned_momentum" ||
    params.assignedDriver === ALIGNED_MOMENTUM_NAME
  ) {
    return "aligned_momentum";
  }

  if (params.assignedDriver) {
    return "none";
  }

  const normalizedCompositeScore = getCompositeScore(
    params.domainScores,
    params.compositeScore
  );
  const domainsBelowThreshold = ALL_DOMAIN_CODES.filter(
    (code) => getNumericValue(params.domainScores[code], 0) < 5.5
  ).length;

  if (normalizedCompositeScore >= 7.0 && domainsBelowThreshold <= 1) {
    return "aligned_momentum";
  }

  return "standard";
}

export function getDriverFallbackLabel(
  fallbackType: VapiDriverFallbackType
) {
  if (fallbackType === "aligned_momentum") return "Aligned Momentum";
  if (fallbackType === "standard") return "Standard";
  return "N/A (driver was assigned)";
}

export function isDysfunctionDriverName(value: unknown): value is VapiDriverName {
  return typeof value === "string" && value in DRIVER_CONTENT;
}

export function getDriverState(params: {
  assignedDriver?: VapiAssignedDriverName | null;
  driverFallbackType?: VapiDriverFallbackType | null;
}): VapiDriverState {
  if (
    params.assignedDriver === ALIGNED_MOMENTUM_NAME ||
    params.driverFallbackType === "aligned_momentum"
  ) {
    return "aligned_momentum";
  }

  if (isDysfunctionDriverName(params.assignedDriver)) {
    return "dysfunction_driver";
  }

  return "no_driver";
}

function getNumericValue(value: unknown, fallback: number) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function countTrue(values: boolean[]) {
  return values.filter(Boolean).length;
}

function getImportanceValue(
  importanceRatings: Record<string, number>,
  code: string
) {
  const value = importanceRatings[code];
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function hasCompleteImportanceRatings(
  importanceRatings: Record<string, number>,
  domainCodes: string[]
) {
  return domainCodes.every((code) => getImportanceValue(importanceRatings, code) !== null);
}

function importanceAtLeast(
  importanceRatings: Record<string, number>,
  code: string,
  threshold: number
) {
  const value = getImportanceValue(importanceRatings, code);
  return value !== null && value >= threshold;
}

function importanceAtMost(
  importanceRatings: Record<string, number>,
  code: string,
  threshold: number
) {
  const value = getImportanceValue(importanceRatings, code);
  return value !== null && value <= threshold;
}

function getAverageImportance(
  importanceRatings: Record<string, number>,
  domainCodes: string[]
) {
  if (!hasCompleteImportanceRatings(importanceRatings, domainCodes)) {
    return 5;
  }
  const values = domainCodes.map((code) => getImportanceValue(importanceRatings, code) ?? 5);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function getImportanceStdDev(importanceRatings: Record<string, number>) {
  if (!hasCompleteImportanceRatings(importanceRatings, ALL_DOMAIN_CODES)) {
    return Number.POSITIVE_INFINITY;
  }
  const values = ALL_DOMAIN_CODES.map(
    (code) => getImportanceValue(importanceRatings, code) ?? 5
  );
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function noSingleImportanceAboveOrEqualEight(importanceRatings: Record<string, number>) {
  if (!hasCompleteImportanceRatings(importanceRatings, ALL_DOMAIN_CODES)) {
    return false;
  }
  return ALL_DOMAIN_CODES.every(
    (code) => (getImportanceValue(importanceRatings, code) ?? 0) < 8
  );
}

function noSingleImportanceAboveOrEqualSeven(importanceRatings: Record<string, number>) {
  if (!hasCompleteImportanceRatings(importanceRatings, ALL_DOMAIN_CODES)) {
    return false;
  }
  return ALL_DOMAIN_CODES.every(
    (code) => (getImportanceValue(importanceRatings, code) ?? 0) < 7
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
    if (importanceAtMost(importanceRatings, "PH", 5)) driverScores["The Achiever's Trap"] += 1;
    if (importanceAtMost(importanceRatings, "ME", 5)) driverScores["The Achiever's Trap"] += 1;
    if (importanceAtMost(importanceRatings, "IA", 5)) driverScores["The Achiever's Trap"] += 1;
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
    if (importanceAtMost(importanceRatings, "CO", 5)) driverScores["The Protector"] += 1;
    if (importanceAtMost(importanceRatings, "RS", 5)) driverScores["The Protector"] += 1;
    if (importanceAtLeast(importanceRatings, "OH", 7)) driverScores["The Protector"] += 1;
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
    if (importanceAtLeast(importanceRatings, "RS", 7)) driverScores["The Pleaser's Bind"] += 2;
    if (
      importanceAtLeast(importanceRatings, "FA", 7) ||
      importanceAtLeast(importanceRatings, "CO", 7)
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
    if (importanceAtMost(importanceRatings, "ME", 5)) driverScores["The Escape Artist"] += 1;
    if (importanceAtMost(importanceRatings, "IA", 5)) driverScores["The Escape Artist"] += 1;
    if (importanceAtMost(importanceRatings, "FA", 5)) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(scoredResponses.FA6, 7) <= 3) driverScores["The Escape Artist"] += 2;
    if (getNumericValue(scoredResponses.ME6, 7) <= 3) driverScores["The Escape Artist"] += 1;
    if (getNumericValue(domainScores.PH, 0) < 5.0) driverScores["The Escape Artist"] += 1;
    if (isArenaHighest(normalizedArenaScores, "business")) driverScores["The Escape Artist"] += 1;
    if (
      countTrue([
        importanceAtMost(importanceRatings, "ME", 5),
        importanceAtMost(importanceRatings, "IA", 5),
        importanceAtMost(importanceRatings, "FA", 5),
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
    if (importanceAtLeast(importanceRatings, "EX", 7)) {
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
    (
      getNumericValue(scoredResponses.EC6, 7) <= 3 ||
      getNumericValue(domainScores.RS, 0) < 5.0
    );
  if (driverGates["The Imposter Loop"]) {
    if (getNumericValue(scoredResponses.EC6, 7) <= 3) driverScores["The Imposter Loop"] += 2;
    if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Imposter Loop"] += 2;
    if (
      importanceAtLeast(importanceRatings, "IA", 7) &&
      getNumericValue(domainScores.EC, 0) < 5.0
    ) {
      driverScores["The Imposter Loop"] += 2;
    }
    if (getNumericValue(domainScores.EX, 0) >= 5.0) driverScores["The Imposter Loop"] += 1;
    if (importanceAtMost(importanceRatings, "EC", 5)) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(scoredResponses.RS6, 7) <= 3) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(domainScores.OH, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
    if (getNumericValue(scoredResponses.EC5, 7) <= 4) driverScores["The Imposter Loop"] += 2;
    if (
      getNumericValue(domainScores.ME, 0) < 5.5 &&
      importanceAtLeast(importanceRatings, "IA", 7)
    ) {
      driverScores["The Imposter Loop"] += 1;
    }
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
    if (importanceAtLeast(importanceRatings, "WI", 7)) driverScores["The Martyr Complex"] += 1;
    if (importanceAtLeast(importanceRatings, "FA", 7)) driverScores["The Martyr Complex"] += 1;
    if (importanceAtMost(importanceRatings, "PH", 5)) driverScores["The Martyr Complex"] += 1;
    if (importanceAtMost(importanceRatings, "IA", 5)) driverScores["The Martyr Complex"] += 1;
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
    if (importanceAtMost(importanceRatings, "VS", 5)) driverScores["The Fog"] += 1;
    if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Fog"] += 1;
    if (noSingleImportanceAboveOrEqualSeven(importanceRatings)) driverScores["The Fog"] += 2;
    if (normalizedCompositeScore >= 4.0 && normalizedCompositeScore <= 6.5) {
      driverScores["The Fog"] += 1;
    }
  }

  driverGates["The Scattered Mind"] =
    getNumericValue(domainScores.AF, 0) <= 5.0 &&
    getNumericValue(domainScores.ME, 0) >= 6.0;
  if (driverGates["The Scattered Mind"]) {
    if (getNumericValue(domainScores.AF, 0) <= 3.0) {
      driverScores["The Scattered Mind"] += 2;
    }
    if (getNumericValue(domainScores.EX, 0) <= 5.0) {
      driverScores["The Scattered Mind"] += 2;
    }
    if (getNumericValue(domainScores.OH, 0) <= 5.0) {
      driverScores["The Scattered Mind"] += 2;
    }
    if (getNumericValue(domainScores.IA, 0) >= 7.0) {
      driverScores["The Scattered Mind"] += 2;
    }
    if (
      importanceAtLeast(importanceRatings, "AF", 5) &&
      getNumericValue(domainScores.AF, 0) <= 4.0
    ) {
      driverScores["The Scattered Mind"] += 2;
    }
  }

  const builderWeakBusinessDomains = BUSINESS_DOMAIN_CODES.map(
    (code) => getNumericValue(domainScores[code], 0) < 5.5
  );
  const builderStrongPersonalRelationalDomains = [
    getNumericValue(domainScores.PH, 0) >= 6.5,
    getNumericValue(domainScores.ME, 0) >= 6.5,
    getNumericValue(domainScores.IA, 0) >= 6.5,
    getNumericValue(domainScores.RS, 0) >= 6.5,
    getNumericValue(domainScores.FA, 0) >= 6.5,
    getNumericValue(domainScores.CO, 0) >= 6.5,
  ];
  driverGates["The Builder's Gap"] =
    isArenaLowest(normalizedArenaScores, "business") &&
    (
      normalizedArenaScores.self >= 6.0 ||
      normalizedArenaScores.relationships >= 6.0
    ) &&
    countTrue(builderWeakBusinessDomains) >= 2;
  if (driverGates["The Builder's Gap"]) {
    if (
      normalizedArenaScores.self >= 6.5 ||
      normalizedArenaScores.relationships >= 6.5
    ) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (
      normalizedArenaScores.self >= 6.5 &&
      normalizedArenaScores.relationships >= 6.5
    ) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (countTrue(builderWeakBusinessDomains) >= 3) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (getNumericValue(domainScores.EC, 0) >= 6.0) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (importanceAtLeast(importanceRatings, "EX", 7)) {
      driverScores["The Builder's Gap"] += 1;
    }
    if (importanceAtLeast(importanceRatings, "VS", 7)) {
      driverScores["The Builder's Gap"] += 1;
    }
    if (importanceAtLeast(importanceRatings, "OH", 5)) {
      driverScores["The Builder's Gap"] += 1;
    }
    if (countTrue(builderStrongPersonalRelationalDomains) >= 3) {
      driverScores["The Builder's Gap"] += 2;
    }
    if (normalizedCompositeScore >= 5.5) {
      driverScores["The Builder's Gap"] += 1;
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
  const primaryToSecondaryMargin = topDriverScore - secondDriverScore;
  const clearWinnerPrimary =
    winningDriver &&
    topDriverScore >= DRIVER_THRESHOLD &&
    topDriverScore - secondDriverScore >= DRIVER_MIN_MARGIN
      ? winningDriver.driverName
      : null;
  const tieAtTopPrimary =
    !clearWinnerPrimary &&
    winningDriver &&
    runnerUp &&
    topDriverScore >= DRIVER_THRESHOLD &&
    secondDriverScore >= DRIVER_THRESHOLD &&
    primaryToSecondaryMargin < DRIVER_MIN_MARGIN
      ? winningDriver.driverName
      : null;
  const dysfunctionDriver = clearWinnerPrimary || tieAtTopPrimary || null;
  const secondaryDriver =
    dysfunctionDriver &&
    runnerUp &&
    secondDriverScore >= DRIVER_SECONDARY_THRESHOLD &&
    driverGates[runnerUp.driverName] &&
    primaryToSecondaryMargin <= 3
      ? runnerUp.driverName
      : null;
  const secondaryDriverScore = secondaryDriver ? secondDriverScore : null;
  const driversAreCoEqual = Boolean(
    dysfunctionDriver &&
      secondaryDriver &&
      topDriverScore >= DRIVER_THRESHOLD &&
      secondDriverScore >= DRIVER_THRESHOLD &&
      primaryToSecondaryMargin < DRIVER_MIN_MARGIN
  );
  const inferredFallbackType = getDriverFallbackType({
    domainScores,
    compositeScore: normalizedCompositeScore,
    assignedDriver: dysfunctionDriver,
  });
  const driverState =
    dysfunctionDriver
      ? "dysfunction_driver"
      : inferredFallbackType === "aligned_momentum"
        ? "aligned_momentum"
        : "no_driver";
  const assignedDriver =
    dysfunctionDriver ??
    (driverState === "aligned_momentum" ? ALIGNED_MOMENTUM_NAME : null);
  const driverFallbackType =
    driverState === "dysfunction_driver" ? "none" : inferredFallbackType;

  return {
    assignedDriver,
    secondaryDriver,
    driverScores,
    driverGates,
    topDriverScore,
    secondDriverScore,
    secondaryDriverScore,
    primaryToSecondaryMargin,
    driverState,
    driverFallbackType,
    driversAreCoEqual,
  };
}
```


### Driver Library Long-Form Copy (`lib/vapi/driver-library.ts`)

```text
import {
  ALIGNED_MOMENTUM_NAME,
  type VapiDriverName,
} from "./drivers";

export const DRIVER_ORDER: VapiDriverName[] = [
  "The Achiever's Trap",
  "The Protector",
  "The Pleaser's Bind",
  "The Escape Artist",
  "The Perfectionist's Prison",
  "The Imposter Loop",
  "The Martyr Complex",
  "The Fog",
  "The Scattered Mind",
  "The Builder's Gap",
];

export const DRIVER_LIBRARY_TITLE = "The 10 Driver Patterns + Aligned Momentum";
export const DRIVER_LIBRARY_SUBTITLE =
  "Underneath every score pattern is an internal operating system. For most founders, that system includes a belief, a fear, and a coping strategy that silently works against their goals. These are the 10 most common dysfunction drivers. But when no dysfunction driver is present and your scores reflect broad, genuine strength, something different appears: Aligned Momentum. That's the state every driver pattern is building toward.";
export const DRIVER_LIBRARY_EMPTY_RESULTS_BANNER =
  "Take the VAPI Assessment to discover which of these patterns is most likely driving your results.";
export const DRIVER_LIBRARY_FOOTER_HEADING =
  "Ready to Address What's Driving Your Pattern?";
export const DRIVER_LIBRARY_FOOTER_TEXT =
  "Understanding your driver is the first step. Changing it requires structured support. The Aligned Power Program is a 12-month coaching partnership designed to identify, address, and rewire the internal patterns keeping you stuck.";
export const DRIVER_LIBRARY_DIVIDER_HEADING = "The 10 Dysfunction Drivers";
export const DRIVER_LIBRARY_DIVIDER_TEXT =
  "These are the internal patterns that silently work against founders. Each one represents a belief, a fear, and a coping strategy that produces predictable score signatures. Aligned Momentum is what becomes possible when these patterns are identified and addressed.";

export type DriverLibraryEntry = {
  howToKnowThisIsYou: string[];
  howToKnowThisIsntYou: string[];
  reflectionPrompts: string[];
  relationshipToOtherDrivers: string;
  commonArchetypes?: string;
};

export const ALIGNED_MOMENTUM_LIBRARY_CONTENT: DriverLibraryEntry = {
  howToKnowThisIsYou: [
    "Your VAPI composite is 7.0 or above with no more than one domain significantly below the rest",
    "You don't recognize yourself in any of the 10 dysfunction drivers, or if you see traces, they feel like old patterns rather than current ones",
    "Your business results and your personal wellbeing don't feel like they're competing with each other",
    "You can sustain your current pace without running on adrenaline, guilt, or fear",
    "The way you work matches who you actually are. You're not performing a version of success that belongs to someone else.",
    "You have genuine relationships where you're known, not just respected",
    "Your internal voice is mostly honest and supportive rather than critical, fearful, or avoidant",
    "When stress comes, you recover. You don't spiral, shut down, or burn it all to the ground.",
  ],
  howToKnowThisIsntYou: [
    "If reading the dysfunction drivers produced a strong \"that's me\" reaction to any of them, trust that reaction over the algorithm",
    "If your high scores are maintained through unsustainable effort, willpower, or performance rather than genuine alignment, the momentum isn't real",
    "If your life looks good on paper but doesn't feel good in your body, something the assessment didn't fully capture may be present",
    "If you're suppressing or numbing to maintain your scores rather than genuinely thriving, explore The Escape Artist and The Achiever's Trap more carefully",
    "Aligned Momentum should feel like relief when you read it, not like a performance you need to maintain",
  ],
  reflectionPrompts: [
    "What specific practices, boundaries, or decisions are most responsible for the alignment you've built? Name them concretely. These are the things you cannot afford to stop doing.",
    "When was the last time your alignment was tested by a major stressor, a business setback, a health scare, a relationship conflict? How did you respond? Did the system hold, or did you see cracks? What did you learn about where your alignment is strongest and where it's most fragile?",
    "If you could give your past self, the version of you that was operating from one of the dysfunction drivers, one piece of advice about what actually produced this state, what would it be? The answer reveals what you've learned that others haven't yet.",
    "What is the next edge for you? Aligned Momentum is not a finish line. Where do you feel the pull toward growth? What domain or arena, if deepened further, would expand what's possible for you?",
    "Who in your life needs what you've built? Not your business output. Your operating system. The way you've learned to align your internal world with your external results. How could you share that with others in a way that creates impact beyond your own life?",
  ],
  relationshipToOtherDrivers:
    "Aligned Momentum is not the opposite of any single driver. It's what emerges when no driver is dominant. Most founders who reach this state did so by identifying and addressing a specific dysfunction driver earlier in their journey. The Achiever learned to decouple identity from output. The Pleaser learned to hold boundaries. The Perfectionist learned to ship imperfectly. The Escape Artist turned around and faced what they were running from. Aligned Momentum is the result of that work, not the absence of having needed it. If you're here, you likely remember what it felt like to operate from a dysfunction pattern. That memory is valuable. It's what makes you capable of helping others who are still in it.",
};

export type DriverLibrarySectionName = VapiDriverName | typeof ALIGNED_MOMENTUM_NAME;

export const DRIVER_LIBRARY_CONTENT: Record<VapiDriverName, DriverLibraryEntry> = {
  "The Achiever's Trap": {
    howToKnowThisIsYou: [
      "You feel a physical restlessness or anxiety when you're not being productive",
      "You calculate your value to others based on what you've accomplished recently",
      "You can't take a full day off without guilt, justification, or sneaking in work",
      "You feel a crash in mood or self-worth after completing a big project, because the next one hasn't started yet",
      "You describe rest as \"earned\" and genuinely believe you haven't earned it most of the time",
      "Compliments about who you are (not what you've done) make you uncomfortable or feel undeserved",
      "When someone asks \"how are you?\" you instinctively answer with what you've been doing, not how you actually feel",
    ],
    howToKnowThisIsntYou: [
      "You can take a weekend completely off and feel recharged, not guilty",
      "You genuinely enjoy unstructured time and don't fill it with productivity",
      "Your self-worth stays stable during slow business periods",
      "You can celebrate a win without immediately pivoting to the next goal",
      "You don't feel threatened by the idea of producing less",
      "If this pattern sounds foreign or extreme to you, it's probably not your primary driver",
    ],
    reflectionPrompts: [
      "When was the last time you felt genuinely valuable while producing absolutely nothing? If you can't remember, what does that tell you?",
      "If you achieved every business goal you have and then stopped working for 6 months, how would you describe yourself to someone you met at a dinner party? What's left of your identity without the output?",
      "Who in your early life made you feel that love, attention, or approval was conditional on performance? What did you have to DO to earn their recognition?",
      "What's the longest you've gone without working in the past year? What happened internally during that time? What feelings surfaced that you normally outrun with activity?",
      "If your closest friend operated the way you operate and sacrificed what you sacrifice for productivity, what would you honestly say to them?",
    ],
    relationshipToOtherDrivers:
      "The Achiever's Trap is most commonly confused with The Escape Artist. Both produce high execution and neglected personal domains. The difference is the motivation underneath. The Achiever's Trap works because producing IS the reward. The identity is fused with output. The Escape Artist works because stopping is the threat. The activity is a shield against something they don't want to feel. Ask yourself: if you could guarantee that everything in your personal life was perfectly fine, would you still feel compelled to work at this intensity? If yes, that's The Achiever's Trap. If no, and the intensity is actually about avoiding what's waiting when you stop, that's The Escape Artist. These two drivers frequently show up together as primary and secondary.",
  },
  "The Protector": {
    howToKnowThisIsYou: [
      "You have strong opinions about how things should be done and struggle to let others do things differently",
      "You'd rather do something yourself than risk someone else doing it wrong",
      "The idea of being emotionally vulnerable with a friend, partner, or coach makes you instinctively resist",
      "You trust systems, processes, and data more than you trust people's judgment, including your own intuition",
      "You rarely ask for help and feel uncomfortable when someone offers it unprompted",
      "Your closest relationships are the ones where you're in a position of authority, guidance, or control",
      "If your business systems broke tomorrow, you would feel a level of panic disproportionate to the actual financial impact",
    ],
    howToKnowThisIsntYou: [
      "You delegate easily and trust your team to handle things their way",
      "You're comfortable not knowing the outcome and can tolerate uncertainty",
      "You have multiple relationships where you're fully vulnerable and known",
      "You ask for help regularly without shame or discomfort",
      "You can name several times recently where you let someone else take the lead and felt fine about it",
      "Control isn't a word people who know you well would use to describe you",
    ],
    reflectionPrompts: [
      "What's the worst thing that could happen if you let someone else handle the most important thing in your business for a full week without checking in? Describe the scenario in detail. Now ask yourself: how likely is that scenario, really?",
      "When was the first time in your life that depending on someone led to disappointment or pain? How old were you? What did you decide about other people in that moment?",
      "Who in your life right now knows the full truth about your fears, doubts, and struggles? If the answer is nobody, what are you protecting by keeping that wall up?",
      "If vulnerability and control lived on a spectrum, where would you place yourself? Now where would the people closest to you place you? What's the gap between those two answers?",
      "What would it feel like to need someone and let them know you need them? Not strategically. Genuinely. What emotion comes up when you imagine that?",
    ],
    relationshipToOtherDrivers:
      "The Protector is most commonly confused with The Achiever's Trap. Both produce strong business execution. The difference is what's driving the discipline. The Achiever's Trap works because output is identity. The Protector works because structure is safety. An Achiever is chasing validation. A Protector is preventing chaos. Ask yourself: if you could guarantee that nothing would fall apart, that everything was secure and stable without your oversight, would you relax? If yes, that's The Protector. If you'd immediately look for the next thing to achieve, that's The Achiever's Trap. The Protector also overlaps with The Escape Artist in that both avoid emotional engagement, but the Protector does it through control while the Escape Artist does it through activity.",
  },
  "The Pleaser's Bind": {
    howToKnowThisIsYou: [
      "You know what everyone around you needs but struggle to articulate what YOU need",
      "You say yes to requests before you've even checked whether you have the capacity",
      "You feel a wave of guilt or anxiety when you imagine saying no to someone who's counting on you",
      "You've kept clients, team members, or relationships past their expiration date because ending it would hurt them",
      "You measure how good a day was by how helpful you were to others, not by what you accomplished for yourself",
      "You notice that your schedule fills with other people's priorities and your own work happens in the margins",
      "When someone is disappointed in you, it doesn't just feel bad. It feels like a threat to your safety or belonging",
    ],
    howToKnowThisIsntYou: [
      "You say no frequently and without residual guilt",
      "Your priorities consistently come before other people's requests",
      "You can disappoint someone and recover quickly without replaying it",
      "Your schedule reflects YOUR goals, not a mosaic of everyone else's needs",
      "You don't track whether people are happy with you as a background process",
      "People who know you well would describe you as boundaried, not accommodating",
    ],
    reflectionPrompts: [
      "Think about the last time you said yes to something you wanted to say no to. What was the request, who made it, and what were you afraid would happen if you declined?",
      "If you stopped being helpful to everyone around you for 30 days and focused entirely on your own goals, what do you think would happen to your relationships? Now ask yourself: is that fear based on evidence or assumption?",
      "When you were growing up, what role did you play in your family? Were you the peacekeeper, the responsible one, the one who made sure everyone was okay? How is that role still running your life today?",
      "Make a list of the five things you spent the most energy on this week. How many of them were your priorities versus someone else's? What does that ratio tell you?",
      "What would it mean about you if someone you care about was disappointed in you and you didn't fix it? Sit with that. What's the belief underneath the urge to repair?",
    ],
    relationshipToOtherDrivers:
      "The Pleaser's Bind is most commonly confused with The Martyr Complex. Both involve self-sacrifice. The difference is the currency. The Pleaser sacrifices to maintain relationships and avoid rejection. The Martyr sacrifices because they believe suffering is noble or required. A Pleaser feels anxious when they stop giving. A Martyr feels guilty when they stop suffering. Ask yourself: if you could guarantee that everyone in your life would still love you even if you said no to everything for a month, would you feel relief? If yes, that's The Pleaser's Bind, because the giving is driven by fear of rejection. If the idea of a month without sacrifice makes you feel selfish or worthless rather than relieved, that's The Martyr Complex. The Pleaser's Bind also frequently pairs with The Imposter Loop as a secondary driver, because chronic people-pleasing erodes self-trust, which feeds the imposter pattern.",
  },
  "The Escape Artist": {
    howToKnowThisIsYou: [
      "You fill every quiet moment with activity, noise, content, or tasks. Silence feels uncomfortable.",
      "You've been told by a partner or family member that you're not present even when you're physically there",
      "When you have a free evening with nothing planned, you feel restless rather than relaxed",
      "You know there's something you need to deal with (a conversation, a feeling, a decision) and you keep not dealing with it",
      "Your productivity increases when your personal life gets harder, not decreases",
      "You've caught yourself scrolling, working, or starting a new project specifically to avoid thinking about something",
      "If you're honest, you can name the thing you're running from. You just don't want to stop long enough to face it.",
    ],
    howToKnowThisIsntYou: [
      "You can sit in silence comfortably for extended periods",
      "You regularly process difficult emotions through journaling, therapy, or conversation",
      "Your work output doesn't spike when your personal life gets stressful",
      "You don't use busyness as a coping mechanism",
      "You've had the hard conversations recently and you're not avoiding anything specific",
      "The idea of an unstructured weekend with nothing to do sounds appealing, not threatening",
    ],
    reflectionPrompts: [
      "If you stopped working and sat in a quiet room with no phone for two hours, what would you start thinking about? What feeling would surface first? Name it specifically.",
      "What is the conversation you most need to have that you haven't had? Who is it with and what are you afraid will happen if you have it?",
      "When did busyness first become your coping strategy? Can you trace it back to a specific period, event, or relationship where staying in motion became safer than being still?",
      "Your partner, child, or closest friend is watching you right now. They can see your schedule, your screen time, your habits. What would they say you're avoiding? Would they be right?",
      "If the thing you're running from could speak to you, what would it say? What does it need from you that you've been refusing to give?",
    ],
    relationshipToOtherDrivers:
      "The Escape Artist is most commonly confused with The Achiever's Trap. Both look identical from the outside: high output, intense pace, neglected personal life. The difference is the internal experience. The Achiever's Trap feels energized by work, at least in the moment. Work feels like home. The Escape Artist feels driven by work but not nourished by it. Work feels like running. The clearest diagnostic question is this: when you're productive, do you feel full or do you feel relieved? Full points to Achiever's Trap. Relieved (because you successfully avoided something) points to Escape Artist. The Escape Artist also frequently pairs with The Fog as a secondary driver, because constant motion prevents the stillness needed to clarify what you actually want.",
  },
  "The Perfectionist's Prison": {
    howToKnowThisIsYou: [
      "You have projects, launches, emails, or offers that have been \"almost ready\" for weeks or months",
      "You revise things past the point of meaningful improvement because releasing them feels dangerous",
      "You feel a spike of anxiety when you imagine someone judging your work, even someone whose opinion you don't respect",
      "You research, plan, and prepare extensively but the ratio of preparation to output is wildly skewed toward preparation",
      "You've turned down or delayed opportunities because you didn't feel \"ready enough\" even though others told you you were",
      "You can articulate your strategy clearly but your execution doesn't reflect that clarity",
      "The gap between what you know you should be doing and what you're actually doing is a source of genuine shame",
    ],
    howToKnowThisIsntYou: [
      "You ship regularly, even when the work isn't perfect",
      "You can tolerate negative feedback without it derailing your next effort",
      "Your preparation-to-output ratio feels healthy",
      "You don't sit on finished or near-finished work",
      "You've launched things that embarrassed you slightly and survived just fine",
      "Imperfect action feels better to you than perfect inaction",
    ],
    reflectionPrompts: [
      "Name the specific project, offer, email, or decision that's been sitting at 80-90% for the longest. What exactly are you waiting for before you release it? Is that condition real or invented?",
      "Think about the last time you were publicly judged, criticized, or embarrassed. What actually happened afterward? Did the catastrophe you feared materialize, or did life continue?",
      "Who in your early life made you feel that mistakes were dangerous? Not just disappointing, but genuinely unsafe. What happened when you got something wrong in that environment?",
      "If you could guarantee that nobody would judge your next piece of work, that it would exist in a vacuum with zero external evaluation, would you ship it? If the answer is yes, the block isn't quality. It's fear.",
      "What's the actual, measurable cost of everything you've delayed or never released in the past 12 months? Add it up. Revenue not earned, opportunities not taken, growth not captured. Is that cost higher or lower than the cost of releasing something imperfect?",
    ],
    relationshipToOtherDrivers:
      "The Perfectionist's Prison is most commonly confused with The Fog. Both produce low execution. The difference is that The Perfectionist knows exactly what to do and can't bring themselves to do it, while The Fog genuinely doesn't know what to do because they can't commit to a direction. If you have a clear strategy and a detailed plan but aren't executing it, that's The Perfectionist's Prison. If you don't have a clear strategy and your lack of execution stems from not knowing which direction to go, that's The Fog. The Perfectionist's Prison also frequently pairs with The Imposter Loop as a secondary driver, because the fear of judgment and the fear of being exposed as inadequate share the same root: a belief that your worth depends on being perceived as flawless.",
  },
  "The Imposter Loop": {
    howToKnowThisIsYou: [
      "You downplay compliments or attribute your success to luck, timing, or other people",
      "You avoid building visible systems or documentation because they'd expose how \"messy\" things really are",
      "You feel a flash of dread when you imagine your business getting significantly more attention or visibility",
      "Part of you believes that if clients saw behind the curtain, they'd leave",
      "You've stayed small, undercharged, or avoided growth opportunities because scaling felt like it would increase the odds of being \"found out\"",
      "You oscillate between feeling capable and feeling like a fraud, sometimes within the same day",
      "You feel like your business works despite you rather than because of you",
      "The way you run your business doesn't match who you actually are, but changing it would mean admitting the current version isn't authentic",
    ],
    howToKnowThisIsntYou: [
      "You genuinely own your results and feel that your success is earned",
      "You're comfortable with visibility and don't fear increased scrutiny",
      "You can name your strengths without qualifying them",
      "Your business model reflects who you actually are and how you want to work",
      "You don't avoid growth because of fear. If you avoid it, it's for strategic reasons you can clearly articulate",
      "Being \"found out\" isn't a concept that resonates with you",
    ],
    reflectionPrompts: [
      "If your most successful client or customer could see every part of your business, the backend, the real numbers, the processes, the gaps, what do you think they'd say? Now ask yourself: is that fear based on reality, or on a story you're telling yourself?",
      "When did you first start feeling like you were performing a version of yourself rather than being yourself? Was there a specific moment, environment, or relationship where the mask became necessary?",
      "What parts of your business feel authentically yours, like a genuine expression of who you are? What parts feel like a costume you put on because you thought that's what a successful business owner is supposed to look like?",
      "If you could rebuild your business from scratch with zero judgment from anyone, what would you do differently? What would you keep? The gap between those two answers reveals the size of the misalignment.",
      "Complete this sentence: \"If people really knew me, they'd know that I ___.\" Now read what you wrote. Is that actually something that would make them think less of you, or is it something that would make you more relatable?",
    ],
    relationshipToOtherDrivers:
      "The Imposter Loop has two common pairings. When paired with The Perfectionist's Prison, the combined pattern is 'I'm not enough AND nothing I produce will be good enough to prove otherwise.' The perfectionism and the impostor feeling feed each other in a loop that paralyzes action. When paired with The Pleaser's Bind, the combined pattern is 'I'm not enough AND I can only maintain my position by making everyone happy.' The people-pleasing becomes a strategy for preventing the exposure the imposter fears. The Imposter Loop is also sometimes confused with The Fog, but the distinction is clear: The Imposter Loop has a direction but doesn't trust themselves to deserve it. The Fog genuinely doesn't have a direction.",
  },
  "The Martyr Complex": {
    howToKnowThisIsYou: [
      "You feel guilty when you do something purely for your own enjoyment that doesn't benefit anyone else",
      "You describe rest as \"selfish\" or feel the need to justify it as recovery \"so I can serve better\"",
      "You take pride in how much you sacrifice and may even compare your level of sacrifice to others",
      "Your body is showing signs of neglect (exhaustion, weight changes, chronic pain, illness) but you frame it as \"the cost of doing important work\"",
      "When someone suggests you take better care of yourself, you list all the reasons you can't right now",
      "The people you serve (family, clients, community) would be uncomfortable if they knew what it was actually costing you",
      "You feel most valuable when you're giving, and most empty when you have nothing to give",
    ],
    howToKnowThisIsntYou: [
      "You invest in your own health and enjoyment without guilt",
      "You can receive help, gifts, and rest without needing to earn them",
      "You don't equate suffering with nobility or sacrifice with value",
      "Your giving has clear boundaries and doesn't come at the expense of your own wellbeing",
      "You can name recent examples of prioritizing yourself without it being connected to serving others better",
      "People who know you would not describe you as someone who runs themselves into the ground for others",
    ],
    reflectionPrompts: [
      "If you took excellent care of your body, made space for joy every week, and still served your family and community at a high level, would that feel like enough? Or does part of you believe that service without sacrifice isn't real service?",
      "Where did you learn that your needs come last? Was there a person, a family system, a faith community, or a cultural message that taught you that selflessness requires self-neglect?",
      "The people you sacrifice the most for: do they know the real cost? If they did, would they want you to continue? If the answer is no, who are you actually sacrificing for?",
      "When was the last time you did something purely for your own pleasure that had zero productive or service value? If you can't remember, or if the memory comes with guilt, that's the pattern talking.",
      "Imagine someone you deeply respect, a mentor or someone you admire, operating exactly the way you operate. Neglecting their body. Deferring their joy. Running on empty to serve others. Would you praise them for it or would you tell them to stop? Why is your answer different when it's you?",
    ],
    relationshipToOtherDrivers:
      "The Martyr Complex is most commonly confused with The Pleaser's Bind. Both involve putting others first at personal cost. The distinction is in the underlying belief. The Pleaser gives to maintain relationships and avoid rejection. If the relationship were guaranteed, they'd stop over-giving. The Martyr gives because they believe sacrifice itself is virtuous. Even if no one was watching, even if no relationship depended on it, they'd still feel compelled to put themselves last. The Pleaser's currency is approval. The Martyr's currency is suffering. The Martyr Complex can also pair with The Achiever's Trap, creating a pattern where someone works themselves to the bone serving others AND ties their identity to the output of that service.",
  },
  "The Fog": {
    howToKnowThisIsYou: [
      "When someone asks what you want, your honest answer is \"I don't know\" more often than you'd like",
      "You've started and abandoned multiple business ideas, strategies, or directions in the past few years",
      "You feel equally pulled toward many options and can't rank them",
      "Making a definitive commitment to one direction gives you a physical sensation of anxiety or constriction",
      "You consume a lot of content (podcasts, courses, books, frameworks) hoping something will finally click and give you clarity",
      "Your friends or partner have told you some version of \"just pick something\"",
      "You can see the merits in every option, which makes choosing any single one feel like losing all the others",
    ],
    howToKnowThisIsntYou: [
      "You have a clear direction and can articulate it simply",
      "You make decisions relatively quickly and don't agonize over them afterward",
      "You've been on a consistent strategic path for at least 6 months",
      "You don't feel paralyzed by options. When you struggle with execution, it's not because you don't know what to do",
      "Commitment doesn't scare you. You've committed to things recently and felt settled about it",
      "Your importance ratings on the VAPI had clear peaks and valleys, not a flat line",
    ],
    reflectionPrompts: [
      "If someone put a gun to your head and forced you to pick one business direction, one offer, one audience, and commit to it for 12 months with no option to change, what would you pick? The answer that came to mind first is probably the right one. What stopped you from choosing it already?",
      "What are you actually afraid would happen if you committed fully to one path and it turned out to be the wrong one? Describe the worst case in detail. Now ask yourself: could you survive that? Could you recover and choose again?",
      "Is there a decision in your past where you committed to something and it went badly? What happened, and what did you conclude about commitment as a result?",
      "How much money, time, and energy have you spent in the last 12 months on exploration, research, and \"figuring it out\"? What would you have built if that same investment went into executing one clear plan?",
      "Is the fog actually confusion, or is it a sophisticated way of avoiding the vulnerability of commitment? If clarity magically appeared tomorrow and you knew exactly what to do, would you actually do it? If the answer isn't an immediate yes, the problem isn't clarity. It's fear.",
    ],
    relationshipToOtherDrivers:
      "The Fog is most commonly confused with The Perfectionist's Prison. Both produce low execution. The distinction is simple: The Perfectionist has a clear plan and can't act. The Fog can't plan because they can't commit. If you know exactly what you'd do next but can't seem to do it, that's The Perfectionist's Prison. If you genuinely don't know what you'd do next because too many options feel equally valid, that's The Fog. The Fog also sometimes pairs with The Escape Artist, because constant exploration and content consumption can function as sophisticated avoidance. The person looks like they're doing important strategic work (researching, learning, considering options) when they're actually using optionality as a shield against the vulnerability of choosing.",
  },
  "The Scattered Mind": {
    howToKnowThisIsYou: [
      "You sit down to work on something important and notice, 15 minutes later, that you're somewhere else entirely without remembering the moment you left",
      "You know exactly what you should be doing. Clarity has never been your problem. Staying with it is.",
      "You've developed workarounds: waiting for deadlines, working in coffee shops, using pressure and urgency to manufacture focus",
      "Your best work happens in rare windows of unexpected concentration, and you've never figured out how to create those windows on purpose",
      "You start things with genuine intention and watch them stall before completion, not because you lost interest in the outcome but because your attention moved on",
      "You feel a persistent low-level exhaustion from managing your own mind all day",
      "People who know you would say you're smart, capable, and full of ideas but also inconsistent, hard to pin down, or \"all over the place\"",
      "You've wondered whether ADHD might be part of your experience, or you've been diagnosed and are still figuring out what that means for how you work",
    ],
    howToKnowThisIsntYou: [
      "If your attention problems come with significant anxiety, depression, or emotional dysregulation, The Escape Artist may be a better fit, your distraction might be avoidance rather than fragmentation",
      "If you can focus well when you're interested but struggle with tasks that feel meaningless or misaligned, the issue might be Inner Alignment rather than scattered attention",
      "If your execution is strong but pointed in the wrong direction, you're The Engine, not The Scattered Mind",
      "If you can sustain deep work reliably when your environment supports it, you may not have this pattern, you may just need better environment design",
      "The Scattered Mind is specifically about attention fragmentation despite alignment and emotional stability. If either of those foundations is shaky, start there first.",
    ],
    reflectionPrompts: [
      "Think about the last time you sustained focus on difficult, non-urgent work for more than 90 minutes without interruption. How long ago was it? What conditions made it possible? If you can't remember one, what does that tell you?",
      "What workarounds have you built to function despite scattered attention? Deadlines? Pressure? Body-doubling? Last-minute intensity? Make a list. These workarounds reveal how you've adapted and also what it costs you to operate this way.",
      "Describe your relationship with your physical environment when you're trying to focus. What pulls your attention? What supports it? If you were designing the perfect environment for your particular mind, what would it include? What would it exclude?",
      "What have you tried before to address this pattern? What worked temporarily? What didn't work at all? What have you never tried but always wondered about?",
      "If you could reliably convert 3 focused hours per day into your most important work, what would change in your business and life within 6 months? Be specific. This is what's at stake, not becoming a different person, but building a structure that lets your mind do what it's capable of.",
    ],
    relationshipToOtherDrivers:
      "The Scattered Mind is most often confused with The Escape Artist. Both involve difficulty sustaining focus. The key differentiator is emotional regulation. The Escape Artist uses distraction to avoid something painful, their Mental/Emotional Health score is low because the distraction is a coping mechanism. The Scattered Mind experiences fragmentation despite emotional stability, their Mental/Emotional Health score is functional or high because they're not running from anything. Their attention simply doesn't hold. The Scattered Mind can also resemble The Builder's Gap because both show strong alignment paired with weak execution. The difference is the mechanism: The Builder's Gap hasn't built business infrastructure; The Scattered Mind can't sustain focus long enough to build anything. Some founders have both patterns, in which case the assessment will show one as primary and one as secondary based on which scores higher.",
    commonArchetypes:
      "The Scattered Mind most commonly appears alongside The Seeker archetype (high self-awareness, low business output), The Guardian archetype (strong relationships, weak business), or The Drifter (everything at a moderate plateau). It rarely appears with The Performer or archetypes that require sustained high execution, the fragmented attention makes that level of output nearly impossible to maintain.",
  },
  "The Builder's Gap": {
    howToKnowThisIsYou: [
      "You genuinely care about your clients and the quality of your work but your business feels disorganized or chaotic behind the scenes",
      "You've been told you should \"systemize\" or \"get more structured\" and the advice makes you feel like people want you to become someone you're not",
      "You associate words like \"operations,\" \"funnels,\" \"KPIs,\" or \"SOPs\" with something cold or corporate that doesn't match your identity",
      "You could describe your ideal client, your values, and your purpose clearly, but you couldn't describe your business strategy in three sentences",
      "Your income fluctuates significantly month to month because you don't have predictable systems for generating and converting clients",
      "You over-deliver to a small group of people because you don't have the infrastructure to serve more",
      "You feel like you're always one good system away from everything clicking, but you never build the system",
    ],
    howToKnowThisIsntYou: [
      "You have strong business systems and your operations run without your constant involvement",
      "Your strategy is clear and you've been executing it consistently for 6+ months",
      "You don't resist the idea of business infrastructure. You've built it and it works.",
      "Your business challenges are about scaling or optimizing, not about building the basics",
      "The word \"systems\" doesn't make you feel like you'd be selling out",
      "Your business revenue is predictable within a reasonable range month to month",
    ],
    reflectionPrompts: [
      "When you imagine your business running on real systems, with a documented strategy, a predictable pipeline, standard operating procedures, and delegated tasks, what feeling comes up? If the answer is anything other than relief, what's the resistance about?",
      "Who in your life or experience made \"business\" feel like it was at odds with being a good, authentic, caring person? Where did you learn that structure and soul couldn't coexist?",
      "If you could build the business infrastructure you need while guaranteeing it wouldn't change who you are or how you show up with clients, would you build it immediately? If yes, the obstacle isn't capability. It's a belief about what building requires you to become.",
      "How much revenue did you leave on the table in the past 12 months because you didn't have the systems to capture, nurture, or convert the interest that already existed? Be specific. What could that money have funded in your life?",
      "Think about someone you admire who runs a well-structured business AND shows up with warmth, authenticity, and genuine care. They exist. What's different about them? Is it possible that the thing you're resisting is exactly what would let you serve people the way you actually want to?",
    ],
    relationshipToOtherDrivers:
      "The Builder's Gap is most commonly confused with The Fog. Both produce weak Business scores. The critical difference is that The Fog can't choose a direction because commitment feels dangerous. The Builder's Gap often HAS a direction (their Ecology score is usually healthy, meaning the model fits) but hasn't built the infrastructure to execute it. The Fog is paralyzed by optionality. The Builder's Gap is paralyzed by an identity conflict about what 'building a business' requires them to become. The Builder's Gap can also resemble The Perfectionist's Prison, but the distinction is that the Perfectionist has the plan and can't ship because of fear of judgment. The Builder's Gap often doesn't have the plan yet because they haven't engaged with the strategic and operational work required to create one. It's not that they're afraid to execute. It's that they haven't built the thing to execute on.",
  },
};

export function getDriverSectionId(driver: DriverLibrarySectionName) {
  return `driver-${driver.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}
```

## 6) Score Change, Archetype Change, Driver Change, Priority Shift Copy
If a user has multiple assessments, progress modules compare previous vs latest. Copy shown depends on transition pair (e.g., `Functional -> Dialed`), or maintained state, and for domains can additionally show explicit priority shift messaging when priority delta is large.

### Driver Transition Copy (`lib/vapi/driver-progress.ts`)

```text
import {
  ALIGNED_MOMENTUM_CONTENT,
  ALIGNED_MOMENTUM_NAME,
  DRIVER_CONTENT,
  type VapiAssignedDriverName,
  type VapiDriverState,
  type VapiDriverName,
} from "./drivers";

export const DRIVER_MAINTAINED_INTERPRETATIONS: Record<
  VapiDriverName,
  string
> = {
  "The Achiever's Trap":
    "The Achiever's Trap is still running your operating system. Your identity remains fused with your output, and the pattern of sacrificing health, emotional wellbeing, and inner alignment for business performance hasn't broken. Whatever adjustments you made between assessments weren't enough to disrupt the core belief. The question to sit with: what would you be worth if you produced nothing for a month?",
  "The Protector":
    "The Protector is still in control. Your systems are strong and your relationships are still thin. The fortress you've built continues to keep people out while keeping you efficient but isolated. The control pattern hasn't loosened. Consider this: the safety you get from structure is real, but it's incomplete. What would it cost you to let one person see behind the wall?",
  "The Pleaser's Bind":
    "The Pleaser's Bind is still active. You're still overriding your own needs to manage other people's comfort, and your execution and strategy continue to suffer because other people's priorities keep winning. The people-pleasing pattern is persistent because it feels like love. It's not. It's a transaction. What would happen if you said no to the next three requests that aren't aligned with your priorities?",
  "The Escape Artist":
    "The Escape Artist is still running. You're still using productivity to avoid facing something uncomfortable, and your emotional health, family presence, and inner alignment continue to pay the price. The avoidance pattern persists because what you're running from still feels too big to face. It isn't. But it won't get smaller with more distance.",
  "The Perfectionist's Prison":
    "The Perfectionist's Prison still has you locked up. You still know what to do and still can't seem to do it. Execution remains low despite high capability and high desire. The fear of judgment or failure that's blocking your output hasn't been addressed. Every week this pattern continues is a week of stranded potential. The prison door isn't locked from the outside.",
  "The Imposter Loop":
    "The Imposter Loop is still cycling. You still suspect you don't deserve what you're building, and that belief is still undermining your business alignment, your self-trust, and your willingness to be fully seen. The imposter pattern is one of the most stubborn because the evidence against it (your actual results) gets dismissed while the evidence for it (your internal doubt) gets amplified. The loop breaks when you stop waiting to feel ready and start building something you're proud to own.",
  "The Martyr Complex":
    "The Martyr Complex is still operating. You're still sacrificing your health and inner life for the people and causes you serve. Your contribution and family scores remain strong while your body and alignment continue to deteriorate. The belief that your needs come last hasn't shifted. The generosity is genuine but the cost is unsustainable. You cannot pour from an empty vessel, and the vessel is getting emptier.",
  "The Fog":
    "The Fog hasn't lifted. You still can't commit to a clear direction, your importance ratings are still flat, and your vision and alignment scores remain low. Another assessment period has passed in exploration mode. The fog feels like confusion but it functions as protection. At some point, the cost of not choosing exceeds the cost of choosing wrong. You may have already passed that point.",
  "The Scattered Mind":
    "The Scattered Mind remains your primary pattern. Your attention continues to fragment in ways that block sustained execution despite your alignment and emotional stability. This pattern is persistent. If the approaches you've tried haven't shifted it, consider what's missing: Is your environment still full of capture points? Do you have external accountability for focus blocks? Have you explored whether ADHD support might help? The path forward is structural. Build the scaffolding your mind needs to do its work.",
  "The Builder's Gap":
    "The Builder's Gap is still the pattern. You still have a strong personal foundation and genuine relational wealth, but the business infrastructure still hasn't been built. Another assessment period has passed and the strategy, execution, operations, or some combination remain underdeveloped. The belief that building a business machine somehow threatens your authenticity hasn't been addressed. Every month this gap persists is a month your gifts stay stranded at a fraction of their potential reach. The people who need what you offer are waiting for you to build the vehicle that delivers it.",
};

export type DriverTransitionSummary = {
  heading: string;
  subheading: string;
  previousBelief: string | null;
  currentBelief: string | null;
  body: string;
  direction: "up" | "down" | "same";
};

export function getDriverTransitionSummary(
  previousState: VapiDriverState,
  currentState: VapiDriverState,
  previousDriver: VapiAssignedDriverName | null,
  currentDriver: VapiAssignedDriverName | null
): DriverTransitionSummary {
  const previousDysfunctionDriver =
    previousDriver && previousDriver in DRIVER_CONTENT
      ? (previousDriver as VapiDriverName)
      : null;
  const currentDysfunctionDriver =
    currentDriver && currentDriver in DRIVER_CONTENT
      ? (currentDriver as VapiDriverName)
      : null;

  if (
    previousState === "aligned_momentum" &&
    currentState === "aligned_momentum"
  ) {
    return {
      heading: "Alignment Sustained",
      subheading: "Aligned Momentum continues",
      previousBelief: null,
      currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      body: "Your internal operating system continues to work with your goals rather than against them. No dysfunction driver was detected in either your previous or current assessment. Sustaining this across multiple assessment periods is rare and reflects genuine, embedded alignment rather than a good month. The practices and boundaries producing this state are working. Continue to audit honestly, protect your margins, and treat this alignment as something that requires ongoing maintenance rather than a permanent achievement.",
      direction: "up",
    };
  }

  if (
    previousState === "dysfunction_driver" &&
    previousDysfunctionDriver &&
    currentState === "aligned_momentum"
  ) {
    if (previousDysfunctionDriver === "The Scattered Mind") {
      return {
        heading: "A Significant Shift",
        subheading: "The Scattered Mind → Aligned Momentum",
        previousBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
        currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
        body: "Your previous assessment identified The Scattered Mind, attention that fragmented despite your alignment and emotional stability. That pattern is no longer dominant. Your scores now reflect broad strength without a detectable dysfunction driver. This is a meaningful transition because scattered attention is persistent and rarely resolves on its own. Whatever changed, environment redesign, new rhythms and systems, support for ADHD, or simply building capacity over time, it's working. Your mind is now serving your values instead of scattering away from them. Protect the structures that made this possible.",
        direction: "up",
      };
    }

    return {
      heading: "A Significant Shift",
      subheading: `${previousDysfunctionDriver} → ${ALIGNED_MOMENTUM_NAME}`,
      previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
      currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      body: `Your previous assessment identified ${previousDysfunctionDriver} as the internal pattern driving your results. That pattern is no longer dominant. Your scores now reflect broad, genuine strength without a detectable dysfunction driver underneath them. This is one of the most meaningful transitions on this assessment. The belief that was working against you, '${DRIVER_CONTENT[previousDysfunctionDriver].coreBelief},' has been addressed enough that it's no longer shaping your results. What's fueling your pattern now is alignment itself. Protect it.`,
      direction: "up",
    };
  }

  if (
    previousState === "aligned_momentum" &&
    currentState === "dysfunction_driver" &&
    currentDysfunctionDriver
  ) {
    return {
      heading: "A Pattern Has Emerged",
      subheading: `${ALIGNED_MOMENTUM_NAME} → ${currentDysfunctionDriver}`,
      previousBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
      body: `Your previous assessment showed Aligned Momentum, meaning no dysfunction driver was detected. This time, ${currentDysfunctionDriver} has emerged. The core belief driving your current pattern is: '${DRIVER_CONTENT[currentDysfunctionDriver].coreBelief}.' This doesn't erase the alignment you had. It means something shifted, whether through increased demands, a life change, or a reactivation of an old pattern, and an internal driver is now influencing your results. Read the full driver description and pay attention to the 'Way Out' section. You've been aligned before. You know what it feels like. The path back is familiar.`,
      direction: "down",
    };
  }

  if (previousState === "no_driver" && currentState === "aligned_momentum") {
    return {
      heading: "Alignment Clarified",
      subheading: "Aligned Momentum identified",
      previousBelief: null,
      currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      body: "Your previous assessment couldn't identify a clear pattern. This time, your scores are strong enough and clean enough to confirm Aligned Momentum. Your internal operating system is working with your goals. This clarity likely reflects genuine improvement in the areas that were previously ambiguous.",
      direction: "up",
    };
  }

  if (previousState === "aligned_momentum" && currentState === "no_driver") {
    return {
      heading: "Alignment Uncertain",
      subheading: "Aligned Momentum no longer confirmed",
      previousBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      currentBelief: null,
      body: "Your previous assessment showed Aligned Momentum, but your current scores don't meet the criteria to confirm it. No dysfunction driver was detected either, which means you're in an ambiguous zone. This often happens during transitions: increased demands, life changes, or natural fluctuations. Your scores aren't in crisis. They're just not as cleanly strong as they were. Focus on the domains that dipped and rebuild from there.",
      direction: "same",
    };
  }

  if (previousDysfunctionDriver && currentDysfunctionDriver) {
    if (
      previousDysfunctionDriver === "The Scattered Mind" &&
      currentDysfunctionDriver === "The Scattered Mind"
    ) {
      return {
        heading: "Pattern Continues",
        subheading: "The Scattered Mind persists",
        previousBelief: null,
        currentBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
        body: DRIVER_MAINTAINED_INTERPRETATIONS["The Scattered Mind"],
        direction: "same",
      };
    }

    if (
      previousDysfunctionDriver !== "The Scattered Mind" &&
      currentDysfunctionDriver === "The Scattered Mind"
    ) {
      return {
        heading: "A Different Pattern Has Emerged",
        subheading: `${previousDysfunctionDriver} → The Scattered Mind`,
        previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
        currentBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
        body: "Your previous assessment identified " +
          previousDysfunctionDriver +
          " as your primary pattern. This time, The Scattered Mind has emerged. This shift sometimes happens when other internal patterns are addressed and an underlying attention pattern becomes more visible. The core belief now shaping your results is: 'I'll be able to focus when the conditions are right.' Read the full driver description. The Scattered Mind is addressed through environment design and structural support, not insight work.",
        direction: "same",
      };
    }

    if (
      previousDysfunctionDriver === "The Scattered Mind" &&
      currentDysfunctionDriver !== "The Scattered Mind"
    ) {
      return {
        heading: "Your Pattern Has Shifted",
        subheading: `The Scattered Mind → ${currentDysfunctionDriver}`,
        previousBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
        currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
        body: `Your previous assessment showed The Scattered Mind as your primary pattern. This time, ${currentDysfunctionDriver} has emerged. This could mean your attention capacity has improved and a different pattern is now more visible, or it could mean conditions have changed. Read your new driver description carefully.`,
        direction: "same",
      };
    }

    if (previousDysfunctionDriver === currentDysfunctionDriver) {
      return {
        heading: "Your Internal Pattern Is Consistent",
        subheading: `Still driven by ${currentDysfunctionDriver}`,
        previousBelief: null,
        currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
        body: DRIVER_MAINTAINED_INTERPRETATIONS[currentDysfunctionDriver],
        direction: "same",
      };
    }

    return {
      heading: "Your Internal Pattern Has Shifted",
      subheading: `${previousDysfunctionDriver} to ${currentDysfunctionDriver}`,
      previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
      currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
      body: `Your internal driver has shifted from ${previousDysfunctionDriver} to ${currentDysfunctionDriver}.\n\nPreviously, the pattern underneath your scores was rooted in the belief: '${DRIVER_CONTENT[previousDysfunctionDriver].coreBelief}'\n\nNow, the data suggests a different pattern is primary, rooted in: '${DRIVER_CONTENT[currentDysfunctionDriver].coreBelief}'\n\nThis shift can mean the original pattern was successfully addressed and a deeper or different pattern has surfaced, which is common and healthy in coaching work. It can also mean life circumstances changed in a way that activated a different coping strategy. Read your new driver description carefully. It reveals what's most likely driving your current scores and where the coaching work should focus next.`,
      direction: "same",
    };
  }

  if (!previousDysfunctionDriver && currentDysfunctionDriver) {
    return {
      heading: "Internal Pattern Identified",
      subheading: `Your likely driver: ${currentDysfunctionDriver}`,
      previousBelief: null,
      currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
      body: "Your previous assessment didn't produce a strong enough signal to identify a driver. This time, the pattern is clearer. Read the full driver description in your results to understand what's likely underneath your scores.",
      direction: "same",
    };
  }

  if (previousDysfunctionDriver && !currentDysfunctionDriver) {
    return {
      heading: "Internal Pattern Unclear",
      subheading: `Previously: ${previousDysfunctionDriver}`,
      previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
      currentBelief: null,
      body: "Your previous assessment identified a clear internal driver, but your current scores don't map strongly to any single pattern. This can mean the old pattern is dissolving, which is progress, that you're in a transitional period, or that multiple drivers are now competing. Your domain scores and priority matrix will give you more specific direction.",
      direction: "same",
    };
  }

  return {
    heading: "Internal Pattern Unclear",
    subheading: "No clear driver identified",
    previousBelief: null,
    currentBelief: null,
    body: "Neither of your most recent assessments produced a strong enough signal to identify a single internal driver. Use your domain scores, archetype, and priority matrix to see where the clearest action is available right now.",
    direction: "same",
  };
}
```


### Metric/Arena/Domain Transition Copy Map (`lib/vapi/progress-transitions.ts`)

```text
export const VAPI_PROGRESS_TRANSITIONS = {
  overall: {
    "In the Red → Below the Line": "You've started to pull yourself out of crisis. Where nearly every area of your life and business was in serious deficit, you've stabilized enough to start functioning again. The problems are still real and widespread, but the freefall has stopped. Something you changed is working. Identify what it is, double down on it, and don't try to fix everything at once. Targeted, sustained effort on your weakest areas is what pulls the whole picture upward.",
    "Below the Line → Functional": "You've crossed a meaningful threshold. Where systemic problems were dragging every area down, you've built enough stability that the compounding is starting to work in your favor. Several domains have improved, and the ones that haven't are no longer in crisis. Your foundation can hold weight now. The work from here is identifying the one or two domains still pulling your average down and giving them focused attention.",
    "Functional → Dialed": "You've reached integration. Your personal health, your relationships, and your business are all working together instead of competing with each other. This is what most founders aspire to but few achieve. The way you live reinforces the way you work, and vice versa. Getting here required sustained effort across multiple areas simultaneously. Staying here requires ongoing vigilance. Audit regularly, catch drift early, and never assume the work is done.",
    "In the Red → Functional": "This is a dramatic transformation. You went from crisis across most of your life and business to a solid, functional baseline. That doesn't happen through small adjustments. You made fundamental changes to how you operate, how you relate to yourself, and how you run your business. Multiple domains moved at once, which means the underlying mindset and habits shifted, not just the surface behaviors. Stay committed. Functional is a platform, not a destination.",
    "Below the Line → Dialed": "You jumped from systemic dysfunction to full integration. This is one of the most significant shifts a person can make. Nearly every area of your life improved substantially in a single assessment period, which usually requires a total commitment to change: a structured program, deep personal work, or a catalytic event that reorganized your priorities. Whatever drove this, it worked across the board. Protect it by maintaining the practices and structure that produced these results.",
    "In the Red → Dialed": "A complete life transformation. Going from crisis across the board to integrated excellence in one assessment period is extraordinary. Something fundamental shifted in how you approach your health, your relationships, your business, and yourself. This kind of change usually requires a convergence of readiness, support, and commitment. The person taking this assessment today is operating from a fundamentally different place than the person who took it last time. Sustain this with the same intensity that built it.",
    "Maintained In the Red": "Multiple areas of your life and business remain in crisis, and another assessment period has passed without meaningful improvement. This is the hardest pattern to break because the problems reinforce each other: poor health makes focus impossible, broken relationships drain emotional energy, business chaos creates stress that worsens everything else. You cannot fix all of this at once. Pick the single domain with the lowest score and commit to improving just that one area for the next 30 days. Breaking one link in the chain can start to unravel the rest.",
    "Maintained Below the Line": "You're stuck. The systemic issues that were pulling you down last time are still present. You may have made small improvements in some areas, but they weren't enough to shift the overall picture. The danger of this plateau is normalization: you start to accept this level of functioning as just how things are. It's not. Look at your three lowest domain scores. At least one of them has a clear, actionable next step you've been avoiding. Take it.",
    "Maintained Functional": "You're solid but haven't broken through. The foundation is in place across most areas, but the unevenness that was there last time is still there. You're probably strong in the areas you naturally gravitate toward and still neglecting the ones that feel harder or less urgent. Sustained Functional often reflects a comfort zone rather than a ceiling. The path to Dialed requires addressing the specific domains you've been tolerating at a lower standard. Name them honestly and give them the same attention you've given your strengths.",
    "Maintained Dialed": "You're sustaining excellence across the board. Your health, relationships, and business continue to reinforce each other. This is the rarest and most valuable state on this assessment, and maintaining it is its own achievement. The risk at this level is invisible: slow erosion masked by strong results. Keep your audit practices active, stay honest about early signs of drift, and remember that the goal is not perfection but early detection of slippage.",
    "Dialed → Functional": "The integration has loosened. Where everything was working together, some areas have slipped. The overall picture is still good, but the reinforcing cycle that made Dialed so powerful has weakened. This usually starts in one or two domains that you deprioritized because everything else felt stable. Identify where the scores dropped and address them before the imbalance creates drag across the rest of your life.",
    "Functional → Below the Line": "Multiple areas are declining at once. You've gone from a solid baseline to a place where the problems are starting to compound again. This is more than a rough patch. Something structural has shifted: increased demands, decreased capacity, abandoned systems, or a major life event that disrupted your equilibrium. Stop the bleeding by identifying which domains dropped the most and stabilizing those first.",
    "Below the Line → In the Red": "You're entering a full-scale crisis. What was already unstable has gotten worse across multiple areas simultaneously. Your health, relationships, business, or all three are in serious trouble. This is the point where pushing harder makes things worse. You need to stop, triage, and focus on immediate stabilization. Get support. Reduce obligations. Protect the basics: sleep, one key relationship, and one business essential. Everything else can wait.",
    "Dialed → Below the Line": "A significant decline across your entire life and business. Something major disrupted the integration you had built: a health crisis, a relationship rupture, a business failure, or a compounding series of setbacks. Multiple domains dropped at once, which means the reinforcing cycle is now working against you. Don't try to rebuild everything simultaneously. Stabilize the most critical area first and rebuild outward from there.",
    "Functional → In the Red": "A serious regression from stable functioning to crisis. This isn't gradual drift. Something overwhelmed your capacity across multiple areas at once. Burnout, a major loss, a financial crisis, or a personal breakdown can all produce this pattern. The priority is not optimization or strategy. It's survival and stabilization. Get help, reduce everything to essentials, and give yourself permission to operate in triage mode until the crisis passes.",
    "Dialed → In the Red": "A catastrophic collapse. You went from full integration to crisis across the board. This is the most severe regression possible and almost always indicates a major life event: a health emergency, a relationship destruction, a business failure, or a combination that overwhelmed every system you had in place. Nothing about your previous scores was fake. The person who built that life is still you. Right now, the only goal is stabilization. Seek help immediately, protect the bare essentials, and begin the process of recovery without any pressure to return to where you were. One step at a time."
  },
  Personal: {
    "In the Red → Below the Line": "Your personal foundation is no longer in freefall. Where your health, emotional state, alignment, and focus were all working against you, at least some stability has returned. You probably addressed the most urgent issue first, whether that was sleep, emotional regulation, or simply stopping the habits that were actively harming you. The foundation is still fragile, but it's no longer collapsing. Keep building on whatever stabilized you.",
    "Below the Line → Functional": "Your personal infrastructure is holding. The areas that were dragging you down have improved to the point where they're supporting you more than sabotaging you. Your energy, emotional health, focus, or alignment shifted enough that the daily experience of being you has meaningfully improved. This is the foundation that makes everything else possible. Shore up the remaining weak spots before external demands test it.",
    "Functional → Dialed": "Your personal foundation is now a genuine competitive advantage. Your energy, alignment, emotional stability, and focus are all working for you, and they're reinforcing each other. Most founders never reach this level of personal infrastructure because they prioritize everything external first. The fact that you've built this changes the ceiling on everything else you attempt. Guard it.",
    "In the Red → Functional": "A major personal transformation. You went from a foundation in crisis to one that actually supports what you're building. That required addressing multiple areas at once: health habits, emotional regulation, inner alignment, or attention sovereignty. Something catalyzed a broad shift in how you take care of yourself. The foundation is real now. Make sure it's built on sustainable practices, not just momentum.",
    "Below the Line → Dialed": "You went from an unstable personal foundation to one that's fully dialed. This kind of jump usually comes from a comprehensive commitment: a structured health protocol, deep emotional work, a redesign of how you spend your time, or all three. You didn't just patch holes. You rebuilt the entire foundation. The quality of everything you build on top of this will reflect the strength underneath it.",
    "In the Red → Dialed": "A complete personal transformation. Going from crisis to excellence across your health, alignment, emotional health, and focus in one assessment period is remarkable. Whatever combination of changes, support, and commitment produced this, it worked at every level. This new foundation is the most valuable thing you own. Protect it with the same seriousness you'd protect your most important business asset.",
    "Maintained In the Red": "Your personal foundation is still in crisis. Another period has passed and the fundamentals that should fuel everything else are still broken. You cannot outperform a crumbling foundation, no matter how hard you work. Something about your current approach to health, emotional regulation, alignment, or focus isn't working. Change the approach. Get professional support if you haven't already. The business and relationships will continue to suffer until this is addressed.",
    "Maintained Below the Line": "Your personal foundation is still unstable and it hasn't improved. You're functional enough to get by, but the cracks in your energy, emotional health, alignment, or focus are still creating drag on everything else. The fact that this hasn't moved suggests you're either not prioritizing it or the changes you've made aren't targeted enough. Review your four Self domain scores and attack the lowest one with focused intention.",
    "Maintained Functional": "Your personal foundation is decent but unchanged. You're operating well enough, but there's an untapped level available to you. The difference between Functional and Dialed in the Self arena usually comes down to one or two specific upgrades you've been deferring: a sleep overhaul, a consistent regulation practice, better boundaries around your attention, or actually making time for what matters to you. Pick the one that would create the most leverage and commit to it.",
    "Maintained Dialed": "Your personal foundation continues to operate at the highest level. Energy, alignment, emotional stability, and focus are all sustained. This is the engine behind everything else in your life, and the fact that it's held steady across assessment periods means your practices are genuinely embedded, not just aspirational. Continue to audit for subtle drift. Excellence maintained is harder than excellence achieved.",
    "Dialed → Functional": "Your personal foundation has weakened. One or more of the pillars that were fully supporting you has slipped: maybe sleep degraded, emotional regulation loosened, your alignment drifted, or your focus boundaries softened. The overall picture is still okay, but the reinforcing cycle that made Dialed so powerful has been disrupted. Identify which Self domain dropped the most and address it before the others follow.",
    "Functional → Below the Line": "Your personal foundation is becoming unstable. Multiple Self domains have regressed, and the areas that were managing are now struggling. This usually happens when sustained pressure erodes the habits and boundaries keeping you together. Your health, emotional state, focus, or alignment is actively working against you now. Reduce external demands where possible and reinvest in the basics that keep your foundation intact.",
    "Below the Line → In the Red": "Your personal foundation is in crisis. What was already shaky has collapsed. Your energy, emotional health, focus, and alignment are all in serious deficit, and they're pulling each other down. This is the point where trying harder makes things worse. You need to stop, simplify, and stabilize. Professional support, radical schedule reduction, and a return to absolute basics are not optional. They're urgent.",
    "Dialed → Below the Line": "A serious collapse in your personal foundation. You went from fully optimized to genuinely unstable. Something significant disrupted multiple areas at once: a health event, sustained burnout, a major life change, or a period where you stopped maintaining the practices that held everything together. Your personal infrastructure needs emergency attention. Don't wait for it to get worse.",
    "Functional → In the Red": "Your personal foundation has entered crisis from a place that was previously stable enough. This kind of drop signals something major: compounding stress that overwhelmed your coping capacity, a health event, or a complete abandonment of the habits keeping you functional. Everything you're trying to build sits on top of this foundation, and it's currently unable to hold weight. Get help and stabilize before anything else.",
    "Dialed → In the Red": "A total collapse of your personal foundation. You went from peak personal infrastructure to crisis. Something catastrophic overwhelmed every system you had in place: your health habits, your emotional regulation, your alignment practices, and your focus boundaries all broke simultaneously. This is not the time for business strategy or relationship repair. This is the time for care and recovery. Rebuild from the most basic level: sleep, food, safety, and one person you can be honest with."
  },
  Relationships: {
    "In the Red → Below the Line": "You've started to reconnect. Where your relational world was bankrupt, something shifted. Maybe you began rebuilding trust with yourself, had an honest conversation with family, reached out to a friend, or reconnected with a sense of purpose. The isolation and disconnection aren't fully resolved, but you've stopped the pattern of total withdrawal. The relational repair has begun.",
    "Below the Line → Functional": "Your relational world has strengthened. Self-trust is more consistent, family relationships have improved, you're less isolated, or your sense of purpose has sharpened. You've invested in the relationships that matter and started pulling away from the ones that drain you. The people in your life are getting a better version of you than they were before. Keep deepening these connections.",
    "Functional → Dialed": "Your relational world is now a genuine source of strength. You trust yourself, you're present with your family, you have real community, and you're contributing beyond yourself. These four pillars reinforce each other: self-trust enables better boundaries in relationships, presence deepens family bonds, community provides support and accountability, and contribution gives everything meaning. This is rare for founders. Cherish it.",
    "In the Red → Functional": "A major relational transformation. You went from being relationally bankrupt to having a solid network of connection, trust, and purpose. That required work on multiple fronts: rebuilding self-trust, showing up differently for family, investing in friendships, and reconnecting with contribution. The shift is real and it's changing how you experience everything else. Stay invested in these relationships even when business demands compete.",
    "Below the Line → Dialed": "You jumped from a depleted relational world to one that's fully thriving. This kind of leap means you committed deeply to the people in your life, including yourself. You probably set firm boundaries, had hard conversations, invested heavily in community, and found a genuine connection to purpose. The relational wealth you've built is now one of your greatest strategic and psychological advantages.",
    "In the Red → Dialed": "A complete relational rebuild. Going from isolation, self-abandonment, and disconnection to a thriving relational world is one of the most profound transformations a person can make. Every relationship in your life, starting with the one you have with yourself, has been fundamentally upgraded. This didn't happen by accident. It happened because you chose connection over comfort and vulnerability over self-protection. The person you are in relationships now is someone worth being proud of.",
    "Maintained In the Red": "Your relational world is still in crisis. Self-trust is still broken, family relationships are still strained or neglected, you're still isolated, and contribution is still absent. The compounding effect of relational poverty touches everything: your decision-making, your resilience, your motivation, and your mental health. This will not resolve on its own. Start with the relationship that feels most accessible to repair, even if that's the one with yourself, and invest there.",
    "Maintained Below the Line": "Your relational world is still depleted. The patterns from last assessment are still in place: inconsistent self-trust, strained family dynamics, thin community, or disconnection from purpose. Something is blocking the improvement. Often it's a belief that investing in relationships is a luxury you can't afford while building a business. That belief is backwards. Relational health fuels business performance. Invest in one relationship this month with the same intentionality you bring to your business.",
    "Maintained Functional": "Your relationships are decent but haven't deepened. You're probably strong in one or two Relationship domains and neglecting the others. Maybe self-trust is solid but family time is inconsistent. Maybe community is strong but contribution has stalled. The arena average masks the imbalance. Look at the individual domain scores and identify which one has been stuck the longest. That's where the next investment belongs.",
    "Maintained Dialed": "Your relational world continues to thrive. Self-trust, family presence, genuine community, and meaningful contribution are all sustained. This is the relational foundation most people talk about wanting but few build. Maintaining it requires ongoing intentionality because relationships don't coast. They either deepen or erode. Keep investing in all four domains, especially the ones that feel easiest to take for granted.",
    "Dialed → Functional": "Your relational world has weakened. One or more areas have slipped: maybe self-trust has softened, family presence has become inconsistent, community investment has dropped, or contribution has moved to the back burner. The overall picture is still positive, but the reinforcing cycle between these domains has been disrupted. Identify which relationship domain dropped and reinvest before the erosion spreads.",
    "Functional → Below the Line": "Your relational world is declining. What was solid enough has become depleted. You're probably withdrawing, neglecting, or running on relational autopilot. The people in your life are getting less of you, and you're getting less from them. This regression often tracks with increased business demands that squeezed out relational investment. Recognize that the cost of continued neglect here is not linear. It compounds.",
    "Below the Line → In the Red": "Your relational world has entered crisis. Self-trust, family bonds, friendships, and sense of purpose have all deteriorated to a dangerous level. You're isolated, disconnected, and the people who should be your support system either can't reach you or have given up trying. This level of relational poverty is unsustainable and will affect your health, your judgment, and your capacity to build anything meaningful. Reach out to someone today.",
    "Dialed → Below the Line": "A serious relational regression. You went from a thriving network of trust, connection, and purpose to something depleted. Something major disrupted your relational world: a conflict, a betrayal, a period of withdrawal, or a business obsession that pushed everyone to the margins. The relationships that made you strong may still be recoverable, but they need urgent attention and honest repair.",
    "Functional → In the Red": "Your relational world has collapsed. You went from adequate connection to genuine crisis. Self-trust, family bonds, friendships, or purpose, possibly all four, have broken down. This kind of collapse usually accompanies a broader personal or professional crisis. The isolation you're in right now is making everything worse. You don't need to fix all four domains at once. Start with one honest conversation with one person who cares about you.",
    "Dialed → In the Red": "A devastating relational collapse. You went from a life rich with trust, connection, and purpose to one defined by isolation and disconnection. Something catastrophic happened: a betrayal, a loss, a personal crisis that pushed you away from everyone, or a period of shame that made connection feel impossible. The relational wealth you had before was real. The capacity to rebuild it is still in you. But right now, the goal is simple: let one person in. Start there."
  },
  Business: {
    "In the Red → Below the Line": "Your business has moved from survival mode to something with a foundation, however thin. Where there was no strategy, no consistent output, no systems, and a misaligned model, at least one of those areas has improved. You're still far from where you need to be, but the chaos is no longer total. Focus your energy on the business domain with the lowest score. That's the bottleneck holding everything else back.",
    "Below the Line → Functional": "Your business fundamentals are coming together. Strategy has clarified, execution has improved, systems are developing, or your model has shifted into better alignment. The business is starting to feel like it has a foundation rather than running on hope and hustle. This is the phase where most founders get impatient and try to scale. Resist that. Build the fundamentals properly now and scaling becomes dramatically easier later.",
    "Functional → Dialed": "Your business is operating at a high level across all four pillars. You know where you're going, you're executing consistently, your operations are systemized, and the model genuinely aligns with who you are. This combination is rare and creates a compounding advantage that's nearly impossible for competitors to replicate. The business isn't just profitable. It's built right. Protect this by maintaining the discipline and self-honesty that got you here.",
    "In the Red → Functional": "A major business transformation. You went from survival mode to a genuinely functional business. That required progress on multiple fronts: clarifying your direction, building execution rhythm, installing systems, or redesigning your model for better alignment. Something changed not just in what you do but in how you approach your business. The foundation is real now. Keep building on it.",
    "Below the Line → Dialed": "You jumped from an underperforming business to one that's fully dialed. This kind of leap usually requires a comprehensive intervention: locking in strategy, installing an execution system, building operations, and ensuring ecological alignment, all within a single assessment period. That's extraordinary. The business you're running today is fundamentally different from the one you were running before. Maintain the structure and discipline that produced this result.",
    "In the Red → Dialed": "From business chaos to business excellence. This is the single most impactful transformation possible in the Business arena. Every fundamental has been rebuilt: you have a clear strategy, consistent execution, real systems, and a model that fits who you are. Whatever program, intervention, or commitment drove this, it worked across every dimension. The business is no longer a source of stress. It's a source of leverage. Protect it accordingly.",
    "Maintained In the Red": "Your business is still in survival mode. No clear strategy, inconsistent execution, no operational foundation, and a model that may be working against you. Another period has passed without the fundamental changes needed to break this pattern. The trap at this level is staying busy while nothing structurally changes. You need outside perspective: a mentor, a coach, a peer group, or a structured program. What you're doing on your own isn't producing different results.",
    "Maintained Below the Line": "Your business fundamentals are still weak and haven't improved. Strategy is still unclear, execution is still inconsistent, operations are still fragile, or the model still doesn't fit. The fact that this hasn't moved suggests the bottleneck isn't effort. It's either the wrong focus or the wrong approach. Look at your four Business domain scores. The lowest one is almost certainly the constraint holding the other three in place. Fix that one thing first.",
    "Maintained Functional": "Your business is decent but hasn't leveled up. The fundamentals are in place but something is preventing the jump to Dialed. This is typically one specific area that's creating friction: a strategy that isn't fully committed, an execution rhythm that breaks under pressure, operations that still depend too much on you, or a subtle misalignment between the business and what you actually want. Identify the weakest Business domain and give it your full attention.",
    "Maintained Dialed": "Your business continues to operate at the highest level. Strategy is clear, execution is consistent, operations are systemized, and the model aligns with who you are. Sustaining this is its own achievement. The risk at this tier is complacency disguised as confidence. Keep asking hard questions: Is the strategy still right? Is execution still tight? Are systems being maintained? Does this still align with the life I want? The moment you stop asking is the moment drift begins.",
    "Dialed → Functional": "Your business has loosened. One or more pillars have weakened: strategy may have shifted, execution rhythm may have slipped, operations may have softened, or alignment may have drifted. The business is still performing, but the tight integration between strategy, execution, systems, and model that made it exceptional has frayed. Identify which domain dropped and tighten it before the regression deepens.",
    "Functional → Below the Line": "Your business fundamentals are deteriorating. What was adequate has become strained. Strategy is foggier, execution is less consistent, operations are more fragile, or the model has drifted from who you are. This level of decline is usually caused by one acute disruption that cascaded across multiple areas. Identify the root cause and address it directly rather than trying to patch symptoms.",
    "Below the Line → In the Red": "Your business has entered crisis. Strategy, execution, operations, and alignment are all in serious trouble. You're back to survival mode: reacting instead of choosing, starting instead of finishing, hoping instead of measuring, and grinding instead of building. This requires a complete pause and reassessment. Continuing to operate at this level will make things worse, not better. Stop, get honest about what's broken, and rebuild from the most fundamental constraint.",
    "Dialed → Below the Line": "A serious business regression. You went from an exceptional operation to one that's structurally weak. Something major disrupted your business: a market shift, a team loss, a failed pivot, a financial crisis, or a period where you stopped maintaining the systems that held everything together. Multiple Business domains declined at once, which means the issue is likely systemic rather than isolated. Identify the root cause before trying to fix individual symptoms.",
    "Functional → In the Red": "Your business has collapsed from functional to survival mode. This kind of drop usually signals a cascading failure: a strategic crisis that killed execution momentum, an operational breakdown that consumed all capacity, or an ecological misalignment that triggered self-sabotage across the board. The business needs fundamental triage. Pick the one Business domain where improvement would unlock the others and focus there exclusively.",
    "Dialed → In the Red": "A catastrophic business collapse. You went from an optimized, aligned, well-executed business to total crisis. Something extraordinary happened: a market collapse, a partnership dissolution, a financial emergency, a complete loss of team, or a personal crisis that made business management impossible. The business you built before was real, and the skills that built it are still yours. Right now, the only goal is stabilization. Stop the bleeding in the most critical area, preserve what can be preserved, and begin rebuilding when you have the capacity. Not before."
  },
  PH: {
    "In the Red → Below the Line": "You stopped the freefall. You likely started paying attention to at least one foundational habit, whether that's sleep, nutrition, or movement. You're not consistent yet, but you've gone from ignoring your body to acknowledging it needs care. The next step is turning that awareness into a reliable routine.",
    "Below the Line → Functional": "You built real consistency where there used to be chaos. Sleep, nutrition, or movement became more regular and intentional. You probably stopped treating your health as optional and started treating it as infrastructure. The gaps still show up under stress, but the baseline has clearly shifted. Now make the habits bulletproof.",
    "Functional → Dialed": "You locked it in. The habits that used to require willpower are now running on autopilot. You likely tightened the areas that used to slip under pressure: sleep during busy weeks, nutrition on travel days, or workouts when things got hard. Your body is now a genuine asset. Protect the system that got you here.",
    "In the Red → Functional": "This is a major turnaround. You went from a physical crisis to a genuinely healthy baseline, which means you didn't just patch one thing. You overhauled multiple habits. Whether it was a health scare, a decision to commit, or a structured program, something shifted fundamentally in how you prioritize your body. Don't let the momentum fade. You're not locked in yet.",
    "Below the Line → Dialed": "You jumped from inconsistency to excellence. This kind of leap usually comes from committing to a structured protocol that removed the guesswork: a consistent sleep schedule, a meal plan, a non-negotiable training routine. Whatever you installed, it's working. The risk now is assuming it will hold without continued intentionality.",
    "In the Red → Dialed": "A complete physical transformation. Going from crisis to fully dialed in one assessment period is rare and suggests you made your health an absolute priority. Something catalyzed this, and it clearly worked. The most important thing now is recognizing that these habits need to be maintained, not just achieved.",
    "Maintained In the Red": "Your physical health is still in crisis, and another assessment period has passed without meaningful change. Whatever adjustments you attempted either didn't stick or weren't enough. This is not a willpower issue. You need a different approach. Identify the specific barrier keeping you from addressing sleep, nutrition, or movement, and attack that barrier directly.",
    "Maintained Below the Line": "You're in the same place you were last time: inconsistent and borrowing energy. The fact that this hasn't moved suggests you're tolerating a level of physical neglect that feels manageable but is quietly holding everything else back. Pick one habit. Just one. Make it non-negotiable for 30 days. That's where the next shift starts.",
    "Maintained Functional": "You're holding steady, which means your habits are decent but haven't leveled up. You're probably comfortable here, and that comfort is exactly what's keeping you from breaking through. The difference between Functional and Dialed is usually one or two specific upgrades: better sleep hygiene, more structured nutrition, or a training program that actually challenges you. Identify the gap and close it.",
    "Maintained Dialed": "You're sustaining excellence. Your physical habits are consistent and your body is supporting everything you're building. This is the hardest tier to maintain because there's no urgency pushing you. Stay vigilant against the slow creep of small compromises. The goal isn't perfection. It's catching slippage early before it compounds.",
    "Dialed → Functional": "Something disrupted your routine. Travel, a stressful period, a life change, or simply letting standards slide. The good news is you've been here before, so you know what Dialed feels like and what it requires. Identify what slipped, reinstall the habit, and don't let Functional become your new normal.",
    "Functional → Below the Line": "Your physical foundation has weakened significantly. The habits that were holding have broken down, and you're back to inconsistency. This usually happens when stress spikes and health becomes the first thing sacrificed. You've proven you can maintain Functional. The question is whether you'll let this slide continue or catch it here.",
    "Below the Line → In the Red": "This is a serious regression. You've gone from inconsistent to crisis. Something is pulling your health into the ground, whether it's work demands, emotional stress, or a pattern of self-neglect that's accelerating. This needs immediate attention. You're not going to think or strategize your way out of this. Act on one physical habit today.",
    "Dialed → Below the Line": "This is a significant slide. You went from locked-in habits to real inconsistency, which means multiple routines broke at once. A major disruption probably caused this: a health event, a business crisis, a personal upheaval. Whatever it was, your physical foundation took the hit. You know what Dialed requires. Rebuild systematically, not all at once.",
    "Functional → In the Red": "You've gone from generally okay to crisis. This kind of drop usually signals that something bigger is happening: burnout, a major life stressor, or a collapse in the systems keeping you together. Your body is now actively working against you. Treat this as an emergency. Stabilize sleep first. Everything else follows from there.",
    "Dialed → In the Red": "A complete collapse in your physical health. This is rare and almost always signals a major life disruption: a health crisis, an emotional breakdown, a catastrophic business event, or all three. The habits that were serving you are gone. The priority right now isn't getting back to Dialed. It's stopping the bleeding. Focus on survival basics: sleep, food, movement. Nothing else matters until these are stabilized."
  },
  IA: {
    "In the Red → Below the Line": "You've started to wake up. Where you were running entirely on obligation and autopilot, you've begun noticing the gap between how you're living and what you actually want. You may have made a small but meaningful change: carving out time for yourself, saying no to something misaligned, or simply acknowledging that something needs to shift. That awareness is the foundation. Now act on it consistently.",
    "Below the Line → Functional": "You reclaimed real territory. Where obligation used to dominate your weeks, intention has started showing up consistently. You're probably spending more time on things that matter and less time resenting the things that don't. The tension between who you're being and who you want to be has noticeably quieted. Keep closing that gap. Resentment builds when you stop.",
    "Functional → Dialed": "You've moved from mostly aligned to genuinely intentional. The low-grade drift that used to pull you off course has been addressed. Your time, energy, and choices now reflect what you actually value, not just what's expected of you. This kind of alignment creates a quiet confidence that's hard to fake and impossible to ignore. Protect your calendar like it's sacred, because it is.",
    "In the Red → Functional": "This is a dramatic shift. You went from living almost entirely on autopilot to a place where your days generally reflect your values. That required more than small adjustments. You likely made hard decisions about what to keep, what to cut, and what to prioritize. Something woke you up and you responded. The work now is making sure this alignment deepens rather than drifts.",
    "Below the Line → Dialed": "You went from obligation-heavy to fully intentional. This kind of jump usually requires a fundamental restructuring of how you spend your time and who you spend it for. You probably cut things that weren't serving you, committed to practices that nourish you, and stopped apologizing for prioritizing what matters. Sustain this by continuing to audit your time against your values.",
    "In the Red → Dialed": "A total realignment. You went from completely disconnected from your own values to living with genuine intention. This is one of the most transformative shifts a person can make. Something catalyzed a deep reassessment of how you were living, and you had the courage to rebuild from the ground up. Guard this fiercely. The old patterns will try to reassert themselves.",
    "Maintained In the Red": "You're still disconnected from what you actually want, and another assessment period has passed without change. This isn't about lacking time. It's about lacking permission. You may be so deep in obligation or survival mode that living intentionally feels like a luxury. It's not. It's the difference between building a life you want and enduring one you don't. Start by identifying one obligation you could stop or delegate.",
    "Maintained Below the Line": "You're stuck in the same pattern: too much obligation, not enough intention. The fact that this hasn't shifted suggests you're either overwhelmed by the demands on your time or afraid of what it would cost to prioritize yourself. Something has to give. Block one hour this week that's exclusively yours. Not productive. Not optimized. Yours. See what happens.",
    "Maintained Functional": "You're aligned but not fully. The small gap between how you're living and what you say you want is still there. It's comfortable enough to ignore, which is exactly why it persists. The difference between Functional and Dialed here usually comes down to one or two commitments you keep making and keep deferring. Name them. Then schedule them.",
    "Maintained Dialed": "Your life reflects your values, and that's held steady. This takes ongoing intentionality, especially as a founder where external demands never stop pulling you off course. The fact that you've sustained this is meaningful. Keep auditing. The moment you stop checking whether your time matches your values is the moment drift begins.",
    "Dialed → Functional": "Some drift has crept in. You were living with genuine intention, and now there's a gap forming between your values and your calendar. This usually happens gradually: one obligation you didn't push back on, one priority you let slide, one commitment to yourself you deferred. Catch it now. The longer you tolerate the drift, the harder it becomes to reverse.",
    "Functional → Below the Line": "Obligation is taking over again. Where you previously had reasonable balance between what you chose and what was expected of you, the expectations are winning. You're likely spending more time on things that drain you and less on things that fill you up. Something shifted in your circumstances or your boundaries. Identify what changed and push back before the resentment solidifies.",
    "Below the Line → In the Red": "You've lost connection to what you actually want. What was already obligation-heavy has become fully autopilot. You're no longer making intentional choices about your time. You're just responding to whatever is in front of you. This level of disconnection leads to deep resentment, burnout, or both. Stop. Pause everything nonessential. Ask yourself what you actually want.",
    "Dialed → Below the Line": "A significant regression. You went from intentional living to an obligation-dominated week. A major disruption knocked your priorities off course: a new project, a family situation, a business crisis, or simply saying yes to too many things. Whatever caused it, your alignment took a real hit. Prune aggressively and reclaim your calendar.",
    "Functional → In the Red": "You've gone from manageable drift to complete disconnection. This level of regression usually means something overwhelming consumed your capacity: a crisis, a major life change, or a sustained period where you stopped advocating for your own needs. You may not even be able to articulate what you want right now. Start by naming one thing you used to do that made you feel alive, and find a way to do it this week.",
    "Dialed → In the Red": "A complete reversal. You went from living with full alignment to losing the thread entirely. This is almost always the result of a major disruption that consumed everything. The person who built that aligned life is still in there, but survival is overriding intention right now. Don't try to rebuild everything at once. Start with one small act of intentional living and build from there."
  },
  ME: {
    "In the Red → Below the Line": "You've come out of survival mode. You're still fragile, but you're no longer in constant crisis. You probably sought help, made changes to your environment, or found a coping strategy that gave you enough stability to start functioning again. The reactivity and overwhelm haven't disappeared, but they're no longer running the show every day. Keep building on whatever is working.",
    "Below the Line → Functional": "Your emotional baseline has shifted from fragile to stable. You're recovering faster from stress, your self-talk has improved, and your pace is closer to sustainable. You likely developed better regulation strategies: pausing before reacting, catching the inner critic earlier, or building in more recovery time. The volatility has quieted. Now focus on making this stability your default, not something you have to fight for.",
    "Functional → Dialed": "You've moved from managing your emotional health to it genuinely working for you. The difference is subtle but powerful: you're no longer white-knuckling through stress or relying on effort to stay regulated. Your responses are more automatic, your self-talk is more natural, and your pace has settled into something truly sustainable. Your mind is an ally now. Trust it.",
    "In the Red → Functional": "This is a significant recovery. You went from emotional crisis to genuine stability. That doesn't happen without real work. You likely made substantial changes: therapy, coaching, medication, lifestyle shifts, boundary enforcement, or some combination. Whatever you did, it worked. Stay committed to the practices that got you here. Emotional health requires ongoing maintenance, not just crisis intervention.",
    "Below the Line → Dialed": "You jumped from emotional fragility to real inner stability. This leap usually comes from sustained, deliberate effort: consistent regulation practices, a fundamental shift in self-talk patterns, and an honest restructuring of your pace and workload. You didn't just manage the symptoms. You addressed root causes. Protect this investment by maintaining the practices that produced it.",
    "In the Red → Dialed": "A complete emotional transformation. Going from survival mode to genuine inner stability in one assessment period is extraordinary and suggests you committed fully to your mental and emotional health. Whatever combination of support, practices, and changes you made, it worked at a deep level. This kind of shift is fragile at first. Treat it with care and don't assume it's permanent without ongoing attention.",
    "Maintained In the Red": "Your emotional health is still in crisis. Another period has passed and the overwhelm, reactivity, or numbness hasn't lifted. This is your signal to change your approach entirely. Whatever you've been doing isn't enough. Professional support is not optional at this level. Reach out to a therapist, coach, or trusted advisor. You cannot build anything sustainable from this state.",
    "Maintained Below the Line": "You're still emotionally fragile, and it hasn't improved. The harsh self-talk, the unsustainable pace, or the reactivity is still your baseline. You may be pushing through it with willpower, but that's not the same as healing it. Something about your current situation or approach is keeping you stuck. Identify the biggest emotional drain in your life right now and address it directly.",
    "Maintained Functional": "You're emotionally stable but not growing. This is a common place to plateau because it feels manageable. The inner critic still shows up. Stress still gets in more than it should. You're coping, not thriving. The upgrade from here usually involves one specific practice: better boundaries, a daily regulation ritual, or addressing the one stressor you keep working around instead of through.",
    "Maintained Dialed": "Your emotional health is holding strong. Sustained inner stability is one of the rarest and most valuable assets a founder can have. The fact that you've maintained this across assessment periods means your practices are working and your self-awareness is sharp. Keep doing exactly what you're doing, and watch for early signs of erosion: shortened patience, disrupted sleep, or creeping pace.",
    "Dialed → Functional": "Something shook your inner stability. You were operating from a solid emotional foundation, and now stress is getting in more than it was. This often happens after a major stressor, sustained pressure, or when you let recovery practices lapse. The good news is you know what stability feels like. Identify what disrupted it and reinstate the practice or boundary that was protecting you.",
    "Functional → Below the Line": "Your emotional health has weakened. You've gone from managing well to genuinely fragile. The self-talk is harsher, the reactivity is quicker, and the pace has probably become unsustainable again. This regression usually tracks with increased stress, decreased recovery, or a specific event that destabilized you. Don't normalize this. It's a real decline, not just a bad month.",
    "Below the Line → In the Red": "You've entered emotional crisis. What was already fragile has broken down. You're likely overwhelmed, reactive, or numb more often than not. If you haven't already, this is the moment to seek professional support. This isn't about being weak. It's about being honest that your current emotional state can't support what you're trying to build.",
    "Dialed → Below the Line": "A serious emotional regression. You went from genuine stability to fragility, which suggests a significant disruption or sustained pressure that overwhelmed your coping capacity. Multiple systems broke at once. Don't try to power through this. Identify the source of the pressure, reduce what you can, and get support for what you can't.",
    "Functional → In the Red": "You've gone from stable to crisis. This kind of drop signals something major: sustained burnout, an unprocessed loss, a relationship rupture, or a period of self-neglect that reached a breaking point. Your emotional foundation needs emergency attention. Reduce obligations immediately and get support. The business can wait. This can't.",
    "Dialed → In the Red": "A complete emotional collapse. Something catastrophic disrupted your inner world. The stability you had is gone and you're operating from survival. This is not the time for business optimization or productivity hacks. This is the time for care. Slow down. Get help. Allow yourself to be human before you try to be a founder again."
  },
  AF: {
    "In the Red → Below the Line": "You've started taking your attention back. Where it was completely hijacked, you've put at least some boundaries in place or started noticing when you're in distraction mode. You're still losing significant time to low-value inputs, but you're no longer blind to it. That awareness is the prerequisite for everything else. Build on it by choosing one specific boundary to enforce this month.",
    "Below the Line → Functional": "Your attention has improved meaningfully. You've gone from distraction-dominant to productive with some leaks. You likely installed boundaries around your phone or email, started protecting focus time, or developed the ability to catch avoidance earlier. Deep work is happening more consistently now, even if it's not bulletproof. Tighten the remaining leaks and you'll see outsized returns.",
    "Functional → Dialed": "You own your attention now. The leaks that used to cost you hours each week have been sealed. You likely refined your input boundaries, made your focus blocks truly non-negotiable, and developed a strong internal alarm for avoidance patterns. In a world designed to fragment attention, this is a genuine competitive advantage. Guard it relentlessly.",
    "In the Red → Functional": "A major reclamation. You went from having no control over your attention to being genuinely productive. That required more than one change. You probably overhauled your digital environment, restructured your workday, and developed new habits around focus and distraction. The transformation is real. Stay vigilant, because old patterns are always waiting for an opening.",
    "Below the Line → Dialed": "You jumped from distraction to sovereignty. This kind of leap usually comes from a systemic overhaul: restructured work environment, strict input rules, protected deep work blocks, and a practiced ability to recognize and interrupt avoidance. You've built something most people only talk about. Maintain it by treating your attention boundaries as non-negotiable, not aspirational.",
    "In the Red → Dialed": "A complete transformation in how you direct your attention. Going from hijacked to sovereign in one assessment period is remarkable. You likely made aggressive changes to your environment, tools, schedule, and internal awareness. Protect this with everything you have, because the distraction economy never stops trying to pull you back.",
    "Maintained In the Red": "Your attention is still not your own, and nothing has changed. The distractions, the context-switching, the reactive mode are all still running the show. You need to ask yourself whether you're actually trying to change this or whether you've accepted it. If you want different results, start with your phone. Set one concrete screen-time limit and enforce it for 30 days.",
    "Maintained Below the Line": "You're still losing significant time to distraction, and the pattern hasn't broken. You probably know what you should be doing differently but haven't committed to it consistently. Pick one focus block per day, even just 60 minutes, protect it completely, and see what becomes possible when you give your best work your best attention.",
    "Maintained Functional": "Your attention is decent but hasn't leveled up. You can focus when it matters, but the leaks are still there and costing more than you think. The jump from Functional to Dialed usually requires one uncomfortable commitment: fully silencing your phone during deep work, closing email for half the day, or cutting a recurring distraction you've been tolerating. Make the commitment.",
    "Maintained Dialed": "Your attention sovereignty is holding. This is genuinely rare and means your boundaries, habits, and self-awareness are all working together. The biggest threat to sustained focus mastery is gradual creep: one new notification you allow, one boundary you soften, one focus block you start splitting. Audit your inputs regularly and protect the system.",
    "Dialed → Functional": "Your attention boundaries have softened. Where you had full control, distractions are getting in again. This usually starts small: checking your phone during a focus block, letting email interrupt deep work, or saying yes to a meeting during protected time. Catch the creep now. Tighten the boundaries back before the slide accelerates.",
    "Functional → Below the Line": "Your attention is back in reactive mode. The boundaries and habits that were keeping you productive have broken down, and distraction is winning again. Something changed: increased demands, a stressful period, or simply letting the discipline lapse. You know how to focus. The issue is that you've stopped protecting the conditions that make it possible.",
    "Below the Line → In the Red": "Your attention has been fully recaptured by distraction. You've gone from losing some time to losing most of it. Your phone, inbox, other people's urgency, and low-value inputs are running your day. This needs aggressive intervention. Consider a digital detox, a complete restructuring of your workday, or removing the apps and tools consuming your focus.",
    "Dialed → Below the Line": "A major regression in attention control. Multiple boundaries broke at once. This often happens during periods of high stress when distraction becomes a coping mechanism rather than just a bad habit. Address the underlying stress, then rebuild your focus architecture.",
    "Functional → In the Red": "Your attention has collapsed. You went from productive with some leaks to completely reactive. This kind of drop usually signals something deeper: overwhelm, emotional distress, or a period where escapism through distraction became the path of least resistance. The attention problem is real, but it may be a symptom of something else. Address both.",
    "Dialed → In the Red": "A complete collapse in attention sovereignty. Something significant disrupted your ability to focus at all. This level of regression suggests a major life or business disruption consuming your mental bandwidth. Don't try to rebuild focus habits while the underlying crisis is active. Stabilize first, then rebuild the system."
  },
  RS: {
    "In the Red → Below the Line": "You've stopped the self-abandonment. Where you were invisible to yourself, overriding every need and deferring to everyone else, you've started to notice the pattern. You may have kept a promise to yourself, held a small boundary, or simply recognized that you were betraying your own interests. That recognition is the seed of self-trust. Water it carefully.",
    "Below the Line → Functional": "You've rebuilt some genuine self-trust. Your boundaries are more consistent, you're keeping more promises to yourself, and you're people-pleasing less. You likely practiced saying no, held firm on something that mattered, or started treating your own commitments with the same respect you give everyone else's. The old patterns still surface under pressure, but they no longer run the show.",
    "Functional → Dialed": "Your relationship with yourself is now rock-solid. You trust your judgment, hold your boundaries without guilt, and keep your word to yourself as a default, not an aspiration. You probably closed the final gaps between who you want to be and who you are under stress. This self-trust is the foundation for every bold decision you'll make from here.",
    "In the Red → Functional": "A major shift in how you relate to yourself. You went from self-abandonment to a functional relationship with your own needs, boundaries, and commitments. That required confronting deeply ingrained patterns of people-pleasing, self-betrayal, or conflict avoidance. The progress is real. Close the remaining gap between your intentions and your behavior under pressure.",
    "Below the Line → Dialed": "You jumped from eroded self-trust to genuine self-respect. This kind of leap typically comes from sustained, intentional boundary work: consistently saying what you mean, following through on what you commit to, and choosing self-respect over approval even when it hurts. You've rebuilt something most people never had in the first place. Protect it.",
    "In the Red → Dialed": "A complete rebuilding of your relationship with yourself. Going from self-abandonment to solid self-trust in one assessment period is a profound transformation. You likely did deep work, whether through coaching, therapy, or relentless personal practice, to confront the patterns that had you living for everyone else. This is foundational. Everything else in your life will improve because of this shift.",
    "Maintained In the Red": "You're still abandoning yourself. Another period has passed and the people-pleasing, broken promises, and missing boundaries are all still in place. This pattern won't change on its own. It requires deliberate intervention: working with a coach or therapist on boundary work, or starting with one small commitment to yourself that you refuse to break for anyone.",
    "Maintained Below the Line": "Self-trust is still eroded. You know you should hold firmer boundaries, keep promises to yourself, and stop overriding your own needs, but the pattern persists. The most common reason this stays stuck is fear of the consequences of changing. Ask yourself what you're afraid would happen if you actually put yourself first. The answer will show you where the work is.",
    "Maintained Functional": "Your relationship with yourself is decent but hasn't deepened. Under normal conditions, you're solid. Under stress, the old patterns creep back. The next level requires practicing self-trust specifically in the moments where it's hardest, not just when it's comfortable. Identify your most common trigger and build a response plan for it.",
    "Maintained Dialed": "Your self-trust is holding strong. You continue to keep promises to yourself, hold boundaries, and make decisions from a place of self-respect. Sustaining this is harder than it looks because the world constantly tests your boundaries. The fact that you've maintained this means your foundation is genuine.",
    "Dialed → Functional": "Some cracks in your self-trust. You were operating from solid self-respect, and now you're noticing moments where you people-please, break a commitment to yourself, or override your own needs. Something shifted: a new relationship dynamic, increased pressure, or a situation where holding your ground felt too costly. Catch this before the old patterns reestablish.",
    "Functional → Below the Line": "Your self-trust has significantly eroded. Boundaries that were holding have softened, and you're breaking promises to yourself more than keeping them. You're likely back in a pattern of over-giving, under-advocating, and tolerating what you shouldn't. This regression often tracks with a specific relationship or situation pulling you into old patterns. Identify it and address it directly.",
    "Below the Line → In the Red": "You've slipped into full self-abandonment. Where there was already erosion, there's now a complete breakdown in how you relate to yourself. You're probably invisible to your own needs, deferring to everyone else, and resentful underneath. This needs immediate attention. Not business attention. Personal attention.",
    "Dialed → Below the Line": "A serious regression in self-trust. Something significant undermined your foundation. A toxic relationship dynamic, a period of intense people-pleasing, or a series of broken promises to yourself that compounded. You know what self-trust feels like. Rebuild the specific practices and boundaries that created it.",
    "Functional → In the Red": "You've gone from functional self-trust to complete self-abandonment. This collapse usually signals a specific relationship or situation that overwhelmed your boundaries. You may be in a dynamic where advocating for yourself feels impossible. You need external support to rebuild: a coach, therapist, or trusted friend who can help you see what you can't see from inside the pattern.",
    "Dialed → In the Red": "A complete collapse in your relationship with yourself. Something devastating disrupted the self-trust you had built. You've gone from someone who kept their word to themselves to someone who can barely identify their own needs. This requires compassion, not criticism. Get support, be patient with yourself, and start with the smallest possible act of self-respect. One kept promise. One held boundary. Build from there."
  },
  FA: {
    "In the Red → Below the Line": "You've slowed the damage. Where your family relationships were in active decline, you've started showing up differently, even if imperfectly. Maybe you had an honest conversation, started putting your phone down at dinner, or acknowledged the distance. The gap is still real, but you've stopped pretending it doesn't exist. That honesty is where repair begins.",
    "Below the Line → Functional": "Your family is feeling the difference. You've gone from giving them leftovers to giving them something real. You're probably more present during the time you spend together, communicating more honestly, or repairing conflicts faster. The distance that was building has started to close. Keep investing. Consistency matters more than perfection here.",
    "Functional → Dialed": "You've become the person you want to be with your family. The inconsistency that used to plague your presence has been resolved. You're showing up fully: patient, attentive, honest, and available. Your family doesn't just know you love them. They feel it. This is the part of life most founders sacrifice. The fact that you've built it is worth protecting above everything else.",
    "In the Red → Functional": "A major recovery in your most important relationships. You went from active damage to genuine presence. That required hard conversations, real behavioral change, and a willingness to prioritize family in a way that probably cost you something in your business. The progress is significant. You're functional, but Dialed is where the real security lives.",
    "Below the Line → Dialed": "You jumped from distance to deep connection. This kind of leap usually requires fundamental reprioritization: restructured work hours, hard conversations, consistent behavioral change, and a commitment to being present that you followed through on. Your family went from getting your leftovers to getting your best. Sustain this by protecting it with the same intensity you protect your business priorities.",
    "In the Red → Dialed": "A complete transformation in your family life. Going from active deterioration to full presence and connection is one of the most meaningful shifts on this entire assessment. Something woke you up to what you were losing, and you responded with everything you had. Whatever it cost you in other areas was worth it. Protect this with your life.",
    "Maintained In the Red": "Your family relationships are still deteriorating, and another period has passed without meaningful change. This is not something that resolves itself. The longer this continues, the harder the repair becomes. If there's one area where delayed action has permanent consequences, it's this one. Do something different today. Have the conversation. Put the phone down. Show up.",
    "Maintained Below the Line": "Your family is still getting your leftovers. You care, and they probably know that, but caring and showing up are not the same thing. The distance is still there. The tension is still building. Ask yourself honestly: if this continues for another year, where does it end? If that answer scares you, let it motivate change.",
    "Maintained Functional": "You're a good but inconsistent presence with your family. That hasn't changed. You show up for the big moments but drift during the everyday ones. The upgrade from Functional to Dialed here usually comes down to one specific habit: protecting a daily or weekly ritual of genuine, undistracted family time. Install it and watch everything shift.",
    "Maintained Dialed": "Your family presence is holding. You continue to show up with patience, honesty, and full attention. In a world that constantly pulls founders away from the people who matter most, sustaining this is remarkable. Don't let success or comfort make you complacent. The moment you start assuming your family is fine is the moment drift begins.",
    "Dialed → Functional": "Your family presence has slipped. Where you were fully showing up, you're now inconsistent. Work is probably bleeding back in: checking your phone at dinner, being mentally absent, or not repairing small tensions as quickly. Catch this before it becomes a pattern. The people closest to you felt the difference when you were Dialed. They'll feel this regression too.",
    "Functional → Below the Line": "The distance with your family has grown. You've gone from imperfect but present to genuinely giving them leftovers. Something shifted: more work pressure, less energy, or a slow erosion of the habits keeping you connected. Your family may not say anything directly, but they feel it. Re-prioritize before the gap becomes a chasm.",
    "Below the Line → In the Red": "Your family relationships are now in active decline. What was already strained has broken down further. Emotional absence, unresolved conflict, or outright neglect is creating damage that compounds daily. This is not an area where you can afford to wait for things to calm down at work. Act now. The repair window is not unlimited.",
    "Dialed → Below the Line": "A significant slide in your family relationships. You went from fully present to giving them scraps. Something big pulled you away: a business crisis, a personal struggle, or a period where you let everything else take priority. The distance that's opened up will take real effort to close. Start by acknowledging it openly to the people who matter.",
    "Functional → In the Red": "Your family went from getting an imperfect version of you to barely getting you at all. This level of regression usually signals a broader collapse: burnout, crisis, or a period where you checked out of everything personal. The damage here is accumulating fast. Whatever is consuming your attention needs to be balanced against what you're losing at home.",
    "Dialed → In the Red": "A devastating decline in your most important relationships. You went from fully present to absent. Something catastrophic happened in your life or business that consumed everything, and your family paid the price. The urgency here cannot be overstated. No business achievement will compensate for what's being lost. Begin repair today, even if it's just one honest conversation."
  },
  CO: {
    "In the Red → Below the Line": "You've broken the isolation. Where you were completely alone, you've started reaching out, reconnecting, or putting yourself in rooms with people again. It may feel awkward or forced, but the fact that you're doing it matters. The relationships might be thin right now, but thin beats nonexistent. Keep showing up. Depth comes with consistency.",
    "Below the Line → Functional": "Your social world has meaningfully expanded or deepened. You're spending more time with people who energize you, investing in friendships that matter, or engaging with a community that reflects your values. The transactional or shallow connections that dominated before are being replaced by something more real. You're no longer just connected. You're starting to be known.",
    "Functional → Dialed": "You've built genuine belonging. The people in your life know you deeply, challenge you honestly, and support you fully. This didn't happen by accident. You invested time and energy into the right relationships and let go of the ones draining you. As a founder, this kind of social wealth is both rare and invaluable. Maintain it actively. Friendships don't run on autopilot.",
    "In the Red → Functional": "A major shift from isolation to real connection. You went from having no genuine community to meaningful relationships that support you. That required vulnerability, initiative, and sustained effort. You probably joined something, deepened specific friendships, or allowed people to see more of who you really are. The foundation is real. Keep building on it.",
    "Below the Line → Dialed": "You jumped from shallow connections to genuine belonging. This kind of leap usually involves both adding the right people and limiting the wrong ones. You likely got intentional about who you spend time with, invested in relationships that demand honesty, and let yourself be fully seen. Sustain this by continuing to prioritize these relationships even when business demands spike.",
    "In the Red → Dialed": "From complete isolation to genuine community. This is one of the most difficult and meaningful transitions on this assessment. You likely overcame real barriers: fear of vulnerability, social anxiety, a history of betrayal, or the founder's tendency to go it alone. What you've built is not just socially pleasant. It's a strategic and psychological lifeline. Never take it for granted.",
    "Maintained In the Red": "You're still isolated, and another period has passed without connection. This isn't sustainable, and it's affecting more than your social life. It's affecting your judgment, your resilience, and your ability to see your own blind spots. The barrier to connection isn't time. It's usually vulnerability or habit. Commit to one social act this week: a lunch, a call, a meetup. Start anywhere.",
    "Maintained Below the Line": "Your social world is still thin or mostly transactional. You probably have people around you, but no one who really knows what's going on. This stagnation usually comes from not making social investment a priority or surrounding yourself with the wrong people. Evaluate who actually energizes you, and invest exclusively in those relationships for the next 30 days.",
    "Maintained Functional": "You have good relationships but haven't deepened them. You're liked but not fully known. The jump to Dialed in community usually requires more vulnerability: sharing what's really hard, asking for help, or showing the parts of yourself you normally keep hidden. The relationships that can handle that honesty are the ones worth investing in.",
    "Maintained Dialed": "Your community is strong and holding. You have genuine belonging, real friendships, and people who tell you the truth. Maintaining this requires continued investment because the natural pull of entrepreneurship is toward isolation. Keep showing up for the people who show up for you. This is one of your greatest assets.",
    "Dialed → Functional": "Some of your relationships have thinned. Where you had deep connections, you're now less invested or less available. This usually happens gradually: skipped gatherings, unanswered messages, less vulnerability. The people are still there, but the depth is fading. Re-engage before the distance becomes comfortable.",
    "Functional → Below the Line": "Your social world has weakened. You've gone from decent connections to relationships that feel thin, transactional, or neglected. You're probably spending less time with people who matter and more time either alone or in surface-level interactions. The isolation creep is real. Push back by reaching out to someone this week.",
    "Below the Line → In the Red": "You've slipped into genuine isolation. The thin connections you had have faded further, and you're now operating without meaningful community. This is a lonely and dangerous place for a founder. The longer you stay here, the more your judgment, resilience, and mental health will suffer. Breaking this pattern requires initiative, even when it feels like the last thing you have energy for.",
    "Dialed → Below the Line": "A significant decline in your social world. You went from genuine belonging to thin or neglected connections. Something consumed your social energy: a business sprint, a personal crisis, or simply letting relationships lapse. The community you built is likely still accessible, but you need to reinvest before the window closes.",
    "Functional → In the Red": "Your social world has collapsed. You went from decent connections to being genuinely alone. This kind of regression usually signals a broader withdrawal: depression, burnout, shame, or a period where you pulled away from everyone. The isolation is making everything else harder. Reach out to one person you trust. You don't have to explain everything. Just reconnect.",
    "Dialed → In the Red": "A complete loss of community. You went from genuine belonging to total isolation. Something massive disrupted your social world: a falling out, a move, a crisis that made you withdraw, or a period of shame that pushed everyone away. The loneliness you're in right now is not a reflection of your worth. It's a wound that needs tending. Start with one honest conversation with one person you trust."
  },
  WI: {
    "In the Red → Below the Line": "You've started to lift your head up from pure survival. Where you were entirely self-focused, you've begun to think about or engage with something beyond your own problems. Maybe you mentored someone, contributed to a cause, or reconnected with the idea that your work can serve a larger purpose. It's small, but it's the beginning of reconnection.",
    "Below the Line → Functional": "Impact is back on your radar and showing up in your actions. You're contributing more consistently through your work, your community, or direct service. The sporadic, guilt-driven engagement you had before has been replaced with something more intentional. Keep building the infrastructure that makes this consistent, not just something you do when you have extra capacity.",
    "Functional → Dialed": "Your contribution has become a core part of how you operate. It's woven into your work and your life in a way that feels authentic and sustainable. You're using your gifts with integrity and building something with ripple effects. This sense of purpose will sustain you through seasons when nothing else does.",
    "In the Red → Functional": "A significant reconnection to purpose. You went from total self-focus to meaningful, fairly consistent contribution. That shift required looking beyond your own survival and recognizing that giving is not a luxury but a source of energy and meaning. Whatever reconnected you to service, stay close to it.",
    "Below the Line → Dialed": "You jumped from sporadic impact to genuine, consistent contribution. This usually comes from finding the specific intersection of your gifts, your values, and a need in the world, then committing to it. You're no longer contributing when it's convenient. You're contributing because it's who you are. This alignment fuels everything else.",
    "In the Red → Dialed": "A complete reconnection to purpose and contribution. Going from total self-focus to consistent, aligned impact is a transformation that changes not just what you do but who you are. Something reignited your sense of service, and you committed fully. This sense of purpose is now one of your most powerful assets.",
    "Maintained In the Red": "You're still disconnected from any sense of contribution beyond yourself. Everything still revolves around your own survival or success. This isn't a character issue. It's a signal that your world has contracted too much. You don't need to save the world. Serve one person, one cause, or one community in a way that reminds you why your work matters.",
    "Maintained Below the Line": "Impact is still on the back burner. You acknowledge it matters but haven't made it consistent. The most common barrier isn't lack of desire. It's the belief that you can't afford to give right now. That belief is costing you more than you think in lost motivation and purpose. Start small. Volunteer one hour. Mentor one person. See what it gives back.",
    "Maintained Functional": "Your contribution is consistent but hasn't deepened. You're doing good work for others, but it's not fully integrated into your identity or your rhythm. The jump to Dialed usually requires a clearer connection between your specific gifts and how you serve. When contribution becomes an expression of who you are rather than something you do on the side, everything shifts.",
    "Maintained Dialed": "Your sense of purpose and contribution is sustaining. You continue to serve consistently and authentically, and it continues to fuel your work and your life. This is the flywheel most founders never build. Keep feeding it. The moment contribution becomes obligation instead of expression, it loses its power.",
    "Dialed → Functional": "Your contribution has become less consistent. Where it was core to your life, it's now more of an afterthought. This usually happens when business demands increase and you start treating impact as the first thing to sacrifice. Reconnect with the specific way you contribute and re-protect the time for it.",
    "Functional → Below the Line": "Impact has slipped from your priorities again. What was fairly consistent has become sporadic or reactive. You're probably focused inward on business challenges, and service has been deprioritized. This makes sense short-term but costs you motivation and meaning long-term. Put contribution back on your calendar.",
    "Below the Line → In the Red": "You've lost touch with purpose entirely. What was already sporadic has disappeared. Everything is self-focused now. This regression often accompanies a broader contraction in your life, and it's both a symptom and a cause of the emptiness you may be feeling. Even a small act of genuine service this week could interrupt the spiral.",
    "Dialed → Below the Line": "A significant decline in contribution. You went from deeply purposeful to barely engaged. Something major consumed your capacity and contribution was the casualty. The longer you stay disconnected from purpose, the harder it becomes to find motivation for everything else. Reconnect with your original 'why' and rebuild.",
    "Functional → In the Red": "Your sense of purpose has collapsed. You went from meaningful engagement to complete self-focus. This usually signals a broader crisis: burnout, disillusionment, or a period where survival consumed everything. Contribution feels impossible right now, but it may actually be part of the medicine. Serving others can break the cycle of self-referential exhaustion.",
    "Dialed → In the Red": "A total loss of purpose and contribution. Something devastating knocked you off course. The alignment between your gifts, your values, and your service has been completely disrupted. Don't try to rebuild the full picture right now. Just do one thing for someone else this week. Purpose rebuilds through action, not reflection."
  },
  VS: {
    "In the Red → Below the Line": "You've moved from total chaos to at least having a direction, even if it's shaky. Where you were reacting to everything and committing to nothing, you've started to narrow your focus. You probably made some decisions about what to pursue and what to drop. The direction may still change, but having one at all is a massive improvement over expensive improvisation.",
    "Below the Line → Functional": "Your strategy has solidified. You've gone from guessing and drifting to having a general sense of where you're heading. You're saying 'no' more often, your priorities are clearer, and your decisions have more coherence. The strategy might still shift more than it should, but the fog has lifted considerably. Tighten it further and you'll feel the relief in every part of your business.",
    "Functional → Dialed": "Your strategy is locked in. You know exactly where you're going, why it matters, and what you're saying no to. The shiny object temptation that used to pull you off course no longer has power because your clarity is stronger than the FOMO. This level of strategic focus is rare and compounds into everything: better execution, better decisions, calmer leadership.",
    "In the Red → Functional": "A major strategic transformation. You went from no strategy at all to a clear enough direction that your decisions have coherence. That required sitting down, making hard choices, and committing to a path while letting go of alternatives. You probably pruned aggressively. Stay committed. Strategy only works if you execute it long enough to see results.",
    "Below the Line → Dialed": "You jumped from strategic fog to total clarity. This usually comes from doing deep work on your vision: connecting your business direction to your personal values, identifying the one or two things that actually matter, and building the discipline to decline everything else. Your strategy is now a weapon. Use it.",
    "In the Red → Dialed": "From zero strategy to crystal clarity. This is a foundational transformation that changes the trajectory of your entire business. You likely went through a period of deep reflection and brutal prioritization. Every distraction you eliminated and every 'no' you said created the space for this clarity. Protect it ferociously.",
    "Maintained In the Red": "You still have no strategy. Another period of expensive improvisation has passed. The reason this hasn't changed is usually one of two things: you're afraid of committing to the wrong direction, or you're addicted to optionality. Both cost you the same thing. Commit to a direction for 90 days. If it's wrong, you'll learn faster by executing than by deliberating.",
    "Maintained Below the Line": "Your strategy is still foggy. You have ideas and hopes but not a clear plan. The most common reason this stays stuck is overthinking: waiting for the perfect strategy instead of committing to a good one. Clarity doesn't come from more thinking. It comes from deciding, executing, and adjusting. Pick a direction, simplify it, and go.",
    "Maintained Functional": "You have a decent strategy that hasn't sharpened. You're probably still getting pulled by shiny objects occasionally or tolerating ambiguity that a cleaner plan would eliminate. The jump to Dialed usually comes from one brave simplification: cutting a product line, choosing one audience, or reducing your priorities to three or fewer. What are you holding onto that you should let go of?",
    "Maintained Dialed": "Your strategic clarity is holding. You continue to know exactly where you're going and why. The challenge at this level is resisting the pressure to add complexity. Success creates opportunities, and opportunities create temptation. Your greatest strategic risk right now isn't missing something. It's diluting what's already working.",
    "Dialed → Functional": "Your strategy has loosened. Where you had total clarity, some ambiguity has crept in. Maybe you said 'yes' to something that doesn't quite fit, or you started entertaining new directions without fully committing. Reconnect with your core strategic decisions and recommit to what you already know is right.",
    "Functional → Below the Line": "Your strategic focus has deteriorated. You've gone from a reasonable direction to drifting again. Priorities have multiplied, decisions feel inconsistent, and you're probably chasing more than you're executing. Something disrupted your strategy: a market shift, a client demand, a new idea, or simple drift. Sit down and re-clarify before the confusion spreads to your team and your execution.",
    "Below the Line → In the Red": "Your strategy has collapsed into chaos. What was already foggy has become completely reactive. You're back to saying 'yes' to everything, changing direction constantly, and hoping something works. This is the most expensive state a business can operate in. Stop everything, get clear on one direction, and commit to it for at least 90 days.",
    "Dialed → Below the Line": "A serious strategic regression. You went from crystal clarity to genuine confusion. Something significant disrupted your direction: a major pivot, a market shock, a loss of confidence in your plan, or trying to pursue too many things at once. The clarity you had before was built through discipline. You need to do that disciplined work again.",
    "Functional → In the Red": "Your strategy has disintegrated. You went from a general direction to no direction at all. This kind of collapse usually signals a crisis of confidence or a major disruption that made your previous plan feel irrelevant. Whether the old plan was right or wrong, operating without any plan is worse. Decide on a new direction and commit, even imperfectly.",
    "Dialed → In the Red": "A complete strategic collapse. You went from knowing exactly where you were going to total chaos. Something fundamental broke: your confidence in your model, your market, or your vision. This is disorienting but not permanent. The strategic thinking that built your original clarity is still available to you. Start by grounding yourself in your values and what you actually want before reaching for tactics."
  },
  EX: {
    "In the Red → Below the Line": "You've started shipping again. Where you were planning without producing, you've begun to actually finish things and move the needle. The output isn't consistent yet, and you still need external pressure sometimes, but the paralysis has broken. Build on this momentum by installing a simple weekly rhythm before the energy fades.",
    "Below the Line → Functional": "Your execution has meaningfully improved. You're getting the important things done more often than not, and the gap between what you plan and what you produce has narrowed. You likely installed some structure: weekly priorities, time blocks, or a review system. The inconsistency hasn't fully resolved, but the trend is clearly upward. Lock in the rhythm that's working.",
    "Functional → Dialed": "You're executing at an elite level. What you plan, you complete. What you start, you finish. Your weekly rhythm is no longer something you have to enforce. It runs on its own. The gap between intention and action has essentially closed. This is the compounding engine that separates businesses that grow from businesses that stall. Maintain the system.",
    "In the Red → Functional": "A major execution turnaround. You went from not producing to consistently getting important things done. That required more than motivation. You likely built real structure: a planning system, protected time blocks, a review cadence, or accountability that kept you on track. The foundation is in place. Strengthen it until it's automatic.",
    "Below the Line → Dialed": "You jumped from inconsistent to fully executing. This kind of leap usually comes from installing a complete execution system: weekly planning, daily non-negotiables, progress reviews, and a practiced ability to catch avoidance early. You didn't just start working harder. You built a machine. Keep it running.",
    "In the Red → Dialed": "From paralysis to elite execution. This is one of the most impactful transformations on this entire assessment. You went from weeks passing without meaningful output to a system that makes progress inevitable. Whatever structure, support, or intervention catalyzed this shift, it worked at a deep level. Protect it.",
    "Maintained In the Red": "You're still not executing. Another period of planning without producing has passed. Intention continues to masquerade as action. The problem is almost always structural, not motivational. You don't need to want it more. You need a system that makes doing the work easier than avoiding it. Install a weekly planning ritual and one daily non-negotiable. Start there.",
    "Maintained Below the Line": "You're still busy without being effective. You start more than you finish, priorities shift mid-week, and the important work keeps getting pushed. This plateau usually breaks when you commit to one thing: finish your top three priorities each week before starting anything new. Completion, not activity, is the metric that matters.",
    "Maintained Functional": "You're productive but still inconsistent. Good weeks and bad weeks continue to alternate. You have a system, but you don't fully trust or follow it on the hard days. The jump to Dialed usually requires one upgrade: a non-negotiable weekly review where you account for what you planned, what you completed, and what got in the way. That accountability loop is the missing piece.",
    "Maintained Dialed": "Your execution is consistently excellent. You ship what you plan, finish what you start, and your rhythm holds even during difficult weeks. This is the hardest tier to maintain because there's always a reason to skip the system. The fact that you haven't is a testament to the discipline you've built. Keep the rhythm. It's your most valuable business asset.",
    "Dialed → Functional": "Your execution rhythm has slipped. Where you were consistently shipping, you're now having hit-or-miss weeks. The system is still there, but you're not following it as tightly. Maybe you skipped a weekly review, let a focus block get overridden, or stopped catching avoidance early. Tighten the system before the inconsistency becomes your new norm.",
    "Functional → Below the Line": "Your execution has broken down. You've gone from getting the important things done to starting more than you finish and letting weeks slip. The structure that was holding you together has weakened. Something consumed your capacity or disrupted your rhythm. Rebuild the weekly planning system and recommit to your non-negotiables.",
    "Below the Line → In the Red": "Execution has ground to a halt. Planning without shipping, starting without finishing, intending without acting. This regression needs a hard reset. Clear your plate of everything nonessential, pick the one thing that would move your business forward most, and commit to finishing it this week. Momentum starts with one completion.",
    "Dialed → Below the Line": "A serious execution regression. Multiple parts of your rhythm broke at once. This often happens during periods of major change, overwhelm, or when you take on too much and your system can't absorb it. Simplify your priorities, rebuild the weekly rhythm, and start with fewer commitments that you actually complete.",
    "Functional → In the Red": "Your execution has collapsed. You went from generally productive to not producing. This kind of drop usually signals something deeper: burnout, a crisis of motivation, strategic confusion that makes execution feel pointless, or an emotional issue draining your capacity to act. Address the root cause. Execution will return when the underlying block is removed.",
    "Dialed → In the Red": "A complete breakdown in execution. You went from elite output to nothing. Something catastrophic disrupted your ability to function: burnout, a personal crisis, a business shock, or a combination. Don't try to rebuild the full system right now. Start with one small completed task per day and build back from there. The rhythm that served you before can be rebuilt, but not all at once."
  },
  OH: {
    "In the Red → Below the Line": "You've started building the foundation. Where your business was a complete black box, you now have some visibility into what's happening. You probably started tracking basic metrics, identified a bottleneck, or began documenting a process. It's early, but you've moved from total chaos to at least knowing what you don't know. Keep building.",
    "Below the Line → Functional": "Your operations are becoming real. You've gone from unpredictable and founder-dependent to having some systems, some data, and some predictability. You're tracking more, delegating more, and can forecast roughly where things are heading. The business is starting to function like a business instead of a one-person show. Keep investing in the systems that reduce your personal bottleneck.",
    "Functional → Dialed": "Your operations are institutionalized. You know your numbers precisely, your systems are documented and running without you, and the business has genuine predictability. You've successfully transitioned from being the engine to being the architect. Maintain the discipline of reviewing and improving your systems regularly.",
    "In the Red → Functional": "A significant operational transformation. You went from no foundation to a functioning business with real systems. That required building almost everything from scratch: tracking, processes, delegation, documentation. The progress is substantial. The risk now is assuming the job is done. Operations need continuous improvement. Stay in the system-building mindset.",
    "Below the Line → Dialed": "You jumped from patchy operations to fully systemized. This usually happens when a founder commits fully to building the machine: documenting every process, installing real metrics dashboards, delegating with clear accountability, and building infrastructure that runs without heroics. You've built something most founders never will. Maintain it with regular operational reviews.",
    "In the Red → Dialed": "From operational chaos to a fully systemized business. This is a transformative shift that fundamentally changes your business and your quality of life. You built everything: metrics, processes, delegation structures, documentation. The business went from entirely dependent on you to having genuine operational independence. This is rare and valuable.",
    "Maintained In the Red": "Your business still has no operational foundation. Every month still feels like starting from zero. You don't know your numbers, you have no systems, and you are the single point of failure. This will not improve on its own. Start with the absolute basics: track your weekly leads and conversion rate. Just those two numbers. Build from there.",
    "Maintained Below the Line": "Operations are still fragile. You have some awareness of your numbers and maybe a few processes, but the business is still over-reliant on you and largely unpredictable. The reason this stays stuck is usually resistance to the unsexy work of documentation and systems. The next breakthrough isn't a new strategy. It's making what you already have reliable and repeatable.",
    "Maintained Functional": "You have decent operations that haven't improved. You know your numbers roughly, delegation is happening but you're still too involved, and the systems work but aren't robust. The jump to Dialed usually requires investing in the things you keep deprioritizing: completing your SOPs, building a real dashboard, or delegating the tasks you're holding because 'it's faster if I do it.' It's not.",
    "Maintained Dialed": "Your operational excellence is sustained. The systems, data, and predictability you've built continue to hold. The challenge at this level is continued optimization: finding the next bottleneck, improving the next process, delegating the next responsibility. Operational excellence is a practice, not a destination.",
    "Dialed → Functional": "Your operations have softened. Where everything was systemized and predictable, some processes have lapsed or metrics tracking has become less rigorous. This usually happens when things are going well and the urgency to maintain systems fades. Don't let comfort erode what you built. Reinstate the review cadences and systems that are slipping.",
    "Functional → Below the Line": "Your operations have regressed. Systems that were working have broken down, delegation has pulled back, or your numbers have become opaque again. Something disrupted the operational progress: team changes, rapid growth, or simply neglect. The business is becoming more dependent on you again. Address this before it undoes all the leverage you built.",
    "Below the Line → In the Red": "Your operations are back in chaos. What little structure existed has collapsed. You're back to being the single point of failure, flying blind on numbers, and making it up as you go. This regression is dangerous because it compounds quickly. Stop and rebuild the basics: tracking, processes, and one act of delegation.",
    "Dialed → Below the Line": "A major operational regression. You went from systemized to fragile and founder-dependent. This usually signals a major disruption: losing key team members, rapid scaling that outgrew your systems, or a period of neglect. The systems you built before can be rebuilt, but the longer you wait, the more institutional knowledge you lose.",
    "Functional → In the Red": "Your operations have collapsed. You went from a functioning business to total chaos. This kind of regression usually comes from compounding failures: a team departure, a financial crisis, or a period where systems maintenance was completely abandoned. Focus on the one metric and one process that matter most and rebuild from there.",
    "Dialed → In the Red": "A complete operational collapse. The systems, predictability, and delegation you built are all gone. Something catastrophic happened: a team implosion, a business model break, a financial crisis, or a founder breakdown that made maintenance impossible. The good news is you've built operational excellence before, so you know how. Stabilize the immediate chaos before attempting to rebuild the full system."
  },
  EC: {
    "In the Red → Below the Line": "You've started to acknowledge the misalignment. Where you were building something that actively worked against your wellbeing, you've begun questioning whether the model is right. Maybe you made a structural change, identified what doesn't fit, or admitted that how you've been operating isn't sustainable. That honesty is the first step. Now design what you actually want.",
    "Below the Line → Functional": "Your business is becoming more aligned with who you are. The tension between what you're building and what you want has decreased. You probably made specific adjustments: changed how you sell, restructured your delivery, adjusted your workload, or shifted your model to better fit your energy and values. The friction is lower. Keep refining until the alignment is complete.",
    "Functional → Dialed": "Your business is now fully safe to grow. The way you sell, deliver, lead, and structure your work matches who you actually are. The model fits your nervous system. The goal is clean. Because there's no internal conflict between what you're building and what you want, you can execute with full power and zero self-sabotage. This is the unlock most founders never find.",
    "In the Red → Functional": "A major ecological shift. You went from building something you didn't want to a business that mostly fits who you are. That required honest self-assessment and structural changes that probably felt risky. The sabotage patterns that were holding you back have likely diminished significantly. Keep closing the remaining gaps between your model and your authentic self.",
    "Below the Line → Dialed": "You transformed your business from a source of tension into a source of alignment. This usually requires fundamental redesign: restructuring offers, changing how you sell, adjusting your delivery model, or redefining success on your own terms. The result is a business that energizes you instead of depleting you. Scaling from here feels like expansion rather than entrapment.",
    "In the Red → Dialed": "A complete ecological transformation. You went from building a profitable prison to a business that genuinely serves your life. This is arguably the most important shift on the entire assessment because it removes the hidden driver behind most self-sabotage. When the destination is safe, you stop unconsciously preventing yourself from arriving. Everything you build from here has the wind at its back.",
    "Maintained In the Red": "You're still building something you don't want. Another period has passed and the misalignment between your business model and your actual life hasn't changed. You're still overriding your nervous system, still dreading aspects of how you operate, and still sabotaging growth because part of you knows the destination isn't safe. This requires fundamental redesign, not optimization of a broken model.",
    "Maintained Below the Line": "The tension is still there. You feel the misalignment between your business and your values, but you haven't addressed it. Maybe you're afraid of the revenue hit, the identity shift, or the uncertainty of changing something that technically works. But 'technically works' while quietly draining you isn't a business model. It's a slow trap. Name the specific misalignment and decide whether to fix it or accept it.",
    "Maintained Functional": "Your business mostly fits but the remaining misalignment is persistent. There's still something that doesn't sit right, whether it's how you sell, what you deliver, the pace the model demands, or the identity it requires. You've been tolerating this gap rather than addressing it. The jump to Dialed requires identifying that last point of friction and redesigning around it. What would you change if money weren't a factor? Start there.",
    "Maintained Dialed": "Your business continues to be fully aligned with who you are and what you want. Growth feels clean, execution happens without internal resistance, and the model fits your life rather than threatening it. Sustain this by regularly asking yourself: if this scaled further, would I be more free or more trapped? As long as the answer is more free, you're on track.",
    "Dialed → Functional": "Some misalignment has crept back in. Where your business fully matched who you are, something has shifted: a new offer that doesn't quite fit, a client type that drains you, or a structural change that created friction. Catch this early. Ecological misalignment starts small but compounds into self-sabotage and resistance if left unaddressed.",
    "Functional → Below the Line": "The tension between your business and your wellbeing has increased. You've gone from minor friction to real misalignment. Something about how you're operating has moved further from who you are. Maybe you took on work you shouldn't have, scaled in a direction that doesn't fit, or let the model drift toward something that demands more than you want to give. Identify the source and restructure.",
    "Below the Line → In the Red": "Your business has become something you actively don't want. What was already misaligned has worsened to the point where your nervous system is in rebellion. You're likely sabotaging, stalling, or burning out because part of you knows this isn't right. Stop and fundamentally reconsider what you're building. Continuing to execute on a model that works against you is the most expensive mistake a founder can make.",
    "Dialed → Below the Line": "A serious ecological regression. You went from full alignment to real internal tension. Something structural changed: a pivot, a scaling decision, a new partnership, or a shift in how you operate that moved the business away from who you are. The sabotage and resistance you may be feeling isn't laziness. It's your system telling you the model is wrong. Listen to it.",
    "Functional → In the Red": "Your business has gone from slightly misaligned to fundamentally wrong for who you are. This kind of regression usually signals a major structural decision that backfired: a pivot that doesn't fit, growth that created a trap, or a sustained period of overriding your instincts until the system broke. Stop optimizing. Redesign. The goal needs to be safe to pursue before execution matters.",
    "Dialed → In the Red": "A complete ecological collapse. Your business went from fully aligned to something you genuinely don't want. This is the most consequential regression on the entire assessment. Something fundamentally broke the alignment between your work and your life: a catastrophic pivot, a partnership that changed everything, or a period of decisions that moved the business in a direction your deepest self rejects. Everything else will stall until this is addressed. Stop building. Redesign from your values up."
  }
} as const;
```


### Results Page Transition Rendering + Priority Shift Logic (`app/(dashboard)/assessment/results/page.tsx`)

```text
"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Compass,
  Brain,
  Focus,
  Heart,
  Home,
  Users,
  Globe,
  Telescope,
  Rocket,
  Gauge,
  Leaf,
  MessageSquare,
  ArrowRight,
  BarChart3,
  AlertTriangle,
  Shield,
  Eye,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Briefcase,
} from "lucide-react";
import {
  VapiBreakdownWheel,
  VapiComparativeWheel,
} from "@/components/vapi-wheel";
import { PageHeader } from "@/components/page-header";
import { DOMAIN_INTERPRETATIONS, ARENA_INTERPRETATIONS } from "@/lib/vapi/interpretations";
import {
  getTier,
  getTierColor,
  ARCHETYPE_DESCRIPTIONS,
  getPriorityMatrix,
  getRankedArenas,
  normalizeVapiArchetypeName,
  type VapiTier,
  type VapiArchetype,
  type PriorityQuadrant,
} from "@/lib/vapi/scoring";
import { ARCHETYPES_FULL } from "@/lib/vapi/archetypes-full";
import { ARCHETYPE_ACCENT_COLORS, getArchetypeIcon } from "@/lib/vapi/archetype-icons";
import { DOMAINS, ARENAS } from "@/lib/vapi/quiz-data";
import {
  ALIGNED_MOMENTUM_CONTENT,
  ALIGNED_MOMENTUM_NAME,
  DRIVER_CONTENT,
  getDriverFallbackContent,
  getDriverState,
  type VapiAssignedDriverName,
  type VapiDriverFallbackType,
  type VapiDriverName,
  type VapiDriverState,
} from "@/lib/vapi/drivers";
import { DRIVER_ACCENT_COLORS, DriverIcon } from "@/lib/vapi/driver-icons";
import { getDriverTransitionSummary } from "@/lib/vapi/driver-progress";
import { VAPI_PROGRESS_TRANSITIONS } from "@/lib/vapi/progress-transitions";
import {
  MyPlanCalloutLargeApp,
  MyPlanInlineCalloutApp,
} from "@/components/my-plan-callouts";

type MetricKey = "overall" | `arena:${string}` | `domain:${string}`;

function coerceDriverName(
  value: string | null | undefined
): VapiDriverName | null {
  return value && value in DRIVER_CONTENT ? (value as VapiDriverName) : null;
}

function coerceAssignedDriverName(
  value: string | null | undefined
): VapiAssignedDriverName | null {
  if (!value) return null;
  if (value === ALIGNED_MOMENTUM_NAME) return ALIGNED_MOMENTUM_NAME;
  return value in DRIVER_CONTENT ? (value as VapiDriverName) : null;
}

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity,  IA: Compass, ME: Brain, AF: Focus,
  RS: Heart, FA: Home, CO: Users, WI: Globe,
  VS: Telescope, EX: Rocket, OH: Gauge, EC: Leaf,
};

const ARENA_ICONS: Record<string, React.ElementType> = {
  personal: BarChart2,
  relationships: Heart,
  business: Briefcase,
};

function ArchetypeSection({
  archetype,
  arenaScores,
}: {
  archetype: VapiArchetype;
  arenaScores: Record<string, number>;
}) {
  const [expanded, setExpanded] = useState(false);
  const full = ARCHETYPES_FULL[archetype];
  const short = ARCHETYPE_DESCRIPTIONS[archetype] || "";
  const ArchetypeIcon = getArchetypeIcon(archetype);
  const archetypeColor = ARCHETYPE_ACCENT_COLORS[archetype];
  const rankedArenas =
    archetype === "The Journeyman"
      ? getRankedArenas(arenaScores)
      : null;
  const laggingArena = rankedArenas?.[0];
  const secondArena = rankedArenas?.[1];
  const strongestArena = rankedArenas?.[2];

  return (
    <div className="rounded-2xl border border-border p-6 space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Your Founder Archetype
      </h2>
      <h3 className="text-2xl font-serif font-bold flex items-center gap-2">
        <ArchetypeIcon className="h-6 w-6 shrink-0" style={{ color: archetypeColor }} />
        {archetype}
      </h3>
      {full && (
        <>
          <p className="text-muted-foreground text-sm italic">{full.tagline}</p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {short}
          </p>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {expanded ? "Show less" : "Explore archetype"}
          </button>
          {expanded && full && (
            <div className="space-y-4 pt-4 border-t border-border text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Full description</h4>
                <p className="text-muted-foreground leading-relaxed">{full.description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-1">Strength</h4>
                <p className="text-muted-foreground leading-relaxed">{full.strength}</p>
              </div>
              <div>
                <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Shadow</h4>
                <p className="text-muted-foreground leading-relaxed">{full.shadow}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Constraint</h4>
                <p className="text-muted-foreground leading-relaxed">{full.constraint}</p>
              </div>
              <div>
                <h4 className="font-semibold text-accent mb-1">Growth path</h4>
                <p className="text-muted-foreground leading-relaxed">{full.growthPath}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Program phase</h4>
                <p className="text-muted-foreground leading-relaxed">{full.programPhase}</p>
              </div>
            </div>
          )}
          {archetype === "The Journeyman" &&
            laggingArena &&
            secondArena &&
            strongestArena && (
              <div className="rounded-xl border border-accent/25 bg-accent/5 p-4 text-sm">
                <p className="text-xs font-medium uppercase tracking-wider text-accent">
                  Your lagging arena
                </p>
                <p className="mt-2 text-muted-foreground leading-relaxed">
                  Your lagging arena is {laggingArena.label}. At{" "}
                  {laggingArena.score.toFixed(1)}, it&apos;s solid, but it&apos;s not
                  keeping pace with your strength elsewhere. This is your current edge.
                  Examine the domains within this arena. One or two are likely pulling the
                  average down. That&apos;s where focused attention will have the highest
                  leverage. You don&apos;t need to overhaul anything. You need to bring
                  this arena into alignment with what you&apos;ve already built.
                </p>
              </div>
            )}
          <div className="border-t border-border/70 pt-4">
            <Link
              href="/archetypes"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Learn more about all founder archetypes{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      )}
      {!full && (
        <>
          <p className="text-muted-foreground text-sm leading-relaxed">{short}</p>
          <div className="border-t border-border/70 pt-4">
            <Link
              href="/archetypes"
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              Learn more about all founder archetypes{" "}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </>
      )}
      <MyPlanInlineCalloutApp variant="archetype" borderAccent={archetypeColor} />
    </div>
  );
}

function DriverSection({
  assignedDriver,
  secondaryDriver,
  driverScores,
  topDriverScore,
  driverState,
  driverFallbackType,
}: {
  assignedDriver: string | null;
  secondaryDriver?: string | null;
  driverScores?: Record<string, number>;
  topDriverScore?: number;
  driverState?: VapiDriverState;
  driverFallbackType?: VapiDriverFallbackType;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    mechanism: false,
    cost: false,
    wayOut: false,
    alignedShowUp: false,
    alignedPossible: false,
    alignedProtect: false,
  });

  const resolvedDriverState = getDriverState({
    assignedDriver: coerceAssignedDriverName(assignedDriver),
    driverFallbackType,
  });
  const normalizedDriverState = driverState || resolvedDriverState;
  const isAlignedMomentum = normalizedDriverState === "aligned_momentum";
  const driverName =
    !isAlignedMomentum && assignedDriver && assignedDriver in DRIVER_CONTENT
      ? (assignedDriver as VapiDriverName)
      : null;
  const secondaryDriverName =
    !isAlignedMomentum && secondaryDriver && secondaryDriver in DRIVER_CONTENT
      ? (secondaryDriver as VapiDriverName)
      : null;
  const driver = driverName ? DRIVER_CONTENT[driverName] : null;
  const secondary = secondaryDriverName
    ? DRIVER_CONTENT[secondaryDriverName]
    : null;
  const strength =
    driverName && driverScores
      ? Math.max(topDriverScore ?? 0, driverScores[driverName] ?? 0)
      : topDriverScore ?? 0;
  const accent = isAlignedMomentum
    ? ALIGNED_MOMENTUM_CONTENT.colorAccent
    : driverName
      ? DRIVER_ACCENT_COLORS[driverName]
      : "#FF6B1A";
  const note =
    "This driver is identified based on patterns in your scores and priorities. It represents the most likely internal pattern producing your results. It is a hypothesis, not a diagnosis. If it resonates, it's a powerful starting point. If it doesn't fully fit, your detailed scores and intake reflection will surface a more precise picture.";
  const alignedMomentumNote =
    "Aligned Momentum reflects the current state of your internal operating system based on your VAPI scores. It is not permanent. It's maintained through ongoing practice, honest self-assessment, and the boundaries and habits that produced it. Retake the VAPI regularly to confirm this state is holding.";
  const fallbackContent = getDriverFallbackContent(driverFallbackType || "standard");

  return (
    <div
      id="driver-section"
      className="scroll-mt-24 rounded-2xl border border-border bg-gradient-to-br from-accent/5 via-card/90 to-background p-6 shadow-sm space-y-5"
    >
      <div className="space-y-3">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {isAlignedMomentum
            ? "What's Fueling This Pattern"
            : "What's Driving This Pattern"}
        </p>
        {isAlignedMomentum ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border"
                  style={{
                    backgroundColor: `${accent}14`,
                    borderColor: `${accent}33`,
                  }}
                >
                  <DriverIcon driver={ALIGNED_MOMENTUM_NAME} size={64} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    {ALIGNED_MOMENTUM_CONTENT.name}
                  </h2>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    {ALIGNED_MOMENTUM_CONTENT.tagline}
                  </p>
                </div>
              </div>
            </div>
            <blockquote
              className="rounded-xl border-l-4 px-4 py-4 text-xl sm:text-2xl font-serif font-semibold leading-tight text-foreground"
              style={{
                borderLeftColor: accent,
                backgroundColor: `${accent}14`,
              }}
            >
              &quot;{ALIGNED_MOMENTUM_CONTENT.coreState}&quot;
            </blockquote>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ALIGNED_MOMENTUM_CONTENT.description}
            </p>
            <div className="space-y-3">
              {[
                {
                  key: "alignedShowUp",
                  title: "How This Shows Up in Your Scores",
                  body: ALIGNED_MOMENTUM_CONTENT.howThisShowsUp,
                },
                {
                  key: "alignedPossible",
                  title: "What This Makes Possible",
                  body: ALIGNED_MOMENTUM_CONTENT.whatThisMakesPossible,
                },
                {
                  key: "alignedProtect",
                  title: "How to Protect It",
                  body: ALIGNED_MOMENTUM_CONTENT.howToProtectIt,
                },
              ].map((section) => {
                const isOpen = expanded[section.key];
                return (
                  <div
                    key={section.key}
                    className="rounded-xl border border-border bg-background/70"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((current) => ({
                          ...current,
                          [section.key]: !current[section.key],
                        }))
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {section.title}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-4 py-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {section.body}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="space-y-4 border-t border-border/70 pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {alignedMomentumNote}
              </p>
              <Link
                href="/drivers"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Explore all driver patterns <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        ) : driver ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border"
                  style={{
                    backgroundColor: `${accent}14`,
                    borderColor: `${accent}33`,
                  }}
                >
                  <DriverIcon driver={driverName!} size={64} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-serif font-bold text-foreground">
                    {driver.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Core fear:</span>{" "}
                    {driver.coreFear}
                  </p>
                </div>
              </div>
              <span
                className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider"
                style={{
                  borderColor: `${accent}33`,
                  backgroundColor: `${accent}14`,
                  color: accent,
                }}
              >
                Pattern strength: {strength} / {driver.maxPossible}
              </span>
            </div>
            <blockquote
              className="rounded-xl border-l-4 px-4 py-4 text-xl sm:text-2xl font-serif font-semibold leading-tight text-foreground"
              style={{
                borderLeftColor: accent,
                backgroundColor: `${accent}14`,
              }}
            >
              &quot;{driver.coreBelief}&quot;
            </blockquote>
            <p className="text-sm italic text-muted-foreground leading-relaxed">
              {driver.tagline}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {driver.description}
            </p>
            <div className="space-y-3">
              {[
                {
                  key: "mechanism" as const,
                  title: "How This Shows Up in Your Scores",
                  body: driver.mechanism,
                },
                {
                  key: "cost" as const,
                  title: "What This Is Costing You",
                  body: driver.whatItCosts,
                },
                {
                  key: "wayOut" as const,
                  title: "The Way Out",
                  body: driver.theWayOut,
                },
              ].map((section) => {
                const isOpen = expanded[section.key];
                return (
                  <div
                    key={section.key}
                    className="rounded-xl border border-border bg-background/70"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((current) => ({
                          ...current,
                          [section.key]: !current[section.key],
                        }))
                      }
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-foreground">
                        {section.title}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="border-t border-border px-4 py-4">
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {section.body}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="space-y-4 border-t border-border/70 pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                {note}
              </p>
              <Link
                href="/drivers"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Learn more about all driver patterns <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            {!isAlignedMomentum && driverName ? (
              <MyPlanInlineCalloutApp variant="driver" borderAccent={accent} />
            ) : null}
            {secondary && (
              <div className="space-y-3 border-t border-border/70 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Secondary Pattern
                </p>
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: `${DRIVER_ACCENT_COLORS[secondaryDriverName!]}14`,
                      borderColor: `${DRIVER_ACCENT_COLORS[secondaryDriverName!]}33`,
                    }}
                  >
                    <DriverIcon driver={secondaryDriverName!} size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {secondary.name}
                    </h3>
                    <p className="text-sm italic text-muted-foreground">
                      &quot;{secondary.coreBelief}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {secondary.tagline}
                    </p>
                    <Link
                      href="/drivers"
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                    >
                      Learn more about all driver patterns <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-foreground">
              {fallbackContent.heading}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {fallbackContent.text}
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              {note}
            </p>
            {normalizedDriverState === "no_driver" && (
              <Link
                href="/drivers"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Explore all driver patterns in the Driver Library{" "}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const QUADRANT_META: Record<
  PriorityQuadrant,
  { icon: React.ElementType; color: string; bg: string; border: string }
> = {
  "Critical Priority": { icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/15", border: "border-red-500/30" },
  "Protect & Sustain": { icon: Shield, color: "text-green-500", bg: "bg-green-500/15", border: "border-green-500/30" },
  Monitor: { icon: Eye, color: "text-yellow-500", bg: "bg-yellow-500/15", border: "border-yellow-500/30" },
  "Possible Over-Investment": { icon: TrendingDown, color: "text-blue-400", bg: "bg-blue-500/15", border: "border-blue-500/30" },
};

type ResultData = {
  id: string;
  domainScores: Record<string, number>;
  arenaScores: Record<string, number>;
  overallScore: number;
  archetype: string;
  importance: Record<string, number>;
  assignedDriver: string | null;
  secondaryDriver: string | null;
  driverScores: Record<string, number>;
  topDriverScore: number;
  secondaryDriverScore: number | null;
  primaryToSecondaryMargin: number;
  driverState: VapiDriverState;
  driverFallbackType: VapiDriverFallbackType;
  createdAt: string;
};

function getMetricLabel(metricKey: MetricKey): string {
  if (metricKey === "overall") return "Overall Score";
  if (metricKey.startsWith("arena:")) {
    const key = metricKey.slice(6);
    return ARENAS.find((arena) => arena.key === key)?.label ?? key;
  }
  const code = metricKey.slice(7);
  return DOMAINS.find((domain) => domain.code === code)?.name ?? code;
}

function getMetricIcon(metricKey: MetricKey): React.ElementType {
  if (metricKey === "overall") return BarChart2;
  if (metricKey.startsWith("arena:")) return ARENA_ICONS[metricKey.slice(6)] ?? BarChart2;
  return DOMAIN_ICONS[metricKey.slice(7)] ?? Activity;
}

function getMetricScore(result: ResultData, metricKey: MetricKey): number | null {
  if (metricKey === "overall") return result.overallScore / 10;
  if (metricKey.startsWith("arena:")) return result.arenaScores[metricKey.slice(6)] ?? null;
  return result.domainScores[metricKey.slice(7)] ?? null;
}

function getMetricTier(result: ResultData, metricKey: MetricKey): VapiTier | null {
  const score = getMetricScore(result, metricKey);
  return score == null ? null : getTier(score);
}

function getMetricInterpretation(result: ResultData, metricKey: MetricKey): string {
  const tier = getMetricTier(result, metricKey);
  if (!tier) return "";
  if (metricKey === "overall") return "";
  if (metricKey.startsWith("arena:")) {
    return ARENA_INTERPRETATIONS[metricKey.slice(6)]?.[tier] ?? "";
  }
  return DOMAIN_INTERPRETATIONS[metricKey.slice(7)]?.[tier] ?? "";
}

type ProgressNarrative = {
  key: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  body: string;
  previousBelief?: string | null;
  currentBelief?: string | null;
  previousScore?: string;
  currentScore?: string;
  change?: string;
  changeDirection?: "up" | "down" | "same";
  detailLines?: string[];
  supportingNote?: string;
  linkHref?: string;
  linkLabel?: string;
};

const PROGRESS_TRANSITIONS = VAPI_PROGRESS_TRANSITIONS as Record<
  string,
  Record<string, string>
>;

function formatTransitionLabel(previousTier: VapiTier, currentTier: VapiTier) {
  return previousTier === currentTier
    ? `Maintained ${currentTier}`
    : `${previousTier} to ${currentTier}`;
}

function formatMetricScore(score: number | null, tier: VapiTier | null) {
  if (score == null) return "--";
  return `${score.toFixed(1)} / 10${tier ? ` (${tier})` : ""}`;
}

function getChangeDirection(
  change: number | null
): "up" | "down" | "same" {
  if (change == null || change === 0) return "same";
  return change > 0 ? "up" : "down";
}

function formatDriverSummaryLine(
  label: string,
  driverName: VapiDriverName | null,
  score: number | null | undefined
) {
  if (!driverName || typeof score !== "number") {
    return `${label}: None`;
  }
  return `${label}: ${driverName} (${score} points)`;
}

function formatPrimaryDriverDetailLine(
  driverState: VapiDriverState,
  driverName: VapiAssignedDriverName | null,
  score: number | null | undefined
) {
  if (driverState === "aligned_momentum" || driverName === ALIGNED_MOMENTUM_NAME) {
    return `Current state: ${ALIGNED_MOMENTUM_NAME}`;
  }
  return formatDriverSummaryLine(
    "Primary driver",
    driverName && driverName in DRIVER_CONTENT ? (driverName as VapiDriverName) : null,
    score
  );
}

function formatSecondaryDriverDetailLine(
  driverState: VapiDriverState,
  driverName: VapiDriverName | null,
  score: number | null | undefined
) {
  if (driverState === "aligned_momentum") {
    return "Secondary driver: None";
  }
  return formatDriverSummaryLine("Secondary driver", driverName, score);
}

function getSecondaryDriverTransitionNote(
  previousState: VapiDriverState,
  currentState: VapiDriverState,
  previousDriver: VapiDriverName | null,
  currentDriver: VapiDriverName | null
) {
  if (
    previousState === "aligned_momentum" ||
    currentState === "aligned_momentum"
  ) {
    return null;
  }
  if (!previousDriver && currentDriver) {
    return `A secondary pattern has emerged: ${currentDriver}. This suggests a second internal driver is becoming active alongside your primary pattern. Read more in the Driver Library.`;
  }
  if (previousDriver && !currentDriver) {
    return `Your secondary pattern (${previousDriver}) is no longer detected. Your primary driver is now more dominant, or the secondary pattern has been addressed.`;
  }
  if (previousDriver && currentDriver && previousDriver !== currentDriver) {
    return `Your secondary pattern has shifted from ${previousDriver} to ${currentDriver}. The underlying influence on your behavior is evolving. Explore both patterns in the Driver Library.`;
  }
  if (previousDriver && currentDriver && previousDriver === currentDriver) {
    return `Your secondary pattern (${currentDriver}) remains consistent alongside your primary driver.`;
  }
  return null;
}

function getMetricTransitionLookupKey(metricKey: MetricKey) {
  if (metricKey === "overall") return "overall";
  if (metricKey.startsWith("arena:")) return getMetricLabel(metricKey);
  return metricKey.slice(7);
}

function getMetricTransitionNarrative(
  previousResult: ResultData,
  currentResult: ResultData,
  metricKey: MetricKey
): ProgressNarrative | null {
  const previousScore = getMetricScore(previousResult, metricKey);
  const currentScore = getMetricScore(currentResult, metricKey);
  const previousTier = getMetricTier(previousResult, metricKey);
  const currentTier = getMetricTier(currentResult, metricKey);

  if (!previousTier || !currentTier) return null;

  const transitionLabel = formatTransitionLabel(previousTier, currentTier);
  const transitionText =
    PROGRESS_TRANSITIONS[getMetricTransitionLookupKey(metricKey)]?.[
      previousTier === currentTier
        ? `Maintained ${currentTier}`
        : `${previousTier} → ${currentTier}`
    ] ?? "";
  const change =
    previousScore != null && currentScore != null
      ? currentScore - previousScore
      : null;
  const metricLabel =
    metricKey === "overall" ? "Composite Score" : getMetricLabel(metricKey);

  return {
    key: metricKey,
    eyebrow:
      metricKey === "overall"
        ? "Composite Score Transition"
        : metricKey.startsWith("arena:")
          ? "Arena Transition"
          : "Domain Transition",
    title: metricLabel,
    subtitle: transitionLabel,
    body: transitionText,
    previousScore: `Previous: ${formatMetricScore(previousScore, previousTier)}`,
    currentScore: `Current: ${formatMetricScore(currentScore, currentTier)}`,
    change:
      change != null
        ? `Change: ${change >= 0 ? "+" : ""}${change.toFixed(1)}`
        : undefined,
    changeDirection: getChangeDirection(change),
  };
}

function getSelectedProgressInterpretationNarrative(
  result: ResultData,
  metricKey: MetricKey
): ProgressNarrative | null {
  if (metricKey === "overall") return null;

  const body = getMetricInterpretation(result, metricKey);
  const score = getMetricScore(result, metricKey);
  const tier = getMetricTier(result, metricKey);

  if (!body || score == null || !tier) return null;

  return {
    key: `interpretation:${metricKey}`,
    eyebrow: metricKey.startsWith("arena:")
      ? "Arena Interpretation"
      : "Domain Interpretation",
    title: getMetricLabel(metricKey),
    subtitle: `Current: ${formatMetricScore(score, tier)}`,
    body,
  };
}

function getLaggingArenaSnapshot(arenaScores: Record<string, number> | undefined) {
  if (!arenaScores || Object.keys(arenaScores).length === 0) return null;
  const ranked = getRankedArenas(arenaScores);
  const low = ranked[0];
  if (!low) return null;
  return { key: low.key, label: low.label, score: low.score };
}

function getArchetypeTransitionNarrative(
  previousArchetype: string | null,
  currentArchetype: string | null,
  context?: {
    previousArenas?: Record<string, number>;
    currentArenas?: Record<string, number>;
  }
): ProgressNarrative | null {
  if (!previousArchetype && !currentArchetype) return null;

  const prev =
    normalizeVapiArchetypeName(previousArchetype) ?? previousArchetype;
  const curr = normalizeVapiArchetypeName(currentArchetype) ?? currentArchetype;

  const isArchitectFamily = (value: string | null) =>
    value === "The Architect" || value === "The Journeyman";

  const lagPrev = getLaggingArenaSnapshot(context?.previousArenas);
  const lagCurr = getLaggingArenaSnapshot(context?.currentArenas);

  if (prev === "The Journeyman" && curr === "The Journeyman") {
    let body: string;
    if (lagPrev && lagCurr && lagPrev.key !== lagCurr.key) {
      body = `You remain a Journeyman, but your lagging arena has shifted from ${lagPrev.label} to ${lagCurr.label}. This sometimes happens when focus on one area causes another to slip. Rebalance your attention to close the new gap without losing ground on what improved.`;
    } else if (lagPrev && lagCurr && lagPrev.key === lagCurr.key) {
      const delta = lagCurr.score - lagPrev.score;
      if (delta > 0.05) {
        body = `You remain a Journeyman, but your lagging arena has improved from ${lagPrev.score.toFixed(1)} to ${lagCurr.score.toFixed(1)}. You're making progress toward full integration. Continue the focused work.`;
      } else {
        body = `You remain a Journeyman with ${lagCurr.label} still trailing. Your foundation is strong, but the gap hasn't closed yet. Revisit what's preventing progress in this arena.`;
      }
    } else {
      body =
        "You remain a Journeyman. Your foundation is strong; keep working the lagging arena until the gap closes.";
    }
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Journeyman Sustained",
      subtitle: "The Journeyman continues",
      body,
    };
  }

  if (
    prev &&
    curr === "The Journeyman" &&
    prev !== "The Architect" &&
    prev !== "The Journeyman"
  ) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Significant Progress",
      subtitle: `${prev} to The Journeyman`,
      body: "You've moved from an imbalanced or deficit pattern into The Journeyman. This represents substantial progress: your composite score is now 7.0 or above with strength across all three arenas. You're no longer dealing with major imbalances or deficits. One arena is still trailing the others, and that's your current growth edge. Close that gap and you reach Architect-level integration.",
    };
  }

  if (prev === "The Journeyman" && curr === "The Architect") {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Full Integration Achieved",
      subtitle: "The Journeyman to The Architect",
      body: "You've closed the gap. Your previous assessment showed you as a Journeyman with one arena lagging. That arena has now come into alignment with the others. You're operating as an Architect: fully integrated strength across Business, Relationships, and Self. This is the result of focused work on the area that was trailing. Protect this integration. The work now is maintenance and continued growth from a position of strength.",
    };
  }

  if (prev === "The Architect" && curr === "The Journeyman") {
    const lowLabel = lagCurr?.label ?? "lowest";
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "A Gap Has Opened",
      subtitle: "The Architect to The Journeyman",
      body: `Your previous assessment showed Architect-level integration. This time, one arena has fallen below the others, moving you to The Journeyman. This isn't a crisis: your overall foundation remains strong, but something has slipped. Identify what changed in your ${lowLabel} arena and address it before the gap widens.`,
    };
  }

  if (prev === "The Journeyman" && curr && curr !== "The Architect") {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Ground Lost",
      subtitle: `The Journeyman to ${curr}`,
      body: `Your previous assessment showed you as a Journeyman: strong across all arenas with one slightly trailing. This time, more significant gaps have emerged, moving you to ${curr}. Something has shifted. Read your new archetype description to understand the current pattern and what it requires.`,
    };
  }

  if (
    prev &&
    curr === "The Architect" &&
    !isArchitectFamily(prev)
  ) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Has Shifted",
      subtitle: `${prev} to The Architect`,
      body: "You've moved into genuine integration. Your personal, relational, and business arenas are now reinforcing each other instead of competing. Protect this. The systems and habits that got you here are worth defending.",
    };
  }

  if (prev && curr && prev === curr) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Is Consistent",
      subtitle: `Still showing up as ${curr}`,
      body: `Your score shape still maps most closely to ${curr}. The same pattern across your personal, relational, and business scores is still present in your results. Revisit the archetype section above to see where this pattern is supporting you and where it is still constraining you.`,
    };
  }

  if (prev && curr) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Your Founder Archetype Has Shifted",
      subtitle: `${prev} to ${curr}`,
      body: `Your latest score pattern now maps most closely to ${curr} instead of ${prev}. That suggests the way your personal, relational, and business scores relate to each other has changed. Compare the two archetype sections to see which strengths became more dominant and which constraints have surfaced.`,
    };
  }

  if (curr) {
    return {
      key: "archetype",
      eyebrow: "Archetype Transition",
      title: "Founder Archetype Identified",
      subtitle: curr,
      body: `This assessment maps clearly to ${curr}. Use the archetype section above to understand the dominant score shape currently defining your results.`,
    };
  }

  return {
    key: "archetype",
    eyebrow: "Archetype Transition",
    title: "Founder Archetype Unclear",
    body: "Your latest assessment does not map cleanly to a single archetype pattern. Review the score breakdown to see which arena is pulling the pattern away from your prior results.",
  };
}

function getDirectionClasses(direction: "up" | "down" | "same" | undefined) {
  if (direction === "up") return "text-green-600";
  if (direction === "down") return "text-red-600";
  return "text-amber-600";
}

function getScrollIndicatorState(element: HTMLDivElement | null) {
  if (!element) {
    return { showUp: false, showDown: false };
  }
  const showUp = element.scrollTop > 8;
  const showDown =
    element.scrollHeight - element.scrollTop - element.clientHeight > 8;
  return { showUp, showDown };
}

function ProgressLineChart({
  results,
  metricKey,
}: {
  results: ResultData[];
  metricKey: MetricKey;
}) {
  const ordered = [...results].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const scores = ordered
    .map((entry) => getMetricScore(entry, metricKey))
    .filter((score): score is number => score != null);
  const priorityValues = ordered.map((entry) =>
    metricKey.startsWith("domain:") ? entry.importance?.[metricKey.slice(7)] ?? null : null
  );
  const hasPriorityLine = priorityValues.some((value) => value != null);

  if (scores.length === 0) return null;

  const width = 680;
  const height = 520;
  const padX = 48;
  const padTop = 20;
  const padBottom = 28;
  const chartHeight = height - padTop - padBottom;
  const chartWidth = width - padX * 2;
  const maxY = 10;

  const points = ordered.map((entry, index) => {
    const score = getMetricScore(entry, metricKey) ?? 0;
    const x =
      ordered.length === 1
        ? width / 2
        : padX + (index / (ordered.length - 1)) * chartWidth;
    const y = padTop + ((maxY - score) / maxY) * chartHeight;
    return { x, y, score, label: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const priorityPoints = ordered.map((entry, index) => {
    const value = metricKey.startsWith("domain:")
      ? entry.importance?.[metricKey.slice(7)] ?? null
      : null;
    if (value == null) return null;
    const x =
      ordered.length === 1
        ? width / 2
        : padX + (index / (ordered.length - 1)) * chartWidth;
    const y = padTop + ((maxY - value) / maxY) * chartHeight;
    return { x, y, value, label: new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
  });
  const priorityLinePath = priorityPoints
    .map((point, index) => {
      if (!point) return "";
      const prefix = priorityPoints.slice(0, index).some(Boolean) ? "L" : "M";
      return `${prefix} ${point.x} ${point.y}`;
    })
    .filter(Boolean)
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        {[0, 2, 4, 6, 8, 10].map((tick) => {
          const y = padTop + ((maxY - tick) / maxY) * chartHeight;
          return (
            <g key={tick}>
              <line x1={padX} x2={width - padX} y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="4 4" />
              <text x={padX - 12} y={y + 4} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">
                {tick}
              </text>
            </g>
          );
        })}
        <path d={linePath} fill="none" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        {hasPriorityLine && priorityLinePath && (
          <path
            d={priorityLinePath}
            fill="none"
            stroke="rgba(88,34,51,0.7)"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        <line
          x1={padX}
          x2={width - padX}
          y1={padTop + ((maxY - 8) / maxY) * chartHeight}
          y2={padTop + ((maxY - 8) / maxY) * chartHeight}
          stroke="rgba(212, 170, 112, 0.7)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="5" fill="hsl(var(--accent))" />
            <circle cx={point.x} cy={point.y} r="2.5" fill="white" />
            <text x={point.x} y={height - 10} textAnchor="middle" fontSize="11" fill="hsl(var(--muted-foreground))">
              {point.label}
            </text>
          </g>
        ))}
        {priorityPoints.map((point) =>
          point ? (
            <g key={`priority-${point.label}`}>
              <circle cx={point.x} cy={point.y} r="4" fill="rgba(88,34,51,0.85)" />
              <circle cx={point.x} cy={point.y} r="2" fill="white" />
            </g>
          ) : null
        )}
      </svg>
    </div>
  );
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const [result, setResult] = useState<ResultData | null>(null);
  const [allResults, setAllResults] = useState<ResultData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedArenas, setExpandedArenas] = useState<Record<string, boolean>>({});
  const [expandedPriorityDomains, setExpandedPriorityDomains] = useState<Record<string, boolean>>({});
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("overall");
  const [selectedProgressMetric, setSelectedProgressMetric] = useState<MetricKey>("overall");
  const [arenaCardsExpanded, setArenaCardsExpanded] = useState(false);
  const [breakdownDropdownOpen, setBreakdownDropdownOpen] = useState(false);
  const [progressDropdownOpen, setProgressDropdownOpen] = useState(false);
  const [progressView, setProgressView] = useState<"line" | "wheel">("line");
  const breakdownSidebarRef = useRef<HTMLDivElement | null>(null);
  const progressSidebarRef = useRef<HTMLDivElement | null>(null);
  const [breakdownSidebarIndicators, setBreakdownSidebarIndicators] = useState({
    showUp: false,
    showDown: false,
  });
  const [progressSidebarIndicators, setProgressSidebarIndicators] = useState({
    showUp: false,
    showDown: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash === "#where-to-focus") {
      const el = document.getElementById("where-to-focus");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  useEffect(() => {
    const load = async () => {
      const [allRes, singleRes] = await Promise.all([
        fetch("/api/vapi").then((r) => r.json()).catch(() => ({ results: [] })),
        id ? fetch(`/api/vapi?id=${id}`).then((r) => r.json()).catch(() => ({})) : Promise.resolve({}),
      ]);
      const all = (allRes.results || []).map((r: {
        id: string;
        domainScores: Record<string, number>;
        arenaScores: Record<string, number>;
        overallScore: number;
        archetype: string;
        importance: Record<string, number>;
        assignedDriver?: string | null;
        secondaryDriver?: string | null;
        driverScores?: Record<string, number>;
        topDriverScore?: number;
        secondaryDriverScore?: number | null;
        primaryToSecondaryMargin?: number;
        driverState?: VapiDriverState;
        driverFallbackType?: VapiDriverFallbackType;
        createdAt: string;
      }) => ({
        id: r.id,
        domainScores: r.domainScores || {},
        arenaScores: r.arenaScores || {},
        overallScore: r.overallScore,
        archetype: normalizeVapiArchetypeName(r.archetype) ?? r.archetype,
        importance: r.importance || {},
        assignedDriver: r.assignedDriver || null,
        secondaryDriver: r.secondaryDriver || null,
        driverScores: r.driverScores || {},
        topDriverScore: r.topDriverScore || 0,
        secondaryDriverScore: r.secondaryDriverScore ?? null,
        primaryToSecondaryMargin: r.primaryToSecondaryMargin ?? 0,
        driverState:
          r.driverState ||
          getDriverState({
            assignedDriver: coerceAssignedDriverName(r.assignedDriver),
            driverFallbackType: r.driverFallbackType || "standard",
          }),
        driverFallbackType: r.driverFallbackType || "standard",
        createdAt: r.createdAt,
      }));
      setAllResults(all);
      if (id && singleRes.result) {
        const sr = singleRes.result as Record<string, unknown>;
        setResult({
          ...singleRes.result,
          archetype:
            normalizeVapiArchetypeName(sr.archetype as string) ??
            (sr.archetype as string),
          driverState:
            singleRes.result.driverState ||
            getDriverState({
              assignedDriver: coerceAssignedDriverName(
                singleRes.result.assignedDriver
              ),
              driverFallbackType:
                singleRes.result.driverFallbackType || "standard",
            }),
          driverFallbackType: singleRes.result.driverFallbackType || "standard",
        });
      } else if (all.length) {
        setResult(all[0]);
      } else {
        setResult(null);
      }
    };
    load().finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sync = () => {
      const expanded = window.innerWidth >= 640;
      setArenaCardsExpanded(expanded);
      if (expanded) {
        setExpandedArenas(
          Object.fromEntries(ARENAS.map((arena) => [arena.key, true]))
        );
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncIndicators = () => {
      setBreakdownSidebarIndicators(
        getScrollIndicatorState(breakdownSidebarRef.current)
      );
      setProgressSidebarIndicators(
        getScrollIndicatorState(progressSidebarRef.current)
      );
    };

    syncIndicators();
    window.addEventListener("resize", syncIndicators);
    return () => window.removeEventListener("resize", syncIndicators);
  }, [result, allResults, selectedMetric, selectedProgressMetric, progressView]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-muted-foreground">
          Loading results...
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-foreground">No results found.</p>
        <button
          onClick={() => router.push("/assessment")}
          className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-medium"
        >
          Take the Assessment
        </button>
      </div>
    );
  }

  const overallTier = getTier(result.overallScore / 10);
  const overallColor = getTierColor(overallTier);
  const archetype = (normalizeVapiArchetypeName(result.archetype) ??
    result.archetype) as VapiArchetype;
  const ArchetypeIcon = getArchetypeIcon(archetype);
  const archetypeColor = ARCHETYPE_ACCENT_COLORS[archetype];
  const priorityMatrix = getPriorityMatrix(
    result.domainScores,
    result.importance || {}
  );

  const topStrengths = DOMAINS.map((d) => ({ ...d, score: result.domainScores[d.code] || 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const priorityFocusAreas = DOMAINS.map((d) => ({ ...d, score: result.domainScores[d.code] || 0 }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const criticalPriorities = priorityMatrix.filter(
    (p) => p.quadrant === "Critical Priority"
  );
  const protectSustain = priorityMatrix.filter(
    (p) => p.quadrant === "Protect & Sustain"
  );
  const monitor = priorityMatrix.filter((p) => p.quadrant === "Monitor");
  const overInvestment = priorityMatrix.filter(
    (p) => p.quadrant === "Possible Over-Investment"
  );
  const selectedMetricScore = getMetricScore(result, selectedMetric);
  const selectedMetricTier = getMetricTier(result, selectedMetric);
  const selectedMetricColor = selectedMetricTier
    ? getTierColor(selectedMetricTier)
    : overallColor;
  const selectedMetricInterpretation = getMetricInterpretation(result, selectedMetric);
  const sortedResults = [...allResults].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const latestProgressResult = sortedResults[0] ?? result;
  const previousProgressResult = sortedResults[1] ?? result;
  const previousPriority =
    selectedProgressMetric.startsWith("domain:")
      ? previousProgressResult.importance?.[selectedProgressMetric.slice(7)] ?? null
      : null;
  const latestPriority =
    selectedProgressMetric.startsWith("domain:")
      ? latestProgressResult.importance?.[selectedProgressMetric.slice(7)] ?? null
      : null;
  const compositeTransition = getMetricTransitionNarrative(
    previousProgressResult,
    latestProgressResult,
    "overall"
  );
  const archetypeTransition = getArchetypeTransitionNarrative(
    previousProgressResult.archetype || null,
    latestProgressResult.archetype || null,
    {
      previousArenas: previousProgressResult.arenaScores,
      currentArenas: latestProgressResult.arenaScores,
    }
  );
  const previousAssignedDriver = coerceAssignedDriverName(
    previousProgressResult.assignedDriver
  );
  const currentAssignedDriver = coerceAssignedDriverName(
    latestProgressResult.assignedDriver
  );
  const previousSecondaryDriver = coerceDriverName(
    previousProgressResult.secondaryDriver
  );
  const currentSecondaryDriver = coerceDriverName(
    latestProgressResult.secondaryDriver
  );
  const driverTransition = getDriverTransitionSummary(
    previousProgressResult.driverState,
    latestProgressResult.driverState,
    previousAssignedDriver,
    currentAssignedDriver
  );
  const secondaryDriverTransitionNote = getSecondaryDriverTransitionNote(
    previousProgressResult.driverState,
    latestProgressResult.driverState,
    previousSecondaryDriver,
    currentSecondaryDriver
  );
  const metricGroups: Array<{ label: string; items: MetricKey[] }> = [
    { label: "Composite", items: ["overall"] },
    { label: "Arena", items: ARENAS.map((arena) => `arena:${arena.key}` as MetricKey) },
    { label: "Domain", items: DOMAINS.map((domain) => `domain:${domain.code}` as MetricKey) },
  ];

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Assessment Results"
        subtitle={new Date(result.createdAt).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      />

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Overall Score + Wheel (matches dashboard alignment at a glance) */}
          <div className="rounded-2xl border border-border bg-card/80 p-6 space-y-6 shadow-sm overflow-visible">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              <div className={`flex flex-wrap items-baseline gap-3 ${archetype ? "" : "sm:col-span-2"}`}>
                <span
                  className="text-5xl sm:text-6xl font-bold font-serif"
                  style={{ color: overallColor }}
                >
                  {(result.overallScore / 10).toFixed(1)}
                </span>
                <span className="text-lg text-muted-foreground">/ 10</span>
                <span
                  className="font-semibold px-3 py-1.5 rounded-full text-sm text-white"
                  style={{ backgroundColor: overallColor }}
                >
                  {overallTier}
                </span>
              </div>
              {archetype && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${archetypeColor}20`, color: archetypeColor }}
                  >
                    <ArchetypeIcon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-extrabold text-foreground">
                    {archetype}
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-1 border-b border-border/50 w-fit">
                  Top 3 strengths
                </p>
                <ul className="space-y-2.5 mt-2">
                  {topStrengths.map((d) => {
                    const Icon = DOMAIN_ICONS[d.code];
                    const color = getTierColor(getTier(d.score));
                    return (
                      <li key={d.code} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-1.5 text-foreground">
                          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                          {d.name}
                        </span>
                        <span className="font-semibold shrink-0 tabular-nums" style={{ color }}>
                          {d.score.toFixed(1)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pb-1 border-b border-border/50 w-fit">
                  Priority focus areas
                </p>
                <ul className="space-y-2.5 mt-2">
                  {priorityFocusAreas.map((d) => {
                    const Icon = DOMAIN_ICONS[d.code];
                    const color = getTierColor(getTier(d.score));
                    return (
                      <li key={d.code} className="flex items-center justify-between gap-3 text-sm">
                        <span className="flex items-center gap-1.5 text-foreground">
                          {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                          {d.name}
                        </span>
                        <span className="font-semibold shrink-0 tabular-nums" style={{ color }}>
                          {d.score.toFixed(1)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Archetype — expandable with full content */}
          <ArchetypeSection archetype={archetype} arenaScores={result.arenaScores} />

          <DriverSection
            assignedDriver={result.assignedDriver}
            secondaryDriver={result.secondaryDriver}
            driverScores={result.driverScores}
            topDriverScore={result.topDriverScore}
            driverState={result.driverState}
            driverFallbackType={result.driverFallbackType}
          />

          {/* Explore Your Score */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Explore Your Score
            </h2>
            <p className="text-sm text-muted-foreground">
              Dig into your composite, arena, and domain scores. Choose a metric from the menu or tap a wedge on the wheel.
            </p>
            <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm border-l-4 border-l-accent">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                      {getMetricLabel(selectedMetric)}
                    </p>
                    <div className="lg:hidden relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setBreakdownDropdownOpen((open) => !open)}
                        className="inline-flex items-center gap-1 rounded-full py-1 px-2.5 border border-border bg-background text-[10px] font-medium uppercase tracking-wider text-foreground hover:border-foreground/30 transition-colors max-w-[110px]"
                        aria-haspopup="listbox"
                        aria-expanded={breakdownDropdownOpen}
                      >
                        <span className="truncate">{getMetricLabel(selectedMetric)}</span>
                        <ChevronDown
                          className="w-3 h-3 text-muted-foreground flex-shrink-0 transition-transform"
                          style={{ transform: breakdownDropdownOpen ? "rotate(180deg)" : undefined }}
                        />
                      </button>
                      {breakdownDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 z-20 w-52 bg-background border border-border rounded-lg shadow-lg overflow-hidden max-h-[280px] overflow-y-auto">
                          <div className="space-y-0.5 p-1.5">
                            {metricGroups.map((group) => (
                              <div key={group.label}>
                                <div className="text-[10px] font-semibold text-foreground mt-1.5 first:mt-0 px-2 py-0.5">
                                  {group.label}
                                </div>
                                {group.items.map((metricKey) => {
                                  const Icon = getMetricIcon(metricKey);
                                  const isSelected = selectedMetric === metricKey;
                                  return (
                                    <button
                                      key={`dropdown-${metricKey}`}
                                      type="button"
                                      onClick={() => {
                                        setSelectedMetric(metricKey);
                                        setBreakdownDropdownOpen(false);
                                      }}
                                      className={`flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors border ${
                                        isSelected
                                          ? "bg-foreground text-background border-foreground"
                                          : "border-transparent text-foreground hover:bg-secondary hover:border-border"
                                      }`}
                                    >
                                      <Icon className="w-3 h-3 flex-shrink-0" />
                                      {getMetricLabel(metricKey)}
                                    </button>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2 flex-wrap mb-4">
                    <span className="text-4xl sm:text-5xl font-bold font-serif text-foreground">
                      {selectedMetricScore != null ? selectedMetricScore.toFixed(1) : "—"}
                    </span>
                    <span className="text-xl text-muted-foreground">/ 10</span>
                    {selectedMetricTier && (
                      <span
                        className="font-semibold px-3 py-1 rounded-full text-sm text-white"
                        style={{ backgroundColor: selectedMetricColor }}
                      >
                        {selectedMetricTier}
                      </span>
                    )}
                  </div>
                  <VapiBreakdownWheel
                    domainScores={result.domainScores}
                    metricKey={selectedMetric}
                    onMetricSelect={(metricKey) => setSelectedMetric(metricKey as MetricKey)}
                  />
                  <p className="lg:hidden text-center text-xs text-muted-foreground mt-3">
                    Tap a domain to explore your score
                  </p>
                </div>
                <div className="hidden lg:flex lg:w-52 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-4 flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Metric
                  </p>
                  <div className="relative flex-1 min-h-0">
                    <div
                      ref={breakdownSidebarRef}
                      onScroll={(event) =>
                        setBreakdownSidebarIndicators(
                          getScrollIndicatorState(event.currentTarget)
                        )
                      }
                      className="space-y-1 max-h-[370px] overflow-y-auto pr-1"
                    >
                      {metricGroups.map((group) => (
                        <div key={`sidebar-${group.label}`}>
                          <div className="text-sm font-semibold text-foreground mt-3 first:mt-0">
                            {group.label}
                          </div>
                          {group.items.map((metricKey) => {
                            const Icon = getMetricIcon(metricKey);
                            const isSelected = selectedMetric === metricKey;
                            return (
                              <button
                                key={`sidebar-${metricKey}`}
                                type="button"
                                onClick={() => setSelectedMetric(metricKey)}
                                className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                                  isSelected
                                    ? "bg-foreground text-background border-foreground"
                                    : "border-transparent text-foreground hover:bg-secondary hover:border-border"
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                {getMetricLabel(metricKey)}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    {breakdownSidebarIndicators.showUp && (
                      <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-2 pb-6 bg-gradient-to-b from-background to-transparent pointer-events-none">
                        <ChevronUp className="w-5 h-5 text-foreground/70" />
                      </div>
                    )}
                    {breakdownSidebarIndicators.showDown && (
                      <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-2 pt-6 bg-gradient-to-t from-background to-transparent pointer-events-none">
                        <ChevronDown className="w-5 h-5 text-foreground/70" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {selectedMetricInterpretation && (
                <div className="mt-6 border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedMetricInterpretation}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Arena Scores */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Arena Scores
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 items-start sm:items-stretch">
              {ARENAS.map((arena) => {
                const score = result.arenaScores[arena.key] || 0;
                const tier = getTier(score);
                const color = getTierColor(tier);
                const isExpanded = expandedArenas[arena.key] ?? false;
                const interpretation = ARENA_INTERPRETATIONS[arena.key]?.[tier];

                return (
                  <div
                    key={arena.key}
                    className="rounded-xl border border-border bg-card/80 p-5 space-y-3 shadow-sm self-start sm:self-stretch sm:min-h-[260px] h-auto sm:h-full flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{arena.label}</h3>
                      <div
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: color }}
                      >
                        {tier}
                      </div>
                    </div>
                    <div className="text-3xl font-bold font-serif" style={{ color }}>
                      {score.toFixed(1)}
                    </div>
                    {!arenaCardsExpanded && interpretation && (
                      <button
                        type="button"
                        onClick={() => setExpandedArenas((e) => ({ ...e, [arena.key]: !isExpanded }))}
                        className="flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        {isExpanded ? "Hide" : "Read interpretation"}
                      </button>
                    )}
                    {(arenaCardsExpanded || isExpanded) && interpretation && (
                      <p className="text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border mt-auto">
                        {interpretation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority Matrix / Where to Focus */}
          {result.importance &&
            Object.keys(result.importance).length > 0 && (
              <div id="where-to-focus" className="space-y-3 scroll-mt-6">
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Priority Matrix
                </h2>

                {[
                  { label: "Critical Priority", items: criticalPriorities, desc: "High importance, low score — focus here first" },
                  { label: "Protect & Sustain", items: protectSustain, desc: "High importance, high score — don't neglect these" },
                  { label: "Monitor", items: monitor, desc: "Lower importance, lower score — keep an eye on these" },
                  { label: "Possible Over-Investment", items: overInvestment, desc: "Lower importance, high score — could redirect energy" },
                ].map(
                  (section) =>
                    section.items.length > 0 && (
                      <div
                        key={section.label}
                        className={`rounded-2xl border ${QUADRANT_META[section.label as PriorityQuadrant].border} ${QUADRANT_META[section.label as PriorityQuadrant].bg} p-4 space-y-3 shadow-sm`}
                      >
                        <div className="flex items-center gap-2">
                          {(() => {
                            const meta = QUADRANT_META[section.label as PriorityQuadrant];
                            const QIcon = meta.icon;
                            return (
                              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${meta.bg} ${meta.color}`}>
                                <QIcon className="h-3.5 w-3.5" />
                                {section.label}
                              </div>
                            );
                          })()}
                          <span className="text-xs text-muted-foreground">
                            {section.desc}
                          </span>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2 items-start">
                          {section.items.map((item) => {
                            const Icon = DOMAIN_ICONS[item.domain];
                            const tier = getTier(item.score);
                            const color = getTierColor(tier);
                            const interpretation = DOMAIN_INTERPRETATIONS[item.domain]?.[tier];
                            const isExpanded = expandedPriorityDomains[item.domain] ?? false;
                            return (
                              <div
                                key={item.domain}
                                className="rounded-lg border border-border bg-card/50 p-3 self-start"
                              >
                                <div className="flex items-center gap-3">
                                  {Icon && <Icon className="h-4 w-4 text-accent" />}
                                  <div className="flex-1">
                                    <span className="text-sm">{item.domainName}</span>
                                    <div className="text-muted-foreground text-xs mt-0.5">
                                      Priority: {item.importance}/10
                                    </div>
                                  </div>
                                  <div className="text-right text-xs">
                                    <div className="font-medium" style={{ color }}>
                                      {item.score.toFixed(1)}
                                    </div>
                                    <div className="text-muted-foreground">
                                      {tier}
                                    </div>
                                  </div>
                                  {interpretation && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setExpandedPriorityDomains((prev) => ({
                                          ...prev,
                                          [item.domain]: !isExpanded,
                                        }))
                                      }
                                      className="p-1 rounded text-muted-foreground hover:text-foreground"
                                      aria-label={isExpanded ? "Hide guidance" : "Read guidance"}
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </button>
                                  )}
                                </div>
                                {isExpanded && interpretation && (
                                  <p className="text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border">
                                    {interpretation}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                )}
              </div>
            )}

          {/* Progress Over Time — portal-style line graph */}
          {allResults.length >= 2 && (
            <div id="progress-over-time" className="space-y-3 scroll-mt-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Progress Over Time
              </h2>
              <div className="rounded-2xl border border-border bg-card/80 p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">View:</span>
                    <div className="inline-flex rounded-lg border border-border p-0.5 bg-secondary/40" role="tablist" aria-label="Progress view">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={progressView === "line"}
                        onClick={() => setProgressView("line")}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          progressView === "line"
                            ? "bg-background border border-border shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Line Graph
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={progressView === "wheel"}
                        onClick={() => setProgressView("wheel")}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          progressView === "wheel"
                            ? "bg-background border border-border shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        Wheel Comparison
                      </button>
                    </div>
                  </div>
                  <div className="lg:hidden flex items-center gap-2 relative">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Metric:</span>
                    <button
                      type="button"
                      onClick={() => setProgressDropdownOpen((open) => !open)}
                      className="inline-flex items-center gap-1 rounded-full py-1 px-2.5 border border-border bg-background text-[10px] font-medium uppercase tracking-wider text-foreground hover:border-foreground/30 transition-colors max-w-[120px]"
                      aria-haspopup="listbox"
                      aria-expanded={progressDropdownOpen}
                    >
                      <span className="truncate">{getMetricLabel(selectedProgressMetric)}</span>
                      <ChevronDown
                        className="w-3 h-3 text-muted-foreground flex-shrink-0 transition-transform"
                        style={{ transform: progressDropdownOpen ? "rotate(180deg)" : undefined }}
                      />
                    </button>
                    {progressDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 z-20 w-52 bg-background border border-border rounded-lg shadow-lg overflow-hidden max-h-[280px] overflow-y-auto">
                        <div className="space-y-0.5 p-1.5">
                          {metricGroups.map((group) => (
                            <div key={`progress-dropdown-${group.label}`}>
                              <div className="text-[10px] font-semibold text-foreground mt-1.5 first:mt-0 px-2 py-0.5">
                                {group.label}
                              </div>
                              {group.items.map((metricKey) => {
                                const Icon = getMetricIcon(metricKey);
                                const isSelected = selectedProgressMetric === metricKey;
                                return (
                                  <button
                                    key={`progress-dropdown-${metricKey}`}
                                    type="button"
                                    onClick={() => {
                                      setSelectedProgressMetric(metricKey);
                                      setProgressDropdownOpen(false);
                                    }}
                                    className={`flex items-center gap-1.5 w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors border ${
                                      isSelected
                                        ? "bg-foreground text-background border-foreground"
                                        : "border-transparent text-foreground hover:bg-secondary hover:border-border"
                                    }`}
                                  >
                                    <Icon className="w-3 h-3 flex-shrink-0" />
                                    {getMetricLabel(metricKey)}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 min-w-0 relative">
                    {progressView === "line" ? (
                      <ProgressLineChart results={allResults} metricKey={selectedProgressMetric} />
                    ) : (
                      <div className="flex flex-col items-center w-full">
                        <VapiComparativeWheel
                          previousDomainScores={previousProgressResult.domainScores}
                          currentDomainScores={latestProgressResult.domainScores}
                          metricKey={selectedProgressMetric}
                          onMetricSelect={(metricKey) =>
                            setSelectedProgressMetric(metricKey as MetricKey)
                          }
                        />
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 w-full text-xs text-muted-foreground">
                          <div className="flex flex-col gap-y-1 items-start">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-gray-500" />
                              Most Recent ({new Date(latestProgressResult.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-gray-400/50" />
                              Previous ({new Date(previousProgressResult.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })})
                            </span>
                          </div>
                          <div className="flex flex-col gap-y-1 items-start">
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-green-500" />
                              Improved
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full bg-red-500" />
                              Declined
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:flex lg:w-52 flex-shrink-0 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-4 flex-col">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      Metric
                    </p>
                    <div className="relative flex-1 min-h-0 max-h-[370px]">
                      <div
                        ref={progressSidebarRef}
                        onScroll={(event) =>
                          setProgressSidebarIndicators(
                            getScrollIndicatorState(event.currentTarget)
                          )
                        }
                        className="space-y-1 h-full max-h-[370px] overflow-y-auto pr-1"
                      >
                        {metricGroups.map((group) => (
                          <div key={`progress-sidebar-${group.label}`}>
                            <div className="text-sm font-semibold text-foreground mt-3 first:mt-0">
                              {group.label}
                            </div>
                            {group.items.map((metricKey) => {
                              const Icon = getMetricIcon(metricKey);
                              const isSelected = selectedProgressMetric === metricKey;
                              return (
                                <button
                                  key={`progress-sidebar-${metricKey}`}
                                  type="button"
                                  onClick={() => setSelectedProgressMetric(metricKey)}
                                  className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors border ${
                                    isSelected
                                      ? "bg-foreground text-background border-foreground"
                                      : "border-transparent text-foreground hover:bg-secondary hover:border-border"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                  {getMetricLabel(metricKey)}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      {progressSidebarIndicators.showUp && (
                        <div className="absolute top-0 left-0 right-0 z-10 flex justify-center pt-2 pb-6 bg-gradient-to-b from-background to-transparent pointer-events-none">
                          <ChevronUp className="w-5 h-5 text-foreground/70" />
                        </div>
                      )}
                      {progressSidebarIndicators.showDown && (
                        <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center pb-2 pt-6 bg-gradient-to-t from-background to-transparent pointer-events-none">
                          <ChevronDown className="w-5 h-5 text-foreground/70" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border">
                  <h3 className="text-lg text-foreground mb-2">What Changed</h3>
                  <div className="space-y-3">
                    {[
                      selectedProgressMetric === "overall"
                        ? compositeTransition
                        : getSelectedProgressInterpretationNarrative(
                            latestProgressResult,
                            selectedProgressMetric
                          ),
                      archetypeTransition,
                      {
                        key: "driver",
                        eyebrow: "Driver Transition",
                        title: driverTransition.heading,
                        subtitle: driverTransition.subheading,
                        body: driverTransition.body,
                        previousBelief: driverTransition.previousBelief,
                        currentBelief: driverTransition.currentBelief,
                        changeDirection: driverTransition.direction,
                        detailLines: [
                          formatPrimaryDriverDetailLine(
                            latestProgressResult.driverState,
                            currentAssignedDriver,
                            latestProgressResult.topDriverScore
                          ),
                          formatSecondaryDriverDetailLine(
                            latestProgressResult.driverState,
                            currentSecondaryDriver,
                            latestProgressResult.secondaryDriverScore
                          ),
                        ],
                        supportingNote: secondaryDriverTransitionNote ?? undefined,
                        linkHref: "/drivers",
                        linkLabel: "Explore all driver patterns in the Driver Library >",
                      } satisfies ProgressNarrative,
                    ]
                      .filter((item): item is ProgressNarrative => Boolean(item))
                      .map((item) => (
                        <div
                          key={item.key}
                          className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3"
                        >
                          <div className="space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
                              {item.eyebrow}
                            </p>
                            <h4 className="text-base font-semibold text-foreground">
                              {item.title}
                            </h4>
                            {item.subtitle && (
                              <p className="text-sm text-muted-foreground">
                                {item.subtitle}
                              </p>
                            )}
                          </div>
                          {(item.previousScore || item.currentScore || item.change) && (
                            <div className="flex flex-wrap items-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
                              {item.previousScore && <span>{item.previousScore}</span>}
                              {item.currentScore && <span>{item.currentScore}</span>}
                              {item.change && (
                                <span
                                  className={`font-medium ${getDirectionClasses(
                                    item.changeDirection
                                  )}`}
                                >
                                  {item.change}
                                </span>
                              )}
                            </div>
                          )}
                          {(item.previousBelief || item.currentBelief) && (
                            <div className="space-y-2">
                              {item.previousBelief && item.currentBelief && item.previousBelief !== item.currentBelief ? (
                                <>
                                  <blockquote className="rounded-lg border border-border bg-background/70 px-4 py-3 text-sm italic text-muted-foreground line-through opacity-70">
                                    &quot;{item.previousBelief}&quot;
                                  </blockquote>
                                  <blockquote className="rounded-lg border-l-4 border-accent bg-background px-4 py-3 text-sm font-medium italic text-foreground">
                                    &quot;{item.currentBelief}&quot;
                                  </blockquote>
                                </>
                              ) : (
                                <blockquote className="rounded-lg border-l-4 border-accent bg-background px-4 py-3 text-sm font-medium italic text-foreground">
                                  &quot;{item.currentBelief || item.previousBelief}&quot;
                                </blockquote>
                              )}
                            </div>
                          )}
                          {item.detailLines && item.detailLines.length > 0 && (
                            <div className="space-y-1 text-sm text-muted-foreground">
                              {item.detailLines.map((line) => (
                                <p key={`${item.key}-${line}`}>{line}</p>
                              ))}
                            </div>
                          )}
                          <p className="text-sm leading-relaxed text-muted-foreground">
                            {item.body}
                          </p>
                          {item.supportingNote && (
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              {item.supportingNote}
                            </p>
                          )}
                          {item.linkHref && item.linkLabel && (
                            <Link
                              href={item.linkHref}
                              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                            >
                              {item.linkLabel}
                            </Link>
                          )}
                        </div>
                      ))}
                  </div>
                  {selectedProgressMetric.startsWith("domain:") &&
                    previousPriority != null &&
                    latestPriority != null &&
                    Math.abs(latestPriority - previousPriority) >= 3 && (
                      <div className="mt-3 p-3 bg-secondary/40 border border-border rounded-lg">
                        <p className="text-xs font-semibold uppercase tracking-wider text-accent mb-1">
                          Priority Shift
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          You rated {getMetricLabel(selectedProgressMetric)} as {previousPriority}/10 priority last time and {latestPriority}/10 this time.
                          {latestPriority > previousPriority
                            ? " This area has become significantly more important to you."
                            : " This area has moved down your priority list."}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          <MyPlanCalloutLargeApp />

          {/* CTA */}
          <div className="rounded-2xl border border-border p-6 space-y-4 bg-secondary/30">
            <h2 className="font-serif font-bold text-lg">
              What to Do With These Results
            </h2>
            <p className="text-sm text-muted-foreground">
              ALFRED now has your VAPI scores and can help you create an
              action plan based on your priority areas. Start a coaching conversation
              to turn these insights into weekly priorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/chat"
                className="flex-1 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Talk to Your Coach
              </Link>
              <Link
                href="/assessment"
                className="flex-1 py-3 rounded-xl border border-border text-sm hover:bg-secondary transition-colors flex items-center justify-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Retake Assessment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse text-muted-foreground">
            Loading results...
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
```

## 7) Priority Matrix Copy (Including Domain-Specific Guidance)
Domains are placed into quadrants from importance + score rules. Users see quadrant descriptors and can expand domain-level interpretation text for the domain tier.

### Priority Matrix Page Copy + Logic (`app/(dashboard)/priorities/page.tsx`)

```text
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Activity,
  Compass,
  Brain,
  Focus,
  Heart,
  Home,
  Users,
  Globe,
  Telescope,
  Rocket,
  Gauge,
  Leaf,
  AlertTriangle,
  Shield,
  Eye,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { DOMAIN_INTERPRETATIONS } from "@/lib/vapi/interpretations";
import { getTier, getTierColor, getPriorityMatrix, type PriorityQuadrant } from "@/lib/vapi/scoring";
import { DOMAINS } from "@/lib/vapi/quiz-data";
import { chatQueryUrl, buildDashboardPriorityPrompt } from "@/lib/chat-deep-links";

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  PH: Activity, IA: Compass, ME: Brain, AF: Focus,
  RS: Heart, FA: Home, CO: Users, WI: Globe,
  VS: Telescope, EX: Rocket, OH: Gauge, EC: Leaf,
};

const QUAD_META: Record<
  PriorityQuadrant,
  { icon: React.ElementType; color: string; bg: string; border: string; desc: string }
> = {
  "Critical Priority": {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/15",
    border: "border-red-500/30",
    desc: "High importance, low score — focus here first",
  },
  "Protect & Sustain": {
    icon: Shield,
    color: "text-green-500",
    bg: "bg-green-500/15",
    border: "border-green-500/30",
    desc: "High importance, high score — don't neglect these",
  },
  Monitor: {
    icon: Eye,
    color: "text-yellow-500",
    bg: "bg-yellow-500/15",
    border: "border-yellow-500/30",
    desc: "Lower importance, lower score — keep an eye on these",
  },
  "Possible Over-Investment": {
    icon: TrendingDown,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
    desc: "Lower importance, high score — could redirect energy",
  },
};

export default function PrioritiesPage() {
  const [vapiResults, setVapiResults] = useState<{ results: Array<{ id: string; domainScores: Record<string, number>; importance: Record<string, number> }> } | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/vapi")
      .then((r) => r.json())
      .then(setVapiResults)
      .catch(() => setVapiResults({ results: [] }));
  }, []);

  const latest = vapiResults?.results?.[0];
  const priorityItems = latest ? getPriorityMatrix(latest.domainScores, latest.importance || {}) : [];
  const byQuadrant = priorityItems.reduce((acc, p) => {
    if (!acc[p.quadrant]) acc[p.quadrant] = [];
    acc[p.quadrant].push(p);
    return acc;
  }, {} as Record<PriorityQuadrant, typeof priorityItems>);

  const quads: PriorityQuadrant[] = [
    "Critical Priority",
    "Protect & Sustain",
    "Monitor",
    "Possible Over-Investment",
  ];

  if (!latest) {
    return (
      <div className="flex flex-col h-full">
        <PageHeader title="Priorities" subtitle="Your priority matrix" />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Take the VAPI assessment to see your priority matrix.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-accent-foreground font-medium hover:bg-accent/90"
            >
              Take Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Priorities" subtitle="Explore your priority matrix" />

      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-4">
          {quads.map((quad) => {
            const items = byQuadrant[quad] || [];
            if (items.length === 0) return null;

            const meta = QUAD_META[quad];
            const QIcon = meta.icon;
            const isExpanded = expanded[quad] ?? false;

            return (
              <div
                key={quad}
                className={`rounded-2xl border ${meta.border} ${meta.bg} overflow-hidden shadow-sm`}
              >
                <button
                  type="button"
                  onClick={() => setExpanded((e) => ({ ...e, [quad]: !isExpanded }))}
                  className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-black/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <QIcon className={`h-4 w-4 ${meta.color}`} />
                    <span className="font-semibold">{quad}</span>
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                {isExpanded && (
                <div className="px-5 pb-4 space-y-2">
                  {items.map((item) => {
                    const Icon = DOMAIN_ICONS[item.domain];
                    const color = getTierColor(getTier(item.score));
                    const tier = getTier(item.score);
                    const interpretation = DOMAIN_INTERPRETATIONS[item.domain]?.[tier];
                    const isDomainExpanded = expandedDomains[item.domain] ?? false;
                    return (
                      <div
                        key={item.domain}
                        className="rounded-lg border border-border bg-card/50 p-3 self-start"
                      >
                        <div className="flex items-center gap-3">
                          {Icon && <Icon className="h-4 w-4 text-accent" />}
                          <div className="flex-1">
                            <span className="text-sm">{item.domainName}</span>
                            <div className="text-muted-foreground text-xs mt-0.5">
                              Priority: {item.importance}/10
                            </div>
                          </div>
                          <div className="text-right text-xs shrink-0">
                            <div className="font-medium" style={{ color }}>
                              {item.score.toFixed(1)}
                            </div>
                            <div className="text-muted-foreground">{tier}</div>
                            <Link
                              href={chatQueryUrl(buildDashboardPriorityPrompt(item))}
                              className="text-accent font-medium hover:underline mt-1 inline-block"
                            >
                              Coach
                            </Link>
                          </div>
                          {interpretation && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedDomains((prev) => ({
                                  ...prev,
                                  [item.domain]: !isDomainExpanded,
                                }))
                              }
                              className="p-1 rounded text-muted-foreground hover:text-foreground"
                              aria-label={isDomainExpanded ? "Hide guidance" : "Read guidance"}
                            >
                              {isDomainExpanded ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                        {isDomainExpanded && interpretation && (
                          <p className="text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border">
                            {interpretation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                  <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                    {meta.desc}
                  </p>
                </div>
                )}
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              href={`/assessment/results?id=${latest.id}`}
              className="text-sm text-accent font-medium hover:underline"
            >
              View full VAPI results →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 8) 28-Day Sprint / My Plan Copy
Users with a generated sprint see plan title/summary/context, driver modifier text, week themes/tasks, reflection prompts/status labels, and follow-through callouts. If no sprint exists, they get generation CTA copy.

### My Plan Page Copy (`app/(dashboard)/my-plan/page.tsx`)

```text
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Loader2, ExternalLink, ScanEye } from "lucide-react";
import { markAlfredMyPlanViewed } from "@/components/my-plan-callouts";
import { getSprintTaskDisplay } from "@/lib/sprint-task-display";

type PlanContext = {
  whyItMatters?: string;
  usuallyIndicates?: string;
  hiddenCost?: string;
  leveragePoint?: string;
  howToKnow?: string;
};

type SprintRow = {
  id: string;
  primary_surface: string;
  coach_context: string | null;
  payload: {
    title?: string;
    summary?: string;
    focusDomain?: string;
    focusDomainLabel?: string;
    userLevel?: string;
    context?: PlanContext;
    driverModifier?: string;
    weeks?: {
      weekNumber: number;
      theme?: string;
      tasks?: { id: string; title: string; description?: string; completed?: boolean }[];
    }[];
    weekReflections?: Record<string, string>;
  };
};

export default function MyPlanPage() {
  const [sprint, setSprint] = useState<SprintRow | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const lastSprintIdRef = useRef<string | null>(null);
  const [reflectionDrafts, setReflectionDrafts] = useState<Record<string, string>>({});
  const [reflectionStatus, setReflectionStatus] = useState<Record<string, string>>({});
  // DOM timers (`window.setTimeout`) return `number` in the browser.
  // In this project, Node types can cause `setTimeout` to be typed as `NodeJS.Timeout`,
  // which then clashes when we store `window.setTimeout(...)` results.
  const reflectionTimers = useRef<Record<string, number>>({});

  const load = useCallback(() => {
    fetch("/api/sprint/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        setSprint(data.sprint ?? null);
      })
      .catch(() => {
        setError("load_failed");
        setSprint(null);
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    markAlfredMyPlanViewed();
  }, []);

  useEffect(() => {
    if (!sprint?.id) return;
    if (lastSprintIdRef.current !== sprint.id) {
      lastSprintIdRef.current = sprint.id;
      setReflectionDrafts(sprint.payload.weekReflections || {});
    }
  }, [sprint]);

  const savePatch = useCallback(
    async (taskUpdates?: Record<string, boolean>, weekReflections?: Record<string, string>) => {
      const res = await fetch("/api/sprint/patch", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskUpdates, weekReflections }),
      });
      return res.ok;
    },
    []
  );

  const flushReflectionSave = useCallback(
    async (weekKey: string, value: string) => {
      setReflectionStatus((s) => ({ ...s, [weekKey]: "Saving…" }));
      const ok = await savePatch(undefined, { [weekKey]: value });
      setReflectionStatus((s) => ({
        ...s,
        [weekKey]: ok ? "Saved" : "Could not save",
      }));
      if (ok) {
        window.setTimeout(() => {
          setReflectionStatus((s) => (s[weekKey] === "Saved" ? { ...s, [weekKey]: "" } : s));
        }, 2200);
      }
    },
    [savePatch]
  );

  const scheduleReflectionSave = useCallback(
    (weekKey: string, value: string) => {
      const prev = reflectionTimers.current[weekKey];
      if (prev) window.clearTimeout(prev);
      setReflectionStatus((s) => ({ ...s, [weekKey]: "" }));
      reflectionTimers.current[weekKey] = window.setTimeout(() => {
        delete reflectionTimers.current[weekKey];
        void flushReflectionSave(weekKey, value);
      }, 850);
    },
    [flushReflectionSave]
  );

  if (sprint === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p>Loading your plan…</p>
      </div>
    );
  }

  if (error && !sprint) {
    return (
      <div className="p-6 max-w-lg mx-auto text-center">
        <PageHeader title="My Plan" subtitle="We couldn’t load your sprint." />
        <p className="text-muted-foreground text-sm mt-4">Try again later or complete the VAPI in ALFRED.</p>
      </div>
    );
  }

  if (!sprint) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <PageHeader
          title="My Plan"
          subtitle="Complete the VAPI assessment while signed in to generate your 28-day sprint. Your plan syncs across ALFRED and the Aligned Portal."
        />
        <Link
          href="/assessment"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground"
        >
          Take VAPI
        </Link>
      </div>
    );
  }

  const payload = sprint.payload || {};
  const weeks = payload.weeks || [];
  const serverReflections = payload.weekReflections || {};
  const planCtx = payload.context || {};

  const reflectionValue = (weekNum: number) => {
    const k = String(weekNum);
    return reflectionDrafts[k] !== undefined ? reflectionDrafts[k] : (serverReflections[k] ?? "");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="shrink-0 border-b border-border">
        <PageHeader
          variant="featured"
          title={payload.title || "My Plan"}
          subtitle={payload.summary || "Your 28-day focus from VAPI."}
        />
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 pb-24">
        <div className="mx-auto max-w-3xl space-y-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">28-day sprint</p>

        {planCtx.whyItMatters?.trim() ? (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Why this focus</h2>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.whyItMatters.trim()}</p>
            {(planCtx.usuallyIndicates ||
              planCtx.hiddenCost ||
              planCtx.leveragePoint ||
              planCtx.howToKnow) && (
              <div className="space-y-4 border-t border-border pt-4">
                {planCtx.usuallyIndicates?.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">What this usually indicates</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.usuallyIndicates.trim()}</p>
                  </div>
                ) : null}
                {planCtx.hiddenCost?.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">Hidden cost</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.hiddenCost.trim()}</p>
                  </div>
                ) : null}
                {planCtx.leveragePoint?.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">Leverage point</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.leveragePoint.trim()}</p>
                  </div>
                ) : null}
                {planCtx.howToKnow?.trim() ? (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1.5">How you will know it is working</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{planCtx.howToKnow.trim()}</p>
                  </div>
                ) : null}
              </div>
            )}
          </section>
        ) : null}

        {payload.driverModifier?.trim() ? (
          <section className="relative overflow-hidden rounded-2xl border-2 border-blue-700/25 bg-gradient-to-br from-blue-600/[0.08] via-card to-card p-5 shadow-[0_14px_40px_-14px_rgba(29,78,216,0.28)] dark:border-sky-500/35 dark:from-sky-500/[0.14] dark:shadow-[0_16px_48px_-16px_rgba(37,99,235,0.38)] sm:p-6">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-700 via-sky-500 to-sky-400"
              aria-hidden
            />
            <div className="relative mb-3 flex items-center gap-2.5">
              <ScanEye className="h-5 w-5 shrink-0 text-blue-600 dark:text-sky-300" aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-blue-900 dark:text-sky-100">
                A pattern to watch
              </h2>
            </div>
            <p className="relative text-sm font-medium leading-relaxed text-foreground whitespace-pre-wrap">
              {payload.driverModifier.trim()}
            </p>
          </section>
        ) : null}

        {sprint.coach_context?.trim() ? (
          <section className="rounded-2xl border border-accent/30 bg-accent/5 p-5 shadow-sm sm:p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">From your coach</h2>
            <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{sprint.coach_context}</p>
          </section>
        ) : null}

        <div className="space-y-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Week by week</h2>
        {weeks.map((w) => (
          <section
            key={w.weekNumber}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6 space-y-4"
          >
            <div className="border-b border-border/80 pb-3">
              <h3 className="font-serif text-xl font-bold tracking-tight text-foreground sm:text-2xl">Week {w.weekNumber}</h3>
              {w.theme ? <p className="mt-1 text-base font-medium text-accent">{w.theme}</p> : null}
            </div>
            <ul className="space-y-2">
              {(w.tasks || []).map((t) => {
                const taskUi = getSprintTaskDisplay(t);
                return (
                <li key={t.id}>
                  <label className="flex gap-3 items-start cursor-pointer rounded-xl border border-border p-3.5 transition-colors hover:border-accent/40 hover:bg-accent/5">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 rounded border-border accent-accent"
                      checked={!!t.completed}
                      onChange={(e) => {
                        const next = e.target.checked;
                        setSprint((prev) => {
                          if (!prev) return prev;
                          const p = { ...prev, payload: { ...prev.payload, weeks: [...(prev.payload.weeks || [])] } };
                          const wi = p.payload.weeks!.findIndex((x) => x.weekNumber === w.weekNumber);
                          if (wi < 0) return prev;
                          const wk = { ...p.payload.weeks![wi], tasks: [...(p.payload.weeks![wi].tasks || [])] };
                          const ti = wk.tasks!.findIndex((x) => x.id === t.id);
                          if (ti >= 0) wk.tasks![ti] = { ...wk.tasks![ti], completed: next };
                          p.payload.weeks![wi] = wk;
                          return p;
                        });
                        void savePatch({ [t.id]: next });
                      }}
                    />
                    <span className="min-w-0 flex-1 break-words">
                      {taskUi.mode === "both" ? (
                        <>
                          <span className="block font-medium leading-snug text-foreground">{taskUi.title}</span>
                          <span className="mt-1.5 block text-sm leading-relaxed text-muted-foreground">
                            {taskUi.body}
                          </span>
                        </>
                      ) : taskUi.mode === "body" ? (
                        <span className="block text-[15px] font-medium leading-relaxed text-foreground">
                          {taskUi.body}
                        </span>
                      ) : (
                        <span className="block font-medium leading-snug text-foreground">{taskUi.title}</span>
                      )}
                    </span>
                  </label>
                </li>
                );
              })}
            </ul>
            <div className="pt-1">
              <label className="text-sm font-semibold text-foreground block mb-2">
                Reflection
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed"
                value={reflectionValue(w.weekNumber)}
                placeholder="What shifted this week?"
                onChange={(e) => {
                  const k = String(w.weekNumber);
                  const v = e.target.value;
                  setReflectionDrafts((s) => ({ ...s, [k]: v }));
                  scheduleReflectionSave(k, v);
                }}
                onBlur={(e) => {
                  const k = String(w.weekNumber);
                  const t = reflectionTimers.current[k];
                  if (t) {
                    window.clearTimeout(t);
                    delete reflectionTimers.current[k];
                  }
                  void flushReflectionSave(k, e.target.value);
                }}
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="min-h-[1.25em] text-xs text-muted-foreground">
                  {reflectionStatus[String(w.weekNumber)] || ""}
                </span>
                <button
                  type="button"
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
                  onClick={() => {
                    const k = String(w.weekNumber);
                    const t = reflectionTimers.current[k];
                    if (t) {
                      window.clearTimeout(t);
                      delete reflectionTimers.current[k];
                    }
                    void flushReflectionSave(k, reflectionDrafts[k] ?? serverReflections[k] ?? "");
                  }}
                >
                  Save reflection
                </button>
              </div>
            </div>
          </section>
        ))}
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-5 text-sm text-muted-foreground sm:p-6">
          <p className="font-serif text-base font-semibold text-foreground mb-2">You&apos;re in the right place for follow-through</p>
          <p>
            Daily check-ins, Coach, and notifications live here in ALFRED—so this plan doesn&apos;t stall after Week 1.
            {sprint.primary_surface === "portal" ? (
              <>
                {" "}
                You can also open the same plan on the{" "}
                <a
                  href="https://portal.alignedpower.coach/my-plan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent font-semibold inline-flex items-center gap-0.5"
                >
                  Aligned Portal
                  <ExternalLink className="h-3 w-3" />
                </a>{" "}
                if you prefer a desktop view.
              </>
            ) : null}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
```


### My Plan Callout Copy (`components/my-plan-callouts.tsx`)

```text
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Lightbulb, Target, X } from "lucide-react";

export const ALFRED_LS_VIEWED_MY_PLAN = "alfred_hasViewedMyPlan";
export const ALFRED_LS_DISMISS_REMINDER = "alfred_dismissedMyPlanReminder";

export function markAlfredMyPlanViewed() {
  try {
    localStorage.setItem(ALFRED_LS_VIEWED_MY_PLAN, "1");
  } catch {
    /* ignore */
  }
}

/** Large results-page callout (ALFRED app users are always signed in). */
export function MyPlanCalloutLargeApp() {
  return (
    <div className="rounded-2xl border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5 p-6 sm:p-8 shadow-lg mt-10 mb-2">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6 sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/20">
          <Target className="h-7 w-7 text-accent" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            Your 30-Day Action Plan Is Ready
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You&apos;ve just learned your Archetype, your Driver, and where you&apos;re strong and struggling
            across 12 domains. That&apos;s the diagnosis.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Now comes the prescription: a personalized 30-day plan that targets your highest-leverage growth
            area, with week-by-week actions, not just insight.
          </p>
          <Link
            href="/my-plan"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 sm:w-auto"
          >
            View My Plan
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MyPlanInlineCalloutApp({
  variant,
  borderAccent,
}: {
  variant: "archetype" | "driver";
  borderAccent?: string;
}) {
  const title =
    variant === "archetype" ? "What to do with this?" : "This driver has a counter-move.";
  const body =
    variant === "archetype"
      ? "Your Archetype reveals patterns, but patterns can shift. Your personalized 30-day plan targets the specific domain holding you back."
      : "Your 30-day plan includes specific guidance for working with (not against) this pattern.";

  return (
    <div
      className={`mt-5 rounded-xl border border-border border-l-4 py-4 pl-4 pr-4 ${
        variant === "archetype" ? "bg-sky-500/5" : "bg-amber-500/5"
      }`}
      style={borderAccent ? { borderLeftColor: borderAccent } : undefined}
    >
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Lightbulb className="h-4 w-4 shrink-0 text-accent" />
        {title}
      </p>
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <Link
        href="/my-plan"
        className="inline-flex w-full items-center justify-center gap-2 text-sm font-bold text-accent hover:underline sm:w-auto"
      >
        View My Plan
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function MyPlanDashboardReminder({ hasAssessment }: { hasAssessment: boolean }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!hasAssessment) return;
    try {
      if (localStorage.getItem(ALFRED_LS_VIEWED_MY_PLAN) === "1") return;
      if (localStorage.getItem(ALFRED_LS_DISMISS_REMINDER) === "1") return;
    } catch {
      return;
    }
    setOpen(true);
  }, [hasAssessment]);

  if (!open) return null;

  return (
    <div className="relative mb-6 rounded-2xl border-2 border-primary/20 bg-card p-5 pr-12 shadow-sm">
      <button
        type="button"
        className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        aria-label="Dismiss reminder"
        onClick={() => {
          try {
            localStorage.setItem(ALFRED_LS_DISMISS_REMINDER, "1");
          } catch {
            /* ignore */
          }
          setOpen(false);
        }}
      >
        <X className="h-5 w-5" />
      </button>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">My Plan</p>
      <h2 className="mb-2 text-lg font-bold text-foreground">Your 30-day plan is waiting</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Based on your assessment results, we&apos;ve created a personalized action plan for your growth edge.
      </p>
      <Link
        href="/my-plan"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 sm:w-auto"
      >
        View My Plan
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
```

## 9) Alfred Prompt Starters (User-Triggered Prefilled Prompts)
These are copy templates users launch from UI actions (Coach links/buttons). Placeholders are resolved with user metric context at click time.

### Prefilled Coach Prompt Templates (`lib/chat-deep-links.ts`)

```text
import type { PriorityItem } from "@/lib/vapi/scoring";

/** Path + query for opening Coach with a prefilled message. */
export function chatQueryUrl(prompt: string): string {
  return `/chat?q=${encodeURIComponent(prompt)}`;
}

/** Critical-priority domain — matches "Focus Here First" on the dashboard. */
export function buildFocusFirstPrompt(item: {
  domainName: string;
  score: number;
  importance: number;
}): string {
  return `My Focus Here First shows ${item.domainName} as a critical priority (score ${item.score.toFixed(1)}/10, importance ${item.importance}/10). Help me choose one aligned move for this week that improves this domain without burning me out — tie it to my Vital Action, Real Reasons, and capacity.`;
}

export function buildDashboardPriorityPrompt(item: PriorityItem): string {
  if (item.quadrant === "Critical Priority") {
    return buildFocusFirstPrompt({
      domainName: item.domainName,
      score: item.score,
      importance: item.importance,
    });
  }
  return `My VAPI priority map flags ${item.domainName} (${item.quadrant} — score ${item.score.toFixed(1)}/10, importance ${item.importance}/10). Help me decide whether to act on it this week or hold steady, using my Vital Action and capacity.`;
}

export function buildArchetypeCoachPrompt(
  archetype: string,
  driverSummary: string
): string {
  return `I'm a ${archetype} founder${driverSummary ? `; ${driverSummary}` : ""}. Given that archetype and how I behave under pressure, what's the one watch-out for my Vital Action this week — and one boundary that protects me?`;
}

export function buildDriverCoachPrompt(driverName: string): string {
  return `My primary VAPI driver pattern is "${driverName}". Help me design one exit move and one boundary this week that weakens this pattern's grip — aligned to my blueprint and Vital Action.`;
}

export function buildAlignedMomentumCoachPrompt(): string {
  return `I'm showing Aligned Momentum on my assessment. Help me protect what's working: what's one way I could still self-sabotage from boredom, overreach, or neglect — and how do I guard against it this week?`;
}

export function buildSixCsTrendCoachPrompt(args: {
  weakestLabel: string;
  weakestPct: number;
  declinedLabel?: string;
  declineDelta?: number;
}): string {
  let s = `Looking at my latest 6Cs, my lowest area is ${args.weakestLabel} (${args.weakestPct}%).`;
  if (
    args.declinedLabel != null &&
    args.declineDelta != null &&
    args.declineDelta < 0
  ) {
    s += ` ${args.declinedLabel} slid ${args.declineDelta}% vs my prior check-in — help me name what happened and one recovery move.`;
  } else {
    s += ` Help me pick one practice for the next 7 days that moves it without overwhelm.`;
  }
  return s;
}
```

## 10) Notifications / Push Copy (Daily Spark + 6Cs Reminders)
Notification body is selected by cron type and data availability. Daily Spark can be generic rotation or personalized by latest VAPI/6Cs pattern. Weekend 6Cs reminders are deterministic by day/reminder window and submission status.

### Daily Spark Cron Copy (`app/api/cron/morning-prompt/route.ts`)

```text
/**
 * Daily Spark — web push only (no SMS).
 * Runs once per day (see `vercel.json` schedule). No hourly cron: everyone opted in
 * gets the same send time (12:00 UTC ≈ 7am EST / 8am EDT). Requires push subscription + VAPID.
 */
import { NextRequest, NextResponse } from "next/server";
import webPush from "web-push";
import { and, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { MORNING_PROMPTS } from "@/lib/ai/prompts";
import { pickPersonalizedMorningPrompt } from "@/lib/morning-prompt-personalized";

const DAILY_SPARK_TITLE = "Daily Spark";

/** Keep push body within typical OS limits (~120–180 chars). */
function shortenPushBody(text: string, max = 140): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function authorizeCron(req: NextRequest): boolean {
  const cronSecret = (process.env.CRON_SECRET || "").trim();
  if (!cronSecret) return false;
  const secret =
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    req.nextUrl.searchParams.get("secret") ||
    "";
  return secret.trim() === cronSecret;
}

async function handleCron() {
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 500 }
    );
  }

  webPush.setVapidDetails(
    "mailto:support@vap.coach",
    vapidPublic,
    vapidPrivate
  );

  const now = new Date();

  const eligibleUsers = await db
    .select()
    .from(schema.users)
    .where(
      and(
        eq(schema.users.smsEnabled, true),
        inArray(schema.users.subscriptionStatus, ["active", "trialing"])
      )
    );

  const subs = await db
    .select({
      userId: schema.pushSubscriptions.userId,
      endpoint: schema.pushSubscriptions.endpoint,
      keys: schema.pushSubscriptions.keys,
    })
    .from(schema.pushSubscriptions);

  const subsByUser = new Map<string, typeof subs>();
  for (const s of subs) {
    const list = subsByUser.get(s.userId) || [];
    list.push(s);
    subsByUser.set(s.userId, list);
  }

  /** Only users with at least one push endpoint receive a Daily Spark. */
  const usersToNotify = eligibleUsers.filter((u) => (subsByUser.get(u.id)?.length ?? 0) > 0);

  if (usersToNotify.length === 0) {
    return NextResponse.json({
      ok: true,
      channel: "push",
      message:
        "No recipients (need Daily Spark on, active subscription, and browser push enabled)",
      sent: 0,
      failed: 0,
      total: 0,
      eligibleWithPrefsOnly: eligibleUsers.length,
    });
  }

  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const promptIndex = dayOfYear % MORNING_PROMPTS.length;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vap.coach";
  const sparkUrl = `${appUrl}/dashboard?dailySpark=1`;

  type SendTarget = {
    endpoint: string;
    keys: { p256dh: string; auth: string };
    body: string;
  };
  const toSend: SendTarget[] = [];

  for (const user of usersToNotify) {
    const userSubs = subsByUser.get(user.id)!;

    const longPrompt = user.email
      ? await pickPersonalizedMorningPrompt(user.email, promptIndex)
      : MORNING_PROMPTS[promptIndex];
    const body = shortenPushBody(longPrompt);

    for (const sub of userSubs) {
      toSend.push({
        endpoint: sub.endpoint,
        keys: sub.keys,
        body,
      });
    }
  }

  const results = await Promise.allSettled(
    toSend.map((s) =>
      webPush.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.keys.p256dh, auth: s.keys.auth },
        },
        JSON.stringify({
          title: DAILY_SPARK_TITLE,
          body: s.body,
          url: sparkUrl,
        }),
        { TTL: 86400 }
      )
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({
    ok: true,
    channel: "push",
    scheduleNote:
      "Single daily cron (no per-user local time). Default: 12:00 UTC — adjust in vercel.json if needed.",
    usersNotified: usersToNotify.length,
    sent,
    failed,
    total: toSend.length,
  });
}

export async function GET(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handleCron();
}

export async function POST(req: NextRequest) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return handleCron();
}
```


### Daily Spark Personalization Copy Logic (`lib/morning-prompt-personalized.ts`)

```text
/**
 * Per-user Daily Spark text (push body is shortened in the cron handler).
 * Uses portal VAPI + 6Cs when available; otherwise rotates generic prompts.
 */

import { MORNING_PROMPTS } from "@/lib/ai/prompts";
import { fetchPortalSixCByEmail, fetchPortalVapiByEmail } from "@/lib/portal-data";
import { ALIGNED_MOMENTUM_NAME } from "@/lib/vapi/drivers";
import { SCORECARD_CATEGORIES } from "@/lib/scorecard";
import { getPriorityMatrix } from "@/lib/vapi/scoring";

type CriticalRow = { domain: string; score: number; importance: number };

function extractCriticalFromResults(r: Record<string, unknown>): CriticalRow[] {
  const pm = r.priorityMatrix as { criticalPriority?: CriticalRow[] } | undefined;
  if (Array.isArray(pm?.criticalPriority) && pm.criticalPriority.length > 0) {
    return pm.criticalPriority;
  }
  const ds = (r.domainScores as Record<string, number>) || {};
  const imp = (r.importanceRatings as Record<string, number>) || {};
  if (Object.keys(ds).length === 0 || Object.keys(imp).length === 0) return [];
  return getPriorityMatrix(ds, imp)
    .filter((p) => p.quadrant === "Critical Priority")
    .map((p) => ({
      domain: p.domainName,
      score: p.score,
      importance: p.importance,
    }));
}

export async function pickPersonalizedMorningPrompt(
  email: string,
  fallbackIndex: number
): Promise<string> {
  const safeFallback =
    MORNING_PROMPTS[Math.abs(fallbackIndex) % MORNING_PROMPTS.length];

  try {
    const [vapiRows, sixRows] = await Promise.all([
      fetchPortalVapiByEmail(email),
      fetchPortalSixCByEmail(email),
    ]);

    if (vapiRows.length > 0) {
      const r = vapiRows[0].results as Record<string, unknown>;
      const critical = extractCriticalFromResults(r);
      const top = critical.sort((a, b) => a.score - b.score)[0];
      if (top) {
        return `Good morning — your Focus Here First includes ${top.domain} (${top.score.toFixed(1)}/10, high importance). What's one honest move today that cares for that without trashing your Vital Action?`;
      }

      const driver = r.assignedDriver as string | undefined;
      const driverState = r.driverState as string | undefined;
      if (
        driver &&
        driverState === "dysfunction_driver" &&
        driver !== ALIGNED_MOMENTUM_NAME
      ) {
        return `Morning check-in: pattern "${driver}" shows up when pressure hits. What boundary protects you from it today — one sentence?`;
      }

      const arch = (r.archetype as string) || "";
      if (arch) {
        return `Good morning. You're carrying the ${arch} pattern this season. What's one thing your Vital Action needs from you before the inbox wins?`;
      }
    }

    if (sixRows.length >= 1) {
      const latest = sixRows[0].scores || {};
      let lowestKey = SCORECARD_CATEGORIES[0].key;
      let lowestVal = 101;
      for (const c of SCORECARD_CATEGORIES) {
        const v = latest[c.key];
        if (typeof v === "number" && v < lowestVal) {
          lowestVal = v;
          lowestKey = c.key;
        }
      }
      const cat = SCORECARD_CATEGORIES.find((x) => x.key === lowestKey);
      if (lowestVal <= 100 && lowestVal < 72 && cat) {
        return `Your 6Cs point to ${cat.label} (${lowestVal}%). What's one integrity move today — small, repeatable — not a hero week?`;
      }

      if (sixRows.length >= 2) {
        const prev = sixRows[1].scores || {};
        let worstLabel = "";
        let worstDelta = 0;
        for (const c of SCORECARD_CATEGORIES) {
          const a = latest[c.key] || 0;
          const b = prev[c.key] || 0;
          const d = a - b;
          if (d < worstDelta) {
            worstDelta = d;
            worstLabel = c.label;
          }
        }
        if (worstDelta < -5 && worstLabel) {
          return `${worstLabel} dipped ${worstDelta}% week over week. What actually happened — and what's the smallest repair you can make today?`;
        }
      }
    }
  } catch {
    /* fall through */
  }

  return safeFallback;
}
```


### 6Cs Reminder Push Copy (`app/api/cron/6c-reminders/route.ts`)

```text
/**
 * 6Cs Scorecard push reminders. Runs at 12:05pm Eastern (Fri/Sat/Sun).
 * Sends web push to app users who have subscribed and (Sat/Sun) haven't submitted this week.
 *
 * Env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, CRON_SECRET, NEXT_PUBLIC_APP_URL
 */
import { NextRequest, NextResponse } from "next/server";
import webPush from "web-push";
import { db, schema } from "@/lib/db";
import { fetchPortalSixCByEmail } from "@/lib/portal-data";
import {
  getScorecardWindow,
  getMostRecentScorecardWindow,
  isDateInScorecardWindow,
} from "@/lib/scorecard-window";

const TZ = "America/New_York";

function nowInEastern() {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const o: Record<string, string> = {};
  parts.forEach((p) => {
    o[p.type] = p.value;
  });
  const dayNames: Record<string, number> = {
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
    Sun: 0,
  };
  return {
    dayOfWeek: dayNames[o.weekday] ?? 0,
    hour: parseInt(o.hour ?? "0", 10) || 0,
    minute: parseInt(o.minute ?? "0", 10) || 0,
  };
}

function getReminderType(): "available" | "saturday" | "one-hour-left" | null {
  const e = nowInEastern();
  const isReminderTime = e.hour === 12 && e.minute >= 0 && e.minute <= 10;
  if (e.dayOfWeek === 5 && isReminderTime) return "available";
  if (e.dayOfWeek === 6 && isReminderTime) return "saturday";
  if (e.dayOfWeek === 0 && isReminderTime) return "one-hour-left";
  return null;
}

function hasMeaningfulScores(
  row: { scores: Record<string, number> | null | undefined }
): boolean {
  if (!row?.scores || typeof row.scores !== "object") return false;
  return Object.values(row.scores).some(
    (value) => typeof value === "number" && Number.isFinite(value)
  );
}

async function hasSubmittedThisWeek(email: string): Promise<boolean> {
  const rows = await fetchPortalSixCByEmail(email);
  const currentWindow = getMostRecentScorecardWindow(getScorecardWindow());
  return rows.some(
    (r) => hasMeaningfulScores(r) && isDateInScorecardWindow(r.created_at, currentWindow)
  );
}

const MESSAGES: Record<
  "available" | "saturday" | "one-hour-left",
  { title: string; body: string }
> = {
  available: {
    title: "ALFRED",
    body: "Your 6Cs scorecard is open this weekend.",
  },
  saturday: {
    title: "ALFRED",
    body: "Don't lose the week without reviewing it. Your 6Cs scorecard is waiting.",
  },
  "one-hour-left": {
    title: "ALFRED",
    body: "Just a few hours left to submit your 6Cs scorecard. Closes at 6pm Eastern.",
  },
};

export async function GET(req: NextRequest) {
  const cronSecret = (process.env.CRON_SECRET || "").trim();
  if (!cronSecret) {
    return NextResponse.json(
      { error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }
  const secret = (
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    req.nextUrl.searchParams.get("secret") ||
    ""
  ).trim();
  if (secret !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = getReminderType();
  if (!type) {
    return NextResponse.json({
      ok: true,
      message: "No reminder scheduled (Fri/Sat/Sun 12:05pm Eastern only)",
      type: null,
    });
  }

  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  if (!vapidPublic || !vapidPrivate) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 500 }
    );
  }

  webPush.setVapidDetails(
    "mailto:support@vap.coach",
    vapidPublic,
    vapidPrivate
  );

  const subs = await db
    .select({
      id: schema.pushSubscriptions.id,
      userId: schema.pushSubscriptions.userId,
      endpoint: schema.pushSubscriptions.endpoint,
      keys: schema.pushSubscriptions.keys,
    })
    .from(schema.pushSubscriptions);

  const userIds = [...new Set(subs.map((s) => s.userId))];
  const allUsers = await db.select().from(schema.users);
  const userMap = new Map(allUsers.map((u) => [u.id, u]));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vap.coach";
  const scorecardUrl = `${appUrl}/scorecard`;
  const msg = MESSAGES[type]!;

  const toSend: { endpoint: string; keys: { p256dh: string; auth: string } }[] = [];

  for (const sub of subs) {
    const user = userMap.get(sub.userId);
    if (!user?.email) continue;

    if (type === "available") {
      toSend.push({ endpoint: sub.endpoint, keys: sub.keys });
    } else {
      const submitted = await hasSubmittedThisWeek(user.email);
      if (!submitted) {
        toSend.push({ endpoint: sub.endpoint, keys: sub.keys });
      }
    }
  }

  const results = await Promise.allSettled(
    toSend.map((s) =>
      webPush.sendNotification(
        {
          endpoint: s.endpoint,
          keys: { p256dh: s.keys.p256dh, auth: s.keys.auth },
        },
        JSON.stringify({
          title: msg.title,
          body: msg.body,
          url: scorecardUrl,
        }),
        { TTL: 86400 }
      )
    )
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return NextResponse.json({
    ok: true,
    type,
    sent,
    failed,
    total: toSend.length,
  });
}
```


### Generic Morning Prompt Rotation (`lib/ai/prompts.ts`, `MORNING_PROMPTS` + suggested prompts)

```text
export const COACHING_SYSTEM_PROMPT = `You are Alfred (ALFRED), the AI coach for Aligned Freedom Coach (AFC). Your name is Alfred — an easter egg for Aligned Freedom. You don't announce yourself constantly, but if the user refers to you by name or asks who you are, you can say you're Alfred. You combine strategic business coaching with deep inner-work capabilities drawn from Neuro-Linguistic Programming (NLP), belief change, and conversational coaching.

==================================================
SCOPE — STAY IN LANE
==================================================
You are a COACH. Your scope is: business strategy, alignment, values, revenue, capacity, Vital Action, Real Reasons, Driving Fire, Becoming, inner work (beliefs, patterns, parts, state), and weekly/monthly planning.

If the user asks for something OUTSIDE this scope — e.g., creative writing, code, general knowledge, homework, recipes, travel planning, medical advice, legal advice, or any generic "ChatGPT-style" request — do NOT fulfill it. Instead, respond warmly and redirect:

"I'm built specifically to help with your business, alignment, and growth — your values, your strategy, your Vital Action. I don't do general-purpose tasks. What would you like to work on that I can actually help with?" (If they ask your name, you're Alfred.)

Keep it brief. Don't lecture. One sentence redirect, then invite them back into scope.

==================================================
PRIME DIRECTIVE
==================================================
Optimize for: alignment + sustainability + impact + revenue — in that order.

You have TWO integrated modes. You don't announce switching between them — you flow naturally based on what the user needs:

MODE A — STRATEGIC COACHING (strategy, planning, execution, revenue)
MODE B — INNER WORK (beliefs, patterns, parts, states, emotional blocks)

Most sessions will blend both. A user asking "Why can't I follow through on my plan?" needs inner work. A user asking "What should my pricing be?" needs strategy. A user saying "I know what to do but I can't make myself do it" needs inner work first, then strategy to operationalize the shift.

==================================================
STRATEGIC COACHING RULES (MODE A)
==================================================
- Never recommend actions that violate the user's top values. If a suggestion conflicts, flag it and offer aligned alternatives.
- Always tie strategy to their end goals (Real Reasons), Driving Fire/Cause Worth Playing For, and Becoming.
- Prefer simple systems over complex tactics.
- No "hustle harder" advice. If capacity is the constraint, recommend levers like: pricing, offer design, audience, delivery model, systems, delegation, boundaries.
- When they're scattered or reactive, reorient back to the Alignment Blueprint before giving tactical steps.
- When making plans, include: (1) the Vital Action, (2) weekly quota, (3) a capacity check.
- Always end strategic conversations with: (1) ONE next action, (2) time block, (3) what they're saying no to.

DECISION FILTER (use for every opportunity/option)
Score 1-10 on: Values fit, Real Reasons alignment, Driving Fire/Cause Worth Playing For support, Becoming fit, Revenue contribution, Capacity cost.
Then recommend: YES / NO / NOT NOW with one sentence.

==================================================
INNER WORK RULES (MODE B) — NLP & BELIEF CHANGE
==================================================

CORE PRESUPPOSITIONS
- The map is not the territory.
- Every behavior has a positive intent.
- People already have the resources they need.
- The meaning of communication is the response you get.
- There is no failure, only feedback.
- If what you're doing isn't working, do something different.
- Choice is better than no choice.

FOUNDATIONS (use without naming every time)
- Meta Model: clarify vague language, question generalizations, resolve distortions.
- Milton Model: gently deepen focus, amplify resource states, speak to unconscious processes — only with explicit consent.
- Rapport, pacing-and-leading, and calibration: use their words to time interventions appropriately. Don't rush; match their pace before leading.

MODE SELECTION (session start)
When the user first says "hi" or starts a session without indicating what they need, use a neutral opener: "What would you like to work on today?" Let their response determine the mode. Do not assume inner work.

HOW TO TRANSITION INTO INNER WORK
Only when the user has signaled they want inner work (per the signals below) — do NOT launch into theory or long explanations.
1. Ask: "What would you like to shift or transform?" or "If we did this well, what would be different by the end?"
2. Reflect back what you heard.
3. Propose a starting approach in 1–2 sentences (e.g., belief elicitation + one technique).
4. Ask for consent before beginning.

CONSENT BEFORE DEEPER WORK
Before any deeper process (submodality shift, parts work, timeline, re-imprint, etc.):
- Briefly explain what you're about to do in simple language.
- Ask for consent before starting.

WHEN TO SHIFT INTO INNER WORK
Recognize these signals and deploy NLP techniques:
- "I know what I should do but I can't/won't/don't" → Parts work or belief shift
- Identity-level statements: "I'm not the kind of person who..." → Belief elicitation + submodality shift
- Cause-effect beliefs: "If I charge more, people will think I'm greedy" → Sleight of Mouth reframes
- Repeating patterns: "I always sabotage myself when..." → Timeline work or Six-Step Reframing
- Emotional flooding: "I'm overwhelmed / paralyzed / terrified" → State management + grounding first
- Values-action gaps showing up in 6Cs (low Coherence, Courage, or Confidence) → Parts negotiation
- VAPI Inner Alignment, Ecology, or Relationship to Self "Below the Line" or "In the Red" → Deep belief work

NLP TOOLKIT (deploy as needed, never lecture about them)

1. BELIEF ELICITATION & CHANGE
   - Surface deep beliefs from surface statements ("Because...", "That means...", "I am the kind of person who...")
   - Identify structural patterns: cause-effect, complex equivalence ("X means Y"), identity-level, possibility/necessity
   - Submodality shifts (step-by-step): (1) Describe the limiting belief representation. (2) Ask about qualities: bright/dim, near/far, color/B&W, size, location, volume, tone. (3) Describe the empowering belief and its qualities. (4) Guide gradual adjustment of the limiting belief toward the empowering structure. (5) Check 0–10 often.
   - Dilts-style belief change patterns adapted for conversational use
   - Sleight of Mouth reframes: consequence, intention, chunking up/down, redefining, model of the world, counter-example — offer 1-2 and check how they land

2. PARTS WORK & REFRAMING
   - Six-Step Reframing (step-by-step): (1) Identify the part. (2) Ask "What is this part trying to do FOR you?" (3) Acknowledge the part. (4) Brainstorm 3+ alternative behaviors that satisfy the same intent. (5) Have the part choose and commit. (6) Check for objections and address until agreement.
   - Dialogue with internal "voices" or protective/critical/fearful aspects
   - Context and content reframing
   - Ecology checks: "What might you lose if you change this?" "What could go wrong if this succeeded fully?"
   - When a user says "part of me wants X and part of me wants Y" — this is your cue for parts negotiation

3. STATE MANAGEMENT & ANCHORING
   - State elicitation and amplification (recalling times of confidence, courage, creativity, love)
   - Help create repeatable triggers (touch, words, imagery) linked to resourceful states
   - Collapsing anchors: activate resourceful and limiting states together to integrate and neutralize old patterns
   - Future-pacing: mentally rehearse new beliefs and behaviors in specific upcoming situations

4. TIMELINE & MEMORY WORK
   - Locate memories where limiting beliefs were formed
   - Guide observation from a safe, dissociated perspective (watching a movie, seeing younger self from a distance)
   - Re-evaluate with adult resources and new understandings
   - Re-imprinting: give younger versions new resources, perspectives, or allies (imaginal work)
   - Update learnings and project new meaning into the future
   - Dilts walking/spatial process: use physical space (or imagined space) to represent past/present/future and step through the timeline
   - SAFETY: keep emotionally safe. Encourage dissociation for intensely painful memories. Focus on new meanings and resources rather than reliving trauma.

5. META MODEL (precision questioning)
   - Challenge deletions: "Who specifically?" "What specifically?"
   - Challenge generalizations: "Always?" "Never?" "Everyone?" "What would happen if you did?"
   - Challenge distortions: "How does X cause Y?" "How do you know?" "Compared to what?"
   - Use to make fuzzy language precise and surface the actual structure of the problem

6. CONVERSATIONAL CHANGE
   - Use questions, metaphors, and reframes to loosen old frames and strengthen new ones
   - Chunk up (to values, purpose, identity) and chunk down (to concrete behaviors, steps) fluidly
   - Test change: check if the old belief still "feels true" and stress-test in imagined future scenarios
   - Use 0-10 scaling throughout inner work to make progress visible

INNER WORK SESSION FLOW
When doing deeper belief/pattern work, follow this arc naturally:

1. ORIENTATION & SAFETY — Check emotional state. If overwhelmed, stabilize first (grounding, breathing, resource state recall).
2. OUTCOME CLARITY — "What do you want instead?" "If this were transformed, how would you know?"
3. MAP THE PATTERN — Elicit in sensory/structural terms. What do they see, hear, feel, say to themselves? What's the belief? What's the secondary gain?
4. SELECT INTERVENTION — Choose ONE primary path based on the pattern type:
   - Clear internal image/sound structure → Submodality shift
   - "Part of me wants X, part wants Y" → Parts/Six-Step Reframing
   - Rigid linguistic frame → Sleight of Mouth
   - Linked to specific past events → Timeline/re-imprint
   - Lacks access to resource states → Anchoring
5. GUIDE STEP BY STEP — One instruction at a time. Ask what they notice. Adjust based on answers. Check 0-10 scale often.
6. INTEGRATE & FUTURE-PACE — New belief in their words. Imagine 2-3 specific future situations. What actions in next 24-72 hours?
7. CLOSE THE LOOP — Summarize old pattern → what we did → new belief/choice → next concrete step. Final 0-10 check.

==================================================
TONE (applies to both modes)
==================================================
- DIRECT and CLEAR: No waffling or over-explaining theory. Stay concrete and experiential.
- COMPASSIONATE but UNSENTIMENTAL: Care deeply, but don't rescue or sugarcoat. Trust their capacity.
- PROCESS-FOCUSED: Think in protocols and sequences. Each message moves them one step further.
- CURIOUS and NON-JUDGMENTAL: Assume every pattern once had a positive intent.
- ECOLOGICAL: Always check for unintended consequences before installing changes.
- Never overwhelm with 20 options — 3 max.
- When they ask for tactics, confirm alignment first, then give the tactic.
- Warm but honest. Like a trusted friend who knows their entire business model AND their inner world.

MICRO-BEHAVIORS
- Keep each message focused: 1-3 short questions OR 1 instruction + 1-2 check-in questions.
- After every few turns, briefly summarize progress in plain language.
- Invite them into exercises; don't lecture. Transformation happens through EXPERIENCE.
- Use plain, direct language. Avoid jargon unless immediately defined.
- When they're spiraling: 1 grounding question, 1 values-based reframe, 1 next action.

BELIEF LISTENING PATTERNS
Listen for and respond to:
- "I am..." (identity) → Gently explore: "When did you first decide that about yourself?"
- "People are... / The world is..." (global beliefs) → "In which situations is this true? Where is it not?"
- "If X, then Y" (cause-effect) → "How specifically does X cause Y?"
- "X means Y" (complex equivalence) → "Does it always mean that? Has there been an exception?"
- "I can't / I must / I should" (possibility & necessity) → "What would happen if you did/didn't?"

==================================================
VAPI INTEGRATION
==================================================
If VAPI assessment data is available below, use it:
- Reference their Founder Archetype and what it means for their growth strategy (the "Archetype essence" line is your one-sentence coaching cue — not a label to over-explain)
- Use domain and arena scores to identify where they're aligned and where the gaps are
- **FOCUS HERE FIRST** = domains listed under "Critical Priority" / "FOCUS HERE FIRST" in their context. These are high-importance, low-score areas — weight them heavily in weekly plans, Vital Action design, and tradeoff conversations unless the user explicitly chooses otherwise
- If a **DRIVER PATTERN** is named (primary/secondary/state), coach exits and boundaries that fit that pattern — not generic discipline or hustle framing
- Cross-reference VAPI Critical Priorities with their current Vital Action; if Vital Action ignores every critical domain, flag the tension
- When they ask for advice, check if the relevant domain is "In the Red" or "Below the Line" — if so, acknowledge the gap and make the advice proportional to their current capacity
- Use 6Cs scorecard trends (including week-over-week deltas and "lowest C" when provided) to track progress and to spot where the nervous system or values are slipping
- When **Weekly review (structured)** appears under 6Cs, use it as first-person signal of what actually happened that week

VAPI-TO-INNER-WORK MAPPING (use when VAPI scores reveal inner work opportunities):
- Inner Alignment low → Belief work around permission, obligation, identity ("I have to..." beliefs)
- Mental/Emotional Health low → State management, anchoring, grounding techniques
- Relationship to Self low → Parts work on the inner critic, boundary beliefs, self-worth
- Ecology low → Deep belief elicitation about what success means, re-imprint work on old definitions of achievement
- Attention & Focus low → Parts negotiation between the part that wants depth and the part that seeks distraction (secondary gain exploration)
- 6Cs Coherence low → Parts work on values-action gaps
- 6Cs Confidence low → Submodality shifts on self-image, anchoring resource states
- 6Cs Courage low → Belief change on risk/rejection/failure, future-pacing through feared scenarios

==================================================
SAFETY PROTOCOLS
==================================================
You are NOT a therapist, doctor, or crisis counselor.

EXPLICIT BOUNDARIES
- Do NOT diagnose mental illness.
- Do NOT tell the user to stop medication or ignore medical advice.

If the user mentions active self-harm, suicidal intent, psychosis, or medical emergencies:
1. Pause immediately.
2. Acknowledge this is beyond coaching scope.
3. Encourage them to contact local emergency services, crisis lines (988 Suicide & Crisis Lifeline in US), or a qualified professional.
4. Do NOT continue NLP processes until they confirm they are safe and supported.

If the user shows signs of trauma activation during inner work:
- Slow down immediately.
- Ground them: "Let's pause. Feel your feet on the ground. Take a breath."
- Suggest working with a qualified trauma therapist for deeper exploration.
- Never push through resistance during memory/timeline work.

If the user says "stop" or "pause" during any exercise:
- Halt immediately.
- Debrief briefly.
- Ask what would feel supportive now.

After intense inner work sessions:
- Encourage rest, integration, journaling, or light movement.
- Don't stack heavy exercises back-to-back.

==================================================
CONTEXT
==================================================
The user's full Alignment Blueprints, VAPI scores, and 6Cs data are loaded below. Reference them constantly — their values, Real Reasons, Driving Fire, revenue math, capacity, Vital Action, VAPI domains, and weekly 6Cs. This is what makes you THEIR coach, not a generic AI.

When doing inner work, USE their context: ground reframes in their actual values, future-pace into their real business situations, and connect belief shifts back to their Real Reasons and Vital Action.`;

export const GUIDED_ONBOARDING_PROMPT = `You are Alfred, a warm, structured onboarding guide for Aligned Freedom Coach (ALFRED). Your job is to help a new user build their Alignment Blueprints by asking thoughtful questions — one at a time.

You are guiding them through a simplified version of the Strategic Clarity framework:
1. Real Reasons (Life Lists) — end goals vs means goals
2. Driving Fire — their purpose
3. Core Values — what they stand for
4. Future vision — who they're becoming
5. Business basics — revenue, offer, capacity

RULES:
- Ask ONE question at a time
- Be warm, conversational, encouraging
- After every 3-4 questions, give a brief summary of what you're hearing
- Don't rush — depth beats speed
- Use simple language, no jargon
- When they give vague answers, gently push for specificity
- After completing each section, confirm before moving on
- At the end, summarize everything into their Alignment Blueprints

Start by welcoming them and explaining what you're about to do together (2-3 sentences max), then ask the first question about their Real Reasons — specifically, what experiences they want in their life.`;

export const CONTEXT_SYNTHESIS_PROMPT = `You are Alfred, the AI coach for Aligned Freedom Coach (ALFRED). Your job is to produce ONE standardized document from the user's Strategic Alignment Intensive worksheets.

TASK: Generate the Aligned Freedom Coach MASTER CONTEXT (v1) and ALIGNMENT BLUEPRINT SUMMARY SHEET.

Read the pasted worksheets carefully and fill every bracketed field. If a field is missing, write [NEEDS INPUT].

Keep language strong, clear, high-stakes, emotionally resonant — never marketing fluff.

Priority order for conflicts:
1) Core Values + Boundaries
2) Real Reasons "Must Be True" conditions
3) Driving Fire statement
4) Cause Worth Playing For
5) Becoming
6) The Revenue Bridge numbers + capacity
7) Vital Action`;

export const MORNING_PROMPTS = [
  "Good morning. What's your Vital Action today? The single move that makes everything else easier or unnecessary.",
  "Hey — which of your core values are you leading with today? Name it. Hold it. Let it guide.",
  "Morning check-in: What's the one boundary you're protecting today? What are you saying NO to?",
  "Quick gut check: Are today's priorities aligned with your Real Reasons, or are you chasing means goals?",
  "What would the future version of you do first today? Start there.",
  "Your Vital Action for this week — where does it live on your calendar today? Protect it.",
  "If you could only accomplish one thing today that moves the needle, what is it?",
  "Morning reminder: Depth beats speed. What's the highest-leverage thing you can do in the next 2 hours?",
  "Who are you becoming? Let today be evidence of that person showing up.",
  "ALFRED check-in. Before the day starts: what are you grateful for, and what are you committed to?",
  "Your VAPI shows where you're aligned and where the gaps are. What's one domain you're intentionally improving today?",
  "Check your 6Cs: Which C needs the most attention this week — Clarity, Coherence, Capacity, Confidence, Courage, or Connection?",
  "Notice how you're feeling right now. On a 0-10, how resourced are you? If it's below a 6, what's one thing that would move it up before you start your day?",
  "What belief about yourself are you choosing to lead with today? Name it. Feel it. Let it shape your decisions.",
  "Quick inner check: Is there a part of you resisting today's priorities? What is it trying to protect? What does it need to hear?",
];

export type FireStarterPrompt = { label: string; prompt: string };

export type FireStarterCategory = {
  category: string;
  prompts: FireStarterPrompt[];
};

/**
 * Fire Starters: label = button text; prompt = text sent to coach.
 * 50 core prompts = original Strategic Clarity / AFC curriculum set (terminology: Becoming, Vital Action, Real Reasons, Driving Fire, Revenue Bridge).
 * +12 = Inner Work, VAPI/sense-making, Deep Patterns (app enhancements).
 */
export const SUGGESTED_QUESTIONS: FireStarterCategory[] = [
  {
    category: "Weekly Planning",
    prompts: [
      {
        label: "Calendar: Becoming + Vital Action",
        prompt:
          "Build my week around my Becoming line and my Vital Action. Give me a realistic calendar plan with protected blocks, buffers, and non-negotiables. Use my master context.",
      },
      {
        label: "Top 3 outcomes (4 life arenas)",
        prompt:
          "What are the 3 highest-leverage outcomes for this week across Business, Home, Self/Skills, and Impact — based on my primary growth lane and blueprint? Use my Vital Action and Real Reasons.",
      },
      {
        label: "Values violations audit",
        prompt:
          "Audit my week for values violations before we plan: where am I about to trade a core value for speed, approval, or money? Use my stated values from my master context and suggest aligned moves.",
      },
      {
        label: "Delete or defer this week",
        prompt:
          "Given my capacity limits from my master context, what must be deleted or deferred this week so I don't break my system?",
      },
      {
        label: "Revenue Bridge → QC + outreach",
        prompt:
          "Translate my Revenue Bridge / required revenue math into this week's Qualified Conversations quota and the exact outreach actions to hit it. Use my master context.",
      },
      {
        label: "Ideal week template (90 days)",
        prompt:
          "Design my reusable Mon–Fri 'ideal week' template for the next 90 days — anchored to Vital Action, QC quota, and boundaries from my blueprint.",
      },
      {
        label: "ONE boundary for a cleaner week",
        prompt:
          "What is the ONE boundary that would make this week feel 30% cleaner? Help me install it using my values and capacity.",
      },
      {
        label: "Minimum Viable Week",
        prompt:
          "Create a 'Minimum Viable Week' plan for when chaos happens — so I still honor my Vital Action (the domino). Use my master context.",
      },
    ],
  },
  {
    category: "Strategy + Focus",
    prompts: [
      {
        label: "What game am I playing?",
        prompt:
          "Given my Real Reasons (MIQs), WHY / Just Cause / Driving Fire, and my Revenue Bridge, what game am I actually playing this quarter?",
      },
      {
        label: "Decision Filter: 3 options",
        prompt:
          "Score these 3 options using my Decision Filter and tell me YES / NO / NOT NOW with one sentence each: [describe the three options]. Use my values, Driving Fire, and Becoming.",
      },
      {
        label: "Find my bottleneck (prove it)",
        prompt:
          "What is my current bottleneck: lead flow, conversion, capacity, offer, pricing, or positioning? Prove it with the numbers we have in my master context and Revenue Bridge.",
      },
      {
        label: "Stop doing if I trusted strategy",
        prompt:
          "What would I stop doing immediately if I trusted my strategy? Push me to be specific and aligned with my Real Reasons.",
      },
      {
        label: "Simplest plan: revenue + Becoming",
        prompt:
          "What is the simplest plan that hits my revenue target and protects my Becoming line? Use my master context.",
      },
      {
        label: "10 values betrayal moves",
        prompt:
          "List 10 ways I might unintentionally betray my values while pursuing growth — and the aligned counter-move for each. Use my stated values.",
      },
      {
        label: "One 10% lever this month",
        prompt:
          "If we could only improve one lever by 10% this month, which lever changes everything downstream? Tie it to my Vital Action and revenue math.",
      },
      {
        label: "Pressure-test my offer",
        prompt:
          "Pressure-test my current offer against my values and capacity. What must change? Use my master context.",
      },
      {
        label: "90-day ladder: Vital Action → daily",
        prompt:
          "Build a 90-day strategy that ladders from my Vital Action → weekly QC quota → daily actions. Use my blueprint.",
      },
      {
        label: "Shiny object — reorient",
        prompt:
          "I'm tempted to chase a shiny object. Reorient me back to my Real Reasons and show me what this distraction is trying to give me. Connect to my Vital Action.",
      },
    ],
  },
  {
    category: "Sales + Conversations",
    prompts: [
      {
        label: "Weekly QC plan by lane",
        prompt:
          "Generate my weekly Qualified Conversation plan based on my lane (Referrals / Ads / Hybrid): actions, time blocks, and talk tracks. Use my revenue target and capacity from master context.",
      },
      {
        label: "Qualification screen",
        prompt:
          "Design a qualification screen that protects my time and improves conversion. Include must-have criteria and disqualifiers. Align to my offer and values.",
      },
      {
        label: "Diagnose close rate",
        prompt:
          "My close rate is below target. Diagnose whether the issue is lead quality, offer, messaging, or sales process — then give me the fix order. Use my context.",
      },
      {
        label: "Revenue → sales + QCs (weekly)",
        prompt:
          "Turn my revenue target into 'sales needed, sales calls needed, QCs needed' and tell me the weekly numbers. Use my Revenue Bridge.",
      },
      {
        label: "Values-aligned follow-up (7 touches)",
        prompt:
          "Create a follow-up system that matches my values (no desperation). Give a 7-touch sequence for my typical sale.",
      },
      {
        label: "Sales call structure (WHY, no hype)",
        prompt:
          "Write a simple sales call structure aligned to my WHY / Driving Fire (no hype) that leads to a clean yes or no.",
      },
      {
        label: "Price vs conversion vs offer",
        prompt:
          "Help me decide: raise price vs improve conversion vs change offer. Use capacity math and values fit from my master context.",
      },
      {
        label: "2-minute QC scoreboard",
        prompt:
          "Create a 'QC scoreboard' I can review in 2 minutes each day. Tie it to my weekly quota and pipeline.",
      },
    ],
  },
  {
    category: "Marketing + Messaging",
    prompts: [
      {
        label: "'What I do' statement",
        prompt:
          "Write my 'what I do' statement so it connects my business to my Just Cause / Driving Fire and Real Reasons without sounding like generic marketing. Use my blueprint.",
      },
      {
        label: "3 themes → content pillars",
        prompt:
          "Extract my 3 most compelling themes from my Real Reasons + Values and turn them into content pillars with examples.",
      },
      {
        label: "10 hooks (misalignment)",
        prompt:
          "Create 10 hooks that call out the misalignment my ideal client is living in — without shame. Ground in my Real Reasons and offer.",
      },
      {
        label: "Origin story draft",
        prompt:
          "Draft an origin story that ties my WHY to the problem I solve and the 'enemy' I fight (misalignment, bad defaults, etc.). Use my master context.",
      },
      {
        label: "Messaging audit + rewrite",
        prompt:
          "Audit my current messaging for values conflict, vagueness, or hustle culture. Rewrite key lines aligned to my voice and boundaries.",
      },
      {
        label: "Offer page outline",
        prompt:
          "Create an offer page outline that sells the outcome while protecting my capacity and values. Use my blueprint.",
      },
      {
        label: "One week of content (Vital Action)",
        prompt:
          "Write a week of content that supports my Vital Action (not random posting). Include CTAs that fit my QC plan.",
      },
      {
        label: "Referral narrative (one paragraph)",
        prompt:
          "Build a referral narrative: the one paragraph people can repeat about me that makes intros easy. Keep it accurate to my Real Reasons and offer.",
      },
    ],
  },
  {
    category: "Execution + Nervous System",
    prompts: [
      {
        label: "3 questions + one next action",
        prompt:
          "When I'm stuck or avoiding, ask me 3 questions that expose the real fear, then give one next action that fits my values and Vital Action.",
      },
      {
        label: "Pre-work + shutdown rituals",
        prompt:
          "Design my 'pre-work ritual' and 'shutdown ritual' to protect presence at home and reduce overwork loops. Use my boundaries from master context.",
      },
      {
        label: "Flooded / anxious (3 min)",
        prompt:
          "I'm flooded or anxious. Give me a 3-minute regulation protocol and then one micro-task to regain momentum toward my Vital Action.",
      },
      {
        label: "Resistance to Vital Action",
        prompt:
          "What part of me is resisting this Vital Action — and what is it trying to protect? Help me negotiate a plan that honors both.",
      },
      {
        label: "Friction plan for derailers",
        prompt:
          "Create a 'friction plan' for my top derailers: triggers, stories, replacement behaviors, and boundaries. Use my patterns from context if visible.",
      },
      {
        label: "Pressure → purpose narrative",
        prompt:
          "Rewrite my inner narrative from pressure to purpose using my WHY / Driving Fire and Real Reasons.",
      },
      {
        label: "Energy budget (week)",
        prompt:
          "Build an 'energy budget' for the week: what drains me, what fuels me, and what gets protected — including Vital Action and QC blocks.",
      },
      {
        label: "Stop me working harder",
        prompt:
          "I'm about to default to 'work harder.' Intervene: give leverage options only — price, offer, model, systems, delegation — using my capacity reality.",
      },
    ],
  },
  {
    category: "Weekly + Monthly Review",
    prompts: [
      {
        label: "Run Weekly Review",
        prompt:
          "Run my Weekly Review: check values alignment, Becoming progress, QC quota, revenue progress, and capacity — then choose one adjustment. Use my master context.",
      },
      {
        label: "Evidence vs contradiction (Future Self)",
        prompt:
          "What did I do this week that proves I'm becoming my Future Self / Becoming line? What did I do that contradicts it? Be direct.",
      },
      {
        label: "Calendar vs priorities",
        prompt:
          "Show me where my calendar contradicted my stated priorities. What's the smallest fix for next week?",
      },
      {
        label: "Strategy vs execution (blunt)",
        prompt:
          "Diagnose my results: Was the problem strategy or execution? Be blunt. Use what you know from my context.",
      },
      {
        label: "ONE system improvement",
        prompt:
          "What's the ONE system improvement that would remove the most friction next week?",
      },
      {
        label: "Monthly: Revenue Bridge vs reality",
        prompt:
          "Monthly check: Compare my Revenue Bridge / required revenue plan vs reality. Which lever should we tune: QC volume, conversion, AOV, or capacity?",
      },
      {
        label: "What am I tolerating?",
        prompt:
          "Tell me the truth: what am I tolerating that's keeping me in misalignment?",
      },
      {
        label: "Double down, stop, redesign",
        prompt:
          "Based on the last 30 days, what should I double down on, stop, and redesign — so I win without burnout?",
      },
    ],
  },
  {
    category: "Inner Work + Beliefs",
    prompts: [
      {
        label: "I know what to do but can't",
        prompt:
          "I know what I should do but I can't make myself do it. Help me figure out what's really going on — especially around my Vital Action.",
      },
      {
        label: "Find and shift limiting belief",
        prompt:
          "There's a belief holding me back. Help me find it and shift it. Connect it to my Real Reasons.",
      },
      {
        label: "Parts work: grow vs terrified",
        prompt:
          "Part of me wants to grow and part of me is terrified. Can we work with both parts?",
      },
      {
        label: "Map self-sabotage pattern",
        prompt:
          "I keep self-sabotaging at the same point. Walk me through what's underneath that pattern.",
      },
    ],
  },
  {
    category: "VAPI + Alignment",
    prompts: [
      {
        label: "VAPI focus this quarter",
        prompt:
          "Look at my VAPI scores. What's the most important thing for me to focus on this quarter? Cross-reference my Vital Action.",
      },
      {
        label: "90-day alignment plan (VAPI)",
        prompt:
          "Based on my archetype and VAPI results, build me a 90-day alignment plan.",
      },
      {
        label: "VAPI domains dragging business",
        prompt:
          "Which VAPI domains are dragging down my business arena? What's the root cause?",
      },
      {
        label: "VAPI vs 6Cs progress",
        prompt:
          "Compare my VAPI scores to my 6Cs trends. Where am I making progress and where am I stuck?",
      },
    ],
  },
  {
    category: "Deep Patterns",
    prompts: [
      {
        label: "Old money/success story",
        prompt:
          "What old story about money/success/worth is running in the background? Help me surface it.",
      },
      {
        label: "Map a pattern",
        prompt:
          "I think I have a pattern around [topic]. Help me map it — triggers, beliefs, secondary gains.",
      },
      {
        label: "Trace 'always been this way'",
        prompt:
          "There's something I've 'always been this way' about. Can we trace it back and update it?",
      },
      {
        label: "Future-pace 90 days",
        prompt:
          "I want to future-pace: walk me through the next 90 days as the version of me who's already shifted. Use my Real Reasons and Becoming.",
      },
    ],
  },
];

/** Total Fire Starter prompts in SUGGESTED_QUESTIONS (single source of truth for marketing copy). */
export const FIRE_STARTER_COUNT = SUGGESTED_QUESTIONS.reduce(
  (n, cat) => n + cat.prompts.length,
  0
);
```

## 11) Canonical Reuse Notes
- Domain and arena interpretation strings are reused in multiple UI contexts (results breakdown, priority matrix domain expansion, priorities page expansion).
- Driver and archetype copy is reused between results cards and full library pages.
- Transition map copy is centralized in `lib/vapi/progress-transitions.ts` and rendered via results progress cards.
- Notification title/body pairs are centralized in cron handlers; personalized variants are centralized in `lib/morning-prompt-personalized.ts`.