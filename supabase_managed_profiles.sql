-- Managed profiles allow a user to track family members, partners, or close friends.
create table if not exists public.managed_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  relationship text,
  avatar_color text default '#814837',
  notes text,
  created_at timestamptz not null default now()
);

alter table public.managed_profiles enable row level security;

create policy "Managed profiles are viewable by owner"
  on public.managed_profiles
  for select
  using (auth.uid() = owner_id);

create policy "Managed profiles can be inserted by owner"
  on public.managed_profiles
  for insert
  with check (auth.uid() = owner_id);

create policy "Managed profiles can be updated by owner"
  on public.managed_profiles
  for update
  using (auth.uid() = owner_id);

create policy "Managed profiles can be deleted by owner"
  on public.managed_profiles
  for delete
  using (auth.uid() = owner_id);

alter table if exists public.journal_entries
  add column if not exists managed_profile_id uuid references public.managed_profiles(id) on delete set null;

