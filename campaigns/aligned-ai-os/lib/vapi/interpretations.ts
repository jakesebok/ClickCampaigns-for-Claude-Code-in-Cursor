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
