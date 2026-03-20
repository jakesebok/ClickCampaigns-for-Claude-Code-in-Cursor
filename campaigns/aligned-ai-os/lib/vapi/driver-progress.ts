import {
  DRIVER_CONTENT,
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
  "The Builder's Gap":
    "The Builder's Gap is still the pattern. You still have a strong personal foundation and genuine relational wealth, but the business infrastructure still hasn't been built. Another assessment period has passed and the strategy, execution, operations, or some combination remain underdeveloped. The belief that building a business machine somehow threatens your authenticity hasn't been addressed. Every month this gap persists is a month your gifts stay stranded at a fraction of their potential reach. The people who need what you offer are waiting for you to build the vehicle that delivers it.",
};

export type DriverTransitionSummary = {
  heading: string;
  subheading: string;
  previousBelief: string | null;
  currentBelief: string | null;
  body: string;
};

export function getDriverTransitionSummary(
  previousDriver: VapiDriverName | null,
  currentDriver: VapiDriverName | null
): DriverTransitionSummary {
  if (previousDriver && currentDriver) {
    if (previousDriver === currentDriver) {
      return {
        heading: "Your Internal Pattern Is Consistent",
        subheading: `Still driven by ${currentDriver}`,
        previousBelief: null,
        currentBelief: DRIVER_CONTENT[currentDriver].coreBelief,
        body: DRIVER_MAINTAINED_INTERPRETATIONS[currentDriver],
      };
    }

    return {
      heading: "Your Internal Pattern Has Shifted",
      subheading: `${previousDriver} to ${currentDriver}`,
      previousBelief: DRIVER_CONTENT[previousDriver].coreBelief,
      currentBelief: DRIVER_CONTENT[currentDriver].coreBelief,
      body: `Your internal driver has shifted from ${previousDriver} to ${currentDriver}.\n\nPreviously, the pattern underneath your scores was rooted in the belief: '${DRIVER_CONTENT[previousDriver].coreBelief}'\n\nNow, the data suggests a different pattern is primary, rooted in: '${DRIVER_CONTENT[currentDriver].coreBelief}'\n\nThis shift can mean the original pattern was successfully addressed and a deeper or different pattern has surfaced, which is common and healthy in coaching work. It can also mean life circumstances changed in a way that activated a different coping strategy. Read your new driver description carefully. It reveals what's most likely driving your current scores and where the coaching work should focus next.`,
    };
  }

  if (!previousDriver && currentDriver) {
    return {
      heading: "Internal Pattern Identified",
      subheading: `Your likely driver: ${currentDriver}`,
      previousBelief: null,
      currentBelief: DRIVER_CONTENT[currentDriver].coreBelief,
      body: "Your previous assessment didn't produce a strong enough signal to identify a driver. This time, the pattern is clearer. Read the full driver description in your results to understand what's likely underneath your scores.",
    };
  }

  if (previousDriver && !currentDriver) {
    return {
      heading: "Internal Pattern Unclear",
      subheading: `Previously: ${previousDriver}`,
      previousBelief: DRIVER_CONTENT[previousDriver].coreBelief,
      currentBelief: null,
      body: "Your previous assessment identified a clear internal driver, but your current scores don't map strongly to any single pattern. This can mean the old pattern is dissolving, which is progress, that you're in a transitional period, or that multiple drivers are now competing. Your domain scores and priority matrix will give you more specific direction.",
    };
  }

  return {
    heading: "Internal Pattern Unclear",
    subheading: "No clear driver identified",
    previousBelief: null,
    currentBelief: null,
    body: "Neither of your most recent assessments produced a strong enough signal to identify a single internal driver. Use your domain scores, archetype, and priority matrix to see where the clearest action is available right now.",
  };
}
