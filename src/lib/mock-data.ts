import type { Layer } from "./types";

// Sample layers until the editor loads real documents from the assets table.
export const MOCK_LAYERS: Layer[] = [
  { id: "l1", name: "Sun and moon", detail: "Cutout", kind: "design", visible: true, locked: false },
  { id: "l2", name: "Healed look", detail: "Adjustment", kind: "adjustment", visible: false, locked: false },
  { id: "l3", name: "Left forearm, outer", detail: "Photo", kind: "photo", visible: true, locked: true },
];
