"use server";

import { randomUUID } from "node:crypto";
import { getPairedDevice } from "@/lib/pairing";
import { deleteObject, headObject, uploadUrl } from "@/lib/storage";
import { createServiceClient } from "@/lib/supabase/server";

const MAX_PHOTO_BYTES = 25 * 1024 * 1024;
const KEY_PATTERN = /^studios\/[0-9a-f-]{36}\/photos\/[0-9a-f-]{36}\.jpg$/;

export type UploadTicket = { key: string; url: string } | { error: string };
export type UploadResult = { ok: true } | { error: string };

const NOT_PAIRED = "This phone isn't paired any more. Pair it again from the studio screen.";

// Step 1: a signed URL the phone PUTs the JPEG to, straight to storage.
export async function startPhotoUpload(): Promise<UploadTicket> {
  const device = await getPairedDevice();
  if (!device) return { error: NOT_PAIRED };
  const key = `studios/${device.studioId}/photos/${randomUUID()}.jpg`;
  return { key, url: await uploadUrl(key) };
}

// Step 2: once the PUT finishes, check the file really landed and file it under the studio.
export async function finishPhotoUpload(input: { key: string; title: string; width: number; height: number }): Promise<UploadResult> {
  const device = await getPairedDevice();
  if (!device) return { error: NOT_PAIRED };
  if (!KEY_PATTERN.test(input.key) || !input.key.startsWith(`studios/${device.studioId}/`)) return { error: "Unknown upload." };

  const object = await headObject(input.key);
  if (!object) return { error: "The photo didn't reach the studio. Try again." };
  if (object.size > MAX_PHOTO_BYTES || !object.contentType.startsWith("image/jpeg")) {
    await deleteObject(input.key);
    return { error: "That file isn't a photo the studio can use." };
  }

  const { error } = await createServiceClient()
    .from("assets")
    .insert({
      studio_id: device.studioId,
      device_id: device.id,
      kind: "photo",
      title: input.title.trim().slice(0, 120) || "Photo",
      r2_key: input.key,
      width_px: Math.round(input.width) || null,
      height_px: Math.round(input.height) || null,
    });
  // A retry after a dropped response finds the row already there; that still counts as sent.
  if (error && error.code !== "23505") throw error;
  return { ok: true };
}
