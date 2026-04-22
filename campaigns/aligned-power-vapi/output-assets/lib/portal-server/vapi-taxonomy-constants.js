/**
 * Shared VAPI taxonomy constants used across ritual UIs, presence engine,
 * coach dashboard, and agent prompts. Sourced from the existing assessment
 * files to avoid duplication drift.
 *
 * Wave 1 additive module.
 */

export const DOMAINS = [
  { code: 'PH', name: 'Physical Health', arena: 'Personal' },
  { code: 'IA', name: 'Inner Alignment', arena: 'Personal' },
  { code: 'ME', name: 'Mental & Emotional Health', arena: 'Personal' },
  { code: 'AF', name: 'Attention & Focus', arena: 'Personal' },
  { code: 'RS', name: 'Relationship to Self', arena: 'Relationships' },
  { code: 'FA', name: 'Family', arena: 'Relationships' },
  { code: 'CO', name: 'Community', arena: 'Relationships' },
  { code: 'WI', name: 'World & Impact', arena: 'Relationships' },
  { code: 'VS', name: 'Vision & Strategy', arena: 'Business' },
  { code: 'EX', name: 'Execution', arena: 'Business' },
  { code: 'OH', name: 'Operational Health', arena: 'Business' },
  { code: 'EC', name: 'Ecology', arena: 'Business' },
];

export const DOMAIN_BY_CODE = Object.fromEntries(DOMAINS.map(d => [d.code, d]));

export const ARENAS = ['Personal', 'Relationships', 'Business'];

export const DRIVERS = [
  { key: 'achievers_trap', name: "The Achiever's Trap" },
  { key: 'escape_artist', name: 'The Escape Artist' },
  { key: 'pleasers_bind', name: "The Pleaser's Bind" },
  { key: 'imposter_loop', name: 'The Imposter Loop' },
  { key: 'perfectionists_prison', name: "The Perfectionist's Prison" },
  { key: 'protector', name: 'The Protector' },
  { key: 'martyr_complex', name: 'The Martyr Complex' },
  { key: 'fog', name: 'The Fog' },
  { key: 'scattered_mind', name: 'The Scattered Mind' },
  { key: 'builders_gap', name: "The Builder's Gap" },
  { key: 'aligned_momentum', name: 'Aligned Momentum' },
];

export const DRIVER_BY_KEY = Object.fromEntries(DRIVERS.map(d => [d.key, d]));

export const ARCHETYPES = [
  'The Architect',
  'The Journeyman',
  'The Performer',
  'The Ghost',
  'The Guardian',
  'The Seeker',
  'The Drifter',
  'The Engine',
  'The Phoenix',
];

// Evening review prompt catalog — post-trade-scorecard pattern.
// Day type chosen by user, one prompt rendered. Process-focused, outcome-neutral.
export const EVENING_PROMPTS = [
  { id: 'vapi-eve-01', day_type: 'aligned',       text: 'Today honored your plan. Name one thing this alignment did not prove about you.' },
  { id: 'vapi-eve-02', day_type: 'drift',         text: 'A priority slipped. Name the exact moment the justification arrived.' },
  { id: 'vapi-eve-03', day_type: 'scratch',       text: 'Ordinary day. Rich on practice. Name one thing you noticed this week that you missed last week.' },
  { id: 'vapi-eve-04', day_type: 'win',           text: 'A win. Was it conviction in the plan, or hope the plan would reward you?' },
  { id: 'vapi-eve-05', day_type: 'any',           text: 'Your top driver had an opening today. Name the moment you felt it, or confirm it stayed quiet.' },
  { id: 'vapi-eve-06', day_type: 'boundary',      text: 'You said no to something today. Rule-based or feeling-based? Mark both valid. Name which.' },
  { id: 'vapi-eve-07', day_type: 'overextension', text: 'You took on more than baseline. What specifically about today earned the extra, in one sentence?' },
  { id: 'vapi-eve-08', day_type: 'any',           text: 'You exited a commitment early. Did you move first, or did circumstances? The answer is data, not a verdict.' },
];

export const DAY_TYPES = [
  { id: 'aligned',       label: 'Aligned',       hint: 'Honored your plan' },
  { id: 'drift',         label: 'Drift',         hint: 'A priority slipped' },
  { id: 'scratch',       label: 'Scratch',       hint: 'Ordinary, neither' },
  { id: 'win',           label: 'Win',           hint: 'Real forward motion' },
  { id: 'boundary',      label: 'Boundary',      hint: 'Said no to something' },
  { id: 'overextension', label: 'Overextension', hint: 'Took on more than baseline' },
  { id: 'any',           label: 'Just reflect',  hint: 'General read on the day' },
];

export function promptForDayType(dayType) {
  const match = EVENING_PROMPTS.find(p => p.day_type === dayType);
  if (match) return match;
  return EVENING_PROMPTS.find(p => p.day_type === 'any');
}

export const CRITICAL_PRIORITY_THRESHOLD = { scoreMax: 6, importanceMin: 7 };
