# Wave 1 Testing — Priority Order

*For Jake. Walk through in order. Stop and fix any failure before continuing — failures cascade.*
*Total walkthrough: ~75 min. Tier 1 alone is ~20 min and unblocks the demo.*

Each test:
- **URL or action** — what to do
- **Pass** — what success looks like
- **Common failure** — most likely failure mode and how to spot it
- **Why** — what breaks if this is broken

---

## TIER 1 — Demo-critical (~20 min)

If any of these fail, you can't demo. Fix in order before moving on.

### T1.1 — Auth still works
- **Action:** Visit your wave-1 preview URL. Log in with your Supabase account.
- **Pass:** You land on `/dashboard` and see your existing portal (your real assessment results).
- **Common failure:** "Loading…" spinner forever → env vars missing on the preview deploy. Check `SUPABASE_URL` + `SUPABASE_ANON_KEY` are set on the wave-1 preview in Vercel.
- **Why:** Nothing else matters if auth is broken.

### T1.2 — Existing assessment + results unchanged
- **Action:** Visit `/assessment`, scroll the landing page. Visit `/dashboard` and look at YOUR (real) assessment results — wheel, archetype, drivers, priority matrix.
- **Pass:** Everything looks exactly like it did before Wave 1. Wheel colors correct, archetype shows your real one (not "The Engine" if you're not), priority matrix populated.
- **Common failure:** If something looks off here, something I added is interfering with the existing rendering. Tell me which surface and I'll diagnose.
- **Why:** Hard rule was "do not touch what exists." This verifies that.

### T1.3 — New routes resolve (all return 200)
Quick smoke. Visit each, confirm it loads (not 404):
- `/morning-checkin`
- `/evening-review`
- `/monthly-pulse`
- `/longitudinal`
- `/coach-dashboard`
- `/coach/client-detail?email=sample-maya@axiom.demo`
- `/settings/notifications`
- `/marketplace`
- `/install`
- `/share/test123` *(should say "link not found" — that's correct, route works)*

**Pass:** All load without 404. They may say "loading" or "access denied" or "no data" — those are fine.
**Common failure:** 404 means `vercel.json` rewrite didn't deploy. Force Vercel redeploy of wave-1.
**Why:** Confirms the routing layer shipped.

### T1.4 — Maya's results wheel renders correctly *(the red-wheel fix)*
- **Action:** As Jake, navigate to `/coach-dashboard`. Click "Maya Chen" in the roster. Get her email. Now manually log in (or temporarily impersonate) to view as Maya, OR look at her data via `/coach/client-detail?email=sample-maya@axiom.demo`.
- **Pass:** Wheel uses the full color palette (green/yellow/orange — Maya has no red). Domains visibly differentiated. Tier labels read "Dialed", "Functional", "Below the Line" — never "Below" alone.
- **Common failure:** Still all-red → seed didn't update OR results page is reading from cache.
- **Why:** Confirms the JSONB payload is now spec-compliant. If the wheel renders right for Maya, it'll render right for any real client.

### T1.5 — Coach dashboard loads with sample roster
- **Action:** Login as `jacob@alignedpower.coach` (or `jake@alignedpower.coach`). Visit `/coach-dashboard`.
- **Pass:** 4 KPI cards at top show numbers (Active clients: ~4-5, At risk: 1-2, Open alerts: 3, Most common archetype: filled). Roster lists Maya, Darren, Sara, Leo. Status lights are color-coded.
- **Common failure:**
  - "Access denied or error" → you're not logging in with the coach email
  - Empty roster → seed didn't apply (run migration 010+011 again)
  - 404 → vercel.json didn't deploy (T1.3)
- **Why:** This is the bullet point that justifies T3 pricing in the demo.

### T1.6 — Pre-session brief modal opens *(this is what you said you couldn't find)*
- **Action:** On `/coach-dashboard`, click any sample client row (e.g., Maya Chen).
- **Pass:** A modal opens showing client name, recent stats, and either an existing brief OR a "Generate brief now" button.
- **Click "Generate brief now":** Within ~5 seconds, a 200-word brief appears. Should reference Maya's actual driver pattern + recent activity.
- **Common failure:**
  - Modal doesn't open → click handler not bound, the wave-1 build didn't ship the latest `coach-dashboard.html`
  - Modal opens but says "Error generating brief" → `ANTHROPIC_API_KEY` not set in Vercel. Fall-back deterministic brief should still appear though.
- **Why:** The single most-demoable feature. If this works, the T3 sale is a layup.

### T1.7 — Morning check-in writes to DB
- **Action:** Visit `/morning-checkin` (as yourself, logged in). Fill in 3 priorities, pick a domain, write an intention. Submit.
- **Pass:** Success screen appears. Refresh `/morning-checkin` → form replaced with completed state, OR the success card persists for the day.
- **Verify in Supabase:** `SELECT * FROM vapi_morning_checkins WHERE email = 'YOUR_EMAIL' ORDER BY completed_at DESC LIMIT 1;` → row exists with your data.
- **Common failure:**
  - "Something went sideways" → API auth failed. Check Vercel deploy logs for `/api/morning-checkin`.
  - Submits but nothing in DB → handler succeeded for client but the upsert failed. Check Supabase logs.
- **Why:** Foundation for everything ritual-related. If this fails, presence + longitudinal + coach pre-session brief all degrade.

### T1.8 — Evening review writes to DB
- **Action:** Visit `/evening-review`. Pick a day type (e.g., "Drift"). The prompt renders. Type a response. Submit.
- **Pass:** Success screen.
- **Verify in Supabase:** `SELECT * FROM vapi_evening_reviews WHERE email = 'YOUR_EMAIL' ORDER BY completed_at DESC LIMIT 1;` → row exists with the day_type, prompt_id, response.
- **Why:** Same as T1.7. Plus: if you mark a "drift" day with drivers echoed, T1.10 should fire tomorrow.

### T1.9 — Longitudinal dashboard renders
- **Action:** Visit `/longitudinal` as yourself OR as Maya.
- **Pass:** Multiple sections populate — archetype trajectory (1+ row), driver activation history (count of drivers echoed), importance drift chart (Chart.js bar), matrix movement, ritual streak number, 90-day heatmap (squares).
- **Common failure:**
  - "Could not load longitudinal data" → API call to `/api/longitudinal` failed. Check Vercel logs.
  - Empty sections → that's OK if you only have one assessment. Check with Maya's account/email — she has 2.
- **Why:** This is the "biography" demo moment. Most prospects say "wait, that exists?" when they see it.

### T1.10 — Presence engine produces a banner
- **Action:** Easiest way: as Maya, visit `/dashboard` (or any portal page that loads `ritual-widget.js`). The widget should show a "Pattern preview" banner if Maya has fired V-02 (driver persistence — she has).
  - Alt: trigger a fresh evaluation by submitting an evening review with day_type="drift" + a driver echoed, then refresh in the morning.
- **Pass:** Banner appears at top with a sentence like "Yesterday went sharp. The Achievers Trap had an opening..."
- **Verify in Supabase:** `SELECT * FROM vapi_presence_trigger_events WHERE outcome='fired' ORDER BY evaluated_at DESC LIMIT 5;`
- **Common failure:**
  - No banner → presence engine not firing. Check `/api/presence-today` returns banners array.
  - Empty banners array → nobody's met a trigger condition yet. Run the SQL above to confirm fires happened.
- **Why:** "You may see Escape Artist today" is the hook line of the entire demo. If this isn't firing, the pitch falls apart.

---

## TIER 2 — Important polish (~25 min)

Demo works without these but they're noticeable when they're broken.

### T2.1 — Monthly pulse + delta computation
- **Action:** `/monthly-pulse`. Move all 12 sliders. Submit.
- **Pass:** Success state shows "Composite delta: +X.XX" plus per-domain deltas vs last full assessment.
- **Why:** Bridge between weekly and quarterly cadence.

### T2.2 — Notification settings save
- **Action:** `/settings/notifications`. Change morning time, channels, click "Save settings".
- **Pass:** "Saved." message. Refresh — values persist.
- **Verify in Supabase:** `SELECT * FROM vapi_notification_preferences WHERE email='YOUR_EMAIL';`
- **Why:** Without this, cron uses defaults for everyone. Probably fine for V1.

### T2.3 — PWA install prompt
- **Action:** Open the wave-1 preview in Chrome desktop. Complete a morning check-in. Then complete an evening review. Refresh dashboard.
- **Pass:** Bottom-right toast appears: "Add VAPI to your home screen". Click "Install" → Chrome's native install dialog appears.
- **Common failure:** No toast → may have already dismissed (clear localStorage `ap_install_prompt_state` and try again). On iOS Safari, you'll see the `/install` page redirect instead.
- **Why:** PWA install is the retention feature for mobile users. Test on iPhone too.

### T2.4 — User-owned history export
- **Action:** Hit `/api/user-history-export?format=html` while logged in.
- **Pass:** A print-styled HTML page renders with all your history. Browser print dialog auto-fires after ~500ms.
- **Try:** `/api/user-history-export?format=csv` → downloads CSV.
- **Why:** "Client-Owned Export" is one of the 6 elevations. Honesty signal.

### T2.5 — Cohort PDF export *(coach only)*
- **Action:** As Jake, hit `/api/cohort-pdf-export`.
- **Pass:** Print-styled HTML with anonymized cohort intelligence (archetype distribution, driver activations, no client names).
- **Why:** Coach takes this PDF to their own marketing.

### T2.6 — Share link generation + resolution
- **Action:** Find a UI button OR call `/api/share-result` POST while logged in (no body needed). Returns hash like `abc123`. Visit `/share/abc123`.
- **Pass:** Public page shows your archetype + tagline, no email exposed.
- **Why:** Shareability + viral loops.

### T2.7 — Coach client detail (per-client view)
- **Action:** `/coach/client-detail?email=sample-maya@axiom.demo` as Jake.
- **Pass:** 5 KPIs at top. Pre-session brief section. Trajectory list (2 entries for Maya). Recent mornings + evenings populated. Driver activation list. Presence events (Maya should have V-02 fires). Pattern alerts. Notes textarea.
- **Why:** This is the "drill-down" moment in the demo.

### T2.8 — Pattern alerts feed
- **Action:** `/coach-dashboard`. Scroll to "Pattern alerts" section.
- **Pass:** 3 alerts visible (Darren high severity, Leo normal, Maya low). Each has client email, alert type, summary.
- **Why:** Coach demo bullet.

### T2.9 — Methodology rescore endpoint
- **Action:** POST to `/api/taxonomy-rescore` with `{vapi_result_id: "your-result-id", target_version: "v1.0.0"}`.
- **Pass:** Returns `{ ok: true, rescored: false, reason: "same_as_current", results: {...} }`.
- **Why:** Stub today. Real value when you ship v1.1.0 of the taxonomy.

### T2.10 — Alfred mirror UIs
- **Action:** Visit Alfred's app at alfredai.coach. Look for `/morning` and `/evening` routes (new files in `campaigns/aligned-ai-os/app/(dashboard)/morning/page.tsx` etc.).
- **Pass:** Pages render. Submitting writes to the same `vapi_morning_checkins` / `vapi_evening_reviews` tables with `source='alfred'`.
- **Verify bi-directional:** Submit in Alfred. Refresh `/longitudinal` in VAPI portal. New entry appears.
- **Common failure:** Alfred deploy hasn't picked up the new files. Check Alfred's Vercel branch.
- **Why:** Alfred bi-directional was the architectural promise.

---

## TIER 3 — Production readiness (~15 min, run before going live with real users)

### T3.1 — Env vars on wave-1 preview
Required:
- `SUPABASE_URL` ✓ (probably already set)
- `SUPABASE_ANON_KEY` ✓
- `SUPABASE_SERVICE_ROLE_KEY` ✓
- `ANTHROPIC_API_KEY` — for pre-session brief generation
- `RESEND_API_KEY` — for notifications + email fallback
- `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` + `VAPID_SUBJECT` — for web push
- `VAPI_CRON_SECRET` — for manual cron triggers (optional)

Generate VAPID keys: `npx web-push generate-vapid-keys`.

### T3.2 — Web push delivery
- **Action:** With VAPID keys set, visit `/settings/notifications`, click "Enable push", grant permission. Then click "Send test".
- **Pass:** Native browser notification appears within 5 seconds.
- **Why:** Without push, the daily ritual reminder degrades to email-only.

### T3.3 — Email delivery via Resend
- **Action:** Trigger a notification (e.g., manually trigger morning reminder via cron secret URL).
- **Pass:** Email arrives in user's inbox within 30 seconds.
- **Why:** Emails are the fallback when push fails.

### T3.4 — Cron schedule
- **Action:** Vercel dashboard → wave-1 deployment → Functions → check the cron logs.
- **Pass:** `/api/cron/ritual-reminders` is firing every 15 min. Each invocation lists "considered" + "dispatched" counts.
- **Common failure:** Cron not configured for preview branch (Vercel only runs crons on production by default). May need to merge to main or deploy to a different project to verify cron runs.
- **Why:** No cron = no morning/evening reminders fire automatically.

### T3.5 — Migration files apply cleanly
- **Action:** *(Optional but recommended)* Use Supabase MCP `create_branch` to spin up a dev branch. Apply migrations 001-012 in order from the new files.
- **Pass:** All apply without error. Schema matches production.
- **Why:** Confirms the SQL files are accurate clones of production state. Insurance for disaster recovery + Axiom Platform Assembler.

### T3.6 — Idempotency: re-run a migration
- **Action:** Re-apply migration 001 to existing Supabase.
- **Pass:** No errors (because of `IF NOT EXISTS`).
- **Why:** Confirms migrations are safe to re-run during ops.

---

## TIER 4 — Axiom marketing surfaces (~15 min, before you start outreach)

These are at `/Users/JakeSebok/documents/repos/axiom/marketing/` — open the HTML files directly OR deploy to Vercel.

### T4.1 — Axiom landing page
- **File:** `marketing/index.html`
- **Pass:** Hero loads, 3-stat rail visible, 5-tier pricing table renders with "T3 most common" ribbon, FAQ accordions expand.

### T4.2 — Axiom intake form
- **File:** `marketing/intake.html`
- **Action:** Walk all 15 steps. Submit at the end.
- **Pass:** Each step advances. Progress bar updates. Final step shows "Intake received."
- **Note:** Currently POSTs to `/api/axiom-intake` which only exists if you deploy with the Axiom backend wired. Will fail silently if not.

### T4.3 — Pricing calculator
- **File:** `marketing/pricing-calculator.html`
- **Action:** Answer all 5 questions. Click "See my recommendation".
- **Pass:** Recommendation card slides in with tier name, price, and rationale.

### T4.4 — Pitch deck
- **File:** `marketing/collateral/pitch-deck.html`
- **Action:** Open in browser, scroll through 10 slides. Try `Cmd+P` for print preview.
- **Pass:** All 10 slides render with alternating dark/light backgrounds. Print produces 10 pages.

### T4.5 — Webinar landing
- **File:** `marketing/webinar/landing.html`
- **Action:** Fill registration form, submit.
- **Pass:** Form replaces with "You are in" message.

### T4.6 — Legal pages
- **Files:** `marketing/legal/privacy.html`, `marketing/legal/terms.html`
- **Pass:** Render correctly with full body content.

---

## After-the-checks: known gaps to address before Axiom outreach starts

These don't need fixing today but should be on the punch list:

1. **Axiom domain not yet wired** — `axiom.build` (or whatever domain you choose) needs to point at the Axiom Vercel project.
2. **`/api/axiom-intake` backend** — needs the platform/foundation/axiom-api-intake.js handler wired into a serverless function in the Axiom deploy.
3. **VAPID keys not generated** — required for native web push to work.
4. **Resend domain verification** — for sending from `axiom.build` you need DNS records.
5. **First case study** — Rachel Kline simulation file is fictional. Replace with a real first client when you have one.
6. **Custom CRM hookup** — internal SOPs say "TBD" for which CRM. First 20 clients can run on a spreadsheet.
7. **Stripe** — for billing. SOW template references it but Stripe Connect isn't wired.

---

## Quick verification SQL (paste into Supabase SQL editor)

```sql
-- Sample data sanity check (should show 5 rows, all with proper tier strings)
SELECT email, results->>'overallTier' AS tier, results->>'archetype' AS archetype,
       results ? 'priorityMatrix' AS has_matrix
FROM vapi_results
WHERE email LIKE 'sample-%@axiom.demo'
ORDER BY created_at DESC;

-- Recent presence fires (proves the engine is running)
SELECT trigger_id, outcome, evaluated_at, payload->>'context' AS ctx
FROM vapi_presence_trigger_events
ORDER BY evaluated_at DESC
LIMIT 10;

-- Recent mornings/evenings (proves writes work)
SELECT 'morning' AS kind, email, local_date FROM vapi_morning_checkins
UNION ALL
SELECT 'evening', email, local_date FROM vapi_evening_reviews
ORDER BY local_date DESC LIMIT 20;

-- Pattern alerts ready for the demo
SELECT client_email, alert_type, severity, payload->>'summary' AS summary
FROM vapi_pattern_alerts
ORDER BY detected_at DESC LIMIT 10;

-- Migration history (compare to migrations/README.md)
SELECT version, name FROM supabase_migrations.schema_migrations
ORDER BY version DESC LIMIT 15;
```

---

## What to fix first if Tier 1 fails

| Symptom | Most likely cause | Fix |
|---|---|---|
| 404 on new routes | wave-1 not deployed OR vercel.json not picked up | Force redeploy |
| All-red wheels | Sample seed didn't update | Re-run migrations 010-012 |
| Coach dashboard "Access denied" | Logged in with wrong email | Use `jacob@alignedpower.coach` |
| Pre-session brief: "Error generating" | `ANTHROPIC_API_KEY` missing | Add to Vercel env, redeploy |
| Morning check-in 401 | Auth token not passing | Check `Authorization: Bearer` in request |
| Empty longitudinal page | Only 1 assessment OR wrong account | View as Maya (has 2) |
| Presence banner never appears | No drift days seeded | Submit an evening review with day_type=drift, drivers selected |
