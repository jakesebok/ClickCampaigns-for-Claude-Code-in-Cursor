(function() {
  var ARCHETYPE_ORDER = [
    "The Architect",
    "The Journeyman",
    "The Performer",
    "The Ghost",
    "The Guardian",
    "The Seeker",
    "The Drifter",
    "The Engine",
    "The Phoenix"
  ];

  var ARCHETYPE_LIBRARY_TITLE = "The 9 Founder Archetypes";
  var ARCHETYPE_LIBRARY_SUBTITLE =
    "Your archetype reflects how your energy, attention, and effort are distributed across the three arenas of your life: Self, Relationships, and Business. It reveals the shape of your current operating pattern, not who you are, but how you're operating right now. As your scores change, your archetype can change with them. Reading all nine will help you understand where you've been, where you are, and what you're building toward.";
  var ARCHETYPE_LIBRARY_EMPTY_RESULTS_BANNER =
    "Take the VAPI Assessment to discover your current founder archetype.";
  var ARCHETYPE_LIBRARY_FOOTER_HEADING =
    "Ready to Change Your Operating Pattern?";
  var ARCHETYPE_LIBRARY_FOOTER_TEXT =
    "Your archetype isn't permanent. It's a reflection of how you're operating today. The Aligned Power Program is a 12-month coaching partnership designed to help you build toward The Architect: full integration across your health, relationships, and business.";

  var ARCHETYPE_LIBRARY_CONTENT = {
    "The Architect": {
      howToKnowThisIsYou: [
        "Your life genuinely feels integrated. Your business supports your health rather than undermining it.",
        "Your closest relationships feel your presence, not just your proximity",
        "You have energy at the end of the day, not just at the beginning",
        "You can name your strategy, your boundaries, and your priorities without hesitation",
        "Your business could run for a week without you and nothing critical would break",
        "When you look at your calendar, it reflects what you actually value",
        "People who know you well would say you seem grounded, present, and clear"
      ],
      howToKnowThisIsntYou: [
        "If any arena feels like it's being propped up by sacrificing another, you're not here yet",
        "If your health, relationships, or business would collapse under moderate stress, the integration isn't real",
        "If you feel like you're performing well but running on fumes, you may be a Performer, not an Architect",
        "If you're strong in two arenas but neglecting a third, you're likely The Journeyman",
        "The Architect doesn't just look good on paper. It FEELS sustainable in your body."
      ],
      reflectionPrompts: [
        "What is the one area of your life that would be the first to slip if you stopped actively maintaining it? That's your vulnerability point. What system or practice is protecting it right now?",
        "When was the last time you audited whether your daily reality still matches your stated values? Is there a gap forming that you've been too comfortable to notice?",
        "If someone followed you for a week with a camera, would the footage match the story you tell about your life? Where would the discrepancies show up?",
        "What would need to change in your external circumstances (a business crisis, a health scare, a relationship conflict) to knock you out of this integrated state? How prepared are you for that disruption?",
        "Are you growing or maintaining? There's a difference. The Architect who stops growing eventually starts drifting. What's your next edge?"
      ],
      relationshipToOtherArchetypes:
        "The Architect is the destination that every other archetype is building toward, but it's most closely related to The Journeyman, which represents the near-miss. If your scores drop in one arena, you'll likely transition to The Journeyman first before falling further. The most common regression paths from Architect are: to The Journeyman (one arena softens), to Performer (Self arena collapses while Business stays strong), or to Ghost (Relationships arena erodes while you're focused elsewhere). The Architect's greatest long-term risk is becoming a Drifter through complacency, where 'good enough' replaces the intentional maintenance that built the integration in the first place.",
      commonDrivers:
        "The Architect typically shows 'No Driver Identified' with the High Performer fallback. If a driver does appear, it's usually faint and represents a residual pattern rather than an active one. The most common residual drivers are The Achiever's Trap (old habits of tying identity to output) or The Protector (lingering control patterns), but these are typically secondary drivers at low point totals rather than dominant patterns."
    },
    "The Journeyman": {
      howToKnowThisIsYou: [
        "Your composite score is 7.0 or above, reflecting genuine strength across the board",
        "At least two of your three arenas score 7.5 or higher",
        "Your lowest arena is still 6.5 or above, functional, not broken",
        "You don't have any single area in crisis, but you can feel that one arena isn't keeping pace with the others",
        "You've put in real work to get here. This isn't accidental or temporary.",
        "You're close to having it all dialed, and that proximity is both motivating and slightly frustrating",
        "People who know your situation would say you're doing well across the board, but you know there's a gap you haven't fully closed"
      ],
      howToKnowThisIsntYou: [
        "If any arena is below 6.0, you likely have a more significant imbalance that places you in a different archetype (Guardian, Seeker, Performer, or Ghost)",
        "If all three arenas are above 8.0 with a composite of 8.0+, you're an Architect, not a Journeyman",
        "If your composite is below 7.0, you're likely a Drifter or one of the imbalance archetypes",
        "The Journeyman is defined by being close to full integration. If you have major gaps or major strengths without the broad foundation, another archetype fits better."
      ],
      reflectionPrompts: [
        "Look at your lagging arena. Without checking the specific domain scores, what's your gut sense about what's pulling it down? Your intuition likely already knows where the gap is. Name it.",
        "What would it take to bring your lagging arena up by 0.5 to 1.0 points over the next 90 days? Not a complete overhaul, just consistent attention. What specific actions would that require?",
        "What are you currently doing to maintain your two stronger arenas? Make sure any focus on the lagging arena doesn't come at the cost of what's already working. How will you protect those foundations?",
        "What has prevented you from closing this gap already? Is it attention? Priority? Skill? Belief? Something structural? Name the actual barrier, not the surface-level excuse.",
        "Imagine you close this gap and reach Architect-level integration. What becomes possible that isn't possible now? How would your experience of your business, relationships, and self actually change? Make it concrete."
      ],
      relationshipToOtherArchetypes:
        "The Journeyman sits directly below The Architect in the progression. The difference is narrow but meaningful: The Architect has closed all the gaps, while The Journeyman has one arena still trailing. The Journeyman is most commonly confused with The Drifter because both show relatively balanced scores. The difference is altitude: The Drifter is balanced in the middle (composite 5.5-6.5) while The Journeyman is balanced near the top (composite 7.0+). The most common path to Journeyman is from one of the imbalance archetypes (Guardian, Seeker, Performer) after the weak arena has been strengthened. The path forward from Journeyman is singular: close the gap in the lagging arena and become The Architect.",
      commonDrivers:
        "The Journeyman often shows no driver at all, or Aligned Momentum, because the psychological patterns that produce dysfunction have largely been addressed. When a driver does appear, it's typically a mild or residual version of whatever pattern was present before they reached this level. The Fog occasionally appears when the Journeyman has broad strength but hasn't fully clarified what's next. The Builder's Gap occasionally appears when the lagging arena is Business and the gap is specifically in operational systems or execution."
    },
    "The Performer": {
      howToKnowThisIsYou: [
        "Your business results are the thing people compliment you on most, but privately you're exhausted",
        "You can push through almost anything when you need to, but you need to more often than you'd like",
        "Your health has taken a backseat to your business for longer than you originally intended",
        "You know you're running unsustainably but you don't know how to stop without everything falling apart",
        "You feel a spike of anxiety when you imagine reducing your output by 30%",
        "People close to you have told you to slow down. You've explained why you can't. You're not sure you believe your own explanation anymore.",
        "Your identity and your productivity are difficult to separate. Who are you if you're not performing?"
      ],
      howToKnowThisIsntYou: [
        "If your business is struggling alongside everything else, you're likely a Phoenix or a Drifter, not a Performer",
        "If your health, sleep, and energy feel sustainable, the Performer pattern doesn't fit",
        "If you can take a full week off without guilt or anxiety, this isn't your archetype",
        "If your Self arena scores are strong, the Performer label doesn't apply even if your Business scores are high",
        "The Performer's defining feature is the gap between external results and internal cost. If that gap doesn't exist, look elsewhere."
      ],
      reflectionPrompts: [
        "If your business revenue stayed exactly the same but you could only work 25 hours a week, what would you cut? What would you delegate? And what does your resistance to that thought tell you about what's really driving the current pace?",
        "When did you last feel genuinely rested, not just recovered enough to work again, but actually rested? If you can't remember, how long has this pattern been running?",
        "Strip away your business results, your title, your revenue, your reputation. What's left? How do you describe yourself without referencing what you've built or what you produce?",
        "What would the people who love you most say about the cost of your current pace if they were being completely honest? Have you asked them? What are you afraid they'd say?",
        "Imagine a version of your life where your business produces 80% of current results but your health, energy, and presence are fully restored. Would you take that trade? If not, what does that tell you about what you're actually optimizing for?"
      ],
      relationshipToOtherArchetypes:
        "The Performer is most commonly confused with The Ghost. Both have strong Business scores. The difference is where the sacrifice shows up. The Performer sacrifices their personal foundation (health, emotional regulation, alignment, focus). The Ghost sacrifices their relationships (family presence, community, connection, contribution). Some founders are both simultaneously, which shows up as high Business with both Self AND Relationships lagging. If that's you, the archetype algorithm catches whichever gap is larger, but the reality is you're a Performer AND a Ghost. The Performer's most common improvement path is to The Journeyman, which happens when they rebuild their Self arena while maintaining Business. The most common regression is to Phoenix, which happens when the unsustainable pace finally collapses.",
      commonDrivers:
        "The Performer is most commonly paired with The Achiever's Trap (identity fused with output), The Escape Artist (using work to avoid something painful), or The Protector (using control and discipline as safety mechanisms). When you see a Performer, the driver tells you WHY they're performing at this unsustainable level. The Achiever performs because producing IS their identity. The Escape Artist performs because stopping means feeling. The Protector performs because their systems and output are the only things they trust."
    },
    "The Ghost": {
      howToKnowThisIsYou: [
        "You can name your business metrics more easily than you can name what your partner or closest friend is currently struggling with",
        "You've missed events, dinners, or milestones because of work and justified it as temporary, but the temporary has lasted months or years",
        "If you're honest, the people closest to you are getting a diminished version of you and have been for a while",
        "You feel more comfortable in a work context than in an intimate or vulnerable personal one",
        "You've been told some version of 'you're never really here' by someone who matters to you",
        "Your social life is mostly professional. The friendships that remain feel thin or transactional.",
        "You sometimes feel a quiet emptiness after a big win because there's nobody who really knows what it took or what it means"
      ],
      howToKnowThisIsntYou: [
        "Your closest relationships feel genuinely nourished and the people in your life feel your presence",
        "You have at least 2-3 people who know the full, unfiltered truth about your life and struggles",
        "You make consistent, protected time for family and friendships that doesn't get overridden by work",
        "Your Relationships arena scores are Functional or above across all four domains",
        "If people who love you were surveyed about your presence and availability, they'd give you a strong rating",
        "The Ghost is defined by relational absence alongside professional strength. If your relationships feel healthy, this isn't you."
      ],
      reflectionPrompts: [
        "When was the last time you had a conversation with someone you care about where you were fully present, no phone nearby, no mental to-do list running, no part of you wishing you could get back to work? How long ago was that? What does the answer tell you?",
        "If the three people closest to you wrote an honest letter about what it's like to be in a relationship with you right now, what would they say? Not the cruel version. The honest version.",
        "What are you getting from work that you're not getting from your relationships? Is it control, predictability, validation, or a sense of competence? What does that tell you about what feels safe versus what feels vulnerable?",
        "Think about a moment in the past year where you chose work over a relationship and you knew, in the moment, that you were making the wrong choice. What was the situation? What were you afraid would happen if you chose the relationship instead?",
        "If your business disappeared tomorrow, which relationships would survive? Which ones have enough depth and investment to hold? If that list is shorter than you'd like, that's not a scheduling problem. It's a priority problem."
      ],
      relationshipToOtherArchetypes:
        "The Ghost is most commonly confused with The Performer. Both have strong Business scores and both are sacrificing something to maintain them. The difference is what's being sacrificed. The Performer sacrifices Self (health, emotions, alignment). The Ghost sacrifices Relationships (family, community, connection, contribution). In practice, many founders are a blend of both, but the archetype algorithm catches whichever deficit is larger. The Ghost's most common improvement path is to The Journeyman, which happens when they invest in Relationships while maintaining Business. The most common regression is to Phoenix, which happens when the isolation compounds into emotional crisis or the relationships deteriorate past the point of easy repair.",
      commonDrivers:
        "The Ghost is most commonly paired with The Protector (walls keep people out), The Escape Artist (work is a hiding place from relational vulnerability), or The Achiever's Trap (relationships can't compete with the dopamine of output). When you see a Ghost, the driver reveals the WHY behind the isolation. The Protector isolates through control and self-reliance. The Escape Artist isolates through constant activity. The Achiever isolates because relationships don't produce measurable results."
    },
    "The Guardian": {
      howToKnowThisIsYou: [
        "You're the person everyone comes to for support, advice, or a listening ear, and you genuinely love that role",
        "Your clients, friends, or family would describe you as deeply caring, generous, and present",
        "You know your business should be further along than it is, but every time you sit down to work ON the business, someone needs something",
        "You undercharge, over-deliver, or give away too much of your time and expertise for free",
        "The idea of being aggressive about sales, marketing, or pricing makes you uncomfortable",
        "You've been told you're 'too nice' for business or that you need to be more ruthless. That advice felt wrong in your body.",
        "You secretly worry that building a bigger business will change who you are or compromise the quality of your relationships"
      ],
      howToKnowThisIsntYou: [
        "If your Business scores are strong and your Relationships scores are weak, you're the inverse of this pattern (likely a Ghost or Performer)",
        "If you don't struggle with pricing, sales, or business structure, the Guardian's core tension isn't present",
        "If you prioritize your own business goals as easily as you prioritize other people's needs, this isn't you",
        "If your relational generosity doesn't come at the expense of your business traction, you may be an Architect or Journeyman who happens to be relationally strong",
        "The Guardian's defining feature is that relational strength and business weakness coexist, and the relational strength is part of what prevents the business from growing"
      ],
      reflectionPrompts: [
        "How much revenue did you leave on the table in the past 12 months through undercharging, over-delivering, discounting, or doing free work? Be specific. What could that money have funded in your life or your family's life?",
        "When you imagine charging what your work is genuinely worth and enforcing that price without apology, what emotion comes up? Guilt? Fear? Unworthiness? Where did you learn that earning well and caring deeply couldn't coexist?",
        "Who in your life benefits from you staying small? Not maliciously, but structurally. Whose comfort depends on you being available, affordable, and accommodating? What would shift in those relationships if your business demanded more of your time and attention?",
        "Think of someone you admire who runs a thriving business AND shows up with genuine warmth and generosity. They exist. What do they do differently from you? Is it possible they're not less caring than you, but simply better boundaried?",
        "If you could build the business infrastructure your gifts deserve, systems that let you serve more people at a higher level without burning out, would the people in your life support that? If so, what's actually stopping you? If not, what does that tell you about those relationships?"
      ],
      relationshipToOtherArchetypes:
        "The Guardian is the mirror image of The Ghost and The Performer. Where those archetypes over-invest in Business at the expense of Self or Relationships, The Guardian over-invests in Relationships at the expense of Business. The Guardian's most common improvement path is to The Journeyman, which happens when they build Business fundamentals while maintaining relational strength. The most common lateral shift is to Seeker, which happens when a Guardian turns inward and starts doing personal development work but still doesn't build the business. The most common regression is to Phoenix, which happens when the financial strain of an underbuilt business eventually collapses the personal and relational stability that was holding everything together.",
      commonDrivers:
        "The Guardian is most commonly paired with The Builder's Gap (strong foundation, unbuilt business machine), The Pleaser's Bind (can't say no, can't prioritize own work), or The Martyr Complex (believes sacrifice is required for service). When you see a Guardian, the driver explains WHY the business hasn't been built. The Builder's Gap Guardian has the aligned model but hasn't constructed the infrastructure. The Pleaser Guardian keeps giving away the time they should be spending on business. The Martyr Guardian believes that profiting from their gifts would somehow taint the gift."
    },
    "The Seeker": {
      howToKnowThisIsYou: [
        "You could talk about your values, your patterns, and your growth edge with impressive clarity, but your business results don't reflect that insight",
        "You've invested significant time and money in self-development: courses, books, coaching, therapy, retreats, journaling practices",
        "You often feel like you're one more insight away from everything clicking, but that feeling has persisted for months or years",
        "Your friends might describe you as 'the most self-aware person I know' and you feel a mix of pride and frustration at that label",
        "You start business initiatives with energy and clarity but lose momentum before they produce results",
        "You understand WHY you procrastinate, what your inner critic is protecting, and what your attachment style is, but that understanding hasn't translated into consistent output",
        "You're more comfortable in reflection mode than in execution mode"
      ],
      howToKnowThisIsntYou: [
        "If you're not particularly self-aware and your struggles feel confusing rather than understood, this isn't you",
        "If your business is executing well but your personal life is suffering, you're likely a Performer or Ghost",
        "If you lack self-awareness AND lack business traction, you may be in The Fog or The Phoenix",
        "If your execution is strong but pointed in the wrong direction, you're The Engine",
        "The Seeker's defining feature is high self-knowledge paired with low external output. If both are low or both are high, a different archetype fits better."
      ],
      reflectionPrompts: [
        "Make a list of every self-development program, course, book, coach, or retreat you've invested in over the past 3 years. Next to each one, write the specific, measurable business outcome it produced. If most entries are blank, what does that pattern tell you about how you've been using personal growth?",
        "What would you lose if you stopped seeking and started building? Not what you'd gain. What would you lose? Is it the identity of being a 'growth-oriented person'? The safety of always preparing? The excuse of not being ready yet?",
        "If you were banned from consuming any self-development content for 90 days, no books, no podcasts, no courses, no frameworks, and you could only execute on what you already know, what would you build? You already know the answer. Why haven't you built it?",
        "Is there a part of you that believes understanding a problem IS solving it? Where did you learn that insight equals progress? What if the final lesson you need to learn is that the only remaining teacher is action?",
        "Think about someone you know who has less self-awareness than you but better business results. What do they do that you don't? The answer is almost certainly simpler and less elegant than you'd like it to be."
      ],
      relationshipToOtherArchetypes:
        "The Seeker is the inverse of The Performer. The Performer acts without enough self-awareness. The Seeker is aware without enough action. In theory, combining the Seeker's insight with the Performer's execution would create an Architect. The Seeker's most common improvement path is to The Journeyman, which happens when they finally translate their self-knowledge into consistent business output. The most common lateral shift is to Guardian, which happens when a Seeker channels their energy into relationships and service instead of business building, adding relational richness but still not solving the business gap. The most common regression is to Drifter, which happens when the Seeker's awareness becomes so generalized that it loses its edge and everything settles into comfortable mediocrity.",
      commonDrivers:
        "The Seeker is most commonly paired with The Perfectionist's Prison (knows the plan but can't ship because of fear of judgment), The Fog (has self-awareness but can't commit to a direction), or The Builder's Gap (has the personal foundation but hasn't built the business machine). When you see a Seeker, the driver explains the specific block between insight and action. The Perfectionist Seeker is afraid of imperfection. The Fog Seeker can't choose among too many options. The Builder's Gap Seeker has the aligned model but resists the operational work of building it."
    },
    "The Drifter": {
      howToKnowThisIsYou: [
        "Nothing in your life is in crisis but nothing excites you either",
        "If someone asked what you're building toward, your answer would be vague or change depending on the day",
        "You've been at roughly this level of performance for a while and the plateau has started to feel normal",
        "You don't have a strong pull toward any single priority. Everything feels equally important or equally unimportant.",
        "You're not unhappy enough to change and not fulfilled enough to feel proud",
        "You describe your life and business as 'fine' or 'good enough' more often than you'd like to admit",
        "The idea of going all-in on one thing makes you uncomfortable because it means letting other things slide"
      ],
      howToKnowThisIsntYou: [
        "If any arena is clearly strong while another is clearly struggling, you're not a Drifter. You have an imbalance, not a plateau.",
        "If your composite score is above 7.5, you're likely The Journeyman, not a Drifter",
        "If your composite is below 4.5, you're likely a Phoenix",
        "If you have clear passion and direction but can't execute, you're a Seeker or Perfectionist's Prison, not a Drifter",
        "The Drifter's defining feature is the absence of extremes. If you feel strong emotions about your situation, whether frustration, ambition, fear, or excitement, a different archetype probably fits."
      ],
      reflectionPrompts: [
        "When was the last time you felt genuinely fired up about something in your business or life? Not interested. Not curious. Actually on fire. If you can't remember, how long have you been drifting?",
        "If someone forced you to pick one arena and make it exceptional within 6 months, even if the other two stayed where they are, which would you choose? The one that came to mind first is probably the one you've been afraid to commit to. Why?",
        "What are you getting from staying in the middle? Safety from failure? Protection from judgment? The ability to keep all options open? What would you have to give up to break out of this plateau?",
        "Imagine two versions of your life five years from now. Version A: everything is roughly the same as it is today. Version B: you went all-in on something and it worked. Now imagine Version C: you went all-in and it didn't work. Which version scares you most? If C scares you more than A, you've found the fear that's keeping you stuck.",
        "Who in your life is comfortable with you staying exactly where you are? And who would challenge you to want more? Which group do you spend more time with?"
      ],
      relationshipToOtherArchetypes:
        "The Drifter is most commonly confused with The Journeyman because both show relatively balanced scores. The difference is altitude. The Journeyman is balanced near the top with a composite of 7.0+ and specific domains in the Dialed range. The Drifter is balanced in the middle with Functional-range scores and nothing exceptional. The Drifter's most common improvement path is to any of the imbalance archetypes first (Guardian, Seeker, Performer) as they start investing heavily in one area, and then to The Journeyman as the other areas catch up. Going directly from Drifter to Architect is rare because it requires simultaneous improvement across all three arenas. The most common regression is to Phoenix, which happens when the comfortable middle erodes and multiple areas slide below the line.",
      commonDrivers:
        "The Drifter is most commonly paired with The Fog (can't commit to a direction), The Builder's Gap (has values but hasn't built the machine), or no driver at all. The Fog Drifter can't choose what to focus on. The Builder's Gap Drifter has relational and personal strength but hasn't translated it into business. When a Drifter shows no driver, it often means the plateau isn't driven by a deep psychological pattern but by a lack of strategic commitment. That's a Phase 2 problem, not a Phase 3 problem."
    },
    "The Engine": {
      howToKnowThisIsYou: [
        "You're proud of your work ethic and discipline but quietly unsure whether you're building the right thing",
        "You have a nagging feeling that if your business succeeded fully as currently designed, you wouldn't actually want the life it creates",
        "You execute consistently but feel a subtle dread or resistance when you think about what's ahead at scale",
        "You've noticed that you procrastinate specifically on the big strategic decisions while executing perfectly on the daily tasks",
        "People praise your output and you feel a disconnect because the output doesn't feel meaningful",
        "You've considered pivoting your model but the idea of starting over after building so much momentum feels wasteful",
        "Your body or emotions are sending signals that something is off, but your results keep telling you to stay the course"
      ],
      howToKnowThisIsntYou: [
        "If your execution is inconsistent or weak, you're not The Engine. The Engine's defining feature is strong execution pointed in the wrong direction.",
        "If your business model feels aligned and you're excited about what success would look like, the ecological misalignment isn't present",
        "If you struggle with discipline, consistency, and follow-through, other archetypes fit better",
        "If all your Business domains are low, not just Ecology and Strategy, you're more likely a Guardian, Seeker, or Phoenix",
        "The Engine is specifically about capability without alignment. If you lack the capability, or if you have both capability and alignment, look elsewhere."
      ],
      reflectionPrompts: [
        "Imagine your business succeeds completely on its current trajectory. You hit every revenue target, every growth milestone, everything you're currently working toward. Describe the life that creates. What does a typical Tuesday look like? Now ask yourself honestly: do you want that Tuesday?",
        "If you could keep your execution discipline but redirect it toward anything, with zero switching cost and zero judgment from anyone, what would you build? How different is that from what you're currently building?",
        "What would you have to admit to yourself if you acknowledged that the current model isn't right? What sunk cost, what identity, what external expectation would you have to let go of?",
        "Think about the resistance you feel toward the big strategic decisions you keep deferring. Is that resistance laziness, or is it intelligence? Is part of you refusing to commit fully to a direction it knows isn't right?",
        "If a trusted advisor looked at your business model and said 'This is well-executed but it's not the right model for who you are,' how would you feel? Defensive? Relieved? If relieved, you already have your answer."
      ],
      relationshipToOtherArchetypes:
        "The Engine is most commonly confused with The Performer because both show strong execution. The difference is the source of tension. The Performer's problem is sustainability. They're building the right thing but burning themselves out doing it. The Engine's problem is direction. They're executing sustainably but building the wrong thing. The Engine's most common improvement path is to Performer first (they fix the strategy but the execution intensity creates personal strain), then to The Journeyman as they rebalance. Going directly to The Journeyman requires simultaneously fixing the model AND maintaining the execution, which is possible but demanding. The most common regression is to Phoenix, which happens when the misalignment eventually produces a crisis of meaning that collapses motivation and output simultaneously.",
      commonDrivers:
        "The Engine is most commonly paired with The Imposter Loop (building something they don't believe they deserve or that doesn't feel authentically theirs), The Escape Artist (using execution to avoid confronting the strategic question), or The Achiever's Trap (can't stop executing even when the direction is wrong because output is identity). When you see an Engine, the driver explains WHY they keep building in the wrong direction. The Imposter Engine doesn't trust themselves to choose correctly. The Escape Engine is avoiding the vulnerability of strategic honesty. The Achiever Engine can't stop producing long enough to question the trajectory."
    },
    "The Phoenix": {
      howToKnowThisIsYou: [
        "Multiple areas of your life feel broken simultaneously and you're not sure which one to fix first",
        "You feel overwhelmed more often than not, and the overwhelm has become your baseline rather than an exception",
        "You used to be more capable than this. You can remember a version of yourself that functioned at a higher level, and the distance between then and now is painful.",
        "Getting through the day takes most of your energy. There's little left for building, planning, or connecting.",
        "You may be hiding how bad things actually are from the people around you",
        "You took this assessment and the scores confirmed what you already feared but hadn't quantified",
        "Despite all of this, you're still here. You showed up. You answered honestly. That means something."
      ],
      howToKnowThisIsntYou: [
        "If only one arena is struggling while the others are solid, you're likely an imbalance archetype, not a Phoenix",
        "If your composite is above 5.0, the crisis isn't systemic enough for this classification",
        "If you feel frustrated but capable, that's closer to a Drifter, Seeker, or Guardian than a Phoenix",
        "If your primary emotion is boredom rather than overwhelm, look at The Drifter",
        "The Phoenix is defined by the depth and breadth of the deficit. If the struggles are localized rather than pervasive, a different archetype fits."
      ],
      reflectionPrompts: [
        "If you could stabilize just ONE thing in your life right now, the one change that would give you the most relief and the most capacity to address everything else, what would it be? Don't overthink it. The first answer is probably right. That's your starting point.",
        "What are you carrying right now that nobody fully knows about? Not the version you share with people. The full weight of it. What would it feel like to put even part of that weight down?",
        "When did this start? Can you identify the event, the period, or the decision where things began to compound? Understanding the origin doesn't fix it, but it can help you stop blaming yourself for being in a situation that may have been triggered by something outside your control.",
        "What is one thing you were doing when you were functioning at your best that you've completely stopped doing? Not a complicated system. A simple habit or practice that used to ground you. Could you restart it this week?",
        "What would you need to hear from someone who truly understood your situation? Say it to yourself right now. Write it down. You probably already know what you need. You just need permission to start."
      ],
      relationshipToOtherArchetypes:
        "The Phoenix is the crisis state that any other archetype can fall into when enough things break simultaneously. It's not a personality type. It's a situational reality. The most common paths INTO the Phoenix are from The Performer (burnout collapses everything), The Ghost (isolation compounds into emotional crisis), and The Engine (misalignment produces a crisis of meaning). The most common paths OUT of the Phoenix are to The Guardian (relationships stabilize first), The Seeker (self-awareness rebuilds first), or The Drifter (everything stabilizes to a functional-but-flat baseline). Going from Phoenix directly to Architect or The Journeyman in a single assessment period would be extraordinary and would represent one of the most significant transformations a person can make.",
      commonDrivers:
        "The Phoenix often shows no driver because the crisis is too broad for any single driver pattern to emerge clearly. When a driver is detected, it's usually the pattern that CAUSED the collapse rather than the current state: The Achiever's Trap (burned out from unsustainable output), The Escape Artist (whatever was being avoided finally caught up), or The Martyr Complex (gave everything away until there was nothing left). Identifying the driver that preceded the Phoenix state is valuable for coaching because it reveals what not to rebuild when the recovery begins."
    }
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function renderInlineStrongHtml(value) {
    return escapeHtml(value)
      .replace(/&lt;strong&gt;/g, "<strong>")
      .replace(/&lt;\/strong&gt;/g, "</strong>");
  }

  function getArchetypeSectionId(archetype) {
    return "archetype-" + String(archetype)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function normalizeArchetypeName(archetype) {
    return archetype && window.VAPI_ARCHETYPES && window.VAPI_ARCHETYPES[archetype]
      ? archetype
      : null;
  }

  function getDriverSectionId(driver) {
    return "driver-" + String(driver)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function getLibrarySurface(accent, strength) {
    if (accent && strength === "strong") {
      return "background:linear-gradient(180deg," + accent + "12 0%, var(--ap-surface, #ffffff) 68%);";
    }
    if (accent && strength === "soft") {
      return "background:linear-gradient(180deg," + accent + "0D 0%, var(--ap-surface, #ffffff) 72%);";
    }
    return "background:var(--ap-surface, #ffffff);";
  }

  function buildArchetypeAnchor(archetype) {
    return '<a href="#' + getArchetypeSectionId(archetype) + '" class="font-semibold text-[var(--ap-accent)] hover:underline">' + escapeHtml(archetype) + "</a>";
  }

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function buildCommonDriversHtml(text, driverLibraryHref) {
    var hrefBase = driverLibraryHref || "/portal/driver-library";
    var driverContent = window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_CONTENT
      ? window.VAPI_DRIVERS.DRIVER_CONTENT
      : null;
    if (!driverContent) return escapeHtml(text);

    var driverNames = Object.keys(driverContent).sort(function(a, b) {
      return b.length - a.length;
    });
    if (!driverNames.length) return escapeHtml(text);

    var matcher = new RegExp("(" + driverNames.map(escapeRegex).join("|") + ")", "g");
    return text
      .split(matcher)
      .filter(Boolean)
      .map(function(part) {
        if (driverContent[part]) {
          return '<a href="' + escapeHtml(hrefBase) + "#" + getDriverSectionId(part) + '" class="font-semibold text-[var(--ap-accent)] hover:underline">' + escapeHtml(part) + "</a>";
        }
        return escapeHtml(part);
      })
      .join("");
  }

  function buildNavigation(currentArchetype, options) {
    var opts = options || {};
    var stickyTopStyle = opts.sidebarTopStyle || "";
    if (!stickyTopStyle && opts.sidebarTopPx) stickyTopStyle = "top:" + opts.sidebarTopPx + "px;";
    if (!stickyTopStyle && opts.sidebarTopClass === "top-24") stickyTopStyle = "top:6rem;";
    if (!stickyTopStyle) stickyTopStyle = "top:1.5rem;";
    function buildDesktopItem(archetypeName) {
      var accent = window.VAPI_ARCHETYPES && window.VAPI_ARCHETYPES[archetypeName]
        ? window.VAPI_ARCHETYPES[archetypeName].color_accent
        : "var(--ap-accent)";
      var isCurrent = archetypeName === currentArchetype;
      return (
        '<a href="#' + getArchetypeSectionId(archetypeName) + '" class="flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors hover:border-[var(--ap-accent)]/30" style="' +
          (isCurrent ? "border-color:" + accent + "55;background:" + accent + "16;" : "") +
        '">' +
          '<div class="h-6 w-6 shrink-0" style="color:' + accent + ';">' +
            (window.VAPI_ARCHETYPE && window.VAPI_ARCHETYPE.getIcon ? window.VAPI_ARCHETYPE.getIcon(archetypeName, accent) : "") +
          "</div>" +
          '<span class="text-sm leading-snug text-[var(--ap-primary)]" style="font-weight:' + (isCurrent ? "700" : "500") + ';">' + escapeHtml(archetypeName) + "</span>" +
        "</a>"
      );
    }

    var chevronRight =
      '<svg class="h-5 w-5 shrink-0 text-[var(--ap-muted)]" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';
    return (
      '<div class="portal-library-mobile-nav md:hidden">' +
        '<div id="portal-lib-mobile-back" class="mb-4 hidden items-center">' +
          '<button type="button" id="portal-lib-mobile-back-btn" class="inline-flex items-center gap-2 rounded-full border border-[var(--ap-border)] bg-[var(--ap-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--ap-primary)] shadow-sm">' +
            '<svg class="h-5 w-5 shrink-0" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>' +
            "All archetypes" +
          "</button>" +
        "</div>" +
        '<div id="portal-lib-mobile-index" class="overflow-hidden rounded-3xl border border-[var(--ap-border)] shadow-sm" style="background:var(--ap-surface, #ffffff);">' +
          '<div class="border-b border-[var(--ap-border)] bg-gradient-to-r from-[var(--ap-accent)]/[0.07] via-transparent to-transparent px-5 py-4">' +
            '<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Explore</p>' +
            '<p class="mt-1 font-semibold text-xl tracking-tight text-[var(--ap-primary)]" style="font-family: Cormorant Garamond, serif;">Pick an archetype</p>' +
            '<p class="mt-1 text-sm text-[var(--ap-secondary)]">Open a profile, read deeply, then come back here for the next one.</p>' +
          "</div>" +
          '<div class="grid grid-cols-1 gap-px bg-[var(--ap-border)] sm:grid-cols-2">' +
            ARCHETYPE_ORDER.map(function(archetypeName) {
              var meta = window.VAPI_ARCHETYPES && window.VAPI_ARCHETYPES[archetypeName];
              var accent = meta && meta.color_accent ? meta.color_accent : "#FF6B1A";
              var isCurrent = archetypeName === currentArchetype;
              var tag = meta && meta.tagline ? meta.tagline : "";
              var sid = getArchetypeSectionId(archetypeName);
              return (
                '<button type="button" class="portal-lib-pick flex w-full items-start gap-4 p-4 text-left sm:p-5" data-lib-section="' + escapeHtml(sid) + '" style="background:var(--ap-surface, #ffffff);' +
                  (isCurrent ? "background-color:color-mix(in srgb," + accent + " 8%, var(--ap-surface, #ffffff));" : "") +
                '">' +
                  '<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border" style="background:' + accent + '14;border-color:' + accent + '40;">' +
                    (window.VAPI_ARCHETYPE && window.VAPI_ARCHETYPE.getIcon ? window.VAPI_ARCHETYPE.getIcon(archetypeName, accent) : "") +
                  "</div>" +
                  '<div class="min-w-0 flex-1">' +
                    '<div class="flex items-start justify-between gap-2">' +
                      '<span class="font-semibold leading-snug text-[var(--ap-primary)]">' + escapeHtml(archetypeName) + "</span>" +
                      chevronRight +
                    "</div>" +
                    (tag
                      ? '<p class="mt-1.5 line-clamp-2 text-xs leading-relaxed text-[var(--ap-secondary)] sm:text-sm">' + escapeHtml(tag) + "</p>"
                      : "") +
                    (isCurrent
                      ? '<span class="mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide" style="background:' + accent + '20;color:' + accent + ';">Your pattern</span>'
                      : "") +
                  "</div>" +
                "</button>"
              );
            }).join("") +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="portal-library-desktop-layout">' +
        '<aside class="portal-library-desktop-sidebar">' +
          '<div class="portal-library-sidebar-sticky rounded-3xl border border-[var(--ap-border)] p-4 shadow-sm" style="' + stickyTopStyle + 'background:var(--ap-surface, #ffffff);">' +
            '<p class="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">All Archetypes</p>' +
            '<nav class="space-y-2">' +
              ARCHETYPE_ORDER.map(buildDesktopItem).join("") +
            "</nav>" +
          "</div>" +
        "</aside>" +
        '<div id="archetype-library-sections" class="portal-library-desktop-sections space-y-8"></div>' +
      "</div>"
    );
  }

  function buildSection(archetypeName, currentArchetype, driverLibraryHref) {
    var full = window.VAPI_ARCHETYPES ? window.VAPI_ARCHETYPES[archetypeName] : null;
    var extras = ARCHETYPE_LIBRARY_CONTENT[archetypeName];
    var accent = full && full.color_accent ? full.color_accent : "#FF6B1A";
    var isCurrent = archetypeName === currentArchetype;

    if (!full || !extras) return "";

    return (
      '<section id="' + getArchetypeSectionId(archetypeName) + '" class="scroll-mt-24 rounded-3xl border border-[var(--ap-border)] p-6 shadow-sm sm:p-8" style="background:linear-gradient(180deg,' + accent + '12 0%, var(--ap-surface, #ffffff) 32%);">' +
        '<div>' +
          '<div class="flex flex-col gap-5 sm:flex-row sm:items-start">' +
            '<div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border" style="background:' + accent + '14;border-color:' + accent + '33;">' +
              (window.VAPI_ARCHETYPE && window.VAPI_ARCHETYPE.getIcon ? window.VAPI_ARCHETYPE.getIcon(archetypeName, accent) : "") +
            "</div>" +
            '<div class="min-w-0 space-y-3">' +
              '<h2 class="text-3xl font-bold tracking-tight text-[var(--ap-primary)] sm:text-4xl">' + escapeHtml(archetypeName) + "</h2>" +
              '<p class="text-sm italic leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(full.tagline || "") + "</p>" +
            "</div>" +
          "</div>" +
          (isCurrent
            ? '<div class="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold" style="background:' + accent + '16;border-color:' + accent + '33;color:' + accent + ';">This is your current operating pattern.</div>'
            : "") +
          '<div class="mt-8 space-y-8">' +
            '<div class="space-y-2">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">The Pattern</h3>' +
              '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + renderInlineStrongHtml(full.description || "") + "</p>" +
            "</div>" +
            '<div class="space-y-2">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Your Strength</h3>' +
              '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(full.strength || "") + "</p>" +
            "</div>" +
            '<div class="space-y-2">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Your Shadow</h3>' +
              '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(full.shadow || "") + "</p>" +
            "</div>" +
            '<div class="space-y-2">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">The Constraint</h3>' +
              '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(full.constraint || "") + "</p>" +
            "</div>" +
            '<div class="space-y-2">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Your Growth Path</h3>' +
              '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(full.growth_path || "") + "</p>" +
            "</div>" +
            '<div class="rounded-2xl border px-5 py-4" style="background:' + accent + '10;border-color:' + accent + '24;">' +
              '<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Where this gets addressed</p>' +
              '<p class="mt-2 text-sm leading-relaxed text-[var(--ap-primary)]">' + escapeHtml(full.program_phase || "") + "</p>" +
            "</div>" +
            '<div class="space-y-3">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How to Know If This Is You</h3>' +
              '<ul class="space-y-2 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
                extras.howToKnowThisIsYou.map(function(item) {
                  return '<li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ap-accent)]"></span><span>' + escapeHtml(item) + "</span></li>";
                }).join("") +
              "</ul>" +
            "</div>" +
            '<div class="space-y-3">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How to Know If This Isn\'t You</h3>' +
              '<ul class="space-y-2 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
                extras.howToKnowThisIsntYou.map(function(item) {
                  return '<li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ap-border)]"></span><span>' + escapeHtml(item) + "</span></li>";
                }).join("") +
              "</ul>" +
            "</div>" +
            '<div class="space-y-3">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Reflection Prompts</h3>' +
              '<p class="text-sm leading-relaxed text-[var(--ap-secondary)]">Sit with these questions honestly. Write your answers somewhere private.</p>' +
              '<ol class="space-y-3 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
                extras.reflectionPrompts.map(function(prompt, index) {
                  return '<li class="flex gap-3"><span class="font-semibold text-[var(--ap-primary)]">' + (index + 1) + '.</span><span>' + escapeHtml(prompt) + "</span></li>";
                }).join("") +
              "</ol>" +
            "</div>" +
            '<div class="space-y-2">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How This Relates to Other Archetypes</h3>' +
              '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(extras.relationshipToOtherArchetypes) + "</p>" +
            "</div>" +
            '<div class="space-y-2">' +
              '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Drivers Most Often Seen With This Archetype</h3>' +
              '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + buildCommonDriversHtml(extras.commonDrivers, driverLibraryHref) + "</p>" +
            "</div>" +
          "</div>" +
        "</div>" +
      "</section>"
    );
  }

  function buildPage(options) {
    var opts = options || {};
    var results = opts.results || null;
    var currentArchetype = normalizeArchetypeName(
      (results && results.archetype) ||
      (results && window.VAPI_ARCHETYPE && window.VAPI_ARCHETYPE.determine ? window.VAPI_ARCHETYPE.determine(results) : null)
    );
    var takeAssessmentHref = opts.takeAssessmentHref || "/assessment";
    var programHref = opts.programHref || "https://jakesebok.com/work-with-me";
    var driverLibraryHref = opts.driverLibraryHref || "/portal/driver-library";
    var currentAccent = currentArchetype && window.VAPI_ARCHETYPES && window.VAPI_ARCHETYPES[currentArchetype]
      ? window.VAPI_ARCHETYPES[currentArchetype].color_accent
      : "#FF6B1A";

    var html =
      '<section id="portal-lib-intro" class="rounded-3xl border border-[var(--ap-border)] p-6 shadow-sm sm:p-8" style="background:var(--ap-surface, #ffffff);">' +
        '<div>' +
          '<p class="text-sm font-medium uppercase tracking-[0.28em] text-[var(--ap-accent)]">Archetype Library</p>' +
          '<h1 class="mt-3 text-4xl font-bold tracking-tight text-[var(--ap-primary)] sm:text-5xl">' + escapeHtml(ARCHETYPE_LIBRARY_TITLE) + "</h1>" +
          '<p class="mt-4 max-w-4xl text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(ARCHETYPE_LIBRARY_SUBTITLE) + "</p>";

    if (currentArchetype) {
      html += '<div class="mt-6 rounded-2xl border px-5 py-4 text-sm leading-relaxed text-[var(--ap-primary)]" style="background:' + currentAccent + '12;border-color:' + currentAccent + '26;">Your current archetype: ' + buildArchetypeAnchor(currentArchetype) + ".</div>";
    } else {
      html += '<div class="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--ap-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between" style="background:var(--ap-surface, #ffffff);"><p class="text-sm leading-relaxed text-[var(--ap-secondary)]">' + escapeHtml(ARCHETYPE_LIBRARY_EMPTY_RESULTS_BANNER) + '</p><a href="' + escapeHtml(takeAssessmentHref) + '" class="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ap-accent)] hover:underline">Take the Assessment <span aria-hidden="true">→</span></a></div>';
    }

    html += "</div></section>";
    html += buildNavigation(currentArchetype, opts);
    html += '<section id="portal-lib-footer" class="rounded-3xl border border-[var(--ap-border)] p-6 shadow-sm sm:p-8" style="background:var(--ap-surface, #ffffff);">' +
      '<h2 class="text-3xl font-bold tracking-tight text-[var(--ap-primary)]">' + escapeHtml(ARCHETYPE_LIBRARY_FOOTER_HEADING) + "</h2>" +
      '<p class="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(ARCHETYPE_LIBRARY_FOOTER_TEXT) + "</p>" +
      '<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">' +
        '<a href="' + escapeHtml(programHref) + '" class="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ap-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e55a0f]">Learn About the Program <span aria-hidden="true">→</span></a>' +
        '<a href="' + escapeHtml(takeAssessmentHref) + '" class="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--ap-accent)] hover:underline">Retake the VAPI Assessment <span aria-hidden="true">→</span></a>' +
        '<a href="' + escapeHtml(driverLibraryHref) + '" class="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--ap-accent)] hover:underline">Explore the 9 Driver Patterns <span aria-hidden="true">→</span></a>' +
      "</div>" +
    "</section>";

    return {
      html: html,
      currentArchetype: currentArchetype
    };
  }

  function populateSections(root, currentArchetype, driverLibraryHref) {
    if (!root) return;
    root.innerHTML = ARCHETYPE_ORDER.map(function(archetypeName) {
      return buildSection(archetypeName, currentArchetype, driverLibraryHref);
    }).join("");
  }

  function attachArchetypeLibraryMobileNav(pageContentEl) {
    if (!pageContentEl) return;
    var mm = window.matchMedia("(max-width: 767px)");
    function isMobile() {
      return mm.matches;
    }
    var indexEl = pageContentEl.querySelector("#portal-lib-mobile-index");
    var backBar = pageContentEl.querySelector("#portal-lib-mobile-back");
    var backBtn = pageContentEl.querySelector("#portal-lib-mobile-back-btn");
    var sectionsRoot = pageContentEl.querySelector("#archetype-library-sections");
    var intro = pageContentEl.querySelector("#portal-lib-intro");
    var footer = pageContentEl.querySelector("#portal-lib-footer");
    if (!indexEl || !backBar || !backBtn || !sectionsRoot) return;

    function clearActive() {
      Array.prototype.forEach.call(sectionsRoot.querySelectorAll("section"), function(s) {
        s.classList.remove("portal-lib-active-mobile");
      });
    }

    function showList() {
      document.body.classList.remove("portal-lib-archetype-detail");
      clearActive();
      indexEl.classList.remove("hidden");
      backBar.classList.add("hidden");
      backBar.classList.remove("flex");
      if (intro) intro.classList.remove("hidden");
      if (footer) footer.classList.remove("hidden");
      window.scrollTo(0, 0);
      try {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      } catch (e) {}
    }

    function showDetail(sectionId) {
      if (!isMobile()) return;
      document.body.classList.add("portal-lib-archetype-detail");
      clearActive();
      var target = document.getElementById(sectionId);
      if (target) target.classList.add("portal-lib-active-mobile");
      indexEl.classList.add("hidden");
      backBar.classList.remove("hidden");
      backBar.classList.add("flex");
      if (intro) intro.classList.add("hidden");
      if (footer) footer.classList.add("hidden");
      window.scrollTo(0, 0);
      try {
        history.replaceState(null, "", "#" + sectionId);
      } catch (e) {}
    }

    function syncMode() {
      if (!isMobile()) {
        document.body.classList.remove("portal-lib-archetype-detail");
        clearActive();
        indexEl.classList.remove("hidden");
        backBar.classList.add("hidden");
        backBar.classList.remove("flex");
        if (intro) intro.classList.remove("hidden");
        if (footer) footer.classList.remove("hidden");
        return;
      }
      var h = (window.location.hash || "").replace(/^#/, "");
      if (h && document.getElementById(h) && sectionsRoot.querySelector("#" + h)) {
        showDetail(h);
      } else {
        showList();
      }
    }

    backBtn.addEventListener("click", showList);

    indexEl.addEventListener("click", function(e) {
      var btn = e.target.closest("[data-lib-section]");
      if (!btn || !isMobile()) return;
      var sid = btn.getAttribute("data-lib-section");
      if (sid) showDetail(sid);
    });

    pageContentEl.addEventListener("click", function(e) {
      if (!isMobile()) return;
      var a = e.target.closest('a[href^="#archetype-"]');
      if (!a) return;
      var id = (a.getAttribute("href") || "").replace(/^#/, "");
      if (id && document.getElementById(id)) {
        e.preventDefault();
        showDetail(id);
      }
    });

    mm.addEventListener("change", syncMode);
    window.addEventListener("hashchange", syncMode);
    syncMode();
  }

  window.VAPI_ARCHETYPE_LIBRARY = {
    ARCHETYPE_ORDER: ARCHETYPE_ORDER,
    ARCHETYPE_LIBRARY_CONTENT: ARCHETYPE_LIBRARY_CONTENT,
    ARCHETYPE_LIBRARY_TITLE: ARCHETYPE_LIBRARY_TITLE,
    ARCHETYPE_LIBRARY_SUBTITLE: ARCHETYPE_LIBRARY_SUBTITLE,
    getSectionId: getArchetypeSectionId,
    buildPage: buildPage,
    populateSections: populateSections,
    attachMobileNav: attachArchetypeLibraryMobileNav
  };
})();
