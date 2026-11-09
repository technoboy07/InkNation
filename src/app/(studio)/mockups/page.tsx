import type { Metadata } from "next";
import { ComingSoon } from "../coming-soon";

export const metadata: Metadata = { title: "Mockups" };

export default function MockupsPage() {
  return (
    <ComingSoon title="Mockups">
      Saved mockups with their layers, ready to reopen and adjust at the next session.
    </ComingSoon>
  );
}
