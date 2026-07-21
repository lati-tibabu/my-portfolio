-- Role-based RLS: editors may only modify graphics_items, marketplace_items,
-- blog_posts, and client_testimonials. Admins (and service_role requests from
-- server actions) retain full access to hero_content, dev_journey_items,
-- certifications, stats, and profiles.

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

-- hero_content: admin/service_role write only
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

-- dev_journey_items: admin/service_role write only
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

-- certifications: admin/service_role write only
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

-- stats: admin/service_role write only
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

-- profiles: tighten to own + admin/service_role
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
