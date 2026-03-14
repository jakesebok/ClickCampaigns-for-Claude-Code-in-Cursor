# APOS Setup Guide — For Complete Beginners

> You have all your accounts (Clerk, Claude, OpenAI, Stripe, Vercel, Supabase, Twilio). This guide walks you through connecting them, one step at a time. No coding knowledge required.

---

## Part 1: Open the Project in Your Computer

### Step 1.1 — Find the project folder

1. Open **Finder** (Mac) or **File Explorer** (Windows).
2. Go to: `Documents` → `ClickCampaigns-for-Claude-Code-in-Cursor` → `campaigns` → `aligned-ai-os`
3. You should see folders like `app`, `lib`, and files like `package.json`. You're in the right place.

### Step 1.2 — Open Terminal (the black box where you type commands)

**On Mac:**
- Press `Command + Space` to open Spotlight
- Type `Terminal`
- Press Enter

**On Windows:**
- Press the Windows key
- Type `Command Prompt` or `PowerShell`
- Click to open it

### Step 1.3 — Go to the project folder in Terminal

1. In Terminal, type exactly this (then press Enter):
   ```
   cd ~/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/aligned-ai-os
   ```
2. If you're on Windows, use this instead:
   ```
   cd C:\Users\YourUsername\Documents\ClickCampaigns-for-Claude-Code-in-Cursor\campaigns\aligned-ai-os
   ```
   (Replace `YourUsername` with your actual Windows username.)

3. You should see the path change. Now type:
   ```
   npm install
   ```
4. Wait 1–2 minutes. When it finishes, you're ready for the next part.

---

## Part 2: Create Your Secret Keys File

### Step 2.1 — Copy the example file

1. In the same Terminal window, type:
   ```
   cp .env.example .env.local
   ```
2. Press Enter. This creates a new file called `.env.local` (you won't see it in Finder by default—it's hidden).

### Step 2.2 — Open the file to edit it

**Option A — Using Cursor (recommended):**
1. In Cursor, click `File` → `Open Folder`
2. Open the `aligned-ai-os` folder
3. In the left sidebar, click `.env.local` (it might be under "Open Editors" or in the file list)
4. If you don't see it, press `Command + P` (Mac) or `Ctrl + P` (Windows), type `.env.local`, and open it

**Option B — Using a text editor:**
1. Open **TextEdit** (Mac) or **Notepad** (Windows)
2. Go to `File` → `Open`
3. Navigate to the `aligned-ai-os` folder
4. You may need to enable "Show hidden files" or type `.env.local` in the filename box to find it

---

## Part 3: Fill In Your Keys (One Service at a Time)

You'll replace the placeholder text (like `pk_test_...`) with your real keys. **Never share these keys with anyone.** Treat them like passwords.

---

### 3.1 — Clerk Keys

1. Go to [clerk.com](https://clerk.com) and sign in.
2. Click your application name (or create one if you haven't).
3. Click **API Keys** in the left sidebar.
4. You'll see two keys:
   - **Publishable key** — starts with `pk_test_` or `pk_live_`
   - **Secret key** — starts with `sk_test_` or `sk_live_`
5. Click the copy icon next to each.
6. In your `.env.local` file, replace:
   - `pk_test_...` with your Publishable key
   - `sk_test_...` with your Secret key
7. Save the file (`Command + S` or `Ctrl + S`).

---

### 3.2 — Supabase Keys

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click your project (or create one).
3. Click the **Settings** icon (gear) in the left sidebar.
4. Click **API**.
5. You'll see:
   - **Project URL** — something like `https://xxxxx.supabase.co`
   - **anon public** — a long key starting with `eyJ...`
   - **service_role** — another long key (click "Reveal" if hidden)
6. Copy each one.
7. In `.env.local`, replace:
   - `https://your-project.supabase.co` with your Project URL
   - `eyJ...` (next to NEXT_PUBLIC_SUPABASE_ANON_KEY) with your anon key
   - `eyJ...` (next to SUPABASE_SERVICE_ROLE_KEY) with your service_role key
8. For **DATABASE_URL**:
   - In Supabase, go to **Settings** → **Database**
   - Find the **Connection string** section
   - Copy the "URI" (it looks like `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
   - Replace `[YOUR-PASSWORD]` with your actual database password
   - Paste the full string into `.env.local` for DATABASE_URL
9. Save the file.

---

### 3.3 — Anthropic (Claude) Key

1. Go to [console.anthropic.com](https://console.anthropic.com) and sign in.
2. Click **API Keys** in the left sidebar.
3. Click **Create Key**.
4. Give it a name (e.g., "APOS") and copy the key (starts with `sk-ant-`).
5. In `.env.local`, replace `sk-ant-...` with your key.
6. Save the file.

---

### 3.4 — OpenAI Key

1. Go to [platform.openai.com](https://platform.openai.com) and sign in.
2. Click your profile icon (top right) → **API Keys**.
3. Click **Create new secret key**.
4. Copy the key (starts with `sk-`).
5. In `.env.local`, replace `sk-...` next to OPENAI_API_KEY with your key.
6. Save the file.

---

### 3.5 — Stripe Keys and Price IDs

**Get the keys:**
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com) and sign in.
2. Make sure you're in **Test mode** (toggle in top right should say "Test mode").
3. Click **Developers** → **API keys**.
4. Copy the **Publishable key** (starts with `pk_test_`) and **Secret key** (starts with `sk_test_`).
5. In `.env.local`, replace the Stripe placeholders with these keys.

**Create products and get Price IDs:**
1. In Stripe, go to **Products** → **Add product**.
2. Create **Product 1:**
   - Name: `Aligned Monthly`
   - Price: `39` (recurring, monthly)
   - Click **Save**
   - Copy the **Price ID** (starts with `price_`) → put it in `STRIPE_MONTHLY_PRICE_ID`
3. Create **Product 2:**
   - Name: `Aligned Annual`
   - Price: `349` (recurring, yearly)
   - Click **Save**
   - Copy the **Price ID** → put it in `STRIPE_ANNUAL_PRICE_ID`
4. Save `.env.local`.

**Create coupon codes (optional for now):**
1. In Stripe, go to **Products** → **Coupons** → **Create coupon**.
2. Create `INTENSIVE30` — 100% off for 1 month.
3. Create `COACHING12` — 100% off for 12 months.

---

### 3.6 — Twilio Keys

1. Go to [twilio.com/console](https://www.twilio.com/console) and sign in.
2. On the dashboard, you'll see:
   - **Account SID** — starts with `AC`
   - **Auth Token** — click "Show" to reveal, then copy
3. Go to **Phone Numbers** → **Manage** → **Buy a number** (or use your existing one).
4. Copy your Twilio phone number (e.g., `+15551234567`).
5. In `.env.local`, replace:
   - `AC...` with your Account SID
   - The auth token placeholder with your Auth Token
   - `+1...` with your Twilio phone number
6. Save the file.

---

### 3.7 — App URL (for local testing)

For now, leave this as:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
You'll change this to your real website URL when you deploy.

---

### 3.8 — CRON_SECRET (optional for now)

You can leave this as `your-cron-secret-here` for now. When you deploy, you'll create a random string for it.

---

## Part 4: Set Up the Database (Supabase)

### Step 4.1 — Run the portal migrations (if using shared portal)

1. In Supabase, go to **SQL Editor**.
2. In Cursor, open the main project folder (ClickCampaigns-for-Claude-Code-in-Cursor, not just aligned-ai-os).
3. In the left sidebar, find the `supabase` folder. Open `schema.sql`.
4. Select all the text (`Command + A` or `Ctrl + A`) and copy it.
5. Paste it into the Supabase SQL Editor.
6. Click **Run**.
7. Repeat for `schema-six-c-scorecard.sql` and `add-vapi-results-source.sql` (both in the same `supabase` folder).

### Step 4.2 — Create the APOS tables

1. Go back to Terminal.
2. Make sure you're in the `aligned-ai-os` folder (if not, type the `cd` command from Step 1.3 again).
3. Type:
   ```
   npm run db:push
   ```
4. Press Enter. Wait for it to finish. It should say something like "Pushed successfully" or similar.

---

## Part 5: Run the App on Your Computer

1. In Terminal (in the `aligned-ai-os` folder), type:
   ```
   npm run dev
   ```
2. Press Enter.
3. Wait until you see something like: `Ready on http://localhost:3000`
4. Open your web browser (Chrome, Safari, etc.).
5. Go to: `http://localhost:3000`
6. You should see the APOS landing page.

---

## Part 6: Test That Everything Works

1. **Sign up** — Click "Start Free Trial" or "Sign Up". Create a test account with your email.
2. **Onboarding** — You should be taken to onboarding. Try the guided questions or upload a worksheet.
3. **Chat** — Go to the Chat tab and send a message. You should get a response from the AI.
4. **Scorecard** — Try the 6Cs scorecard.
5. **Vital Action** — Try setting your Vital Action for the week.

If something doesn't work, check the Terminal window for error messages. They often say which key or service is missing.

---

## Part 7: Deploy to Vercel (Put It on the Internet)

### Step 7.1 — Push your code to GitHub (if not already)

1. If your project is in a Git repo and connected to GitHub, make sure your latest changes are pushed.
2. If you're not sure, you can skip this and import the folder directly in Vercel.

### Step 7.2 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New** → **Project**.
3. Import your repository (or upload the `aligned-ai-os` folder if that's an option).
4. **Root Directory:** If Vercel asks, set it to `campaigns/aligned-ai-os` (or wherever the `package.json` is).
5. Before deploying, click **Environment Variables**.
6. Add every variable from your `.env.local` file, one by one:
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Value: (paste your key)
   - Name: `CLERK_SECRET_KEY` | Value: (paste your key)
   - … and so on for every line in `.env.local`
7. For `NEXT_PUBLIC_APP_URL`, use your Vercel URL (e.g., `https://your-project.vercel.app`).
8. Click **Deploy**.
9. Wait a few minutes. When it's done, you'll get a live URL.

### Step 7.3 — Update webhooks with your live URL

**Clerk:**
1. In Clerk, go to **Webhooks** → **Add Endpoint**.
2. URL: `https://your-vercel-url.vercel.app/api/webhooks/clerk`
3. Subscribe to `user.created`.

**Stripe:**
1. In Stripe, go to **Developers** → **Webhooks** → **Add endpoint**.
2. URL: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
3. Select events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`.
4. Copy the **Signing secret** (starts with `whsec_`).
5. Add it to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`.
6. Redeploy the project so it picks up the new variable.

---

## Troubleshooting

| Problem | What to try |
|---------|-------------|
| "Module not found" or "Cannot find module" | Run `npm install` again in the `aligned-ai-os` folder. |
| "Invalid API key" or "Unauthorized" | Double-check you copied the full key with no extra spaces. |
| Blank page or "500 error" | Look at the Terminal for errors. Often a missing env variable. |
| Can't sign up / sign in | Check Clerk keys. Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are both set. |
| Chat doesn't respond | Check `ANTHROPIC_API_KEY`. |
| Stripe checkout fails | Check `STRIPE_SECRET_KEY` and that Price IDs are correct. |
| Database errors | Make sure you ran `npm run db:push` and that `DATABASE_URL` is correct. |

---

## Quick Reference: Where to Find Things

| Service | Login / Dashboard |
|---------|-------------------|
| Clerk | [clerk.com](https://clerk.com) |
| Supabase | [supabase.com](https://supabase.com) |
| Anthropic | [console.anthropic.com](https://console.anthropic.com) |
| OpenAI | [platform.openai.com](https://platform.openai.com) |
| Stripe | [dashboard.stripe.com](https://dashboard.stripe.com) |
| Twilio | [twilio.com/console](https://www.twilio.com/console) |
| Vercel | [vercel.com](https://vercel.com) |

---

*You've got this. Take it one step at a time.*
