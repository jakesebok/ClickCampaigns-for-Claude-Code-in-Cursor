# Get your VAPI assessment + portal live (no coding required)

You’ll do **4 main things**: set up Supabase (database + auth), put your project on GitHub, connect it to Vercel, and add your Supabase keys in Vercel. Everything is done in the browser or with simple copy-paste.

---

## Part 1: Supabase (where results and logins are stored)

### 1.1 Create a Supabase account and project

1. Open **https://supabase.com** in your browser.
2. Click **Start your project** (or **Sign in** if you already have an account).
3. Sign in with **GitHub** (easiest since you already have GitHub).
4. After sign-in, click **New project**.
5. Fill in:
   - **Name**: e.g. `aligned-power` (anything you like).
   - **Database password**: invent a strong password and **save it somewhere safe** (you need it for the database).
   - **Region**: pick one close to you.
6. Click **Create new project** and wait 1–2 minutes until it says the project is ready.

### 1.2 Create the table and security rules (run the SQL)

1. In the left sidebar, click **SQL Editor**.
2. Click **New query**.
3. Open the file **schema** in this project:  
   In your project folder, go to **supabase** → open **schema.sql** (it’s in the main project, not inside the campaign folder).  
   Select **all** the text in that file and **copy** it.
4. Paste that entire text into the Supabase SQL Editor (the big empty box).
5. Click **Run** (or the green “Run” button at the bottom right).
6. You should see a message that the query ran successfully. That created the table and rules for saving assessment results and for the portal.

**Optional — Admin portal:** If you use the coach/admin area to view any respondent’s results, run the SQL in **supabase/admin-policy.sql** the same way (New query → paste file → Run). That allows the admin user (jacob@alignedpower.coach) to see all assessment results.

### 1.3 Get your Project URL and API key

You need two values for Vercel later: **Project URL** and a **public API key** (either the Publishable key or the Legacy anon key—both work).

**Project URL**

- With your project open in the Supabase dashboard, look at the **address bar** in your browser. The URL looks like:  
  `https://supabase.com/dashboard/project/xxxxxxxxxx/...`  
  The part after `/project/` (e.g. `xxxxxxxxxx`) is your **project reference**.
- Your **Project URL** is:  
  **`https://xxxxxxxxxx.supabase.co`**  
  (Replace `xxxxxxxxxx` with your actual project reference. No slash at the end.)
- Copy that URL and keep it somewhere handy (e.g. a Notes app).

**API key (for Vercel's SUPABASE_ANON_KEY)**

1. In the left sidebar, click the **gear icon** (⚙️) at the bottom to open **Project settings**.
2. Click **API Keys** in the left menu.
3. Use **one** of these (either is fine):
   - **Publishable and secret API keys** tab → copy the **Publishable key** (starts with `sb_publishable_...`), or  
   - **Legacy anon, service_role API keys** tab → copy the **Legacy ANON** key (a long JWT string).
4. Copy that key and keep it handy. You will paste it into Vercel as **SUPABASE_ANON_KEY** in Part 3.

**Do not** use a Secret key or the service_role key—those are for backend-only use. The Publishable key or Legacy anon key is the correct one for the portal and for saving results from the browser.

---

## Part 2: Put your project on GitHub

You need your project (the code) in a GitHub repository so Vercel can use it.

### Option A: You already have this project in a GitHub repo

- If someone already created a repo and you have it (e.g. you cloned it or have the folder from GitHub), skip to **Part 3**.

### Option B: You have the project only on your computer

1. Go to **https://github.com** and sign in.
2. Click the **+** in the top right → **New repository**.
3. **Repository name**: e.g. `aligned-power-vapi` (or any name you like).
4. Leave **Public** selected. Do **not** check “Add a README” (you already have files).
5. Click **Create repository**.
6. GitHub will show a page with “…or push an existing repository from the command line.” You’ll use that in a moment.
7. On your computer, open **Terminal** (Mac) or **Command Prompt** (Windows):
   - **Mac**: Spotlight (Cmd+Space), type **Terminal**, press Enter.
   - **Windows**: Start menu → type **cmd** or **Command Prompt**, open it.
8. Go to your project folder. Type this (replace with your real folder path if different):
   ```bash
   cd /Users/jakesebok/Documents/ClickCampaigns-for-Claude-Code-in-Cursor
   ```
   Press Enter.
9. Then run these three commands, **one at a time** (replace `YOUR_USERNAME` and `aligned-power-vapi` with your GitHub username and the repo name you chose in step 3):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/aligned-power-vapi.git
   git push -u origin main
   ```
   When it asks for username/password, use your GitHub username and a **Personal Access Token** (GitHub no longer accepts account password here):
   - GitHub → Settings → Developer settings → Personal access tokens → Generate new token. Give it a name, check **repo**, generate, then copy the token and paste it when the terminal asks for “Password”.

If you’ve never used Git and this feels confusing, you can instead:
- Create the repo on GitHub (steps 1–5 above), then use **GitHub Desktop** (download from github.com) to “Add” your local folder and “Publish repository” to push the code.

---

## Part 3: Deploy on Vercel and add Supabase keys

### 3.1 Import the project into Vercel

1. Go to **https://vercel.com** and sign in (use **Continue with GitHub** if you can).
2. Click **Add New…** → **Project**.
3. You should see your GitHub repo in the list (e.g. `aligned-power-vapi` or `ClickCampaigns-for-Claude-Code-in-Cursor`). Click **Import** next to it.
4. **Important — set the root folder**:
   - Find **Root Directory**. Click **Edit** next to it.
   - Enter exactly: **campaigns/aligned-power-vapi/output-assets**
   - This tells Vercel that the “website” and the **api** folder live inside that folder.
5. **Do not** add any “Build and Output” overrides. Click **Deploy**.
6. Wait for the deployment to finish (usually under a minute). You’ll get a URL like `something.vercel.app`. That’s your live site.

### 3.2 Add your Supabase keys in Vercel

1. On Vercel, open your project (click the project name).
2. Click the **Settings** tab at the top.
3. In the left sidebar, click **Environment Variables**.
4. Add **two** variables (one at a time):

   **First variable**
   - **Name**: `SUPABASE_URL`  
   - **Value**: paste your **Project URL** from Supabase (from Part 1.3).  
   - **Environment**: leave all three checked (Production, Preview, Development).  
   - Click **Save**.

   **Second variable**
   - **Name**: `SUPABASE_ANON_KEY`  
   - **Value**: paste your **Publishable key or Legacy anon** key from Supabase (from Part 1.3).  
   - **Environment**: leave all three checked.  
   - Click **Save**.

5. **Redeploy** so the new keys are used:
   - Go to the **Deployments** tab.
   - Click the **⋯** on the latest deployment → **Redeploy** → **Redeploy** again to confirm.

---

## Part 4: Tell Supabase your live site URL (for portal login and email confirmation)

1. In Supabase, go to **Authentication** (left sidebar) → **URL Configuration**.
2. Set **Site URL** to your portal confirmation page so that “Confirm your mail” links in signup emails send users to a real page instead of a 404:
   - **Site URL**: `https://your-project-name.vercel.app/portal/confirm.html`  
   (Replace `your-project-name` with your real Vercel project URL.)
3. Under **Redirect URLs**, click **Add URL** (if not already there).
4. Add your Vercel URL with a trailing slash and `**` so all portal paths work, e.g.:
   - `https://your-project-name.vercel.app/**`
5. Click **Save**.

---

---
## Troubleshooting: "Portal is not configured" or config errors

If the portal (signup/login) shows a message about config or Supabase:

1. **Check that the config endpoint works**
   Open this URL in your browser (use your real Vercel URL):
   `https://your-project.vercel.app/api/config`
   You should see one line of JavaScript with `window.SUPABASE_URL="https://...";` and a long key.
   - If you get **404**: Vercel is not seeing the `api` folder. Confirm **Root Directory** is exactly **campaigns/aligned-power-vapi/output-assets** (so that `api/config.js` is inside that root). Save and **Redeploy**.
   - If the page loads but **SUPABASE_URL is empty** (`window.SUPABASE_URL="";`): The env vars are not set or were not applied. In Vercel → **Settings** → **Environment Variables**, add **SUPABASE_URL** and **SUPABASE_ANON_KEY** (exact names), save, then go to **Deployments** → **⋯** on latest → **Redeploy**.

2. **Redeploy after any change**
   Changing Root Directory or Environment Variables only affects **new** deployments. Always trigger a **Redeploy** after editing them.

### New VAPI results not being stored (no new rows in database)

If people complete the assessment and enter their email but no new rows appear in Supabase for `vapi_results`:

1. **One-time Supabase fix**: In Supabase → **SQL Editor**, open **supabase/fix-vapi-insert.sql** from this repo, copy its contents, paste into the editor, and click **Run**. That grants the `anon` role permission to insert into `vapi_results` (the RLS policy allows it, but the role also needs the table privilege).
2. **Check the browser console**: After completing the assessment and landing on the results page, open Developer Tools (F12) → **Console**. If the save fails, you’ll see a message like `[VAPI save] Config fetch failed` or `[VAPI save] Insert failed: ...`. That tells you whether the problem is the config endpoint (e.g. 404 or missing env vars) or the database (e.g. permission denied).
3. **Confirm /api/config works**: Open `https://your-project.vercel.app/api/config` in your browser. You should see JavaScript with non-empty `SUPABASE_URL` and `SUPABASE_ANON_KEY`. If either is empty, fix Vercel env vars and redeploy.

### Assessment results not showing in the portal

If someone took the assessment with the same email as their portal account but the dashboard says "No assessments yet":

1. **One-time Supabase fix** (if you set up the project before this fix): In Supabase → **SQL Editor**, open the file **supabase/fix-email-policy.sql** from this repo, copy its contents, paste into the editor, and click **Run**. That makes the portal match results by email in a case-insensitive way so existing and new results show up.
2. **Redeploy** so the results page uses the latest save logic (lowercase email and config loading).
3. **New assessments** will then appear in the portal. For the assessment already taken, the SQL fix in step 1 is what makes it visible.

---
## You’re done

- **Assessment (landing)**: `https://your-project.vercel.app/html/vapi-landing.html`  
- **Portal login**: `https://your-project.vercel.app/portal/login.html`  
- **Portal signup**: `https://your-project.vercel.app/portal/signup.html`  

Share the landing link so people can take the assessment. When they enter their email at the end, that result is saved. If they create a portal account with the **same email** and log in, they’ll see that result (and any future ones) on the dashboard.

---

## Quick checklist

- [ ] Supabase project created  
- [ ] SQL from `supabase/schema.sql` run in Supabase SQL Editor  
- [ ] Project URL and anon key copied from Supabase  
- [ ] Code pushed to a GitHub repo  
- [ ] Vercel project created with Root Directory = `campaigns/aligned-power-vapi/output-assets`  
- [ ] `SUPABASE_URL` and `SUPABASE_ANON_KEY` added in Vercel Environment Variables  
- [ ] Vercel project redeployed after adding env vars  
- [ ] Redirect URL added in Supabase (your Vercel URL + `/**`)  

If something doesn’t work (e.g. “portal not configured”, or results not saving), see **Troubleshooting** above. In short: open `/api/config` on your live URL to see if the API and env vars are working; double-check Root Directory and that you **Redeploy** after changing env vars.
