# Aligned Freedom Coach (ALFRED)

A personalized AI coaching app built on the Strategic Clarity framework by Jake Sebok. **ALFRED** is the only app Jake sells; it runs your **Aligned AIOS** master context (from the Intensive or Accelerator) together with VAPI™, archetype, 6Cs, and Vital Actions. Your values, your goals, your real constraints — powering an AI coach that keeps you focused, aligned, and growing.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Auth:** Clerk
- **Database:** Supabase (PostgreSQL via Drizzle ORM)
- **AI:** Anthropic Claude (Sonnet for coaching, Haiku for check-ins)
- **Payments:** Stripe (subscriptions, trials, coupons)
- **SMS:** Twilio (daily morning prompts)
- **Styling:** Tailwind CSS (Aligned Power brand — navy `#0E1624`, orange `#FF6B1A`)
- **Fonts:** Outfit (headlines) + Cormorant Garamond (body)
- **Hosting:** Vercel
- **PWA:** Installable on mobile via manifest.json

## Getting Started

### 1. Install dependencies

```bash
cd campaigns/aligned-ai-os
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all the values in `.env.local`:

| Service | What to set up | Dashboard |
|---------|---------------|-----------|
| **Clerk** | Create app, get publishable + secret keys, add webhook for `user.created` | [clerk.com](https://clerk.com) |
| **Supabase** | Create project, get URL + anon key + service role key + connection string | [supabase.com](https://supabase.com) |
| **Anthropic** | Get API key | [console.anthropic.com](https://console.anthropic.com) |
| **Stripe** | Create products (Monthly $39, Annual $349), get keys, set up webhook | [stripe.com](https://stripe.com) |
| **Twilio** | Get account SID, auth token, buy a phone number | [twilio.com](https://twilio.com) |

### 3. Push database schema

```bash
npm run db:push
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Stripe coupon codes

- `INTENSIVE30` — 30 days free (Strategic Alignment Intensive attendees)
- `COACHING12` — 12 months free (Aligned Power Accelerator clients)

## Project Structure

```
app/
├── (auth)/             # Sign in/up pages (Clerk)
├── (dashboard)/        # Authenticated app
│   ├── chat/           # AI coaching chat
│   ├── blueprint/      # Alignment Blueprint viewer
│   ├── one-thing/      # Weekly Vital Action tracker
│   ├── scorecard/      # 6Cs weekly scorecard (full framework)
│   ├── onboarding/     # Upload or guided onboarding
│   └── settings/       # Account, SMS, billing, context
├── (marketing)/        # Public pages
│   ├── page.tsx        # ALFRED landing page
│   └── pricing/        # Pricing page
└── api/                # All API routes

lib/
├── ai/                 # Claude integration + prompts
├── db/                 # Drizzle schema + client
├── stripe/             # Stripe helpers
├── twilio/             # SMS helpers
├── scorecard.ts        # 6Cs framework (Clarity, Coherence, Capacity, Confidence, Courage, Connection)
└── utils.ts

output-assets/
├── emails/             # 5 email sequences
└── ads/                # Meta + YouTube ad copy
```

## 6Cs Scorecard Framework

| C | Label | Core Question |
|---|-------|---------------|
| 1 | **Clarity** | Do I know what matters most? |
| 2 | **Coherence** | Do my actions match my values? |
| 3 | **Capacity** | Can my nervous system hold my life? |
| 4 | **Confidence** | Am I keeping my word to myself? |
| 5 | **Courage** | Am I doing the hard right thing? |
| 6 | **Connection** | Am I present with the people who matter? |

Each C has 5 statements rated 1-5, reflection prompts, and a final Vital Action question.

## Integration with Marketing Website

The Strategic Alignment Intensive page lives on the marketing website at:
`jakesebok.com/work-with-me/strategic-intensives`

Aligned Freedom Coach is linked from that page. Workshop attendees get coupon codes for 30-day free access.

## User Tiers

| Tier | Trial | How they enter |
|------|-------|---------------|
| General | 7 days | Signs up on Aligned Freedom Coach website |
| Intensive Attendee | 30 days | Uses `INTENSIVE30` coupon post-workshop |
| Accelerator Client | 12 months | Uses `COACHING12` coupon from program |
