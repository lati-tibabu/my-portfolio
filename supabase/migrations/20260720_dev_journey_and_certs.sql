-- Development journey: project cards shown on the home + about pages.
-- links is a jsonb array of {label,url} objects (0..N) so an item can expose
-- more than one link (e.g. "Backend" + "Frontend"). Ordered by sort_order asc.
create table if not exists public.dev_journey_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  links jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint dev_journey_items_title_not_blank check (btrim(title) <> ''),
  constraint dev_journey_items_description_not_blank check (btrim(description) <> '')
);

create index if not exists dev_journey_items_sort_idx
  on public.dev_journey_items (sort_order asc, created_at asc);

alter table public.dev_journey_items enable row level security;

drop policy if exists "Public can read dev journey items" on public.dev_journey_items;
create policy "Public can read dev journey items"
on public.dev_journey_items
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert dev journey items" on public.dev_journey_items;
create policy "Authenticated can insert dev journey items"
on public.dev_journey_items
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update dev journey items" on public.dev_journey_items;
create policy "Authenticated can update dev journey items"
on public.dev_journey_items
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete dev journey items" on public.dev_journey_items;
create policy "Authenticated can delete dev journey items"
on public.dev_journey_items
for delete
to authenticated
using (true);

-- Certifications: credential list shown on the home + about pages.
-- Only title is required; issuer/url/issued_at are optional enrichments.
-- Ordered by sort_order asc.
create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text,
  url text,
  issued_at date,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint certifications_title_not_blank check (btrim(title) <> '')
);

create index if not exists certifications_sort_idx
  on public.certifications (sort_order asc, created_at asc);

alter table public.certifications enable row level security;

drop policy if exists "Public can read certifications" on public.certifications;
create policy "Public can read certifications"
on public.certifications
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert certifications" on public.certifications;
create policy "Authenticated can insert certifications"
on public.certifications
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update certifications" on public.certifications;
create policy "Authenticated can update certifications"
on public.certifications
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete certifications" on public.certifications;
create policy "Authenticated can delete certifications"
on public.certifications
for delete
to authenticated
using (true);