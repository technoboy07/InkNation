import "server-only";
import { createHash, randomBytes, randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { DEVICE_COOKIE } from "./pairing-cookie";
import { createServiceClient } from "./supabase/server";

export const PAIRING_CODE_TTL_MS = 2 * 60 * 1000;
// A paired phone works for one working day, then has to scan again.
const DEVICE_TTL_MS = 12 * 60 * 60 * 1000;

export const newToken = () => randomBytes(32).toString("base64url");
export const newShortCode = () => String(randomInt(0, 1_000_000)).padStart(6, "0");
// Only hashes are stored, so a database leak doesn't hand out working tokens.
export const hashToken = (token: string) => createHash("sha256").update(token).digest("hex");

export type PairedDevice = { id: string; studioId: string; studioName: string; label: string; expiresAt: string };

// Swaps a QR token or a six-digit code for a device token, stored in an httpOnly cookie on the phone.
export async function redeemPairingCode(code: { token: string } | { shortCode: string }) {
  const deviceToken = newToken();
  const expires = new Date(Date.now() + DEVICE_TTL_MS);
  const { data, error } = await createServiceClient().rpc("redeem_pairing_code", {
    code_token_hash: "token" in code ? hashToken(code.token) : "",
    code_short: "shortCode" in code ? code.shortCode : null,
    device_token_hash: hashToken(deviceToken),
    device_label: "Studio phone",
    device_expires: expires.toISOString(),
  });
  if (error) throw error;
  const row = (data as { device_id: string; studio_id: string; studio_name: string }[])[0];
  if (!row) return null;

  (await cookies()).set(DEVICE_COOKIE, deviceToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });
  return row.studio_name;
}

// The phone's pairing, or null if it has none, it expired, or the studio revoked it.
export async function getPairedDevice(): Promise<PairedDevice | null> {
  await connection();
  const token = (await cookies()).get(DEVICE_COOKIE)?.value;
  if (!token) return null;
  const { data, error } = await createServiceClient()
    .from("paired_devices")
    .select("id, studio_id, label, expires_at, studios (name)")
    .eq("token_hash", hashToken(token))
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle<{ id: string; studio_id: string; label: string; expires_at: string; studios: { name: string } }>();
  if (error) throw error;
  if (!data) return null;
  return { id: data.id, studioId: data.studio_id, studioName: data.studios.name, label: data.label, expiresAt: data.expires_at };
}

export async function forgetDevice() {
  const jar = await cookies();
  const token = jar.get(DEVICE_COOKIE)?.value;
  if (token) {
    await createServiceClient()
      .from("paired_devices")
      .update({ revoked_at: new Date().toISOString() })
      .eq("token_hash", hashToken(token))
      .is("revoked_at", null);
  }
  jar.delete(DEVICE_COOKIE);
}
