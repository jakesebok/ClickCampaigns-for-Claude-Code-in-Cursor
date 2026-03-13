# Beta Launch Checklist

## Pre-Launch Setup

### Services to Configure
- [ ] **Clerk** — Create application at [clerk.com](https://clerk.com)
  - Copy publishable key and secret key to `.env.local`
  - Add webhook endpoint: `https://your-domain.com/api/webhooks/clerk` → `user.created`
  - Style the sign-in/sign-up to match brand
- [ ] **Supabase** — Create project at [supabase.com](https://supabase.com)
  - Copy URL, anon key, service role key, and DATABASE_URL to `.env.local`
  - Run `npm run db:push` to create tables
- [ ] **Anthropic** — Get API key at [console.anthropic.com](https://console.anthropic.com)
  - Copy to `.env.local`
- [ ] **Stripe** — Create products at [stripe.com](https://stripe.com)
  - Create "Aligned Monthly" product: $39/month recurring
  - Create "Aligned Annual" product: $349/year recurring
  - Copy price IDs to `.env.local`
  - Create coupon: `CLARITY30` (100% off for 30 days)
  - Create coupon: `COACHING12` (100% off for 365 days)
  - Add webhook endpoint: `https://your-domain.com/api/webhooks/stripe` → `customer.subscription.*`
- [ ] **Twilio** — Get credentials at [twilio.com](https://twilio.com)
  - Buy a phone number
  - Copy account SID, auth token, and phone number to `.env.local`
- [ ] **Vercel** — Deploy at [vercel.com](https://vercel.com)
  - Import project, set all env vars
  - Cron job auto-configures from `vercel.json`

### Pre-Flight Checks
- [ ] Create test account — sign up, verify email
- [ ] Upload test worksheets — verify parsing works
- [ ] Complete guided onboarding — verify questions flow
- [ ] Send test chat messages — verify Claude responds with context
- [ ] Test morning SMS — manually trigger cron endpoint
- [ ] Test subscription flow — use Stripe test mode
- [ ] Test coupon codes — CLARITY30 and COACHING12
- [ ] Check mobile PWA — install on phone, verify layout
- [ ] Verify all pages render — landing, pricing, webinar, dashboard

## Beta Cohort (Week 5-6)

### Invite Beta Testers
- [ ] Select 5-10 coaching clients
- [ ] Send each a COACHING12 coupon code
- [ ] Provide their completed worksheets (if not already done)
- [ ] Schedule 15-min demo call or send Loom walkthrough

### Feedback Collection
- [ ] Create simple feedback form (Google Form or Typeform)
  - What's the most useful feature?
  - What's confusing or broken?
  - How does it compare to using ChatGPT directly?
  - What's missing?
  - Would you pay $39/mo for this?
- [ ] Schedule check-in after 3 days
- [ ] Schedule check-in after 7 days
- [ ] Collect testimonials for landing page

### Metrics to Track
- [ ] Daily active users
- [ ] Messages sent per user per day
- [ ] Scorecard completion rate
- [ ] ONE THING completion rate
- [ ] SMS opt-in rate
- [ ] Context depth scores
- [ ] Churn rate (who stops using it and when)

## Soft Launch (Post-Beta)

- [ ] Apply beta feedback — fix bugs, refine UX
- [ ] Record landing page testimonial video (if available)
- [ ] Announce to full coaching client base
- [ ] Run first Strategic Clarity Workshop with app tie-in
- [ ] Activate webinar invite email sequence
- [ ] Launch Meta ads (start with Ad Set 1 + 2)
- [ ] Monitor conversion: registration → trial → paid
