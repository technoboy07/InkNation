"use server";

import { redirect } from "next/navigation";
import { getUser, safeNextPath } from "@/lib/auth";
import { siteOrigin } from "@/lib/origin";
import { supabaseEnv } from "@/lib/supabase/config";
import { createUserClient } from "@/lib/supabase/server";

export type FormState = { status: "idle" | "sent" | "error"; message?: string; email?: string };

export async function sendSignInLink(_prev: FormState, formData: FormData): Promise<FormState> {
  if (!supabaseEnv()) return { status: "error", message: "This deployment has no Supabase project connected yet." };

  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { status: "error", message: "Enter a valid email address.", email };

  const next = safeNextPath(formData.get("next"));
  const callback = `${await siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`;
  const supabase = await createUserClient();
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: callback } });
  if (error) return { status: "error", message: error.message, email };
  return { status: "sent", email };
}

export async function createStudio(_prev: FormState, formData: FormData): Promise<FormState> {
  await getUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { status: "error", message: "Give your studio a name." };
  if (name.length > 80) return { status: "error", message: "Keep the name under 80 characters." };

  const supabase = await createUserClient();
  const { error } = await supabase.rpc("create_studio", { studio_name: name });
  if (error) return { status: "error", message: error.message };
  redirect("/uploads");
}

export async function signOut() {
  const supabase = await createUserClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
