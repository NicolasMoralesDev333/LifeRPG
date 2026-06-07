-- LifeRPG Supabase schema
-- Run this in the Supabase SQL Editor, or apply it with the Supabase CLI.

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.life_rpg_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  level integer not null default 1 check (level >= 1),
  xp integer not null default 0 check (xp >= 0),
  xp_needed integer not null default 100 check (xp_needed > 0),
  cyber_credits integer not null default 120 check (cyber_credits >= 0),
  stats jsonb not null default '{"str":10,"int":10,"vit":10,"cha":10,"agi":10}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.life_rpg_habits (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null check (length(trim(label)) > 0),
  stat text not null check (stat in ('str', 'int', 'vit', 'cha', 'agi')),
  xp integer not null default 20 check (xp >= 0),
  credits integer not null default 10 check (credits >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.life_rpg_rewards (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  cost integer not null check (cost > 0),
  icon text not null default 'gift',
  created_at timestamptz not null default now()
);

create table if not exists public.life_rpg_bosses (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  total_hp integer not null check (total_hp > 0),
  current_hp integer not null check (current_hp >= 0),
  reward_xp integer not null default 0 check (reward_xp >= 0),
  reward_credits integer not null default 0 check (reward_credits >= 0),
  icon text not null default 'skull',
  is_defeated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.life_rpg_boss_subtasks (
  id text primary key,
  boss_id text not null references public.life_rpg_bosses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  damage integer not null check (damage > 0),
  credits integer not null default 0 check (credits >= 0),
  is_completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.life_rpg_activity_logs (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_date date not null default current_date,
  type text not null default 'habit',
  label text not null default 'Actividad',
  value integer not null default 1 check (value > 0),
  created_at timestamptz not null default now()
);

create index if not exists life_rpg_habits_user_created_idx
  on public.life_rpg_habits(user_id, created_at);

create index if not exists life_rpg_rewards_user_created_idx
  on public.life_rpg_rewards(user_id, created_at);

create index if not exists life_rpg_bosses_user_created_idx
  on public.life_rpg_bosses(user_id, created_at);

create index if not exists life_rpg_boss_subtasks_boss_position_idx
  on public.life_rpg_boss_subtasks(boss_id, position);

create index if not exists life_rpg_activity_logs_user_date_idx
  on public.life_rpg_activity_logs(user_id, activity_date);

drop trigger if exists set_life_rpg_profiles_updated_at on public.life_rpg_profiles;
create trigger set_life_rpg_profiles_updated_at
before update on public.life_rpg_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_life_rpg_bosses_updated_at on public.life_rpg_bosses;
create trigger set_life_rpg_bosses_updated_at
before update on public.life_rpg_bosses
for each row execute function public.set_updated_at();

drop trigger if exists set_life_rpg_boss_subtasks_updated_at on public.life_rpg_boss_subtasks;
create trigger set_life_rpg_boss_subtasks_updated_at
before update on public.life_rpg_boss_subtasks
for each row execute function public.set_updated_at();

alter table public.life_rpg_profiles enable row level security;
alter table public.life_rpg_habits enable row level security;
alter table public.life_rpg_rewards enable row level security;
alter table public.life_rpg_bosses enable row level security;
alter table public.life_rpg_boss_subtasks enable row level security;
alter table public.life_rpg_activity_logs enable row level security;

drop policy if exists "Users can read own profile" on public.life_rpg_profiles;
create policy "Users can read own profile"
on public.life_rpg_profiles for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile" on public.life_rpg_profiles;
create policy "Users can insert own profile"
on public.life_rpg_profiles for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own profile" on public.life_rpg_profiles;
create policy "Users can update own profile"
on public.life_rpg_profiles for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own profile" on public.life_rpg_profiles;
create policy "Users can delete own profile"
on public.life_rpg_profiles for delete
using (auth.uid() = user_id);

drop policy if exists "Users can manage own habits" on public.life_rpg_habits;
create policy "Users can manage own habits"
on public.life_rpg_habits for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own rewards" on public.life_rpg_rewards;
create policy "Users can manage own rewards"
on public.life_rpg_rewards for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own bosses" on public.life_rpg_bosses;
create policy "Users can manage own bosses"
on public.life_rpg_bosses for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own boss subtasks" on public.life_rpg_boss_subtasks;
create policy "Users can manage own boss subtasks"
on public.life_rpg_boss_subtasks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can manage own activity logs" on public.life_rpg_activity_logs;
create policy "Users can manage own activity logs"
on public.life_rpg_activity_logs for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
