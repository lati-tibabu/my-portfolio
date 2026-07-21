-- Stats cards shown on the home page. Ordered by sort_order ascending.
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stats_label_not_blank check (btrim(label) <> ''),
  constraint stats_value_not_blank check (btrim(value) <> '')
);

create index if not exists stats_sort_idx
  on public.stats (sort_order asc, created_at asc);

alter table public.stats enable row level security;

drop policy if exists "Public can read stats" on public.stats;
create policy "Public can read stats"
on public.stats
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert stats" on public.stats;
create policy "Authenticated can insert stats"
on public.stats
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update stats" on public.stats;
create policy "Authenticated can update stats"
on public.stats
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete stats" on public.stats;
create policy "Authenticated can delete stats"
on public.stats
for delete
to authenticated
using (true);
