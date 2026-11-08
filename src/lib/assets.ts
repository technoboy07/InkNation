import "server-only";
import { getStudioMember } from "./auth";
import { createUserClient } from "./supabase/server";
import type { Asset, AssetKind } from "./types";

// Uploads newer than this get the "New" badge and the arrival banner.
const NEW_FOR_MS = 30 * 60 * 1000;

type AssetRow = { id: string; kind: AssetKind; title: string; created_at: string; clients: { name: string } | null };

export async function listStudioAssets(): Promise<{ assets: Asset[]; clients: string[] }> {
  const member = await getStudioMember();
  const supabase = await createUserClient();
  const [assets, clients] = await Promise.all([
    supabase
      .from("assets")
      .select("id, kind, title, created_at, clients (name)")
      .eq("studio_id", member.studioId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(200)
      .overrideTypes<AssetRow[], { merge: false }>(),
    supabase.from("clients").select("name").eq("studio_id", member.studioId).order("name"),
  ]);
  if (assets.error) throw assets.error;
  if (clients.error) throw clients.error;

  const now = Date.now();
  return {
    assets: assets.data.map((row) => ({
      id: row.id,
      kind: row.kind,
      title: row.title,
      clientName: row.clients?.name ?? null,
      createdLabel: relativeLabel(new Date(row.created_at), now),
      isNew: now - new Date(row.created_at).getTime() < NEW_FOR_MS,
    })),
    clients: clients.data.map((c) => c.name),
  };
}

function relativeLabel(date: Date, now: number) {
  const minutes = Math.round((now - date.getTime()) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return days === 1 ? "yesterday" : `${days} days ago`;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
