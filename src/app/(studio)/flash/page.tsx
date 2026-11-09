import type { Metadata } from "next";
import { ComingSoon } from "../coming-soon";

export const metadata: Metadata = { title: "Flash" };

export default function FlashPage() {
  return (
    <ComingSoon title="Flash">
      The studio&apos;s shared collection of reusable flash designs, already cut out.
    </ComingSoon>
  );
}
