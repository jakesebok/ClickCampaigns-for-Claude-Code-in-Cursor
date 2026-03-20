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
  "The Rising Architect": {
    tagline: "Almost there. One arena is holding the rest back.",
    description:
      "The integration is close. Most of your life and business is operating at a high level and multiple domains are Dialed. But one arena hasn't caught up yet, and that gap is preventing the full reinforcing cycle that defines The Architect. You're not stagnating. You're not in crisis. You're not drifting. You're building toward something genuinely rare, and you're closer than most founders ever get. The work now is precise: identify the specific arena lagging behind and give it the focused attention it needs to close the gap. You don't need a transformation. You need a targeted push.",
    strength:
      "Broad high performance. You've built genuine capability across nearly every dimension of your life and business. Most founders sacrifice one arena entirely to prop up another. You haven't. The foundation for full integration already exists. That foundation is your greatest asset.",
    shadow:
      "Neglecting the lagging arena because everything else feels good enough. When 11 out of 12 domains are strong, the temptation is to coast on the overall picture and ignore the one or two areas pulling the average down. That gap is small enough to ignore, which is exactly what makes it persistent. The last 10% of integration delivers disproportionate returns because it's what turns a strong life into a reinforcing one.",
    constraint:
      "A single under-invested arena. Your challenge isn't systemic. It's specific. One area of your life or business hasn't received the same attention and discipline you've given everything else. Identifying that area and treating it with the same seriousness you brought to your strengths is the entire game.",
    growthPath:
      "The Rising Architect's path is targeted, not transformational. Identify the weakest arena. Find the 1-2 domains within it dragging the average down. Give those domains the same focused intensity you brought to the areas that are already Dialed. You're one sustained push away from The Architect. Don't let the comfort of 'almost there' prevent you from finishing the build.",
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
