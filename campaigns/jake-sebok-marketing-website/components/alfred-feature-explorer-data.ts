/**
 * Verbatim or structural copy from the ALFRED app (aligned-ai-os).
 * Sources cited in alfred-feature-explorer.tsx header.
 */

export const CHAT_SUBTITLE = "Values-aligned guidance, personalized to you";

/** lib/ai/prompts.ts — SUGGESTED_QUESTIONS categories (button labels) */
export const FIRE_STARTER_CATEGORIES = [
  "Weekly Planning",
  "Strategy + Focus",
  "Sales + Conversations",
  "Marketing + Messaging",
  "Execution + Nervous System",
  "Weekly + Monthly Review",
  "Inner Work + Beliefs",
  "VAPI + Alignment",
  "Deep Patterns",
] as const;

/** Weekly Planning prompts — label + exact prompt string sent to /api/chat (first four in app) */
export const WEEKLY_PLANNING_PROMPTS: { label: string; prompt: string }[] = [
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
];

/** Demo: highlighted sub-prompt in Weekly Planning list (matches tour + full sample reply). */
export const WEEKLY_PLANNING_DEMO_LABEL = "Calendar: Becoming + Vital Action" as const;

/**
 * Inner Work + Beliefs — Fire Starters submenu.
 * Verbatim from aligned-ai-os `lib/ai/prompts.ts` → SUGGESTED_QUESTIONS (category "Inner Work + Beliefs").
 */
export const INNER_WORK_BELIEFS_PROMPTS: { label: string; prompt: string }[] = [
  {
    label: "I know what to do but can't",
    prompt:
      "I know what I should do but I can't make myself do it. Help me figure out what's really going on — especially around my Vital Action.",
  },
  {
    label: "Find and shift limiting belief",
    prompt: "There's a belief holding me back. Help me find it and shift it. Connect it to my Real Reasons.",
  },
  {
    label: "Parts work: grow vs terrified",
    prompt: "Part of me wants to grow and part of me is terrified. Can we work with both parts?",
  },
  {
    label: "Map self-sabotage pattern",
    prompt: "I keep self-sabotaging at the same point. Walk me through what's underneath that pattern.",
  },
];

/** Sub-prompt that carries the full limiting-belief demo in the mock thread (matches production label). */
export const INNER_WORK_DEMO_LABEL = "Find and shift limiting belief" as const;

/**
 * Casual first user message for the Inner Work animated demo (not the Fire Starter string).
 * Shows you can type like a human; Alfred still ties to blueprint / Real Reasons from context.
 */
export const INNER_WORK_DEMO_CASUAL_USER_MESSAGE =
  "ok this is gonna sound dramatic but i have this constant fear that if im not basically living in slack/email the whole business unravels. like im the only adult in the room. i hate it but its loud today";

/**
 * Alternating assistant / user bubbles after the casual first message (animated demo only).
 * Each entry is one chat bubble—no **Alfred** / **You** labels in copy.
 */
export const INNER_WORK_LIMITING_BELIEF_DEMO_TURNS: readonly {
  role: "user" | "assistant";
  content: string;
}[] = [
  {
    role: "assistant",
    content:
      "I'm not here to shame the pace—that anxiety is real. I'm also looking at what you wrote about wanting presence at home and the Vital Action you set around defending focus time; those aren't opposites if we separate the story from the facts.\n\nBlunt question: when you imagine actually honoring that this week, what's the first \"yeah, but…\" your brain hands you?",
  },
  {
    role: "user",
    content: "yeah but if i step back even a little people will realize im not actually essential",
  },
  {
    role: "assistant",
    content:
      "That's a belief wearing a strategy costume—*always on = proof I matter.* Two quick tests: when you protected even 90 minutes for deep work or closed the laptop for dinner last week, did the business actually blow up—or did it mostly… keep moving?\n\nAnd honestly—does another hour of Slack change pipeline this week, or does it mostly numb the discomfort of being still?",
  },
  {
    role: "user",
    content: "it didnt blow up. fine. mostly numbs it. ugh.",
  },
  {
    role: "assistant",
    content:
      "Good data. Kinder sentence that still matches what you said you want about time with your people and your standard at work: *rest doesn't erase my standard—it protects the nervous system that has to carry the standard.*\n\nTomorrow: put your Vital Action block on the calendar like a client meeting. When guilt shows up, don't debate—label it out loud: \"old belief,\" sit with it for sixty seconds, then choose your next move.\n\nTell me when that fear spikes loudest (mornings, after kids are down, slow pipeline days)—I'll tie the next step to your real week, not a lecture.",
  },
];

/** First assistant message in the animated Coach thread demo (Weekly Planning full demo). */
export const COACH_DEMO_WEEKLY_THREAD_OPENER =
  "I've got your Vital Action, QC target from your revenue bridge, and the boundaries in your blueprint. Type it like a text if you want—I'll build the week around what you already committed to.";

/**
 * Casual first user line for the Weekly Planning animated demo (not the Fire Starter string).
 */
export const WEEKLY_DEMO_CASUAL_USER_MESSAGE =
  "hey can you help me build an actual week around my vital action + my qc number... i keep *meaning* to then tuesday hits and im just reacting to slack all day";

/**
 * Weekly Planning demo: alternating bubbles after the casual first message (same rhythm as Inner Work demo).
 */
export const WEEKLY_PLANNING_DEMO_TURNS: readonly {
  role: "user" | "assistant";
  content: string;
}[] = [
  {
    role: "assistant",
    content:
      "Got it. I'm anchoring three things from your context: your Vital Action is defending focus blocks, your bridge implies **12 qualified conversations** this week, and your blueprint treats **dinner by 6:30** and **no Slack after 8** as hard edges—not nice-to-haves. We build the calendar around those first.",
  },
  {
    role: "user",
    content: "yeah thats the leak. mornings i *say* deep work then slack eats them",
  },
  {
    role: "assistant",
    content:
      "Then we protect the first block like a client meeting. For QCs: I'd place **three** Tuesday morning, **three** Thursday morning, and **two** each Mon / Wed / Fri **before noon**—so afternoons stay for delivery and the work only you can do.",
  },
  {
    role: "user",
    content: "ok show me what monday actually looks like roughly",
  },
  {
    role: "assistant",
    content:
      "Sample skeleton (adjust for your time zone):\n\n**Mon:** 8:00–10:30 deep work (Vital Action). 10:30–12:00 QC. Lunch. 1:00–3:00 delivery. 3:30–4:30 admin buffer.\n**Tue:** QC-heavy morning + one 90-minute deep block mid-day.\n**Wed:** Like Mon with a shorter QC window if energy dips.\n**Thu:** QC + one partnership / follow-up block.\n**Fri:** Lighter QC, weekly review, 60 minutes for Becoming / inner work that supports next week's Vital Action.",
  },
  {
    role: "user",
    content: "friday becoming is always the one i skip lol",
  },
  {
    role: "assistant",
    content:
      "Then we name it and protect it anyway—same rule as the family edge.\n\n**What to say no to:** anything that steals the first morning block or pushes QC to \"later tonight.\" If something has to slip, we delete a *meeting*—not the Vital Action block, not dinner, not the 8 p.m. Slack boundary.\n\nSend your fixed commitments (pickups, standing calls) and I'll drop them in and re-balance.",
  },
];

/** First assistant message in the animated Coach thread demo (Inner Work full demo). */
export const COACH_DEMO_INNER_THREAD_OPENER =
  "Type it messy if you need to—I already have your blueprint, Real Reasons, and Vital Action in context. I'll connect the dots; you don't have to spell the framework.";

/** lib/vapi/scoring.ts — ARCHETYPE_DESCRIPTIONS["The Ghost"] */
export const GHOST_ARCHETYPE_DESCRIPTION =
  "Business is strong but relationships are fading. You're building something impressive — but the people who matter are watching you disappear. Reconnect before the distance becomes permanent.";

/** lib/vapi/archetypes-full.ts — The Ghost */
export const GHOST_ARCHETYPE = {
  tagline: "Building an empire. Disappearing from your own life.",
  description:
    "The Ghost has strong business metrics. You might even have your personal health and habits together. But the people in your life are experiencing your absence. Your family gets whatever's left after work takes its share. Your friendships are thin or transactional. You've optimized for achievement and accidentally optimized away the connections that make achievement meaningful.",
} as const;

/** app/(dashboard)/assessment/results/page.tsx — DriverSection disclaimer (verbatim) */
export const ASSESSMENT_DRIVER_SECTION_NOTE =
  "This driver is identified based on patterns in your scores and priorities. It represents the most likely internal pattern producing your results. It is a hypothesis, not a diagnosis. If it resonates, it's a powerful starting point. If it doesn't fully fit, your detailed scores and intake reflection will surface a more precise picture.";

/** lib/vapi/drivers.ts — The Escape Artist */
export const ESCAPE_ARTIST_DRIVER = {
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
  /** lib/vapi/drivers.ts — DRIVER_CONTENT["The Escape Artist"].maxPossible */
  maxPossible: 12,
} as const;

/** lib/vapi/driver-library.ts — DRIVER_LIBRARY_CONTENT["The Escape Artist"] */
export const ESCAPE_ARTIST_LIBRARY = {
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
} as const;

/** lib/vapi/driver-icons.tsx — DRIVER_ACCENT_COLORS */
export const ESCAPE_ARTIST_ACCENT = "#2E8B7A";
/** lib/vapi/archetype-icons.tsx — ARCHETYPE_ACCENT_COLORS */
export const GHOST_ARCHETYPE_ACCENT = "#8A9BAE";

/** lib/vapi/driver-library.ts */
export const DRIVER_LIBRARY_TITLE = "The 10 Driver Patterns + Aligned Momentum";
export const DRIVER_LIBRARY_SUBTITLE =
  "Underneath every score pattern is an internal operating system. For most founders, that system includes a belief, a fear, and a coping strategy that silently works against their goals. These are the 10 most common dysfunction drivers. But when no dysfunction driver is present and your scores reflect broad, genuine strength, something different appears: Aligned Momentum. That's the state every driver pattern is building toward.";

/** lib/vapi/driver-library.ts — DRIVER_ORDER (first 3 shown as non-interactive preview rows in demo) */
export const DRIVER_ORDER_PREVIEW = [
  "The Achiever's Trap",
  "The Protector",
  "The Pleaser's Bind",
] as const;

/**
 * Mirrors aligned-ai-os `lib/vapi/scoring.ts` — `getTier` + `getTierColor` (1–10 VAPI scale).
 * Used in the mock phone so score colors match production.
 */
export type DemoVapiTier = "Dialed" | "Functional" | "Below the Line" | "In the Red";

export function demoVapiGetTier(score: number): DemoVapiTier {
  if (score >= 8) return "Dialed";
  if (score >= 6) return "Functional";
  if (score >= 4) return "Below the Line";
  return "In the Red";
}

export function demoVapiTierColor(score: number): string {
  switch (demoVapiGetTier(score)) {
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

/**
 * Mean of the 12 domain scores in `DEMO_RESULTS_DOMAIN_SAMPLES` (rounded to one decimal like production).
 * Keeps dashboard + results composite VAPI consistent with the domain table and arena averages.
 */
export const DEMO_COMPOSITE_VAPI_SCORE = 6.0;

/** One fictional user: same Focus Here First rows on dashboard and results. */
export const DEMO_FOCUS_HERE_FIRST_DOMAINS = [
  { code: "PH", name: "Physical Health", score: 3.5 },
  { code: "CO", name: "Community", score: 4.2 },
  { code: "EC", name: "Ecology", score: 4.5 },
] as const;

/**
 * Full domain set for the results demo. Averages: Personal 6.2, Relationships 4.1, Business 7.8; overall 6.0.
 * Labels match `IMPORTANCE_DOMAINS` in quiz-data where applicable.
 */
export const DEMO_RESULTS_DOMAIN_SAMPLES = [
  { code: "PH", name: "Physical Health", score: 3.5 },
  { code: "ME", name: "Mental / Emotional Health", score: 5.0 },
  { code: "IA", name: "Inner Alignment", score: 8.2 },
  { code: "AF", name: "Attention & Focus", score: 8.1 },
  { code: "RS", name: "Relationship to Self", score: 3.8 },
  { code: "FA", name: "Family", score: 4.0 },
  { code: "CO", name: "Community", score: 4.2 },
  { code: "WI", name: "World / Impact", score: 4.4 },
  { code: "VS", name: "Vision / Strategy", score: 8.9 },
  { code: "EX", name: "Execution", score: 8.9 },
  { code: "OH", name: "Operational Health", score: 8.9 },
  { code: "EC", name: "Ecology", score: 4.5 },
] as const;

/**
 * Illustrative coach reply for the exact "Create weekly schedule" prompt.
 * Grounded in COACHING_SYSTEM_PROMPT rules (Vital Action, QC, capacity, boundaries).
 * Not API output; demo only.
 */
export const SAMPLE_SCHEDULE_REPLY = `Here is a week shaped around what is already in your context, not generic hustle.

**Anchor 1: Vital Action**  
You said your Vital Action is to set and defend focus work blocks. That means the calendar gets built *around* those blocks first, not squeezed in after meetings.

**Anchor 2: QC quota**  
Your revenue bridge implies **12 qualified conversations** this week. I would place **three** on Tuesday, **three** on Thursday, and **two** each on Monday, Wednesday, and Friday morning, before noon, so afternoons stay available for delivery and deep work.

**Anchor 3: Boundaries**  
Your blueprint lists **dinner with family by 6:30** as non-negotiable and **no Slack after 8 p.m.** I am treating those as hard edges, not nice-to-haves.

**Sample skeleton (adjust to your real time zone)**  
- **Mon:** 8:00–10:30 deep work (Vital Action block). 10:30–12:00 QC block. Lunch. 1:00–3:00 delivery. 3:30–4:30 admin buffer.  
- **Tue:** QC-focused morning. One 90-minute deep-work block mid-day for the thing only you can do.  
- **Wed:** Same pattern as Monday with a shorter QC window if your energy dips mid-week.  
- **Thu:** QC + one partnership or follow-up block.  
- **Fri:** Lighter QC, weekly review, and protect a 60-minute "Becoming" block (reading, reflection, or the inner work that supports next week's Vital Action).

**What to say no to**  
Anything that steals the first morning block or pushes QC to "later tonight" is a red flag. If something has to slip, we delete a *meeting*, not the Vital Action block, and not the family edge.

If you tell me your actual fixed commitments (school pickup, standing calls), I will drop them in and re-balance the same structure.`;
