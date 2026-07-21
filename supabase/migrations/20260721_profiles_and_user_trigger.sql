-- Profiles extend auth.users with a display name and role for the admin CMS.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  role text not null default 'admin'
    check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_display_name_not_blank check (btrim(display_name) <> '')
);

alter table public.profiles enable row level security;

drop policy if exists "Authenticated can read all profiles" on public.profiles;
create policy "Authenticated can read all profiles"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert own profile" on public.profiles;
create policy "Authenticated can insert own profile"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Authenticated can update own profile" on public.profiles;
create policy "Authenticated can update own profile"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- Auto-create a profile row whenever a new auth.user is created.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(new.email, '@', 1)
    ),
    'admin'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
