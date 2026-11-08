import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createUserClient } from "./supabase/server";

export type StudioMember = {
  userId: string;
  email: string;
  studioId: string;
  studioName: string;
  role: "owner" | "artist";
};

// Verified identity from the session cookie. Deduped per request with React's cache;
// not cached across requests, so signing out takes effect on the next navigation.
export const getUser = cache(async () => {
  const supabase = await createUserClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/sign-in");
  return { id: data.claims.sub, email: String(data.claims.email ?? "") };
});

export const getMembership = cache(async () => {
  const user = await getUser();
  const supabase = await createUserClient();
  const { data, error } = await supabase
    .from("studio_members")
    .select("role, studios (id, name)")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle<{ role: StudioMember["role"]; studios: { id: string; name: string } }>();
  if (error) throw error;
  return data ? { user, role: data.role, studio: data.studios } : { user, role: null, studio: null };
});

// For studio screens: sends a new user to studio setup first.
export async function getStudioMember(): Promise<StudioMember> {
  const { user, role, studio } = await getMembership();
  if (!studio || !role) redirect("/setup");
  return { userId: user.id, email: user.email, studioId: studio.id, studioName: studio.name, role };
}

// Only relative paths, so a crafted ?next= can't send someone to another site after sign-in.
export function safeNextPath(next: unknown) {
  return typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : "/uploads";
}
