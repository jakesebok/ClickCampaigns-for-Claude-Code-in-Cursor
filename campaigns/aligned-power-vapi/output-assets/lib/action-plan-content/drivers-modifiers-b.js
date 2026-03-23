/** Driver modifiers: Perfectionist through Fog × 12 domains. */

const PERFECTIONIST = {
  PH: `Perfectionism delays workouts until conditions are ideal, then blames the slip. You research more than you move. Pick one minimum viable session you will do on bad days. Done beats optimal that never happens.`,
  IA: `You need a flawless values narrative before you live anything. Alignment waits for the perfect story. Act on one value messily this week. Integrity is practiced, not curated.`,
  ME: `You analyze emotions until the moment passes, then criticize yourself for feeling late. Perfect processing is another stall. Set a ten minute vent timer, then one action. Emotions need motion, not endless audit.`,
  AF: `You rewrite the same email, reopen tabs, and polish instead of finishing. Fear of error steals hours. Ship one task at B plus on purpose. Focus trains on completion, not infinite polish.`,
  RS: `Self love waits until you earn it through perfect behavior. That day never arrives. Speak to yourself once the way you would a tired friend. Worth is not a performance review.`,
  FA: `Family routines freeze until the plan is perfect, then everyone walks on eggshells. Choose good enough tonight: one meal, one game, one apology if needed. Connection tolerates imperfection.`,
  CO: `You avoid groups until you have the right outfit, bio, and timing. Isolation wins. Attend one event imperfectly prepared. Community forms in the awkward middle.`,
  WI: `Impact waits for the perfect nonprofit fit while needs stay urgent. Volunteer once imperfectly. Good enough help beats waiting for the ideal cause.`,
  VS: `Strategy decks multiply; decisions stall. You fear wrong so you never choose wrong enough to learn. Pick one direction for ninety days, review once. Strategy needs bets, not infinite slides.`,
  EX: `You cannot ship because edge cases multiply. Define done in writing, then finish. Execution needs a finish line, not a museum piece.`,
  OH: `Processes stay in draft because documentation must be beautiful. Ugly SOP beats genius in your head. Publish one rough checklist someone else can run.`,
  EC: `Eco choices stall until the perfect kit arrives. Use what you have, start today. Sustainability loves repetition, not catalog perfection.`,
};

const PROTECTOR = {
  PH: `You armor up with control and routine, fearing vulnerability in the body. Rigidity masquerades as discipline. Add one playful movement that has no metric. Safety can include joy, not only defense.`,
  IA: `You protect a curated self image so tightly that real wants stay hidden. Growth needs risk. Share one truth that might change how someone sees you. Protection without honesty becomes a cage.`,
  ME: `You stay hyper vigilant, scanning for threat, rarely resting the nervous system. That exhausts you. Practice one downshift daily: breath, walk, music. Protection includes recovery, not only scanning.`,
  AF: `You defend against mistakes by over monitoring everything. Hyper focus on risk fragments attention. Set one hour where only one priority exists. Trust builds through bounded focus.`,
  RS: `You keep walls high to avoid hurt, then wonder why intimacy lags. One small ask for closeness is a risk worth taking. Protection and connection need balance.`,
  FA: `You control family outcomes to feel safe, which breeds resentment. Loosen one decision you micromanage. Let someone own a outcome. Safety includes others agency.`,
  CO: `You vet people heavily, then feel alone. Not everyone is a threat. Attend one gathering with curiosity, not interrogation. Belonging needs a little trust upfront.`,
  WI: `You guard reputation so tightly that impact stays small. Take one stance that might draw critique. Protection of image can starve mission.`,
  VS: `You choose safe incremental moves to avoid backlash. Strategy stays small. Name one stretch goal with downside you accept. Vision needs courage, not only shields.`,
  EX: `You hoard work so no one can fail publicly. That caps the team and you. Hand off one piece with clear criteria. Protection through control is a bottleneck.`,
  OH: `You lock processes so tight that adaptability dies. Build one exception path for real world mess. Operations need guardrails, not panic rooms.`,
  EC: `You avoid visible green steps fearing judgment if you slip. Start privately, track simply. Protection includes allowing imperfect progress.`,
};

const MARTYR = {
  PH: `You sacrifice sleep and workouts for others, then wear exhaustion as proof you care. Martyrdom is not love. Schedule one health block as non negotiable as a kid pickup. You cannot pour from an empty cup.`,
  IA: `You abandon your values to keep peace, then feel hollow. Resentment builds in silence. Reclaim one small choice that honors you without drama. Sacrifice without boundaries becomes identity loss.`,
  ME: `You carry everyone emotions until you break, then guilt yourself for breaking. Name one limit on emotional labor. Support others without disappearing.`,
  AF: `You drop your priorities the second someone pings. Focus never compounds. Silence notifications for one deep block daily. Your work deserves protected attention.`,
  RS: `Self care waits until everyone else is okay, which is never. You matter now, not later. Book one thing weekly that refills only you. Martyrs need permission to exist.`,
  FA: `You do everything, resent everyone, say nothing. That poisons the home. Delegate one task and keep your mouth kind when it is done differently. Family needs partners, not martyrs.`,
  CO: `You over give in groups, hoping someone notices. They rarely do. Ask for one specific reciprocity. Community works both ways.`,
  WI: `You burn out for causes without sustainable pace. Impact needs longevity. Cut one commitment with love. The world needs you long term.`,
  VS: `You let strategy die on the altar of everyone emergencies. Protect one strategic hour weekly. Martyrdom is not leadership.`,
  EX: `You finish others work first, yours never ships. Block calendar for your top outcome before helping. Execution needs your oxygen mask first.`,
  OH: `You absorb every ops fire so the team relaxes, then blame them quietly. Train one owner. Martyrdom is not operational design.`,
  EC: `You guilt yourself for not doing enough for the planet while running on fumes. Sustainable living includes sustainable you. One habit you can keep beats heroic burnout.`,
};

const FOG = {
  PH: `Clarity about your body blurs under stress. You drift from habits without noticing until energy crashes. Track sleep and movement simply for two weeks. Fog lifts with gentle data, not shame.`,
  IA: `Values feel vague; motivation feels flat. You float between shoulds. Write three non negotiables for this month only. Fog clears when choices get small and concrete.`,
  ME: `Emotions feel numb or tangled; naming them is hard. Use a one word check in twice daily. Mapping fog starts with labels, not solutions.`,
  AF: `Attention dissolves into fog when priorities are unclear. Pick one outcome for each morning. Single focus cuts through mental haze.`,
  RS: `You feel disconnected from yourself but cannot say why. Journal one sentence: what I need today. Self fog lifts with tiny honesty.`,
  FA: `Family life runs on autopilot; connection feels fuzzy. One eye contact meal weekly. Presence cuts fog better than more logistics.`,
  CO: `You drift through social life without depth. Text one person a real question. Fog in community ends with one thread pulled.`,
  WI: `Purpose feels distant or generic. List what angers you about the world; pick one small response. Fog clears when care finds a channel.`,
  VS: `Strategy feels like guessing in mist. Choose one metric and one deadline. Fog hates specificity.`,
  EX: `Tasks blur together; nothing finishes. Use a visible done list with three items max. Execution fog breaks with ruthless prioritization.`,
  OH: `Operations feel murky; nobody knows who owns what. Name one owner per recurring task. Fog in ops is often unclear accountability.`,
  EC: `Environmental impact feels abstract. Pick one visible habit with a calendar cue. Fog lifts when action is obvious.`,
};

export const MOD_B = {
  "perfectionists-prison": PERFECTIONIST,
  protector: PROTECTOR,
  "martyr-complex": MARTYR,
  fog: FOG,
};
