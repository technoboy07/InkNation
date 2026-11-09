-- Local development only. Production files live in Cloudflare R2, so this bucket exists just
-- for Supabase Storage's S3 endpoint, which stands in for R2 on a laptop.
insert into storage.buckets (id, name, public)
values ('inknation-uploads', 'inknation-uploads', false)
on conflict (id) do nothing;
