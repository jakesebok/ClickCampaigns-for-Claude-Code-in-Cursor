# Supabase setup for VAPI user portal

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in or create an account.
2. Click **New project**, choose your org, name the project (e.g. `aligned-power`), set a database password, and create the project.
3. Wait for the project to finish provisioning.

## 2. Run the schema

1. In the Supabase dashboard, open **SQL Editor**.
2. Copy the contents of `schema.sql` in this folder and paste into a new query.
3. Click **Run**. You should see success for the table and policies.

## 3. Get your API keys

1. In the dashboard, go to **Project settings** (gear) → **API**.
2. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **anon public** key (safe to use in the browser; RLS protects data)

## 4. Configure the campaign

1. In the campaign folder, go to `campaigns/aligned-power-vapi/output-assets/`.
2. Copy `supabase-config.example.js` to `supabase-config.js`.
3. Edit `supabase-config.js` and set:
   - `SUPABASE_URL` = your Project URL
   - `SUPABASE_ANON_KEY` = your anon public key

Do not commit `supabase-config.js` to git (it’s in `.gitignore`). Use `supabase-config.example.js` as a template for other environments.

## 5. Enable Email auth (for portal login)

1. In Supabase dashboard go to **Authentication** → **Providers**.
2. Ensure **Email** is enabled (default).
3. Optional: enable **Confirm email** if you want users to verify before first login.

After this, the assessment can save results to Supabase and the portal can use email/password (or magic link) sign-in and show results by email.
