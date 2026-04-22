# Axiom — Product Strategy

*A synthesis of VAPI (business owners), Edge Profile (day traders), and Jake's existing build-your-assessment intake into a sellable, AI-automated productized service.*

**Product name: Axiom.** *"Your methodology, proven, productized, measured."*

Date: 2026-04-21 (V2 update: 2026-04-21)

---

## 0. The Universal Pattern

Strip away the content domains (business alignment vs. trading psychology) and both products are the same seven-layer instrument:

| Layer | What it is | VAPI | Edge Profile |
|---|---|---|---|
| **1. Taxonomy** | Constructs measured | 3 arenas × 4 domains = 12 | 4 arenas × ~2–3 domains = 10 |
| **2. Question Bank** | Weighted Likert items | 72 items (1–10 scale), anchor/standard/supporting weights, reverse items | 60 items (1–7 scale), same weight tiers, reverse items |
| **3. Scoring Engine** | Deterministic aggregation | Weighted domain → arena → composite | Same |
| **4. Archetype Layer** | Persona lookup from score patterns | 9 archetypes (Architect, Journeyman, Performer, Ghost...) | 9 archetypes (EdgeState, Operator, White Knuckle, Analyst...) |
| **5. Driver/Trap Layer** | Behavioral pattern detection via signal questions | 10 drivers (Achiever's Trap, Escape Artist, Pleaser's Bind...) | 8 drivers (Guardian, Rush, Avenger, Gatekeeper...) |
| **6. Narrative Library** | Pre-authored prose that renders results | ~1,900 lines across archetypes/drivers/matrix/plan content | ~250 KB of archetype + driver + protocol prose |
| **7. Ritual Layer** | Ongoing scoring between assessments | Six-C Scorecard (weekly/monthly cadence) | Pre-trade check-in + post-trade scorecard (per-session) |

**Plus two wrappers both share:**
- **Priority Matrix** (score × importance 2×2) → "Critical Priority / Emerging / Maintain / Over-Investing" quadrants with domain-specific blurbs
- **Generated Plan** (VAPI's 28-day sprint, EdgeState's 28-day plan via `POST /api/portal/data/action-plan/generate`) that selects a focus domain + driver modifier + level-calibrated copy

**What this means:** You are not selling assessments. You are selling a **productized psychometric operating system** — a white-label instrument, portal, and ritual stack that turns any coach's methodology into a measurable, repeatable, longitudinal product.

The assessment is the hook. The ritual layer is the retention engine. The narrative library is the moat.

---

## A. Offer & Upsell Structure

### The product name

Working title: **Construct™** (as in "your proprietary construct, productized"). Or **Instrument**. Or **Beacon**. Pick one — I'll use "the Platform" below.

### Tiered offer (productized service → evolves to SaaS)

| Tier | Deliverable | Who it's for | Anchor price | Delivery time |
|---|---|---|---|---|
| **T0 — Sampler** | The intake itself (Jake's current `/build-your-assessment` flow) + a 60-min scoping call + a written Methodology Brief (1 AI agent's output, human-reviewed) | Curious leads, methodology-undefined coaches | **$1,500** (refundable against T1+) | 7 days |
| **T1 — Instrument** | Full public-facing assessment: taxonomy, 60–72 questions, 9 archetypes, 8–10 drivers, priority matrix, narrative library, branded HTML results page, email-capture + results delivery | Coaches with a defined method who want a lead magnet and qualifying tool | **$18,000–$28,000** | 30–45 days |
| **T2 — Portal** | T1 + client login portal, assessment history, 90-day reassessment lifecycle, priority-matrix dashboard, generated 28-day plan, coach-facing view with client roster and trend lines | Coaches running 1:1 programs or cohorts who want onboarding + progress tracking | **$45,000–$75,000** | 60–90 days |
| **T3 — Operating System** | T2 + **Ritual Layer** (daily/weekly scorecard like Six-C or pre-/post-session check-ins) + AI Coach (versioned prompt template, gate/refusal layer, 3-block prompt caching, results-informed responses) + reassessment drift tracking | Established coaches scaling past 1:1, building SaaS-like recurring revenue from their method | **$110,000–$180,000** | 90–120 days |
| **T4 — License & Operate** | Ongoing hosting, content updates, quarterly content-refresh waves, assessment version management, performance analytics, cohort reports | Anyone on T1–T3 who wants it run as a service | **$2,800–$7,500/mo** retainer | Monthly |

### Cross-tier upsells (add to any tier)

| Upsell | Price | When to offer |
|---|---|---|
| **Native iOS/Android shell** (wrapping the web portal) | $12K–$25K | T2+ if audience is mobile-dominant (traders, athletes, parents) |
| **Additional archetype or driver content module** (e.g., "Leadership Archetype add-on") | $3K–$6K per module | Any tier, after first deployment |
| **Team/Cohort Edition** (coach sees a group; aggregate dashboards) | $15K one-time + added retainer | T2+ for L&D, corporate, or group coaching |
| **API + CRM integration pack** (HubSpot/Salesforce/Kajabi webhook + field map) | $4K–$8K | T1+ if the coach has a funnel |
| **Copywriting upgrade** (full voice-matching pass on narrative library by human copywriter) | $5K–$12K | T1+ for perfectionist-voice clients |
| **Book/course integration** (assessment routes into their course modules) | $8K–$15K | T2+ for educators |
| **Cinematic results experience** (animated scroll, custom SVG radar, video intro) | $6K–$15K | T1+ for premium brands |
| **Crisis/safety routing** (hard-refusal gate like EdgeState's, mandatory for mental-health adjacent) | $4K–$8K | T2+ for therapy/wellness adjacent work |

### Downsells (save the lead)

- Can't afford T1? Offer **Assessment Strategy Call** at $500 (methodology review + custom outline they can build themselves).
- Not ready? Keep them in a **quarterly content drip** (case studies, methodology worksheets, archetype-building examples) for $19/mo.

### The positioning hook

> *"You have a methodology. We turn it into an instrument. Your instrument sits on a platform that scales your method the way your book never could."*

The T1→T3 ladder is not about features — it's about **how far the coach wants to extend their IP from a one-time read into a relationship that renews every 90 days**.

---

## B. Target Audience

### Beachhead (first 20 customers)

**Executive & business coaches with proprietary methodology, $150K–$750K annual revenue, 5+ years in practice, limited in-house tech.**

Why: They already have a frame (the taxonomy and drivers practically write themselves from their workshops). They understand the ROI math of a lead magnet + a $25K program backend. They can't build this themselves and won't hire a dev team. Jake himself is this avatar.

Specific niches in the beachhead:
1. **EOS Implementers / Strategic Coach-style business coaches** — framework-native, understand assessments
2. **Leadership & executive coaches** (ICF-credentialed, 5+ years, selling $10K–$60K programs)
3. **Trading/performance psychology coaches** (like Edge — first obvious vertical beyond Jake)
4. **Sales methodology coaches** (Sandler, Challenger adjacencies — already taxonomy-heavy)
5. **Health/performance coaches with a measurable model** (functional medicine, longevity, sports perf)

### Second-wave audience (customers 20–100)

| Segment | Why they'd buy |
|---|---|
| **Thought leaders / book authors** | Productize the book's framework; monetize the backlist |
| **Corporate trainers / L&D consultants** | Sell a team assessment to HR buyers |
| **Cohort-based course operators (Maven, Teachable, etc.)** | Pre-assessment routes learners into the right module; post-assessment tracks progress |
| **Therapists / counselors (group practices)** | Intake instrument + ongoing tracking (T3 only with crisis-gate upsell) |
| **Speaking coaches, brand coaches, career coaches** | Qualify + segment their lead flow |
| **Sports/performance teams** | Athlete profiling + in-season ritual layer |

### Third-wave (platform play, customers 100+)

Religious/faith orgs, 12-step-adjacent programs, school counselors, creator-economy coaches, influencer monetization. **Don't build for these yet** — they'll emerge organically and teach you the product, as EdgeState taught Jake the daily-ritual pattern.

### Who **not** to sell to (at least in T1)

- Anyone without a written methodology — too much foundational work, margins die
- Anyone asking "can you just give me a generic leadership assessment" — commoditized, DiSC and StrengthsFinder already own that shelf
- Pre-revenue coaches — they're not buyers, they're tire-kickers
- Anyone who won't do the discovery work (the methodology-extraction interviews) — garbage in, garbage out

---

## C. Information You Need to Gather

Your current `/build-your-assessment` intake already nails the *structural* questions (arenas, domains, scale length, modules, brand). The gap is **substantive IP** — the raw material that lets an AI agent pipeline produce the narrative library and archetypes without you writing prose for 40 hours per client.

### The full intake (evolution of what exists)

**Part 1 — Structural scope** *(you already have this)*
- Goals, audience, decisions the result feeds
- Construct hierarchy (arenas/domains vs. flat pillars)
- Length, scale type, modules (portal, coaching OS, plans, ritual layer)
- Brand assets, integrations, timeline
- Contact + budget range

**Part 2 — Methodology IP extraction** *(new — this is the AI-production fuel)*

1. **Framework artifacts** — upload any of: book PDF, course curriculum, keynote deck, workshop worksheet, client workbook, coaching manual
2. **Voice samples** — 2–3 long-form writing samples (blog posts, book chapters, newsletters) totalling 3,000+ words so the Narrative Writer agent can match voice
3. **Case examples** — **this is the most important input** — 5–10 anonymized client stories covering:
   - The pattern they came in with (the trap/driver)
   - The shift you helped them make
   - What "success" looked like in their arena
   - Language they used to describe their own pattern
   *(These are the raw material for archetype authoring. Without them, archetypes are generic. With them, every archetype has a real person's gravity behind it.)*
4. **Transcripts** — 1–3 full coaching session transcripts (most coaches have these from Zoom recordings; we handle the anonymization) — lets the Pattern Analyst agent mine recurring language and objection patterns
5. **Philosophy signals** — short-answer or slider questions:
   - Harsh diagnostic vs. kind growth-oriented tone (slider)
   - Directive vs. reflective (slider)
   - Faith-based / secular / agnostic
   - Is "negative result" OK, or must every archetype have dignity? (crucial — this is why Edge has both "EdgeState" and "Survivor" with dignity)
   - Any words, frames, or claims that are off-limits (lexicon exclusion list, à la Jake's own LEXICON doc)
6. **Ritual cadence** *(for T3+)* — what rhythm does the coach want clients to maintain between assessments? Daily check-in? Weekly scorecard? Per-session reflection? What's the minimum data the coach wants flowing back in?
7. **Outcome/KPI hypothesis** — what does the coach believe should improve over 90 days of their program? (This becomes the reassessment drift metric.)
8. **Upsell destination** — what does the coach's business model require the assessment to feed into? (1:1 discovery call, group program enrollment, book sale, course module routing) — drives the results-page CTA and the downstream coach-dashboard view.

**Part 3 — Boundary-setting** *(new, optional but recommended)*
- Crisis/out-of-scope content policy (especially for wellness/therapy adjacencies — drives the gate/refusal layer)
- Legal disclaimers, licensing claims, jurisdictional flags
- Content refresh ownership (will the coach own the narrative library, or will Jake's team maintain it under T4 retainer?)

### Why these specifically

Layers 1–3 (taxonomy → questions → scoring) are **mostly mechanical** — an AI agent can propose them well from even sparse inputs, then refine with the coach.

Layer 4 (archetypes) and Layer 6 (narrative library) are **voice-and-case-story dependent**. Without 5–10 real client stories and solid voice samples, the output reads like warmed-over ChatGPT. With them, it reads like the coach wrote it at 2 AM after their best client session.

Layer 5 (drivers) emerges from session transcripts and case patterns — pure Pattern Analyst work.

Layer 7 (ritual layer) requires the coach to articulate what they *already* ask clients to track. If they don't have an answer, that's fine — T2 and below, skip it. T3 requires it.

---

## D. The Delivery Pipeline — From "Interested" to "Delivered"

This is the production flow. The numbers in parentheses are which agent does the work. "Agent" = a specialized Claude prompt run against a specific input bundle with a specific output contract. Some steps are human-in-the-loop; flagged with 👤.

### Phase 0 — Marketing & Lead Acquisition (always on)

- Public VAPI and Edge Profile assessments are the top-of-funnel lead magnets
- Content marketing (case studies of coaches who productized their method, podcast, YouTube)
- Referral incentives from T3/T4 clients (they refer peers)
- Retarget from `/build-your-assessment` intake abandons

### Phase 1 — Qualification (same day, 90% AI)

1. Visitor completes `/build-your-assessment` intake (already live)
2. **Agent: Fit Analyzer** scores the submission across 6 dimensions:
   - Methodology maturity (does it exist? is it written?)
   - Price fit (budget range vs. recommended tier)
   - Timeline realism
   - Audience sophistication
   - Brand maturity
   - Tech readiness
3. Routes:
   - **High fit + T1+ budget** → auto-send booking link to a 45-min scoping call + pre-call prep questionnaire
   - **High fit + T0 budget** → offer T0 Sampler, upsell to T1 on completion
   - **Low fit** → nurture sequence (6-week email drip with methodology case studies)
4. **Agent: Proposal Drafter** reads the intake + the coach's public web presence and drafts a 1-page Loom-style scope deck for the scoping call 👤 (Jake reviews before the call)

### Phase 2 — Discovery & Scoping (1 week, human-led, AI-assisted)

1. Scoping call (45 min, human — Jake or a sales lead)
2. Call transcribed (Fireflies/Read/etc.)
3. **Agent: Discovery Synthesizer** turns transcript + intake into a **Methodology Brief Document (MBD)** containing:
   - Working taxonomy proposal (arenas, domains)
   - Voice markers
   - Client-pattern themes (pre-archetype)
   - Scope recommendation (tier + upsells)
   - Timeline and milestones
4. MBD sent to client for approval + contract
5. Client onboarding packet triggered: uploads portal for case stories, voice samples, transcripts, brand assets

### Phase 3 — IP Extraction (3–5 days, AI-heavy)

1. Client uploads material to secure workspace
2. **Agent: IP Extractor** ingests everything and produces:
   - Voice guide (tone markers, sentence structures, characteristic phrases, lexicon)
   - Client-pattern inventory (every case story tagged with themes, driving belief, characteristic behavior)
   - Framework graph (every construct the coach uses, how they relate)
   - Philosophy calibration (where they sit on directive/reflective, harsh/kind, etc.)
3. 👤 Human reviewer (copy lead) does a 30-minute sanity pass — flags anything off, re-prompts the agent

### Phase 4 — Taxonomy Design (2 days, 50/50)

1. **Agent: Taxonomy Architect** proposes:
   - Arena/domain hierarchy with labels and one-sentence definitions
   - Scoring rationale for each level
   - Integration with the coach's decision output (what the results *tell* the coach to do)
2. 👤 Client call (90 min, async review acceptable) — approve, adjust, lock taxonomy
3. This is the **single biggest lock-in point** — from here, everything downstream is deterministic

### Phase 5 — Question Bank Authoring (3 days, AI-heavy)

1. **Agent: Item Writer** generates for each domain:
   - 6 questions (5 forward, 1 reverse) at the target reading level
   - Weight tier (anchor 1.2 / standard 1.0 / supporting 0.8) based on diagnostic value
   - Signal-question mapping (which items signal which drivers)
   - Bias check, jargon check, doubled-concept check (self-review pass)
2. 👤 Client reviews and flags items that don't reflect their coaching reality; agent iterates

### Phase 6 — Driver/Trap System (2 days, AI-heavy)

1. **Agent: Pattern Analyst** given MBD + case stories + transcripts:
   - Proposes 8–10 recurring behavioral patterns from the client material
   - Names them in the coach's voice (the "Pleaser's Bind" / "White Knuckle" naming is a specific craft — agent uses exemplars)
   - Maps signal questions from the Phase 5 bank
   - Drafts: core belief, core fear, tagline, description (250–400 words), mechanism, what-it-costs, the-way-out
2. 👤 Naming + voice-matching review by client (this is the layer where voice matters most)

### Phase 7 — Archetype Authoring (3 days, AI with heavy voice review)

1. **Agent: Archetype Architect** proposes 8–9 personas:
   - Maps to score thresholds (e.g., "all arenas ≥8.0 = Architect")
   - Defines assignment priority order (tiebreaker logic)
   - Includes dignified "crisis" archetype and aspirational "integrated" archetype
2. **Agent: Narrative Writer** writes per archetype:
   - Tagline, 400–600 word description, strength/shadow/constraint/growth-path, reflection prompts, relationship to other archetypes, common drivers
3. 👤 Client reads all 9, flags off-voice passages, Narrative Writer revises (usually 2–3 passes)

### Phase 8 — Narrative Library Scaling (3 days, AI-heavy)

1. **Agent: Library Scaler** given locked taxonomy + archetypes + drivers:
   - Generates 48–72 priority-matrix blurbs (domain × quadrant)
   - Generates the 168-piece plan content system (domain × level × driver modifier, + level-calibrated openers)
   - Compiles all content into the data files the platform consumes
2. 👤 Spot-QA pass — client reads ~10% of generated content, flag anything that's off

### Phase 9 — Platform Assembly (5 days, mostly automated)

1. **Agent: Platform Assembler** (deterministic code generation, not creative):
   - Clones the template codebase (VAPI/EdgeState frontend + scoring engine)
   - Swaps taxonomy constants, question bank, narrative library
   - Applies brand tokens (colors, fonts, logo, imagery)
   - Wires scoring algorithm with client's weight/threshold choices
   - Provisions Supabase project: assessments table, prompt template versions, audit tables, plan_events table
   - Deploys to Vercel on client's subdomain (or custom domain)
2. **Agent: QA Bot** runs through the full assessment flow:
   - Takes the assessment 20× with varied response patterns to verify every archetype is reachable
   - Checks every priority matrix quadrant renders
   - Verifies mobile responsive, accessibility basics, email delivery
   - Produces a QA report 👤

### Phase 10 — AI Coach Configuration *(T3+ only)* (4 days, AI-heavy + review)

1. **Agent: Prompt Engineer** composes:
   - System prompt with 3-block cache split (per-user stable context, session context, persistent doc)
   - Token substitution for {primary_archetype}, {driver_library_content}, {edge_profile}, etc.
   - Persona definition in client's voice
2. **Agent: Gate Author** drafts:
   - Hard-refusal regex set (crisis language, out-of-scope, live-trade equivalents for the coach's domain)
   - Haiku classifier prompts
   - Registered in versioned gate/classifier tables (fail-closed pattern from EdgeState)
3. 👤 Client runs ~20 test conversations; adjust

### Phase 11 — Portal + Ritual Layer *(T2+ / T3+)* (4 days, mostly automated)

1. Portal assembly (clone template, apply brand, wire auth, assessment history, reassessment lock logic)
2. **Ritual Layer configuration** *(T3 only)*:
   - 👤 Client designs the ongoing scorecard with Jake in a 90-min workshop (their "Six-C" or "pre-/post-trade" equivalent)
   - **Agent: Ritual Builder** generates the daily/weekly check-in UI, scoring math, trend aggregation, and coach-dashboard views
3. Coach-facing dashboard: client roster, latest scores, archetype distribution, driver-activation alerts, trend lines

### Phase 12 — Launch & Training (1 week)

1. 👤 Live 2-hour training with client + team (walkthrough, coach dashboard, taking the assessment, reviewing results with a client live)
2. **Agent: Playbook Author** generates a 20–30 page operating manual from the MBD + final platform — how to use the assessment in a sales call, how to review results with a client, how to introduce the ritual layer, how to handle edge cases
3. Soft launch to 10 existing clients of the coach for feedback
4. Public launch

### Phase 13 — Ongoing *(T4 retainer)*

Monthly cadence, 80% automated:
- **Agent: Content Refresh** — reviews usage data quarterly, proposes new plan content, archetype library additions
- **Agent: Reassessment Lifecycle** — manages 90-day reassessment reminders, tracks drift (archetype progression, driver re-activation), flags at-risk clients to the coach
- **Agent: Trend Analyst** — monthly report on the coach's client population: most common archetype, most activated driver, domain score distributions, plan-completion rates
- **Agent: Prompt Template Ops** (T3) — versioned upgrades to the AI coach prompt as new patterns emerge, with audit rows and rollback on failure (EdgeState's model)
- 👤 Quarterly strategy call (45 min) — review trends, decide on content refresh priorities

### Economics of the pipeline

Total human time per T1 delivery (current loose estimate based on the agent map): **~18 hours** across discovery, review passes, and QA. With the 10-agent stack above, a single operator (Jake + 1 copy/review lead) can run **3–5 T1 deliveries concurrently** in a 30-day cycle. T2 adds ~8 hours. T3 adds ~20 hours (mainly ritual-layer design + coach training). T4 is a few hours per month per client.

Gross margin at T1 $22K anchor with ~$4K AI/infra + 18 human-hours at loaded cost: **~$14K per T1 delivery**. T3 at $140K anchor: **~$90K gross**.

---

## The moat

Three defenses compound over time:

1. **The content operating system** — every engagement adds exemplars to your agent prompts. After 20 coaches, your Archetype Architect has seen 180 archetypes, your Pattern Analyst has seen 180 driver sets. Your quality compounds; imitators start from zero.
2. **The template codebase** — VAPI and EdgeState have already solved the hard problems (weighted scoring with reverse items, priority matrix, 28-day plan generation, versioned prompt templates, gate/refusal with fail-closed validation, 90-day reassessment locks, portal-coach linking). Cloning + reconfiguring is ~5 days; building from scratch is ~6 months.
3. **The retainer flywheel** — T4 clients stay because their method is now productized *on your platform*. Pulling off = rebuilding. Every T4 month is compounding switching cost.

---

## What to do first (next 4 weeks)

Not a sales plan — a product-readiness punch list. Do these before selling T1 to a stranger:

1. **Productize the Methodology Brief** — run the VAPI and Edge Profile backward through the pipeline. Write the MBD each one *should* have started from. This becomes the first template for Phase 3.
2. **Write the 10 agent prompts** — one for each labeled agent above. Start with Fit Analyzer (easiest, highest leverage) and Narrative Writer (the one that makes or breaks quality). Version them in a `strategy/agent-prompts/` folder, with test cases.
3. **Write the Universal Taxonomy Grammar** — a spec describing what makes a good arena, a good domain, a good weight assignment, a good reverse item. This is the input contract for the Item Writer agent.
4. **Sell one T1 at cost** to a friendly coach you trust — ideally someone adjacent to but not inside Jake's trading/business-owner worlds (a sales coach, a health coach). Run the pipeline end-to-end. Use it to harden the workflow and catch what's unexpectedly hard.
5. **Record a 10-minute walkthrough** of VAPI and Edge Profile as sales collateral. The demo *is* the best sales asset for this product — it's a thing you have to see to understand.

Optional but high-leverage: **Add a public "assessment showcase" page** to Jake's marketing site with the 2 existing instruments (VAPI, Edge Profile) + 3 mockup "what yours could look like" comps in different voice/tone bands, so prospects can see the range before filling out the intake.

---

## V2 Additions (2026-04-21)

### Name locked: Axiom

Chosen because it names *what* is being productized — the foundational truth the coach operates from. Plays in copy as singular ("your Axiom") or plural across clients ("coaches who publish their Axioms"). Repo lives at `/Users/JakeSebok/documents/repos/axiom`.

### The VAPI ritual-layer design (generalizable pattern)

EdgeState's session-based rhythm doesn't translate to business owners — they operate, they don't trade. The generalized ritual pattern has **5 cadences**, each aggregating upward into the next:

| Cadence | Artifact | Time | Captures |
|---|---|---|---|
| Morning | Alignment Check-in | 45 sec | Top 3 priorities, domain honored vs. sacrificed, one-line intention |
| Evening | Integrity Review | 60 sec | Honored priorities? Where did driver show up? Building toward Architect or drifting? |
| Weekly | Six-C Pulse *(VAPI already has)* | 3 min | Score 6 C's, weekly patterns |
| Monthly | Domain Pulse *(new)* | 10 min | Lightweight 12-question re-score, importance drift |
| Quarterly | Full Reassessment *(exists)* | 15 min | 72 questions, archetype progression, driver re-activation |

**Each cadence aggregates into the one above it.** Morning/evening feed the weekly Six-C; weekly feeds monthly Domain Pulse; monthly feeds quarterly. This gives the dashboard real-time pattern visibility without asking the user to do extra work.

For each Axiom client, this cadence gets re-scoped to match their audience (traders → session-based; athletes → training-day; educators → course-week; etc.). **The 5-layer aggregation model is universal; the artifacts at each layer are bespoke.**

### The Longitudinal Intelligence Principle

Named principle, now central to the Axiom pitch:

> *The portal is thin on day one and priceless by month twelve. Each retake doesn't replace the prior — it compounds on it. After 4 assessments, the user has a biography of their inner patterns that exists nowhere else. That's the actual switching cost.*

Required dashboard renderings to honor the principle:
- Archetype trajectory sparkline
- Driver activation history timeline
- Importance drift map (what mattered 6 months ago vs. now)
- Matrix movement (quadrant migrations over time)
- Plan completion overlay correlated with score changes
- Ritual streak data (consistency graphs)
- "What changed" narrative comparison view (first vs. latest assessment)

**This is the real moat for users and the real retention story for coaches.** StrengthsFinder is one-and-done; DiSC is a snapshot. Axiom is a record that gets more valuable the longer you stay.

### The six elevations that take T3 from $75K to $150K+

1. **Coach Pre-Session Brief** — auto-generated 200-word "what to ask about today" summary from recent check-ins + driver activations. *No coach tool has this.*
2. **Cohort Intelligence** — when coach hits 20+ clients, aggregate patterns: "60% of your clients progress Performer → Architect within 6 months." Marketing gold + methodology refinement.
3. **Pattern Alert System** — proactive coach pings: "Client X scored high on Escape Artist 3 weeks running." System remembers so coach doesn't have to.
4. **Individual Pattern Preview (VAPI Presence)** — the user-facing mirror of the coach pattern alert. EdgeState's proven "Presence" rules engine ported over: 5 capped triggers (V-01 through V-05), pure-function evaluation, quiet-hours-aware, audit-logged. Fires in-app banners or soft pushes. *This is the killer individual feature and the showstopper in the demo.*
5. **Methodology Versioning** — when coach refines taxonomy, historical assessments stay scored against their original version; optional toggle re-renders under the current model. Audit-grade.
6. **Client-Owned Export** — users export full history anytime (PDF + CSV). Counterintuitively increases retention — they stay for the experience.

**7th (forward-compatible):** Peer-Coach Marketplace — activates once 5+ Axiom coaches are live. In VAPI today: designed but inert. Placeholder surface shows framework and says *"Activates when peer Axiom coaches go live."* No fake data; honest placeholder.

All six elevations are Jake's priority list, locked after the 2026-04-21 review. The "coach dashboard" in VAPI is Jake's single admin view of his own client roster (not multi-tenant). Axiom eventually productizes the same pattern for other coaches — each gets their own single admin view over their own roster, all powered by the same `axiom/platform/coach-os/` extract.

### Repo architecture

New repo at `/Users/JakeSebok/documents/repos/axiom`. Monorepo structure:

```
axiom/
├── platform/          # The reusable Axiom template (forked VAPI + EdgeState patterns)
├── agents/            # 10 production agent prompts + test suites
├── docs/              # Founding docs, methodology grammar, data model spec
├── clients/           # Per-client configs (taxonomy, narrative library overrides)
└── marketing/         # Sales site for Axiom itself
```

Stack: Next.js + Supabase + Vercel + Anthropic SDK + 3-block prompt caching — exactly the EdgeState pattern, because the ops muscle already exists.

**VAPI is Axiom's flagship demo.** Not sold to other coaches — it's the exemplar every Axiom prospect sees on the sales call. VAPI upgrades get built in the ClickCampaigns repo (where VAPI lives), but every reusable layer gets abstracted into `axiom/platform/` as it stabilizes. See `vapi-upgrade-spec.md` for the full infrastructure upgrade plan.

### Alfred is the AI coach, not a VAPI rebuild

Alfred already exists at alfredai.coach. Alfred already reads VAPI data from the shared Supabase, has a persona, voice, chat UI, streaming, prompt caching, and push notifications.

**The architectural rule:** VAPI portal and Alfred maintain bi-directional feature parity through the shared Supabase. Every ritual table (`vapi_morning_checkins`, `vapi_evening_reviews`, `vapi_presence_trigger_events`, etc.) is shared. Both apps read/write. Alfred is marketed to clients *and* non-clients (wider net); VAPI portal serves Jake's prospects and clients (premium gate). Same features, different audiences, single source of truth.

VAPI portal is the **instrument and the record**. Alfred is the **conversation**. No rebuild of Alfred; VAPI portal extends and deep-links. See `vapi-upgrade-spec.md` Layer 5 for the sync pattern.

---

*End of strategy doc. This is a starting structure; iterate against real pipeline runs, not against the doc.*
