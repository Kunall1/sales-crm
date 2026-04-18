-- =============================================================
-- Sales CRM Dashboard — Supabase Schema
-- =============================================================
-- Run this entire file in your Supabase SQL Editor (one time).
-- It creates tables, indexes, RLS policies, and seed data.
-- =============================================================

-- 1. PROFILES (extends Supabase auth.users)
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  avatar_url text,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view all profiles"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. LEADS
-- ---------------------------------------------------------
create type lead_stage as enum (
  'new_lead',
  'contacted',
  'qualified',
  'demo_scheduled',
  'proposal_sent',
  'closed_won',
  'closed_lost'
);

create type lead_source as enum (
  'website',
  'referral',
  'linkedin',
  'cold_call',
  'email_campaign',
  'event',
  'partner',
  'other'
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,

  -- Contact info
  first_name text not null,
  last_name text not null default '',
  email text,
  phone text,
  company text,
  job_title text,

  -- Pipeline info
  stage lead_stage not null default 'new_lead',
  source lead_source not null default 'other',
  deal_value numeric(12,2) default 0,
  probability integer default 10 check (probability >= 0 and probability <= 100),
  owner_name text,

  -- Follow-up
  next_action text,
  next_action_date date,

  -- Metadata
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_leads_user on public.leads (user_id);
create index idx_leads_stage on public.leads (stage);
create index idx_leads_next_action on public.leads (next_action_date);

alter table public.leads enable row level security;

create policy "Users can view own leads"
  on public.leads for select using (auth.uid() = user_id);
create policy "Users can insert own leads"
  on public.leads for insert with check (auth.uid() = user_id);
create policy "Users can update own leads"
  on public.leads for update using (auth.uid() = user_id);
create policy "Users can delete own leads"
  on public.leads for delete using (auth.uid() = user_id);


-- 3. NOTES / ACTIVITY TIMELINE
-- ---------------------------------------------------------
create type activity_type as enum (
  'note',
  'call',
  'email',
  'meeting',
  'demo',
  'status_change',
  'deal_update'
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  type activity_type not null default 'note',
  title text not null,
  content text,
  created_at timestamptz not null default now()
);

create index idx_activities_lead on public.activities (lead_id);

alter table public.activities enable row level security;

create policy "Users can view own activities"
  on public.activities for select using (auth.uid() = user_id);
create policy "Users can insert own activities"
  on public.activities for insert with check (auth.uid() = user_id);
create policy "Users can delete own activities"
  on public.activities for delete using (auth.uid() = user_id);


-- 4. FOLLOW-UPS / REMINDERS
-- ---------------------------------------------------------
create table if not exists public.followups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  due_date timestamptz not null,
  is_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_followups_user on public.followups (user_id);
create index idx_followups_due on public.followups (due_date);

alter table public.followups enable row level security;

create policy "Users can view own followups"
  on public.followups for select using (auth.uid() = user_id);
create policy "Users can insert own followups"
  on public.followups for insert with check (auth.uid() = user_id);
create policy "Users can update own followups"
  on public.followups for update using (auth.uid() = user_id);
create policy "Users can delete own followups"
  on public.followups for delete using (auth.uid() = user_id);


-- 5. HELPER: auto-update updated_at
-- ---------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
