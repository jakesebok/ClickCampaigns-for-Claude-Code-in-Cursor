# Step-by-step: 6C reminder emails setup

This guide walks you through adding **RESEND_API_KEY** and **CRON_SECRET** in Vercel, and verifying your “from” domain in Resend (or using a verified address for **6C_FROM_EMAIL**).

---

## Part 1: Add environment variables in Vercel

### Step 1: Open your project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Open the project that hosts your Aligned Power portal (the one whose **Root Directory** is `campaigns/aligned-power-vapi/output-assets`, or the repo that contains that folder).

### Step 2: Open Environment Variables

1. Click your **project name** to open the project.
2. Click the **Settings** tab.
3. In the left sidebar, click **Environment Variables**.

### Step 3: Add CRON_SECRET

1. Click **Add New** (or **Add**).
2. **Key:** `CRON_SECRET`
3. **Value:** Generate a long random string. Two options:
   - **Option A (terminal):** Run  
     `openssl rand -hex 32`  
     and paste the output as the value.
   - **Option B (password generator):** Use any password generator (e.g. 1Password, LastPass) to create a long random string (32+ characters) and paste it.
4. **Environments:** Leave **Production** checked (and **Preview** if you want cron to run on preview deployments too).
5. Click **Save**.

### Step 4: Add RESEND_API_KEY

1. **Do Part 2 first** (Resend setup) so you have an API key.
2. Back in Vercel → **Settings** → **Environment Variables**, click **Add New**.
3. **Key:** `RESEND_API_KEY`
4. **Value:** Paste the API key you created in Resend (starts with `re_`).
5. **Environments:** Production (and Preview if you like).
6. Click **Save**.

### Step 5: (Optional) Add 6C_FROM_EMAIL

Only if you want a specific “from” address (e.g. `scorecard@alignedpower.coach`):

1. Click **Add New**.
2. **Key:** `6C_FROM_EMAIL`
3. **Value:** The exact email address you will verify in Resend (e.g. `scorecard@alignedpower.coach`).
4. **Environments:** Production (and Preview if you like).
5. Click **Save**.

### Step 6: Redeploy

Environment variables are applied on the **next** deployment.

1. Go to the **Deployments** tab.
2. Open the **⋯** menu on the latest deployment.
3. Click **Redeploy**.
4. Wait for the deployment to finish.

After this, **CRON_SECRET** and **RESEND_API_KEY** (and **6C_FROM_EMAIL** if you set it) are available to `/api/cron/6c-reminders`.

---

## Part 2: Resend API key and “from” address

### Step 1: Sign in to Resend

1. Go to [resend.com](https://resend.com).
2. Sign up or log in.

### Step 2: Create an API key

1. In the Resend dashboard, go to **API Keys** (sidebar or **Integrations** → **API Keys**).
2. Click **Create API Key**.
3. **Name:** e.g. `Aligned Power 6C reminders`.
4. **Permission:** **Sending access** (or Full access if you prefer).
5. Click **Create** (or **Add**).
6. **Copy the key immediately** — Resend shows it only once. It looks like `re_xxxxxxxxxxxx`.
7. Use this value as **RESEND_API_KEY** in Vercel (see Part 1, Step 4).

### Step 3: Choose how you’ll send (domain vs no domain)

You can either:

- **A) Verify a domain** and send from an address like `scorecard@alignedpower.coach`, or  
- **B) Use Resend’s default “from”** (e.g. `onboarding@resend.dev`) for testing — no domain verification needed, but not ideal for production.

---

## Part 3a: Verify your “from” domain in Resend

Use this path if you want to send from your own domain (e.g. `scorecard@alignedpower.coach`).

### Step 1: Add the domain

1. In Resend, go to **Domains** (sidebar).
2. Click **Add Domain**.
3. Enter your domain only, e.g. `alignedpower.coach` (no `www`, no `https://`).
4. Click **Add** (or **Verify**).

### Step 2: Add the DNS records Resend shows

Resend will show a list of DNS records (e.g. SPF, DKIM) you must add at your domain host (where you manage DNS: GoDaddy, Cloudflare, Namecheap, etc.).

1. Leave the Resend tab open and open your **domain registrar or DNS provider** (e.g. Cloudflare, GoDaddy, Namecheap).
2. Find the **DNS** or **DNS settings** section for `alignedpower.coach`.
3. For **each** record Resend lists:
   - **Type** (e.g. TXT, MX, CNAME)
   - **Name/Host** (e.g. `resend._domainkey` or `@`)
   - **Value/Content** (the long string Resend gives you)
   - **TTL** (optional; default is fine)
4. Create each record exactly as shown. Save changes.

### Step 3: Wait and verify in Resend

1. DNS can take from a few minutes to 24–48 hours to propagate.
2. In Resend → **Domains**, find your domain and click **Verify** (or wait for automatic verification).
3. When the status is **Verified**, you can send from any address at that domain (e.g. `scorecard@alignedpower.coach`).

### Step 4: Set 6C_FROM_EMAIL in Vercel (optional but recommended)

1. In Vercel → **Settings** → **Environment Variables**, add (if you haven’t already):
   - **Key:** `6C_FROM_EMAIL`
   - **Value:** `scorecard@alignedpower.coach` (or whatever address you want, at the verified domain).
2. Redeploy so the new variable is applied.

The 6C reminder API uses this as the “From” address. If you don’t set **6C_FROM_EMAIL**, the code falls back to `scorecard@alignedpower.coach` — that address must still be allowed by your verified domain in Resend.

---

## Part 3b: Use Resend’s default address (no domain verification)

Good for testing only.

1. Do **not** add or verify a domain in Resend.
2. **Do not** set **6C_FROM_EMAIL** in Vercel, **or** set it to an address Resend allows for testing (e.g. the one they show in the dashboard, often `onboarding@resend.dev` or your own verified email in Resend).
3. Resend may require you to verify the **recipient** email when using their default domain. Check their docs for “testing” or “sandbox” limits.

For production, use **Part 3a** and verify your own domain.

---

## Quick checklist

- [ ] **Vercel:** Added **CRON_SECRET** (long random string).
- [ ] **Resend:** Created an API key; copied it.
- [ ] **Vercel:** Added **RESEND_API_KEY** (paste of that key).
- [ ] **Resend:** Either verified your domain (Part 3a) or accepted using Resend’s default (Part 3b).
- [ ] **Vercel:** Optionally added **6C_FROM_EMAIL** (e.g. `scorecard@alignedpower.coach`) if you verified that domain.
- [ ] **Vercel:** Redeployed so the new env vars are in effect.

After that, the cron job will run on its schedule and send 6C reminder emails when the time window (Friday 12pm, Saturday 12pm, Sunday 12pm, Sunday 3pm Eastern) matches. For more on the schedule and manual testing, see [6c-reminder-emails.md](./6c-reminder-emails.md).
