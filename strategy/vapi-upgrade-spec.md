# VAPI Portal Upgrade — The Axiom Flagship Spec

*What VAPI needs to become so that it sells Axiom.*

Date: 2026-04-21 (V2: incorporates Alfred, Presence, Post-Trade Scorecard)

---

## 0. Strategic role of VAPI

VAPI is Jake's own product — he is the coach, business owners are the users — **and** it is the exemplar Axiom prospects see on every sales call. Every Axiom demo ends with *"let me show you mine."* Every feature here does two jobs: (1) makes VAPI genuinely valuable to its users, and (2) becomes a pixel-perfect demo of what Axiom produces.

The demo order is the spec order. If it doesn't work in the demo, it doesn't matter how well it scores in a backlog.

Four rules:
1. **Every upgrade must be demoable in under 60 seconds.**
2. **Every layer abstracts cleanly into `axiom/platform/`** for eventual reuse.
3. **Don't break what works** — the 72-question assessment, scoring, archetypes, drivers, priority matrix, 28-day plan, and Six-C Scorecard all ship today.
4. **VAPI portal ↔ Alfred bi-directional feature parity.** Both apps read/write the same Supabase tables. Alfred serves clients + non-clients; VAPI portal serves Jake's prospects and clients. Same features, different audiences, one source of truth.

---

## 1. The 11-Layer Upgrade

### Layer 1 — Ritual Infrastructure

**What:** Add daily morning + evening cadence to complement the existing weekly Six-C; add a monthly Domain Pulse; keep the quarterly full reassessment.

**Why:** Today, VAPI is a great report the user reads once. With ritual infrastructure, it becomes a living compass that integrates into the user's day.

**Morning Alignment — Brendon Burchard HPP structure, adapted (45 sec):**

Three prompts + one action:

1. *"Today, my top 3 priorities are…"* (free text; each auto-tagged to a domain via inline domain chip picker)
2. *"The domain I'm honoring today is…"* (12-domain chip picker)
3. *"Today I'd feel aligned if…"* (one line)
4. On submit → **VAPI Presence** evaluates and displays today's pattern preview (see Layer 2)

**Evening Integrity Review — modeled on EdgeState's Post-Trade Scorecard (60 sec):**

The post-trade scorecard uses **outcome-keyed prompts** — one prompt shown, selected by what kind of day the user had. We port that exact mechanic to VAPI:

| Prompt ID | Day type | Prompt text |
|---|---|---|
| vapi-eve-01 | aligned | *"Today honored your plan. Name one thing this alignment did not prove about you."* |
| vapi-eve-02 | drift | *"A priority slipped. Name the exact moment the justification arrived."* |
| vapi-eve-03 | scratch | *"Ordinary day. Rich on practice. Name one thing you noticed this week that you missed last week."* |
| vapi-eve-04 | win | *"A win. Was it conviction in the plan, or hope the plan would reward you?"* |
| vapi-eve-05 | any | *"Your [top driver] had an opening today. Name the moment you felt it, or confirm it stayed quiet."* |
| vapi-eve-06 | boundary | *"You said no to something today. Rule-based no or feeling-based no? Mark both as valid. Name which."* |
| vapi-eve-07 | overextension | *"You took on more than baseline. What specifically about today earned the extra — in one sentence?"* |
| vapi-eve-08 | any | *"You exited a commitment early. Did you move first, or did circumstances? The answer is data, not a verdict."* |

Day type is chosen by the user via a one-tap chip at the top of the form. One prompt renders. Free-text response.

Plus two structured fields that mirror the scorecard:
- **Priorities honored** (quick checkbox revisit of the morning's 3)
- **Drivers echoed** (multi-select of the 10 VAPI drivers; which showed up today?)

**Weekly Six-C Pulse** — existing, enhance with sparkline trend + "this week vs. last week" ribbon.

**Monthly Domain Pulse (new):** 12-question lightweight re-score (one anchor question per domain) + importance re-rating. Outputs delta vs. last quarterly full assessment. Renders a short "what's moving" summary.

**Quarterly Full Reassessment:** existing 72-question flow, gated by 90-day lock (already in place).

**Aggregation principle:** morning + evening feed into the weekly Six-C visualization. Weekly + monthly feed into the quarterly drift narrative. Each layer makes the one above it richer without asking the user for more work.

**Data model additions (written to shared Supabase; both VAPI portal and Alfred read/write):**

```sql
public.vapi_morning_checkins
  (user_id, completed_at, priorities jsonb, priority_domain_tags text[],
   honored_domain text, alignment_intention text, timezone text)

public.vapi_evening_reviews
  (user_id, completed_at, day_type text, prompt_id text, response text,
   priorities_honored_count int, drivers_echoed text[])

public.vapi_monthly_pulses
  (user_id, completed_at, domain_scores jsonb, importance_ratings jsonb,
   delta_vs_last_full_assessment jsonb)
```

**Demo value:** *"Every morning my portal asks three questions. Takes 45 seconds. It feeds everything else you're about to see."*

---

### Layer 2 — VAPI Presence (rules engine, ported from EdgeState)

**What:** EdgeState already solved proactive pattern-flagging. It's called **Presence** — a pure-function rules engine that evaluates recent activity against known "pain moments" and fires capped, quiet-hours-aware nudges. No LLM in the trigger path. Ported to VAPI, it becomes the proactive layer that makes the portal feel alive.

**Why:** This is the killer individual feature and the showstopper in the demo. *"You may feel Escape Artist pulling you away from Execution today"* — delivered as an in-app banner on morning check-in submission — is the moment prospects sit up in their chair.

**Five V1 triggers (modeled on EdgeState T-01 through T-05):**

| Trigger | VAPI pain moment | Signal | Output surface |
|---|---|---|---|
| **V-01** | Post-drift spike | Evening review: day_type = "drift" + driver echoed + priority honored = 0 | In-app banner morning after: "Yesterday was sharp. Pick one:" → Micro-pause tool or Alfred deep-link |
| **V-02** | Driver persistence | Same driver echoed 3 consecutive evening reviews | Push notification + deep-link to driver library entry for that driver |
| **V-03** | Missing evening review | User was active in portal today, no evening review by 9 PM local | Soft push: *"Today's still open when you're ready."* Link to evening review |
| **V-04** | Morning misalignment | Morning check-in shows honored-domain = sacrificed-domain OR priority tags concentrate on already-critical-priority quadrant | Dashboard banner: *"Your priorities today sit in your Critical Priority quadrant. That's either sharp focus or familiar avoidance. Which?"* |
| **V-05** | Overextension streak | 3+ days of 5+ priorities tagged in morning, declining evening alignment scores | In-app drawer: *"Your days are getting fuller. Shorten the list or name what comes off."* |

**Architecture:**
- Pure-function evaluation (`evaluateV01(inputs)` → match or no-match, no LLM)
- Inputs: last 14 days of morning check-ins, evening reviews, monthly pulse, quarterly assessment, driver signals, quiet hours
- Caps: 1/day for high-priority (V-01, V-05); 2/day for medium (V-02, V-03, V-04)
- Respects user's quiet hours (default 9 PM – 7 AM local; user-adjustable)
- Crisis bypass for any evening review with explicit crisis-language (gate classifier from EdgeState ports over)

**Data model:**

```sql
public.vapi_presence_trigger_events
  (user_id, trigger_id text, fired_at timestamptz, channel text,
   outcome text, action text, source_row_ids jsonb)
```

**Audit-style writes** per Jake's fail-loud discipline — every evaluation writes a row (fired, suppressed, capped). No silent branches.

**Demo value:** *"Let me show you what I saw this morning after yesterday got sharp."* *(Opens portal.)* *"V-01 fired. Gave me two choices. I picked the micro-pause, did 90 seconds, moved on. No coach is watching me this closely. The platform is."*

---

### Layer 3 — Longitudinal Intelligence Dashboard

**What:** The user-facing dashboard that expands with every assessment. Honors the Longitudinal Intelligence Principle — thin on day one, priceless by month twelve.

**Why:** This is the real retention moat. Users don't leave a platform that holds their biography.

**Components:**
- **Archetype trajectory sparkline** — horizontal timeline showing archetype per assessment with a narrative caption line
- **Driver activation history** — stacked timeline showing primary/secondary drivers per quarter + monthly pulse intensity
- **Importance drift map** — radar chart: prior importance ratings (ghost) vs. current (solid)
- **Matrix movement view** — animated priority matrix across assessments; shows domain quadrant migrations
- **Plan completion overlay** — did high plan completion correlate with score improvement?
- **Ritual streak heatmap** — 90-day calendar of morning/evening check-in consistency
- **"What changed" narrative view** — on-demand comparison between any two assessments, 300-word narrative generated by Alfred from the shared data (Alfred writes it; VAPI portal renders it)

**Data model:** reads from existing `vapi_assessments` + new ritual tables. No significant new storage.

**Demo value:** *"Here's what my portal looked like after my first assessment."* (Minimal view.) *"Here's after my fourth."* (Full dashboard.) *"This biography didn't exist 9 months ago. That's the switching cost."*

---

### Layer 4 — Jake's Coach Admin Dashboard

**What:** Jake's single admin surface for his VAPI client roster. Not a multi-tenant platform — one coach (Jake), many clients. Axiom eventually productizes this pattern for other coaches; in VAPI it's Jake's one view.

**Why:** These features — prioritized by Jake — are the six that transform the coaching side from nice-to-have into the bullet point that justifies the T3 price when we sell Axiom later:

| Priority | Feature | Summary |
|---|---|---|
| **P1** | **Coach Pre-Session Brief** | Auto-generated 200-word summary before every session: recent check-ins, drivers echoed, importance shifts, plan completion, suggested angle. Generated by agent at session time minus 2h. |
| **P2** | **Cohort Intelligence** | Aggregate view across Jake's clients: archetype distribution, most-activated driver, fastest-progressing, at-risk. Exportable PDF brief Jake can use in his own marketing. |
| **P3** | **Pattern Alert System** | Feed of Presence-derived alerts: *"[Client] scored high on Escape Artist 3 weeks running"* / *"[Client] dropped below threshold in Inner Alignment."* |
| **P4** | **Methodology Versioning** | Version registry for the VAPI taxonomy. Refinements to questions, weights, or archetype definitions register as new versions. Historical assessments stay scored against their original version; optional "view under current model" toggle. |
| **P5** | **Client-Owned Export** | Users export their full history anytime (PDF + CSV). Counterintuitive retention lever: people stay for the experience when they know they can leave. |
| **P6** | **Peer Coach Marketplace** *(forward-compatible)* | Activates when 5+ other Axiom coaches are live. For now: designed but inert. Placeholder surface in VAPI shows the framework ("Your archetype maps to these coach specialties") and says *"Activates when peer Axiom coaches go live."* No fake data; honest placeholder. |

**Coach dashboard components (P1–P3 live; P4–P5 are platform-wide features surfaced in dashboard too):**

- **Client roster** — table with name, latest archetype, primary driver, last assessment date, last ritual activity, status light (green = active, yellow = drifting, red = dormant or pattern-alert)
- **Per-client drill-down** — full Longitudinal view (Layer 3) plus private coach-only fields: notes, session plans, tags, homework assignments
- **Pre-Session Brief panel** — auto-renders 2h before each session Jake has scheduled
- **Alert feed** — chronological Presence alerts across all clients
- **Cohort view** — aggregate dashboards (archetype distribution donut, driver activation ranked bar, progression velocity scatter)

**Data model additions:**

```sql
public.vapi_coach_relationships
  (coach_id, client_id, status, started_at)

public.vapi_session_briefs
  (coach_id, client_id, generated_at, brief jsonb,
   session_scheduled_at, opened_at nullable)

public.vapi_coach_notes
  (coach_id, client_id, note_body, created_at, visibility)

public.vapi_taxonomy_versions
  (version, questions jsonb, archetype_definitions jsonb,
   driver_definitions jsonb, scoring_rules jsonb, active, created_at)
```

(Pattern alerts and the marketplace registry are in Layer 2 and a forward-compatible table respectively.)

**Demo value:** *"This is what a coach who licenses Axiom gets."* (Walk through roster → drill into a test client → show pre-session brief → show cohort view → show pattern alerts.) *"No coaching tool does this. This is the bullet point that justifies the T3 price."*

---

### Layer 5 — Alfred Bi-Directional Sync

**What:** Alfred already exists at alfredai.coach. Alfred already reads VAPI data from shared Supabase. What's new: **full feature parity between VAPI portal and Alfred, bi-directional, through the shared Supabase source of truth.**

**Why:** Alfred is marketed to clients *and* non-clients — the wider net. VAPI portal serves Jake's prospects and clients — the premium gate. They do the same thing for different audiences. A check-in done in Alfred must appear in the VAPI portal, and vice versa, with zero lag.

**What's needed:**
- **Shared schema ownership** — all new tables (`vapi_morning_checkins`, `vapi_evening_reviews`, `vapi_presence_trigger_events`, etc.) live in shared Supabase. Both apps have RLS-scoped read/write.
- **Alfred morning/evening surface** — Alfred adds the HPP-style morning check-in and post-trade-modeled evening review to its own UI, writing to the same tables. Deep-link UX: *"You can also do this in your VAPI portal."*
- **Alfred reads VAPI Presence events** — when V-01 fires, Alfred's chat can proactively open with: *"I saw yesterday got sharp. Want to talk about it?"*
- **VAPI portal renders Alfred session snippets** — last 3 Alfred conversations appear as tiles in the VAPI dashboard with *"Continue in Alfred"* CTA
- **Single prompt template** — Alfred's existing `vapi_prompt_template_versions` stays the source of truth; VAPI portal doesn't get its own AI coach, it just displays Alfred context and links out for conversation
- **Notification dedupe** — if Presence fires a push to a user, only one channel rings (Alfred if installed, VAPI portal PWA if not, email as fallback)

**No rebuild.** Alfred is the coach; VAPI portal is the instrument and the record. Clean composition.

**Demo value:** *"Alfred already exists."* (Open Alfred, show chat.) *"What's new is that every morning check-in I do in VAPI shows up in Alfred, and every conversation with Alfred informs my next VAPI dashboard view. One brain, two front doors."*

---

### Layer 6 — Methodology Versioning

**What:** (Also Coach Dashboard P4.) Version registry for VAPI taxonomy — questions, weights, archetype definitions, driver definitions, scoring rules.

**Why:** Protects historical integrity. When Jake refines the VAPI taxonomy, existing users' past results don't "change out from under them." Optional toggle lets them view historical assessments under the current model.

**What's needed:**
- `vapi_taxonomy_versions` table (above)
- Every `vapi_assessments` row has a `taxonomy_version` FK
- `POST /api/portal/data/assessment/rescore` endpoint — re-scores historical responses against a target version
- Historical view toggle in dashboard

**Demo value:** *"I've shipped 3 revisions of the VAPI taxonomy. Every user can still see their original results and optionally view them under the current model. Audit-grade methodology."*

---

### Layer 7 — Export & Portability (Coach Dashboard P5)

**What:** PDF export of full history. CSV of raw responses + check-in data. Shareable results page. Print-optimized views.

**Why:** Users feel respected. Extends marketing reach via shares.

**What's needed:**
- Full-history PDF via existing `html-to-pdf.js` pipeline
- CSV export endpoint
- `/share/[hash]` anonymized public URL (opt-in only; archetype + one-line summary; no PII)
- Print CSS pass on dashboard pages

**Demo value:** *"If you stop being my client tomorrow, you keep everything. That respect is why people don't leave."*

---

### Layer 8 — Shareability & Marketing Loops

**What:** Social share cards, referral flow, testimonial capture.

**Why:** Every VAPI user becomes a marketing channel.

**What's needed:**
- Archetype share card generator (1080×1080 PNG with archetype + tagline + brand)
- Unique referral links with attribution tracking
- Automated testimonial outreach for users with 3+ assessments, opt-in for marketing use

**Demo value:** *"Here's how my user base grew 3× last quarter with zero ad spend."*

---

### Layer 9 — Infrastructure Foundation

**What:** The non-visible plumbing. Lifted directly from EdgeState because it already solves these problems.

**Why:** Fail-loud, audit-friendly, version-registered. Non-negotiable per Jake's standards.

**What's needed:**
- Row-level security on all new Supabase tables (client sees own data, Jake sees all clients, nobody sees others')
- Fail-loud server pattern — no silent console.error. Every failure throws or writes an audit row.
- **Cron jobs** (Supabase edge functions, following EdgeState pattern):
  - Daily user-morning-time — morning check-in reminder + Presence evaluation for V-04
  - Daily user-evening-time — evening review reminder + Presence evaluation for V-03
  - Weekly Monday — Six-C pulse reminder
  - Monthly first — monthly domain pulse reminder
  - 90-day — reassessment reminder
  - Every 2h — Presence sweep for coach pattern alerts
  - Daily 6 AM Jake's time — generate next 24h pre-session briefs
- **Gate/refusal layer** — ported version-registry pattern (`vapi_gate_regex_versions`, `vapi_classifier_versions`), fail-closed before any Alfred generation
- **Presence trigger versioning** — `vapi_presence_trigger_versions` table tracks which rule set is active; atomic activation; audit rows on every fire

**Demo value:** Invisible until a sophisticated buyer asks *"how do you handle edge cases?"* Answer: audit tables, fail-closed gates, versioned rules, atomic activation. Technical buyers see production-grade immediately.

---

### Layer 10 — Analytics & Instrumentation

**What:** PostHog (self-hosted to preserve privacy) for product analytics + retention cohorts + funnel tracking.

**Why:** Without it, we're flying blind on what drives retention. With it, we compound the platform's advantage with data.

**What's needed:**
- PostHog integration
- Event taxonomy: `assessment_started`, `assessment_completed`, `morning_checkin_completed`, `evening_review_completed`, `presence_fired`, `coach_briefing_opened`, etc.
- Retention cohort dashboards: morning-checkin users vs. not; presence-engaged vs. not
- Funnel tracking: assessment → portal signup → ritual activation → 30/60/90-day retention

**Demo value:** *"Users who activated the morning check-in retain at 78%. Users who didn't, 32%. The ritual layer* is *the product."*

---

### Layer 11 — Notifications

**What:** Multi-channel reminders — web push (PWA), email, optional SMS. Smart timing based on user timezone and preferences. Alfred already has the push infrastructure for the 6Cs reminder; we extend it.

**Why:** The ritual layer collapses without good notifications.

**What's needed:**
- Web Push via PWA (VAPI portal becomes an installable PWA — both VAPI portal and Alfred get `manifest.json` + service worker)
- Email via Resend (already in place)
- Optional SMS via Twilio, opt-in only, high-value moments (morning Presence fire, Alfred message from coach)
- Per-cadence channel preferences + time-of-day picker
- Smart retry with soft-escalation (unread push → email at +3h)

**PWA install prompt** — shown after second successful check-in, once only.

**Demo value:** *"VAPI integrates into the user's daily rhythm because the reminders meet them where they actually look. Most assessments go silent after welcome email one. VAPI doesn't."*

---

## 2. The Sales Demo Narrative

Walk every Axiom prospect through this, in order:

1. *"Here's my own instrument — VAPI."* Land on home.
2. *"Here's the assessment."* 60-second walkthrough.
3. *"Here are my results."* Archetype + drivers + priority matrix.
4. *"That's the opening move, not the product."* Transition to portal.
5. *"Every morning I get this."* Morning check-in + Presence banner for today.
6. *"Every evening I do this."* Evening review — outcome-keyed prompt.
7. *"This is my dashboard after 4 assessments."* Longitudinal view.
8. *"Alfred is here 24/7."* Open Alfred, ask a question, show the same data showing up.
9. *"This is my coach admin view of my clients."* Coach dashboard — pre-session brief, cohort intelligence, pattern alerts.
10. *"All of this works for my methodology. Axiom builds it for yours."*

Every step must work flawlessly. Build priority follows demo order.

---

## 3. Build Sequence & Effort

### Wave 1 — Daily Rhythm (4–6 weeks)

Unlocks demo steps 5–6.

1. Layer 9 foundations (cron, RLS, fail-loud, versioned presence rules table) — 1 wk
2. Layer 1 morning + evening + monthly pulse — 1.5 wk
3. Layer 11 notifications (PWA manifest, web push, email retry, install prompt) — 1 wk
4. Layer 2 VAPI Presence engine (V-01 through V-05, pure-function rules, capped, audited) — 1.5 wk

### Wave 2 — Longitudinal + Alfred Sync (3–4 weeks)

Unlocks demo steps 7–8.

5. Layer 3 longitudinal dashboard (trajectory, drift, matrix movement, streak) — 2 wk
6. Layer 3 "what changed" narrative (agent, Alfred-generated) — 0.5 wk
7. Layer 5 Alfred bi-directional sync (shared schema write access, VAPI portal reads Alfred snippets, notification dedupe) — 1 wk
8. Layer 6 methodology versioning — 0.5 wk

### Wave 3 — Coach Dashboard (3–4 weeks)

Unlocks demo step 9 — the T3 pricing moment.

9. Layer 4 client roster + per-client drill-down + notes — 1 wk
10. Layer 4 pre-session brief agent + 2h pre-session cron — 1 wk
11. Layer 4 cohort intelligence view + export — 1 wk
12. Layer 4 pattern alert feed + acknowledgment UX — 0.5 wk

### Wave 4 — Polish (2–3 weeks)

13. Layer 7 export (PDF + CSV + `/share/[hash]`) — 0.5 wk
14. Layer 10 analytics instrumentation — 0.5 wk
15. Layer 8 share cards + referral + testimonials — 0.5 wk
16. Layer 4 P6 peer marketplace placeholder (forward-compatible, inert) — 0.5 wk

**Total: ~12–17 weeks solo, ~8–10 weeks with agent-assisted production.**

---

## 4. What Gets Extracted to Axiom

Every layer abstracts to `axiom/platform/`:

| VAPI Layer | Axiom Extract |
|---|---|
| L1 | `axiom/platform/ritual-engine/` — 5-cadence aggregation model |
| L2 | `axiom/platform/presence/` — rules engine + trigger catalog template |
| L3 | `axiom/platform/dashboard-components/` — trajectory, drift, matrix movement |
| L4 | `axiom/platform/coach-os/` — roster, brief agent, cohort view, alerts |
| L5 | `axiom/platform/ai-integration/` — bi-directional sync pattern + shared schema template |
| L6 | `axiom/platform/taxonomy-registry/` |
| L7 | `axiom/platform/export/` |
| L8 | `axiom/platform/share/` |
| L9 | `axiom/platform/foundation/` — RLS, cron scaffolding, fail-loud, versioned rules |
| L10 | `axiom/platform/analytics/` |
| L11 | `axiom/platform/notifications/` |

VAPI-specific content (questions, archetypes, drivers, narrative library) stays in VAPI. The engine moves.

**First Axiom client gets 80% of this for free.** That's the margin story.

---

## 5. Non-negotiables

1. **Fail-loud, never silent-degrade.** Every server failure throws or writes an audit row.
2. **Additive-only DB changes.** Reuse existing version-registry, audit-event, and cron patterns. Never reshape.
3. **Doc-first schema decisions.** Author `docs/vapi-data-model.md` in Wave 1 and keep authoritative.
4. **VAPI ↔ Alfred feature parity.** Every user-facing feature built in one surface is built in the other; shared schema is the source of truth.
5. **Alfred is not rebuilt.** Alfred is the AI coach. VAPI portal is instrument + record. Clean composition.

---

## 6. Open questions (tactical)

1. **Morning / evening default times** — user sets on first check-in, or opinionated defaults (6 AM / 9 PM local) with override later? Leaning opinionated with override.
2. **PWA install prompt timing** — second successful check-in, or after 7 days of activity? Leaning second check-in (higher conversion, caught while warm).
3. **Peer marketplace visibility** — placeholder visible to all VAPI users, or only to Jake's coaching clients? Leaning visible-to-all because it reinforces the "Axiom ecosystem" story even before it's live.
4. **Cohort intelligence privacy** — when Jake exports cohort PDFs for his own marketing, how are client names/archetypes anonymized by default? Leaning full anonymization + opt-in reveal.

---

*End of VAPI upgrade spec. Build for the demo; the user value follows.*
