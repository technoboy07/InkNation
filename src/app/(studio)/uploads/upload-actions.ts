"use server";

import { getStudioMember } from "@/lib/auth";
import { createUserClient } from "@/lib/supabase/server";
import { assetTitle, issuedKind, issueUpload, verifyUpload, type UploadKind, type UploadResult, type UploadTicket } from "@/lib/uploads";

// The studio's own "Upload files" button: the same two steps as the phone, as the signed-in user.
export async function startStudioUpload(kind: UploadKind, contentType: string): Promise<UploadTicket> {
  const member = await getStudioMember();
  return issueUpload(member.studioId, kind, contentType);
}

export async function finishStudioUpload(input: { key: string; title: string; width: number; height: number }): Promise<UploadResult> {
  const member = await getStudioMember();
  const kind = issuedKind(input.key, member.studioId);
  if (!kind) return { error: "Unknown upload." };

  const problem = await verifyUpload(input.key, kind);
  if (problem) return { error: problem };

  const supabase = await createUserClient();
  const { error } = await supabase.from("assets").insert({
    studio_id: member.studioId,
    kind,
    title: assetTitle(input.title, kind === "design" ? "Design" : "Photo"),
    r2_key: input.key,
    width_px: Math.round(input.width) || null,
    height_px: Math.round(input.height) || null,
    created_by: member.userId,
  });
  if (error && error.code !== "23505") throw error;
  return { ok: true };
}
