update public.graphics_items
set image_url = 'https://placehold.co/600x400@2x.png'
where btrim(image_url) = '';

update public.marketplace_items
set cover_image_url = 'https://placehold.co/600x400@2x.png'
where btrim(cover_image_url) = '';

update public.blog_posts
set cover_image_url = 'https://placehold.co/600x400@2x.png'
where btrim(cover_image_url) = '';

alter table public.graphics_items
alter column image_url set default 'https://placehold.co/600x400@2x.png';

alter table public.marketplace_items
alter column cover_image_url set default 'https://placehold.co/600x400@2x.png';

alter table public.blog_posts
alter column cover_image_url set default 'https://placehold.co/600x400@2x.png';

alter table public.graphics_items
drop constraint if exists graphics_items_image_url_not_blank;

alter table public.graphics_items
add constraint graphics_items_image_url_not_blank
check (btrim(image_url) <> '');

alter table public.marketplace_items
drop constraint if exists marketplace_items_cover_image_url_not_blank;

alter table public.marketplace_items
add constraint marketplace_items_cover_image_url_not_blank
check (btrim(cover_image_url) <> '');

alter table public.blog_posts
drop constraint if exists blog_posts_cover_image_url_not_blank;

alter table public.blog_posts
add constraint blog_posts_cover_image_url_not_blank
check (btrim(cover_image_url) <> '');
