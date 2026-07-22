-- Self-hosted visitor analytics. Anonymous visitors may create events, while
-- only authenticated admins may read or manage them from the CMS.
create table if not exists public.visitor_events (
  id uuid primary key default gen_random_uuid(),
  visited_at timestamptz not null default now(),
  visitor_id uuid,
  session_id uuid,
  ip_hash text,
  country text,
  region text,
  city text,
  browser text,
  browser_version text,
  engine text,
  engine_version text,
  os text,
  os_version text,
  device text not null default 'desktop',
  vendor text,
  model text,
  cpu text,
  language text,
  timezone text,
  color_scheme text,
  screen_width integer,
  screen_height integer,
  pixel_ratio numeric,
  page text not null,
  query text,
  referrer text,
  host text,
  protocol text,
  user_agent text
);

create index if not exists visitor_events_visited_at_idx
  on public.visitor_events (visited_at desc);
create index if not exists visitor_events_page_idx
  on public.visitor_events (page);
create index if not exists visitor_events_session_idx
  on public.visitor_events (session_id);

alter table public.visitor_events enable row level security;

drop policy if exists "Anyone can record visitor events" on public.visitor_events;
create policy "Anyone can record visitor events"
on public.visitor_events
for insert
to anon, authenticated
with check (true);

drop policy if exists "Admins can read visitor events" on public.visitor_events;
create policy "Admins can read visitor events"
on public.visitor_events
for select
to authenticated
using (public.is_admin_or_service_role());

drop policy if exists "Admins can delete visitor events" on public.visitor_events;
create policy "Admins can delete visitor events"
on public.visitor_events
for delete
to authenticated
using (public.is_admin_or_service_role());
