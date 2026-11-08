import type { Metadata } from "next";
import { ComingSoon } from "../coming-soon";

export const metadata: Metadata = { title: "Clients" };

export default function ClientsPage() {
  return (
    <ComingSoon title="Clients">
      Every client&apos;s photos, designs and mockups in one folder, with export and permanent delete.
    </ComingSoon>
  );
}
