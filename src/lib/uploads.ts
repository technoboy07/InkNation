import "server-only";
import { randomUUID } from "node:crypto";
import { deleteObject, headObject, uploadUrl } from "./storage";

// The two-step upload shared by the phone and the studio: the server hands out a signed URL for a
// key it chose, the browser PUTs the file there, then the server checks what landed before recording it.

const MAX_BYTES = 25 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export type UploadKind = "photo" | "design";
const KIND_TYPES: Record<UploadKind, string[]> = { photo: ["image/jpeg"], design: ["image/png", "image/webp"] };

export type UploadTicket = { key: string; url: string } | { error: string };
export type UploadResult = { ok: true } | { error: string };

export async function issueUpload(studioId: string, kind: UploadKind, contentType: string): Promise<UploadTicket> {
  if (!KIND_TYPES[kind].includes(contentType)) return { error: "Only JPEG, PNG or WebP images can be uploaded." };
  const key = `studios/${studioId}/${kind}s/${randomUUID()}.${EXTENSIONS[contentType]}`;
  return { key, url: await uploadUrl(key) };
}

// The kind of a key this server issued for this studio, or null for anything else.
export function issuedKind(key: string, studioId: string): UploadKind | null {
  const match = /^studios\/([0-9a-f-]{36})\/(photo|design)s\/[0-9a-f-]{36}\.(jpg|png|webp)$/.exec(key);
  return match && match[1] === studioId ? (match[2] as UploadKind) : null;
}

// Null when the file arrived and is what was promised; otherwise removes it and says why.
export async function verifyUpload(key: string, kind: UploadKind): Promise<string | null> {
  const object = await headObject(key);
  if (!object) return "The file didn't arrive. Try again.";
  if (object.size > MAX_BYTES || !KIND_TYPES[kind].some((t) => object.contentType.startsWith(t))) {
    await deleteObject(key);
    return "That file isn't an image the studio can use (JPEG, PNG or WebP, up to 25 MB).";
  }
  return null;
}

export const assetTitle = (title: string, fallback: string) => title.trim().slice(0, 120) || fallback;
