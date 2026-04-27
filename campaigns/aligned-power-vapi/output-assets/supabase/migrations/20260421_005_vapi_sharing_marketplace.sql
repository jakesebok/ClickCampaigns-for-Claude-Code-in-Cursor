-- Wave 1: Shareable results, referral attribution, peer marketplace (forward-compatible)
-- Additive only.
-- Applied to Supabase project zhlmfqjtthrkcsbfwnpo on 2026-04-22.

create table if not exists public.vapi_shareable_results (
  hash text primary key,
  email text not null,
  vapi_result_id uuid not null references public.vapi_results(id) on delete cascade,
  archetype_label text not null,
  primary_driver_label text,
  created_at timestamptz not null default now(),
  view_count int not null default 0,
  expires_at timestamptz
);
create index if not exists vapi_shareable_results_email_idx
  on public.vapi_shareable_results(email, created_at desc);

create table if not exists public.vapi_referral_attributions (
  id uuid primary key default gen_random_uuid(),
  referrer_email text not null,
  invitee_email text,
  invite_code text not null,
  clicked_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz not null default now()
);
create unique index if not exists vapi_referral_invite_code_idx
  on public.vapi_referral_attributions(invite_code);
create index if not exists vapi_referral_referrer_idx
  on public.vapi_referral_attributions(referrer_email, created_at desc);

create table if not exists public.vapi_peer_marketplace_coaches (
  id uuid primary key default gen_random_uuid(),
  coach_email text not null unique,
  display_name text not null,
  headline text,
  bio text,
  specialties text[] not null default '{}',
  domains text[] not null default '{}',
  profile_url text,
  photo_url text,
  approved boolean not null default false,
  active boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists vapi_peer_marketplace_active_idx
  on public.vapi_peer_marketplace_coaches(active) where active = true;
