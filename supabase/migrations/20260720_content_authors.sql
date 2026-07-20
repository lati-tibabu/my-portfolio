alter table public.graphics_items
  add column if not exists author_name text not null default 'latitibabu';

alter table public.marketplace_items
  add column if not exists author_name text not null default 'latitibabu';

alter table public.blog_posts
  add column if not exists author_name text not null default 'latitibabu';
