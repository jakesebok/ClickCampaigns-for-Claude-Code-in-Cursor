# VAPI Data Model — Wave 1 additions

*Source of truth for all tables added in the VAPI portal Wave 1 upgrade (2026-04-21).*

All changes are **additive only**. No existing tables modified. No existing data touched. Every ambiguous schema decision resolves by citing this doc.

---

## §0 Conventions

- **User key:** VAPI uses `email` (text, lowercased) across all VAPI-specific tables. Alfred uses `users.id` (uuid, Clerk-linked). Bi-directional VAPI ↔ Alfred is joined via `users.email = vapi_<*>.email`.
- **Timestamps:** `timestamptz` only, default `now()`.
- **IDs:** `uuid` with `default gen_random_uuid()` for primary keys unless noted.
- **JSON payloads:** `jsonb`, never `json`.
- **RLS:** Enabled on every new table. Service-role writes bypass. Client reads scoped to `auth.email() = email`. Coach reads: Jake (`jacob@alignedpower.coach`) reads all.
- **Audit discipline:** Every write that could fail silently (presence triggers, notification sends, cron executions) also writes an audit row. Fail-loud per Jake's memory.
- **Table naming:** `vapi_<domain>_<noun>` (e.g., `vapi_morning_checkins`, `vapi_presence_trigger_events`).
- **Migration naming:** `YYYYMMDDHHMMSS_<purpose>.sql`, cited in `20260421_NNN_*` sequence for today's Wave 1.

---

## §1 Ritual tables (Layer 1)

### §1.1 `vapi_morning_checkins`

Morning alignment check-in data. Brendon Burchard HPP structure adapted to VAPI taxonomy.

```sql
create table public.vapi_morning_checkins (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  completed_at timestamptz not null default now(),
  local_date date not null,                        -- user-local calendar date (for idempotency)
  priorities jsonb not null default '[]'::jsonb,   -- [{ text: "...", domain_code: "EX" }, ...]
  honored_domain text,                              -- one of 12 domain codes (PH/IA/ME/AF/RS/FA/CO/WI/VS/EX/OH/EC)
  alignment_intention text,                         -- "Today I'd feel aligned if..." (max 280 chars enforced client-side)
  timezone text not null default 'America/New_York',
  source text not null default 'portal',            -- portal | alfred
  created_at timestamptz not null default now()
);
create unique index vapi_morning_checkins_email_date_idx
  on public.vapi_morning_checkins(email, local_date);
create index vapi_morning_checkins_completed_at_idx
  on public.vapi_morning_checkins(email, completed_at desc);
```

One check-in per user per local calendar date. Upsert on `(email, local_date)`.

### §1.2 `vapi_evening_reviews`

Evening integrity review, modeled on EdgeState's post-trade scorecard (outcome-keyed prompts).

```sql
create table public.vapi_evening_reviews (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  completed_at timestamptz not null default now(),
  local_date date not null,
  day_type text not null,                           -- aligned | drift | scratch | win | boundary | overextension | any
  prompt_id text not null,                          -- vapi-eve-01..08
  prompt_text text not null,                        -- snapshot of prompt at time of review
  response text,                                    -- free text response
  priorities_honored_count int,                     -- 0..3 checkbox revisit of morning's priorities
  drivers_echoed text[] not null default '{}',      -- array of driver keys that showed up today
  morning_checkin_id uuid references public.vapi_morning_checkins(id) on delete set null,
  timezone text not null default 'America/New_York',
  source text not null default 'portal',
  created_at timestamptz not null default now()
);
create unique index vapi_evening_reviews_email_date_idx
  on public.vapi_evening_reviews(email, local_date);
create index vapi_evening_reviews_completed_at_idx
  on public.vapi_evening_reviews(email, completed_at desc);
```

### §1.3 `vapi_monthly_pulses`

Lightweight 12-question re-score (one anchor per domain) + importance re-rating. Bridge between weekly Six-C and quarterly full reassessment.

```sql
create table public.vapi_monthly_pulses (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  completed_at timestamptz not null default now(),
  local_month date not null,                        -- first day of user-local month
  domain_scores jsonb not null,                     -- { PH: 7.5, IA: 6.0, ... } x 12 domains
  importance_ratings jsonb not null,                -- { PH: 8, IA: 9, ... } x 12 domains, 1-10
  delta_vs_last_full jsonb,                         -- computed at write: { domain_deltas, composite_delta, archetype_shift_likely }
  notes text,                                       -- optional reflection
  timezone text not null default 'America/New_York',
  source text not null default 'portal',
  created_at timestamptz not null default now()
);
create unique index vapi_monthly_pulses_email_month_idx
  on public.vapi_monthly_pulses(email, local_month);
create index vapi_monthly_pulses_completed_at_idx
  on public.vapi_monthly_pulses(email, completed_at desc);
```

---

## §2 Presence engine (Layer 2)

### §2.1 `vapi_presence_trigger_versions`

DB-versioned registry of presence trigger rule sets. Atomic activation. Gate runs pre-build: only one `active=true` row at a time.

```sql
create table public.vapi_presence_trigger_versions (
  version text primary key,                         -- e.g., 'v1.0.0'
  triggers jsonb not null,                          -- full trigger catalog { V-01: {...}, V-02: {...}, ... }
  active boolean not null default false,
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  notes text
);
create unique index vapi_presence_trigger_versions_active_idx
  on public.vapi_presence_trigger_versions(active) where active = true;
```

### §2.2 `vapi_presence_trigger_events`

Every evaluation (fired, suppressed, capped, quiet-hours) writes a row. Never silent.

```sql
create table public.vapi_presence_trigger_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  trigger_id text not null,                         -- 'V-01' .. 'V-05'
  version text not null references public.vapi_presence_trigger_versions(version),
  evaluated_at timestamptz not null default now(),
  outcome text not null,                            -- fired | suppressed_cap | suppressed_quiet_hours | suppressed_cooldown | no_match
  channel text,                                     -- banner | push | email | drawer | null-if-not-fired
  action text,                                      -- dismiss | click | alfred_deep_link | regulate | null
  payload jsonb,                                    -- snapshot of inputs + copy that rendered
  acknowledged_at timestamptz,
  source_row_ids jsonb not null default '{}'::jsonb -- { morning_id, evening_id, pulse_id, ... }
);
create index vapi_presence_trigger_events_email_time_idx
  on public.vapi_presence_trigger_events(email, evaluated_at desc);
create index vapi_presence_trigger_events_trigger_idx
  on public.vapi_presence_trigger_events(trigger_id, evaluated_at desc);
```

**Trigger definitions (in `vapi_presence_trigger_versions.triggers` jsonb):**

| ID | Pain moment | Signal | Output | Cap |
|---|---|---|---|---|
| V-01 | Post-drift spike | prev-day evening.day_type='drift' + driver echoed + priorities_honored_count=0 | Morning banner: "Yesterday went sharp. Pick one:" → micro-pause / Alfred | 1/day |
| V-02 | Driver persistence | Same driver in drivers_echoed across 3 consecutive evening reviews | Push + deep-link to driver library | 2/week |
| V-03 | Missing evening review | Active today but no evening review by 9 PM local | Soft push: "Today's still open when you're ready" | 1/day |
| V-04 | Morning misalignment | honored_domain = priority_domain tagged in critical-priority quadrant (from latest vapi_results) | Dashboard banner: "Your priorities sit in your Critical Priority quadrant. Sharp focus or familiar avoidance?" | 2/week |
| V-05 | Overextension streak | 3+ consecutive mornings with 5+ priorities AND declining evening alignment | In-app drawer: "Days getting fuller. Shorten the list or name what comes off." | 1/week |

---

## §3 Methodology versioning (Layer 6)

### §3.1 `vapi_taxonomy_versions`

Versioned VAPI taxonomy — questions, weights, archetype definitions, driver definitions, scoring rules. Existing `vapi_results` rows get a `taxonomy_version` FK.

```sql
create table public.vapi_taxonomy_versions (
  version text primary key,                         -- e.g., 'v1.0.0' (current), 'v1.1.0' (next)
  questions jsonb not null,                         -- full 72-question array with weights, reverse flags, signal maps
  archetype_definitions jsonb not null,             -- 9 archetypes with assignment rules
  driver_definitions jsonb not null,                -- 10 drivers + aligned momentum fallback
  scoring_rules jsonb not null,                     -- weighted aggregation config
  priority_matrix_copy jsonb not null,              -- 48 quadrant blurbs
  active boolean not null default false,
  created_at timestamptz not null default now(),
  activated_at timestamptz,
  notes text
);
create unique index vapi_taxonomy_versions_active_idx
  on public.vapi_taxonomy_versions(active) where active = true;
```

Note: we do NOT add `taxonomy_version` to `vapi_results` (would modify existing table, violating additive-only). Instead:

### §3.2 `vapi_assessment_version_link`

Additive join table. For assessments completed after v1.0.0 activation, record which version scored them.

```sql
create table public.vapi_assessment_version_link (
  vapi_result_id uuid primary key references public.vapi_results(id) on delete cascade,
  taxonomy_version text not null references public.vapi_taxonomy_versions(version),
  linked_at timestamptz not null default now()
);
```

**Re-score endpoint** (`POST /api/taxonomy-rescore`) recomputes `results` jsonb under a target version and returns the alternate payload without mutating the stored `vapi_results` row.

---

## §4 Coach dashboard (Layer 4)

### §4.1 `vapi_coach_relationships`

Which clients belong to which coach. In VAPI today, one coach (`jacob@alignedpower.coach`) owns all clients. Schema supports future multi-coach.

```sql
create table public.vapi_coach_relationships (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null,
  client_email text not null,
  status text not null default 'active',            -- active | paused | ended
  tier text,                                         -- program tier: 'aligned_power_12mo' | etc.
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  private_tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index vapi_coach_relationships_pair_idx
  on public.vapi_coach_relationships(coach_email, client_email);
create index vapi_coach_relationships_client_idx
  on public.vapi_coach_relationships(client_email);
```

### §4.2 `vapi_session_briefs`

Pre-session briefs. Generated by agent 2h before each scheduled session.

```sql
create table public.vapi_session_briefs (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null,
  client_email text not null,
  session_scheduled_at timestamptz not null,
  generated_at timestamptz not null default now(),
  brief jsonb not null,                             -- { summary, recent_drivers, importance_shifts, plan_completion, suggested_angle, signals[] }
  generator_version text not null default 'v1.0.0',
  opened_at timestamptz,
  created_at timestamptz not null default now()
);
create index vapi_session_briefs_coach_idx
  on public.vapi_session_briefs(coach_email, session_scheduled_at desc);
create index vapi_session_briefs_client_idx
  on public.vapi_session_briefs(client_email, session_scheduled_at desc);
```

### §4.3 `vapi_pattern_alerts`

Coach-facing alert feed derived from presence events.

```sql
create table public.vapi_pattern_alerts (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null,
  client_email text not null,
  alert_type text not null,                         -- driver_persistence | drift_streak | assessment_drift | crisis_language | plan_stalled
  detected_at timestamptz not null default now(),
  severity text not null default 'normal',          -- low | normal | high | critical
  payload jsonb not null,                           -- { trigger_id, evidence_ids, summary, suggested_action }
  acknowledged_at timestamptz,
  dismissed_at timestamptz,
  created_at timestamptz not null default now()
);
create index vapi_pattern_alerts_coach_unread_idx
  on public.vapi_pattern_alerts(coach_email, detected_at desc) where acknowledged_at is null and dismissed_at is null;
```

### §4.4 `vapi_cohort_snapshots`

Denormalized cohort intelligence snapshots (generated weekly + on-demand, cached to avoid aggregate recomputation).

```sql
create table public.vapi_cohort_snapshots (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null,
  generated_at timestamptz not null default now(),
  period_start date not null,
  period_end date not null,
  client_count int not null,
  archetype_distribution jsonb not null,
  driver_activation_ranking jsonb not null,
  progression_velocity jsonb,
  at_risk_client_count int not null default 0,
  insights jsonb,                                    -- AI-generated summary bullets
  anonymization_level text not null default 'full'  -- full | named_opt_in
);
create index vapi_cohort_snapshots_coach_idx
  on public.vapi_cohort_snapshots(coach_email, generated_at desc);
```

---

## §5 Shareability & Peer marketplace (Layers 7–8)

### §5.1 `vapi_shareable_results`

User-generated anonymized share links.

```sql
create table public.vapi_shareable_results (
  hash text primary key,                            -- short url-safe token
  email text not null,
  vapi_result_id uuid not null references public.vapi_results(id) on delete cascade,
  archetype_label text not null,
  primary_driver_label text,
  created_at timestamptz not null default now(),
  view_count int not null default 0,
  expires_at timestamptz
);
```

### §5.2 `vapi_referral_attributions`

Referral tracking.

```sql
create table public.vapi_referral_attributions (
  id uuid primary key default gen_random_uuid(),
  referrer_email text not null,
  invitee_email text,
  invite_code text not null,
  clicked_at timestamptz,
  converted_at timestamptz,                         -- set when invitee completes assessment
  created_at timestamptz not null default now()
);
create unique index vapi_referral_invite_code_idx
  on public.vapi_referral_attributions(invite_code);
```

### §5.3 `vapi_peer_marketplace_coaches`

Forward-compatible registry for the peer marketplace. In VAPI today: empty. When Axiom has 5+ coaches live, this populates. UI shows honest "coming soon" until `count >= 5`.

```sql
create table public.vapi_peer_marketplace_coaches (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null unique,
  display_name text not null,
  headline text,
  bio text,
  specialties text[] not null default '{}',         -- archetype labels they specialize in
  domains text[] not null default '{}',             -- 12 domain codes they focus on
  profile_url text,
  photo_url text,
  approved boolean not null default false,
  active boolean not null default false,
  created_at timestamptz not null default now()
);
```

---

## §6 Notifications & PWA (Layers 9, 11)

### §6.1 `vapi_notification_preferences`

Per-user channel + timing preferences.

```sql
create table public.vapi_notification_preferences (
  email text primary key,
  timezone text not null default 'America/New_York',
  morning_time time not null default '06:00',       -- opinionated default per Jake
  evening_time time not null default '17:00',
  quiet_hours_start time not null default '21:00',
  quiet_hours_end time not null default '07:00',
  channel_morning text not null default 'push',     -- push | email | both | off
  channel_evening text not null default 'push',
  channel_presence text not null default 'push',
  channel_coach text not null default 'email',
  push_subscription jsonb,                           -- web push PushSubscription JSON
  sms_enabled boolean not null default false,
  sms_phone text,
  updated_at timestamptz not null default now()
);
```

### §6.2 `vapi_notification_events`

Delivery audit. Fail-loud — every send writes a row, including failures.

```sql
create table public.vapi_notification_events (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  kind text not null,                               -- morning_reminder | evening_reminder | presence_v01 | coach_brief | etc.
  channel text not null,                            -- push | email | sms
  sent_at timestamptz not null default now(),
  outcome text not null,                            -- sent | failed | suppressed | retried
  error text,
  source_row_id uuid,                               -- presence event id, brief id, etc.
  retried_count int not null default 0
);
create index vapi_notification_events_email_time_idx
  on public.vapi_notification_events(email, sent_at desc);
```

---

## §7 Analytics (Layer 10)

### §7.1 `vapi_analytics_events`

Lightweight self-hosted event stream. Avoids third-party dependency. Can later pipe to PostHog.

```sql
create table public.vapi_analytics_events (
  id uuid primary key default gen_random_uuid(),
  email text,                                       -- nullable for anonymous events
  session_id text,
  event_name text not null,
  properties jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  client_context jsonb,                             -- { user_agent, path, referrer }
  created_at timestamptz not null default now()
);
create index vapi_analytics_events_name_idx
  on public.vapi_analytics_events(event_name, occurred_at desc);
create index vapi_analytics_events_email_idx
  on public.vapi_analytics_events(email, occurred_at desc) where email is not null;
```

---

## §8 RLS policies

Policies applied in migration `20260421_012_rls_policies.sql`. Pattern:

- Each table has RLS enabled.
- `authenticated` role can `select` own rows where `email = auth.email()`.
- `authenticated` role can `insert` own rows where `email = auth.email()`.
- Service role (used by API handlers and cron) bypasses RLS.
- Coach (Jake's email hardcoded as a list — future: from `vapi_coach_relationships`) can `select` from coach tables.

Exception: `vapi_presence_trigger_versions`, `vapi_taxonomy_versions`, `vapi_peer_marketplace_coaches` are read-only for all authenticated (public-listed) but writable only by service role.

---

## §9 Sample data discipline

Sample/demo clients are clearly labeled with `[SAMPLE]` prefix in all text fields and `email LIKE 'sample-%@axiom.demo'`. Easy to identify and purge. Never mix with real production data.

---

*End of data model. All Wave 1 migrations reference this document.*
