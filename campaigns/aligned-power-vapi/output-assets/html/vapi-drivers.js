(function () {
  var DRIVER_THRESHOLD = 6;
  var DRIVER_MIN_MARGIN = 2;
  var DRIVER_SECONDARY_THRESHOLD = 4;
  var ALIGNED_MOMENTUM_NAME = "Aligned Momentum";
  var DRIVER_TIEBREAK_PRIORITY = [
    "The Achiever's Trap",
    "The Escape Artist",
    "The Pleaser's Bind",
    "The Imposter Loop",
    "The Perfectionist's Prison",
    "The Protector",
    "The Martyr Complex",
    "The Fog",
    "The Scattered Mind",
    "The Builder's Gap",
  ];
  var DRIVER_CONTENT = {
    "The Achiever's Trap": {
      name: "The Achiever's Trap",
      coreBelief: "I am what I produce.",
      coreFear: "Without output, I'm worthless.",
      tagline:
        "Your identity is fused with your productivity. You can't stop performing because stopping feels like disappearing.",
      description:
        "Somewhere along the way, you learned that your value comes from what you produce. Maybe it was a parent who only noticed you when you succeeded. Maybe it was a culture that rewarded grinding and punished rest. Whatever the origin, the belief took root: you are only as valuable as your last result. This drives extraordinary output but it also drives the pattern your VAPI scores reveal. Your business executes because you've made execution the condition for self-worth. Your health, emotional stability, and inner alignment suffer because they don't produce visible results, so they get deprioritized. Rest doesn't feel restful. It feels dangerous. And no achievement ever fully satisfies because the belief underneath it is insatiable.",
      mechanism:
        "This driver produces high Execution scores paired with low Physical Health, low Mental/Emotional Health, and low Inner Alignment. Your Business domains are prioritized because they're where you feel valuable. Your Self domains are neglected because they don't produce measurable output. The importance ratings confirm it: you've rated Business domains higher than Self domains because that's where your identity lives.",
      whatItCosts:
        "Your body is paying the bill for your productivity. Your emotional health is eroding underneath the performance. Your inner life has been deferred to 'someday' for so long that you may not even know what you want outside of achievement. And the cruelest part: the more you achieve, the more you need to achieve, because the hole this pattern is trying to fill can't be filled by output.",
      theWayOut:
        "The exit isn't stopping. It's decoupling your identity from your output. You need to experience being valuable while producing nothing. That sounds simple and it will be the hardest thing you do in this program. We'll identify the belief underneath the pattern, trace it to its origin, and give the part of you that's been running this program a new role. The goal isn't to kill your drive. It's to make it optional instead of compulsive.",
      programPhase:
        "Phase 3: Internal Alignment. The parts work here is central. The 'productive = worthy' belief needs to be identified, honored for what it was protecting, and reassigned.",
      maxPossible: 12,
    },
    "The Protector": {
      name: "The Protector",
      coreBelief: "If I let go of control, everything falls apart.",
      coreFear: "Vulnerability, chaos, being dependent on others.",
      tagline:
        "You've built walls so effective that nothing gets in. Including the people who could actually help.",
      description:
        "You learned early that depending on others was dangerous. Maybe people let you down. Maybe chaos was your childhood normal and control became your survival strategy. Whatever the origin, you built an operating system around self-reliance, structure, and control. Your business reflects this: your systems are strong, your execution is disciplined, and your operations are tight. But your relationships reflect the cost: you don't let people in. Your self-trust is low because you trust your systems more than yourself. Your community is thin because vulnerability feels like weakness. You've built a fortress. It's effective. And it's isolating.",
      mechanism:
        "This driver produces high Operational Health and Execution paired with low Relationship to Self and low Community. You've invested in the controllable, measurable parts of life (systems, processes, output) and underinvested in the uncontrollable, vulnerable parts (trust, connection, being known). Your importance ratings often reflect low priority on relational domains because you've convinced yourself you don't need them.",
      whatItCosts:
        "You're efficient but alone. The control that protects you also imprisons you. You can't delegate fully because trusting others feels reckless. You can't form deep friendships because being seen feels exposed. You can't trust your own instincts because you've outsourced judgment to your systems. The fortress works until it doesn't, and when it breaks, there's nobody inside it with you.",
      theWayOut:
        "The exit isn't dismantling your systems. They're valuable. It's building the capacity to function without them. We'll identify what vulnerability actually threatens in your nervous system, trace the origin of the control pattern, and create small, structured experiments in letting go. The goal isn't to make you less organized. It's to make you less dependent on organization for your sense of safety.",
      programPhase:
        "Phase 3: Internal Alignment. The core work is redefining safety as something that can include other people, not just structures.",
      maxPossible: 13,
    },
    "The Pleaser's Bind": {
      name: "The Pleaser's Bind",
      coreBelief: "My worth comes from being needed.",
      coreFear: "Rejection, abandonment, not being enough on my own.",
      tagline:
        "You pour into everyone else and wonder why there's nothing left for your own goals.",
      description:
        "You've built a life around making others comfortable. You're generous and widely liked. But underneath that generosity is a transaction: you give so you'll be needed, because being needed feels safe. Your self-trust is low because you constantly override your own needs. Your execution suffers because you can't say no to others long enough to say yes to your own work. Your strategy is unclear because other people's priorities crowd out your own.",
      mechanism:
        "Low Relationship to Self paired with relatively high Family or Community. Reverse-scored RS6 confirms the pattern: you agreed you frequently people-please or abandon your needs. Your RS importance rating is often high because you KNOW self-trust matters but can't hold it when someone else needs something.",
      whatItCosts:
        "Your boundaries are negotiable, so your time and priorities are always up for grabs. Your business underperforms because your best hours go to other people's needs. The resentment building underneath the generosity is quiet but real. The approval you're chasing would survive you saying no far more often than you think.",
      theWayOut:
        "The exit isn't becoming selfish. It's learning that your needs are not negotiable. We'll trace the 'needed = loved' belief to its origin, identify where the pleasing pattern is strongest, and build a practice of holding boundaries even when guilt shows up. The goal is to include yourself in the list of people you care about.",
      programPhase:
        "Phase 3: Internal Alignment into Phase 4: Aligned Action. Belief work first, then boundaries and decision rules installed into the PAOS.",
      maxPossible: 12,
    },
    "The Escape Artist": {
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
      maxPossible: 12,
    },
    "The Perfectionist's Prison": {
      name: "The Perfectionist's Prison",
      coreBelief: "If it's not perfect, it's not safe to release.",
      coreFear: "Judgment, exposure, being revealed as inadequate.",
      tagline: "You know exactly what to do. You just can't seem to do it.",
      description:
        "You have everything except the ability to act. Self-awareness is solid. Strategy might be clear. Emotional health is decent. But when it's time to execute, something locks up. Projects stay at 90%. Launches get pushed. Emails sit in drafts. It's not laziness. It's protection: if you never ship, you can never be judged. If you never fully commit, you can never fully fail. The VAPI confirms it: Execution is low while other Self domains are strong, and your Execution importance is high because you desperately want to act but the internal brake is stronger than the accelerator.",
      mechanism:
        "Low Execution paired with adequate or strong Mental/Emotional Health, Inner Alignment, and Attention/Focus. The key signal is high Execution importance: the gap isn't motivation or awareness. It's an internal block. Vision/Strategy may also be strong, confirming you have the plan but can't pull the trigger.",
      whatItCosts:
        "Your potential is stranded. You have the insight, plan, capability, and desire, all locked behind perfectionism disguised as high standards. Opportunities pass. Competitors ship. Your business stalls. The internal frustration of knowing what to do while watching yourself not do it creates a shame cycle that makes the next attempt harder.",
      theWayOut:
        "The exit is shipping imperfectly on purpose. We'll identify the fear underneath the perfectionism (usually a childhood experience of harsh judgment), reduce the threat response your nervous system attaches to imperfect output, and build a practice of releasing at 80%. The goal isn't lowering your standards. It's separating your safety from your output quality.",
      programPhase:
        "Phase 3: Internal Alignment into Phase 4: Aligned Action. Root belief work first, then structured execution rhythms that make shipping a system rather than a decision.",
      maxPossible: 12,
    },
    "The Imposter Loop": {
      name: "The Imposter Loop",
      coreBelief: "If they really knew me, they'd know I'm not enough.",
      coreFear: "Being exposed, visibility, success itself.",
      tagline: "You're building something you secretly believe you don't deserve.",
      description:
        "Part of you suspects that your success is borrowed time. That the business works despite you, not because of you. That if people saw the real picture, the doubt, the chaos, the gaps, they'd lose confidence. So you keep the mask tight. But there's another layer: you may also feel that the business itself isn't a true expression of who you are. It's functional but it doesn't feel like yours. The model works but it doesn't match your depth, your values, or the unique way you see the world. So you're caught between two forces: the fear that you're not enough for what you're building, and the suspicion that what you're building isn't enough for who you are. Your Ecology score is low because at some level you know the model isn't right. Your Relationship to Self is strained because you can't trust your own judgment when part of you is always questioning whether you belong in the room you built.",
      mechanism:
        "Low Ecology paired with low Relationship to Self. EC6 reverse-scored confirms: you agreed you suspect you're building something that looks impressive but would trap you if it scaled. RS is low because imposter patterns erode self-trust. The broadened signal also checks for high Inner Alignment importance paired with low Ecology, which captures the variant where someone deeply values authenticity but feels their business doesn't reflect it. This 'inauthenticity' variant is as damaging as the classic 'not enough' variant because both create internal resistance to growth.",
      whatItCosts:
        "You're building on a foundation of self-doubt. Every win feels temporary. Every compliment feels unearned. You can't fully invest in scaling because part of you doesn't believe you deserve what's on the other side. The self-sabotage isn't random. It's your system protecting you from the exposure that success would bring.",
      theWayOut:
        "The exit is separating your worth from your performance and building a business you'd be proud to be seen inside of. We'll trace the imposter belief to its origin, dismantle the false narrative that you're not enough, and redesign the parts of your business that don't actually fit you so the model becomes something you trust. When the destination feels safe, the sabotage stops.",
      programPhase:
        "Phase 2: Strategic Clarity into Phase 3: Internal Alignment. Redesign what you're building first so it's genuinely yours, then address the belief that you don't deserve it.",
      maxPossible: 14,
    },
    "The Martyr Complex": {
      name: "The Martyr Complex",
      coreBelief: "I have to suffer for this to count.",
      coreFear: "Ease, receiving, being perceived as selfish.",
      tagline: "You sacrifice yourself for others and call it purpose.",
      description:
        "You give endlessly to family and causes while your own body and inner life deteriorate. Your World/Impact scores are strong. Your Family presence is genuine. But your Physical Health and Inner Alignment are suffering because somewhere you learned that your needs come last. That selflessness is the price of being good. That ease is suspicious and suffering is noble. The pattern is invisible to you because everyone around you reinforces it. They praise your generosity while you quietly fall apart.",
      mechanism:
        "Low Physical Health and low Inner Alignment paired with high World/Impact and high Family. Importance ratings confirm: you've rated contribution and family as top priorities while rating your own health and alignment as low. PH6 reverse-scored confirms: you agreed you sacrifice your body to meet demands.",
      whatItCosts:
        "You're running on a depleting resource. The generosity that defines you is being funded by your health, your joy, and your sense of self. The people you serve would be horrified to know the real cost. Your body will eventually present the bill. And the resentment you're not allowing yourself to feel is building underneath the noble surface.",
      theWayOut:
        "The exit is redefining service to include yourself. We'll identify the belief that your needs are less important than everyone else's, trace it to its origin, and build a new operating definition of generosity that doesn't require self-destruction. The goal isn't to stop giving. It's to stop bleeding.",
      programPhase:
        "Phase 3: Internal Alignment. The core belief that 'ease = selfishness' needs to be directly confronted and reassigned.",
      maxPossible: 12,
    },
    "The Fog": {
      name: "The Fog",
      coreBelief: "I don't know what I want, so I can't commit to anything.",
      coreFear: "Commitment, being wrong, missing out.",
      tagline:
        "You're not lost because you lack intelligence. You're lost because choosing feels dangerous.",
      description:
        "You're smart, capable, and stuck. Your Vision/Strategy is low because you genuinely can't seem to lock in a direction. Your Inner Alignment is low because you've disconnected from what you actually want. Your importance ratings are flat because nothing feels clearly more important than anything else. The fog feels like confusion but it's actually protection. If you never choose, you can never choose wrong. If you stay in exploration mode, you never have to face the vulnerability of commitment.",
      mechanism:
        "Low Vision/Strategy and low Inner Alignment. The key diagnostic signal is flat importance ratings: no domain rated 8 or above, and the standard deviation across all 12 ratings is below 2.0. Everything feels equally (un)important, which is the emotional signature of someone avoiding commitment. VS6 reverse-scored confirms: you agreed you spend time chasing new ideas and reacting to urgency rather than following a plan.",
      whatItCosts:
        "Years. The fog is comfortable but it's expensive. Every month without a clear direction is a month of scattered effort, wasted resources, and mounting frustration. Your capability isn't the problem. Your willingness to commit is. The longer you stay in the fog, the more your confidence erodes because you accumulate evidence that you can't follow through, when the truth is you never fully decided.",
      theWayOut:
        "The exit is deciding. Not finding the perfect answer. Deciding. We'll identify what commitment actually threatens in your system (usually a fear of being wrong, being trapped, or missing a better option), reduce the emotional charge around choosing, and build a 90-day commitment practice where you pick a direction and stay with it long enough to learn from it. Clarity comes from action, not from more thinking.",
      programPhase:
        "Phase 2: Strategic Clarity. The Fog needs the most intensive Phase 2. Building the North Star Stack, Revenue Bridge, and Domino Plan gives them a direction that's connected to their values and life rather than abstract business goals.",
      maxPossible: 13,
    },
    "The Scattered Mind": {
      name: "The Scattered Mind",
      coreBelief: "I'll be able to focus when the conditions are right.",
      coreFear:
        "That the conditions will never be right. That this is just how your mind works. That the gap between what you know you're capable of and what you actually produce will never close.",
      tagline:
        "You know exactly what matters. Your attention just won't stay there.",
      description:
        "Your mind moves. It always has. When you sit down to do something that matters, your attention holds for a few minutes and then splinters. You find yourself somewhere else, another tab, another thought, another task, without remembering the decision to leave. It's not that you don't care. You care deeply. It's not that you're avoiding something painful. Your emotional life is stable. It's that sustained attention doesn't come naturally, and the world is full of things that pull you away. So you adapt. You work in bursts. You rely on deadlines and pressure to create focus. You start things with clarity and watch them fragment before completion. You build workarounds instead of systems because systems require the sustained effort your mind resists. And underneath it all, there's a quiet exhaustion from fighting your own attention every single day.",
      mechanism:
        "Attention & Focus is compromised while Mental/Emotional Health is functional or high, which is the key differentiator from The Escape Artist. Your scores show fragmentation without emotional avoidance: low AF paired with weak Execution and Operational Health, plus high Inner Alignment or high AF importance. You know what matters. You care about it. Your attention just won't stay with it long enough to build momentum.",
      whatItCosts:
        "The things that matter most to you require sustained effort to build. Relationships deepen through presence. Businesses grow through consistent execution. Skills develop through deliberate practice. But sustained effort is exactly what your scattered attention makes difficult. So you stay in motion without accumulating momentum. You have insights that never become implementations. You have starts that never become finishes. The people around you see someone capable and aligned who somehow doesn't produce at the level they expect. And you see the same thing, which is the hardest part, knowing that the gap isn't about clarity or motivation or values. It's about a mind that won't stay where you point it.",
      theWayOut:
        "The Scattered Mind isn't addressed through more insight about yourself. You already understand the pattern. It's addressed through structure that works with your mind instead of against it. That means environment design: removing the things that pull your attention, creating physical spaces that support focus, building friction between you and distraction. It means rhythm design: working in shorter blocks with built-in breaks, using body-doubling or accountability to create external structure, protecting your highest-attention hours for your most important work. It means system design: externalizing your memory and commitments so your mind doesn't have to hold everything, simplifying your task landscape so there are fewer places for attention to scatter. And for some people, it means exploring whether ADHD is part of the picture, not as a label but as a door to strategies and support designed specifically for minds that work this way. The goal isn't to become someone with effortless focus. The goal is to build a life where your particular mind can do its best work.",
      programPhase:
        "Phase 1 (Physical + Environmental Foundation) and Phase 2 (Strategic Clarity + Structure). The Scattered Mind is addressed through external scaffolding: environment design, rhythm and routine, systems that reduce cognitive load. Phase 3 work may surface secondary patterns once attention is stabilized, but the primary intervention is structural.",
      maxPossible: 10,
    },
    "The Builder's Gap": {
      name: "The Builder's Gap",
      coreBelief:
        "Caring about people and doing good work should be enough. I shouldn't have to become a 'business person' to make this work.",
      coreFear:
        "That building real business infrastructure will force me to become someone cold, transactional, or inauthentic.",
      tagline:
        "You have everything except the machine. The foundation is strong but the business hasn't been built to match it.",
      description:
        "You're not broken. You're not in crisis. You're not avoiding something painful or running from something scary. You're genuinely strong in the areas that most founders neglect: your health, your emotional regulation, your relationships, your sense of self. The people in your life feel your presence. Your values are clear. Your business model even makes sense on paper. But the business itself isn't built. Your strategy shifts more than it should. Your execution is inconsistent. Your operations are fragile or nonexistent. You know what you want to build and why it matters. You just haven't built the infrastructure to make it real. The gap isn't internal. It's structural. But here's the part that makes this a driver and not just a skills gap: there's a reason you haven't built it, and that reason is usually a quiet belief that building a real business machine means becoming someone you don't want to be.",
      mechanism:
        "This driver produces a distinctive signature: strong Self and Relationships arena scores paired with a Business arena that's clearly the weakest. Multiple Business domains sit below 5.5 while personal and relational domains are Functional or Dialed. The telling signal is often a healthy Ecology score (6.0+), which means the business model itself is aligned with who you are. The problem isn't what you're building. It's that you haven't built the systems, strategy, and execution rhythms to bring it to life. Importance ratings typically confirm the pattern: you rate Business domains as high priority because you know they need work, but the work keeps not getting done.",
      whatItCosts:
        "Your gifts are stranded. The relationships you've built, the trust people have in you, the aligned model you've designed, none of it reaches its potential because the business infrastructure doesn't exist to deliver it at scale. You're probably underearning relative to your capability. You may be over-delivering to a small number of people because you don't have the systems to serve more. The people who need what you offer can't find you, buy from you, or experience your full value because the machine between your gift and your market hasn't been built. Every month this continues, the gap between your potential impact and your actual impact widens.",
      theWayOut:
        "The exit is accepting that building business infrastructure is not a betrayal of who you are. It's the vehicle that lets who you are reach the people who need it. Systems aren't cold. They're how you scale your warmth. Strategy isn't corporate. It's how you focus your energy. Operations aren't soulless. They're how you stop being the bottleneck so your actual gift can breathe. We'll identify the specific belief that's kept you from building the machine, reframe business-building as an act of service rather than a compromise of values, and then install the strategy, execution rhythm, and operational basics that translate your strengths into a functioning business.",
      programPhase:
        "Phase 2: Strategic Clarity into Phase 4: Aligned Action. The Builder's Gap needs strategic clarity first (what exactly am I building and in what order) and then an operating system to execute it. Phase 3 may be lighter than other drivers unless the belief that 'business = inauthentic' runs deep.",
      maxPossible: 14,
    },
  };
  var ALIGNED_MOMENTUM_CONTENT = {
    name: ALIGNED_MOMENTUM_NAME,
    tagline:
      "Your internal operating system is working with your goals, not against them.",
    colorAccent: "#B8960C",
    coreState:
      "Your beliefs support your ambition. Your habits serve your vision. Your nervous system trusts the direction you're heading.",
    description:
      "Most founders who take this assessment discover an internal pattern working against them: a belief, a fear, or a coping strategy that silently sabotages their results across multiple domains. You don't have one. That's not a neutral finding. It's a significant one. Your internal operating system is aligned with what you're building. Your beliefs support your ambition rather than undermining it. Your habits serve your vision rather than contradicting it. Your nervous system trusts the direction you're heading rather than pumping the brakes. This alignment is what allows you to perform at a high level across multiple arenas simultaneously without the burnout, self-sabotage, or internal warfare that most founders experience. It's not the absence of a problem. It's the presence of something most people spend years trying to build.",
    howThisShowsUp:
      "Your scores are strong across the board with no more than one isolated gap. Your importance ratings and your actual performance are congruent, meaning you're investing where you say it matters. Your reverse-scored items don't reveal hidden contradictions between what you believe and how you behave. The typical signatures of dysfunction drivers, identity fused with output, chronic avoidance, people-pleasing, perfectionist paralysis, ecological misalignment, are absent or minimal. Your system is clean.",
    whatThisMakesPossible:
      "When your internal operating system isn't fighting your goals, everything compounds in the right direction. Your health supports your focus. Your focus supports your execution. Your execution supports your business. Your business supports your relationships. Your relationships support your resilience. And your resilience supports your health. This is the reinforcing cycle that most founders never experience because a dysfunction driver somewhere in the chain breaks the loop. Your loop is intact. That's your greatest strategic advantage and it's invisible to everyone competing with you who's still fighting themselves.",
    howToProtectIt:
      "Aligned Momentum is not permanent. It's maintained. The practices, boundaries, relationships, and self-awareness that produced this state require ongoing investment. The most common threats are complacency, assuming the work is done, lifestyle creep, gradually adding demands that erode your margins, and unprocessed change, a life transition that shifts your internal landscape without you noticing. Protect this state by continuing to audit honestly, retaking this assessment regularly, and treating your alignment as an asset that requires maintenance rather than an achievement you can file away.",
  };
  var DRIVER_STANDARD_FALLBACK = {
    heading: "No Clear Driver Identified",
    text: "Your score pattern doesn't map strongly to a single internal driver. This can mean one of several things: your pattern is genuinely complex and influenced by multiple drivers rather than one dominant one, you're in a transitional period where old patterns are shifting, or the behavioral data from the assessment needs to be supplemented with deeper reflection. This is not a problem. It simply means the quantitative data alone can't pinpoint the root cause with enough confidence. Your detailed domain scores, archetype, and priority matrix still provide a clear picture of where to focus. If you're working with a coach, your intake reflection and first session will surface what the numbers alone couldn't. You can also explore all 10 driver patterns in the Driver Library to see if one resonates through self-reflection rather than algorithmic detection.",
  };
  var DRIVER_FALLBACK = DRIVER_STANDARD_FALLBACK;
  var DRIVER_NOTE =
    "This driver is identified based on patterns in your scores and priorities. It represents the most likely internal pattern producing your results. It is a hypothesis, not a diagnosis. If it resonates, it's a powerful starting point. If it doesn't fully fit, your detailed scores and intake reflection will surface a more precise picture.";
  var DRIVER_CO_EQUAL_EXPLAINER =
    "Your assessment reveals two equally strong patterns operating simultaneously. These are likely reinforcing each other.";
  var ALL_DOMAIN_CODES = ["PH", "IA", "ME", "AF", "RS", "FA", "CO", "WI", "VS", "EX", "OH", "EC"];
  var SELF_DOMAIN_CODES = ["PH", "IA", "ME", "AF"];
  var RELATIONSHIPS_DOMAIN_CODES = ["RS", "FA", "CO", "WI"];
  var BUSINESS_DOMAIN_CODES = ["VS", "EX", "OH", "EC"];
  var DRIVER_SIGNAL_QUESTION_IDS = ["PH6", "CO6", "RS6", "FA6", "ME6", "EX6", "EC6", "VS6", "EC5"];
  var REVERSE_SIGNAL_QUESTION_IDS = ["PH6", "CO6", "RS6", "FA6", "ME6", "EX6", "EC6", "VS6"];
  var DRIVER_ACCENT_COLORS = {
    "Aligned Momentum": "#B8960C",
    "The Achiever's Trap": "#C07B28",
    "The Protector": "#4A6FA5",
    "The Pleaser's Bind": "#C27083",
    "The Escape Artist": "#2E8B7A",
    "The Perfectionist's Prison": "#6B7B8D",
    "The Imposter Loop": "#8B6BAE",
    "The Martyr Complex": "#A0522D",
    "The Fog": "#9B9586",
    "The Scattered Mind": "#2E86AB",
    "The Builder's Gap": "#B87333",
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function getNumericValue(value, fallback) {
    return typeof value === "number" && isFinite(value) ? value : fallback;
  }

  function countTrue(values) {
    return values.filter(Boolean).length;
  }

  function getImportanceValue(importanceRatings, code) {
    var value = importanceRatings[code];
    return typeof value === "number" && isFinite(value) ? value : null;
  }

  function hasCompleteImportanceRatings(importanceRatings, domainCodes) {
    return domainCodes.every(function (code) {
      return getImportanceValue(importanceRatings, code) !== null;
    });
  }

  function importanceAtLeast(importanceRatings, code, threshold) {
    var value = getImportanceValue(importanceRatings, code);
    return value !== null && value >= threshold;
  }

  function importanceAtMost(importanceRatings, code, threshold) {
    var value = getImportanceValue(importanceRatings, code);
    return value !== null && value <= threshold;
  }

  function getAverageImportance(importanceRatings, codes) {
    if (!hasCompleteImportanceRatings(importanceRatings, codes)) return 5;
    var values = codes.map(function (code) {
      return getImportanceValue(importanceRatings, code) ?? 5;
    });
    return values.reduce(function (sum, value) {
      return sum + value;
    }, 0) / values.length;
  }

  function getAverageScore(scores, codes) {
    var values = codes.map(function (code) {
      return getNumericValue(scores[code], 0);
    });
    return values.reduce(function (sum, value) {
      return sum + value;
    }, 0) / values.length;
  }

  function getImportanceStdDev(importanceRatings) {
    if (!hasCompleteImportanceRatings(importanceRatings, ALL_DOMAIN_CODES)) {
      return Number.POSITIVE_INFINITY;
    }
    var values = ALL_DOMAIN_CODES.map(function (code) {
      return getImportanceValue(importanceRatings, code) ?? 5;
    });
    var mean =
      values.reduce(function (sum, value) {
        return sum + value;
      }, 0) / values.length;
    var variance =
      values.reduce(function (sum, value) {
        return sum + Math.pow(value - mean, 2);
      }, 0) / values.length;
    return Math.sqrt(variance);
  }

  function noSingleImportanceAboveOrEqualEight(importanceRatings) {
    if (!hasCompleteImportanceRatings(importanceRatings, ALL_DOMAIN_CODES)) {
      return false;
    }
    return ALL_DOMAIN_CODES.every(function (code) {
      return (getImportanceValue(importanceRatings, code) ?? 0) < 8;
    });
  }

  function noSingleImportanceAboveOrEqualSeven(importanceRatings) {
    if (!hasCompleteImportanceRatings(importanceRatings, ALL_DOMAIN_CODES)) {
      return false;
    }
    return ALL_DOMAIN_CODES.every(function (code) {
      return (getImportanceValue(importanceRatings, code) ?? 0) < 7;
    });
  }

  function getResponseScore(allResponses, questionId, responseCodingVersion) {
    var stored = getNumericValue(allResponses[questionId], 4);
    if (responseCodingVersion === "scored_v1") return stored;
    return REVERSE_SIGNAL_QUESTION_IDS.indexOf(questionId) >= 0 ? 8 - stored : stored;
  }

  function normalizeStoredResponses(allResponses, responseCodingVersion) {
    var source = allResponses || {};
    var normalized = {};
    DRIVER_SIGNAL_QUESTION_IDS.forEach(function (questionId) {
      normalized[questionId] = getResponseScore(
        source,
        questionId,
        responseCodingVersion
      );
    });
    return normalized;
  }

  function createEmptyDriverScores() {
    return {
      "The Achiever's Trap": 0,
      "The Escape Artist": 0,
      "The Pleaser's Bind": 0,
      "The Imposter Loop": 0,
      "The Perfectionist's Prison": 0,
      "The Protector": 0,
      "The Martyr Complex": 0,
      "The Fog": 0,
      "The Scattered Mind": 0,
      "The Builder's Gap": 0,
    };
  }

  function createEmptyDriverGates() {
    return {
      "The Achiever's Trap": false,
      "The Escape Artist": false,
      "The Pleaser's Bind": false,
      "The Imposter Loop": false,
      "The Perfectionist's Prison": false,
      "The Protector": false,
      "The Martyr Complex": false,
      "The Fog": false,
      "The Scattered Mind": false,
      "The Builder's Gap": false,
    };
  }

  function getDriverFallbackType(domainScores, compositeScore, assignedDriver, driverState) {
    if (driverState === "dysfunction_driver") return "none";
    if (driverState === "aligned_momentum" || assignedDriver === ALIGNED_MOMENTUM_NAME) {
      return "aligned_momentum";
    }
    if (assignedDriver) return "none";

    var domainsBelowThreshold = ALL_DOMAIN_CODES.filter(function (code) {
      return getNumericValue(domainScores[code], 0) < 5.5;
    }).length;

    return compositeScore >= 7.0 && domainsBelowThreshold <= 1
      ? "aligned_momentum"
      : "standard";
  }

  function getDriverState(assignedDriver, driverFallbackType) {
    if (
      assignedDriver === ALIGNED_MOMENTUM_NAME ||
      driverFallbackType === "aligned_momentum" ||
      driverFallbackType === "high_performer"
    ) {
      return "aligned_momentum";
    }
    if (assignedDriver && DRIVER_CONTENT[assignedDriver]) {
      return "dysfunction_driver";
    }
    return "no_driver";
  }

  function getDriverFallbackContent(fallbackType) {
    return fallbackType === "standard"
      ? DRIVER_STANDARD_FALLBACK
      : {
          heading: ALIGNED_MOMENTUM_CONTENT.name,
          text: ALIGNED_MOMENTUM_CONTENT.description,
        };
  }

  function getDriverLibraryHref() {
    if (typeof window === "undefined" || !window.location) {
      return "/assessment/drivers";
    }
    return window.location.hostname.indexOf("portal.") >= 0
      ? "/portal/driver-library"
      : "/assessment/drivers";
  }

  function getDriverIconPaths(driverName) {
    switch (driverName) {
      case ALIGNED_MOMENTUM_NAME:
        return [
          '<circle cx="32" cy="32" r="8"/>',
          '<circle cx="32" cy="32" r="16"/>',
          '<circle cx="32" cy="32" r="24"/>',
          '<path d="M32 50V15"/>',
          '<path d="M26 21l6-7l6 7"/>',
        ];
      case "The Achiever's Trap":
        return [
          '<path d="M22 14h20v8c0 9.5-6.1 15.1-10 17.1c-3.9-2-10-7.6-10-17.1z"/>',
          '<path d="M22 18h-4c-3.3 0-6 2.7-6 6s2.7 6 6 6h4"/>',
          '<path d="M42 18h4c3.3 0 6 2.7 6 6s-2.7 6-6 6h-4"/>',
          '<path d="M32 31v9"/>',
          '<path d="M24 50h16"/>',
          '<path d="M28 44h8v6h-8z"/>',
          '<path d="M33 15l2 8l-4 5l5 7l-4 7"/>',
        ];
      case "The Protector":
        return [
          '<path d="M32 10c8.2 0 14.7 2.3 18 3.9v13.6c0 11.7-7 21.5-18 26.5c-11-5-18-14.8-18-26.5V13.9C17.3 12.3 23.8 10 32 10z"/>',
          '<circle cx="32" cy="27" r="4.5"/>',
          '<path d="M32 31.5v9"/>',
        ];
      case "The Pleaser's Bind":
        return [
          '<path d="M23 39c2.7 2 5.8 3 9 3"/>',
          '<path d="M41 39c-2.7 2-5.8 3-9 3"/>',
          '<path d="M20 24v16c0 2.8 2.2 5 5 5h2V31"/>',
          '<path d="M27 31V19"/>',
          '<path d="M31 30V17"/>',
          '<path d="M36 31V19"/>',
          '<path d="M40 31v14h2c2.8 0 5-2.2 5-5V24"/>',
          '<path d="M18 10l2 10"/>',
          '<path d="M25 9l1 10"/>',
          '<path d="M46 10l-2 10"/>',
          '<path d="M39 9l-1 10"/>',
        ];
      case "The Escape Artist":
        return [
          '<path d="M16 14h24v36H16z"/>',
          '<path d="M40 16l8 6v20l-8 6z"/>',
          '<circle cx="31" cy="25" r="3"/>',
          '<path d="M31 28l-3 7l7 5"/>',
          '<path d="M28 35l-6 4"/>',
          '<path d="M30 35l3 9"/>',
          '<path d="M35 33l6 4"/>',
        ];
      case "The Perfectionist's Prison":
        return [
          '<path d="M20 18h24"/>',
          '<path d="M22 18c0-5.5 4.5-10 10-10s10 4.5 10 10"/>',
          '<path d="M20 18v26"/>',
          '<path d="M28 18v26"/>',
          '<path d="M36 18v26"/>',
          '<path d="M44 18v26"/>',
          '<path d="M20 44h24"/>',
          '<path d="M44 27h8v12"/>',
          '<path d="M52 39l-8-4"/>',
          '<path d="M28 37c2-3 6-3 8 0c1.5 2.2 4 2.7 6 1"/>',
          '<path d="M31 33h4"/>',
        ];
      case "The Imposter Loop":
        return [
          '<path d="M18 14c4-4 24-4 28 0c3 3 3 23 0 26c-4 4-24 4-28 0c-3-3-3-23 0-26z"/>',
          '<path d="M28 42v8"/>',
          '<path d="M36 42v8"/>',
          '<path d="M24 50h16"/>',
          '<path d="M27 23c1.8-2 7.2-2 9 0"/>',
          '<path d="M29 29c1 1.5 5 1.5 6 0"/>',
          '<path d="M25 34c2.5 3 11.5 2 14-2"/>',
          '<path d="M38 24c-1.5 1.2-1.7 8.5 1 11.5"/>',
        ];
      case "The Martyr Complex":
        return [
          '<path d="M14 28h36"/>',
          '<path d="M18 24h28c2.2 0 4 1.8 4 4s-1.8 4-4 4H18c-2.2 0-4-1.8-4-4s1.8-4 4-4z"/>',
          '<path d="M26 24c-1.6 2.2-1.6 5.8 0 8"/>',
          '<path d="M38 24c-1.6 2.2-1.6 5.8 0 8"/>',
          '<path d="M11 20c2.6 1.4 3.6 4.5 2.7 7.2c2.4-.8 5.1.3 6.2 2.6"/>',
          '<path d="M53 20c-2.6 1.4-3.6 4.5-2.7 7.2c-2.4-.8-5.1.3-6.2 2.6"/>',
        ];
      case "The Fog":
        return [
          '<circle cx="32" cy="32" r="18"/>',
          '<path d="M32 8l4 10l-4 4l-4-4z"/>',
          '<path d="M32 56l4-10l-4-4l-4 4z"/>',
          '<path d="M56 32l-10 4l-4-4l4-4z"/>',
          '<path d="M8 32l10 4l4-4l-4-4z"/>',
          '<path d="M44.7 19.3l2.3 5.7"/>',
          '<path d="M19.3 19.3l-2.3 5.7"/>',
          '<path d="M44.7 44.7l2.3-5.7"/>',
          '<path d="M19.3 44.7l-2.3-5.7"/>',
        ];
      case "The Scattered Mind":
        return [
          '<circle cx="32" cy="32" r="2.5"/>',
          '<path d="M32 32L22 22"/>',
          '<path d="M22 22L16 16" stroke-dasharray="2.5 4"/>',
          '<path d="M32 32L18 32"/>',
          '<path d="M18 32L12 32" stroke-dasharray="2.5 4"/>',
          '<path d="M32 32L22 43"/>',
          '<path d="M22 43L16 49" stroke-dasharray="2.5 4"/>',
          '<path d="M32 32L32 18"/>',
          '<path d="M32 32L43 21"/>',
          '<path d="M43 21L49 15" stroke-dasharray="2.5 4"/>',
          '<path d="M32 32L46 32"/>',
          '<path d="M32 32L42 43"/>',
          '<path d="M42 43L48 49" stroke-dasharray="2.5 4"/>',
          '<path d="M32 32L32 46"/>',
        ];
      case "The Builder's Gap":
        return [
          '<path d="M12 44h40"/>',
          '<path d="M18 44V28"/>',
          '<path d="M30 44V22"/>',
          '<path d="M42 44V31"/>',
          '<path d="M30 22V14" stroke-dasharray="3 4"/>',
        ];
      default:
        return [];
    }
  }

  function getDriverIcon(driverName, size) {
    var color = DRIVER_ACCENT_COLORS[driverName] || "var(--ap-accent)";
    var paths = getDriverIconPaths(driverName).join("");
    var dimension = typeof size === "number" ? size : 64;
    return (
      '<svg viewBox="0 0 64 64" width="' +
      dimension +
      '" height="' +
      dimension +
      '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="' +
      escapeHtml(driverName) +
      ' icon"><title>' +
      escapeHtml(driverName) +
      "</title>" +
      paths +
      "</svg>"
    ).replace('stroke="currentColor"', 'stroke="' + color + '"');
  }

  function getCompositeScore(domainScores, compositeScore) {
    return typeof compositeScore === "number" && isFinite(compositeScore)
      ? compositeScore
      : getAverageScore(domainScores, ALL_DOMAIN_CODES);
  }

  function getArenaScores(domainScores, rawArenaScores) {
    var self = getNumericValue(
      rawArenaScores && (
        rawArenaScores.personal ??
        rawArenaScores.Personal ??
        rawArenaScores.self ??
        rawArenaScores.Self
      ),
      NaN
    );
    var relationships = getNumericValue(
      rawArenaScores && (rawArenaScores.relationships ?? rawArenaScores.Relationships),
      NaN
    );
    var business = getNumericValue(
      rawArenaScores && (rawArenaScores.business ?? rawArenaScores.Business),
      NaN
    );

    return {
      self:
        isFinite(self) && self > 0
          ? self
          : getAverageScore(domainScores, SELF_DOMAIN_CODES),
      relationships:
        isFinite(relationships) && relationships > 0
          ? relationships
          : getAverageScore(domainScores, RELATIONSHIPS_DOMAIN_CODES),
      business:
        isFinite(business) && business > 0
          ? business
          : getAverageScore(domainScores, BUSINESS_DOMAIN_CODES),
    };
  }

  function isArenaHighest(arenaScores, key) {
    var values = Object.values(arenaScores);
    return arenaScores[key] === Math.max.apply(Math, values);
  }

  function isArenaLowest(arenaScores, key) {
    var values = Object.values(arenaScores);
    return arenaScores[key] === Math.min.apply(Math, values);
  }

  function evaluateDriver(results) {
    var domainScores = (results && results.domainScores) || {};
    var importanceRatings =
      (results && (results.importanceRatings || results.importanceScores)) || {};
    var scoredResponses = normalizeStoredResponses(
      results && results.allResponses,
      results && results.responseCodingVersion
    );
    var driverScores = createEmptyDriverScores();
    var driverGates = createEmptyDriverGates();
    var businessVsSelfImportanceDelta =
      getAverageImportance(importanceRatings, BUSINESS_DOMAIN_CODES) -
      getAverageImportance(importanceRatings, SELF_DOMAIN_CODES);
    var importanceStdDev = getImportanceStdDev(importanceRatings);
    var arenaScores = getArenaScores(domainScores, (results && results.arenaScores) || {});
    var compositeScore = getCompositeScore(domainScores, results && results.overall);

    var achieverLowSelfDomains = [
      getNumericValue(domainScores.PH, 0) < 5.0,
      getNumericValue(domainScores.ME, 0) < 5.0,
      getNumericValue(domainScores.IA, 0) < 5.0,
    ];
    driverGates["The Achiever's Trap"] =
      getNumericValue(domainScores.EX, 0) >= 6.0 &&
      countTrue(achieverLowSelfDomains) >= 2;
    if (driverGates["The Achiever's Trap"]) {
      if (countTrue(achieverLowSelfDomains) === 3) driverScores["The Achiever's Trap"] += 2;
      if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Achiever's Trap"] += 1;
      if (importanceAtMost(importanceRatings, "PH", 5)) driverScores["The Achiever's Trap"] += 1;
      if (importanceAtMost(importanceRatings, "ME", 5)) driverScores["The Achiever's Trap"] += 1;
      if (importanceAtMost(importanceRatings, "IA", 5)) driverScores["The Achiever's Trap"] += 1;
      if (businessVsSelfImportanceDelta >= 2.0) driverScores["The Achiever's Trap"] += 2;
      if (getNumericValue(scoredResponses.PH6, 7) <= 3) driverScores["The Achiever's Trap"] += 2;
      if (isArenaHighest(arenaScores, "business")) driverScores["The Achiever's Trap"] += 1;
      if (isArenaLowest(arenaScores, "self")) driverScores["The Achiever's Trap"] += 1;
    }

    driverGates["The Protector"] =
      (getNumericValue(domainScores.OH, 0) >= 6.0 ||
        getNumericValue(domainScores.EX, 0) >= 6.0) &&
      (getNumericValue(domainScores.CO, 0) < 5.0 ||
        getNumericValue(domainScores.RS, 0) < 5.0);
    if (driverGates["The Protector"]) {
      if (getNumericValue(domainScores.OH, 0) >= 6.0 && getNumericValue(domainScores.EX, 0) >= 6.0) driverScores["The Protector"] += 2;
      if (getNumericValue(domainScores.CO, 0) < 5.0 && getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Protector"] += 2;
      if (getNumericValue(domainScores.FA, 0) < 5.0) driverScores["The Protector"] += 1;
      if (getNumericValue(domainScores.AF, 0) >= 6.0) driverScores["The Protector"] += 1;
      if (importanceAtMost(importanceRatings, "CO", 5)) driverScores["The Protector"] += 1;
      if (importanceAtMost(importanceRatings, "RS", 5)) driverScores["The Protector"] += 1;
      if (importanceAtLeast(importanceRatings, "OH", 7)) driverScores["The Protector"] += 1;
      if (getNumericValue(scoredResponses.CO6, 7) <= 3) driverScores["The Protector"] += 2;
      if (isArenaLowest(arenaScores, "relationships")) driverScores["The Protector"] += 2;
    }

    driverGates["The Pleaser's Bind"] =
      getNumericValue(domainScores.RS, 0) < 5.0 &&
      getNumericValue(scoredResponses.RS6, 7) <= 3;
    if (driverGates["The Pleaser's Bind"]) {
      if (getNumericValue(domainScores.FA, 0) >= 6.0 || getNumericValue(domainScores.CO, 0) >= 6.0) driverScores["The Pleaser's Bind"] += 2;
      if (getNumericValue(domainScores.FA, 0) >= 6.0 && getNumericValue(domainScores.CO, 0) >= 6.0) driverScores["The Pleaser's Bind"] += 1;
      if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
      if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
      if (importanceAtLeast(importanceRatings, "RS", 7)) driverScores["The Pleaser's Bind"] += 2;
      if (importanceAtLeast(importanceRatings, "FA", 7) || importanceAtLeast(importanceRatings, "CO", 7)) driverScores["The Pleaser's Bind"] += 1;
      if (getNumericValue(domainScores.ME, 0) < 5.0) driverScores["The Pleaser's Bind"] += 1;
      if (isArenaHighest(arenaScores, "relationships")) driverScores["The Pleaser's Bind"] += 2;
      if (isArenaLowest(arenaScores, "business")) driverScores["The Pleaser's Bind"] += 1;
    }

    driverGates["The Escape Artist"] =
      getNumericValue(domainScores.EX, 0) >= 5.5 &&
      getNumericValue(domainScores.IA, 0) < 5.0 &&
      (getNumericValue(domainScores.FA, 0) < 5.0 || getNumericValue(domainScores.ME, 0) < 5.0);
    if (driverGates["The Escape Artist"]) {
      if (getNumericValue(domainScores.FA, 0) < 5.0 && getNumericValue(domainScores.ME, 0) < 5.0) driverScores["The Escape Artist"] += 2;
      if (getNumericValue(domainScores.EX, 0) >= 6.5) driverScores["The Escape Artist"] += 1;
      if (importanceAtMost(importanceRatings, "ME", 5)) driverScores["The Escape Artist"] += 1;
      if (importanceAtMost(importanceRatings, "IA", 5)) driverScores["The Escape Artist"] += 1;
      if (importanceAtMost(importanceRatings, "FA", 5)) driverScores["The Escape Artist"] += 1;
      if (getNumericValue(scoredResponses.FA6, 7) <= 3) driverScores["The Escape Artist"] += 2;
      if (getNumericValue(scoredResponses.ME6, 7) <= 3) driverScores["The Escape Artist"] += 1;
      if (getNumericValue(domainScores.PH, 0) < 5.0) driverScores["The Escape Artist"] += 1;
      if (isArenaHighest(arenaScores, "business")) driverScores["The Escape Artist"] += 1;
      if (countTrue([
        importanceAtMost(importanceRatings, "ME", 5),
        importanceAtMost(importanceRatings, "IA", 5),
        importanceAtMost(importanceRatings, "FA", 5),
      ]) >= 2) driverScores["The Escape Artist"] += 1;
    }

    var perfectionistCapabilityDomains = [
      getNumericValue(domainScores.ME, 0) >= 6.0,
      getNumericValue(domainScores.IA, 0) >= 6.0,
      getNumericValue(domainScores.AF, 0) >= 6.0,
      getNumericValue(domainScores.VS, 0) >= 6.0,
    ];
    driverGates["The Perfectionist's Prison"] =
      getNumericValue(domainScores.EX, 0) < 5.0 &&
      countTrue(perfectionistCapabilityDomains) >= 2;
    if (driverGates["The Perfectionist's Prison"]) {
      if (importanceAtLeast(importanceRatings, "EX", 7)) driverScores["The Perfectionist's Prison"] += 2;
      if (getNumericValue(domainScores.VS, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 2;
      if (getNumericValue(domainScores.ME, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
      if (getNumericValue(domainScores.IA, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
      if (getNumericValue(domainScores.AF, 0) >= 6.0) driverScores["The Perfectionist's Prison"] += 1;
      if (getNumericValue(domainScores.RS, 0) >= 5.0) driverScores["The Perfectionist's Prison"] += 1;
      if (getNumericValue(scoredResponses.EX6, 7) <= 3) driverScores["The Perfectionist's Prison"] += 1;
      if (countTrue(perfectionistCapabilityDomains) >= 3) driverScores["The Perfectionist's Prison"] += 2;
      if (compositeScore >= 5.5) driverScores["The Perfectionist's Prison"] += 1;
    }

    driverGates["The Imposter Loop"] =
      getNumericValue(domainScores.EC, 0) < 5.0 &&
      (
        getNumericValue(scoredResponses.EC6, 7) <= 3 ||
        getNumericValue(domainScores.RS, 0) < 5.0
      );
    if (driverGates["The Imposter Loop"]) {
      if (getNumericValue(scoredResponses.EC6, 7) <= 3) driverScores["The Imposter Loop"] += 2;
      if (getNumericValue(domainScores.RS, 0) < 5.0) driverScores["The Imposter Loop"] += 2;
      if (
        importanceAtLeast(importanceRatings, "IA", 7) &&
        getNumericValue(domainScores.EC, 0) < 5.0
      ) driverScores["The Imposter Loop"] += 2;
      if (getNumericValue(domainScores.EX, 0) >= 5.0) driverScores["The Imposter Loop"] += 1;
      if (importanceAtMost(importanceRatings, "EC", 5)) driverScores["The Imposter Loop"] += 1;
      if (getNumericValue(domainScores.VS, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
      if (getNumericValue(scoredResponses.RS6, 7) <= 3) driverScores["The Imposter Loop"] += 1;
      if (getNumericValue(domainScores.OH, 0) < 5.0) driverScores["The Imposter Loop"] += 1;
      if (getNumericValue(scoredResponses.EC5, 7) <= 4) driverScores["The Imposter Loop"] += 2;
      if (
        getNumericValue(domainScores.ME, 0) < 5.5 &&
        importanceAtLeast(importanceRatings, "IA", 7)
      ) driverScores["The Imposter Loop"] += 1;
    }

    driverGates["The Martyr Complex"] =
      (getNumericValue(domainScores.WI, 0) >= 6.0 || getNumericValue(domainScores.FA, 0) >= 6.0) &&
      (getNumericValue(domainScores.PH, 0) < 5.0 || getNumericValue(domainScores.IA, 0) < 5.0);
    if (driverGates["The Martyr Complex"]) {
      if (getNumericValue(domainScores.WI, 0) >= 6.0 && getNumericValue(domainScores.FA, 0) >= 6.0) driverScores["The Martyr Complex"] += 2;
      if (getNumericValue(domainScores.PH, 0) < 5.0 && getNumericValue(domainScores.IA, 0) < 5.0) driverScores["The Martyr Complex"] += 2;
      if (importanceAtLeast(importanceRatings, "WI", 7)) driverScores["The Martyr Complex"] += 1;
      if (importanceAtLeast(importanceRatings, "FA", 7)) driverScores["The Martyr Complex"] += 1;
      if (importanceAtMost(importanceRatings, "PH", 5)) driverScores["The Martyr Complex"] += 1;
      if (importanceAtMost(importanceRatings, "IA", 5)) driverScores["The Martyr Complex"] += 1;
      if (getNumericValue(scoredResponses.PH6, 7) <= 3) driverScores["The Martyr Complex"] += 2;
      if (isArenaHighest(arenaScores, "relationships")) driverScores["The Martyr Complex"] += 1;
      if (isArenaLowest(arenaScores, "self")) driverScores["The Martyr Complex"] += 1;
    }

    driverGates["The Fog"] =
      getNumericValue(domainScores.VS, 0) < 5.0 &&
      noSingleImportanceAboveOrEqualEight(importanceRatings);
    if (driverGates["The Fog"]) {
      if (getNumericValue(domainScores.IA, 0) < 5.0) driverScores["The Fog"] += 2;
      if (getNumericValue(domainScores.EC, 0) < 5.0) driverScores["The Fog"] += 1;
      if (importanceStdDev < 2.0) driverScores["The Fog"] += 3;
      if (getNumericValue(scoredResponses.VS6, 7) <= 3) driverScores["The Fog"] += 2;
      if (importanceAtMost(importanceRatings, "VS", 5)) driverScores["The Fog"] += 1;
      if (getNumericValue(domainScores.EX, 0) < 5.0) driverScores["The Fog"] += 1;
      if (noSingleImportanceAboveOrEqualSeven(importanceRatings)) driverScores["The Fog"] += 2;
      if (compositeScore >= 4.0 && compositeScore <= 6.5) driverScores["The Fog"] += 1;
    }

    driverGates["The Scattered Mind"] =
      getNumericValue(domainScores.AF, 0) <= 5.0 &&
      getNumericValue(domainScores.ME, 0) >= 6.0;
    if (driverGates["The Scattered Mind"]) {
      if (getNumericValue(domainScores.AF, 0) <= 3.0) driverScores["The Scattered Mind"] += 2;
      if (getNumericValue(domainScores.EX, 0) <= 5.0) driverScores["The Scattered Mind"] += 2;
      if (getNumericValue(domainScores.OH, 0) <= 5.0) driverScores["The Scattered Mind"] += 2;
      if (getNumericValue(domainScores.IA, 0) >= 7.0) driverScores["The Scattered Mind"] += 2;
      if (
        importanceAtLeast(importanceRatings, "AF", 5) &&
        getNumericValue(domainScores.AF, 0) <= 4.0
      ) driverScores["The Scattered Mind"] += 2;
    }

    var builderWeakBusinessDomains = BUSINESS_DOMAIN_CODES.map(function (code) {
      return getNumericValue(domainScores[code], 0) < 5.5;
    });
    var builderStrongPersonalRelationalDomains = [
      getNumericValue(domainScores.PH, 0) >= 6.5,
      getNumericValue(domainScores.ME, 0) >= 6.5,
      getNumericValue(domainScores.IA, 0) >= 6.5,
      getNumericValue(domainScores.RS, 0) >= 6.5,
      getNumericValue(domainScores.FA, 0) >= 6.5,
      getNumericValue(domainScores.CO, 0) >= 6.5,
    ];
    driverGates["The Builder's Gap"] =
      isArenaLowest(arenaScores, "business") &&
      (arenaScores.self >= 6.0 || arenaScores.relationships >= 6.0) &&
      countTrue(builderWeakBusinessDomains) >= 2;
    if (driverGates["The Builder's Gap"]) {
      if (arenaScores.self >= 6.5 || arenaScores.relationships >= 6.5) {
        driverScores["The Builder's Gap"] += 2;
      }
      if (arenaScores.self >= 6.5 && arenaScores.relationships >= 6.5) {
        driverScores["The Builder's Gap"] += 2;
      }
      if (countTrue(builderWeakBusinessDomains) >= 3) {
        driverScores["The Builder's Gap"] += 2;
      }
      if (getNumericValue(domainScores.EC, 0) >= 6.0) driverScores["The Builder's Gap"] += 2;
      if (importanceAtLeast(importanceRatings, "EX", 7)) driverScores["The Builder's Gap"] += 1;
      if (importanceAtLeast(importanceRatings, "VS", 7)) driverScores["The Builder's Gap"] += 1;
      if (importanceAtLeast(importanceRatings, "OH", 5)) driverScores["The Builder's Gap"] += 1;
      if (countTrue(builderStrongPersonalRelationalDomains) >= 3) {
        driverScores["The Builder's Gap"] += 2;
      }
      if (compositeScore >= 5.5) driverScores["The Builder's Gap"] += 1;
    }

    var rankedDrivers = DRIVER_TIEBREAK_PRIORITY.map(function (driverName, index) {
      return {
        driverName: driverName,
        score: driverScores[driverName],
        index: index,
      };
    }).sort(function (a, b) {
      return (b.score - a.score) || (a.index - b.index);
    });

    var topDriverScore = rankedDrivers[0] ? rankedDrivers[0].score : 0;
    var secondDriverScore = rankedDrivers[1] ? rankedDrivers[1].score : 0;
    var primaryToSecondaryMargin = topDriverScore - secondDriverScore;

    var clearWinnerPrimary =
      rankedDrivers[0] &&
      topDriverScore >= DRIVER_THRESHOLD &&
      topDriverScore - secondDriverScore >= DRIVER_MIN_MARGIN
        ? rankedDrivers[0].driverName
        : null;
    var tieAtTopPrimary =
      !clearWinnerPrimary &&
      rankedDrivers[0] &&
      rankedDrivers[1] &&
      topDriverScore >= DRIVER_THRESHOLD &&
      secondDriverScore >= DRIVER_THRESHOLD &&
      primaryToSecondaryMargin < DRIVER_MIN_MARGIN
        ? rankedDrivers[0].driverName
        : null;

    var dysfunctionDriver = clearWinnerPrimary || tieAtTopPrimary || null;
    var secondaryDriver =
      dysfunctionDriver &&
      rankedDrivers[1] &&
      secondDriverScore >= DRIVER_SECONDARY_THRESHOLD &&
      driverGates[rankedDrivers[1].driverName] &&
      primaryToSecondaryMargin <= 3
        ? rankedDrivers[1].driverName
        : null;
    var secondaryDriverScore = secondaryDriver ? secondDriverScore : null;

    var driversAreCoEqual = !!(
      dysfunctionDriver &&
      secondaryDriver &&
      topDriverScore >= DRIVER_THRESHOLD &&
      secondDriverScore >= DRIVER_THRESHOLD &&
      primaryToSecondaryMargin < DRIVER_MIN_MARGIN
    );
    var inferredFallbackType = getDriverFallbackType(
      domainScores,
      compositeScore,
      dysfunctionDriver
    );
    var driverState = dysfunctionDriver
      ? "dysfunction_driver"
      : inferredFallbackType === "aligned_momentum"
        ? "aligned_momentum"
        : "no_driver";
    var assignedDriver =
      dysfunctionDriver ||
      (driverState === "aligned_momentum" ? ALIGNED_MOMENTUM_NAME : null);
    var driverFallbackType = getDriverFallbackType(
      domainScores,
      compositeScore,
      assignedDriver,
      driverState
    );
    return {
      assignedDriver: assignedDriver,
      secondaryDriver: secondaryDriver,
      driverScores: driverScores,
      driverGates: driverGates,
      topDriverScore: topDriverScore,
      secondDriverScore: secondDriverScore,
      secondaryDriverScore: secondaryDriverScore,
      primaryToSecondaryMargin: primaryToSecondaryMargin,
      driverState: driverState,
      driverFallbackType: driverFallbackType,
      driversAreCoEqual: driversAreCoEqual,
    };
  }

  function ensureEvaluation(results) {
    if (!results || typeof results !== "object") {
      return {
        assignedDriver: null,
        secondaryDriver: null,
        driverScores: createEmptyDriverScores(),
        driverGates: createEmptyDriverGates(),
        topDriverScore: 0,
        secondDriverScore: 0,
        secondaryDriverScore: null,
        primaryToSecondaryMargin: 0,
        driverState: "no_driver",
        driverFallbackType: "standard",
        driversAreCoEqual: false,
      };
    }
    var hasResponses =
      results.allResponses &&
      typeof results.allResponses === "object" &&
      Object.keys(results.allResponses).length > 0;
    if (hasResponses) {
      var evaluation = evaluateDriver(results);
      results.assignedDriver = evaluation.assignedDriver;
      results.secondaryDriver = evaluation.secondaryDriver;
      results.driverScores = evaluation.driverScores;
      results.driverGates = evaluation.driverGates;
      results.topDriverScore = evaluation.topDriverScore;
      results.secondDriverScore = evaluation.secondDriverScore;
      results.secondaryDriverScore = evaluation.secondaryDriverScore;
      results.primaryToSecondaryMargin = evaluation.primaryToSecondaryMargin;
      results.driverState = evaluation.driverState;
      results.driverFallbackType = evaluation.driverFallbackType;
      results.driversAreCoEqual = evaluation.driversAreCoEqual;
      return evaluation;
    }
    if (
      typeof results.topDriverScore === "number" &&
      typeof results.secondDriverScore === "number" &&
      typeof results.primaryToSecondaryMargin === "number" &&
      results.driverScores &&
      typeof results.driverScores === "object" &&
      results.driverGates &&
      typeof results.driverGates === "object" &&
      "assignedDriver" in results &&
      "secondaryDriver" in results &&
      "secondaryDriverScore" in results
    ) {
      var cachedPrimary =
        typeof results.assignedDriver === "string"
          ? (
              results.assignedDriver === ALIGNED_MOMENTUM_NAME ||
              DRIVER_CONTENT[results.assignedDriver]
            )
            ? results.assignedDriver
            : null
          : null;
      var cachedSecondary =
        typeof results.secondaryDriver === "string" ? results.secondaryDriver : null;
      var cachedCoEqual =
        typeof results.driversAreCoEqual === "boolean"
          ? results.driversAreCoEqual
          : !!(
              cachedPrimary &&
              cachedPrimary !== ALIGNED_MOMENTUM_NAME &&
              cachedSecondary &&
              typeof results.topDriverScore === "number" &&
              results.topDriverScore >= DRIVER_THRESHOLD &&
              typeof results.secondDriverScore === "number" &&
              results.secondDriverScore >= DRIVER_THRESHOLD &&
              typeof results.primaryToSecondaryMargin === "number" &&
              results.primaryToSecondaryMargin < DRIVER_MIN_MARGIN
            );
      return {
        assignedDriver: cachedPrimary,
        secondaryDriver: cachedSecondary,
        driverScores: results.driverScores,
        driverGates: results.driverGates,
        topDriverScore: results.topDriverScore,
        secondDriverScore: results.secondDriverScore,
        secondaryDriverScore:
          typeof results.secondaryDriverScore === "number"
            ? results.secondaryDriverScore
            : null,
        primaryToSecondaryMargin: results.primaryToSecondaryMargin,
        driverState: getDriverState(
          typeof results.assignedDriver === "string" ? results.assignedDriver : null,
          typeof results.driverFallbackType === "string"
            ? results.driverFallbackType
            : null
        ),
        driverFallbackType: getDriverFallbackType(
          (results && results.domainScores) || {},
          getCompositeScore((results && results.domainScores) || {}, results && results.overall),
          typeof results.assignedDriver === "string" ? results.assignedDriver : null,
          getDriverState(
            typeof results.assignedDriver === "string" ? results.assignedDriver : null,
            typeof results.driverFallbackType === "string"
              ? results.driverFallbackType
              : null
          )
        ),
        driversAreCoEqual: cachedCoEqual,
      };
    }
    var inferredFallbackType = getDriverFallbackType(
      (results && results.domainScores) || {},
      getCompositeScore((results && results.domainScores) || {}, results && results.overall),
      null
    );
    if (!hasResponses) {
      return {
        assignedDriver:
          inferredFallbackType === "aligned_momentum" ? ALIGNED_MOMENTUM_NAME : null,
        secondaryDriver: null,
        driverScores: createEmptyDriverScores(),
        driverGates: createEmptyDriverGates(),
        topDriverScore: 0,
        secondDriverScore: 0,
        secondaryDriverScore: null,
        primaryToSecondaryMargin: 0,
        driverState:
          inferredFallbackType === "aligned_momentum"
            ? "aligned_momentum"
            : "no_driver",
        driverFallbackType: inferredFallbackType,
        driversAreCoEqual: false,
      };
    }
  }

  function buildPrintDetailBlock(title, body) {
    return (
      '<div class="driver-print-detail">' +
      '<p class="driver-print-detail-title">' +
      escapeHtml(title) +
      "</p>" +
      '<p class="driver-print-detail-body">' +
      escapeHtml(body) +
      "</p></div>"
    );
  }

  function buildPrintAlignedMomentumSection(accent) {
    return (
      '<div class="print-only driver-print-shell driver-print-page driver-print-first" style="border-left:4px solid ' +
      accent +
      ';"><div class="driver-print-inner">' +
      '<p class="driver-print-eyebrow" style="color:' +
      accent +
      '">What\'s Fueling This Pattern</p>' +
      '<div class="driver-print-header">' +
      '<div class="driver-print-icon" style="background:' +
      accent +
      '14;border-color:' +
      accent +
      '33;">' +
      getDriverIcon(ALIGNED_MOMENTUM_NAME, 52) +
      "</div>" +
      '<div class="driver-print-heading-copy">' +
      '<h2 class="driver-print-title">' +
      escapeHtml(ALIGNED_MOMENTUM_CONTENT.name) +
      "</h2>" +
      '<p class="driver-print-tagline">' +
      escapeHtml(ALIGNED_MOMENTUM_CONTENT.tagline) +
      "</p></div></div>" +
      '<blockquote class="driver-print-quote" style="background:' +
      accent +
      '10;border-left:2px solid ' +
      accent +
      ';">&quot;' +
      escapeHtml(ALIGNED_MOMENTUM_CONTENT.coreState) +
      "&quot;</blockquote>" +
      '<p class="driver-print-body">' +
      escapeHtml(ALIGNED_MOMENTUM_CONTENT.description) +
      "</p>" +
      buildPrintDetailBlock(
        "How This Shows Up in Your Scores",
        ALIGNED_MOMENTUM_CONTENT.howThisShowsUp
      ) +
      buildPrintDetailBlock(
        "What This Makes Possible",
        ALIGNED_MOMENTUM_CONTENT.whatThisMakesPossible
      ) +
      buildPrintDetailBlock("How to Protect It", ALIGNED_MOMENTUM_CONTENT.howToProtectIt) +
      '<p class="driver-print-note">' +
      escapeHtml(
        "Aligned Momentum reflects the current state of your internal operating system based on your VAPI scores. It is not permanent. It's maintained through ongoing practice, honest self-assessment, and the boundaries and habits that produced it. Retake the VAPI regularly to confirm this state is holding."
      ) +
      "</p></div></div>"
    );
  }

  function buildPrintCoEqualDriverBlock(driverKey, driver, accent, patternScore) {
    return (
      '<div class="driver-print-coequal-cell" style="border:1px solid ' +
      accent +
      "33;border-radius:12px;padding:16px;background:" +
      accent +
      '08;">' +
      '<div class="driver-print-header" style="flex-direction:column;align-items:flex-start;">' +
      '<div class="driver-print-icon" style="background:' +
      accent +
      "14;border-color:" +
      accent +
      '33;">' +
      getDriverIcon(driverKey, 52) +
      "</div>" +
      '<div class="driver-print-heading-copy" style="margin-top:10px;">' +
      '<h2 class="driver-print-title">' +
      escapeHtml(driver.name) +
      "</h2>" +
      '<p class="driver-print-core-fear"><span>Core fear:</span> ' +
      escapeHtml(driver.coreFear) +
      "</p>" +
      '<p class="driver-print-tagline">' +
      escapeHtml(driver.tagline) +
      "</p></div></div>" +
      '<div class="driver-print-strength" style="background:' +
      accent +
      "10;color:" +
      accent +
      ";border-color:" +
      accent +
      '22;margin-top:12px;">Pattern strength: ' +
      patternScore +
      " / " +
      driver.maxPossible +
      "</div>" +
      '<blockquote class="driver-print-quote" style="background:' +
      accent +
      "10;border-left:2px solid " +
      accent +
      ';margin-top:12px;">&quot;' +
      escapeHtml(driver.coreBelief) +
      "&quot;</blockquote>" +
      '<p class="driver-print-body" style="margin-top:12px;">' +
      escapeHtml(driver.description) +
      "</p></div>"
    );
  }

  function buildPrintCoEqualDriverPages(evaluation, primaryKey, secondaryKey) {
    var d1 = DRIVER_CONTENT[primaryKey];
    var d2 = DRIVER_CONTENT[secondaryKey];
    var acc1 = DRIVER_ACCENT_COLORS[primaryKey] || "var(--ap-accent)";
    var acc2 = DRIVER_ACCENT_COLORS[secondaryKey] || "var(--ap-accent)";
    var firstPage =
      '<div class="print-only driver-print-shell driver-print-page driver-print-first" style="border-left:4px solid ' +
      acc1 +
      ';"><div class="driver-print-inner">' +
      '<p class="driver-print-eyebrow" style="color:' +
      acc1 +
      '">Your Primary Patterns</p>' +
      '<p class="driver-print-body" style="margin-bottom:18px;">' +
      escapeHtml(DRIVER_CO_EQUAL_EXPLAINER) +
      "</p>" +
      '<div class="driver-print-coequal-grid" style="display:grid;grid-template-columns:1fr;gap:18px;">' +
      buildPrintCoEqualDriverBlock(primaryKey, d1, acc1, evaluation.topDriverScore) +
      buildPrintCoEqualDriverBlock(secondaryKey, d2, acc2, evaluation.secondDriverScore) +
      "</div>" +
      "</div></div>";
    var secondPage =
      '<div class="print-only driver-print-shell driver-print-page driver-print-second" style="border-left:4px solid ' +
      acc1 +
      ';"><div class="driver-print-inner">' +
      '<p class="driver-print-eyebrow" style="color:' +
      acc1 +
      '">Your Primary Patterns (continued)</p>' +
      '<h3 class="driver-print-continued-title">' +
      escapeHtml(d1.name) +
      "</h3>" +
      buildPrintDetailBlock("How This Shows Up in Your Scores", d1.mechanism) +
      buildPrintDetailBlock("What This Is Costing You", d1.whatItCosts) +
      buildPrintDetailBlock("The Way Out", d1.theWayOut) +
      '<h3 class="driver-print-continued-title" style="margin-top:28px;">' +
      escapeHtml(d2.name) +
      "</h3>" +
      buildPrintDetailBlock("How This Shows Up in Your Scores", d2.mechanism) +
      buildPrintDetailBlock("What This Is Costing You", d2.whatItCosts) +
      buildPrintDetailBlock("The Way Out", d2.theWayOut) +
      '<p class="driver-print-note">' +
      escapeHtml(DRIVER_NOTE) +
      "</p></div></div>";
    return firstPage + secondPage;
  }

  function buildPrintDriverPages(evaluation, driverName, secondaryDriverName, accent) {
    if (
      evaluation &&
      evaluation.driversAreCoEqual &&
      secondaryDriverName &&
      DRIVER_CONTENT[driverName] &&
      DRIVER_CONTENT[secondaryDriverName]
    ) {
      return buildPrintCoEqualDriverPages(evaluation, driverName, secondaryDriverName);
    }
    var driver = DRIVER_CONTENT[driverName];
    var secondaryDriver = secondaryDriverName ? DRIVER_CONTENT[secondaryDriverName] : null;
    var secondaryAccent = secondaryDriverName
      ? (DRIVER_ACCENT_COLORS[secondaryDriverName] || accent)
      : accent;
    var firstPage =
      '<div class="print-only driver-print-shell driver-print-page driver-print-first" style="border-left:4px solid ' +
      accent +
      ';"><div class="driver-print-inner">' +
      '<p class="driver-print-eyebrow" style="color:' +
      accent +
      '">What\'s Driving This Pattern</p>' +
      '<div class="driver-print-header">' +
      '<div class="driver-print-icon" style="background:' +
      accent +
      '14;border-color:' +
      accent +
      '33;">' +
      getDriverIcon(driverName, 52) +
      "</div>" +
      '<div class="driver-print-heading-copy">' +
      '<h2 class="driver-print-title">' +
      escapeHtml(driver.name) +
      "</h2>" +
      '<p class="driver-print-core-fear"><span>Core fear:</span> ' +
      escapeHtml(driver.coreFear) +
      "</p>" +
      '<p class="driver-print-tagline">' +
      escapeHtml(driver.tagline) +
      "</p></div></div>" +
      '<div class="driver-print-strength" style="background:' +
      accent +
      '10;color:' +
      accent +
      ';border-color:' +
      accent +
      '22;">Pattern strength: ' +
      evaluation.topDriverScore +
      " / " +
      driver.maxPossible +
      "</div>" +
      '<blockquote class="driver-print-quote" style="background:' +
      accent +
      '10;border-left:2px solid ' +
      accent +
      ';">&quot;' +
      escapeHtml(driver.coreBelief) +
      "&quot;</blockquote>" +
      '<p class="driver-print-body">' +
      escapeHtml(driver.description) +
      "</p>" +
      buildPrintDetailBlock("How This Shows Up in Your Scores", driver.mechanism) +
      "</div></div>";
    var secondPage =
      '<div class="print-only driver-print-shell driver-print-page driver-print-second" style="border-left:4px solid ' +
      accent +
      ';"><div class="driver-print-inner">' +
      '<p class="driver-print-eyebrow" style="color:' +
      accent +
      '">What\'s Driving This Pattern</p>' +
      '<h3 class="driver-print-continued-title">' +
      escapeHtml(driver.name) +
      "</h3>" +
      buildPrintDetailBlock("What This Is Costing You", driver.whatItCosts) +
      buildPrintDetailBlock("The Way Out", driver.theWayOut);
    if (secondaryDriver) {
      secondPage +=
        '<div class="driver-print-secondary" style="background:' +
        secondaryAccent +
        '10;border-color:' +
        secondaryAccent +
        '33;">' +
        '<p class="driver-print-secondary-label">Secondary Pattern</p>' +
        '<div class="driver-print-secondary-row">' +
        '<div class="driver-print-secondary-icon" style="background:' +
        secondaryAccent +
        '14;border-color:' +
        secondaryAccent +
        '33;">' +
        getDriverIcon(secondaryDriverName, 32) +
        "</div>" +
        '<div class="driver-print-secondary-copy">' +
        '<p class="driver-print-secondary-name">' +
        escapeHtml(secondaryDriver.name) +
        "</p>" +
        '<p class="driver-print-secondary-belief">&quot;' +
        escapeHtml(secondaryDriver.coreBelief) +
        "&quot;</p>" +
        '<p class="driver-print-secondary-tagline">' +
        escapeHtml(secondaryDriver.tagline) +
        "</p></div></div></div>";
    }
    secondPage +=
      '<p class="driver-print-note">' +
      escapeHtml(DRIVER_NOTE) +
      "</p></div></div>";
    return firstPage + secondPage;
  }

  function buildPrintFallbackSection(heading, body, accent) {
    return (
      '<div class="print-only driver-print-shell driver-print-page driver-print-first" style="border-left:4px solid ' +
      accent +
      ';"><div class="driver-print-inner">' +
      '<p class="driver-print-eyebrow" style="color:' +
      accent +
      '">What\'s Driving This Pattern</p>' +
      '<h2 class="driver-print-title">' +
      escapeHtml(heading) +
      "</h2>" +
      '<p class="driver-print-body">' +
      escapeHtml(body) +
      "</p>" +
      '<p class="driver-print-note">' +
      escapeHtml(DRIVER_NOTE) +
      "</p></div></div>"
    );
  }

  /** My Plan inline CTA on results page (skipped for Aligned Momentum). */
  function buildMyPlanDriverInlineHtml(accent) {
    return (
      '<div class="my-plan-inline-driver no-print mt-6 rounded-xl border border-[var(--ap-border)] border-l-4 pl-4 pr-4 py-4 bg-amber-50/90" style="border-left-color:' +
      accent +
      '">' +
      '<p class="text-sm font-semibold text-[var(--ap-primary)] mb-1 flex items-center gap-2">' +
      '<i data-lucide="lightbulb" class="w-4 h-4 shrink-0 text-[var(--ap-accent)]"></i> This driver has a counter-move.</p>' +
      '<p class="text-sm text-[var(--ap-secondary)] leading-relaxed mb-3">Your 30-day plan includes specific guidance for working with (not against) this pattern.</p>' +
      '<div class="my-plan-inline-guest">' +
      '<a href="/signup?redirect=' +
      encodeURIComponent("/my-plan") +
      '" class="my-plan-cta-signup inline-flex items-center justify-center gap-2 text-sm font-bold bg-[var(--ap-accent)] hover:bg-[#e55a0f] text-white px-4 py-2.5 rounded-lg w-full sm:w-auto">Create free account</a>' +
      "</div>" +
      '<div class="my-plan-inline-auth hidden">' +
      '<a href="/my-plan" class="inline-flex items-center justify-center gap-2 text-sm font-bold text-[var(--ap-accent)] hover:underline w-full sm:w-auto">View My Plan →</a>' +
      "</div></div>"
    );
  }

  function buildResultsSection(results, options) {
    var evaluation = ensureEvaluation(results);
    var context = (options && options.context) === "dashboard" ? "dashboard" : "results";
    var driverState =
      evaluation.driverState ||
      getDriverState(evaluation.assignedDriver || null, evaluation.driverFallbackType || null);
    var isAlignedMomentum = driverState === "aligned_momentum";
    var driverName =
      !isAlignedMomentum && evaluation.assignedDriver && DRIVER_CONTENT[evaluation.assignedDriver]
        ? evaluation.assignedDriver
        : null;
    var secondaryDriverName =
      !isAlignedMomentum &&
      evaluation.secondaryDriver &&
      DRIVER_CONTENT[evaluation.secondaryDriver]
        ? evaluation.secondaryDriver
        : null;
    var driversAreCoEqual = !!(
      evaluation.driversAreCoEqual &&
      driverName &&
      secondaryDriverName
    );
    var accent = isAlignedMomentum
      ? ALIGNED_MOMENTUM_CONTENT.colorAccent
      : driverName
        ? (DRIVER_ACCENT_COLORS[driverName] || "var(--ap-accent)")
        : ((options && options.accent) || "var(--ap-accent)");
    var fallbackContent = getDriverFallbackContent(evaluation.driverFallbackType || "standard");
    var id = (options && options.id) || "driver-section";
    var libraryHref = (options && options.libraryHref) || getDriverLibraryHref();
    var surface = "var(--ap-surface, #ffffff)";
    var useCollapsedDashboard = context === "dashboard";
    var cardBackground =
      context === "dashboard"
        ? surface
        : "linear-gradient(135deg," + accent + "12 0%," + surface + " 28%," + surface + " 100%)";
    var bodyCopyClass =
      context === "dashboard"
        ? "text-base text-[var(--ap-secondary)] leading-relaxed"
        : "text-base sm:text-[17px] text-[var(--ap-secondary)] leading-relaxed";
    var summaryCopyClass =
      context === "dashboard"
        ? "text-base italic text-[var(--ap-secondary)] leading-relaxed"
        : "text-base sm:text-[17px] italic text-[var(--ap-secondary)] leading-relaxed";
    var noteCopyClass =
      context === "dashboard"
        ? "text-sm text-[var(--ap-muted)] leading-relaxed"
        : "text-[15px] sm:text-base text-[var(--ap-muted)] leading-relaxed";
    var detailsTitleClass =
      context === "dashboard"
        ? "cursor-pointer flex items-center justify-between gap-3 px-4 py-3.5 text-base font-semibold text-[var(--ap-primary)] transition-colors hover:text-[var(--ap-accent)] list-none [&::-webkit-details-marker]:hidden"
        : "cursor-pointer flex items-center justify-between gap-3 px-4 py-3.5 text-base sm:text-[17px] font-semibold text-[var(--ap-primary)] transition-colors hover:text-[var(--ap-accent)] list-none [&::-webkit-details-marker]:hidden";
    var detailsBodyClass =
      context === "dashboard"
        ? "border-t border-[var(--ap-border)] px-4 py-4 text-base text-[var(--ap-secondary)] leading-relaxed"
        : "border-t border-[var(--ap-border)] px-4 py-4 text-base sm:text-[17px] text-[var(--ap-secondary)] leading-relaxed";
    var alignedMomentumNote =
      "Aligned Momentum reflects the current state of your internal operating system based on your VAPI scores. It is not permanent. It's maintained through ongoing practice, honest self-assessment, and the boundaries and habits that produced it. Retake the VAPI regularly to confirm this state is holding.";
    var dashboardToggleLabel = driversAreCoEqual
      ? "Read full pattern profiles"
      : "Read full pattern driver profile";
    var previewHeading = isAlignedMomentum
      ? "What's Fueling This"
      : "What's Driving This";
    var previewTitle = isAlignedMomentum
      ? ALIGNED_MOMENTUM_CONTENT.name
      : driverName
        ? DRIVER_CONTENT[driverName].name
        : fallbackContent.heading;
    var previewTagline = isAlignedMomentum
      ? ALIGNED_MOMENTUM_CONTENT.tagline
      : driverName
        ? DRIVER_CONTENT[driverName].tagline
        : null;
    var profileHtml = "";
    var dashboardExpandedHtml = "";
    var html = '<div id="' + id + '" class="driver-results-shell">';
    if (context === "results") {
      if (isAlignedMomentum) {
        html += buildPrintAlignedMomentumSection(accent);
      } else if (driverName) {
        html += buildPrintDriverPages(evaluation, driverName, secondaryDriverName, accent);
      } else {
        html += buildPrintFallbackSection(fallbackContent.heading, fallbackContent.text, accent);
      }
    }
    if (useCollapsedDashboard) {
      html +=
        '<p class="eyebrow mb-1">' +
        escapeHtml(isAlignedMomentum ? "What's Fueling This" : "What's Driving This") +
        "</p>";
    }
    html +=
      '<div class="driver-section rounded-[30px] border border-[var(--ap-border)] shadow-sm overflow-hidden mb-10 relative scroll-mt-24" style="background:' +
      cardBackground +
      ';border-left:4px solid ' +
      accent +
      ';">';
    html += '<div class="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl" style="background:' + accent + '16;"></div>';
    profileHtml += '<div class="p-6 sm:p-8 relative space-y-5">';
    profileHtml +=
      '<p class="text-[10px] font-semibold uppercase tracking-[0.22em]" style="color:' +
      accent +
      '">' +
      (isAlignedMomentum
        ? "What's Fueling This Pattern"
        : driversAreCoEqual
          ? "Your Primary Patterns"
          : "What's Driving This Pattern") +
      "</p>";
    if (isAlignedMomentum) {
      profileHtml += '<div class="flex flex-col gap-5">';
      profileHtml += '<div class="flex items-start gap-4">';
      profileHtml += '<div class="flex-shrink-0 w-16 h-16 rounded-2xl border flex items-center justify-center" style="background:' + accent + '14;border-color:' + accent + '33;">';
      profileHtml += getDriverIcon(ALIGNED_MOMENTUM_NAME, 64);
      profileHtml += "</div>";
      profileHtml += '<div class="min-w-0 space-y-2">';
      profileHtml +=
        '<h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--ap-primary)]">' +
        escapeHtml(ALIGNED_MOMENTUM_CONTENT.name) +
        "</h2>";
      profileHtml +=
        '<p class="' +
        summaryCopyClass +
        '">' +
        escapeHtml(ALIGNED_MOMENTUM_CONTENT.tagline) +
        "</p>";
      profileHtml += "</div></div>";
      profileHtml +=
        '<blockquote class="rounded-2xl px-4 py-4 text-xl sm:text-2xl leading-tight font-semibold text-[var(--ap-primary)]" style="background:' +
        accent +
        '14;border-left:2px solid ' +
        accent +
        ';">&quot;' +
        escapeHtml(ALIGNED_MOMENTUM_CONTENT.coreState) +
        "&quot;</blockquote>";
      profileHtml +=
        '<p class="' +
        bodyCopyClass +
        '">' +
        escapeHtml(ALIGNED_MOMENTUM_CONTENT.description) +
        "</p>";
      [
        ["How This Shows Up in Your Scores", ALIGNED_MOMENTUM_CONTENT.howThisShowsUp],
        ["What This Makes Possible", ALIGNED_MOMENTUM_CONTENT.whatThisMakesPossible],
        ["How to Protect It", ALIGNED_MOMENTUM_CONTENT.howToProtectIt],
      ].forEach(function (section) {
        profileHtml +=
          '<details class="driver-details rounded-2xl border border-[var(--ap-border)] group" style="background:' +
          surface +
          ';">';
        profileHtml +=
          '<summary class="' +
          detailsTitleClass +
          '">' +
          "<span>" +
          escapeHtml(section[0]) +
          '</span><i data-lucide="chevron-down" class="driver-chevron w-4 h-4 shrink-0 transition-transform duration-200"></i></summary>';
        profileHtml +=
          '<div class="' +
          detailsBodyClass +
          '">' +
          escapeHtml(section[1]) +
          "</div></details>";
      });
      profileHtml += '<div class="space-y-4 border-t border-[var(--ap-border)]/70 pt-4">';
      profileHtml +=
        '<p class="' +
        noteCopyClass +
        '">' +
        escapeHtml(alignedMomentumNote) +
        "</p>";
      profileHtml +=
        '<a href="' +
        libraryHref +
        '" class="driver-library-link inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-colors" data-driver-library-link="1" style="color:' +
        accent +
        '">Explore all driver patterns &gt;</a>';
      profileHtml += "</div>";
      profileHtml += "</div>";
      dashboardExpandedHtml += '<div class="space-y-5">';
      dashboardExpandedHtml +=
        '<blockquote class="rounded-2xl px-4 py-4 text-xl sm:text-2xl leading-tight font-semibold text-[var(--ap-primary)]" style="background:' +
        accent +
        '14;border-left:2px solid ' +
        accent +
        ';">&quot;' +
        escapeHtml(ALIGNED_MOMENTUM_CONTENT.coreState) +
        "&quot;</blockquote>";
      dashboardExpandedHtml +=
        '<p class="' +
        bodyCopyClass +
        '">' +
        escapeHtml(ALIGNED_MOMENTUM_CONTENT.description) +
        "</p>";
      [
        ["How This Shows Up in Your Scores", ALIGNED_MOMENTUM_CONTENT.howThisShowsUp],
        ["What This Makes Possible", ALIGNED_MOMENTUM_CONTENT.whatThisMakesPossible],
        ["How to Protect It", ALIGNED_MOMENTUM_CONTENT.howToProtectIt],
      ].forEach(function (section) {
        dashboardExpandedHtml +=
          '<details class="driver-details rounded-2xl border border-[var(--ap-border)] group" style="background:' +
          surface +
          ';">';
        dashboardExpandedHtml +=
          '<summary class="' +
          detailsTitleClass +
          '">' +
          "<span>" +
          escapeHtml(section[0]) +
          '</span><i data-lucide="chevron-down" class="driver-chevron w-4 h-4 shrink-0 transition-transform duration-200"></i></summary>';
        dashboardExpandedHtml +=
          '<div class="' +
          detailsBodyClass +
          '">' +
          escapeHtml(section[1]) +
          "</div></details>";
      });
      dashboardExpandedHtml +=
        '<p class="' +
        noteCopyClass +
        '">' +
        escapeHtml(alignedMomentumNote) +
        "</p>";
      dashboardExpandedHtml += "</div>";
    } else if (driversAreCoEqual) {
      var accCoPri = DRIVER_ACCENT_COLORS[driverName] || accent;
      var accCoSec = DRIVER_ACCENT_COLORS[secondaryDriverName] || accent;
      var dCoPri = DRIVER_CONTENT[driverName];
      var dCoSec = DRIVER_CONTENT[secondaryDriverName];
      function buildCoEqualDriverCard(dk, d, ac, score) {
        var b = "";
        b +=
          '<div class="rounded-2xl border border-[var(--ap-border)] p-5 sm:p-6 space-y-4 shadow-sm" style="border-left:4px solid ' +
          ac +
          ";background:" +
          surface +
          ';">';
        b += '<div class="flex items-start gap-4">';
        b +=
          '<div class="flex-shrink-0 w-16 h-16 rounded-2xl border flex items-center justify-center" style="background:' +
          ac +
          "14;border-color:" +
          ac +
          '33;">';
        b += getDriverIcon(dk, 64);
        b += "</div>";
        b += '<div class="min-w-0 space-y-2">';
        b +=
          '<h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--ap-primary)]">' +
          escapeHtml(d.name) +
          "</h2>";
        b +=
          '<p class="text-base text-[var(--ap-secondary)]"><span class="font-semibold text-[var(--ap-primary)]">Core fear:</span> ' +
          escapeHtml(d.coreFear) +
          "</p>";
        b += '<p class="' + summaryCopyClass + '">' + escapeHtml(d.tagline) + "</p>";
        b += "</div></div>";
        b +=
          '<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider w-fit" style="background:' +
          ac +
          "14;color:" +
          ac +
          ";border:1px solid " +
          ac +
          '33;">Pattern strength: ' +
          score +
          " / " +
          d.maxPossible +
          "</span>";
        b +=
          '<blockquote class="rounded-2xl px-4 py-4 text-xl sm:text-2xl leading-tight font-semibold text-[var(--ap-primary)]" style="background:' +
          ac +
          "14;border-left:2px solid " +
          ac +
          ';">&quot;' +
          escapeHtml(d.coreBelief) +
          "&quot;</blockquote>";
        b += '<p class="' + bodyCopyClass + '">' + escapeHtml(d.description) + "</p>";
        [
          ["How This Shows Up in Your Scores", d.mechanism],
          ["What This Is Costing You", d.whatItCosts],
          ["The Way Out", d.theWayOut],
        ].forEach(function (section) {
          b +=
            '<details class="driver-details rounded-2xl border border-[var(--ap-border)] group" style="background:' +
            surface +
            ';">';
          b +=
            '<summary class="' +
            detailsTitleClass +
            '"><span>' +
            escapeHtml(section[0]) +
            '</span><i data-lucide="chevron-down" class="driver-chevron w-4 h-4 shrink-0 transition-transform duration-200"></i></summary>';
          b += '<div class="' + detailsBodyClass + '">' + escapeHtml(section[1]) + "</div></details>";
        });
        b += "</div>";
        return b;
      }
      function buildCoEqualExpandedChunk(dk, d, ac, isLast) {
        var sep = isLast ? "" : " pb-8 mb-8 border-b border-[var(--ap-border)]";
        var x = '<div class="space-y-5' + sep + '">';
        x +=
          '<h3 class="text-xl sm:text-2xl font-extrabold text-[var(--ap-primary)]">' +
          escapeHtml(d.name) +
          "</h3>";
        x +=
          '<blockquote class="rounded-2xl px-4 py-4 text-xl sm:text-2xl leading-tight font-semibold text-[var(--ap-primary)]" style="background:' +
          ac +
          "14;border-left:2px solid " +
          ac +
          ';">&quot;' +
          escapeHtml(d.coreBelief) +
          "&quot;</blockquote>";
        x += '<p class="' + bodyCopyClass + '">' + escapeHtml(d.description) + "</p>";
        [
          ["How This Shows Up in Your Scores", d.mechanism],
          ["What This Is Costing You", d.whatItCosts],
          ["The Way Out", d.theWayOut],
        ].forEach(function (section) {
          x +=
            '<details class="driver-details rounded-2xl border border-[var(--ap-border)] group" style="background:' +
            surface +
            ';">';
          x +=
            '<summary class="' +
            detailsTitleClass +
            '"><span>' +
            escapeHtml(section[0]) +
            '</span><i data-lucide="chevron-down" class="driver-chevron w-4 h-4 shrink-0 transition-transform duration-200"></i></summary>';
          x += '<div class="' + detailsBodyClass + '">' + escapeHtml(section[1]) + "</div></details>";
        });
        x += "</div>";
        return x;
      }
      profileHtml += '<p class="' + noteCopyClass + '">' + escapeHtml(DRIVER_CO_EQUAL_EXPLAINER) + "</p>";
      profileHtml += '<div class="grid grid-cols-1 gap-6">';
      profileHtml += buildCoEqualDriverCard(driverName, dCoPri, accCoPri, evaluation.topDriverScore);
      profileHtml += buildCoEqualDriverCard(secondaryDriverName, dCoSec, accCoSec, evaluation.secondDriverScore);
      profileHtml += "</div>";
      profileHtml += '<div class="space-y-4 border-t border-[var(--ap-border)]/70 pt-4">';
      profileHtml += '<p class="' + noteCopyClass + '">' + escapeHtml(DRIVER_NOTE) + "</p>";
      profileHtml +=
        '<a href="' +
        libraryHref +
        '" class="driver-library-link inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-colors" data-driver-library-link="1" style="color:' +
        accCoPri +
        '">Learn more about all driver patterns &gt;</a>';
      profileHtml += "</div>";
      dashboardExpandedHtml += buildCoEqualExpandedChunk(driverName, dCoPri, accCoPri, false);
      dashboardExpandedHtml += buildCoEqualExpandedChunk(secondaryDriverName, dCoSec, accCoSec, true);
      dashboardExpandedHtml +=
        '<p class="' +
        noteCopyClass +
        '">' +
        escapeHtml(DRIVER_NOTE) +
        "</p>";
    } else if (driverName) {
      var driver = DRIVER_CONTENT[driverName];
      profileHtml += '<div class="flex flex-col gap-5">';
      profileHtml += '<div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">';
      profileHtml += '<div class="flex items-start gap-4">';
      profileHtml += '<div class="flex-shrink-0 w-16 h-16 rounded-2xl border flex items-center justify-center" style="background:' + accent + '14;border-color:' + accent + '33;">';
      profileHtml += getDriverIcon(driverName, 64);
      profileHtml += "</div>";
      profileHtml += '<div class="min-w-0 space-y-2">';
      profileHtml +=
        '<h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--ap-primary)]">' +
        escapeHtml(driver.name) +
        "</h2>";
      profileHtml +=
        '<p class="text-base text-[var(--ap-secondary)]"><span class="font-semibold text-[var(--ap-primary)]">Core fear:</span> ' +
        escapeHtml(driver.coreFear) +
        "</p>";
      profileHtml +=
        '<p class="' +
        summaryCopyClass +
        '">' +
        escapeHtml(driver.tagline) +
        "</p>";
      profileHtml += '</div></div>';
      profileHtml +=
        '<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider w-fit" style="background:' +
        accent +
        '14;color:' +
        accent +
        ';border:1px solid ' +
        accent +
        '33;">Pattern strength: ' +
        evaluation.topDriverScore +
        ' / ' +
        driver.maxPossible +
        "</span>";
      profileHtml += "</div>";
      profileHtml +=
        '<blockquote class="rounded-2xl px-4 py-4 text-xl sm:text-2xl leading-tight font-semibold text-[var(--ap-primary)]" style="background:' +
        accent +
        '14;border-left:2px solid ' +
        accent +
        ';">&quot;' +
        escapeHtml(driver.coreBelief) +
        "&quot;</blockquote>";
      profileHtml +=
        '<p class="' +
        bodyCopyClass +
        '">' +
        escapeHtml(driver.description) +
        "</p>";
      [
        ["How This Shows Up in Your Scores", driver.mechanism],
        ["What This Is Costing You", driver.whatItCosts],
        ["The Way Out", driver.theWayOut],
      ].forEach(function (section) {
        profileHtml +=
          '<details class="driver-details rounded-2xl border border-[var(--ap-border)] group" style="background:' +
          surface +
          ';">';
        profileHtml +=
          '<summary class="' +
          detailsTitleClass +
          '">' +
          "<span>" +
          escapeHtml(section[0]) +
          '</span><i data-lucide="chevron-down" class="driver-chevron w-4 h-4 shrink-0 transition-transform duration-200"></i></summary>';
        profileHtml +=
          '<div class="' +
          detailsBodyClass +
          '">' +
          escapeHtml(section[1]) +
          "</div></details>";
      });
      profileHtml += '<div class="space-y-4 border-t border-[var(--ap-border)]/70 pt-4">';
      profileHtml +=
        '<p class="' +
        noteCopyClass +
        '">' +
        escapeHtml(DRIVER_NOTE) +
        "</p>";
      profileHtml +=
        '<a href="' +
        libraryHref +
        '" class="driver-library-link inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-colors" data-driver-library-link="1" style="color:' +
        accent +
        '">Learn more about all driver patterns &gt;</a>';
      profileHtml += '</div>';
      if (secondaryDriverName) {
        var secondaryDriver = DRIVER_CONTENT[secondaryDriverName];
        var secondaryAccent = DRIVER_ACCENT_COLORS[secondaryDriverName] || accent;
        profileHtml += '<div class="space-y-3 border-t border-[var(--ap-border)]/70 pt-5">';
        profileHtml +=
          '<p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ap-muted)]">Secondary Pattern</p>';
        profileHtml += '<div class="flex items-start gap-3">';
        profileHtml += '<div class="flex-shrink-0 w-10 h-10 rounded-xl border flex items-center justify-center" style="background:' + secondaryAccent + '14;border-color:' + secondaryAccent + '33;">';
        profileHtml += getDriverIcon(secondaryDriverName, 40);
        profileHtml += "</div>";
        profileHtml += '<div class="min-w-0 flex-1 space-y-2">';
        profileHtml +=
          '<h3 class="text-lg font-semibold text-[var(--ap-primary)]">' +
          escapeHtml(secondaryDriver.name) +
          "</h3>";
        profileHtml +=
          '<p class="text-base italic text-[var(--ap-secondary)]">&quot;' +
          escapeHtml(secondaryDriver.coreBelief) +
          "&quot;</p>";
        profileHtml +=
          '<p class="text-base text-[var(--ap-secondary)] leading-relaxed">' +
          escapeHtml(secondaryDriver.tagline) +
          "</p>";
        profileHtml +=
          '<a href="' +
          libraryHref +
          '" class="driver-library-link inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-colors" data-driver-library-link="1" style="color:' +
          secondaryAccent +
          '">Learn more about all driver patterns &gt;</a>';
        profileHtml += "</div></div></div>";
      }
      profileHtml += "</div>";
      dashboardExpandedHtml += '<div class="space-y-5">';
      dashboardExpandedHtml +=
        '<blockquote class="rounded-2xl px-4 py-4 text-xl sm:text-2xl leading-tight font-semibold text-[var(--ap-primary)]" style="background:' +
        accent +
        '14;border-left:2px solid ' +
        accent +
        ';">&quot;' +
        escapeHtml(driver.coreBelief) +
        "&quot;</blockquote>";
      dashboardExpandedHtml +=
        '<p class="' +
        bodyCopyClass +
        '">' +
        escapeHtml(driver.description) +
        "</p>";
      [
        ["How This Shows Up in Your Scores", driver.mechanism],
        ["What This Is Costing You", driver.whatItCosts],
        ["The Way Out", driver.theWayOut],
      ].forEach(function (section) {
        dashboardExpandedHtml +=
          '<details class="driver-details rounded-2xl border border-[var(--ap-border)] group" style="background:' +
          surface +
          ';">';
        dashboardExpandedHtml +=
          '<summary class="' +
          detailsTitleClass +
          '">' +
          "<span>" +
          escapeHtml(section[0]) +
          '</span><i data-lucide="chevron-down" class="driver-chevron w-4 h-4 shrink-0 transition-transform duration-200"></i></summary>';
        dashboardExpandedHtml +=
          '<div class="' +
          detailsBodyClass +
          '">' +
          escapeHtml(section[1]) +
          "</div></details>";
      });
      dashboardExpandedHtml +=
        '<p class="' +
        noteCopyClass +
        '">' +
        escapeHtml(DRIVER_NOTE) +
        "</p>";
      dashboardExpandedHtml += "</div>";
    } else {
      profileHtml += '<div class="space-y-4">';
      profileHtml +=
        '<h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--ap-primary)]">' +
        escapeHtml(fallbackContent.heading) +
        "</h2>";
      profileHtml +=
        '<p class="' +
        bodyCopyClass +
        '">' +
        escapeHtml(fallbackContent.text) +
        "</p>";
      profileHtml +=
        '<p class="' +
        noteCopyClass +
        '">' +
        escapeHtml(DRIVER_NOTE) +
        "</p>";
      if ((evaluation.driverFallbackType || "standard") === "standard") {
        profileHtml +=
          '<a href="' +
          libraryHref +
          '" class="driver-library-link inline-flex items-center gap-2 text-sm font-semibold text-[var(--ap-accent)] hover:opacity-80 transition-colors" data-driver-library-link="1">Explore all driver patterns in the Driver Library &gt;</a>';
      }
      profileHtml += "</div>";
      dashboardExpandedHtml += '<div class="space-y-4">';
      dashboardExpandedHtml +=
        '<p class="' +
        bodyCopyClass +
        '">' +
        escapeHtml(fallbackContent.text) +
        "</p>";
      dashboardExpandedHtml +=
        '<p class="' +
        noteCopyClass +
        '">' +
        escapeHtml(DRIVER_NOTE) +
        "</p>";
      dashboardExpandedHtml += "</div>";
    }
    profileHtml += "</div>";
    if (useCollapsedDashboard) {
      html += '<div class="p-6 sm:p-8 relative space-y-5">';
      if (driversAreCoEqual) {
        html += '<p class="' + noteCopyClass + ' mt-2">' + escapeHtml(DRIVER_CO_EQUAL_EXPLAINER) + '</p>';
        html += '<p class="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--ap-muted)] mt-3">Your Primary Patterns</p>';
        html += '<div class="grid grid-cols-1 gap-5 mt-4">';
        [
          { key: driverName, score: evaluation.topDriverScore },
          { key: secondaryDriverName, score: evaluation.secondDriverScore },
        ].forEach(function (row) {
          var dk = row.key;
          var dPrev = DRIVER_CONTENT[dk];
          var acPrev = DRIVER_ACCENT_COLORS[dk] || accent;
          html +=
            '<div class="rounded-2xl border border-[var(--ap-border)] p-4 sm:p-5 space-y-3" style="border-left:4px solid ' +
            acPrev +
            ';">';
          html += '<div class="flex items-center gap-2.5">';
          html +=
            '<span class="inline-flex items-center justify-center w-8 h-8 rounded-xl border shrink-0" style="background:' +
            acPrev +
            '14;border-color:' +
            acPrev +
            '33;">' +
            getDriverIcon(dk, 28) +
            "</span>";
          html +=
            '<h2 class="text-xl sm:text-2xl font-extrabold text-[var(--ap-primary)]">' +
            escapeHtml(dPrev.name) +
            "</h2>";
          html += "</div>";
          html +=
            '<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider w-fit" style="background:' +
            acPrev +
            "14;color:" +
            acPrev +
            ";border:1px solid " +
            acPrev +
            '33;">Pattern strength: ' +
            row.score +
            " / " +
            dPrev.maxPossible +
            "</span>";
          html +=
            '<p class="text-base text-[var(--ap-secondary)]"><span class="font-semibold text-[var(--ap-primary)]">Core fear:</span> ' +
            escapeHtml(dPrev.coreFear) +
            "</p>";
          html += '<p class="' + summaryCopyClass + '">' + escapeHtml(dPrev.tagline) + "</p>";
          html += "</div>";
        });
        html += "</div>";
      } else {
        html += '<div class="space-y-2">';
        if (driverName) {
          html += '<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">';
          html += '<div class="flex items-start gap-4 sm:gap-6">';
          html +=
            '<span class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-xl shrink-0" style="background:' +
            accent +
            '20;">' +
            '<span class="w-10 h-10 sm:w-12 sm:h-12" style="color:' +
            accent +
            ';">' +
            getDriverIcon(driverName, 48) +
            "</span>" +
            "</span>";
          html += '<div class="min-w-0 flex-1">';
          html += '<p class="text-[10px] font-semibold uppercase tracking-[0.22em] mb-1" style="color:' + accent + '">Your Primary Driver</p>';
          html +=
            '<h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--ap-primary)] mb-2">' +
            escapeHtml(previewTitle) +
            "</h2>";
          html += '<p class="' + summaryCopyClass + '">' + escapeHtml(previewTagline || "") + "</p>";
          html += "</div></div>";
          html +=
            '<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider w-fit shrink-0" style="background:' +
            accent +
            "14;color:" +
            accent +
            ";border:1px solid " +
            accent +
            '33;">Pattern strength: ' +
            evaluation.topDriverScore +
            " / " +
            DRIVER_CONTENT[driverName].maxPossible +
            "</span>";
          html += "</div>";
        } else {
          html +=
            '<h2 class="text-2xl sm:text-3xl font-extrabold text-[var(--ap-primary)]">' +
            escapeHtml(previewTitle) +
            "</h2>";
        }
        if (driverName) {
          html +=
            '<p class="text-base text-[var(--ap-secondary)]"><span class="font-semibold text-[var(--ap-primary)]">Core fear:</span> ' +
            escapeHtml(DRIVER_CONTENT[driverName].coreFear) +
            "</p>";
        }
        if (!driverName && previewTagline) {
          html += '<p class="' + summaryCopyClass + '">' + escapeHtml(previewTagline) + "</p>";
        }
        html += "</div>";
      }
      html += '<div class="space-y-4">';
      html += '<details class="driver-profile-details group">';
      html += '<summary class="cursor-pointer inline-flex items-center gap-2 text-[15px] font-semibold text-[var(--ap-primary)] hover:text-[var(--ap-accent)] transition-colors list-none [&::-webkit-details-marker]:hidden">' + dashboardToggleLabel + ' <i data-lucide="chevron-down" class="driver-profile-chevron w-4 h-4 shrink-0 transition-transform duration-200"></i></summary>';
      html += '<div class="mt-4">' + dashboardExpandedHtml + '</div>';
      html += '</details>';
      html += '<div class="pt-4 border-t border-[var(--ap-border)]/70">';
      html += '<a href="' + libraryHref + '" class="driver-library-link inline-flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-colors" data-driver-library-link="1" style="color:' + accent + '">' + (driverName ? 'Learn more about all driver patterns &gt;' : 'Explore all driver patterns &gt;') + '</a>';
      html += '</div></div></div>';
    } else {
      html += profileHtml;
    }
    if (context === "results" && !isAlignedMomentum && driverName) {
      html += buildMyPlanDriverInlineHtml(accent);
    }
    html += "</div></div>";
    return html;
  }

  var DRIVER_MAINTAINED_INTERPRETATIONS = {
    "The Achiever's Trap":
      "The Achiever's Trap is still running your operating system. Your identity remains fused with your output, and the pattern of sacrificing health, emotional wellbeing, and inner alignment for business performance hasn't broken. Whatever adjustments you made between assessments weren't enough to disrupt the core belief. The question to sit with: what would you be worth if you produced nothing for a month?",
    "The Protector":
      "The Protector is still in control. Your systems are strong and your relationships are still thin. The fortress you've built continues to keep people out while keeping you efficient but isolated. The control pattern hasn't loosened. Consider this: the safety you get from structure is real, but it's incomplete. What would it cost you to let one person see behind the wall?",
    "The Pleaser's Bind":
      "The Pleaser's Bind is still active. You're still overriding your own needs to manage other people's comfort, and your execution and strategy continue to suffer because other people's priorities keep winning. The people-pleasing pattern is persistent because it feels like love. It's not. It's a transaction. What would happen if you said no to the next three requests that aren't aligned with your priorities?",
    "The Escape Artist":
      "The Escape Artist is still running. You're still using productivity to avoid facing something uncomfortable, and your emotional health, family presence, and inner alignment continue to pay the price. The avoidance pattern persists because what you're running from still feels too big to face. It isn't. But it won't get smaller with more distance.",
    "The Perfectionist's Prison":
      "The Perfectionist's Prison still has you locked up. You still know what to do and still can't seem to do it. Execution remains low despite high capability and high desire. The fear of judgment or failure that's blocking your output hasn't been addressed. Every week this pattern continues is a week of stranded potential. The prison door isn't locked from the outside.",
    "The Imposter Loop":
      "The Imposter Loop is still cycling. You still suspect you don't deserve what you're building, and that belief is still undermining your business alignment, your self-trust, and your willingness to be fully seen. The imposter pattern is one of the most stubborn because the evidence against it (your actual results) gets dismissed while the evidence for it (your internal doubt) gets amplified. The loop breaks when you stop waiting to feel ready and start building something you're proud to own.",
    "The Martyr Complex":
      "The Martyr Complex is still operating. You're still sacrificing your health and inner life for the people and causes you serve. Your contribution and family scores remain strong while your body and alignment continue to deteriorate. The belief that your needs come last hasn't shifted. The generosity is genuine but the cost is unsustainable. You cannot pour from an empty vessel, and the vessel is getting emptier.",
    "The Fog":
      "The Fog hasn't lifted. You still can't commit to a clear direction, your importance ratings are still flat, and your vision and alignment scores remain low. Another assessment period has passed in exploration mode. The fog feels like confusion but it functions as protection. At some point, the cost of not choosing exceeds the cost of choosing wrong. You may have already passed that point.",
    "The Scattered Mind":
      "The Scattered Mind remains your primary pattern. Your attention continues to fragment in ways that block sustained execution despite your alignment and emotional stability. This pattern is persistent. If the approaches you've tried haven't shifted it, consider what's missing: Is your environment still full of capture points? Do you have external accountability for focus blocks? Have you explored whether ADHD support might help? The path forward is structural. Build the scaffolding your mind needs to do its work.",
    "The Builder's Gap":
      "The Builder's Gap is still the pattern. You still have a strong personal foundation and genuine relational wealth, but the business infrastructure still hasn't been built. Another assessment period has passed and the strategy, execution, operations, or some combination remain underdeveloped. The belief that building a business machine somehow threatens your authenticity hasn't been addressed. Every month this gap persists is a month your gifts stay stranded at a fraction of their potential reach. The people who need what you offer are waiting for you to build the vehicle that delivers it.",
  };

  function getTransitionSummary(previousDriver, currentDriver, previousState, currentState) {
    var resolvedPreviousState = previousState || getDriverState(previousDriver || null, null);
    var resolvedCurrentState = currentState || getDriverState(currentDriver || null, null);
    var previousDysfunctionDriver =
      previousDriver && DRIVER_CONTENT[previousDriver] ? previousDriver : null;
    var currentDysfunctionDriver =
      currentDriver && DRIVER_CONTENT[currentDriver] ? currentDriver : null;

    if (
      resolvedPreviousState === "aligned_momentum" &&
      resolvedCurrentState === "aligned_momentum"
    ) {
      return {
        heading: "Alignment Sustained",
        subheading: "Aligned Momentum continues",
        previousBelief: null,
        currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
        body:
          "Your internal operating system continues to work with your goals rather than against them. No dysfunction driver was detected in either your previous or current assessment. Sustaining this across multiple assessment periods is rare and reflects genuine, embedded alignment rather than a good month. The practices and boundaries producing this state are working. Continue to audit honestly, protect your margins, and treat this alignment as something that requires ongoing maintenance rather than a permanent achievement.",
        direction: "up",
      };
    }

    if (
      resolvedPreviousState === "dysfunction_driver" &&
      previousDysfunctionDriver &&
      resolvedCurrentState === "aligned_momentum"
    ) {
      if (previousDysfunctionDriver === "The Scattered Mind") {
        return {
          heading: "A Significant Shift",
          subheading: "The Scattered Mind → Aligned Momentum",
          previousBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
          currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
          body:
            "Your previous assessment identified The Scattered Mind, attention that fragmented despite your alignment and emotional stability. That pattern is no longer dominant. Your scores now reflect broad strength without a detectable dysfunction driver. This is a meaningful transition because scattered attention is persistent and rarely resolves on its own. Whatever changed, environment redesign, new rhythms and systems, support for ADHD, or simply building capacity over time, it's working. Your mind is now serving your values instead of scattering away from them. Protect the structures that made this possible.",
          direction: "up",
        };
      }

      return {
        heading: "A Significant Shift",
        subheading: previousDysfunctionDriver + " → " + ALIGNED_MOMENTUM_NAME,
        previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
        currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
        body:
          "Your previous assessment identified " +
          previousDysfunctionDriver +
          " as the internal pattern driving your results. That pattern is no longer dominant. Your scores now reflect broad, genuine strength without a detectable dysfunction driver underneath them. This is one of the most meaningful transitions on this assessment. The belief that was working against you, '" +
          DRIVER_CONTENT[previousDysfunctionDriver].coreBelief +
          ",' has been addressed enough that it's no longer shaping your results. What's fueling your pattern now is alignment itself. Protect it.",
        direction: "up",
      };
    }

    if (
      resolvedPreviousState === "aligned_momentum" &&
      resolvedCurrentState === "dysfunction_driver" &&
      currentDysfunctionDriver
    ) {
      return {
        heading: "A Pattern Has Emerged",
        subheading: ALIGNED_MOMENTUM_NAME + " → " + currentDysfunctionDriver,
        previousBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
        currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
        body:
          "Your previous assessment showed Aligned Momentum, meaning no dysfunction driver was detected. This time, " +
          currentDysfunctionDriver +
          " has emerged. The core belief driving your current pattern is: '" +
          DRIVER_CONTENT[currentDysfunctionDriver].coreBelief +
          ".' This doesn't erase the alignment you had. It means something shifted, whether through increased demands, a life change, or a reactivation of an old pattern, and an internal driver is now influencing your results. Read the full driver description and pay attention to the 'Way Out' section. You've been aligned before. You know what it feels like. The path back is familiar.",
        direction: "down",
      };
    }

    if (resolvedPreviousState === "no_driver" && resolvedCurrentState === "aligned_momentum") {
      return {
        heading: "Alignment Clarified",
        subheading: "Aligned Momentum identified",
        previousBelief: null,
        currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
        body:
          "Your previous assessment couldn't identify a clear pattern. This time, your scores are strong enough and clean enough to confirm Aligned Momentum. Your internal operating system is working with your goals. This clarity likely reflects genuine improvement in the areas that were previously ambiguous.",
        direction: "up",
      };
    }

    if (resolvedPreviousState === "aligned_momentum" && resolvedCurrentState === "no_driver") {
      return {
        heading: "Alignment Uncertain",
        subheading: "Aligned Momentum no longer confirmed",
        previousBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
        currentBelief: null,
        body:
          "Your previous assessment showed Aligned Momentum, but your current scores don't meet the criteria to confirm it. No dysfunction driver was detected either, which means you're in an ambiguous zone. This often happens during transitions: increased demands, life changes, or natural fluctuations. Your scores aren't in crisis. They're just not as cleanly strong as they were. Focus on the domains that dipped and rebuild from there.",
        direction: "same",
      };
    }

    if (previousDysfunctionDriver && currentDysfunctionDriver) {
      if (
        previousDysfunctionDriver === "The Scattered Mind" &&
        currentDysfunctionDriver === "The Scattered Mind"
      ) {
        return {
          heading: "Pattern Continues",
          subheading: "The Scattered Mind persists",
          previousBelief: null,
          currentBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
          body: DRIVER_MAINTAINED_INTERPRETATIONS["The Scattered Mind"],
          direction: "same",
        };
      }
      if (
        previousDysfunctionDriver !== "The Scattered Mind" &&
        currentDysfunctionDriver === "The Scattered Mind"
      ) {
        return {
          heading: "A Different Pattern Has Emerged",
          subheading: previousDysfunctionDriver + " → The Scattered Mind",
          previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
          currentBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
          body:
            "Your previous assessment identified " +
            previousDysfunctionDriver +
            " as your primary pattern. This time, The Scattered Mind has emerged. This shift sometimes happens when other internal patterns are addressed and an underlying attention pattern becomes more visible. The core belief now shaping your results is: 'I'll be able to focus when the conditions are right.' Read the full driver description. The Scattered Mind is addressed through environment design and structural support, not insight work.",
          direction: "same",
        };
      }
      if (
        previousDysfunctionDriver === "The Scattered Mind" &&
        currentDysfunctionDriver !== "The Scattered Mind"
      ) {
        return {
          heading: "Your Pattern Has Shifted",
          subheading: "The Scattered Mind → " + currentDysfunctionDriver,
          previousBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
          currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
          body:
            "Your previous assessment showed The Scattered Mind as your primary pattern. This time, " +
            currentDysfunctionDriver +
            " has emerged. This could mean your attention capacity has improved and a different pattern is now more visible, or it could mean conditions have changed. Read your new driver description carefully.",
          direction: "same",
        };
      }
      if (previousDysfunctionDriver === currentDysfunctionDriver) {
        return {
          heading: "Your Internal Pattern Is Consistent",
          subheading: "Still driven by " + currentDysfunctionDriver,
          previousBelief: null,
          currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
          body: DRIVER_MAINTAINED_INTERPRETATIONS[currentDysfunctionDriver],
          direction: "same",
        };
      }
      return {
        heading: "Your Internal Pattern Has Shifted",
        subheading: previousDysfunctionDriver + " to " + currentDysfunctionDriver,
        previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
        currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
        body:
          "Your internal driver has shifted from " +
          previousDysfunctionDriver +
          " to " +
          currentDysfunctionDriver +
          ".\n\nPreviously, the pattern underneath your scores was rooted in the belief: '" +
          DRIVER_CONTENT[previousDysfunctionDriver].coreBelief +
          "'\n\nNow, the data suggests a different pattern is primary, rooted in: '" +
          DRIVER_CONTENT[currentDysfunctionDriver].coreBelief +
          "'\n\nThis shift can mean the original pattern was successfully addressed and a deeper or different pattern has surfaced, which is common and healthy in coaching work. It can also mean life circumstances changed in a way that activated a different coping strategy. Read your new driver description carefully. It reveals what's most likely driving your current scores and where the coaching work should focus next.",
        direction: "same",
      };
    }
    if (!previousDysfunctionDriver && currentDysfunctionDriver) {
      return {
        heading: "Internal Pattern Identified",
        subheading: "Your likely driver: " + currentDysfunctionDriver,
        previousBelief: null,
        currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
        body:
          "Your previous assessment didn't produce a strong enough signal to identify a driver. This time, the pattern is clearer. Read the full driver description in your results to understand what's likely underneath your scores.",
        direction: "same",
      };
    }
    if (previousDysfunctionDriver && !currentDysfunctionDriver) {
      return {
        heading: "Internal Pattern Unclear",
        subheading: "Previously: " + previousDysfunctionDriver,
        previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
        currentBelief: null,
        body:
          "Your previous assessment identified a clear internal driver, but your current scores don't map strongly to any single pattern. This can mean the old pattern is dissolving, which is progress, that you're in a transitional period, or that multiple drivers are now competing. Your domain scores and priority matrix will give you more specific direction.",
        direction: "same",
      };
    }
    return {
      heading: "Internal Pattern Unclear",
      subheading: "No clear driver identified",
      previousBelief: null,
      currentBelief: null,
      body:
        "Neither of your most recent assessments produced a strong enough signal to identify a single internal driver. Use your domain scores, archetype, and priority matrix to see where the clearest action is available right now.",
      direction: "same",
    };
  }

  window.VAPI_DRIVERS = {
    ALIGNED_MOMENTUM_NAME: ALIGNED_MOMENTUM_NAME,
    ALIGNED_MOMENTUM_CONTENT: ALIGNED_MOMENTUM_CONTENT,
    DRIVER_ACCENT_COLORS: DRIVER_ACCENT_COLORS,
    DRIVER_CONTENT: DRIVER_CONTENT,
    DRIVER_FALLBACK: DRIVER_FALLBACK,
    DRIVER_STANDARD_FALLBACK: DRIVER_STANDARD_FALLBACK,
    DRIVER_NOTE: DRIVER_NOTE,
    DRIVER_MAINTAINED_INTERPRETATIONS: DRIVER_MAINTAINED_INTERPRETATIONS,
    ensureEvaluation: ensureEvaluation,
    buildResultsSection: buildResultsSection,
    getIcon: getDriverIcon,
    getDriverLibraryHref: getDriverLibraryHref,
    getDriverFallbackContent: getDriverFallbackContent,
    getDriverState: getDriverState,
    getTransitionSummary: getTransitionSummary,
  };
})();
