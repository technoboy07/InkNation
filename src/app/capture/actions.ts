"use server";

import { redirect } from "next/navigation";
import { forgetDevice, redeemPairingCode } from "@/lib/pairing";
import { supabaseEnv } from "@/lib/supabase/config";

export type PairState = { error?: string };

export async function pairWithCode(_prev: PairState, formData: FormData): Promise<PairState> {
  if (!supabaseEnv()) return { error: "This deployment has no Supabase project connected yet." };
  const shortCode = String(formData.get("code") ?? "").replace(/\D/g, "");
  if (shortCode.length !== 6) return { error: "The code is 6 digits." };

  const studio = await redeemPairingCode({ shortCode });
  if (!studio) return { error: "That code didn't work. Codes last 2 minutes and work once; check the studio screen for the current one." };
  redirect("/capture/camera");
}

export async function unpair() {
  await forgetDevice();
  redirect("/capture");
}
