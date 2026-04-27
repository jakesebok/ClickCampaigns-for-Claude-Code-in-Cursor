// six-c-deep-dive-prompts.js
//
// Prompt library for the score-driven deep-dive 6C scorecard.
// 6 modes × 6 dimensions = 36 prompts.
//
// Voice: channels Rich Litvin (presence, truth-cutting, identity claim)
// and Brendon Burchard (structure, energy, intentionality), filtered through
// the Jake Sebok writing-style guide.
//
// Voice anti-patterns enforced: no em dashes, no "white knuckling,"
// no "you are not broken / you're just X" paired structure.
//
// Mode names are internal labels for the system. They are not shown in
// client-facing UI; users only see the prompt text itself.

(function () {
  var MODES = [
    { id: 'witness',     label: 'The Witness',     frame: 'Notice without solving. Just see what was there.' },
    { id: 'diagnostic',  label: 'The Diagnostic',  frame: 'Trace cause. Choices, circumstances, or story?' },
    { id: 'future_self', label: 'The Future Self', frame: 'Look back from the version of you who already lives this.' },
    { id: 'body',        label: 'The Body',        frame: 'Embodied data. What did the sensation say?' },
    { id: 'tolerated',   label: 'The Tolerated',   frame: 'Name what you are putting up with.' },
    { id: 'declaration', label: 'The Declaration', frame: 'Make the next belief or commitment explicit.' }
  ];

  var DIMENSIONS = [
    { id: 'clarity',    label: 'Clarity' },
    { id: 'coherence',  label: 'Coherence' },
    { id: 'capacity',   label: 'Capacity' },
    { id: 'confidence', label: 'Confidence' },
    { id: 'courage',    label: 'Courage' },
    { id: 'connection', label: 'Connection' }
  ];

  // Score signal → ranked mode candidates. The selector picks the first
  // candidate that has not been used in the last 2 weeks for this user.
  var SIGNAL_TO_MODES = {
    low_score:         ['diagnostic', 'tolerated', 'body'],         // current score under 65
    big_drop:          ['diagnostic', 'body', 'witness'],           // dropped meaningfully vs last week
    rose_meaningfully: ['witness', 'declaration', 'future_self'],   // rose meaningfully vs last week
    flat_steady:       ['future_self', 'tolerated', 'declaration'], // unchanged 2+ weeks
    first_dive:        ['witness'],                                 // never deep-dived this dimension
    by_choice:         ['witness', 'diagnostic', 'future_self', 'body', 'tolerated', 'declaration'] // user picked a healthy dimension
  };

  // PROMPTS[mode_id][dimension_id] = prompt string.
  var PROMPTS = {

    witness: {
      clarity:    "Looking back at this week, where did your clarity show up most powerfully? It might have been a moment you saw what mattered with no doubt, or a moment you got pulled into something that did not matter at all. Describe the moment honestly. No fixing yet.",
      coherence:  "Where this week did your actions and your real values line up most clearly, in either direction? A moment they matched. A moment they did not. Tell the story of the cleanest version. No fixing yet.",
      capacity:   "Looking back at this week, where did your capacity to sustain energy show up most clearly? Either when you had it, or when it ran out. Describe the moment honestly. No fixing yet.",
      confidence: "Where this week did your self-trust show up most clearly? A promise to yourself you kept, or one you broke. Describe the moment honestly. No fixing yet.",
      courage:    "Where this week did your willingness to take the hard right action show up most clearly? A moment you did, or a moment you did not. Tell what actually happened. No fixing yet.",
      connection: "Where this week did real connection show up most clearly? A conversation that was honest, or one you avoided. Describe the moment honestly. No fixing yet."
    },

    diagnostic: {
      clarity:    "Your clarity score landed where it did for a reason. Was it your actual choices this week, the questions you asked, the time you protected, the inputs you let in? Was it circumstances acting on you? Or was it a story you were running about what you think you have to focus on? Be specific.",
      coherence:  "Your coherence score landed where it did for a reason. Was it your actual choices this week, the times your actions matched what you say matters? Was it circumstances pulling you sideways? Or was it a story you were running about who you have to be? Be specific.",
      capacity:   "Your capacity score landed where it did for a reason. Was it your actual choices this week, like sleep, intake, recovery, the pace you set? Was it circumstances acting on you? Or was it a story you were running about how much you can hold? Be specific.",
      confidence: "Your confidence score landed where it did for a reason. Was it your actual choices this week, the promises you kept or broke to yourself? Was it circumstances acting on you? Or was it a story you were running about what you can or cannot do? Be specific.",
      courage:    "Your courage score landed where it did for a reason. Was it your actual choices this week, the hard things you said or did not say? Was it circumstances acting on you? Or was it a story you were running about what is safe and what is not? Be specific.",
      connection: "Your connection score landed where it did for a reason. Was it your actual choices this week, who you reached for and who you avoided? Was it circumstances acting on you? Or was it a story you were running about whether people actually want the real you? Be specific."
    },

    future_self: {
      clarity:    "Picture the version of you whose clarity is so strong it barely needs maintenance. They know what matters and they let the rest go. They are looking at your week. What do they see that you are missing?",
      coherence:  "Picture the version of you whose actions and values are so aligned that integrity is the default, not the achievement. They are looking at your week. What do they see that you are missing?",
      capacity:   "Picture the version of you whose capacity is so abundant it barely registers as a topic. Energy steady, recovery built in, nothing forced. They are looking at your week. What do they see that you are missing?",
      confidence: "Picture the version of you whose self-trust is so deep that promises to yourself feel sacred and unbreakable. They are looking at your week. What do they see that you are missing?",
      courage:    "Picture the version of you whose willingness to take the hard right action is automatic. No negotiation. No flinching. They are looking at your week. What do they see that you are missing?",
      connection: "Picture the version of you who is so secure in who they are that real connection is the only kind they accept or offer. They are looking at your week. What do they see that you are missing?"
    },

    body: {
      clarity:    "Where did clarity, or its absence, live in your body this week? A clean sharpness behind the eyes when you knew what to do. A foggy weight when you did not. What was the strongest sensation trying to tell you?",
      coherence:  "Where did coherence, or its absence, live in your body this week? A grounded calm when your actions matched your values. A queasy split when they did not. What was the strongest sensation trying to tell you?",
      capacity:   "Where did capacity, or the lack of it, live in your body this week? Tension in the jaw at 4 PM. A hollow feeling Tuesday morning. A surprising lift after that one walk. What was the strongest sensation trying to tell you?",
      confidence: "Where did confidence, or its absence, live in your body this week? An open chest when you kept your word to yourself. A held breath before something you knew you should do. What was the strongest sensation trying to tell you?",
      courage:    "Where did courage, or its absence, live in your body this week? A heat in the chest before you said the hard thing. A drop in the stomach when you almost did and pulled back. What was the strongest sensation trying to tell you?",
      connection: "Where did connection, or its absence, live in your body this week? A softening in the shoulders around the people who actually see you. A bracing when you walked into rooms where you have to perform. What was the strongest sensation trying to tell you?"
    },

    tolerated: {
      clarity:    "What did you tolerate this week in the area of clarity? A meeting you should not be in. A project you keep pretending matters. A question you keep refusing to answer. The version of you a year from now will be embarrassed to look back on it. Name the actual thing.",
      coherence:  "What did you tolerate this week in the area of integrity? A small lie, a promise kept to someone other than yourself, a value you are quietly betraying. The version of you a year from now will be embarrassed to look back on it. Name the actual thing.",
      capacity:   "What did you tolerate this week in the area of energy and capacity? A habit, a commitment, a pace, a person. The version of you a year from now will be embarrassed to look back on it. Name the actual thing.",
      confidence: "What did you tolerate this week in the area of self-trust? A promise you keep breaking. An apology you keep making to yourself instead of just doing the thing. The version of you a year from now will be embarrassed to look back on it. Name the actual thing.",
      courage:    "What did you tolerate this week that real courage would have already addressed? A conversation you avoided. A boundary you let get crossed. A small no you owed someone. The version of you a year from now will be embarrassed to look back on it. Name the actual thing.",
      connection: "What did you tolerate this week in your relationships? A surface conversation that should have been real. A person who drains you that you keep saying yes to. A loved one you have not actually seen in weeks. The version of you a year from now will be embarrassed to look back on it. Name the actual thing."
    },

    declaration: {
      clarity:    "Based on what this week showed you about your clarity, what new belief or commitment is asking to be made? Not a should. The thing that is true now that you are ready to say out loud.",
      coherence:  "Based on what this week showed you about how aligned your actions are with your values, what new belief or commitment is asking to be made? Not a should. The thing that is true now that you are ready to say out loud.",
      capacity:   "Based on what this week showed you about your capacity, what new belief or commitment is asking to be made? Not a should. The thing that is true now that you are ready to say out loud.",
      confidence: "Based on what this week showed you about your self-trust, what new belief or commitment is asking to be made? Not a should. The thing that is true now that you are ready to say out loud.",
      courage:    "Based on what this week showed you about your willingness to take hard right action, what new belief or commitment is asking to be made? Not a should. The thing that is true now that you are ready to say out loud.",
      connection: "Based on what this week showed you about real connection in your life, what new belief or commitment is asking to be made? Not a should. The thing that is true now that you are ready to say out loud."
    }

  };

  // Compute the score signal for a given dimension based on this week's score
  // and last week's score. Returns a key into SIGNAL_TO_MODES.
  // Scores are 0-100. Cutoff for "needs deep dive" is 65 (per Jake).
  function computeSignal(thisWeekScore, lastWeekScore, weeksFlat) {
    if (thisWeekScore == null) return 'by_choice';
    if (lastWeekScore == null) return 'first_dive';
    var delta = thisWeekScore - lastWeekScore;
    if (thisWeekScore < 65) return 'low_score';
    if (delta <= -20) return 'big_drop';
    if (delta >= 20) return 'rose_meaningfully';
    if (Math.abs(delta) <= 10 && weeksFlat >= 2) return 'flat_steady';
    return 'by_choice'; // healthy dimension picked by free choice
  }

  // Pick a mode for this dimension given the signal and recent history.
  // recentModes: array of mode ids used in the last 2 weeks for THIS dimension
  // (newest first). The selector picks the first candidate not in recentModes,
  // falling back to the first candidate if all are recent.
  function selectMode(signal, recentModes) {
    var candidates = SIGNAL_TO_MODES[signal] || SIGNAL_TO_MODES.first_dive;
    var recent = recentModes || [];
    for (var i = 0; i < candidates.length; i++) {
      if (recent.indexOf(candidates[i]) === -1) return candidates[i];
    }
    return candidates[0];
  }

  // Resolve a prompt for a (mode, dimension) pair.
  function getPrompt(modeId, dimensionId) {
    if (!PROMPTS[modeId]) return null;
    return PROMPTS[modeId][dimensionId] || null;
  }

  // Recommend the top 1-2 dimensions to deep-dive on, based on score data.
  // scores: { clarity: 0-100, coherence: 0-100, ... } current week
  // lastScores: same shape for last week (or null)
  // Returns: array of dimension ids ordered by deep-dive priority.
  // Cutoff for "low" is 65 (per Jake); meaningful delta is 20 points.
  // Empty array means no dimension needs the system's attention this week;
  // the UI should still let the user pick any dimension by choice.
  function recommendDimensions(scores, lastScores) {
    var ranked = DIMENSIONS.map(function (d) {
      var cur = scores[d.id];
      var prev = lastScores ? lastScores[d.id] : null;
      var delta = (cur != null && prev != null) ? cur - prev : 0;
      var priority = 0;
      if (cur != null && cur < 65) priority += 100 + (65 - cur);
      if (delta <= -20) priority += 80;
      if (delta >= 20) priority += 30;
      return { id: d.id, label: d.label, score: cur, delta: delta, priority: priority };
    });
    ranked.sort(function (a, b) { return b.priority - a.priority; });
    return ranked.filter(function (r) { return r.priority > 0; }).slice(0, 2).map(function (r) { return r.id; });
  }

  window.SIX_C_DEEP_DIVE = {
    MODES: MODES,
    DIMENSIONS: DIMENSIONS,
    SIGNAL_TO_MODES: SIGNAL_TO_MODES,
    PROMPTS: PROMPTS,
    computeSignal: computeSignal,
    selectMode: selectMode,
    getPrompt: getPrompt,
    recommendDimensions: recommendDimensions
  };
})();
