create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
