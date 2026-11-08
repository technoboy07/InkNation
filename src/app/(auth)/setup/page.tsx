import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getMembership } from "@/lib/auth";
import { SetupForm } from "./setup-form";

export const metadata: Metadata = { title: "Set up your studio" };

export default function SetupPage() {
  return (
    <Suspense>
      <Setup />
    </Suspense>
  );
}

async function Setup() {
  const { user, studio } = await getMembership();
  if (studio) redirect("/uploads");
  return <SetupForm email={user.email} />;
}
