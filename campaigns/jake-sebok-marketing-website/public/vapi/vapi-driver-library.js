(function() {
  var ALIGNED_MOMENTUM_NAME = "Aligned Momentum";
  var DRIVER_ORDER = [
    "The Achiever's Trap",
    "The Protector",
    "The Pleaser's Bind",
    "The Escape Artist",
    "The Perfectionist's Prison",
    "The Imposter Loop",
    "The Martyr Complex",
    "The Fog",
    "The Scattered Mind",
    "The Builder's Gap"
  ];

  var DRIVER_LIBRARY_TITLE = "The 10 Driver Patterns + Aligned Momentum";
  var DRIVER_LIBRARY_SUBTITLE =
    "Underneath every score pattern is an internal operating system. For most founders, that system includes a belief, a fear, and a coping strategy that silently works against their goals. These are the 10 most common dysfunction drivers. But when no dysfunction driver is present and your scores reflect broad, genuine strength, something different appears: Aligned Momentum. That's the state every driver pattern is building toward.";
  var DRIVER_LIBRARY_EMPTY_RESULTS_BANNER =
    "Take the VAPI Assessment to discover which of these patterns is most likely driving your results.";
  var DRIVER_LIBRARY_FOOTER_HEADING =
    "Ready to Address What's Driving Your Pattern?";
  var DRIVER_LIBRARY_FOOTER_TEXT =
    "Understanding your driver is the first step. Changing it requires structured support. The Aligned Power Program is a 12-month coaching partnership designed to identify, address, and rewire the internal patterns keeping you stuck.";
  var DRIVER_LIBRARY_DIVIDER_HEADING = "The 10 Dysfunction Drivers";
  var DRIVER_LIBRARY_DIVIDER_TEXT =
    "These are the internal patterns that silently work against founders. Each one represents a belief, a fear, and a coping strategy that produces predictable score signatures. Aligned Momentum is what becomes possible when these patterns are identified and addressed.";

  var ALIGNED_MOMENTUM_LIBRARY_CONTENT = {
    howToKnowThisIsYou: [
      "Your VAPI composite is 7.0 or above with no more than one domain significantly below the rest",
      "You don't recognize yourself in any of the 10 dysfunction drivers, or if you see traces, they feel like old patterns rather than current ones",
      "Your business results and your personal wellbeing don't feel like they're competing with each other",
      "You can sustain your current pace without running on adrenaline, guilt, or fear",
      "The way you work matches who you actually are. You're not performing a version of success that belongs to someone else.",
      "You have genuine relationships where you're known, not just respected",
      "Your internal voice is mostly honest and supportive rather than critical, fearful, or avoidant",
      "When stress comes, you recover. You don't spiral, shut down, or burn it all to the ground."
    ],
    howToKnowThisIsntYou: [
      "If reading the dysfunction drivers produced a strong \"that's me\" reaction to any of them, trust that reaction over the algorithm",
      "If your high scores are maintained through unsustainable effort, willpower, or performance rather than genuine alignment, the momentum isn't real",
      "If your life looks good on paper but doesn't feel good in your body, something the assessment didn't fully capture may be present",
      "If you're suppressing or numbing to maintain your scores rather than genuinely thriving, explore The Escape Artist and The Achiever's Trap more carefully",
      "Aligned Momentum should feel like relief when you read it, not like a performance you need to maintain"
    ],
    reflectionPrompts: [
      "What specific practices, boundaries, or decisions are most responsible for the alignment you've built? Name them concretely. These are the things you cannot afford to stop doing.",
      "When was the last time your alignment was tested by a major stressor, a business setback, a health scare, a relationship conflict? How did you respond? Did the system hold, or did you see cracks? What did you learn about where your alignment is strongest and where it's most fragile?",
      "If you could give your past self, the version of you that was operating from one of the dysfunction drivers, one piece of advice about what actually produced this state, what would it be? The answer reveals what you've learned that others haven't yet.",
      "What is the next edge for you? Aligned Momentum is not a finish line. Where do you feel the pull toward growth? What domain or arena, if deepened further, would expand what's possible for you?",
      "Who in your life needs what you've built? Not your business output. Your operating system. The way you've learned to align your internal world with your external results. How could you share that with others in a way that creates impact beyond your own life?"
    ],
    relationshipToOtherDrivers:
      "Aligned Momentum is not the opposite of any single driver. It's what emerges when no driver is dominant. Most founders who reach this state did so by identifying and addressing a specific dysfunction driver earlier in their journey. The Achiever learned to decouple identity from output. The Pleaser learned to hold boundaries. The Perfectionist learned to ship imperfectly. The Escape Artist turned around and faced what they were running from. Aligned Momentum is the result of that work, not the absence of having needed it. If you're here, you likely remember what it felt like to operate from a dysfunction pattern. That memory is valuable. It's what makes you capable of helping others who are still in it."
  };

  var DRIVER_LIBRARY_CONTENT = {
    "The Achiever's Trap": {
      howToKnowThisIsYou: [
        "You feel a physical restlessness or anxiety when you're not being productive",
        "You calculate your value to others based on what you've accomplished recently",
        "You can't take a full day off without guilt, justification, or sneaking in work",
        "You feel a crash in mood or self-worth after completing a big project, because the next one hasn't started yet",
        "You describe rest as \"earned\" and genuinely believe you haven't earned it most of the time",
        "Compliments about who you are (not what you've done) make you uncomfortable or feel undeserved",
        "When someone asks \"how are you?\" you instinctively answer with what you've been doing, not how you actually feel"
      ],
      howToKnowThisIsntYou: [
        "You can take a weekend completely off and feel recharged, not guilty",
        "You genuinely enjoy unstructured time and don't fill it with productivity",
        "Your self-worth stays stable during slow business periods",
        "You can celebrate a win without immediately pivoting to the next goal",
        "You don't feel threatened by the idea of producing less",
        "If this pattern sounds foreign or extreme to you, it's probably not your primary driver"
      ],
      reflectionPrompts: [
        "When was the last time you felt genuinely valuable while producing absolutely nothing? If you can't remember, what does that tell you?",
        "If you achieved every business goal you have and then stopped working for 6 months, how would you describe yourself to someone you met at a dinner party? What's left of your identity without the output?",
        "Who in your early life made you feel that love, attention, or approval was conditional on performance? What did you have to DO to earn their recognition?",
        "What's the longest you've gone without working in the past year? What happened internally during that time? What feelings surfaced that you normally outrun with activity?",
        "If your closest friend operated the way you operate and sacrificed what you sacrifice for productivity, what would you honestly say to them?"
      ],
      relationshipToOtherDrivers:
        "The Achiever's Trap is most commonly confused with The Escape Artist. Both produce high execution and neglected personal domains. The difference is the motivation underneath. The Achiever's Trap works because producing IS the reward. The identity is fused with output. The Escape Artist works because stopping is the threat. The activity is a shield against something they don't want to feel. Ask yourself: if you could guarantee that everything in your personal life was perfectly fine, would you still feel compelled to work at this intensity? If yes, that's The Achiever's Trap. If no, and the intensity is actually about avoiding what's waiting when you stop, that's The Escape Artist. These two drivers frequently show up together as primary and secondary."
    },
    "The Protector": {
      howToKnowThisIsYou: [
        "You have strong opinions about how things should be done and struggle to let others do things differently",
        "You'd rather do something yourself than risk someone else doing it wrong",
        "The idea of being emotionally vulnerable with a friend, partner, or coach makes you instinctively resist",
        "You trust systems, processes, and data more than you trust people's judgment, including your own intuition",
        "You rarely ask for help and feel uncomfortable when someone offers it unprompted",
        "Your closest relationships are the ones where you're in a position of authority, guidance, or control",
        "If your business systems broke tomorrow, you would feel a level of panic disproportionate to the actual financial impact"
      ],
      howToKnowThisIsntYou: [
        "You delegate easily and trust your team to handle things their way",
        "You're comfortable not knowing the outcome and can tolerate uncertainty",
        "You have multiple relationships where you're fully vulnerable and known",
        "You ask for help regularly without shame or discomfort",
        "You can name several times recently where you let someone else take the lead and felt fine about it",
        "Control isn't a word people who know you well would use to describe you"
      ],
      reflectionPrompts: [
        "What's the worst thing that could happen if you let someone else handle the most important thing in your business for a full week without checking in? Describe the scenario in detail. Now ask yourself: how likely is that scenario, really?",
        "When was the first time in your life that depending on someone led to disappointment or pain? How old were you? What did you decide about other people in that moment?",
        "Who in your life right now knows the full truth about your fears, doubts, and struggles? If the answer is nobody, what are you protecting by keeping that wall up?",
        "If vulnerability and control lived on a spectrum, where would you place yourself? Now where would the people closest to you place you? What's the gap between those two answers?",
        "What would it feel like to need someone and let them know you need them? Not strategically. Genuinely. What emotion comes up when you imagine that?"
      ],
      relationshipToOtherDrivers:
        "The Protector is most commonly confused with The Achiever's Trap. Both produce strong business execution. The difference is what's driving the discipline. The Achiever's Trap works because output is identity. The Protector works because structure is safety. An Achiever is chasing validation. A Protector is preventing chaos. Ask yourself: if you could guarantee that nothing would fall apart, that everything was secure and stable without your oversight, would you relax? If yes, that's The Protector. If you'd immediately look for the next thing to achieve, that's The Achiever's Trap. The Protector also overlaps with The Escape Artist in that both avoid emotional engagement, but the Protector does it through control while the Escape Artist does it through activity."
    },
    "The Pleaser's Bind": {
      howToKnowThisIsYou: [
        "You know what everyone around you needs but struggle to articulate what YOU need",
        "You say yes to requests before you've even checked whether you have the capacity",
        "You feel a wave of guilt or anxiety when you imagine saying no to someone who's counting on you",
        "You've kept clients, team members, or relationships past their expiration date because ending it would hurt them",
        "You measure how good a day was by how helpful you were to others, not by what you accomplished for yourself",
        "You notice that your schedule fills with other people's priorities and your own work happens in the margins",
        "When someone is disappointed in you, it doesn't just feel bad. It feels like a threat to your safety or belonging"
      ],
      howToKnowThisIsntYou: [
        "You say no frequently and without residual guilt",
        "Your priorities consistently come before other people's requests",
        "You can disappoint someone and recover quickly without replaying it",
        "Your schedule reflects YOUR goals, not a mosaic of everyone else's needs",
        "You don't track whether people are happy with you as a background process",
        "People who know you well would describe you as boundaried, not accommodating"
      ],
      reflectionPrompts: [
        "Think about the last time you said yes to something you wanted to say no to. What was the request, who made it, and what were you afraid would happen if you declined?",
        "If you stopped being helpful to everyone around you for 30 days and focused entirely on your own goals, what do you think would happen to your relationships? Now ask yourself: is that fear based on evidence or assumption?",
        "When you were growing up, what role did you play in your family? Were you the peacekeeper, the responsible one, the one who made sure everyone was okay? How is that role still running your life today?",
        "Make a list of the five things you spent the most energy on this week. How many of them were your priorities versus someone else's? What does that ratio tell you?",
        "What would it mean about you if someone you care about was disappointed in you and you didn't fix it? Sit with that. What's the belief underneath the urge to repair?"
      ],
      relationshipToOtherDrivers:
        "The Pleaser's Bind is most commonly confused with The Martyr Complex. Both involve self-sacrifice. The difference is the currency. The Pleaser sacrifices to maintain relationships and avoid rejection. The Martyr sacrifices because they believe suffering is noble or required. A Pleaser feels anxious when they stop giving. A Martyr feels guilty when they stop suffering. Ask yourself: if you could guarantee that everyone in your life would still love you even if you said no to everything for a month, would you feel relief? If yes, that's The Pleaser's Bind, because the giving is driven by fear of rejection. If the idea of a month without sacrifice makes you feel selfish or worthless rather than relieved, that's The Martyr Complex. The Pleaser's Bind also frequently pairs with The Imposter Loop as a secondary driver, because chronic people-pleasing erodes self-trust, which feeds the imposter pattern."
    },
    "The Escape Artist": {
      howToKnowThisIsYou: [
        "You fill every quiet moment with activity, noise, content, or tasks. Silence feels uncomfortable.",
        "You've been told by a partner or family member that you're not present even when you're physically there",
        "When you have a free evening with nothing planned, you feel restless rather than relaxed",
        "You know there's something you need to deal with (a conversation, a feeling, a decision) and you keep not dealing with it",
        "Your productivity increases when your personal life gets harder, not decreases",
        "You've caught yourself scrolling, working, or starting a new project specifically to avoid thinking about something",
        "If you're honest, you can name the thing you're running from. You just don't want to stop long enough to face it."
      ],
      howToKnowThisIsntYou: [
        "You can sit in silence comfortably for extended periods",
        "You regularly process difficult emotions through journaling, therapy, or conversation",
        "Your work output doesn't spike when your personal life gets stressful",
        "You don't use busyness as a coping mechanism",
        "You've had the hard conversations recently and you're not avoiding anything specific",
        "The idea of an unstructured weekend with nothing to do sounds appealing, not threatening"
      ],
      reflectionPrompts: [
        "If you stopped working and sat in a quiet room with no phone for two hours, what would you start thinking about? What feeling would surface first? Name it specifically.",
        "What is the conversation you most need to have that you haven't had? Who is it with and what are you afraid will happen if you have it?",
        "When did busyness first become your coping strategy? Can you trace it back to a specific period, event, or relationship where staying in motion became safer than being still?",
        "Your partner, child, or closest friend is watching you right now. They can see your schedule, your screen time, your habits. What would they say you're avoiding? Would they be right?",
        "If the thing you're running from could speak to you, what would it say? What does it need from you that you've been refusing to give?"
      ],
      relationshipToOtherDrivers:
        "The Escape Artist is most commonly confused with The Achiever's Trap. Both look identical from the outside: high output, intense pace, neglected personal life. The difference is the internal experience. The Achiever's Trap feels energized by work, at least in the moment. Work feels like home. The Escape Artist feels driven by work but not nourished by it. Work feels like running. The clearest diagnostic question is this: when you're productive, do you feel full or do you feel relieved? Full points to Achiever's Trap. Relieved (because you successfully avoided something) points to Escape Artist. The Escape Artist also frequently pairs with The Fog as a secondary driver, because constant motion prevents the stillness needed to clarify what you actually want."
    },
    "The Perfectionist's Prison": {
      howToKnowThisIsYou: [
        "You have projects, launches, emails, or offers that have been \"almost ready\" for weeks or months",
        "You revise things past the point of meaningful improvement because releasing them feels dangerous",
        "You feel a spike of anxiety when you imagine someone judging your work, even someone whose opinion you don't respect",
        "You research, plan, and prepare extensively but the ratio of preparation to output is wildly skewed toward preparation",
        "You've turned down or delayed opportunities because you didn't feel \"ready enough\" even though others told you you were",
        "You can articulate your strategy clearly but your execution doesn't reflect that clarity",
        "The gap between what you know you should be doing and what you're actually doing is a source of genuine shame"
      ],
      howToKnowThisIsntYou: [
        "You ship regularly, even when the work isn't perfect",
        "You can tolerate negative feedback without it derailing your next effort",
        "Your preparation-to-output ratio feels healthy",
        "You don't sit on finished or near-finished work",
        "You've launched things that embarrassed you slightly and survived just fine",
        "Imperfect action feels better to you than perfect inaction"
      ],
      reflectionPrompts: [
        "Name the specific project, offer, email, or decision that's been sitting at 80-90% for the longest. What exactly are you waiting for before you release it? Is that condition real or invented?",
        "Think about the last time you were publicly judged, criticized, or embarrassed. What actually happened afterward? Did the catastrophe you feared materialize, or did life continue?",
        "Who in your early life made you feel that mistakes were dangerous? Not just disappointing, but genuinely unsafe. What happened when you got something wrong in that environment?",
        "If you could guarantee that nobody would judge your next piece of work, that it would exist in a vacuum with zero external evaluation, would you ship it? If the answer is yes, the block isn't quality. It's fear.",
        "What's the actual, measurable cost of everything you've delayed or never released in the past 12 months? Add it up. Revenue not earned, opportunities not taken, growth not captured. Is that cost higher or lower than the cost of releasing something imperfect?"
      ],
      relationshipToOtherDrivers:
        "The Perfectionist's Prison is most commonly confused with The Fog. Both produce low execution. The difference is that The Perfectionist knows exactly what to do and can't bring themselves to do it, while The Fog genuinely doesn't know what to do because they can't commit to a direction. If you have a clear strategy and a detailed plan but aren't executing it, that's The Perfectionist's Prison. If you don't have a clear strategy and your lack of execution stems from not knowing which direction to go, that's The Fog. The Perfectionist's Prison also frequently pairs with The Imposter Loop as a secondary driver, because the fear of judgment and the fear of being exposed as inadequate share the same root: a belief that your worth depends on being perceived as flawless."
    },
    "The Imposter Loop": {
      howToKnowThisIsYou: [
        "You downplay compliments or attribute your success to luck, timing, or other people",
        "You avoid building visible systems or documentation because they'd expose how \"messy\" things really are",
        "You feel a flash of dread when you imagine your business getting significantly more attention or visibility",
        "Part of you believes that if clients saw behind the curtain, they'd leave",
        "You've stayed small, undercharged, or avoided growth opportunities because scaling felt like it would increase the odds of being \"found out\"",
        "You oscillate between feeling capable and feeling like a fraud, sometimes within the same day",
        "You feel like your business works despite you rather than because of you",
        "The way you run your business doesn't match who you actually are, but changing it would mean admitting the current version isn't authentic"
      ],
      howToKnowThisIsntYou: [
        "You genuinely own your results and feel that your success is earned",
        "You're comfortable with visibility and don't fear increased scrutiny",
        "You can name your strengths without qualifying them",
        "Your business model reflects who you actually are and how you want to work",
        "You don't avoid growth because of fear. If you avoid it, it's for strategic reasons you can clearly articulate",
        "Being \"found out\" isn't a concept that resonates with you"
      ],
      reflectionPrompts: [
        "If your most successful client or customer could see every part of your business, the backend, the real numbers, the processes, the gaps, what do you think they'd say? Now ask yourself: is that fear based on reality, or on a story you're telling yourself?",
        "When did you first start feeling like you were performing a version of yourself rather than being yourself? Was there a specific moment, environment, or relationship where the mask became necessary?",
        "What parts of your business feel authentically yours, like a genuine expression of who you are? What parts feel like a costume you put on because you thought that's what a successful business owner is supposed to look like?",
        "If you could rebuild your business from scratch with zero judgment from anyone, what would you do differently? What would you keep? The gap between those two answers reveals the size of the misalignment.",
        "Complete this sentence: \"If people really knew me, they'd know that I ___.\" Now read what you wrote. Is that actually something that would make them think less of you, or is it something that would make you more relatable?"
      ],
      relationshipToOtherDrivers:
        "The Imposter Loop has two common pairings. When paired with The Perfectionist's Prison, the combined pattern is 'I'm not enough AND nothing I produce will be good enough to prove otherwise.' The perfectionism and the impostor feeling feed each other in a loop that paralyzes action. When paired with The Pleaser's Bind, the combined pattern is 'I'm not enough AND I can only maintain my position by making everyone happy.' The people-pleasing becomes a strategy for preventing the exposure the imposter fears. The Imposter Loop is also sometimes confused with The Fog, but the distinction is clear: The Imposter Loop has a direction but doesn't trust themselves to deserve it. The Fog genuinely doesn't have a direction."
    },
    "The Martyr Complex": {
      howToKnowThisIsYou: [
        "You feel guilty when you do something purely for your own enjoyment that doesn't benefit anyone else",
        "You describe rest as \"selfish\" or feel the need to justify it as recovery \"so I can serve better\"",
        "You take pride in how much you sacrifice and may even compare your level of sacrifice to others",
        "Your body is showing signs of neglect (exhaustion, weight changes, chronic pain, illness) but you frame it as \"the cost of doing important work\"",
        "When someone suggests you take better care of yourself, you list all the reasons you can't right now",
        "The people you serve (family, clients, community) would be uncomfortable if they knew what it was actually costing you",
        "You feel most valuable when you're giving, and most empty when you have nothing to give"
      ],
      howToKnowThisIsntYou: [
        "You invest in your own health and enjoyment without guilt",
        "You can receive help, gifts, and rest without needing to earn them",
        "You don't equate suffering with nobility or sacrifice with value",
        "Your giving has clear boundaries and doesn't come at the expense of your own wellbeing",
        "You can name recent examples of prioritizing yourself without it being connected to serving others better",
        "People who know you would not describe you as someone who runs themselves into the ground for others"
      ],
      reflectionPrompts: [
        "If you took excellent care of your body, made space for joy every week, and still served your family and community at a high level, would that feel like enough? Or does part of you believe that service without sacrifice isn't real service?",
        "Where did you learn that your needs come last? Was there a person, a family system, a faith community, or a cultural message that taught you that selflessness requires self-neglect?",
        "The people you sacrifice the most for: do they know the real cost? If they did, would they want you to continue? If the answer is no, who are you actually sacrificing for?",
        "When was the last time you did something purely for your own pleasure that had zero productive or service value? If you can't remember, or if the memory comes with guilt, that's the pattern talking.",
        "Imagine someone you deeply respect, a mentor or someone you admire, operating exactly the way you operate. Neglecting their body. Deferring their joy. Running on empty to serve others. Would you praise them for it or would you tell them to stop? Why is your answer different when it's you?"
      ],
      relationshipToOtherDrivers:
        "The Martyr Complex is most commonly confused with The Pleaser's Bind. Both involve putting others first at personal cost. The distinction is in the underlying belief. The Pleaser gives to maintain relationships and avoid rejection. If the relationship were guaranteed, they'd stop over-giving. The Martyr gives because they believe sacrifice itself is virtuous. Even if no one was watching, even if no relationship depended on it, they'd still feel compelled to put themselves last. The Pleaser's currency is approval. The Martyr's currency is suffering. The Martyr Complex can also pair with The Achiever's Trap, creating a pattern where someone works themselves to the bone serving others AND ties their identity to the output of that service."
    },
    "The Fog": {
      howToKnowThisIsYou: [
        "When someone asks what you want, your honest answer is \"I don't know\" more often than you'd like",
        "You've started and abandoned multiple business ideas, strategies, or directions in the past few years",
        "You feel equally pulled toward many options and can't rank them",
        "Making a definitive commitment to one direction gives you a physical sensation of anxiety or constriction",
        "You consume a lot of content (podcasts, courses, books, frameworks) hoping something will finally click and give you clarity",
        "Your friends or partner have told you some version of \"just pick something\"",
        "You can see the merits in every option, which makes choosing any single one feel like losing all the others"
      ],
      howToKnowThisIsntYou: [
        "You have a clear direction and can articulate it simply",
        "You make decisions relatively quickly and don't agonize over them afterward",
        "You've been on a consistent strategic path for at least 6 months",
        "You don't feel paralyzed by options. When you struggle with execution, it's not because you don't know what to do",
        "Commitment doesn't scare you. You've committed to things recently and felt settled about it",
        "Your importance ratings on the VAPI had clear peaks and valleys, not a flat line"
      ],
      reflectionPrompts: [
        "If someone put a gun to your head and forced you to pick one business direction, one offer, one audience, and commit to it for 12 months with no option to change, what would you pick? The answer that came to mind first is probably the right one. What stopped you from choosing it already?",
        "What are you actually afraid would happen if you committed fully to one path and it turned out to be the wrong one? Describe the worst case in detail. Now ask yourself: could you survive that? Could you recover and choose again?",
        "Is there a decision in your past where you committed to something and it went badly? What happened, and what did you conclude about commitment as a result?",
        "How much money, time, and energy have you spent in the last 12 months on exploration, research, and \"figuring it out\"? What would you have built if that same investment went into executing one clear plan?",
        "Is the fog actually confusion, or is it a sophisticated way of avoiding the vulnerability of commitment? If clarity magically appeared tomorrow and you knew exactly what to do, would you actually do it? If the answer isn't an immediate yes, the problem isn't clarity. It's fear."
      ],
      relationshipToOtherDrivers:
        "The Fog is most commonly confused with The Perfectionist's Prison. Both produce low execution. The distinction is simple: The Perfectionist has a clear plan and can't act. The Fog can't plan because they can't commit. If you know exactly what you'd do next but can't seem to do it, that's The Perfectionist's Prison. If you genuinely don't know what you'd do next because too many options feel equally valid, that's The Fog. The Fog also sometimes pairs with The Escape Artist, because constant exploration and content consumption can function as sophisticated avoidance. The person looks like they're doing important strategic work (researching, learning, considering options) when they're actually using optionality as a shield against the vulnerability of choosing."
    },
    "The Scattered Mind": {
      howToKnowThisIsYou: [
        "You sit down to work on something important and notice, 15 minutes later, that you're somewhere else entirely without remembering the moment you left",
        "You know exactly what you should be doing. Clarity has never been your problem. Staying with it is.",
        "You've developed workarounds: waiting for deadlines, working in coffee shops, using pressure and urgency to manufacture focus",
        "Your best work happens in rare windows of unexpected concentration, and you've never figured out how to create those windows on purpose",
        "You start things with genuine intention and watch them stall before completion, not because you lost interest in the outcome but because your attention moved on",
        "You feel a persistent low-level exhaustion from managing your own mind all day",
        "People who know you would say you're smart, capable, and full of ideas but also inconsistent, hard to pin down, or \"all over the place\"",
        "You've wondered whether ADHD might be part of your experience, or you've been diagnosed and are still figuring out what that means for how you work"
      ],
      howToKnowThisIsntYou: [
        "If your attention problems come with significant anxiety, depression, or emotional dysregulation, The Escape Artist may be a better fit, your distraction might be avoidance rather than fragmentation",
        "If you can focus well when you're interested but struggle with tasks that feel meaningless or misaligned, the issue might be Inner Alignment rather than scattered attention",
        "If your execution is strong but pointed in the wrong direction, you're The Engine, not The Scattered Mind",
        "If you can sustain deep work reliably when your environment supports it, you may not have this pattern, you may just need better environment design",
        "The Scattered Mind is specifically about attention fragmentation despite alignment and emotional stability. If either of those foundations is shaky, start there first."
      ],
      reflectionPrompts: [
        "Think about the last time you sustained focus on difficult, non-urgent work for more than 90 minutes without interruption. How long ago was it? What conditions made it possible? If you can't remember one, what does that tell you?",
        "What workarounds have you built to function despite scattered attention? Deadlines? Pressure? Body-doubling? Last-minute intensity? Make a list. These workarounds reveal how you've adapted and also what it costs you to operate this way.",
        "Describe your relationship with your physical environment when you're trying to focus. What pulls your attention? What supports it? If you were designing the perfect environment for your particular mind, what would it include? What would it exclude?",
        "What have you tried before to address this pattern? What worked temporarily? What didn't work at all? What have you never tried but always wondered about?",
        "If you could reliably convert 3 focused hours per day into your most important work, what would change in your business and life within 6 months? Be specific. This is what's at stake, not becoming a different person, but building a structure that lets your mind do what it's capable of."
      ],
      relationshipToOtherDrivers:
        "The Scattered Mind is most often confused with The Escape Artist. Both involve difficulty sustaining focus. The key differentiator is emotional regulation. The Escape Artist uses distraction to avoid something painful, their Mental/Emotional Health score is low because the distraction is a coping mechanism. The Scattered Mind experiences fragmentation despite emotional stability, their Mental/Emotional Health score is functional or high because they're not running from anything. Their attention simply doesn't hold. The Scattered Mind can also resemble The Builder's Gap because both show strong alignment paired with weak execution. The difference is the mechanism: The Builder's Gap hasn't built business infrastructure; The Scattered Mind can't sustain focus long enough to build anything. Some founders have both patterns, in which case the assessment will show one as primary and one as secondary based on which scores higher.",
      commonArchetypes:
        "The Scattered Mind most commonly appears alongside The Seeker archetype (high self-awareness, low business output), The Guardian archetype (strong relationships, weak business), or The Drifter (everything at a moderate plateau). It rarely appears with The Performer or archetypes that require sustained high execution, the fragmented attention makes that level of output nearly impossible to maintain."
    },
    "The Builder's Gap": {
      howToKnowThisIsYou: [
        "You genuinely care about your clients and the quality of your work but your business feels disorganized or chaotic behind the scenes",
        "You've been told you should \"systemize\" or \"get more structured\" and the advice makes you feel like people want you to become someone you're not",
        "You associate words like \"operations,\" \"funnels,\" \"KPIs,\" or \"SOPs\" with something cold or corporate that doesn't match your identity",
        "You could describe your ideal client, your values, and your purpose clearly, but you couldn't describe your business strategy in three sentences",
        "Your income fluctuates significantly month to month because you don't have predictable systems for generating and converting clients",
        "You over-deliver to a small group of people because you don't have the infrastructure to serve more",
        "You feel like you're always one good system away from everything clicking, but you never build the system"
      ],
      howToKnowThisIsntYou: [
        "You have strong business systems and your operations run without your constant involvement",
        "Your strategy is clear and you've been executing it consistently for 6+ months",
        "You don't resist the idea of business infrastructure. You've built it and it works.",
        "Your business challenges are about scaling or optimizing, not about building the basics",
        "The word \"systems\" doesn't make you feel like you'd be selling out",
        "Your business revenue is predictable within a reasonable range month to month"
      ],
      reflectionPrompts: [
        "When you imagine your business running on real systems, with a documented strategy, a predictable pipeline, standard operating procedures, and delegated tasks, what feeling comes up? If the answer is anything other than relief, what's the resistance about?",
        "Who in your life or experience made \"business\" feel like it was at odds with being a good, authentic, caring person? Where did you learn that structure and soul couldn't coexist?",
        "If you could build the business infrastructure you need while guaranteeing it wouldn't change who you are or how you show up with clients, would you build it immediately? If yes, the obstacle isn't capability. It's a belief about what building requires you to become.",
        "How much revenue did you leave on the table in the past 12 months because you didn't have the systems to capture, nurture, or convert the interest that already existed? Be specific. What could that money have funded in your life?",
        "Think about someone you admire who runs a well-structured business AND shows up with warmth, authenticity, and genuine care. They exist. What's different about them? Is it possible that the thing you're resisting is exactly what would let you serve people the way you actually want to?"
      ],
      relationshipToOtherDrivers:
        "The Builder's Gap is most commonly confused with The Fog. Both produce weak Business scores. The critical difference is that The Fog can't choose a direction because commitment feels dangerous. The Builder's Gap often HAS a direction (their Ecology score is usually healthy, meaning the model fits) but hasn't built the infrastructure to execute it. The Fog is paralyzed by optionality. The Builder's Gap is paralyzed by an identity conflict about what 'building a business' requires them to become. The Builder's Gap can also resemble The Perfectionist's Prison, but the distinction is that the Perfectionist has the plan and can't ship because of fear of judgment. The Builder's Gap often doesn't have the plan yet because they haven't engaged with the strategic and operational work required to create one. It's not that they're afraid to execute. It's that they haven't built the thing to execute on."
    }
  };

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function getDriverSectionId(driver) {
    return "driver-" + String(driver)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function normalizeDriverName(driver) {
    return driver && window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_CONTENT && window.VAPI_DRIVERS.DRIVER_CONTENT[driver]
      ? driver
      : null;
  }

  function buildDriverAnchor(driver) {
    return '<a href="#' + getDriverSectionId(driver) + '" class="font-semibold text-[var(--ap-accent)] hover:underline">' + escapeHtml(driver) + '</a>';
  }

  function buildStateAnchor(name) {
    return '<a href="#' + getDriverSectionId(name) + '" class="font-semibold text-[var(--ap-accent)] hover:underline">' + escapeHtml(name) + '</a>';
  }

  function getLibrarySurface(accent, strength) {
    if (accent && strength === "strong") {
      return 'background:linear-gradient(180deg,' + accent + '12 0%, var(--ap-surface, #ffffff) 68%);';
    }
    if (accent && strength === "soft") {
      return 'background:linear-gradient(180deg,' + accent + '0D 0%, var(--ap-surface, #ffffff) 72%);';
    }
    return 'background:var(--ap-surface, #ffffff);';
  }

  function buildNavigation(primaryDriver, secondaryDriver, isAlignedMomentum, options) {
    var opts = options || {};
    var stickyTopStyle = opts.sidebarTopStyle || "";
    if (!stickyTopStyle && opts.sidebarTopPx) stickyTopStyle = "top:" + opts.sidebarTopPx + "px;";
    if (!stickyTopStyle && opts.sidebarTopClass === "top-24") stickyTopStyle = "top:6rem;";
    if (!stickyTopStyle) stickyTopStyle = "top:1.5rem;";
    var alignedAccent = window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS
      ? window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS[ALIGNED_MOMENTUM_NAME]
      : "#B8960C";
    function buildItem(driverName) {
      var accent = window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS
        ? window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS[driverName]
        : "var(--ap-accent)";
      var isPrimary = driverName === primaryDriver;
      var isSecondary = driverName === secondaryDriver;
      return (
        '<a href="#' + getDriverSectionId(driverName) + '" class="flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors hover:border-[var(--ap-accent)]/30" style="' +
          (isPrimary ? 'border-color:' + accent + '55;background:' + accent + '16;' : '') +
          (!isPrimary && isSecondary ? 'border-color:' + accent + '33;background:' + accent + '0D;' : '') +
        '">' +
          (window.VAPI_DRIVERS && window.VAPI_DRIVERS.getIcon ? window.VAPI_DRIVERS.getIcon(driverName, 24) : "") +
          '<span class="text-sm leading-snug text-[var(--ap-primary)]" style="font-weight:' + (isPrimary ? '700' : isSecondary ? '600' : '500') + ';">' + escapeHtml(driverName) + '</span>' +
        '</a>'
      );
    }

    return (
      '<div class="portal-library-mobile-nav space-y-4">' +
        '<div class="-mx-2 overflow-x-auto px-2 pb-1">' +
          '<div class="flex min-w-max gap-3">' +
            '<a href="#' + getDriverSectionId(ALIGNED_MOMENTUM_NAME) + '" class="flex min-w-[210px] items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm transition-colors hover:border-[var(--ap-accent)]/30" style="background:var(--ap-surface, #ffffff);' +
              (isAlignedMomentum ? 'border-color:' + alignedAccent + '55;background:' + alignedAccent + '16;' : '') +
            '">' +
              (window.VAPI_DRIVERS && window.VAPI_DRIVERS.getIcon ? window.VAPI_DRIVERS.getIcon(ALIGNED_MOMENTUM_NAME, 24) : "") +
              '<span class="text-sm text-[var(--ap-primary)]" style="font-weight:' + (isAlignedMomentum ? '700' : '500') + ';">' + escapeHtml(ALIGNED_MOMENTUM_NAME) + '</span>' +
            '</a>' +
            '<div class="flex items-center px-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Dysfunction Drivers</div>' +
            DRIVER_ORDER.map(function(driverName) {
              var accent = window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS
                ? window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS[driverName]
                : "var(--ap-accent)";
              var isPrimary = driverName === primaryDriver;
              var isSecondary = driverName === secondaryDriver;
              return (
                '<a href="#' + getDriverSectionId(driverName) + '" class="flex min-w-[210px] items-center gap-3 rounded-2xl border px-4 py-3 shadow-sm transition-colors hover:border-[var(--ap-accent)]/30" style="background:var(--ap-surface, #ffffff);' +
                  (isPrimary ? 'border-color:' + accent + '55;' : '') +
                  (!isPrimary && isSecondary ? 'border-color:' + accent + '33;' : '') +
                  (isPrimary ? 'background:' + accent + '16;' : '') +
                  (!isPrimary && isSecondary ? 'background:' + accent + '0D;' : '') +
                '">' +
                  (window.VAPI_DRIVERS && window.VAPI_DRIVERS.getIcon ? window.VAPI_DRIVERS.getIcon(driverName, 24) : "") +
                  '<span class="text-sm font-medium text-[var(--ap-primary)]">' + escapeHtml(driverName) + '</span>' +
                '</a>'
              );
            }).join("") +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="portal-library-desktop-layout">' +
        '<aside class="portal-library-desktop-sidebar">' +
          '<div class="portal-library-sidebar-sticky rounded-3xl border border-[var(--ap-border)] p-4 shadow-sm" style="' + stickyTopStyle + 'background:var(--ap-surface, #ffffff);">' +
            '<p class="px-3 pb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">All Drivers</p>' +
            '<nav class="space-y-2">' +
              '<a href="#' + getDriverSectionId(ALIGNED_MOMENTUM_NAME) + '" class="flex items-center gap-3 rounded-2xl border px-3 py-3 transition-colors hover:border-[var(--ap-accent)]/30" style="' +
                (isAlignedMomentum ? 'border-color:' + alignedAccent + '55;background:' + alignedAccent + '16;' : '') +
              '">' +
                (window.VAPI_DRIVERS && window.VAPI_DRIVERS.getIcon ? window.VAPI_DRIVERS.getIcon(ALIGNED_MOMENTUM_NAME, 24) : "") +
                '<span class="text-sm leading-snug text-[var(--ap-primary)]" style="font-weight:' + (isAlignedMomentum ? '700' : '500') + ';">' + escapeHtml(ALIGNED_MOMENTUM_NAME) + '</span>' +
              '</a>' +
              '<p class="px-3 pt-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Dysfunction Drivers</p>' +
              DRIVER_ORDER.map(buildItem).join("") +
            '</nav>' +
          '</div>' +
        '</aside>' +
        '<div id="driver-library-sections" class="portal-library-desktop-sections space-y-8"></div>' +
      '</div>'
    );
  }

  function buildSection(driverName, primaryDriver, secondaryDriver) {
    var driver = window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_CONTENT
      ? window.VAPI_DRIVERS.DRIVER_CONTENT[driverName]
      : null;
    var extras = DRIVER_LIBRARY_CONTENT[driverName];
    var accent = window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS
      ? window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS[driverName]
      : "#FF6B1A";
    var isPrimary = driverName === primaryDriver;
    var isSecondary = driverName === secondaryDriver;

    if (!driver || !extras) {
      return "";
    }

    return (
      '<section id="' + getDriverSectionId(driverName) + '" class="scroll-mt-24 rounded-3xl border border-[var(--ap-border)] p-6 shadow-sm sm:p-8" style="background:var(--ap-surface, #ffffff);">' +
        '<div>' +
        '<div class="flex flex-col gap-5 sm:flex-row sm:items-start">' +
          '<div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border" style="background:' + accent + '14;border-color:' + accent + '33;">' +
            (window.VAPI_DRIVERS && window.VAPI_DRIVERS.getIcon ? window.VAPI_DRIVERS.getIcon(driverName, 80) : "") +
          '</div>' +
          '<div class="min-w-0 space-y-3">' +
            '<h2 class="text-3xl font-bold tracking-tight text-[var(--ap-primary)] sm:text-4xl">' + escapeHtml(driver.name) + '</h2>' +
            '<blockquote class="text-xl italic leading-tight text-[var(--ap-primary)] sm:text-2xl">&quot;' + escapeHtml(driver.coreBelief) + '&quot;</blockquote>' +
            '<p class="text-sm text-[var(--ap-secondary)]"><span class="font-semibold text-[var(--ap-primary)]">Core fear:</span> ' + escapeHtml(driver.coreFear) + '</p>' +
            '<p class="text-sm italic leading-relaxed text-[var(--ap-secondary)]">' + escapeHtml(driver.tagline) + '</p>' +
          '</div>' +
        '</div>' +
        (isPrimary
          ? '<div class="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold" style="background:' + accent + '16;border-color:' + accent + '33;color:' + accent + ';">This is your primary driver pattern.</div>'
          : '') +
        (!isPrimary && isSecondary
          ? '<div class="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold" style="background:' + accent + '0F;border-color:' + accent + '28;color:' + accent + ';">This is your secondary driver pattern.</div>'
          : '') +
        '<div class="mt-8 space-y-8">' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">The Pattern</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(driver.description) + '</p>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How This Shows Up in Your Scores</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(driver.mechanism) + '</p>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">What This Is Costing You</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(driver.whatItCosts) + '</p>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">The Way Out</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(driver.theWayOut) + '</p>' +
          '</div>' +
          '<div class="rounded-2xl border px-5 py-4" style="background:' + accent + '10;border-color:' + accent + '24;">' +
            '<p class="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Where this gets addressed</p>' +
            '<p class="mt-2 text-sm leading-relaxed text-[var(--ap-primary)]">' + escapeHtml(driver.programPhase) + '</p>' +
          '</div>' +
          '<div class="space-y-3">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How to Know If This Is You</h3>' +
            '<ul class="space-y-2 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
              extras.howToKnowThisIsYou.map(function(item) {
                return '<li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ap-accent)]"></span><span>' + escapeHtml(item) + '</span></li>';
              }).join("") +
            '</ul>' +
          '</div>' +
          '<div class="space-y-3">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How to Know If This Isn\'t You</h3>' +
            '<ul class="space-y-2 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
              extras.howToKnowThisIsntYou.map(function(item) {
                return '<li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ap-border)]"></span><span>' + escapeHtml(item) + '</span></li>';
              }).join("") +
            '</ul>' +
          '</div>' +
          '<div class="space-y-3">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Reflection Prompts</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)]">If this pattern resonates, sit with these questions. Don\'t rush. Write your answers somewhere private.</p>' +
            '<ol class="space-y-3 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
              extras.reflectionPrompts.map(function(prompt, index) {
                return '<li class="flex gap-3"><span class="font-semibold text-[var(--ap-primary)]">' + (index + 1) + '.</span><span>' + escapeHtml(prompt) + '</span></li>';
              }).join("") +
            '</ol>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How This Relates to Other Patterns</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(extras.relationshipToOtherDrivers) + '</p>' +
          '</div>' +
          (extras.commonArchetypes
            ? '<div class="space-y-2">' +
                '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Common Archetypes</h3>' +
                '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(extras.commonArchetypes) + '</p>' +
              '</div>'
            : '') +
        '</div></div>' +
      '</section>'
    );
  }

  function buildAlignedMomentumSection(isAlignedMomentum) {
    var aligned = window.VAPI_DRIVERS && window.VAPI_DRIVERS.ALIGNED_MOMENTUM_CONTENT
      ? window.VAPI_DRIVERS.ALIGNED_MOMENTUM_CONTENT
      : null;
    var accent = window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS
      ? window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS[ALIGNED_MOMENTUM_NAME]
      : "#B8960C";

    if (!aligned) {
      return "";
    }

    return (
      '<section id="' + getDriverSectionId(ALIGNED_MOMENTUM_NAME) + '" class="scroll-mt-24 rounded-3xl border border-[var(--ap-border)] p-6 shadow-sm sm:p-8" style="background:var(--ap-surface, #ffffff);">' +
        '<div class="flex flex-col gap-5 sm:flex-row sm:items-start">' +
          '<div class="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border" style="background:' + accent + '14;border-color:' + accent + '33;">' +
            (window.VAPI_DRIVERS && window.VAPI_DRIVERS.getIcon ? window.VAPI_DRIVERS.getIcon(ALIGNED_MOMENTUM_NAME, 80) : "") +
          '</div>' +
          '<div class="min-w-0 space-y-3">' +
            '<h2 class="text-3xl font-bold tracking-tight text-[var(--ap-primary)] sm:text-4xl">' + escapeHtml(aligned.name) + '</h2>' +
            '<p class="text-sm italic leading-relaxed text-[var(--ap-secondary)]">' + escapeHtml(aligned.tagline) + '</p>' +
            '<blockquote class="text-xl italic leading-tight text-[var(--ap-primary)] sm:text-2xl">&quot;' + escapeHtml(aligned.coreState) + '&quot;</blockquote>' +
          '</div>' +
        '</div>' +
        (isAlignedMomentum
          ? '<div class="mt-5 rounded-2xl border px-4 py-3 text-sm font-semibold" style="background:' + accent + '16;border-color:' + accent + '33;color:' + accent + ';">This is your current state.</div>'
          : '') +
        '<div class="mt-8 space-y-8">' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">The State</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(aligned.description) + '</p>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How This Shows Up in Your Scores</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(aligned.howThisShowsUp) + '</p>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">What This Makes Possible</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(aligned.whatThisMakesPossible) + '</p>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How to Protect It</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(aligned.howToProtectIt) + '</p>' +
          '</div>' +
          '<div class="space-y-3">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How to Know If This Is You</h3>' +
            '<ul class="space-y-2 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
              ALIGNED_MOMENTUM_LIBRARY_CONTENT.howToKnowThisIsYou.map(function(item) {
                return '<li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ap-accent)]"></span><span>' + escapeHtml(item) + '</span></li>';
              }).join("") +
            '</ul>' +
          '</div>' +
          '<div class="space-y-3">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How to Know If This Isn\'t You</h3>' +
            '<ul class="space-y-2 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
              ALIGNED_MOMENTUM_LIBRARY_CONTENT.howToKnowThisIsntYou.map(function(item) {
                return '<li class="flex gap-3"><span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ap-border)]"></span><span>' + escapeHtml(item) + '</span></li>';
              }).join("") +
            '</ul>' +
          '</div>' +
          '<div class="space-y-3">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">Reflection Prompts</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)]">If this pattern resonates, sit with these questions. Don\'t rush. Write your answers somewhere private.</p>' +
            '<ol class="space-y-3 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' +
              ALIGNED_MOMENTUM_LIBRARY_CONTENT.reflectionPrompts.map(function(prompt, index) {
                return '<li class="flex gap-3"><span class="font-semibold text-[var(--ap-primary)]">' + (index + 1) + '.</span><span>' + escapeHtml(prompt) + '</span></li>';
              }).join("") +
            '</ol>' +
          '</div>' +
          '<div class="space-y-2">' +
            '<h3 class="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--ap-muted)]">How This Relates to Drivers</h3>' +
            '<p class="text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(ALIGNED_MOMENTUM_LIBRARY_CONTENT.relationshipToOtherDrivers) + '</p>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function buildPage(options) {
    var opts = options || {};
    var results = opts.results || null;
    var evaluation = results && window.VAPI_DRIVERS && window.VAPI_DRIVERS.ensureEvaluation
      ? window.VAPI_DRIVERS.ensureEvaluation(results)
      : {
          assignedDriver: results && typeof results.assignedDriver === "string" ? results.assignedDriver : null,
          secondaryDriver: results && typeof results.secondaryDriver === "string" ? results.secondaryDriver : null,
          driverState: results && typeof results.driverState === "string" ? results.driverState : "no_driver"
        };
    var isAlignedMomentum =
      evaluation.driverState === "aligned_momentum" ||
      evaluation.assignedDriver === ALIGNED_MOMENTUM_NAME;
    var primaryDriver = normalizeDriverName(evaluation.assignedDriver || null);
    var secondaryDriver = primaryDriver ? normalizeDriverName(evaluation.secondaryDriver || null) : null;
    var takeAssessmentHref = opts.takeAssessmentHref || "/assessment";
    var programHref = opts.programHref || "https://jakesebok.com/work-with-me";
    var archetypeLibraryHref = opts.archetypeLibraryHref || "/portal/archetype-library";
    var primaryAccent = primaryDriver && window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS
      ? window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS[primaryDriver]
      : "#FF6B1A";

    var html =
      '<section class="rounded-3xl border border-[var(--ap-border)] p-6 shadow-sm sm:p-8" style="background:var(--ap-surface, #ffffff);">' +
        '<div>' +
        '<p class="text-sm font-medium uppercase tracking-[0.28em] text-[var(--ap-accent)]">Driver Library</p>' +
        '<h1 class="mt-3 text-4xl font-bold tracking-tight text-[var(--ap-primary)] sm:text-5xl">' + escapeHtml(DRIVER_LIBRARY_TITLE) + '</h1>' +
        '<p class="mt-4 max-w-4xl text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(DRIVER_LIBRARY_SUBTITLE) + '</p>';

    if (isAlignedMomentum) {
      html += '<div class="mt-6 rounded-2xl border px-5 py-4 text-sm leading-relaxed text-[var(--ap-primary)]" style="background:' + (window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS ? window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS[ALIGNED_MOMENTUM_NAME] : '#B8960C') + '12;border-color:' + (window.VAPI_DRIVERS && window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS ? window.VAPI_DRIVERS.DRIVER_ACCENT_COLORS[ALIGNED_MOMENTUM_NAME] : '#B8960C') + '26;">Your current state: ' + buildStateAnchor(ALIGNED_MOMENTUM_NAME) + '.</div>';
    } else if (primaryDriver) {
      html += '<div class="mt-6 rounded-2xl border px-5 py-4 text-sm leading-relaxed text-[var(--ap-primary)]" style="background:' + primaryAccent + '12;border-color:' + primaryAccent + '26;">Your primary driver: ' + buildDriverAnchor(primaryDriver) + '. Your secondary driver: ' + (secondaryDriver ? buildDriverAnchor(secondaryDriver) : 'None identified') + '.</div>';
    } else {
      html += '<div class="mt-6 flex flex-col gap-4 rounded-2xl border border-[var(--ap-border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between" style="background:var(--ap-surface, #ffffff);"><p class="text-sm leading-relaxed text-[var(--ap-secondary)]">' + escapeHtml(DRIVER_LIBRARY_EMPTY_RESULTS_BANNER) + '</p><a href="' + escapeHtml(takeAssessmentHref) + '" class="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ap-accent)] hover:underline">Take the Assessment <span aria-hidden="true">→</span></a></div>';
    }

    html += '</div></section>';
    html += buildNavigation(primaryDriver, secondaryDriver, isAlignedMomentum, opts);
    html += '<section class="rounded-3xl border border-[var(--ap-border)] p-6 shadow-sm sm:p-8" style="background:var(--ap-surface, #ffffff);">' +
      '<h2 class="text-3xl font-bold tracking-tight text-[var(--ap-primary)]">' + escapeHtml(DRIVER_LIBRARY_FOOTER_HEADING) + '</h2>' +
      '<p class="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(DRIVER_LIBRARY_FOOTER_TEXT) + '</p>' +
      '<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">' +
        '<a href="' + escapeHtml(programHref) + '" class="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ap-accent)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#e55a0f]">Learn About the Program <span aria-hidden="true">→</span></a>' +
        '<a href="' + escapeHtml(takeAssessmentHref) + '" class="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--ap-accent)] hover:underline">Retake the VAPI Assessment <span aria-hidden="true">→</span></a>' +
        '<a href="' + escapeHtml(archetypeLibraryHref) + '" class="inline-flex items-center justify-center gap-2 text-sm font-semibold text-[var(--ap-accent)] hover:underline">Explore the 9 Founder Archetypes <span aria-hidden="true">→</span></a>' +
      '</div>' +
    '</section>';

    return {
      html: html,
      primaryDriver: primaryDriver,
      secondaryDriver: secondaryDriver,
      isAlignedMomentum: isAlignedMomentum
    };
  }

  function populateSections(root, primaryDriver, secondaryDriver, isAlignedMomentum) {
    if (!root) return;
    root.innerHTML =
      buildAlignedMomentumSection(isAlignedMomentum) +
      '<div class="rounded-3xl border border-[var(--ap-border)] px-6 py-5 text-center shadow-sm" style="background:color-mix(in srgb, var(--ap-bg) 65%, white 35%);">' +
        '<p class="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--ap-muted)]">' + escapeHtml(DRIVER_LIBRARY_DIVIDER_HEADING) + '</p>' +
        '<p class="mt-3 text-sm leading-relaxed text-[var(--ap-secondary)] sm:text-base">' + escapeHtml(DRIVER_LIBRARY_DIVIDER_TEXT) + '</p>' +
      '</div>' +
      DRIVER_ORDER.map(function(driverName) {
        return buildSection(driverName, primaryDriver, secondaryDriver);
      }).join("");
  }

  window.VAPI_DRIVER_LIBRARY = {
    DRIVER_ORDER: DRIVER_ORDER,
    DRIVER_LIBRARY_CONTENT: DRIVER_LIBRARY_CONTENT,
    DRIVER_LIBRARY_TITLE: DRIVER_LIBRARY_TITLE,
    DRIVER_LIBRARY_SUBTITLE: DRIVER_LIBRARY_SUBTITLE,
    getSectionId: getDriverSectionId,
    buildPage: buildPage,
    populateSections: populateSections
  };
})();
