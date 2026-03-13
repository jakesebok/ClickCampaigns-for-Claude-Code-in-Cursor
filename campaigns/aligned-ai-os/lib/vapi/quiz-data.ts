export type VapiQuestion = {
  id: string;
  domain: string;
  text: string;
  reverse: boolean;
  weight: number;
};

export type VapiDomain = {
  code: string;
  name: string;
  arena: "personal" | "relationships" | "business";
  questions: VapiQuestion[];
};

export const SCALE_LABELS = [
  "Strongly Agree",
  "Agree",
  "Somewhat Agree",
  "Neutral",
  "Somewhat Disagree",
  "Disagree",
  "Strongly Disagree",
];

export const SCALE_VALUES = [7, 6, 5, 4, 3, 2, 1];

const W = [1.2, 1.2, 1.0, 1.0, 0.8, 0.8];

export const ARENAS = [
  { key: "personal", label: "Personal", domains: ["PH", "IA", "ME", "AF"] },
  { key: "relationships", label: "Relationships", domains: ["RS", "FA", "CO", "WI"] },
  { key: "business", label: "Business", domains: ["VS", "EX", "OH", "EC"] },
] as const;

export const DOMAINS: VapiDomain[] = [
  {
    code: "PH",
    name: "Physical Health",
    arena: "personal",
    questions: [
      { id: "PH1", domain: "PH", text: "I slept 7 or more hours and woke feeling genuinely rested on at least 5 out of 7 mornings each week.", reverse: false, weight: W[0] },
      { id: "PH2", domain: "PH", text: "I had steady physical energy from morning to evening without needing caffeine, sugar, or stimulants to avoid an afternoon crash.", reverse: false, weight: W[1] },
      { id: "PH3", domain: "PH", text: "I exercised, trained, or moved my body intentionally at least 3 times per week.", reverse: false, weight: W[2] },
      { id: "PH4", domain: "PH", text: "I planned and ate regular, balanced meals that supported my energy rather than skipping meals, stress-eating, or defaulting to convenience food.", reverse: false, weight: W[3] },
      { id: "PH5", domain: "PH", text: "My exercise, sleep, and nutrition routines stayed consistent for the full 30 days without needing a health scare or a burst of guilt to get back on track.", reverse: false, weight: W[4] },
      { id: "PH6", domain: "PH", text: "I regularly sacrificed sleep, skipped meals, or neglected my body to keep up with work demands.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "IA",
    name: "Inner Alignment",
    arena: "personal",
    questions: [
      { id: "IA1", domain: "IA", text: "When I looked at how I spent my time each week, the majority went toward things I genuinely chose rather than things I felt trapped into doing.", reverse: false, weight: W[0] },
      { id: "IA2", domain: "IA", text: "I scheduled and protected time each week for activities that bring me joy or meaning, such as hobbies, experiences, or personal projects.", reverse: false, weight: W[1] },
      { id: "IA3", domain: "IA", text: "Outside of work, I was genuinely present and engaged in my life rather than mentally elsewhere, distracted by business problems, or going through the motions.", reverse: false, weight: W[2] },
      { id: "IA4", domain: "IA", text: "If someone compared my calendar and bank statement from the past 30 days to my stated values, they would find an obvious and consistent match.", reverse: false, weight: W[3] },
      { id: "IA5", domain: "IA", text: "I engaged in reflection, play, creativity, or restorative experiences on a recurring weekly basis as a standing priority, not as a reward for being productive.", reverse: false, weight: W[4] },
      { id: "IA6", domain: "IA", text: "Most of my week was consumed by tasks I felt obligated to do rather than things I genuinely wanted or chose to do.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "ME",
    name: "Mental / Emotional Health",
    arena: "personal",
    questions: [
      { id: "ME1", domain: "ME", text: "When I faced a stressful situation or setback this month, I returned to a calm, clear-headed state within hours rather than days.", reverse: false, weight: W[0] },
      { id: "ME2", domain: "ME", text: "When I faced pressure from a difficult client, a conflict, or a missed goal, I paused and responded deliberately instead of reacting, avoiding, or shutting down.", reverse: false, weight: W[1] },
      { id: "ME3", domain: "ME", text: "When I made a mistake or fell short this month, I spoke to myself the way I'd speak to someone I respect rather than with shame, contempt, or harsh criticism.", reverse: false, weight: W[2] },
      { id: "ME4", domain: "ME", text: "My daily pace over the past 30 days was genuinely sustainable without relying on adrenaline, caffeine, or last-minute pressure to get through my weeks.", reverse: false, weight: W[3] },
      { id: "ME5", domain: "ME", text: "I made important decisions this month with confidence and clarity, without excessive rumination, anxiety spirals, or needing reassurance from others before acting.", reverse: false, weight: W[4] },
      { id: "ME6", domain: "ME", text: "Over the past 30 days, I frequently snapped at people, felt on the verge of tears or rage, or noticed I was running on empty emotionally.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "AF",
    name: "Attention & Focus",
    arena: "personal",
    questions: [
      { id: "AF1", domain: "AF", text: "In my work, I consistently entered deep, focused work on my most important tasks without needing a deadline or crisis to get started.", reverse: false, weight: W[0] },
      { id: "AF2", domain: "AF", text: "During focused work hours, I kept my phone silenced or out of reach, closed email and social media, and did not let other people's urgency interrupt my deep work.", reverse: false, weight: W[1] },
      { id: "AF3", domain: "AF", text: "In my work schedule, I blocked off dedicated focus time and actually kept those blocks intact at least 80% of the time.", reverse: false, weight: W[2] },
      { id: "AF4", domain: "AF", text: "During my workday, when I caught myself scrolling, doing busywork, or slipping into 'research mode,' I recognized the avoidance and redirected to the real task quickly.", reverse: false, weight: W[3] },
      { id: "AF5", domain: "AF", text: "At the end of most workdays, my time had gone toward my highest-priority tasks rather than notifications, other people's requests, or whatever felt easiest.", reverse: false, weight: W[4] },
      { id: "AF6", domain: "AF", text: "During my workdays, I lost significant time to distraction, context-switching, or low-value tasks most weeks this month.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "RS",
    name: "Relationship to Self",
    arena: "relationships",
    questions: [
      { id: "RS1", domain: "RS", text: "I kept the promises I made to myself, and when I said I'd do something, I followed through without renegotiating or making excuses.", reverse: false, weight: W[0] },
      { id: "RS2", domain: "RS", text: "In my relationships, I held my position on things that mattered to me even when others pushed back, disagreed, or expressed disappointment.", reverse: false, weight: W[1] },
      { id: "RS3", domain: "RS", text: "When a partner, friend, or colleague asked what I wanted or needed, I stated it directly without over-explaining, apologizing, or deflecting.", reverse: false, weight: W[2] },
      { id: "RS4", domain: "RS", text: "I enforced a personal boundary this month by saying no, pushing back, or protecting my time, even when it made someone uncomfortable or cost me approval.", reverse: false, weight: W[3] },
      { id: "RS5", domain: "RS", text: "When I reflected on the promises I kept to myself, the way I spoke to myself, and the standards I held this month, I felt genuine self-respect.", reverse: false, weight: W[4] },
      { id: "RS6", domain: "RS", text: "In my relationships, I frequently people-pleased, said yes when I meant no, or abandoned what I needed to avoid tension or disapproval.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "FA",
    name: "Family",
    arena: "relationships",
    questions: [
      { id: "FA1", domain: "FA", text: "With my family, I was patient, present, and emotionally available rather than irritable, rushed, or giving them whatever energy was left after work.", reverse: false, weight: W[0] },
      { id: "FA2", domain: "FA", text: "When I was with my family, I put my phone away, made eye contact, and gave them my full attention rather than just my physical presence.", reverse: false, weight: W[1] },
      { id: "FA3", domain: "FA", text: "With my family, I communicated honestly and respectfully during difficult or uncomfortable conversations rather than avoiding, stonewalling, or getting defensive.", reverse: false, weight: W[2] },
      { id: "FA4", domain: "FA", text: "When tension or conflict arose in my family, I repaired quickly instead of letting distance, resentment, or silence build.", reverse: false, weight: W[3] },
      { id: "FA5", domain: "FA", text: "I made intentional, protected time for family rather than giving them whatever was left over after work.", reverse: false, weight: W[4] },
      { id: "FA6", domain: "FA", text: "I was emotionally absent, distracted, or checked out around my family more often than I'd like to admit.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "CO",
    name: "Community",
    arena: "relationships",
    questions: [
      { id: "CO1", domain: "CO", text: "Outside of family and work, I have at least two or three people who know the real me, including my struggles, my goals, and what's actually going on in my life.", reverse: false, weight: W[0] },
      { id: "CO2", domain: "CO", text: "Outside of work, I actively invested time and energy into friendships or communities that support growth, honesty, and real connection.", reverse: false, weight: W[1] },
      { id: "CO3", domain: "CO", text: "In the past 30 days, I intentionally shared meals, calls, or activities with friends or community members who energize me and reflect my values.", reverse: false, weight: W[2] },
      { id: "CO4", domain: "CO", text: "In my friendships and communities, I felt genuinely welcomed and known rather than performing, masking, or going through the motions socially.", reverse: false, weight: W[3] },
      { id: "CO5", domain: "CO", text: "After spending time with friends or in community this month, I consistently felt energized and supported rather than drained, performing, or relieved it was over.", reverse: false, weight: W[4] },
      { id: "CO6", domain: "CO", text: "Outside of work and family, I was socially isolated, withdrawn, or mostly surrounded by relationships that felt shallow or draining this month.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "WI",
    name: "World / Impact",
    arena: "relationships",
    questions: [
      { id: "WI1", domain: "WI", text: "In the past 30 days, I gave my time, skills, or resources to a cause, community, or mission beyond my own business or personal gain.", reverse: false, weight: W[0] },
      { id: "WI2", domain: "WI", text: "I used my specific strengths and expertise to help others this month through mentoring, teaching, creating, or serving in a way that felt aligned with who I am.", reverse: false, weight: W[1] },
      { id: "WI3", domain: "WI", text: "Beyond my own business goals, I am actively building or contributing to something that will create positive impact for others over the long term.", reverse: false, weight: W[2] },
      { id: "WI4", domain: "WI", text: "My contribution to others this month was planned and consistent rather than a one-off, a guilt response, or something I did for appearances.", reverse: false, weight: W[3] },
      { id: "WI5", domain: "WI", text: "I contributed to others this month without posting about it, expecting recognition, or needing anyone to notice. It was genuine, not performative.", reverse: false, weight: W[4] },
      { id: "WI6", domain: "WI", text: "I was so consumed by my own goals or survival that meaningful contribution to others fell off my radar.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "VS",
    name: "Vision / Strategy",
    arena: "business",
    questions: [
      { id: "VS1", domain: "VS", text: "I can clearly articulate where my business is heading over the next 12 to 18 months, why it matters to me personally, and draw a direct line from my revenue targets to the specific life outcomes they exist to create.", reverse: false, weight: W[0] },
      { id: "VS2", domain: "VS", text: "In my business, I said 'no' to opportunities, projects, or requests that didn't fit my current strategic priorities, even when they were tempting.", reverse: false, weight: W[1] },
      { id: "VS3", domain: "VS", text: "In my business, I had clear priorities and a strategy simple enough to explain to someone in under 60 seconds.", reverse: false, weight: W[2] },
      { id: "VS4", domain: "VS", text: "In my business, the decisions I made this month matched my values, my season of life, and my actual capacity rather than just what seemed exciting or urgent.", reverse: false, weight: W[3] },
      { id: "VS5", domain: "VS", text: "If someone asked me about my business direction right now, I could answer confidently and concisely without hesitation, contradictions, or listing five different priorities.", reverse: false, weight: W[4] },
      { id: "VS6", domain: "VS", text: "In my business, I spent significant time chasing new ideas, second-guessing my direction, or reacting to whatever felt most urgent rather than following a plan.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "EX",
    name: "Execution",
    arena: "business",
    questions: [
      { id: "EX1", domain: "EX", text: "At the end of each week in my business, I had completed the specific priorities I planned at the start of the week without needing to cram, scramble, or rely on external accountability to finish.", reverse: false, weight: W[0] },
      { id: "EX2", domain: "EX", text: "In my business, I finished and shipped more than I started, and my output was tangible and moved things forward.", reverse: false, weight: W[1] },
      { id: "EX3", domain: "EX", text: "In my business, my calendar reflected my actual priorities rather than meetings I didn't need, other people's demands, or whatever felt easiest.", reverse: false, weight: W[2] },
      { id: "EX4", domain: "EX", text: "In my business, I followed a structured weekly rhythm where I set clear outcomes at the start of each week, protected my non-negotiable work blocks, and completed a weekly review of my progress.", reverse: false, weight: W[3] },
      { id: "EX5", domain: "EX", text: "In my business, when I noticed I was avoiding a hard task by procrastinating, doing busywork, or switching to easy wins, I caught it and got back on track quickly.", reverse: false, weight: W[4] },
      { id: "EX6", domain: "EX", text: "In my business, I frequently procrastinated on high-impact work, started things I didn't finish, or let weeks pass without meaningful output.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "OH",
    name: "Operational Health",
    arena: "business",
    questions: [
      { id: "OH1", domain: "OH", text: "I can predict, within a reasonable range, how many qualified conversations my business generates per month and my conversion rate from conversation to paid client.", reverse: false, weight: W[0] },
      { id: "OH2", domain: "OH", text: "In my business, I have a weekly review system where I track key metrics like leads, conversions, revenue, and capacity and use that data to make decisions.", reverse: false, weight: W[1] },
      { id: "OH3", domain: "OH", text: "My delivery and operations workload fit inside sustainable capacity, and I wasn't silently running over-capacity to keep things afloat.", reverse: false, weight: W[2] },
      { id: "OH4", domain: "OH", text: "I can name my biggest operational bottleneck right now and have a specific, actionable plan to address it.", reverse: false, weight: W[3] },
      { id: "OH5", domain: "OH", text: "My business is becoming less dependent on me through delegation, automation, or documented SOPs, and I can point to specific recent evidence of that progress.", reverse: false, weight: W[4] },
      { id: "OH6", domain: "OH", text: "My business felt unpredictable, and I couldn't reliably forecast revenue, leads, or capacity from month to month.", reverse: true, weight: W[5] },
    ],
  },
  {
    code: "EC",
    name: "Ecology",
    arena: "business",
    questions: [
      { id: "EC1", domain: "EC", text: "If I achieved my current business goals exactly as planned, my health, relationships, happiness, and personal freedom would all improve rather than suffer.", reverse: false, weight: W[0] },
      { id: "EC2", domain: "EC", text: "In my business, the way I sell, deliver, and lead matches who I actually am. I don't have to fake a persona, override my instincts, or perform to make it work.", reverse: false, weight: W[1] },
      { id: "EC3", domain: "EC", text: "My business model fits how I'm wired and doesn't require me to constantly push past exhaustion, dread, or resistance just to keep it running.", reverse: false, weight: W[2] },
      { id: "EC4", domain: "EC", text: "If my business became 10x more of what it already is today, I would feel more free, more energized, and more proud of how I operate rather than more burnt out, more trapped, or more desperate to escape.", reverse: false, weight: W[3] },
      { id: "EC5", domain: "EC", text: "In my business, when it was time to do the hard growth work like selling, launching, or following up, I didn't stall, self-sabotage, or find reasons to delay.", reverse: false, weight: W[4] },
      { id: "EC6", domain: "EC", text: "In my business, part of me suspects I'm building something that looks impressive on the outside but would make me feel more trapped if it actually scaled.", reverse: true, weight: W[5] },
    ],
  },
];

export const IMPORTANCE_DOMAINS = [
  { section: "Self", domains: [
    { code: "PH", label: "Physical Health" },
    { code: "IA", label: "Inner Alignment" },
    { code: "ME", label: "Mental / Emotional Health" },
    { code: "AF", label: "Attention & Focus" },
  ]},
  { section: "Relationships", domains: [
    { code: "RS", label: "Relationship to Self" },
    { code: "FA", label: "Family" },
    { code: "CO", label: "Community" },
    { code: "WI", label: "World / Impact" },
  ]},
  { section: "Business", domains: [
    { code: "VS", label: "Vision / Strategy" },
    { code: "EX", label: "Execution" },
    { code: "OH", label: "Operational Health" },
    { code: "EC", label: "Ecology" },
  ]},
];
