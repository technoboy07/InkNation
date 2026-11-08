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
  if (!(await getPairedDevice())) redirect("/capture");
  return <CameraView clientName="Aarav M." bodyPart="Left forearm" />;
}
