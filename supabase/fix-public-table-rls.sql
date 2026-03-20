-- Lock down Alfred-private public tables that should not be exposed via PostgREST.
-- Safe to run in Supabase SQL Editor.
--
-- Why this works:
-- - The Alfred app uses DATABASE_URL / server-side credentials for these tables.
-- - Enabling RLS prevents anon/authenticated PostgREST access.
-- - The deny policies satisfy the Supabase linter and make the intent explicit.

begin;

alter table public.api_usage_logs enable row level security;
alter table public.weekly_one_things enable row level security;
alter table public.onboarding_progress enable row level security;
alter table public.scorecard_entries enable row level security;
alter table public.users enable row level security;
alter table public.context_documents enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'api_usage_logs'
      and policyname = 'deny_anon_auth'
  ) then
    create policy "deny_anon_auth"
      on public.api_usage_logs
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'weekly_one_things'
      and policyname = 'deny_anon_auth'
  ) then
    create policy "deny_anon_auth"
      on public.weekly_one_things
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'onboarding_progress'
      and policyname = 'deny_anon_auth'
  ) then
    create policy "deny_anon_auth"
      on public.onboarding_progress
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'scorecard_entries'
      and policyname = 'deny_anon_auth'
  ) then
    create policy "deny_anon_auth"
      on public.scorecard_entries
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'deny_anon_auth'
  ) then
    create policy "deny_anon_auth"
      on public.users
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'context_documents'
      and policyname = 'deny_anon_auth'
  ) then
    create policy "deny_anon_auth"
      on public.context_documents
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'conversations'
      and policyname = 'deny_anon_auth'
  ) then
    create policy "deny_anon_auth"
      on public.conversations
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'messages'
      and policyname = 'deny_anon_auth'
  ) then
    create policy "deny_anon_auth"
      on public.messages
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end
$$;

commit;
