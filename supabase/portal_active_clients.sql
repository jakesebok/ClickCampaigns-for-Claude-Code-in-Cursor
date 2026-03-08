-- portal_active_clients: tracks which users are "active clients" (coach dashboard, 6C scorecard access).
-- Run this in Supabase SQL Editor if the table is missing or was reset.

-- Create table
create table if not exists public.portal_active_clients (
  email text primary key,
  active_client boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Ensure updated_at trigger (optional: auto-update on row change)
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists portal_active_clients_updated_at on public.portal_active_clients;
create trigger portal_active_clients_updated_at
  before update on public.portal_active_clients
  for each row execute function public.set_updated_at();

-- RLS: enable (service_role bypasses RLS; anon/authenticated need policies for client-side reads)
alter table public.portal_active_clients enable row level security;

-- Policy: users can read their own row (for dashboard, six-c-scorecard, settings)
drop policy if exists "Users can read own active status" on public.portal_active_clients;
create policy "Users can read own active status"
  on public.portal_active_clients for select
  to authenticated
  using (lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', ''))));

drop policy if exists "Anon can read own active status" on public.portal_active_clients;
create policy "Anon can read own active status"
  on public.portal_active_clients for select
  to anon
  using (
    auth.uid() is not null
    and lower(trim(email)) = lower(trim(coalesce(auth.jwt() ->> 'email', '')))
  );

-- Grant: authenticated and anon can SELECT (for portal pages)
grant select on public.portal_active_clients to authenticated;
grant select on public.portal_active_clients to anon;

-- Service role has full access by default (used by /api/admin-set-active-client, /api/coach-clients, etc.)

comment on table public.portal_active_clients is 'Tracks which users are active clients (coach dashboard, 6C scorecard). Admin toggles via /api/admin-set-active-client.';
