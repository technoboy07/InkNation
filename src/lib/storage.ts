import "server-only";
import { AwsClient } from "aws4fetch";

// Any S3-compatible store: Cloudflare R2 in production, Supabase Storage's S3 endpoint locally.
// Files never pass through our server; the browser gets short-lived signed URLs instead.

const UPLOAD_URL_TTL_S = 10 * 60;
const VIEW_URL_TTL_S = 60 * 60;

function storageConfig() {
  const endpoint = process.env.STORAGE_S3_ENDPOINT;
  const accessKeyId = process.env.STORAGE_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_S3_SECRET_ACCESS_KEY;
  const bucket = process.env.STORAGE_BUCKET;
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) throw new Error("File storage is not configured. See .env.example.");
  const client = new AwsClient({ accessKeyId, secretAccessKey, service: "s3", region: process.env.STORAGE_S3_REGION ?? "auto" });
  return { client, base: `${endpoint.replace(/\/$/, "")}/${bucket}` };
}

const objectUrl = (base: string, key: string) => `${base}/${key.split("/").map(encodeURIComponent).join("/")}`;

async function presign(key: string, method: "PUT" | "GET", ttl: number) {
  const { client, base } = storageConfig();
  const signed = await client.sign(`${objectUrl(base, key)}?X-Amz-Expires=${ttl}`, { method, aws: { signQuery: true } });
  return signed.url;
}

export const uploadUrl = (key: string) => presign(key, "PUT", UPLOAD_URL_TTL_S);
export const viewUrl = (key: string) => presign(key, "GET", VIEW_URL_TTL_S);

// Size and type of an uploaded object, or null if nothing is there.
export async function headObject(key: string) {
  const { client, base } = storageConfig();
  const res = await client.fetch(objectUrl(base, key), { method: "HEAD" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Storage HEAD failed: ${res.status}`);
  return { size: Number(res.headers.get("content-length") ?? 0), contentType: res.headers.get("content-type") ?? "" };
}

export async function deleteObject(key: string) {
  const { client, base } = storageConfig();
  const res = await client.fetch(objectUrl(base, key), { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`Storage DELETE failed: ${res.status}`);
}
