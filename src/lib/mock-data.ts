import type { Asset, Layer } from "./types";

// Sample data until Supabase is connected. Replace with queries, not edits.
export const MOCK_ASSETS: Asset[] = [
  { id: "a1", kind: "photo", title: "Left forearm, outer", clientName: "Aarav M.", createdLabel: "just now", isNew: true },
  { id: "a2", kind: "photo", title: "Left forearm, inner", clientName: "Aarav M.", createdLabel: "just now", isNew: true },
  { id: "a3", kind: "photo", title: "Left wrist", clientName: "Aarav M.", createdLabel: "just now", isNew: true },
  { id: "a4", kind: "design", title: "Sun and moon, line art", clientName: null, createdLabel: "1 h ago" },
  { id: "a5", kind: "mockup", title: "Sun and moon on forearm", clientName: "Meera K.", createdLabel: "yesterday" },
  { id: "a6", kind: "photo", title: "Upper back", clientName: "Meera K.", createdLabel: "yesterday" },
  { id: "a7", kind: "design", title: "Botanical sleeve sketch", clientName: "Meera K.", createdLabel: "2 days ago" },
  { id: "a8", kind: "mockup", title: "Script lettering, ribs", clientName: "Kabir S.", createdLabel: "3 days ago" },
];

export const MOCK_CLIENTS = ["Aarav M.", "Meera K.", "Kabir S."];

export const MOCK_LAYERS: Layer[] = [
  { id: "l1", name: "Sun and moon", detail: "Cutout", kind: "design", visible: true, locked: false },
  { id: "l2", name: "Healed look", detail: "Adjustment", kind: "adjustment", visible: false, locked: false },
  { id: "l3", name: "Left forearm, outer", detail: "Photo", kind: "photo", visible: true, locked: true },
];
