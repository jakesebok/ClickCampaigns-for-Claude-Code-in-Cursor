import type { OnboardingSectionId } from "@/lib/db/schema";

/**
 * Canonical onboarding sections, in the order Alfred walks the user through
 * them. Source of truth for both the prompt (which Alfred uses to identify
 * sections in [[STATE:...]] markers) and the UI (progress indicator + revise
 * picker).
 */
export type OnboardingSection = {
  id: OnboardingSectionId;
  /** Human-readable label shown in the UI. */
  label: string;
  /** Short description shown alongside the label in the revise picker. */
  description: string;
};

export const ONBOARDING_SECTIONS: readonly OnboardingSection[] = [
  {
    id: "real_reasons",
    label: "Real Reasons",
    description: "End goals vs. means goals — what experiences you want from your life.",
  },
  {
    id: "driving_fire",
    label: "Driving Fire",
    description: "Your purpose. The why behind the work.",
  },
  {
    id: "core_values",
    label: "Core Values",
    description: "What you stand for. The lines you will not cross.",
  },
  {
    id: "future_vision",
    label: "Future Vision",
    description: "Who you are becoming — the next version of you.",
  },
  {
    id: "business_basics",
    label: "Business Basics",
    description: "Revenue, offer, capacity. The numbers and rhythm of your work.",
  },
] as const;

export const TOTAL_SECTIONS = ONBOARDING_SECTIONS.length;

export function getSectionById(id: string): OnboardingSection | null {
  return ONBOARDING_SECTIONS.find((s) => s.id === id) ?? null;
}

export function getSectionByIndex(oneBasedIndex: number): OnboardingSection | null {
  if (oneBasedIndex < 1 || oneBasedIndex > ONBOARDING_SECTIONS.length) return null;
  return ONBOARDING_SECTIONS[oneBasedIndex - 1];
}

export function getSectionIndex(id: string): number | null {
  const i = ONBOARDING_SECTIONS.findIndex((s) => s.id === id);
  return i === -1 ? null : i + 1;
}
