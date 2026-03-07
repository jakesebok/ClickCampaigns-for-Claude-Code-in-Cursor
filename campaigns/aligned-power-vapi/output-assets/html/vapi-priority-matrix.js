/**
 * VAPI Priority Matrix — shared module for dashboard and results.
 * Exposes: buildPriorityMatrix(results)
 */
(function(global) {
  'use strict';

  function escapeHtml(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var PM_COPY = {
    PH: {
      criticalPriority: "You've identified physical health as a priority, and your score confirms it needs attention. Your body is currently undermining your capacity rather than supporting it. The good news is you already know this matters. That alignment between awareness and priority is what makes change possible. Start with the most broken habit first, whether that's sleep, nutrition, or movement, and build from there.",
      protectAndSustain: "Physical health is a priority for you and you're delivering on it. Your habits are working and your body is supporting what you're building. This is the easiest quadrant to neglect because it feels handled. Don't. The habits that got you here need ongoing protection, especially during high-stress periods when health is the first thing most founders sacrifice.",
      monitor: "You've rated physical health as a lower priority right now, and your score reflects that. If you're in a conscious, temporary tradeoff because another area demands your full attention, that's your call. Just be honest about whether you're making a strategic choice or rationalizing neglect. The longer physical health stays low, the more it quietly degrades everything else.",
      overInvestment: "Your physical health score is strong, but you've rated it as a lower priority. If your habits are running on autopilot and not consuming much active energy, there's nothing to change here. But if you're spending significant time and attention on health while rating other areas as higher priority, it might be worth asking whether some of that discipline could be redirected toward the domains you've identified as more urgent.",
      flag: "Worth examining: You've rated physical health as both low-scoring and low-priority. Unlike some domains, physical health affects every other area whether you prioritize it or not. Your energy, cognitive function, emotional regulation, and decision-making all depend on your body. Be honest: is this genuinely a strategic deprioritization, or have you stopped caring about your body because the gap feels too large to close? Sometimes we tell ourselves something doesn't matter because admitting it does would require us to change."
    },
    IA: {
      criticalPriority: "Living in alignment with your values matters to you, and you're not doing it. That gap between what you want your life to look like and what it actually looks like is creating tension you probably feel every day. You don't need a sabbatical. You need to start reclaiming your time in small, concrete ways this week. One hour of protected time for something that actually matters to you. Start there.",
      protectAndSustain: "Alignment is a priority for you and your life reflects it. You're spending your time in ways that match your values and making space for what matters. Protect this. The pull toward obligation and overcommitment never stops, especially for founders. The fact that you've built intentional living into your routine means you have to actively defend it.",
      monitor: "You've rated alignment as a lower focus area right now, and your score is low. If you're in a season of pure execution where personal fulfillment takes a temporary back seat, that can be a valid strategic choice. But monitor how long 'temporary' lasts. Founders who stay in this mode too long end up building impressive businesses they quietly resent.",
      overInvestment: "You're living with strong alignment, but you've rated it as a lower priority. This could mean your alignment runs naturally and doesn't require active management, which is ideal. If that's the case, let it run and redirect your attention to the areas you've identified as more urgent.",
      flag: null
    },
    ME: {
      criticalPriority: "You've flagged your emotional health as a priority, and your score shows why. Your emotional foundation isn't holding, and you know it. The inner critic, the reactivity, the unsustainable pace, the difficulty recovering from stress. All of it is real and all of it is costing you. Because you've already acknowledged this matters, the next step is action: therapy, coaching, a daily regulation practice, or removing the biggest emotional drain in your life.",
      protectAndSustain: "Your emotional health is both strong and a stated priority. You're regulated, your self-talk is constructive, and your pace is sustainable. This is the inner stability that lets you lead, decide, and weather storms without losing yourself. Guard the practices that maintain this. The moment you stop prioritizing emotional health is usually the moment it starts eroding.",
      monitor: "You've rated emotional health as a lower priority, and your score is low. Be cautious with this combination. Unlike some domains, emotional health isn't something you can strategically deprioritize without consequences. It affects your thinking, your relationships, your decision-making, and your physical health. If you're genuinely stable and this score doesn't reflect your experience, reconsider your answers. If it does reflect your experience, reconsider your priorities.",
      overInvestment: "Your emotional health is strong, but it's not a top priority for you right now. If you've done the work and your emotional stability now runs with minimal maintenance, that's a great position. Redirect your active attention to the domains you've flagged as higher priority while maintaining whatever baseline practices keep you stable.",
      flag: "Worth examining: You've rated your emotional health as both low-scoring and low-priority. This is the one domain on this assessment that cannot be safely deprioritized. Emotional instability, harsh self-talk, and unsustainable pace don't stay contained. They leak into your relationships, your decisions, your business, and your body. If you're in emotional crisis and telling yourself it's not important, that's not strategy. That's avoidance. Please reconsider."
    },
    AF: {
      criticalPriority: "You've named focus as a priority and your score confirms the gap. Your attention is being hijacked by distractions, reactive demands, and avoidance patterns. Because you've acknowledged this matters, start with one structural change this week: silence your phone during your most important work block, close email for two hours each morning, or install a screen time limit. One boundary, enforced consistently, creates momentum.",
      protectAndSustain: "Focus is a priority for you and you've built real sovereignty over your attention. In a world designed to fragment focus, this is a genuine competitive advantage. The biggest threat now is gradual boundary erosion. Keep your input rules strict, protect your focus blocks, and audit your digital environment regularly.",
      monitor: "You've rated attention as a lower priority, and your score reflects that. If another domain genuinely needs your energy more right now, this is your call. Just know that poor attention and focus acts as a tax on everything else. Every other domain becomes harder to improve when you can't sustain focus on the work required to improve it.",
      overInvestment: "Your attention and focus scores are strong, but you've rated this as a lower priority. If your focus habits are locked in and running automatically, there's nothing to fix here. Let the system run and direct your energy toward the areas you've identified as more important.",
      flag: null
    },
    RS: {
      criticalPriority: "Self-trust is a priority for you and your score says it's broken. You're not keeping promises to yourself, your boundaries aren't holding, or you're overriding your own needs to manage other people. Because you already recognize this matters, the work is behavioral, not intellectual. Pick one commitment to yourself this week and keep it no matter what. That's where self-trust rebuilds, one kept promise at a time.",
      protectAndSustain: "Your relationship with yourself is strong and it's a stated priority. You trust your judgment, hold boundaries, and keep your word to yourself. This self-trust is the foundation for every other relationship and every bold business decision. Protect it by continuing to hold standards even when it's uncomfortable.",
      monitor: "You've rated your relationship with yourself as a lower priority, and the score is low. This combination deserves careful examination. Self-trust isn't optional infrastructure. It's the foundation that every other domain builds on. If your boundaries are weak and you're not keeping promises to yourself, it's affecting your execution, your relationships, and your business whether you prioritize it or not.",
      overInvestment: "Your self-trust is strong and it's not a top priority for you right now. If your relationship with yourself is stable and self-sustaining, that's a powerful foundation. Direct your active energy toward the domains you've flagged as higher priority. Your solid self-trust will support that work.",
      flag: "Worth examining: You've rated self-trust as both low-scoring and low-priority. Self-trust is foundational to everything else on this assessment. Without it, your boundaries collapse, your execution suffers, and your relationships erode. When someone rates this domain low on both axes, it often means the self-abandonment has become so normalized that it doesn't register as a problem anymore. That normalization is the problem."
    },
    FA: {
      criticalPriority: "Family is a high priority for you and your score says you're falling short. The people closest to you are not getting the version of you they deserve. Because you've acknowledged this matters, the path forward is concrete: protect specific, undistracted time for family. Put your phone in another room during dinner. Have the conversation you've been avoiding. Show up differently this week, not next month.",
      protectAndSustain: "Family is a priority and you're showing up well. Your presence is genuine, your communication is honest, and the people who matter most to you feel it. This is what most founders sacrifice and later regret. The fact that you've built this while running a business is worth protecting fiercely. Don't let a good season make you complacent.",
      monitor: "You've rated family as a lower priority, and your score is low. If you're single with no children and no close family ties, this may genuinely reflect your life circumstances. But if you have a partner or children at home, sit with this honestly. Deprioritizing family often happens gradually and unconsciously. The question isn't whether family matters to you in theory. It's whether the people in your life are experiencing your investment in practice.",
      overInvestment: "Your family relationships are strong, but you've rated family as a lower focus area. If your family life is stable and nourishing without requiring heavy active management right now, that's a healthy foundation. Let it sustain itself while you direct energy toward the areas you've identified as needing more attention.",
      flag: "Worth examining: You've rated family as both low-scoring and low-priority, but your life stage includes a partner or children at home. This assessment doesn't judge your values. But it does ask you to be honest about them. If you have people at home who depend on your presence and you've rated that presence as unimportant, consider whether that rating reflects a genuine strategic choice or whether you've gradually redefined 'not a priority' to mean 'too painful to confront.' Only you know the answer."
    },
    CO: {
      criticalPriority: "Community matters to you and your social world isn't delivering. You're either isolated, surrounded by the wrong people, or not investing enough in the relationships that could actually support you. Because you've named this as a priority, take one specific action this week: reach out to someone you respect, commit to attending a gathering, or deepen one existing friendship through honest conversation.",
      protectAndSustain: "Community is a priority and you've built genuine belonging. You have people who know you, challenge you, and support you. For a founder, this is both rare and strategically valuable. Maintain your investment in these relationships. They don't run on autopilot, and the natural pull of entrepreneurship is toward isolation.",
      monitor: "You've rated community as a lower priority and your score is low. If you're in a season of focused building where social energy is intentionally limited, that can be a reasonable tradeoff. But extended isolation comes with hidden costs: blind spots in your thinking, reduced resilience, and decision-making that suffers from a lack of outside perspective. Don't let this stay low for too long.",
      overInvestment: "Your community score is strong, but it's not a top priority right now. If your social world is healthy and self-sustaining, that's great. Consider whether the time you invest in social activities could be partially redirected toward the domains you've identified as higher priority without letting your relationships deteriorate.",
      flag: null
    },
    WI: {
      criticalPriority: "Contribution matters to you and you're not doing enough of it. You've named impact as a priority, which means the disconnection from purpose is probably creating a quiet emptiness you can feel. The fix is simpler than you think: one act of genuine service this week. Mentor someone, contribute to a cause, use your skills for someone who needs them. Reconnection to purpose is built through action, not reflection.",
      protectAndSustain: "Impact is a priority and you're living it. Your contribution is consistent, genuine, and aligned with who you are. This sense of purpose is one of the most powerful sources of motivation and resilience available to you. Keep feeding it. The moment contribution becomes obligatory rather than authentic, it loses its power.",
      monitor: "You've rated impact as a lower priority, and your score reflects that. If you're in a phase where building the business requires your full attention and contribution to others will come later, that's a valid season. Just watch for the point where 'later' becomes 'never.' Founders who stay disconnected from purpose for too long find it increasingly difficult to reconnect.",
      overInvestment: "Your impact and contribution scores are strong, but you've rated it as a lower priority. If your contribution runs naturally through your work and doesn't consume active energy, that's ideal alignment. If you're spending significant time on service activities while other higher-priority areas suffer, consider whether the balance needs adjusting.",
      flag: null
    },
    VS: {
      criticalPriority: "Strategic clarity is a high priority for you and you don't have it. Your direction is unclear, your decisions lack coherence, and you know it. Because you've acknowledged this matters, here's the move: block two hours this week to answer three questions. Where is the business going in the next 12 months? What are the three priorities that will get it there? What am I saying no to? Write the answers down. That's your strategy.",
      protectAndSustain: "Strategy is a priority and you've nailed it. Your direction is clear, your priorities are simple, and you're executing against a plan rather than reacting. The challenge now is maintaining clarity as success creates new options. Every new opportunity is a potential distraction. Keep your strategy simple and your 'no' strong.",
      monitor: "You've rated strategy as a lower priority and your score is low. If another domain urgently needs your attention, this might be a temporary, acceptable tradeoff. But strategic confusion is expensive because it creates waste in every other area: scattered execution, confused teams, misallocated resources. The longer this stays unresolved, the more it costs.",
      overInvestment: "Your strategic clarity is strong but it's not a top focus area. If your strategy is set and simply needs to be executed, this is the right call. Stop refining the plan and redirect that strategic energy toward the domains that need it most, likely execution or operations.",
      flag: null
    },
    EX: {
      criticalPriority: "Execution is a high priority for you and you're not delivering. You know what needs to get done and it's not getting done. That gap between intention and action is the most expensive problem in your business right now. Because you've acknowledged this matters, install one structural fix: set your three weekly priorities every Monday morning, and don't go to bed on Friday without completing them. System first, motivation second.",
      protectAndSustain: "Execution is a priority and you're delivering consistently. You plan, you execute, you ship. The rhythm is working and the results reflect it. Guard this system. The most common threat to strong execution isn't a crisis. It's the slow accumulation of small exceptions that eventually break the rhythm.",
      monitor: "You've rated execution as a lower priority, and your score reflects inconsistency. If you're deliberately in a planning or strategy phase and execution is temporarily paused, that can be valid. But if this is a pattern of avoidance disguised as strategic patience, be honest with yourself. Nothing happens until something ships.",
      overInvestment: "Your execution is strong but you've rated it as a lower priority. If your execution system runs automatically and doesn't require active attention, that's ideal. Let the system work and focus your conscious effort on the areas you've identified as more urgent.",
      flag: null
    },
    OH: {
      criticalPriority: "Building business systems is a high priority for you, and your operations confirm the gap. You're probably the bottleneck, your numbers are unclear, and the business depends too much on your personal effort. Because you've flagged this as important, commit to one operational improvement this month: document one core process, build one tracking dashboard, or delegate one recurring task. Infrastructure compounds. Start building it.",
      protectAndSustain: "Operational health is a priority and your systems are strong. You know your numbers, your processes run without you, and the business has real predictability. This infrastructure is what separates a business from a job. Continue to invest in operational improvement even when things are running smoothly. Systems that aren't maintained eventually decay.",
      monitor: "You've rated operations as a lower priority and your score is low. If you're early in your business and still finding product-market fit, premature systemization can be counterproductive. But if you have paying clients and repeatable delivery, the absence of systems is costing you capacity, predictability, and sanity every single month. Reconsider whether this should stay deprioritized.",
      overInvestment: "Your operations are solid but you've rated this as a lower focus area. If your systems are built and self-maintaining, redirect your attention to the higher-priority domains. Avoid the trap of endlessly optimizing systems when the real leverage is elsewhere.",
      flag: null
    },
    EC: {
      criticalPriority: "Business alignment is a high priority for you and your score says the model isn't right. Parts of your business conflict with who you are, what you want, or how you're wired. Because you've acknowledged this matters, identify the single biggest point of misalignment: is it how you sell, what you deliver, the pace the model requires, or the life it creates at scale? Name it. Then start redesigning that one element.",
      protectAndSustain: "Ecological alignment is a priority and your business passes the test. What you're building improves your life rather than threatening it, and the model fits who you actually are. This alignment is what allows you to execute without self-sabotage and scale without dread. Protect it by regularly asking yourself whether growth would create more freedom or more entrapment.",
      monitor: "You've rated business alignment as a lower priority, and your score suggests real misalignment. This is one of the most important combinations to examine honestly. If you're building something that doesn't match who you are and you're choosing not to focus on it, ask yourself why. Ecological misalignment is the hidden driver behind most chronic self-sabotage, procrastination, and resistance. This may be the silent cause behind problems you're experiencing in other domains.",
      overInvestment: "Your business alignment is strong but it's not a top focus area. If your model fits and scaling feels safe, that's the right call. Your ecological foundation is solid. Direct your attention to the domains where the real gaps exist.",
      flag: "Worth examining: You've rated business alignment as both low-scoring and low-priority. This means you may be building a business that actively works against the life you want, and you've decided that's not worth addressing. This combination is one of the strongest predictors of chronic self-sabotage, procrastination, and eventual burnout. If part of you suspects the model is wrong but you're choosing to push through anyway, ask yourself what you're hoping will change. Misalignment doesn't resolve through effort. It resolves through redesign."
    }
  };

  var PM_DOMAIN_NAMES = { PH:'Physical Health', IA:'Inner Alignment', ME:'Mental / Emotional', AF:'Attention & Focus', RS:'Relationship to Self', FA:'Family', CO:'Community', WI:'World / Impact', VS:'Vision / Strategy', EX:'Execution', OH:'Operational Health', EC:'Ecology' };

  function buildPriorityMatrix(results) {
    var imp = results.importanceRatings || {};
    var domainScores = results.domainScores || {};
    var codes = ['PH','IA','ME','AF','RS','FA','CO','WI','VS','EX','OH','EC'];

    if (Object.keys(imp).length === 0) return '';

    var matrix = { criticalPriority: [], protectAndSustain: [], monitor: [], overInvestment: [] };
    codes.forEach(function(code) {
      var score = domainScores[code];
      var importance = imp[code];
      if (score == null || importance == null) return;
      var highImp = importance >= 7;
      var highScore = score >= 6.0;
      var entry = { code: code, domain: PM_DOMAIN_NAMES[code], score: score, importance: importance };
      if (highImp && !highScore)  matrix.criticalPriority.push(entry);
      else if (highImp && highScore)  matrix.protectAndSustain.push(entry);
      else if (!highImp && !highScore) matrix.monitor.push(entry);
      else matrix.overInvestment.push(entry);
    });

    var quadrantDefs = [
      { key: 'criticalPriority',  entries: matrix.criticalPriority,  border: 'border-red-200',   bg: 'bg-red-50',   dot: 'bg-red-500',   label: 'Critical Priority',        sub: 'High importance. Low score. Focus here first.',               accentColor: '#EF4444' },
      { key: 'protectAndSustain', entries: matrix.protectAndSustain, border: 'border-green-200', bg: 'bg-green-50', dot: 'bg-green-500', label: 'Protect &amp; Sustain',     sub: 'High importance. Strong score. Don\'t neglect these.',         accentColor: '#22C55E' },
      { key: 'monitor',           entries: matrix.monitor,           border: 'border-gray-200',  bg: 'bg-gray-50',  dot: 'bg-gray-400',  label: 'Monitor',                  sub: 'Lower priority. Lower score. Keep an eye on these.',           accentColor: '#6B7280' },
      { key: 'overInvestment',    entries: matrix.overInvestment,    border: 'border-amber-200', bg: 'bg-amber-50', dot: 'bg-amber-500', label: 'Possible Over-Investment', sub: 'Lower priority, but scoring well. Could this go elsewhere?',   accentColor: '#EAB308' },
    ];

    var html = '';
    html += '<h2 class="where-to-focus text-2xl text-[var(--ap-primary)] mb-2 mt-10">Where to Focus</h2>';
    html += '<p class="where-to-focus-intro text-sm text-[var(--ap-secondary)] mb-6 leading-relaxed">Based on your scores and the importance ratings you set, here is where your energy is best directed right now. Expand any domain to read your personalized guidance.</p>';
    html += '<div class="mb-10 space-y-3">';
    quadrantDefs.forEach(function(q) {
      html += '<div class="pm-quadrant rounded-xl border-2 ' + q.border + ' ' + q.bg + ' p-4">';
      html += '<div class="pm-quadrant-header flex items-start gap-2 mb-3">';
      html += '<span class="w-2 h-2 rounded-full ' + q.dot + ' mt-1.5 flex-shrink-0"></span>';
      html += '<div><p class="font-semibold text-sm leading-tight" style="color:' + q.accentColor + '">' + q.label + '</p><p class="text-xs text-[var(--ap-muted)] mt-0.5 leading-snug">' + q.sub + '</p></div></div>';
      if (q.entries.length === 0) {
        html += '<p class="text-sm text-[var(--ap-muted)] italic">None right now.</p>';
      } else {
        html += '<div class="pm-cards-wrap flex flex-wrap gap-2">';
        q.entries.forEach(function(e) {
          var copy = PM_COPY[e.code] ? PM_COPY[e.code][q.key] : '';
          var flagCopy = (q.key === 'monitor' && PM_COPY[e.code] && PM_COPY[e.code].flag) ? PM_COPY[e.code].flag : null;
          if (e.code === 'FA' && flagCopy) {
            var profile = results.contextualProfile || {};
            var lifeStage = profile.lifeStage || '';
            if (['Partnered, no children','Young children at home (under 12)','Older children at home (12+)'].indexOf(lifeStage) === -1) flagCopy = null;
          }
          var uid = 'pm-' + q.key + '-' + e.code;
          html += '<div class="pm-card flex-1 min-w-[240px] max-w-[calc(50%-0.25rem)] border border-[var(--ap-border)] rounded-lg overflow-hidden bg-white">';
          html += '<button type="button" pm-card-toggle onclick="(function(){var c=document.getElementById(\'' + uid + '\');var open=c.classList.toggle(\'hidden\');document.getElementById(\'' + uid + '-chev\').style.transform=open?\'rotate(0deg)\':\' rotate(180deg)\';})()" class="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-[var(--ap-bg)]/60 transition-colors">';
          html += '<div class="flex flex-col min-w-0">';
          html += '<span class="font-semibold text-[var(--ap-secondary)] text-sm leading-tight truncate">' + escapeHtml(e.domain) + '</span>';
          html += '<div class="flex items-center gap-2 mt-0.5">';
          html += '<span class="text-xs font-bold" style="color:' + q.accentColor + '">' + e.score + '/10</span>';
          html += '<span class="text-xs text-[var(--ap-muted)]">Priority: ' + e.importance + '/10</span>';
          html += '</div></div>';
          html += '<svg id="' + uid + '-chev" class="pm-chev w-4 h-4 flex-shrink-0 text-[var(--ap-muted)] transition-transform duration-200" style="transform:rotate(180deg)" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>';
          html += '</button>';
          html += '<div id="' + uid + '" class="pm-card-body px-3 pb-3 pt-0 bg-white">';
          html += '<p class="text-sm text-[var(--ap-secondary)] leading-relaxed">' + escapeHtml(copy) + '</p>';
          if (flagCopy) html += '<div class="pm-flag-box mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg"><p class="text-xs font-semibold text-amber-800 mb-1">Worth Examining</p><p class="text-xs text-amber-900 leading-relaxed">' + escapeHtml(flagCopy) + '</p></div>';
          html += '</div>';
          html += '</div>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  global.VAPI_PM = { buildPriorityMatrix: buildPriorityMatrix };
})(typeof window !== 'undefined' ? window : this);
