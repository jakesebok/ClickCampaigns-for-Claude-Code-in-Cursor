import type { OnboardingState, OnboardingSectionId } from "@/lib/db/schema";
import { getSectionById, getSectionIndex, ONBOARDING_SECTIONS } from "./onboarding-sections";

/**
 * State markers Alfred is instructed to emit during the guided onboarding flow.
 * Format: [[STATE:{...JSON...}]] on its own line. Server parses, applies, strips.
 */
export type StateMarker =
  | { kind: "section_complete"; section: OnboardingSectionId; summary: string }
  | { kind: "ready_to_wrap" }
  | { kind: "finalized" };

// Marker grammar: [[STATE:{...JSON...}]] — non-greedy match between opening
// brace and closing }]]. Uses [\s\S] instead of the s flag so the regex is
// compatible with the project's TS target (pre-ES2018).
const STATE_MARKER_REGEX = /\[\[STATE:(\{[\s\S]*?\})\]\]/g;

/** Default state for a brand-new onboarding conversation. */
export function emptyOnboardingState(): OnboardingState {
  return {
    currentSection: 1,
    sections: {},
    readyToWrap: false,
    finalized: false,
  };
}

/**
 * Extract every [[STATE:...]] marker from a body of text. Skips markers that
 * fail JSON parse or don't match a known shape.
 */
export function extractStateMarkers(text: string): StateMarker[] {
  const out: StateMarker[] = [];
  const matches = Array.from(text.matchAll(STATE_MARKER_REGEX));
  for (const m of matches) {
    const raw = m[1];
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      continue;
    }
    if (!parsed || typeof parsed !== "object") continue;
    const obj = parsed as Record<string, unknown>;

    if (obj.action === "ready_to_wrap") {
      out.push({ kind: "ready_to_wrap" });
      continue;
    }
    if (obj.action === "finalized") {
      out.push({ kind: "finalized" });
      continue;
    }
    if (
      typeof obj.section === "string" &&
      obj.status === "complete" &&
      typeof obj.summary === "string" &&
      getSectionById(obj.section)
    ) {
      out.push({
        kind: "section_complete",
        section: obj.section as OnboardingSectionId,
        summary: obj.summary,
      });
    }
  }
  return out;
}

/** Strip every [[STATE:...]] marker from text so the user never sees them. */
export function stripStateMarkers(text: string): string {
  return text.replace(STATE_MARKER_REGEX, "").replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Apply markers to a state, returning a new state. Pure function — does not
 * mutate the input.
 */
export function applyMarkers(
  current: OnboardingState | null | undefined,
  markers: StateMarker[],
): OnboardingState {
  const next: OnboardingState = current
    ? { ...current, sections: { ...current.sections } }
    : emptyOnboardingState();

  for (const m of markers) {
    if (m.kind === "section_complete") {
      next.sections[m.section] = { status: "complete", summary: m.summary };
      // Advance the pointer to the next not-yet-complete section, capped at 5.
      const completedIndex = getSectionIndex(m.section) ?? 0;
      next.currentSection = Math.min(
        ONBOARDING_SECTIONS.length,
        Math.max(next.currentSection, completedIndex + 1),
      );
    } else if (m.kind === "ready_to_wrap") {
      next.readyToWrap = true;
    } else if (m.kind === "finalized") {
      next.readyToWrap = true;
      next.finalized = true;
    }
  }

  return next;
}

/**
 * Build a short context block to inject into the system prompt so Alfred
 * remembers where they are across turns. Empty string if nothing useful yet.
 */
export function formatStateForPrompt(state: OnboardingState | null | undefined): string {
  if (!state) return "";
  const completedIds = Object.entries(state.sections)
    .filter(([, v]) => v?.status === "complete")
    .map(([k]) => k);
  if (completedIds.length === 0 && !state.readyToWrap) {
    return `\n\n---\nCURRENT ONBOARDING STATE: starting fresh, no sections captured yet. Begin with Real Reasons.`;
  }

  const lines: string[] = [];
  lines.push("\n\n---\nCURRENT ONBOARDING STATE:");
  for (const section of ONBOARDING_SECTIONS) {
    const captured = state.sections[section.id];
    if (captured?.status === "complete") {
      lines.push(`- ${section.label} (${section.id}): COMPLETE. Captured summary: "${captured.summary}"`);
    } else {
      lines.push(`- ${section.label} (${section.id}): not yet captured`);
    }
  }
  lines.push(`Pointer: currentSection = ${state.currentSection}`);
  if (state.readyToWrap) {
    lines.push("Status: All sections captured. Awaiting user confirmation to finalize.");
  }
  if (state.finalized) {
    lines.push("Status: User has finalized. Blueprints have been generated.");
  }
  lines.push("Do not re-ask sections that are already COMPLETE. Pick up from the next not-yet-captured section, or address whatever the user just said.");
  return lines.join("\n");
}

/** Are all five sections marked complete? */
export function allSectionsComplete(state: OnboardingState | null | undefined): boolean {
  if (!state) return false;
  return ONBOARDING_SECTIONS.every((s) => state.sections[s.id]?.status === "complete");
}

/** Build the responses map (sectionId -> summary) used by generateGuidedContext. */
export function collectResponses(state: OnboardingState): Record<string, string> {
  const out: Record<string, string> = {};
  for (const section of ONBOARDING_SECTIONS) {
    const captured = state.sections[section.id];
    if (captured?.summary) out[section.label] = captured.summary;
  }
  return out;
}
