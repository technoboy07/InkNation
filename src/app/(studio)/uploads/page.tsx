import type { Metadata } from "next";
import { Suspense } from "react";
import { listStudioAssets } from "@/lib/assets";
import { UploadsView } from "./uploads-view";

export const metadata: Metadata = { title: "Uploads" };

export default function UploadsPage() {
  return (
    <Suspense>
      <Uploads />
    </Suspense>
  );
}

async function Uploads() {
  const { studioId, assets, clients } = await listStudioAssets();
  return <UploadsView studioId={studioId} assets={assets} clients={clients} />;
}
