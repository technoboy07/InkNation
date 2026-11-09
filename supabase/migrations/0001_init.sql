-- InkNation v1 schema. Every row belongs to a studio, and row-level security
-- limits each signed-in user to the studios they are a member of.
-- Image bytes live in Cloudflare R2; these tables store only the object keys.

create type member_role as enum ('owner', 'artist');
create type asset_kind as enum ('photo', 'design', 'mockup');

create table studios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table studio_members (
  studio_id uuid not null references studios (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role member_role not null default 'artist',
  primary key (studio_id, user_id)
);

create table clients (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  client_id uuid references clients (id) on delete set null,
  kind asset_kind not null,
  title text not null,
  r2_key text not null unique,
  width_px int,
  height_px int,
  -- Pixels per centimetre, set when the photo is calibrated with a ruler card.
  px_per_cm numeric,
  -- For mockups: the editor document (layers, transforms, warp mesh).
  document jsonb,
  source_asset_id uuid references assets (id) on delete set null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index assets_studio_created on assets (studio_id, created_at desc) where deleted_at is null;

-- A phone paired by QR. The token is stored hashed; the phone holds the raw value.
create table paired_devices (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid not null references studios (id) on delete cascade,
  label text not null default 'Studio phone',
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create function is_studio_member(target uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from studio_members where studio_id = target and user_id = auth.uid()
  );
$$;

alter table studios enable row level security;
alter table studio_members enable row level security;
alter table clients enable row level security;
alter table assets enable row level security;
alter table paired_devices enable row level security;

create policy "members read their studio" on studios
  for select using (is_studio_member(id));

create policy "members read memberships" on studio_members
  for select using (is_studio_member(studio_id));

create policy "members manage clients" on clients
  for all using (is_studio_member(studio_id)) with check (is_studio_member(studio_id));

create policy "members manage assets" on assets
  for all using (is_studio_member(studio_id)) with check (is_studio_member(studio_id));

create policy "members manage paired devices" on paired_devices
  for all using (is_studio_member(studio_id)) with check (is_studio_member(studio_id));

-- Phones are not signed-in users: their uploads go through the API using the service
-- role after the pairing token is checked, so no phone-facing policy is needed here.

-- Live "new photo" events for the Uploads screen.
alter publication supabase_realtime add table assets;
