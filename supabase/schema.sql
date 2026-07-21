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

-- Helper: true for authenticated admins or service_role requests.
create or replace function public.is_admin_or_service_role()
returns boolean as $$
declare
  jwt_role text;
begin
  jwt_role := current_setting('request.jwt.claims', true)::jsonb->>'role';
  if jwt_role = 'service_role' then
    return true;
  end if;
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql stable security definer;

-- Prevent editors from escalating their own role.
create or replace function public.prevent_role_self_escalation()
returns trigger as $$
begin
  if new.role <> old.role and not public.is_admin_or_service_role() then
    raise exception 'Only admins can change roles.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists prevent_role_self_escalation on public.profiles;
create trigger prevent_role_self_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

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
alter table public.dev_journey_items enable row level security;
alter table public.certifications enable row level security;
alter table public.stats enable row level security;
alter table public.profiles enable row level security;

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
with check (public.is_admin_or_service_role());

drop policy if exists "Authenticated can update hero content" on public.hero_content;
create policy "Authenticated can update hero content"
on public.hero_content
for update
to authenticated
using (public.is_admin_or_service_role())
with check (public.is_admin_or_service_role());

drop policy if exists "Authenticated can delete hero content" on public.hero_content;
create policy "Authenticated can delete hero content"
on public.hero_content
for delete
to authenticated
using (public.is_admin_or_service_role());

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
with check (public.is_admin_or_service_role());

drop policy if exists "Authenticated can update dev journey items" on public.dev_journey_items;
create policy "Authenticated can update dev journey items"
on public.dev_journey_items
for update
to authenticated
using (public.is_admin_or_service_role())
with check (public.is_admin_or_service_role());

drop policy if exists "Authenticated can delete dev journey items" on public.dev_journey_items;
create policy "Authenticated can delete dev journey items"
on public.dev_journey_items
for delete
to authenticated
using (public.is_admin_or_service_role());

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
with check (public.is_admin_or_service_role());

drop policy if exists "Authenticated can update certifications" on public.certifications;
create policy "Authenticated can update certifications"
on public.certifications
for update
to authenticated
using (public.is_admin_or_service_role())
with check (public.is_admin_or_service_role());

drop policy if exists "Authenticated can delete certifications" on public.certifications;
create policy "Authenticated can delete certifications"
on public.certifications
for delete
to authenticated
using (public.is_admin_or_service_role());

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
with check (public.is_admin_or_service_role());

drop policy if exists "Authenticated can update stats" on public.stats;
create policy "Authenticated can update stats"
on public.stats
for update
to authenticated
using (public.is_admin_or_service_role())
with check (public.is_admin_or_service_role());

drop policy if exists "Authenticated can delete stats" on public.stats;
create policy "Authenticated can delete stats"
on public.stats
for delete
to authenticated
using (public.is_admin_or_service_role());

drop policy if exists "Authenticated can read all profiles" on public.profiles;
create policy "Authenticated can read own or admin profiles"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin_or_service_role());

drop policy if exists "Authenticated can insert own profile" on public.profiles;
create policy "Authenticated can insert own or admin profiles"
on public.profiles
for insert
to authenticated
with check (id = auth.uid() or public.is_admin_or_service_role());

drop policy if exists "Authenticated can update own profile" on public.profiles;
create policy "Authenticated can update own or admin profiles"
on public.profiles
for update
to authenticated
using (id = auth.uid() or public.is_admin_or_service_role())
with check (id = auth.uid() or public.is_admin_or_service_role());

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
