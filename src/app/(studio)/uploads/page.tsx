import type { Metadata } from "next";
import { MOCK_ASSETS, MOCK_CLIENTS } from "@/lib/mock-data";
import { UploadsView } from "./uploads-view";

export const metadata: Metadata = { title: "Uploads" };

export default function UploadsPage() {
  return <UploadsView assets={MOCK_ASSETS} clients={MOCK_CLIENTS} />;
}
