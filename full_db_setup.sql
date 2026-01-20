-- 1. Create Profiles Table
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  is_premium boolean default false,
  usage_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Scripts Table
create table if not exists scripts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  platform text not null,
  tone text,
  content text not null,
  language text DEFAULT 'English',
  length text,
  custom_length text,
  scheduled_date timestamp with time zone,
  is_starred boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable RLS
alter table profiles enable row level security;
alter table scripts enable row level security;

-- 4. Create Policies (Drop existing to avoid conflicts)
drop policy if exists "Users can view own profile" on profiles;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on profiles;
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

drop policy if exists "Users can view own scripts" on scripts;
create policy "Users can view own scripts" on scripts for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own scripts" on scripts;
create policy "Users can insert own scripts" on scripts for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own scripts" on scripts;
create policy "Users can update own scripts" on scripts for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own scripts" on scripts;
create policy "Users can delete own scripts" on scripts for delete using (auth.uid() = user_id);

-- 5. User Creation Trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Add columns if table already existed (Safety check)
alter table public.scripts add column if not exists scheduled_date timestamp with time zone;
alter table public.scripts add column if not exists custom_length text;
alter table public.scripts add column if not exists language text;
alter table public.scripts add column if not exists length text;
alter table public.scripts add column if not exists is_starred boolean default false;
