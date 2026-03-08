# Aligned Performance Portal

Client login area to view VAPI™ assessment results and history.

## Pages

- **login.html** – Log in with email + password
- **signup.html** – Create an account (use the same email as when taking the assessment)
- **dashboard.html** – View latest result and full history; "View" opens the full results page

## How it works

1. When someone completes the assessment and enters their email, that result is saved to Supabase and linked by email.
2. If they have a portal account with the **same email**, they can log in and see all assessments submitted with that email.
3. They can open any past result from the dashboard (it loads that result and redirects to the full results view).

## Setup

1. Complete Supabase setup (see project root `supabase/README.md`).
2. Copy `../supabase-config.example.js` to `../supabase-config.js` and add your Supabase URL and anon key.
3. Open **login** or **signup** in the browser (or deploy the whole `output-assets` folder and use your base URL + `/login` or `/signup`).

## URLs (clean paths via vercel.json rewrites)

- Assessment: `/assessment`
- Login: `/login`
- Signup: `/signup`
- Dashboard: `/dashboard`
- Settings: `/settings`
- 6C Scorecard: `/scorecard`
- Coach: `/coach`
- Admin: `/admin`
