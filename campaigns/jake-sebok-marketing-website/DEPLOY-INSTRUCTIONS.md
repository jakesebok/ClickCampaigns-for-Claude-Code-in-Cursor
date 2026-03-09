# Deploy Jake Sebok Marketing Website to alignedpower.coach

This guide walks you through deploying the marketing website to **alignedpower.coach** (your main domain) using Vercel and Git. No coding required—just follow the steps.

---

## New to this? Start here.

**If you don't have Node.js, Git, or technical experience:** Use **[DEPLOYMENT-BEGINNER-GUIDE.md](DEPLOYMENT-BEGINNER-GUIDE.md)** instead. It explains everything in plain English and uses GitHub Desktop (no command line). You don't need Node.js—Vercel builds the site on their servers.

---

## Before You Start

- **Domain:** alignedpower.coach (the main domain, not the subdomain)
- **Current setup:** portal.alignedpower.coach is already on Vercel (your client portal)
- **This site:** Will live at alignedpower.coach (the homepage)

---

## Part 1: Set Up Form Submissions (Contact + Application)

The Contact form and Accelerator Application form need to send data somewhere. We use **Formspree** (free tier works).

### 1.1 Create a Formspree account

1. Go to **https://formspree.io** and sign up (free).
2. Create **two forms**:
   - One for **Contact** (name, email, message)
   - One for **Accelerator Application** (name, email, business, revenue, why)

### 1.2 Get your form IDs

After creating each form, Formspree gives you an endpoint like:
`https://formspree.io/f/xxxxxxxx`

The part after `/f/` (e.g. `xxxxxxxx`) is your **Form ID**.

### 1.3 Update the forms in the project

1. Open **`app/contact/page.tsx`**
2. Find: `action="https://formspree.io/f/YOUR_FORM_ID"`
3. Replace `YOUR_FORM_ID` with your **Contact** form ID.

4. Open **`app/work-with-me/page.tsx`**
5. Find: `action="https://formspree.io/f/YOUR_FORM_ID"`
6. Replace `YOUR_FORM_ID` with your **Accelerator Application** form ID.

7. Save both files.

---

## Part 2: Put the Project on GitHub

You have two options: **same repo** (as your existing ClickCampaigns project) or **new repo**.

### Option A: Same repo (recommended)

If your existing project (with portal.alignedpower.coach) is already in a GitHub repo:

1. Make sure the marketing website is inside that repo at:
   `campaigns/jake-sebok-marketing-website/`
2. Commit and push your changes:
   ```bash
   cd /Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor
   git add campaigns/jake-sebok-marketing-website/
   git commit -m "Add Jake Sebok marketing website"
   git push
   ```
3. Skip to **Part 3**. In Vercel, you'll create a **new project** that points to the same repo but a different root folder.

### Option B: New repo (separate)

If you want this site in its own GitHub repo:

1. Go to **https://github.com** → **New repository**
2. Name it something like `jake-sebok-marketing` or `alignedpower-website`
3. Leave it **empty** (no README)
4. Create the repo.
5. On your computer, open **Terminal** and run:
   ```bash
   cd /Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor/campaigns/jake-sebok-marketing-website
   git init
   git add .
   git commit -m "Initial commit - Jake Sebok marketing website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repo name.

6. When prompted for password, use a **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens → Generate new token).

---

## Part 3: Deploy on Vercel

### 3.1 Create a new Vercel project

1. Go to **https://vercel.com** and sign in (use **Continue with GitHub**).
2. Click **Add New…** → **Project**.
3. **Import** your GitHub repo:
   - **Option A (same repo):** Select your existing repo. You'll set a different root folder in the next step.
   - **Option B (new repo):** Select the new repo you just created.

### 3.2 Configure the project

1. **Root Directory:** Click **Edit** and enter:
   - **Option A:** `campaigns/jake-sebok-marketing-website`
   - **Option B:** `.` (or leave blank)

2. **Framework Preset:** Vercel should auto-detect **Next.js**. If not, select it.

3. **Build and Output Settings:** Leave defaults. Next.js will build automatically.

4. Click **Deploy**.

5. Wait 1–2 minutes. You'll get a URL like `jake-sebok-marketing-xxx.vercel.app`.

### 3.3 Add your custom domain (alignedpower.coach)

1. In your Vercel project, go to **Settings** → **Domains**.
2. Click **Add** and enter: `alignedpower.coach`
3. Also add: `www.alignedpower.coach` (optional, for www redirect).
4. Vercel will show you DNS records to add.

### 3.4 Update your DNS

1. Log in to wherever your domain is registered (GoDaddy, Namecheap, Cloudflare, etc.).
2. Add the DNS records Vercel shows you. Typically:
   - **A record:** `@` or `alignedpower.coach` → `76.76.21.21` (Vercel's IP)
   - **CNAME record:** `www` → `cname.vercel-dns.com`

3. Save and wait 5–60 minutes for DNS to propagate.

### 3.5 Verify

1. In Vercel → **Domains**, check that alignedpower.coach shows a green checkmark.
2. Visit **https://alignedpower.coach** — your marketing site should load.

---

## Part 4: Making Updates Later

When you want to change the site (text, images, etc.):

1. Edit the files in `campaigns/jake-sebok-marketing-website/`
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update homepage copy"
   git push
   ```
3. Vercel will automatically rebuild and deploy. Changes go live in 1–2 minutes.

---

## Quick Checklist

- [ ] Formspree account created, Contact + Application forms set up
- [ ] Form IDs replaced in `app/contact/page.tsx` and `app/work-with-me/page.tsx`
- [ ] Project pushed to GitHub (same repo or new repo)
- [ ] New Vercel project created with correct Root Directory
- [ ] Custom domain alignedpower.coach added in Vercel
- [ ] DNS records updated at your domain registrar
- [ ] Site loads at https://alignedpower.coach

---

## Troubleshooting

**Build fails:** Make sure Node.js 18+ is available. Vercel provides it by default. If you see "command not found: npm", check that Root Directory is set correctly.

**Forms don't work:** Verify you replaced `YOUR_FORM_ID` with your actual Formspree form ID in both form `action` attributes.

**Domain not working:** DNS can take up to 48 hours to propagate. Double-check the records match what Vercel shows. Use a tool like https://dnschecker.org to see if your domain resolves.

**Need help?** Ask in your next session—I can walk you through any step.
