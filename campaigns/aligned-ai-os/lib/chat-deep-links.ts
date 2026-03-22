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
