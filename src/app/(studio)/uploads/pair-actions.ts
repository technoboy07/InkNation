"use server";

import QRCode from "qrcode";
import { getStudioMember } from "@/lib/auth";
import { siteOrigin } from "@/lib/origin";
import { hashToken, newShortCode, newToken, PAIRING_CODE_TTL_MS } from "@/lib/pairing";
import { createUserClient } from "@/lib/supabase/server";

export type PairingCode = { qrSvg: string; shortCode: string; link: string; expiresAt: string };
export type DeviceRow = { id: string; label: string; expiresAt: string };

export async function createPairingCode(): Promise<PairingCode> {
  const member = await getStudioMember();
  const supabase = await createUserClient();

  const token = newToken();
  const shortCode = newShortCode();
  const expiresAt = new Date(Date.now() + PAIRING_CODE_TTL_MS).toISOString();

  // Retire this studio's older codes so only the one on screen works.
  await supabase
    .from("pairing_codes")
    .update({ used_at: new Date().toISOString() })
    .eq("studio_id", member.studioId)
    .is("used_at", null);

  const { error } = await supabase.from("pairing_codes").insert({
    studio_id: member.studioId,
    token_hash: hashToken(token),
    short_code: shortCode,
    expires_at: expiresAt,
    created_by: member.userId,
  });
  if (error) throw error;

  const link = `${await siteOrigin()}/capture/pair?t=${token}`;
  const qrSvg = await QRCode.toString(link, { type: "svg", margin: 1, color: { dark: "#0e0e0e", light: "#ffffff" } });
  return { qrSvg, shortCode, link, expiresAt };
}

export async function listDevices(): Promise<DeviceRow[]> {
  const member = await getStudioMember();
  const supabase = await createUserClient();
  const { data, error } = await supabase
    .from("paired_devices")
    .select("id, label, expires_at")
    .eq("studio_id", member.studioId)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map((d) => ({ id: d.id, label: d.label, expiresAt: d.expires_at }));
}

export async function revokeDevice(id: string): Promise<DeviceRow[]> {
  const member = await getStudioMember();
  const supabase = await createUserClient();
  const { error } = await supabase
    .from("paired_devices")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("studio_id", member.studioId);
  if (error) throw error;
  return listDevices();
}
