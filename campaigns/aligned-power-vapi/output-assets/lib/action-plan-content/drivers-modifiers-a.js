/** Driver modifiers: Achiever's Trap through Imposter Loop × 12 domains. Second person. No em dashes. */

const ACHIEVERS = {
  PH: `The Achiever's Trap turns your body into a scoreboard. You chase streaks, metrics, and punishment workouts while ignoring pain, sleep, and recovery. You prove worth through output, not health. This month, add one sustainability rule you will not break for a PR. Let rest be part of winning, not evidence you are slipping.`,
  IA: `Here the trap sounds like you must optimize your soul. You stack habits, journals, and frameworks until alignment becomes another performance review. You forget that being matters more than improving. Slow one ritual down until it feels human, not impressive. Let one value be chosen because it fits, not because it looks enlightened.`,
  ME: `You use mental toughness as a badge while emotions pile up unprocessed. You call it resilience when it is avoidance. Stress becomes something to endure, not something to address. Name one feeling weekly without fixing it immediately. Let support be strategic, not a sign you failed.`,
  AF: `Achievement mode makes you equate focus with constant motion. You multitask to feel productive, then crash. You measure hours busy, not outcomes moved. Pick one deep work block where achievement is defined as finishing one important thing, not clearing noise. Depth is not laziness.`,
  RS: `You grade yourself harshly to stay motivated. Rest feels like losing. Self kindness reads as weakness, so you push. That erodes trust with yourself. Practice one boundary that protects your energy without earning it through exhaustion. You are allowed to be good enough while growing.`,
  FA: `You show up for family as tasks completed, not presence offered. You compete for who sacrifices more. Love becomes another arena to win. Schedule connection without a productivity angle. Ask what people need emotionally, not only what you can solve.`,
  CO: `Networking replaces belonging. You collect contacts and compare status while feeling lonely. Community becomes a ladder. Choose one group where you listen more than pitch. Let relationships be reciprocal, not transactional proof you are winning.`,
  WI: `Impact becomes a trophy hunt. You say yes to visibility over fit, then resent the load. You measure worth by applause. Narrow to one initiative aligned with strengths. Say no once with clarity. Impact needs focus, not more medals.`,
  VS: `Strategy turns into endless planning because choosing risks being wrong. You want the perfect map before you move. Pick one decision with a deadline you will keep. A good enough direction beats a brilliant plan in draft.`,
  EX: `You ship to prove you are not lazy, then quietly burn out. Execution becomes identity, not a tool. Delegate one task you hoard for ego. Finish one project before starting two more. Speed without recovery is a trap, not a flex.`,
  OH: `Operations become heroics. You fix fires to feel indispensable while systems stay brittle. Document one process another person can run. Build redundancy on purpose. Being needed for every crisis is not operational health.`,
  EC: `Sustainability becomes virtue signaling. You buy the right labels, then ignore daily waste from pace and travel. Pick one environmental habit that fits real life, not your image. Consistency beats performative green choices.`,
};

const ESCAPE = {
  PH: `The Escape Artist avoids the body when stress rises. You numb with food, screens, or skipping movement. Physical care waits until you feel motivated, which rarely comes. This week, tie one healthy action to stress directly, before escape wins. Small motion beats waiting for perfect mood.`,
  IA: `You dodge inner conflict with busyness or new identities. Stillness feels dangerous, so you scroll or plan. Truth waits while you rearrange the surface. Sit five minutes with one uncomfortable question weekly. Naming the escape is the first exit.`,
  ME: `Feelings get minimized, intellectualized, or drowned in distraction. You fear being overwhelmed, so you never land. That stores pressure. Use one short check in daily: name mood on a scale, breathe, then one tiny next step. Escape shrinks when emotions have a door.`,
  AF: `You flee hard focus into easy tabs, email, or busywork. The brain learns to dodge tension. Block one distraction during a single important task. Notice the urge to escape without obeying it. Attention strengthens when you stay through the itch.`,
  RS: `You abandon yourself for approval, then resent it. Boundaries feel like rejection, so you disappear into others. Reclaim one no that protects your calendar. Self escape is still escape. You matter in your own plotline.`,
  FA: `Conflict or boredom sends you into work, phone, or chores. Family time becomes parallel play without depth. Stay present for ten minutes without fixing or fleeing. Repair needs proximity, not another task checked.`,
  CO: `You ghost commitments when groups get real. Shallow fun is safe; vulnerability is not. Pick one conversation where you stay instead of joking it away. Belonging requires staying when it is awkward.`,
  WI: `Big problems feel paralyzing, so you donate sporadically or post, then disengage. Pick one local act with a calendar slot. Impact grows when escape turns into repeatable showing up.`,
  VS: `Future planning becomes fantasy or constant pivoting so you never commit. Fear of wrong choice keeps options infinite. Write one ninety day bet and one reason you might be wrong. Movement beats permanent rehearsal.`,
  EX: `You start projects to feel alive, then abandon when the grind hits. Novelty replaces follow through. Finish one small commitment before opening a new idea. Execution needs boring miles, not only fresh starts.`,
  OH: `Mess feels overwhelming, so you avoid systems until crisis. Chaos confirms the story that you are bad at ops. Tackle one drawer, one list, one fifteen minute cleanup block. Escape ends when the first step is tiny.`,
  EC: `Eco guilt feels huge, so you tune out. Apathy feels safer than imperfect action. Choose one repeatable habit you will keep even when tired. Small honest steps beat full denial.`,
};

const PLEASER = {
  PH: `You say yes to every invite and request until your body pays. Sleep and workouts get traded for being liked. Pleasing is not kindness if it erodes your health. Protect one non negotiable recovery block this week. Your yes to yourself enables real generosity.`,
  IA: `You shape values around what keeps peace. Authentic wants stay hidden to avoid disappointing anyone. That fractures inner alignment. Voice one small preference that might not please everyone. Integrity includes disappointing people sometimes.`,
  ME: `You absorb others moods, then feel drained and resentful in silence. Emotional labor has no invoice. Name one limit on venting or rescuing. You can care without carrying everyone at once.`,
  AF: `Notifications and requests fragment you because you hate letting people wait. Focus dies a thousand polite deaths. Batch responses. Turn off alerts for one work block. Pleasing the inbox pleases almost no real relationship.`,
  RS: `Self worth ties to being helpful, never needy. You abandon your needs until you are empty. Ask for one specific help this month. Receiving does not make you a burden.`,
  FA: `You over function to keep harmony, then explode or withdraw. Kids and partners feel the tension. State one need clearly without fixing their reaction. Love includes honest limits.`,
  CO: `You over commit to groups, then flake or perform hollow enthusiasm. Depth needs fewer yeses. Choose one community where you can be honest when tired. Belonging needs truth, not constant cheer.`,
  WI: `You take causes that impress others, not ones that fit capacity. Burnout follows. Align one service act with real energy and time. Impact needs boundaries, not martyrdom.`,
  VS: `Strategy bends to every stakeholder voice until direction dissolves. You fear being disliked for choosing. Make one call that disappoints someone on purpose because the mission needs it. Clarity costs short term friction.`,
  EX: `You pick up slack for others, then miss your own deadlines. Helping becomes avoidance of your work. Finish your top task before answering optional asks. Execution needs ownership, not rescue heroics.`,
  OH: `You say yes to every process tweak others want until operations sprawl. Standards slip while niceness wins. Document one rule and hold it kindly. Ops need consistency more than popularity.`,
  EC: `You agree to green initiatives you will not sustain to look cooperative. Pick one environmental practice you own without performing. Honest small habits beat public promises you resent.`,
};

const IMPOSTER = {
  PH: `You feel like a fraud if you are not suffering for results. Rest triggers guilt. Health becomes proof you are serious enough. You are allowed to be fit without punishing narratives. One recovery day is data, not defeat.`,
  IA: `You doubt every value claim until you have a perfect story. Inner work stalls while you compare. You belong in your life without a credential for being human. Journal one true sentence you would tell a friend, then believe it about you.`,
  ME: `Success feels like luck waiting to expire. You minimize wins and magnify slips. That keeps anxiety high. Log one win weekly with evidence. Imposter voice shrinks when facts stack.`,
  AF: `You over prepare and still feel behind. Focus fractures because you fear being exposed. Set a timer and ship one imperfect deliverable. Competence includes good enough, not flawless.`,
  RS: `You perform confidence while feeling hollow. Self trust stays low despite external proof. Share one doubt with a safe person. Connection beats solo performance of okay.`,
  FA: `You parent or partner from fear of being found out as not enough. That creates distance. Admit one mistake without over apologizing. Family bonds strengthen with honesty, not polish.`,
  CO: `You network from scarcity, afraid people will discover you are ordinary. That reads as neediness. Offer one genuine compliment or help with no ask attached. Belonging starts with enoughness.`,
  WI: `You hesitate to lead impact because someone else might be more qualified. Waiting costs the cause. Take one visible step you can own. Mission needs your real effort, not perfect credentials.`,
  VS: `Plans feel fake until a guru validates them. You outsource authority. Choose one strategic bet and own the rationale. Vision grows when you sign your name under it.`,
  EX: `You delay shipping until it is bulletproof, then miss windows. Execution fears exposure. Release one version labeled v1 on purpose. Iteration is how adults learn in public.`,
  OH: `You hide process gaps, fearing judgment if systems are messy. Chaos grows in secret. Show one workflow to a peer for feedback. Operations improve faster with light, not shame.`,
  EC: `You fear hypocrisy if your eco habits are imperfect, so you do nothing. Imperfect action still moves the needle. Start one habit you can defend honestly. Integrity includes learning in public.`,
};

export const MOD_A = {
  "achievers-trap": ACHIEVERS,
  "escape-artist": ESCAPE,
  "pleasers-bind": PLEASER,
  "imposter-loop": IMPOSTER,
};
