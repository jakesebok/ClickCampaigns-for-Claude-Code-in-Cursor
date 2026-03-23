/**
 * Level-calibrated openers (12 domains × 3 levels). Second person. No em dashes (U+2014).
 * Layer 1 replaces deep-dive whyMatters when present.
 */

/** @type {Record<string, Record<"high-performer"|"mid-level"|"rebuilding", string>>} */
export const OPENERS = {
  PH: {
    "high-performer": `You already run a credible physical baseline. The edge now is refinement, not starting over. Sleep debt, travel, or stress probably erode the last ten percent more than ignorance does. This sprint asks you to protect non negotiable recovery, tighten one nutrition default, and measure energy, not only output. You are not fixing a broken machine; you are calibrating a high performance one so it lasts the next decade.`,
    "mid-level": `Physical Health reads as functional but not reliable under pressure. You know what to do, yet consistency breaks when work or family load spikes. That pattern costs focus and mood more than you admit. This plan treats the body as infrastructure: small daily anchors, fewer heroic weeks followed by collapse. You are building repeatability, not a perfect transformation photo.`,
    rebuilding: `Your scores suggest Physical Health has slipped to a place that affects everything else. That is common after seasons of overwhelm, not a verdict on your discipline. Start with gentle structure: sleep window, walking, hydration, one meal upgrade you can keep. Stabilize before you optimize. This sprint is permission to rebuild without shame and without an all or nothing crash diet.`,
  },
  IA: {
    "high-performer": `Inner Alignment is strong enough that you sense misalignment quickly. The growth edge is subtle: fewer stories about what you should want, more honest naming of tradeoffs. You may be performing alignment for others while quietly resenting a choice. This sprint invites one courageous truth per week, voiced safely, so your calendar matches your values instead of your image.`,
    "mid-level": `You generally like who you are, yet parts of life feel slightly off script. Values live in your head more than in your weekly choices. That gap creates low grade fatigue. Use this month to connect one value to one repeated behavior: boundaries, creativity, family time, or rest. You are closing the distance between intention and how Tuesday actually goes.`,
    rebuilding: `Inner Alignment looks strained, which often means you have been carrying roles that are not yours anymore. You might feel numb, reactive, or harsh toward yourself. This plan prioritizes safety and honesty over peak performance. Small practices of self respect, not self attack, come first. You are allowed to pause the self improvement treadmill until you feel like yourself again.`,
  },
  ME: {
    "high-performer": `Mental and emotional health are assets for you, not emergencies. The refinement is regulation under speed: fewer spikes, cleaner recovery after conflict, and earlier repair when you go sharp. You probably help others process while skipping your own debrief. This sprint adds structured reflection and one proactive nervous system habit so your steadiness scales with your responsibilities.`,
    "mid-level": `You manage day to day, yet stress pools in the background. Sleep, irritability, or rumination may flare when stakes rise. You are not broken; you are under equipped for the load you carry. This month focuses on naming triggers, shortening the loop between stress and relief, and asking for support without dramatizing. Small emotional hygiene beats occasional heroic therapy marathons.`,
    rebuilding: `This area needs gentleness. You may feel overwhelmed, flat, or on edge more than you say out loud. Prioritize stabilization: sleep, movement, connection, professional help if needed. This sprint is not about grinding mindset hacks. It is about restoring baseline capacity so thinking clearly becomes possible again. One kind choice at a time is enough progress.`,
  },
  AF: {
    "high-performer": `Attention and Focus are competitive advantages already. The risk is over optimization: more systems, thinner margins for boredom, constant context switching disguised as productivity. This sprint sharpens one deep work block, protects it, and trims one low value feed. You are protecting depth, not proving hustle.`,
    "mid-level": `Focus comes in bursts but does not hold when notifications and obligations stack. You start strong mornings, then fragment. That taxes quality and increases errors. This plan builds one anchor routine, one shutdown ritual, and clearer priorities so your brain gets predictable cues. You are training attention like a muscle, not chasing perfect inbox zero.`,
    rebuilding: `Attention may feel scattered or foggy, which often tracks exhaustion or anxiety more than laziness. Lower the bar to winnable: shorter work sprints, single tab discipline, and reducing shame when you drift. This sprint is about proof of progress, not marathon focus sessions. Celebrate small wins so your nervous system learns focus can feel safe again.`,
  },
  RS: {
    "high-performer": `Relationship to Self is healthier than most, yet high performers sometimes negotiate away self respect for speed. Watch for inner criticism dressed as standards. This month, practice one boundary that protects your energy and one voice of encouragement you would give a friend. You are polishing self partnership, not fixing a fatal flaw.`,
    "mid-level": `You tolerate yourself, but warmth is inconsistent. Praise is rare, critique is loud. That imbalance leaks into decisions and relationships. This sprint adds compassionate accuracy: honest feedback without contempt, and one weekly ritual that reminds you you are on your own side. You are building inner allyship, not vanity.`,
    rebuilding: `The relationship with yourself may feel fragile or hostile right now. That deserves care, not another performance review. Reduce harsh self talk first, even if outcomes are imperfect. This plan uses tiny practices of self support and, when possible, trusted human mirroring. Healing here is slow and valid. You are not behind; you are beginning.`,
  },
  FA: {
    "high-performer": `Family life works more often than not, yet depth can thin when calendars win. You show up logistically while missing emotional presence. This sprint schedules protected connection, not just logistics threads. One meaningful conversation weekly, one playful moment, one clear expectation reset. You are upgrading intimacy, not fixing a crisis.`,
    "mid-level": `Family feels mixed: love present, tension recurring. Patterns repeat because needs stay unnamed. This month focuses on clarity and repair: one conversation template, one boundary, one appreciation habit. You are not aiming for perfect harmony, just less confusion and less resentment stored in silence.`,
    rebuilding: `Family may feel heavy, distant, or volatile. Safety comes before strategy. This plan emphasizes de escalation, predictable kindness, and professional support if conflict is high. Small stabilizing moves matter more than big speeches. You are allowed to move slowly while protecting everyone involved, including you.`,
  },
  CO: {
    "high-performer": `Community engagement is real but may lean transactional. You network well yet crave belonging. This sprint invests in one circle where you are not the brand, just a person. Depth beats reach. You are curating relationships that refill you, not only advance you.`,
    "mid-level": `You have contacts, fewer confidants. Loneliness in leadership is common here. Pick one community habit: a group, a volunteer block, a standing coffee. Consistency builds trust. This month is about showing up, not impressing. Connection is a practice, not a mood.`,
    rebuilding: `Community may feel thin or unsafe to re enter after burnout or moves. Start micro: one reply, one invite, one shared interest. Shame about isolation makes it worse; action dissolves it slowly. This sprint keeps steps small and repeatable so belonging can return without forcing performance.`,
  },
  WI: {
    "high-performer": `World and Impact already matter to you. The edge is focus: fewer scattered causes, one sharper thesis for your contribution. Impact fatigue is real. This sprint aligns one initiative with your strengths and caps new yeses. You are amplifying signal, not proving virtue.`,
    "mid-level": `You care about impact yet execution wavers when competing priorities hit. Guilt may substitute for strategy. This month connects one measurable outcome to one time block. You are building proof, not a manifesto. Small public wins beat private worry.`,
    rebuilding: `Purpose may feel distant or heavy. That is often depletion, not apathy. Restore capacity before you judge meaning. This plan uses gentle re engagement: one values note, one helpful act weekly, no hero narrative required. Impact returns when you have fuel.`,
  },
  VS: {
    "high-performer": `Vision and Strategy are clear enough that the risk is over planning. You may polish decks while avoiding one uncomfortable market truth. This sprint forces one decision with a deadline and one kill list for stale initiatives. You are executing the next chapter, not admiring the map.`,
    "mid-level": `Direction feels fuzzy or crowded with options. You pivot often, finish rarely. This month narrows: one north star metric, one quarterly bet, one weekly review. You are trading breadth for traction. Clarity is built through choices, not brainstorming.`,
    rebuilding: `The future may feel blank or scary. Start with survival clarity: cash, health, key relationships, next ninety days. Grand vision can wait. This sprint stacks modest plans you can keep. Confidence returns from kept promises, not inspiration alone.`,
  },
  EX: {
    "high-performer": `Execution is a strength; burnout is the shadow. You ship, then silently resent the cost. This sprint adds sustainable pace: delegation tests, batching, and one non negotiable recovery block. You are protecting throughput for years, not this quarter only.`,
    "mid-level": `You start strong, stall on follow through, or thrash between priorities. Systems are half built. This month picks one workflow to finish and one metric to own. You are closing loops, not collecting new ideas. Execution improves when friction drops.`,
    rebuilding: `Getting things done may feel impossible or overwhelming. Shrink the unit of work to embarrassingly small. One task per day completed counts. This plan rebuilds self trust through evidence, not pep talks. Momentum is repaired gently.`,
  },
  OH: {
    "high-performer": `Operational Health is solid; leverage hides in documentation, handoffs, and risk you tolerate because you are fast. This sprint audits one fragile process and hardens it. You are buying calm for the team and future you, not criticizing past hustle.`,
    "mid-level": `Operations kind of work until volume spikes, then chaos returns. Firefighting repeats. This month stabilizes one core process with a simple owner and checklist. You are reducing surprise, not building bureaucracy.`,
    rebuilding: `Things may feel chaotic behind the scenes. Start with visibility: list open loops, pick one fire to prevent weekly. This sprint favors boring fixes over clever hacks. Order returns in layers.`,
  },
  EC: {
    "high-performer": `Ecology, in the sense of your environment and long horizon sustainability, is on your radar. The edge is integration: green choices that stick under travel and growth pressure. This sprint picks one environmental habit and one financial or energy audit that aligns lifestyle with values without performance theater.`,
    "mid-level": `You care about sustainability yet convenience wins often. Guilt loops do not help. This month anchors one upgrade you can repeat: commute, food sourcing, waste, or home efficiency. Small honest upgrades beat perfect plans you abandon.`,
    rebuilding: `This domain may feel neglected or overwhelming. Start tiny: one change that lowers stress and footprint together, like declutter plus donate, or a simpler commute trial. This plan avoids moralizing. Progress is any step you maintain.`,
  },
};
