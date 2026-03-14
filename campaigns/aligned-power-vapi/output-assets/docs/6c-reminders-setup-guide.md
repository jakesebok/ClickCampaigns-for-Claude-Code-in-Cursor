# Step-by-step: 6C reminder emails setup

This guide is written for anyone—no coding experience needed. You'll use your web browser and the Vercel and Resend websites to get reminder emails working. You'll add two "secrets" (like passwords) in Vercel, connect Resend so the system can send email, and optionally verify your own "from" address. At the end, you'll test everything by sending yourself a test email in your browser.

---

## Part 1: Add environment variables in Vercel

### Step 1: Open your project in Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Open the project that hosts your Jake Sebok portal (the one whose **Root Directory** is `campaigns/aligned-power-vapi/output-assets`, or the repo that contains that folder).

### Step 2: Open Environment Variables

1. Click your **project name** to open the project.
2. Click the **Settings** tab.
3. In the left sidebar, click **Environment Variables**.

### Step 3: Add CRON_SECRET

This is a secret “password” that only Vercel (and you) use to trigger the reminder emails. It keeps strangers from triggering your reminders.

1. Click **Add New** (or **Add**).
2. In **Key**, type exactly: `CRON_SECRET`
3. In **Value**, paste a long random password. To create one:
   - Use a password manager (e.g. 1Password, LastPass) to generate a new password, **or**
   - Use a free online “random password generator” and set the length to at least 32 characters, then copy the result.
   Paste that into **Value**.
4. Under **Environments**, leave **Production** checked.
5. Click **Save**.

### Step 4: Add RESEND_API_KEY

This tells Vercel how to send email through Resend. You’ll get the key from Resend in Part 2.

1. **Do Part 2 first** (Resend setup) so you have the key.
2. Back in Vercel → **Settings** → **Environment Variables**, click **Add New**.
3. In **Key**, type exactly: `RESEND_API_KEY`
4. In **Value**, paste the key you copied from Resend (it usually starts with `re_`).
5. Under **Environments**, leave **Production** checked.
6. Click **Save**.

### Step 5: Add SIX_C_FROM_EMAIL (recommended)

Set this to the exact From address that matches the domain or **subdomain** you verified in Resend (e.g. if you verified notifications.alignedpower.coach, use something like notifications@notifications.alignedpower.coach).

1. Click **Add New**.
2. In **Key**, type exactly: `SIX_C_FROM_EMAIL`
3. In **Value**, type the exact email address you verified in Resend (e.g. `notifications@notifications.alignedpower.coach` if you verified that subdomain).
4. Under **Environments**, leave **Production** checked.
5. Click **Save**.

**Important:** If you verified a **subdomain** in Resend (e.g. notifications.alignedpower.coach), set **SIX_C_FROM_EMAIL** to an address on that subdomain (e.g. `notifications@notifications.alignedpower.coach`), not the root domain. Otherwise you may get "domain is not verified" from Resend.

### Step 6: Redeploy

Environment variables are applied on the **next** deployment.

1. Go to the **Deployments** tab.
2. Open the **⋯** menu on the latest deployment.
3. Click **Redeploy**.
4. Wait for the deployment to finish.

After this, **CRON_SECRET** and **RESEND_API_KEY** (and **SIX_C_FROM_EMAIL** if you set it) are available to `/api/cron/6c-reminders`.

---

## Part 2: Resend API key and “from” address

### Step 1: Sign in to Resend

1. Go to [resend.com](https://resend.com).
2. Sign up or log in.

### Step 2: Create an API key

An “API key” is a long password that lets Vercel send email through Resend. Resend will show it only once, so you must copy it right away.

1. In Resend, open **API Keys** in the sidebar (or **Integrations** → **API Keys**).
2. Click **Create API Key**.
3. Give it a name you’ll recognize, e.g. `Jake Sebok 6C reminders`.
4. For **Permission**, choose **Sending access** (or Full access).
5. Click **Create** (or **Add**).
6. **Copy the key immediately.** It looks like `re_` followed by a long string. Resend will not show it again.
7. Paste this key into Vercel as **RESEND_API_KEY** (Part 1, Step 4).

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

Resend will show a short list of “DNS records.” You add these where your domain is managed—that’s the company you bought the domain from (e.g. GoDaddy, Namecheap) or where your website’s DNS is set (e.g. Cloudflare).

1. Keep the Resend tab open. In another tab, log in to where your domain is managed (GoDaddy, Cloudflare, Namecheap, etc.).
2. Find the **DNS** or **DNS settings** or **Manage DNS** section for your domain (e.g. alignedpower.coach).
3. For **each** line Resend shows, add a new record with:
   - **Type** — copy from Resend (e.g. TXT, MX, CNAME).
   - **Name** or **Host** — copy from Resend (e.g. `resend._domainkey` or `@`).
   - **Value** or **Content** — the long string Resend gives you (copy the whole thing).
4. Save your changes. Repeat for every record Resend listed.

### Step 3: Wait and verify in Resend

1. DNS updates can take a few minutes or up to a day or two.
2. In Resend, open **Domains**, find your domain, and click **Verify** (or wait for it to verify automatically).
3. When the status shows **Verified**, you can use any address at that domain as the “From” address (e.g. scorecard@alignedpower.coach).

### Step 4: Set SIX_C_FROM_EMAIL in Vercel (optional but recommended)

1. In Vercel → **Settings** → **Environment Variables**, add (if you haven’t already):
   - **Key:** `SIX_C_FROM_EMAIL`
   - **Value:** `scorecard@alignedpower.coach` (or whatever address you want, at the verified domain).
2. Redeploy so the new variable is applied.

The 6C reminder API uses this as the “From” address. If you don’t set **SIX_C_FROM_EMAIL**, the code falls back to `scorecard@alignedpower.coach` — that address must still be allowed by your verified domain in Resend.

---

## Part 3b: Use Resend’s default address (no domain verification)

Good for testing only.

1. Do **not** add or verify a domain in Resend.
2. **Do not** set **SIX_C_FROM_EMAIL** in Vercel, **or** set it to an address Resend allows for testing (e.g. the one they show in the dashboard, often `onboarding@resend.dev` or your own verified email in Resend).
3. Resend may require you to verify the **recipient** email when using their default domain. Check their docs for “testing” or “sandbox” limits.

For production, use **Part 3a** and verify your own domain.

---

## Testing that it works

After you’ve set **CRON_SECRET**, **RESEND_API_KEY**, and (optionally) **SIX_C_FROM_EMAIL** and redeployed, you can verify everything in three steps. **No coding required**—you'll only use your web browser.

You'll need two things written down: your **Vercel site address** (e.g. aligned-power.vercel.app) and the **CRON_SECRET** value you pasted into Vercel (the long random password from Step 3 in Part 1).

---

### Test 1: Make sure the reminder link is locked down

This checks that random people can't trigger your reminders.

1. Open a new browser tab.
2. In the address bar, paste this link, but replace **your-app** with your real Vercel site address:

   `https://your-app.vercel.app/api/cron/6c-reminders`

   Example: if your site is aligned-power.vercel.app, use:  
   `https://aligned-power.vercel.app/api/cron/6c-reminders`

3. Press Enter.

**What you should see:** A short line of text that says `{"error":"unauthorized"}`. That's good—it means only someone with your secret can run the reminders. You can close the tab.

### Test 2: See what the system "would" do right now (no email is sent)

This checks that the system is running and knows the correct time. It does **not** send any email.

1. In the address bar, paste this link. Replace **your-app** with your Vercel site address and **YOUR_SECRET** with your actual CRON_SECRET. Leave `&status=1` at the end.

   `https://your-app.vercel.app/api/cron/6c-reminders?secret=YOUR_SECRET&status=1`

   Example: if your site is aligned-power.vercel.app and your secret is abc123xyz, you'd use:
   `https://aligned-power.vercel.app/api/cron/6c-reminders?secret=abc123xyz&status=1`

2. Press Enter.

**What you should see:** A page of plain text that includes words like "ok", "eastern", "reminderType", and a sentence about what would happen at this time. Most of the time you'll see something like "No reminder scheduled for this time"—that's normal, because reminders only go out on Friday, Saturday, and Sunday at 12:05pm Eastern. The important part is that you see a response with no error. You can close the tab.

### Test 3: Send yourself a real test email

This sends one test reminder to your own inbox so you can confirm that Resend and your "From" address work.

1. In the address bar, paste this link. Replace **your-app** with your Vercel site address, **YOUR_SECRET** with your CRON_SECRET, and **your@email.com** with your real email address:

   `https://your-app.vercel.app/api/cron/6c-reminders?secret=YOUR_SECRET&test_send=your@email.com`

   Example:
   `https://aligned-power.vercel.app/api/cron/6c-reminders?secret=abc123xyz&test_send=you@gmail.com`

2. Press Enter.

**What you should see in the browser:** A short line of text that includes "ok":true and "test_send":true and your email address.

**What you should see in your inbox:** Within a minute or two, an email with the subject **"[Test] Your 6C's Scorecard is available for this week."** Check your spam folder if you don't see it in the inbox.

If you receive that email, your setup is working correctly.

**Important:** The link you used in Test 3 contains your secret. Don't share that link or paste it anywhere public. After testing, you can simply close the tab. If you're worried you may have exposed the secret, you can create a new CRON_SECRET in Vercel (add a new value, save, then redeploy) and use the new one from then on.

---

### If you get "unauthorized" on Tests 2 or 3

That usually means the secret in the URL doesn't match what's in Vercel. Try this:

1. **Use your real CRON_SECRET.** In Tests 2 and 3 you must replace **YOUR_SECRET** with the exact value you added in Vercel (Settings → Environment Variables → CRON_SECRET). Copy it from Vercel again and paste it into the URL where it says YOUR_SECRET. Don't leave the word "YOUR_SECRET" in the link.
2. **No spaces.** When you paste the secret into the URL, make sure there are no spaces before or after it.
3. **Special characters in the secret.** If your secret contains **&**, **=**, or **#**, the browser can break the URL and the server won't see the full secret. Fix it by creating a **new** CRON_SECRET in Vercel that uses only letters and numbers (e.g. 32 random characters like `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`). Save, redeploy, then use that new value in the test URL.
4. **Redeploy after adding the secret.** Vercel only loads new environment variables after you redeploy. Go to Deployments → ⋯ on the latest deployment → Redeploy, wait for it to finish, then try the test again.

---

### If the test email doesn't arrive or you see an error

- If the **browser** shows something like resend_failed or an error message, read the rest of the text on the page. It often says what went wrong (e.g. "domain not verified" or "invalid from address"). Fix that in Resend (e.g. finish domain verification) or in Vercel (e.g. set **SIX_C_FROM_EMAIL** to an address that's allowed for your domain), then try Test 3 again.
- If the **browser** shows ok and test_send true but you never get the email, check your spam/junk folder and "Promotions" (Gmail). If it's still not there after a few minutes, check Resend's dashboard for any delivery errors or limits.

### When do the real reminders go out?

The system sends reminders **once per day** at **12:05pm Eastern** (Friday, Saturday, and Sunday). So each week, active clients get up to three emails: one when the scorecard opens (Friday 12:05pm), a reminder (Saturday 12:05pm), and a "one hour left" notice (Sunday 12:05pm). You don't have to do anything else—Vercel runs this automatically.

---

## Quick checklist

- [ ] **Vercel:** Added **CRON_SECRET** (long random string).
- [ ] **Resend:** Created an API key; copied it.
- [ ] **Vercel:** Added **RESEND_API_KEY** (paste of that key).
- [ ] **Resend:** Either verified your domain (Part 3a) or accepted using Resend’s default (Part 3b).
- [ ] **Vercel:** Optionally added **SIX_C_FROM_EMAIL** (e.g. `scorecard@alignedpower.coach`) if you verified that domain.
- [ ] **Vercel:** Redeployed so the new env vars are in effect.

After that, the cron job will run once daily at 12:05pm Eastern (Fri/Sat/Sun) and send the corresponding reminder. For the schedule and more detail, see [6c-reminder-emails.md](./6c-reminder-emails.md).
