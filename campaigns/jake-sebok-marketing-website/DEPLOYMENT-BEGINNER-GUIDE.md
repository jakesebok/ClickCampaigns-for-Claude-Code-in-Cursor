# Deploy Your Marketing Website — Complete Beginner's Guide

**You don't need Node.js.** You don't need to know what it is. Vercel (the hosting company) builds your website on their computers. You just need to get your files to GitHub and connect a few things.

**Your goal:** Put this marketing website at **jakesebok.com**. Your portal (portal.alignedpower.coach) stays exactly where it is. You'll have two separate Vercel projects—one for the portal, one for this site.

---

## What You're Doing (In Plain English)

1. **Formspree** — A free service that receives messages from your Contact form and Application form, then emails them to you.
2. **GitHub** — A place on the internet where your website files live. You already use this—when you Push Origin, Vercel deploys your portal. We're adding the marketing site to the same repo.
3. **Vercel** — You already have Vercel connected to GitHub. We're creating a **second** Vercel project that points to a different folder. That second project will live at jakesebok.com.
4. **DNS** — Instructions that tell the internet "when someone types jakesebok.com, send them to Vercel."

---

## Part 1: Set Up Formspree (So Forms Send You Emails)

### Step 1.1 — Create an account

1. Open your web browser.
2. Go to: **formspree.io**
3. Click **Sign Up** (or **Get Started**).
4. Sign up with your email or Google account. It's free.

### Step 1.2 — Create your first form (Contact)

1. After signing in, click **New Form** (or **+ New Form**).
2. Name it something like "Contact" or "Website Contact."
3. Formspree will give you a URL that looks like:  
   `https://formspree.io/f/abc123xy`  
4. **Copy the part after `/f/`** — in this example, that's `abc123xy`. That's your **Contact Form ID**. Write it down or paste it in a note.

### Step 1.3 — Create your second form (Accelerator Application)

1. Click **New Form** again.
2. Name it "Accelerator Application."
3. Copy the Form ID the same way (the part after `/f/`). Write it down.

### Step 1.4 — Put your Form IDs into the website files

1. On your computer, open the folder:  
   `ClickCampaigns-for-Claude-Code-in-Cursor` → `campaigns` → `jake-sebok-marketing-website` → `app`
2. Open the file **`contact/page.tsx`** in a text editor (Cursor, Notepad, TextEdit, etc.).
3. Press **Cmd+F** (Mac) or **Ctrl+F** (Windows) to search.
4. Search for: `YOUR_FORM_ID`
5. Replace `YOUR_FORM_ID` with your **Contact** Form ID (the one from Step 1.2).  
   Example: If your ID is `abc123xy`, change it to: `action="https://formspree.io/f/abc123xy"`
6. Save the file.
7. Open the file **`work-with-me/page.tsx`**.
8. Search for `YOUR_FORM_ID` again.
9. Replace it with your **Accelerator Application** Form ID (from Step 1.3).
10. Save the file.

---

## Part 2: Get Your Files Onto GitHub

**What is GitHub?** It's a website where developers store their code. Vercel will pull your website from GitHub and put it online.

**Since you already have Vercel connected to GitHub:** Your ClickCampaigns project is in a GitHub repo. When you Push Origin, your portal deploys. We just need to:

1. **Add** the marketing website files to that same repo (they're already there in `campaigns/jake-sebok-marketing-website`).
2. **Push** so GitHub has the latest.
3. **Create a second Vercel project** that points to the marketing website folder (not the portal folder).

---

### Get the marketing site onto GitHub

1. Open **GitHub Desktop** (or whatever you use to push).
2. Make sure your repo is the ClickCampaigns one (the same one that deploys the portal).
3. You should see the new files: `campaigns/jake-sebok-marketing-website/` and everything inside it.
4. In the bottom-left, type a message like: "Add marketing website."
5. Click **Commit to main**.
6. Click **Push origin** (top right).
7. Done. Your portal will still deploy to portal.alignedpower.coach as usual. The marketing site files are now on GitHub too—we just need to tell Vercel to build a *second* project from them.

---

## Part 3: Create a Second Vercel Project (For jakesebok.com)

**Important:** You already have one Vercel project for the portal (portal.alignedpower.coach). We're creating a **second** project. Both will live in the same Vercel account. When you push to GitHub, *both* will deploy—the portal from its folder, the marketing site from its folder. They don't overwrite each other.

### Step 3.1 — Add a new project

1. Go to **vercel.com** in your browser.
2. Sign in (you're already connected to GitHub).
3. Click **Add New…** (or **New Project**).
4. You'll see a list of your GitHub repositories.
5. Find the **same repo** you use for the portal (the ClickCampaigns one).
6. Click **Import** next to it.

### Step 3.2 — Set the root folder (CRITICAL)

**This is what makes the new project different from the portal.**

1. Before clicking Deploy, look for **Root Directory**.
2. Click **Edit** next to it.
3. Type: `campaigns/jake-sebok-marketing-website`
4. This tells Vercel: "Build the *marketing website* from this folder, not the portal." Your portal project uses a different root (something like `campaigns/aligned-power-vapi/output-assets`).

### Step 3.3 — Deploy

1. Click **Deploy**.
2. Wait 1–2 minutes. Vercel is building your site on their computers.
3. When it's done, you'll get a URL like `jake-sebok-marketing-xyz.vercel.app`. That's your marketing site! You can click it to see it live. **The portal is unchanged**—it's still at portal.alignedpower.coach.

---

## Part 4: Connect Your Domain (jakesebok.com)

Right now your marketing site is at a Vercel URL (e.g., jake-sebok-marketing-xyz.vercel.app). You want it at **jakesebok.com**.

**Make sure you're in the right Vercel project:** Click your project name at the top. You should be in the *new* marketing website project (the one you just created), not the portal project.

### Step 4.1 — Add the domain in Vercel

1. In your **marketing website** Vercel project, click **Settings** (top menu).
2. Click **Domains** in the left sidebar.
3. Click **Add**.
4. Type: `jakesebok.com`
5. Click **Add**.
6. Vercel will show you instructions and a set of **DNS records**. Keep this page open.

### Step 4.2 — Update DNS where jakesebok.com is registered

**Where did you buy jakesebok.com?** Common places: GoDaddy, Namecheap, Google Domains, Cloudflare, or your web host.

1. Log in to wherever you manage jakesebok.com.
2. Find the **DNS** or **Domain Management** or **Nameservers** section.
3. Add the records Vercel told you to add. They usually look like:
   - **Type:** A | **Name:** @ | **Value:** 76.76.21.21
   - **Type:** CNAME | **Name:** www | **Value:** cname.vercel-dns.com
4. Save your changes.
5. Wait 5–60 minutes (sometimes up to 48 hours) for the internet to update.
6. In Vercel → Domains, you should eventually see a green checkmark next to jakesebok.com.
7. Visit **https://jakesebok.com** — your marketing site should load!

---

## Part 5: Making Updates Later

When you want to change text, images, or anything on the site:

1. Edit the files in Cursor (or your editor).
2. Open GitHub Desktop.
3. It will show your changes.
4. Type a message (e.g., "Updated homepage headline").
5. Click **Commit to main**.
6. Click **Push origin**.
7. Vercel will automatically rebuild and update your site in 1–2 minutes. No need to do anything else.

---

## Quick Checklist

- [ ] Formspree account created
- [ ] Two forms created (Contact + Accelerator Application)
- [ ] Form IDs put into `contact/page.tsx` and `work-with-me/page.tsx`
- [ ] Marketing site files pushed to GitHub (same repo as portal)
- [ ] **Second** Vercel project created (don't replace the portal project!)
- [ ] Root Directory set to `campaigns/jake-sebok-marketing-website`
- [ ] Domain jakesebok.com added to the **marketing** Vercel project
- [ ] DNS records updated where jakesebok.com is registered
- [ ] Site loads at https://jakesebok.com
- [ ] Portal still works at https://portal.alignedpower.coach

---

## If You Get Stuck

- **"I don't see Root Directory"** — Scroll down on the Vercel import screen. It's under "Configure Project."
- **"My forms don't send emails"** — Double-check you replaced BOTH `YOUR_FORM_ID` placeholders with your real Formspree IDs.
- **"The domain doesn't work"** — DNS can take up to 48 hours. Make sure you added the exact records Vercel showed you.
- **"I've never used GitHub"** — Use Option B and GitHub Desktop. You can do the whole thing without typing any commands.

You can always come back and ask for help with any specific step.
