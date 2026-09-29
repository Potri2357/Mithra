-- Migration: Create chat_sessions table linked to authenticated Supabase user
-- Each user's chats are strictly isolated via Row Level Security (RLS).

-- 1. Create table
create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Consultation',
  project_id text,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Indexes for fast query performance
create index if not exists idx_chat_sessions_user_id on public.chat_sessions(user_id);
create index if not exists idx_chat_sessions_updated_at on public.chat_sessions(updated_at desc);

-- 3. Enable Row Level Security (RLS)
alter table public.chat_sessions enable row level security;

-- 4. Clean up any existing policies
drop policy if exists "Users can view their own chat sessions" on public.chat_sessions;
drop policy if exists "Users can insert their own chat sessions" on public.chat_sessions;
drop policy if exists "Users can update their own chat sessions" on public.chat_sessions;
drop policy if exists "Users can delete their own chat sessions" on public.chat_sessions;

-- 5. RLS Policies (Strict account isolation using auth.uid())
create policy "Users can view their own chat sessions"
  on public.chat_sessions
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own chat sessions"
  on public.chat_sessions
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own chat sessions"
  on public.chat_sessions
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own chat sessions"
  on public.chat_sessions
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- 6. Auto-update timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_chat_sessions_updated_at on public.chat_sessions;
create trigger trigger_chat_sessions_updated_at
  before update on public.chat_sessions
  for each row
  execute function public.handle_updated_at();
