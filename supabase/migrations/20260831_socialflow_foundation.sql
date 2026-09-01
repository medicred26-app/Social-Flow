-- SocialFlow foundation: profiles, connected accounts, posts, targets.
-- No media storage. Users provide a public media URL when a platform requires it.

create schema if not exists private;
revoke all on schema private from public;
revoke all on schema private from anon;
revoke all on schema private from authenticated;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.connected_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  platform text not null check (platform in ('facebook', 'instagram', 'youtube', 'linkedin', 'x')),
  external_id text not null,
  name text,
  handle text,
  avatar_url text,
  account_type text,
  follower_count integer,
  access_token_encrypted text not null,
  refresh_token_encrypted text,
  token_expires_at timestamptz,
  extra jsonb not null default '{}'::jsonb,
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, platform, external_id)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  caption text not null,
  media_url text,
  media_type text check (media_type is null or media_type in ('image', 'video')),
  scheduled_for timestamptz,
  status text not null check (status in ('draft', 'scheduled', 'publishing', 'published', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.post_targets (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  account_id uuid not null references public.connected_accounts (id) on delete restrict,
  platform text not null check (platform in ('facebook', 'instagram', 'youtube', 'linkedin', 'x')),
  status text not null check (status in ('pending', 'publishing', 'published', 'failed')),
  platform_post_id text,
  error text,
  published_at timestamptz,
  attempt_count integer not null default 0
);

create index posts_user_id_idx on public.posts (user_id);
create index posts_due_idx on public.posts (status, scheduled_for);
create index post_targets_post_id_idx on public.post_targets (post_id);
create index connected_accounts_user_id_idx on public.connected_accounts (user_id);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function private.set_updated_at();

create trigger connected_accounts_updated_at
  before update on public.connected_accounts
  for each row execute function private.set_updated_at();

create trigger posts_updated_at
  before update on public.posts
  for each row execute function private.set_updated_at();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(coalesce(new.email, 'user'), '@', 1)
    ),
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

alter table public.profiles enable row level security;
alter table public.connected_accounts enable row level security;
alter table public.posts enable row level security;
alter table public.post_targets enable row level security;

create policy "profiles_select_own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "accounts_select_own" on public.connected_accounts
  for select to authenticated using (user_id = auth.uid());
create policy "accounts_insert_own" on public.connected_accounts
  for insert to authenticated with check (user_id = auth.uid());
create policy "accounts_update_own" on public.connected_accounts
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "accounts_delete_own" on public.connected_accounts
  for delete to authenticated using (user_id = auth.uid());

create policy "posts_select_own" on public.posts
  for select to authenticated using (user_id = auth.uid());
create policy "posts_insert_own" on public.posts
  for insert to authenticated with check (user_id = auth.uid());
create policy "posts_update_own" on public.posts
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "posts_delete_own" on public.posts
  for delete to authenticated using (user_id = auth.uid());

create policy "targets_select_own" on public.post_targets
  for select to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()));
create policy "targets_insert_own" on public.post_targets
  for insert to authenticated
  with check (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()));
create policy "targets_update_own" on public.post_targets
  for update to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()))
  with check (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()));
create policy "targets_delete_own" on public.post_targets
  for delete to authenticated
  using (exists (select 1 from public.posts p where p.id = post_id and p.user_id = auth.uid()));

create or replace view public.social_accounts
with (security_invoker = true)
as
select
  id,
  user_id,
  platform,
  external_id,
  name,
  handle,
  avatar_url,
  account_type,
  follower_count,
  token_expires_at,
  connected_at,
  updated_at
from public.connected_accounts;

grant select on public.social_accounts to authenticated;
