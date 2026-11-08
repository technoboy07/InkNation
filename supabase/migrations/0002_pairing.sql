-- Studio setup and phone pairing.

-- A signed-in user with no studio creates one and becomes its owner. Runs as definer
-- because members can't insert studios or memberships directly.
create function create_studio(studio_name text) returns uuid
language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
begin
  if auth.uid() is null then
    raise exception 'not signed in';
  end if;
  if length(trim(studio_name)) = 0 then
    raise exception 'studio name is required';
  end if;
  insert into studios (name) values (trim(studio_name)) returning id into new_id;
  insert into studio_members (studio_id, user_id, role) values (new_id, auth.uid(), 'owner');
  return new_id;
end;
$$;

revoke execute on function create_studio(text) from public, anon;
grant execute on function create_studio(text) to authenticated;

-- A one-time code shown on the studio screen, as a QR link and as six digits.
-- It lives for two minutes; redeeming it creates a row in paired_devices.
create table pairing_codes (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  token_hash text not null unique,
  short_code text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index pairing_codes_short_code on pairing_codes (short_code) where used_at is null;

alter table pairing_codes enable row level security;

create policy "members manage pairing codes" on pairing_codes
  for all using (is_studio_member(studio_id)) with check (is_studio_member(studio_id));

-- Redeeming happens on the phone, which isn't signed in, so the API does it with the
-- service role. Locking the row stops one code pairing two phones.
create function redeem_pairing_code(code_token_hash text, code_short text, device_token_hash text, device_label text, device_expires timestamptz)
returns table (device_id uuid, studio_id uuid, studio_name text)
language plpgsql security definer set search_path = public as $$
declare
  code pairing_codes%rowtype;
begin
  select * into code from pairing_codes p
  where p.used_at is null
    and p.expires_at > now()
    and (p.token_hash = code_token_hash or (code_short is not null and p.short_code = code_short))
  order by p.created_at desc
  limit 1
  for update;

  if not found then
    return;
  end if;

  update pairing_codes set used_at = now() where id = code.id;

  return query
  insert into paired_devices as d (studio_id, label, token_hash, expires_at, created_by)
  values (code.studio_id, device_label, device_token_hash, device_expires, code.created_by)
  returning d.id, d.studio_id, (select s.name from studios s where s.id = d.studio_id);
end;
$$;

revoke execute on function redeem_pairing_code(text, text, text, text, timestamptz) from public, anon, authenticated;
grant execute on function redeem_pairing_code(text, text, text, text, timestamptz) to service_role;
