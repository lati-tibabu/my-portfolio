create extension if not exists "pgcrypto";

create table if not exists public.graphics_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null,
  image_url text not null,
  image_path text,
  published_at date not null default current_date,
  details_html text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketplace_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price text not null,
  category text not null,
  cover_image_url text not null,
  published_at date not null default current_date,
  details_html text not null,
  version text not null,
  license text not null,
  technical_name text not null,
  website text not null,
  compatibility text,
  warning text,
  live_preview text,
  support_url text,
  contact_email text,
  link text not null,
  downloads text,
  upgrade_url text,
  highlights text[] not null default '{}'::text[],
  screenshots text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  cover_image_url text not null,
  published_at date not null default current_date,
  tags text[] not null default '{}'::text[],
  details_html text not null,
  content_format text not null default 'html'
    check (content_format in ('html', 'md')),
  is_draft boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.blog_posts
add column if not exists content_format text not null default 'html';

alter table public.blog_posts
add column if not exists is_draft boolean not null default false;

alter table public.blog_posts
drop constraint if exists blog_posts_content_format_check;

alter table public.blog_posts
add constraint blog_posts_content_format_check
check (content_format in ('html', 'md'));

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update
set public = excluded.public;

alter table public.graphics_items enable row level security;
alter table public.marketplace_items enable row level security;
alter table public.blog_posts enable row level security;

drop policy if exists "Public can read graphics items" on public.graphics_items;
create policy "Public can read graphics items"
on public.graphics_items
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert graphics items" on public.graphics_items;
create policy "Authenticated can insert graphics items"
on public.graphics_items
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update graphics items" on public.graphics_items;
create policy "Authenticated can update graphics items"
on public.graphics_items
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete graphics items" on public.graphics_items;
create policy "Authenticated can delete graphics items"
on public.graphics_items
for delete
to authenticated
using (true);

drop policy if exists "Public can read marketplace items" on public.marketplace_items;
create policy "Public can read marketplace items"
on public.marketplace_items
for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated can insert marketplace items" on public.marketplace_items;
create policy "Authenticated can insert marketplace items"
on public.marketplace_items
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update marketplace items" on public.marketplace_items;
create policy "Authenticated can update marketplace items"
on public.marketplace_items
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete marketplace items" on public.marketplace_items;
create policy "Authenticated can delete marketplace items"
on public.marketplace_items
for delete
to authenticated
using (true);

drop policy if exists "Public can read blog posts" on public.blog_posts;
drop policy if exists "Public can read published blog posts" on public.blog_posts;
create policy "Public can read published blog posts"
on public.blog_posts
for select
to anon
using (is_draft = false);

drop policy if exists "Authenticated can read blog posts" on public.blog_posts;
create policy "Authenticated can read blog posts"
on public.blog_posts
for select
to authenticated
using (true);

drop policy if exists "Authenticated can insert blog posts" on public.blog_posts;
create policy "Authenticated can insert blog posts"
on public.blog_posts
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update blog posts" on public.blog_posts;
create policy "Authenticated can update blog posts"
on public.blog_posts
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete blog posts" on public.blog_posts;
create policy "Authenticated can delete blog posts"
on public.blog_posts
for delete
to authenticated
using (true);

drop policy if exists "Public can read portfolio media" on storage.objects;
create policy "Public can read portfolio media"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated can upload portfolio media" on storage.objects;
create policy "Authenticated can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated can update portfolio media" on storage.objects;
create policy "Authenticated can update portfolio media"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-media')
with check (bucket_id = 'portfolio-media');

drop policy if exists "Authenticated can delete portfolio media" on storage.objects;
create policy "Authenticated can delete portfolio media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-media');
