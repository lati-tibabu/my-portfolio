create extension if not exists "pgcrypto";

create table if not exists public.graphics_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null,
  image_url text not null default 'https://placehold.co/600x400@2x.png',
  image_path text,
  published_at date not null default current_date,
  details_html text not null,
  author_name text not null default 'latitibabu',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.graphics_items
drop constraint if exists graphics_items_image_url_not_blank;

alter table public.graphics_items
alter column image_url set default 'https://placehold.co/600x400@2x.png';

update public.graphics_items
set image_url = 'https://placehold.co/600x400@2x.png'
where btrim(image_url) = '';

alter table public.graphics_items
add constraint graphics_items_image_url_not_blank
check (btrim(image_url) <> '');

create table if not exists public.marketplace_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price text not null,
  category text not null,
  cover_image_url text not null default 'https://placehold.co/600x400@2x.png',
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
  author_name text not null default 'latitibabu',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketplace_items
drop constraint if exists marketplace_items_cover_image_url_not_blank;

alter table public.marketplace_items
alter column cover_image_url set default 'https://placehold.co/600x400@2x.png';

update public.marketplace_items
set cover_image_url = 'https://placehold.co/600x400@2x.png'
where btrim(cover_image_url) = '';

alter table public.marketplace_items
add constraint marketplace_items_cover_image_url_not_blank
check (btrim(cover_image_url) <> '');

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  cover_image_url text not null default 'https://placehold.co/600x400@2x.png',
  published_at date not null default current_date,
  tags text[] not null default '{}'::text[],
  details_html text not null,
  content_format text not null default 'html'
    check (content_format in ('html', 'md')),
  is_draft boolean not null default false,
  author_name text not null default 'latitibabu',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  blog_post_id uuid not null references public.blog_posts(id) on delete cascade,
  name text not null default 'Anonymous',
  body text not null,
  is_approved boolean not null default true,
  created_at timestamptz not null default now(),
  constraint blog_comments_name_length check (char_length(name) between 1 and 80),
  constraint blog_comments_body_length check (char_length(body) between 1 and 2000)
);

create index if not exists blog_comments_post_created_idx
  on public.blog_comments (blog_post_id, created_at desc);

alter table public.blog_posts
drop constraint if exists blog_posts_cover_image_url_not_blank;

alter table public.blog_posts
alter column cover_image_url set default 'https://placehold.co/600x400@2x.png';

update public.blog_posts
set cover_image_url = 'https://placehold.co/600x400@2x.png'
where btrim(cover_image_url) = '';

alter table public.blog_posts
add constraint blog_posts_cover_image_url_not_blank
check (btrim(cover_image_url) <> '');

alter table public.blog_posts
add column if not exists content_format text not null default 'html';

alter table public.blog_posts
add column if not exists is_draft boolean not null default false;

alter table public.blog_posts
drop constraint if exists blog_posts_content_format_check;

alter table public.blog_posts
add constraint blog_posts_content_format_check
check (content_format in ('html', 'md'));

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

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do update
set public = excluded.public;

alter table public.graphics_items enable row level security;
alter table public.marketplace_items enable row level security;
alter table public.blog_posts enable row level security;
alter table public.blog_comments enable row level security;
alter table public.client_testimonials enable row level security;
alter table public.hero_content enable row level security;

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

drop policy if exists "Public can read approved blog comments" on public.blog_comments;
create policy "Public can read approved blog comments"
on public.blog_comments
for select
to anon, authenticated
using (is_approved = true);

drop policy if exists "Anonymous can add blog comments" on public.blog_comments;
create policy "Anonymous can add blog comments"
on public.blog_comments
for insert
to anon, authenticated
with check (is_approved = true);

drop policy if exists "Authenticated can moderate blog comments" on public.blog_comments;
create policy "Authenticated can moderate blog comments"
on public.blog_comments
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete blog comments" on public.blog_comments;
create policy "Authenticated can delete blog comments"
on public.blog_comments
for delete
to authenticated
using (true);

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
