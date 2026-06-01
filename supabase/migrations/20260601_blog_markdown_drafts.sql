alter table public.blog_posts
add column if not exists content_format text not null default 'html';

alter table public.blog_posts
add column if not exists is_draft boolean not null default false;

alter table public.blog_posts
drop constraint if exists blog_posts_content_format_check;

alter table public.blog_posts
add constraint blog_posts_content_format_check
check (content_format in ('html', 'md'));

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
