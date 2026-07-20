-- Hero (home page header) content singleton.
-- One row; the admin upserts against the fixed singleton id below.
create table if not exists public.hero_content (
  id uuid primary key default gen_random_uuid(),
  eyebrow text not null,
  headline text not null,
  body_md text not null,
  cta1_label text,
  cta1_href text,
  cta2_label text,
  cta2_href text,
  cta3_label text,
  cta3_href text,
  image_enabled boolean not null default true,
  image_url text,
  image_path text,
  image_alt text,
  layout text not null default 'text-left-image-right'
    check (layout in ('text-left-image-right', 'image-left-text-right', 'centered')),
  availability_label text,
  availability_value text,
  updated_at timestamptz not null default now(),
  constraint hero_content_headline_not_blank check (btrim(headline) <> '')
);

alter table public.hero_content enable row level security;

drop policy if exists "Public can read hero content" on public.hero_content;
create policy "Public can read hero content"
on public.hero_content
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert hero content" on public.hero_content;
create policy "Authenticated can insert hero content"
on public.hero_content
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update hero content" on public.hero_content;
create policy "Authenticated can update hero content"
on public.hero_content
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete hero content" on public.hero_content;
create policy "Authenticated can delete hero content"
on public.hero_content
for delete
to authenticated
using (true);