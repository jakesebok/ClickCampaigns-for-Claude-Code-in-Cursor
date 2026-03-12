/**
 * VAPI Founder Archetype System
 * Determines archetype from scores, provides content and icons.
 * Exposes: determineArchetype(results), VAPI_ARCHETYPES, getArchetypeIcon(name, color)
 */
(function(global) {
  'use strict';

  // Map spec "Self" to code "Personal"
  var SELF = 'Personal';

  var ARCHETYPES = {
    'The Architect': {
      name: 'The Architect',
      tagline: "You've built a life and business that actually work together.",
      color_accent: '#1E3A5F',
      description: "<strong>The Architect</strong> builds on a solid personal foundation. Your relationships are real. Your business is clear, executing, and aligned with who you actually are. This isn't perfection, and it's not balance in some idealized sense. It's integration. The way you live reinforces the way you work, and vice versa. Most founders sacrifice one arena to prop up another. You've figured out how to build all three simultaneously. That's not luck. That's the result of sustained, honest effort across every dimension of your life.",
      strength: "True integration. Your arenas reinforce each other instead of competing. Health fuels focus. Relationships provide resilience. Business creates freedom. And the whole system compounds.",
      shadow: "Complacency. When everything is working, the urgency to maintain it fades. The biggest threat to The Architect isn't failure. It's the slow, invisible drift that happens when you stop auditing because things feel good.",
      constraint: "Maintaining the standard. Your challenge is sustainability and continued growth at a high level, not fixing something broken.",
      growth_path: "The Architect's path is deepening, not fixing. The work is staying honest, raising the ceiling, and expanding your impact without sacrificing what you've built. Mastery isn't a destination. It's a practice.",
      program_phase: "Phase 5: Embodied Execution. You don't need to find clarity or remove blocks. You need to sustain and deepen what's already working."
    },
    'The Phoenix': {
      name: 'The Phoenix',
      tagline: 'In the fire. Not finished.',
      color_accent: '#D4A017',
      description: "<strong>The Phoenix</strong> is the founder whose life and business are in serious deficit across multiple areas. Your health, your relationships, your business, your emotional state, possibly all of them, are below where they need to be. This isn't a rough patch. It's a crisis, even if it doesn't look like one from the outside. But here's what matters: you're here. You took an 84-question assessment and answered honestly. You're reading this right now. The person in true denial doesn't take this assessment at all. The fact that you're confronting the reality of where you are is itself the first act of rebuilding. The Phoenix doesn't rise because the fire wasn't real. It rises because something in it refused to stay down.",
      strength: "Honesty and resilience. You're still in the game. You're still trying. That matters more than any score on this assessment.",
      shadow: "The risk is overwhelm. When everything is broken, the temptation is either to try to fix all of it at once, which is impossible, or to give up entirely, which is unnecessary. Neither serves you.",
      constraint: "Compounding deficits. Each weak area is making the others worse. The constraint isn't any single domain. It's the systemic nature of the crisis. The solution is ruthless triage: identify the one domain that would create the most relief and focus there first.",
      growth_path: "The Phoenix's path is rebuilding from the ground up, one domain at a time. You're building toward The Architect, but the bridge starts with stabilization. Not optimization. Not strategy. Stabilization.",
      program_phase: "Phase 1: Awareness. The Phoenix needs the longest, most honest Phase 1 to fully map the situation, identify the true starting point, and build the psychological safety to begin rebuilding without shame."
    },
    'The Engine': {
      name: 'The Engine',
      tagline: 'Building fast. Building wrong.',
      color_accent: '#C0392B',
      description: "<strong>The Engine</strong> can execute—that's not the problem. You ship, you grind, you produce, you follow through. The problem is that the machine you've built is pointed in the wrong direction. Your business model doesn't fit who you are, or your strategy doesn't connect to what you actually want, or you're scaling something that will make you more trapped rather than more free. You're the founder with a gas pedal and no steering wheel. Every ounce of your impressive execution power is being spent building something that part of you already knows isn't right. And that misalignment is the silent reason behind the resistance, the procrastination on the big strategic decisions, and the quiet dread that shows up when you think about what 'success' in this model actually looks like.",
      strength: "Execution discipline. You can do the work. You have the systems, the rhythm, and the follow-through. This is the hardest capability to build and you already have it.",
      shadow: "Execution without alignment is the most expensive mistake a founder can make. You're spending your rarest resource, disciplined action, on something that doesn't serve your actual life. Speed in the wrong direction just gets you further from where you want to be, faster.",
      constraint: "Ecological misalignment. The destination isn't safe, so part of you is fighting the journey even while another part forces execution forward. This internal war is exhausting and unsustainable.",
      growth_path: "The Engine's path is stopping long enough to redirect. You don't need to learn how to execute. You need to make sure what you're executing on is worth the effort. You're building toward The Architect, but the bridge runs through a fundamental redesign of your business model and strategy.",
      program_phase: "Phase 2: Strategic Clarity into Phase 3: Internal Alignment. The Engine needs to redefine the destination first, then address the internal beliefs keeping them locked into a model that doesn't fit."
    },
    'The Drifter': {
      name: 'The Drifter',
      tagline: 'Fine everywhere. Exceptional nowhere.',
      color_accent: '#B8A88A',
      description: "<strong>The Drifter</strong> is the most comfortable and most dangerous archetype. Nothing is broken. Nothing is in crisis. Everything is 'fine.' Your health is okay. Your relationships are decent. Your business is functional. And that's exactly the problem. You're operating in a zone where there's never enough pain to force change and never enough excellence to create momentum. The Drifter pattern is seductive because it looks like stability. It's actually stagnation with a nice paint job. The biggest risk isn't that something breaks. It's that you spend the next five years exactly where you are right now and call it 'good enough.'",
      strength: "Balance and stability. You haven't sacrificed any arena entirely, and you have a foundation in every area to build on.",
      shadow: "'Good enough' is the enemy of great. You're using the absence of crisis as permission to avoid the harder work of building something exceptional. You're coasting and calling it balance.",
      constraint: "A lack of strategic intensity. The Drifter doesn't have a broken area to fix. They have a missing commitment to excellence in any one area. The constraint is usually decision-related: you haven't chosen what matters most and gone all-in.",
      growth_path: "The Drifter's path is choosing. Picking the arena or domain that matters most right now and driving it from Functional to Dialed. One area of excellence creates a cascade that lifts everything else. You're building toward The Architect, but the bridge starts with one brave decision about where to focus.",
      program_phase: "Phase 2: Strategic Clarity. The Drifter needs a vision that's compelling enough to break through the comfort of 'fine.' Without a clear, emotionally charged direction, they'll continue to maintain mediocrity across the board."
    },
    'The Performer': {
      name: 'The Performer',
      tagline: 'Impressive output. Crumbling foundation.',
      color_accent: '#E87A20',
      description: "<strong>The Performer</strong> looks like they have it together from the outside. The business is producing. The revenue is there. The output is visible. But underneath the performance, your personal foundation is cracking. Your sleep is inconsistent. Your emotional regulation is strained. Your pace is unsustainable. Your body is sending signals you keep overriding. You've been running on willpower, adrenaline, and the fear of what happens if you slow down. The irony is that the performance you're so proud of is being built on a foundation that's actively eroding your ability to sustain it.",
      strength: "Drive, execution, and the ability to produce under pressure. You know how to get things done, and people respect your output.",
      shadow: "You've confused output with health. You've built your identity around productivity, and slowing down feels like dying. The exhaustion isn't a bug in your system. It IS your system.",
      constraint: "A nervous system running in perpetual overdrive. You don't have an execution problem. You have a sustainability problem disguised as success.",
      growth_path: "The Performer's path is learning that sustainable output requires a foundation that can hold it. You're building toward The Architect, but the bridge runs through your body and your nervous system, not through more hustle.",
      program_phase: "Phase 3: Internal Alignment. The belief driving The Performer is usually some version of 'I'm only valuable when I'm producing' or 'Rest is earned, not given.' Until that belief is addressed, no health protocol or time management system will stick."
    },
    'The Ghost': {
      name: 'The Ghost',
      tagline: 'Building an empire. Disappearing from your own life.',
      color_accent: '#8A9BAE',
      description: "<strong>The Ghost</strong> has strong business metrics. You might even have your personal health and habits together. But the people in your life are experiencing your absence. Your family gets whatever's left after work takes its share. Your friendships are thin or transactional. You might not even trust yourself enough to be vulnerable with anyone. You've optimized for achievement and accidentally optimized away the connections that make achievement meaningful. The loneliest version of success is the one where you have everything except someone who actually knows you.",
      strength: "Professional focus and the ability to build something real. You don't get distracted by social noise, and your work ethic is genuine.",
      shadow: "Isolation dressed up as independence. You tell yourself you don't need people, but the truth is you've stopped letting people in. Whether that's from fear, busyness, or a pattern of self-reliance that's become self-imprisonment, the result is the same: you're building something impressive in an increasingly empty room.",
      constraint: "A belief that connection is a luxury or a vulnerability rather than a strategic and emotional necessity. Often paired with a fear of being truly seen.",
      growth_path: "The Ghost's path is learning that relationships aren't a distraction from the mission. They're the infrastructure that makes the mission sustainable. You're building toward The Architect, but the bridge runs through vulnerability and presence.",
      program_phase: "Phase 2: Strategic Clarity. The Ghost needs to redefine success to include relational health, not just business performance. Until 'connected' is part of the vision, the isolation will continue to be deprioritized."
    },
    'The Guardian': {
      name: 'The Guardian',
      tagline: 'All heart. Needs a vehicle.',
      color_accent: '#2A9D8F',
      description: "<strong>The Guardian</strong> pours into people beautifully. Your family feels your presence. Your friendships are real. You might even have a strong sense of contribution and purpose. But your business isn't reflecting your capability. Your strategy is unclear, your execution is inconsistent, your operations are fragile, or you're undercharging and over-delivering. You give endlessly to others and struggle to build the engine that funds the life you want. There's often an underlying belief that focusing on money or business growth is somehow selfish or at odds with being a good person. It's not. It's the vehicle that sustains everything you care about.",
      strength: "Relational depth, genuine generosity, and the ability to make people feel seen. These are rare and invaluable qualities that most founders lack entirely.",
      shadow: "Chronic self-sacrifice disguised as service. You may be using relationships as a hiding place from the harder, lonelier work of building something for yourself. Taking care of others feels noble. Building a business feels exposed.",
      constraint: "A belief that business success and relational integrity are in tension. Often paired with discomfort around self-promotion, pricing, or claiming space for yourself.",
      growth_path: "The Guardian's path is learning that building a strong business IS an act of service, because it funds, sustains, and amplifies everything you care about. You're building toward The Architect, but the bridge runs through strategic clarity and the willingness to build for yourself.",
      program_phase: "Phase 2: Strategic Clarity. The Guardian needs a vision that explicitly connects business results to the relational and impact outcomes they already care about. Once they see that revenue serves their values instead of threatening them, the resistance dissolves."
    },
    'The Seeker': {
      name: 'The Seeker',
      tagline: 'Deeply self-aware. Stuck in insight.',
      color_accent: '#7B5EA7',
      description: "<strong>The Seeker</strong> has done the inner work. Your health habits might be solid. You understand your patterns, your values, and what you want. Your emotional regulation is decent. But your business isn't reflecting any of it. The strategy is unclear or constantly shifting. Execution is inconsistent. Operations are nonexistent or fragile. You have extraordinary self-knowledge and almost no traction. The gap between what you know about yourself and what you've built in the world is wide, and it's starting to feel like all that inner work was just another form of avoidance.",
      strength: "Self-awareness, emotional intelligence, and a genuine commitment to personal growth. You understand yourself at a depth most founders never reach.",
      shadow: "Insight without action becomes its own trap. You may be using self-development as a sophisticated form of procrastination: always preparing, never launching. The next book, the next course, the next journal entry, the next realization. At some point, you have to stop seeking and start building.",
      constraint: "A gap between internal clarity and external execution. Often driven by perfectionism, fear of failure that's louder than fear of stagnation, or a belief that the right insight will eventually make action effortless. It won't. Action makes action effortless.",
      growth_path: "The Seeker's path is learning that execution IS the final form of self-development. You're building toward The Architect, but the bridge is built by doing, not by understanding more.",
      program_phase: "Phase 4: Aligned Action. The Seeker doesn't need more clarity. They need a Personal Alignment Operating System that translates their awareness into rhythms, boundaries, and structures that produce output. They need to stop preparing and start operating."
    }
  };

  /**
   * Determine archetype from results. Uses priority-ordered evaluation.
   * Arena names in code: Personal (spec "Self"), Relationships, Business.
   */
  function determineArchetype(results) {
    var arenaScores = results.arenaScores || {};
    var domainScores = results.domainScores || {};
    var domains = results.domains || [];

    var selfScore = arenaScores[SELF] ?? arenaScores.Personal;
    var relScore = arenaScores.Relationships;
    var bizScore = arenaScores.Business;

    if (domainScores && Object.keys(domainScores).length === 0 && domains.length > 0) {
      var byCode = {};
      domains.forEach(function(d) { byCode[d.code] = d.score; });
      domainScores = byCode;
    }

    var overall = typeof results.overall === 'number' ? results.overall : null;
    if (overall == null && domainScores && Object.keys(domainScores).length > 0) {
      var codes = ['PH','IA','ME','AF','RS','FA','CO','WI','VS','EX','OH','EC'];
      var sum = 0;
      codes.forEach(function(c) { sum += domainScores[c] || 0; });
      overall = sum / 12;
    }

    var exScore = domainScores.EX;
    var ecScore = domainScores.EC;
    var vsScore = domainScores.VS;

    var s = selfScore != null ? parseFloat(selfScore) : null;
    var r = relScore != null ? parseFloat(relScore) : null;
    var b = bizScore != null ? parseFloat(bizScore) : null;

    // PRIORITY 1: THE ARCHITECT
    if (s >= 8.0 && r >= 8.0 && b >= 8.0) return 'The Architect';

    // PRIORITY 2: THE PHOENIX
    var arenasLow = 0;
    if (s != null && s <= 4.5) arenasLow++;
    if (r != null && r <= 4.5) arenasLow++;
    if (b != null && b <= 4.5) arenasLow++;
    if (overall != null && overall <= 4.5) return 'The Phoenix';
    if (arenasLow >= 2) return 'The Phoenix';

    // PRIORITY 3: THE ENGINE
    if (exScore != null && exScore >= 7.0 && ((ecScore != null && ecScore <= 5.0) || (vsScore != null && vsScore <= 5.0))) return 'The Engine';

    // PRIORITY 4: THE DRIFTER
    var allMid = s != null && r != null && b != null &&
      s >= 5.0 && s <= 7.9 && r >= 5.0 && r <= 7.9 && b >= 5.0 && b <= 7.9;
    var spread = Math.max(s, r, b) - Math.min(s, r, b);
    if (allMid && spread <= 2.0) return 'The Drifter';

    // PRIORITY 5: THE PERFORMER (Business highest, Self lowest, spread >= 2)
    if (s != null && r != null && b != null) {
      var maxA = Math.max(s, r, b);
      var minA = Math.min(s, r, b);
      if (b === maxA && s === minA && (b - s) >= 2.0) return 'The Performer';
    }

    // PRIORITY 6: THE GHOST (Business highest, Relationships lowest, spread >= 2)
    if (s != null && r != null && b != null) {
      if (b === Math.max(s, r, b) && r === Math.min(s, r, b) && (b - r) >= 2.0) return 'The Ghost';
    }

    // PRIORITY 7: THE GUARDIAN (Relationships highest, Business lowest, spread >= 2)
    if (s != null && r != null && b != null) {
      if (r === Math.max(s, r, b) && b === Math.min(s, r, b) && (r - b) >= 2.0) return 'The Guardian';
    }

    // PRIORITY 8: THE SEEKER (Self highest, Business lowest, spread >= 2)
    if (s != null && r != null && b != null) {
      if (s === Math.max(s, r, b) && b === Math.min(s, r, b) && (s - b) >= 2.0) return 'The Seeker';
    }

    // FALLBACK: THE DRIFTER
    return 'The Drifter';
  }

  /**
   * Return Lucide icon element for archetype. Uses Lucide's professionally designed icons.
   * Caller must run lucide.createIcons() after injecting to render. Color inherits from style.
   */
  function getArchetypeIcon(archetypeName, color) {
    var meta = ARCHETYPES[archetypeName];
    var c = color || (meta && meta.color_accent) || '#0E1624';
    var lucideIcons = {
      'The Architect': 'drafting-compass',
      'The Phoenix': 'flame',
      'The Engine': 'cog',
      'The Drifter': 'wind',
      'The Performer': 'star',
      'The Ghost': 'ghost',
      'The Guardian': 'shield',
      'The Seeker': 'search'
    };
    var iconName = lucideIcons[archetypeName];
    if (!iconName) return '';
    return '<i data-lucide="' + iconName + '" class="w-full h-full" style="color:' + c + '"></i>';
  }

  /** Constellation network: positions (x,y in 0-400 x 0-280) and connections */
  var CONSTELLATION = {
    positions: {
      'The Architect': { x: 200, y: 35 },
      'The Phoenix': { x: 70, y: 230 },
      'The Engine': { x: 330, y: 70 },
      'The Drifter': { x: 200, y: 140 },
      'The Performer': { x: 310, y: 180 },
      'The Ghost': { x: 340, y: 230 },
      'The Guardian': { x: 60, y: 110 },
      'The Seeker': { x: 200, y: 230 }
    },
    connections: [
      ['The Architect', 'The Phoenix'],
      ['The Architect', 'The Engine'],
      ['The Architect', 'The Drifter'],
      ['The Architect', 'The Performer'],
      ['The Architect', 'The Ghost'],
      ['The Architect', 'The Guardian'],
      ['The Architect', 'The Seeker'],
      ['The Phoenix', 'The Drifter'],
      ['The Engine', 'The Performer'],
      ['The Ghost', 'The Guardian'],
      ['The Seeker', 'The Drifter']
    ]
  };

  function buildConstellationSVG(highlightArchetype) {
    var vb = '0 0 400 280';
    var html = '<div class="archetype-constellation mt-6 pt-6 border-t border-[var(--ap-border)]">';
    html += '<svg viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" class="w-full max-w-md mx-auto block" style="min-height:200px" aria-hidden="true">';
    var drawn = {};
    CONSTELLATION.connections.forEach(function(pair) {
      var a = pair[0], b = pair[1];
      var key = a < b ? a + '|' + b : b + '|' + a;
      if (drawn[key]) return;
      drawn[key] = true;
      var pa = CONSTELLATION.positions[a], pb = CONSTELLATION.positions[b];
      if (!pa || !pb) return;
      var stroke = 'var(--ap-border)';
      if (highlightArchetype && (a === highlightArchetype || b === highlightArchetype)) {
        var meta = ARCHETYPES[highlightArchetype];
        stroke = (meta && meta.color_accent) ? meta.color_accent : 'var(--ap-accent)';
      }
      html += '<line x1="' + pa.x + '" y1="' + pa.y + '" x2="' + pb.x + '" y2="' + pb.y + '" stroke="' + stroke + '" stroke-width="1" stroke-opacity="0.6"/>';
    });
    var names = Object.keys(CONSTELLATION.positions);
    names.forEach(function(name) {
      var p = CONSTELLATION.positions[name];
      var meta = ARCHETYPES[name];
      var color = (meta && meta.color_accent) ? meta.color_accent : 'var(--ap-primary)';
      var tagline = (meta && meta.tagline) ? meta.tagline : '';
      var tooltip = name + (tagline ? '\n"' + tagline + '"' : '');
      var isHighlight = name === highlightArchetype;
      var r = isHighlight ? 10 : 6;
      var cls = isHighlight ? 'arch-node arch-node-highlight' : 'arch-node';
      html += '<g class="' + cls + '" style="cursor:pointer">';
      html += '<title>' + tooltip.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') + '</title>';
      if (isHighlight) html += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + (r + 4) + '" fill="' + color + '" opacity="0.2"/>';
      html += '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '" fill="' + color + '" stroke="' + (isHighlight ? '#fff' : 'rgba(255,255,255,0.8)') + '" stroke-width="' + (isHighlight ? 2 : 1) + '"/>';
      html += '<text x="' + p.x + '" y="' + (p.y + 22) + '" text-anchor="middle" font-size="9" font-weight="' + (isHighlight ? '700' : '500') + '" fill="var(--ap-primary)" class="arch-label">' + name.replace('The ', '') + '</text>';
      html += '</g>';
    });
    html += '</svg>';
    html += '<p class="text-xs text-[var(--ap-muted)] mt-3 text-center max-w-md mx-auto">Connected patterns share growth dynamics. Your archetype is highlighted—no hierarchy, just relationships.</p>';
    html += '</div>';
    return html;
  }

  global.VAPI_ARCHETYPES = ARCHETYPES;
  global.VAPI_ARCHETYPE = {
    determine: determineArchetype,
    getIcon: getArchetypeIcon,
    get: function(name) { return ARCHETYPES[name] || null; },
    buildConstellation: buildConstellationSVG
  };
})(typeof window !== 'undefined' ? window : this);
