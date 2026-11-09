import type { Metadata } from "next";
import { MOCK_LAYERS } from "@/lib/mock-data";
import { EditorView } from "./editor-view";

export const metadata: Metadata = { title: "Editor" };

export default function EditorPage() {
  return <EditorView initialLayers={MOCK_LAYERS} />;
}
