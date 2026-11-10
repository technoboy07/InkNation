"use server";

import { getPairedDevice } from "@/lib/pairing";
import { createServiceClient } from "@/lib/supabase/server";
import { assetTitle, issuedKind, issueUpload, verifyUpload, type UploadResult, type UploadTicket } from "@/lib/uploads";

const NOT_PAIRED = "This phone isn't paired any more. Pair it again from the studio screen.";

// Step 1: a signed URL the phone PUTs the JPEG to, straight to storage.
export async function startPhotoUpload(): Promise<UploadTicket> {
  const device = await getPairedDevice();
  if (!device) return { error: NOT_PAIRED };
  return issueUpload(device.studioId, "photo", "image/jpeg");
}

// Step 2: once the PUT finishes, check the file really landed and file it under the studio.
export async function finishPhotoUpload(input: { key: string; title: string; width: number; height: number }): Promise<UploadResult> {
  const device = await getPairedDevice();
  if (!device) return { error: NOT_PAIRED };
  if (issuedKind(input.key, device.studioId) !== "photo") return { error: "Unknown upload." };

  const problem = await verifyUpload(input.key, "photo");
  if (problem) return { error: problem };

  const { error } = await createServiceClient()
    .from("assets")
    .insert({
      studio_id: device.studioId,
      device_id: device.id,
      kind: "photo",
      title: assetTitle(input.title, "Photo"),
      r2_key: input.key,
      width_px: Math.round(input.width) || null,
      height_px: Math.round(input.height) || null,
    });
  // A retry after a dropped response finds the row already there; that still counts as sent.
  if (error && error.code !== "23505") throw error;
  return { ok: true };
}
