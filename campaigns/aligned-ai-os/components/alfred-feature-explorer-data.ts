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
  "Inner Work + Beliefs",
  "State + Confidence",
  "Execution + Mindset",
  "Weekly Review",
  "VAPI + Alignment",
  "Deep Patterns",
] as const;

/** Weekly Planning prompts — label + exact prompt string sent to /api/chat */
export const WEEKLY_PLANNING_PROMPTS: { label: string; prompt: string }[] = [
  {
    label: "Create weekly schedule",
    prompt:
      "Build my week around my Becoming and Vital Action. Give me a realistic calendar plan that protects my QC quota and respects my capacity.",
  },
  {
    label: "Top 3 outcomes this week",
    prompt:
      "What are the 3 highest-leverage outcomes for this week given my Vital Action and revenue goals?",
  },
  {
    label: "What to delete or defer",
    prompt: "What must be deleted or deferred this week so I don't break my system? Use my master context.",
  },
  {
    label: "Minimum Viable Week plan",
    prompt:
      "Create a 'Minimum Viable Week' plan for when chaos happens — anchored to my Vital Action and non-negotiables.",
  },
];

/** Demo: highlighted sub-prompt in Weekly Planning list (matches tour + full sample reply). */
export const WEEKLY_PLANNING_DEMO_LABEL = "Create weekly schedule" as const;

/**
 * Inner Work + Beliefs — Fire Starters submenu.
 * Verbatim from `lib/ai/prompts.ts` → SUGGESTED_QUESTIONS (category "Inner Work + Beliefs").
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
 * Illustrative thread for INNER_WORK_DEMO_LABEL — same user message as production; sample Alfred turns only.
 */
export const SAMPLE_INNER_WORK_LIMITING_BELIEF_REPLY = `**Alfred**  
You asked to tie this to your **Real Reasons** and shift the belief—not just vent. I’m working from your blueprint and Vital Action, not a generic script.

**Alfred**  
When you picture actually honoring your Real Reasons this week, what’s the *first* “yeah, but…” your mind offers? Say it in one blunt sentence.

**You**  
Yeah, but if I’m not always on, the business stalls—and then I’m failing everyone.

**Alfred**  
That’s a belief wearing a strategy costume: *constant availability = safety + love.* Let’s separate facts from the story. Does one more hour of Slack *actually* protect revenue—or does it mostly quiet the fear that you’re only allowed to rest after you’ve earned it?

**You**  
…Mostly the fear.

**Alfred**  
**Kinder truth that still fits your Real Reasons:** *Boundaries don’t erase ambition—they protect the person who has to execute.*  

**Evidence check:** Name one recent day when you protected a block for your Vital Action or family—and something important still shipped. That memory is your counterexample to “always on or it all falls apart.”

**One install before you open email:** Say out loud: *“Rest doesn’t erase my standards—it protects who I’m becoming.”* Then put your Vital Action block on the calendar like a client meeting. If guilt shows up, don’t debate it—name it: “That’s the old belief,” and sit with it for sixty seconds without fixing anything.

Reply with where that belief spikes loudest (mornings, after the kids are down, quiet pipeline)—I’ll anchor the next move to your real week.`;

/** First assistant message in the animated Coach thread demo (Weekly Planning full demo). */
export const COACH_DEMO_WEEKLY_THREAD_OPENER =
  "I've pulled in your Becoming line, Vital Action, QC quota, and the boundaries from your blueprint. When you're ready, type what you want to work on for the week—the same way you'd use a Fire Starter in the live app.";

/** First assistant message in the animated Coach thread demo (Inner Work full demo). */
export const COACH_DEMO_INNER_THREAD_OPENER =
  "I'm here with your Real Reasons and blueprint context. When you're ready, send the belief work in your own words—or paste the exact Fire Starter prompt you chose.";

/** lib/vapi/scoring.ts — ARCHETYPE_DESCRIPTIONS["The Ghost"] */
export const GHOST_ARCHETYPE_DESCRIPTION =
  "Business is strong but relationships are fading. You're building something impressive — but the people who matter are watching you disappear. Reconnect before the distance becomes permanent.";

/** lib/vapi/archetypes-full.ts — The Ghost */
export const GHOST_ARCHETYPE = {
  tagline: "Building an empire. Disappearing from your own life.",
  description:
    "The Ghost has strong business metrics. You might even have your personal health and habits together. But the people in your life are experiencing your absence. Your family gets whatever's left after work takes its share. Your friendships are thin or transactional. You've optimized for achievement and accidentally optimized away the connections that make achievement meaningful.",
} as const;

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
