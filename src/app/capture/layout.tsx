import type { Metadata } from "next";
import styles from "./capture.module.css";

export const metadata: Metadata = {
  title: { default: "Capture", template: "%s · InkNation Capture" },
};

export default function CaptureLayout({ children }: { children: React.ReactNode }) {
  return <div className={styles.frame}>{children}</div>;
}
