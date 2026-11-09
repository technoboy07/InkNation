// Mirrors the `assets` table in supabase/migrations/0001_init.sql.
export type AssetKind = "photo" | "design" | "mockup";

export type Asset = {
  id: string;
  kind: AssetKind;
  title: string;
  clientName: string | null;
  createdLabel: string;
  isNew?: boolean;
  // Short-lived signed URL for the image; null when the file can't be shown yet.
  imageUrl?: string | null;
};

export type Layer = {
  id: string;
  name: string;
  detail: string;
  kind: "design" | "adjustment" | "photo";
  visible: boolean;
  locked: boolean;
};

export const BLEND_MODES = [
  "Normal",
  "Multiply",
  "Screen",
  "Overlay",
  "Darken",
  "Soft light",
] as const;

export type BlendMode = (typeof BLEND_MODES)[number];
