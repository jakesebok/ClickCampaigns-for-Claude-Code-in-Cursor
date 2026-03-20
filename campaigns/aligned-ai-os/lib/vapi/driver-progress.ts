import {
  ALIGNED_MOMENTUM_CONTENT,
  ALIGNED_MOMENTUM_NAME,
  DRIVER_CONTENT,
  type VapiAssignedDriverName,
  type VapiDriverState,
  type VapiDriverName,
} from "./drivers";

export const DRIVER_MAINTAINED_INTERPRETATIONS: Record<
  VapiDriverName,
  string
> = {
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

export type DriverTransitionSummary = {
  heading: string;
  subheading: string;
  previousBelief: string | null;
  currentBelief: string | null;
  body: string;
  direction: "up" | "down" | "same";
};

export function getDriverTransitionSummary(
  previousState: VapiDriverState,
  currentState: VapiDriverState,
  previousDriver: VapiAssignedDriverName | null,
  currentDriver: VapiAssignedDriverName | null
): DriverTransitionSummary {
  const previousDysfunctionDriver =
    previousDriver && previousDriver in DRIVER_CONTENT
      ? (previousDriver as VapiDriverName)
      : null;
  const currentDysfunctionDriver =
    currentDriver && currentDriver in DRIVER_CONTENT
      ? (currentDriver as VapiDriverName)
      : null;

  if (
    previousState === "aligned_momentum" &&
    currentState === "aligned_momentum"
  ) {
    return {
      heading: "Alignment Sustained",
      subheading: "Aligned Momentum continues",
      previousBelief: null,
      currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      body: "Your internal operating system continues to work with your goals rather than against them. No dysfunction driver was detected in either your previous or current assessment. Sustaining this across multiple assessment periods is rare and reflects genuine, embedded alignment rather than a good month. The practices and boundaries producing this state are working. Continue to audit honestly, protect your margins, and treat this alignment as something that requires ongoing maintenance rather than a permanent achievement.",
      direction: "up",
    };
  }

  if (
    previousState === "dysfunction_driver" &&
    previousDysfunctionDriver &&
    currentState === "aligned_momentum"
  ) {
    if (previousDysfunctionDriver === "The Scattered Mind") {
      return {
        heading: "A Significant Shift",
        subheading: "The Scattered Mind → Aligned Momentum",
        previousBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
        currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
        body: "Your previous assessment identified The Scattered Mind, attention that fragmented despite your alignment and emotional stability. That pattern is no longer dominant. Your scores now reflect broad strength without a detectable dysfunction driver. This is a meaningful transition because scattered attention is persistent and rarely resolves on its own. Whatever changed, environment redesign, new rhythms and systems, support for ADHD, or simply building capacity over time, it's working. Your mind is now serving your values instead of scattering away from them. Protect the structures that made this possible.",
        direction: "up",
      };
    }

    return {
      heading: "A Significant Shift",
      subheading: `${previousDysfunctionDriver} → ${ALIGNED_MOMENTUM_NAME}`,
      previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
      currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      body: `Your previous assessment identified ${previousDysfunctionDriver} as the internal pattern driving your results. That pattern is no longer dominant. Your scores now reflect broad, genuine strength without a detectable dysfunction driver underneath them. This is one of the most meaningful transitions on this assessment. The belief that was working against you, '${DRIVER_CONTENT[previousDysfunctionDriver].coreBelief},' has been addressed enough that it's no longer shaping your results. What's fueling your pattern now is alignment itself. Protect it.`,
      direction: "up",
    };
  }

  if (
    previousState === "aligned_momentum" &&
    currentState === "dysfunction_driver" &&
    currentDysfunctionDriver
  ) {
    return {
      heading: "A Pattern Has Emerged",
      subheading: `${ALIGNED_MOMENTUM_NAME} → ${currentDysfunctionDriver}`,
      previousBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
      body: `Your previous assessment showed Aligned Momentum, meaning no dysfunction driver was detected. This time, ${currentDysfunctionDriver} has emerged. The core belief driving your current pattern is: '${DRIVER_CONTENT[currentDysfunctionDriver].coreBelief}.' This doesn't erase the alignment you had. It means something shifted, whether through increased demands, a life change, or a reactivation of an old pattern, and an internal driver is now influencing your results. Read the full driver description and pay attention to the 'Way Out' section. You've been aligned before. You know what it feels like. The path back is familiar.`,
      direction: "down",
    };
  }

  if (previousState === "no_driver" && currentState === "aligned_momentum") {
    return {
      heading: "Alignment Clarified",
      subheading: "Aligned Momentum identified",
      previousBelief: null,
      currentBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      body: "Your previous assessment couldn't identify a clear pattern. This time, your scores are strong enough and clean enough to confirm Aligned Momentum. Your internal operating system is working with your goals. This clarity likely reflects genuine improvement in the areas that were previously ambiguous.",
      direction: "up",
    };
  }

  if (previousState === "aligned_momentum" && currentState === "no_driver") {
    return {
      heading: "Alignment Uncertain",
      subheading: "Aligned Momentum no longer confirmed",
      previousBelief: ALIGNED_MOMENTUM_CONTENT.coreState,
      currentBelief: null,
      body: "Your previous assessment showed Aligned Momentum, but your current scores don't meet the criteria to confirm it. No dysfunction driver was detected either, which means you're in an ambiguous zone. This often happens during transitions: increased demands, life changes, or natural fluctuations. Your scores aren't in crisis. They're just not as cleanly strong as they were. Focus on the domains that dipped and rebuild from there.",
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
        subheading: `${previousDysfunctionDriver} → The Scattered Mind`,
        previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
        currentBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
        body: "Your previous assessment identified " +
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
        subheading: `The Scattered Mind → ${currentDysfunctionDriver}`,
        previousBelief: DRIVER_CONTENT["The Scattered Mind"].coreBelief,
        currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
        body: `Your previous assessment showed The Scattered Mind as your primary pattern. This time, ${currentDysfunctionDriver} has emerged. This could mean your attention capacity has improved and a different pattern is now more visible, or it could mean conditions have changed. Read your new driver description carefully.`,
        direction: "same",
      };
    }

    if (previousDysfunctionDriver === currentDysfunctionDriver) {
      return {
        heading: "Your Internal Pattern Is Consistent",
        subheading: `Still driven by ${currentDysfunctionDriver}`,
        previousBelief: null,
        currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
        body: DRIVER_MAINTAINED_INTERPRETATIONS[currentDysfunctionDriver],
        direction: "same",
      };
    }

    return {
      heading: "Your Internal Pattern Has Shifted",
      subheading: `${previousDysfunctionDriver} to ${currentDysfunctionDriver}`,
      previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
      currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
      body: `Your internal driver has shifted from ${previousDysfunctionDriver} to ${currentDysfunctionDriver}.\n\nPreviously, the pattern underneath your scores was rooted in the belief: '${DRIVER_CONTENT[previousDysfunctionDriver].coreBelief}'\n\nNow, the data suggests a different pattern is primary, rooted in: '${DRIVER_CONTENT[currentDysfunctionDriver].coreBelief}'\n\nThis shift can mean the original pattern was successfully addressed and a deeper or different pattern has surfaced, which is common and healthy in coaching work. It can also mean life circumstances changed in a way that activated a different coping strategy. Read your new driver description carefully. It reveals what's most likely driving your current scores and where the coaching work should focus next.`,
      direction: "same",
    };
  }

  if (!previousDysfunctionDriver && currentDysfunctionDriver) {
    return {
      heading: "Internal Pattern Identified",
      subheading: `Your likely driver: ${currentDysfunctionDriver}`,
      previousBelief: null,
      currentBelief: DRIVER_CONTENT[currentDysfunctionDriver].coreBelief,
      body: "Your previous assessment didn't produce a strong enough signal to identify a driver. This time, the pattern is clearer. Read the full driver description in your results to understand what's likely underneath your scores.",
      direction: "same",
    };
  }

  if (previousDysfunctionDriver && !currentDysfunctionDriver) {
    return {
      heading: "Internal Pattern Unclear",
      subheading: `Previously: ${previousDysfunctionDriver}`,
      previousBelief: DRIVER_CONTENT[previousDysfunctionDriver].coreBelief,
      currentBelief: null,
      body: "Your previous assessment identified a clear internal driver, but your current scores don't map strongly to any single pattern. This can mean the old pattern is dissolving, which is progress, that you're in a transitional period, or that multiple drivers are now competing. Your domain scores and priority matrix will give you more specific direction.",
      direction: "same",
    };
  }

  return {
    heading: "Internal Pattern Unclear",
    subheading: "No clear driver identified",
    previousBelief: null,
    currentBelief: null,
    body: "Neither of your most recent assessments produced a strong enough signal to identify a single internal driver. Use your domain scores, archetype, and priority matrix to see where the clearest action is available right now.",
    direction: "same",
  };
}
