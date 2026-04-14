import {
  BatteryCharging,
  Crosshair,
  Link2,
  ShieldCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const BUSINESS_GOAL_OPTIONS = [
  { id: "lead_gen", label: "Lead generation on my website" },
  { id: "client_intake", label: "Structured intake for paying clients" },
  { id: "team_rollout", label: "Team or cohort rollout" },
  { id: "qualification", label: "Qualify buyers before sales calls" },
  { id: "coaching_insight", label: "Deeper insight for my coaching process" },
  { id: "data_asset", label: "Owned data and trends over time" },
] as const;

export const OPTIONAL_MODULE_OPTIONS = [
  { id: "client_portal", label: "Client portal (history, progress)" },
  { id: "coaching_dashboard", label: "Coaching dashboard" },
  { id: "importance_matrix", label: "Importance × performance matrix" },
  { id: "auto_plans", label: "Auto-generated plans (sprints, weeks, themes)" },
  { id: "longitudinal", label: "Ongoing scorecard / rhythm (like 6Cs)" },
  { id: "native_app", label: "Dedicated client app (mobile or web)" },
] as const;

export const RESULT_OUTPUT_OPTIONS = [
  { id: "composite", label: "Composite / index score" },
  { id: "arenas", label: "Arena or category scores" },
  { id: "domains", label: "Individual domain or pillar scores" },
  { id: "wheel", label: "Interactive wheel visualization" },
  { id: "explore", label: "Explore-your-score breakdown" },
  { id: "libraries", label: "Pattern or driver libraries" },
  { id: "pdf", label: "Downloadable PDF summary" },
] as const;

export const READING_LEVEL_STOPS = [
  { id: 0, short: "K–3", label: "Very simple, plain language" },
  { id: 1, short: "6–8", label: "Middle school readability" },
  { id: 2, short: "9–12", label: "High school, conversational" },
  { id: 3, short: "College", label: "Professional, still accessible" },
  { id: 4, short: "Expert", label: "Graduate / peer-level density" },
  { id: 5, short: "Einstein", label: "Dense, assumes deep context" },
] as const;

export const WHO_AUTHORS_OPTIONS = [
  { id: "client_team", label: "My team will draft; you refine" },
  { id: "jake_draft", label: "You draft from interviews / materials" },
  { id: "hybrid", label: "Hybrid (we start; you finish)" },
  { id: "undecided", label: "Not sure yet" },
] as const;

export const SIX_C_KEYS = [
  "clarity",
  "coherence",
  "capacity",
  "confidence",
  "courage",
  "connection",
] as const;

export type SixCKey = (typeof SIX_C_KEYS)[number];

export const SIX_C_META: Record<
  SixCKey,
  { label: string; icon: LucideIcon; demoPair: [string, string] }
> = {
  clarity: {
    label: "Clarity",
    icon: Crosshair,
    demoPair: [
      "I can state my top outcomes for the week in one sentence.",
      "I know what to say no to without guilt.",
    ],
  },
  coherence: {
    label: "Coherence",
    icon: Link2,
    demoPair: [
      "My calendar matches what I claim matters.",
      "My actions line up with my stated priorities.",
    ],
  },
  capacity: {
    label: "Capacity",
    icon: BatteryCharging,
    demoPair: [
      "I have enough energy for deep work, not just meetings.",
      "I am not running on fumes most days.",
    ],
  },
  confidence: {
    label: "Confidence",
    icon: ShieldCheck,
    demoPair: [
      "I trust my decisions without re-litigating them endlessly.",
      "I can commit and adjust without spiraling.",
    ],
  },
  courage: {
    label: "Courage",
    icon: Zap,
    demoPair: [
      "I initiate hard conversations when they matter.",
      "I move before conditions feel perfect.",
    ],
  },
  connection: {
    label: "Connection",
    icon: Users,
    demoPair: [
      "Key relationships feel tended, not postponed.",
      "People around me would say I show up fully.",
    ],
  },
};

export function scorecardColor(pct: number) {
  if (pct <= 30) return "#ef4444";
  if (pct <= 55) return "#f97316";
  if (pct <= 79) return "#eab308";
  return "#22c55e";
}
