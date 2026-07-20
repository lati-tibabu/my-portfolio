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

alter table public.blog_comments enable row level security;

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
