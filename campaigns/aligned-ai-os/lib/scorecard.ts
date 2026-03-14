export type ScorecardCategory = {
  key: string;
  label: string;
  icon: string;
  questions: string[];
  reflectionPrompt: string;
};

export const SCORECARD_CATEGORIES: ScorecardCategory[] = [
  {
    key: "clarity",
    label: "Clarity",
    icon: "crosshair",
    questions: [
      "I knew what mattered most this week.",
      "I was clear on the outcomes I was aiming for.",
      "I stayed focused as much as I wanted to.",
      "I knew the feelings/state I wanted to generate this week.",
      "I identified my Vital Action to improve next week.",
    ],
    reflectionPrompt:
      "If I was going to be even more clear on what matters most and stay focused on the outcomes I want next week, I would need to…",
  },
  {
    key: "coherence",
    label: "Coherence",
    icon: "link",
    questions: [
      "My actions matched my values more often than not.",
      "I made decisions that aligned with my season and priorities.",
      "I honored boundaries that protect my energy and focus.",
      "I said no to distractions or misaligned commitments.",
      "I acted with integrity even when it was inconvenient.",
    ],
    reflectionPrompt:
      "If I was going to be even more proud of who I am and how I show up (actions matching values) next week, I would need to…",
  },
  {
    key: "capacity",
    label: "Capacity",
    icon: "battery-charging",
    questions: [
      "My nervous system could hold my life this week.",
      "I recovered well from stress (regulation, rest, reset).",
      "I fueled and moved my body in supportive ways.",
      "I kept a sustainable pace (not adrenaline-driven).",
      "I noticed overload early and adjusted before I crashed.",
    ],
    reflectionPrompt:
      "If I was going to support my nervous system and sustain my energy better next week, I would need to…",
  },
  {
    key: "confidence",
    label: "Confidence",
    icon: "shield-check",
    questions: [
      "I kept my word to myself this week.",
      "I followed through on my commitments without needing urgency.",
      "I spoke honestly about what was true (to myself and others).",
      "I made decisions and owned them (no second-guess spiral).",
      "I treated myself with self-respect (standards, not shame).",
    ],
    reflectionPrompt:
      "If I was going to keep my word to myself and act with more self-trust next week, I would need to…",
  },
  {
    key: "courage",
    label: "Courage",
    icon: "zap",
    questions: [
      "I took action even when I felt fear or resistance.",
      "I showed up for difficult moments when it would have been easier not to.",
      "I showed up visibly (sell, share, lead) despite discomfort.",
      "I tolerated uncertainty without freezing or numbing out.",
      "I did the hard right thing instead of the easy familiar thing.",
    ],
    reflectionPrompt:
      "If I was going to take the hard right action and show up more visibly despite fear next week, I would need to…",
  },
  {
    key: "connection",
    label: "Connection",
    icon: "users",
    questions: [
      "I was genuinely present with the people who matter.",
      "I asked for support instead of carrying everything alone.",
      "I invested in relationships that energize and ground me.",
      "I contributed or served in a way that felt aligned.",
      "I felt connected to something bigger than my own stress.",
    ],
    reflectionPrompt:
      "If I was going to have more authentic, intentional, and meaningful relationships with the people around me next week, I should…",
  },
];

export function calculateScore(answers: number[]): number {
  const total = answers.reduce((a, b) => a + b, 0);
  return Math.min(100, Math.round(total * 4));
}

export function getOverallScore(scores: Record<string, number>): number {
  const values = Object.values(scores);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export const CATEGORY_ICONS: Record<string, string> = {
  clarity: "crosshair",
  coherence: "link",
  capacity: "battery-charging",
  confidence: "shield-check",
  courage: "zap",
  connection: "users",
};
