-- Client testimonials: optional photo, name, optional role, markdown comment.
-- Ordered by created_at desc on read; admin-managed via CMS.
create table if not exists public.client_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  photo_url text,
  photo_path text,
  quote_md text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint client_testimonials_name_not_blank check (btrim(name) <> ''),
  constraint client_testimonials_quote_not_blank check (btrim(quote_md) <> '')
);

alter table public.client_testimonials enable row level security;

drop policy if exists "Public can read published testimonials" on public.client_testimonials;
create policy "Public can read published testimonials"
on public.client_testimonials
for select
to anon
using (is_published = true);

drop policy if exists "Authenticated can read testimonials" on public.client_testimonials;
create policy "Authenticated can read testimonials"
on public.client_testimonials
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert testimonials" on public.client_testimonials;
create policy "Authenticated can insert testimonials"
on public.client_testimonials
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update testimonials" on public.client_testimonials;
create policy "Authenticated can update testimonials"
on public.client_testimonials
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete testimonials" on public.client_testimonials;
create policy "Authenticated can delete testimonials"
on public.client_testimonials
for delete
to authenticated
using (true);