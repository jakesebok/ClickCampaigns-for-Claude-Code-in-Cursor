-- One-time: run in Supabase SQL Editor.
-- Allows the results page to check if an email already has a portal account,
-- so we can send users to "Log in" vs "Create account" accordingly.

create or replace function public.check_portal_email_exists(check_email text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where lower(trim(email)) = lower(trim(check_email))
  );
$$;

comment on function public.check_portal_email_exists(text) is 'Returns true if a portal (auth) user exists for the given email; used by results page to route to login vs signup.';

-- Allow anonymous callers (results page) to invoke this.
grant execute on function public.check_portal_email_exists(text) to anon;
