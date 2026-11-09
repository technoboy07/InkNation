import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getPairedDevice } from "@/lib/pairing";
import { CameraView } from "./camera-view";

export const metadata: Metadata = { title: "Camera" };

export default function CameraPage() {
  return (
    <Suspense>
      <Camera />
    </Suspense>
  );
}

// The proxy only checks that a pairing cookie exists; this catches one that expired or was revoked.
async function Camera() {
  const device = await getPairedDevice();
  if (!device) redirect("/capture");
  return <CameraView studioName={device.studioName} />;
}
