-- Photos sent from a paired phone record which phone sent them.
alter table assets add column device_id uuid references paired_devices (id) on delete set null;

-- The pairing panel listens for phones being paired or revoked.
alter publication supabase_realtime add table paired_devices;
