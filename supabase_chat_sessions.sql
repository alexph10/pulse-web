-- Stores conversational history for the AI chat drawer.
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_chat_session_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists chat_sessions_set_updated_at on public.chat_sessions;
create trigger chat_sessions_set_updated_at
  before update on public.chat_sessions
  for each row
  execute procedure public.set_chat_session_updated_at();

alter table public.chat_sessions enable row level security;

create policy "Chat sessions are viewable by owner"
  on public.chat_sessions
  for select
  using (auth.uid() = user_id);

create policy "Chat sessions can be inserted by owner"
  on public.chat_sessions
  for insert
  with check (auth.uid() = user_id);

create policy "Chat sessions can be updated by owner"
  on public.chat_sessions
  for update
  using (auth.uid() = user_id);

create policy "Chat sessions can be deleted by owner"
  on public.chat_sessions
  for delete
  using (auth.uid() = user_id);

