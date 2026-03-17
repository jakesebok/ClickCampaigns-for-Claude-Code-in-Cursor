# VAP Coach App — Buglist & Feature Update Context

> **Purpose:** Manage implementation in waves without context overflow. Reference this document when resuming work.

---

## Architecture Context

| System | Location | Purpose |
|--------|----------|---------|
| **App (VAP Coach)** | `campaigns/aligned-ai-os` | Next.js app at vap.coach — user-facing PWA |
| **Portal (Dashboard)** | `campaigns/aligned-power-vapi/output-assets/portal` | HTML/JS at portal.alignedpower.coach — coach/client dashboard |

**Key insight:** App and Portal share the same data (Supabase: `vapi_results`, `six_c_scorecard`, etc.). They must behave as extensions of each other.

---

## 6Cs Window Logic (Portal Reference)

**Source:** `campaigns/aligned-power-vapi/output-assets/portal/six-c-window.js`

- **Window:** Friday 12:00pm – Sunday 6:00pm (America/New_York)
- **Statuses:** `before` | `open` | `closed`
- **Reminder emails:** Cron at 12:05pm Eastern (Fri/Sat/Sun) — `campaigns/aligned-power-vapi/output-assets/api/cron/6c-reminders.js`

**App needs:** Same window logic + push notifications at same times as portal emails.

---

## Current App Structure (Key Paths)

```
app/(dashboard)/
├── layout.tsx          # Sidebar (desktop) + bottom nav (mobile) + ThemeToggle
├── dashboard/page.tsx  # At a Glance, Vital Action, VAPI, 6Cs, Archetype, Focus Here First, Arena, 6Cs Trend
├── chat/page.tsx       # Coach + SUGGESTED_QUESTIONS (Fire Starters)
├── voice/page.tsx
├── assessment/page.tsx
├── assessment/results/page.tsx  # VAPI Results — wheel, archetype, priority matrix, domains
├── scorecard/page.tsx  # 6Cs scorecard form
├── one-thing/page.tsx  # Vital Action
├── priorities/page.tsx # VAPI priority matrix
├── blueprint/page.tsx
└── settings/page.tsx

lib/
├── ai/prompts.ts       # SUGGESTED_QUESTIONS (Fire Starter categories)
├── scorecard.ts        # SCORECARD_CATEGORIES, getOverallScore
├── vapi/               # scoring, quiz-data, interpretations
└── portal-data.ts      # Reads vapi_results, scorecard from Supabase

components/
├── vapi-wheel.tsx      # Wheel visualization
├── theme-toggle.tsx
└── page-header.tsx
```

---

## Request List (12 Items)

### App 1 — 6Cs Logic Parity
- Add same 6Cs window logic as portal: open/closed windows, display if entered/if missed
- App users get **push notifications** at same time as portal reminder emails (Fri/Sat/Sun 12:05pm Eastern)

### App 2 — "Explore My Score"
- Add "Explore My Score" to "At a Glance" section
- Redirect to VAPI Results Page
- Results page should have same layout as portal dashboard

### App 3 — "Explore Archetype"
- "Explore Archetype" → results page
- User can expand to see all archetype info (like portal dashboard)

### App 4 — "Focus Here First" Card
- Remove chevron → **always expanded**
- Add "Explore More" → goes to results page Where to Focus section
- Results page Where to Focus: similar to dashboard, expandable focus cards with descriptions

### App 5 — Domain Icons
- Add icons to domains in domain detail areas

### App 6 — Vital Action Top
- Vital Action at top, front and center (like dashboard)
- User sees it right away every time they open the app
- Same logic as dashboard

### App 7 — Fire Starter Category Menu
- Category buttons (e.g. "Weekly Planning") → **new screen** showing prompts in that category
- New screen: back button + prompt options
- **Tap prompt:** Navigate to chat + auto-submit that prompt
- **"Something else" option:** Navigate to chat with empty input (user types their own)
- **Prompt optimization:** Button label (e.g. "Create weekly schedule") may differ from actual prompt sent. Underlying prompt should reference Vital Action, revenue goals, QC quota, master context — crafted for most impactful coach responses

### App 8 — Light Mode
- Add light mode in settings (dashboard/portal style)

### App 9 — 6Cs Trend Container
- 6Cs trend on dashboard must fit container
- Fix: on iPhone, too wide, causes side scroll

### App 10 — VAPI Results Full Parity
- Copy from dashboard: Alignment At a Glance, Founder Archetype, Where to Focus, Explore Your Score, Progress Over Time
- Include spinning wheel functionality
- Keep app visual styling; port functionality and displays only

### App 11 — 6Cs Notification Icon
- Notification icon so user sees if 6Cs scorecard is available to fill out

### App 12 — Bottom Nav + Menu
- **Bottom nav (5 items):** Dashboard, Coach, Voice, Results (VAPI), "..." (ellipsis)
- **Ellipsis "..."** = the menu — opens overlay/sheet with all options: Settings, 6Cs, Take Assessment, Vital Action, Priorities, Blueprint, etc.
- **Top bar:** Replace gear icon with **notifications bell icon** (shows 6Cs availability — see App 11)
- Settings/gear moves into the "..." menu
- **Results** in bottom nav → `/assessment/results` (full VAPI results page)
- **6Cs and Take Assessment** live inside the "..." menu, not in main bottom nav

---

## Clarifications (Resolved)

| Topic | Decision |
|-------|----------|
| Push notifications | Never set up — need full setup guide + implementation |
| Dashboard vs Portal | "Dashboard" = portal; "App's dashboard" = app dashboard page |
| VAPI Results route | Keep `/assessment/results` |
| Fire Starter tap behavior | Navigate to chat + **auto-submit** prompt. Exception: "Something else" → user types (no auto-submit) |
| Fire Starter prompt text | Button label (e.g. "Create weekly schedule") may differ from actual prompt. **Underlying prompt** should be optimized for best results: reference Vital Action, revenue goals, QC quota, master context. Craft prompts that elicit most impactful coach responses. |
| Bottom nav | Dashboard, Coach, Voice, Results, "..." (menu) |
| Top bar | Notifications bell icon (replaces gear); bell indicates 6Cs scorecard availability |

---

## Implementation Waves (Suggested)

### Wave 1 — Foundation (Low Risk)
- [ ] App 8: Light mode in settings
- [ ] App 9: 6Cs trend container overflow fix
- [ ] App 5: Domain icons in domain detail areas

### Wave 2 — 6Cs Logic & Notifications
- [ ] App 1: Port six-c-window.js logic to app; 6Cs display (open/closed, entered/missed)
- [ ] App 11: Notification icon for 6Cs availability
- [ ] Push notification setup (requires service worker, VAPID keys, backend)

### Wave 3 — Navigation & Layout
- [ ] App 12: Ellipsis menu in bottom nav (replace gear), restructure nav to: Dashboard, Coach, Voice, Results, "..."
- [ ] App 6: Vital Action at top of dashboard
- [ ] App 4: Focus Here First always expanded + Explore More

### Wave 4 — VAPI Results Parity
- [x] App 2: Explore My Score → results page (link in At a Glance when results exist)
- [x] App 3: Explore Archetype → results page, expandable
- [x] App 10: Full VAPI results parity (At a Glance, Archetype, Where to Focus, Explore Score, Progress Over Time, wheel)

### Wave 5 — Fire Starters
- [x] App 7: Fire Starter categories → new screen with optimized prompts, auto-submit on tap, "Something else" for custom input

---

## Push Notifications (App 1 — Implemented)

**Implemented:**

1. **Web Push** — Custom setup with `web-push` + VAPID keys (no third-party provider).
2. **User permission** — Settings → 6Cs Scorecard Reminders toggle. User enables → browser asks "Allow notifications?".
3. **Backend trigger** — `/api/cron/6c-reminders` runs at 17:05 UTC (12:05pm Eastern). Sends push to subscribers; Sat/Sun only to those who haven't submitted this week.
4. **Setup guide** — `docs/PUSH-NOTIFICATIONS-SETUP.md` — generate VAPID keys, add env vars, deploy.

---

## Progress Log

| Date | Wave | Items Completed |
|------|------|-----------------|
| 2025-03-10 | Wave 1 | App 8 (Light mode in settings), App 9 (6Cs trend overflow fix), App 5 (Domain icons in Arena Breakdown) |
| 2025-03-10 | Wave 2 | App 1 (6Cs window logic), App 11 (Notification bell in PageHeader). Push notifications deferred. |
| 2025-03-10 | Wave 3 | App 12 (Ellipsis menu in bottom nav), App 6 (Vital Action at top), App 4 (Focus Here First always expanded + Explore More) |
| 2025-03-10 | Wave 4 | App 2 (Explore My Score in At a Glance), App 3 (Expandable archetype with full content), App 10 (Progress Over Time when 2+ assessments) |
| 2025-03-10 | Wave 5 | App 7 (Fire Starter category screen, prompt list with back, auto-submit on tap, "Something else" for empty input, optimized prompts for Vital Action/revenue/QC/context) |
| 2025-03-10 | Push | 6Cs push notifications: service worker, VAPID subscription, DB storage, Settings UI, cron at 12:05pm Eastern Fri/Sat/Sun. Setup guide: docs/PUSH-NOTIFICATIONS-SETUP.md |
