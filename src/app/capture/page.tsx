import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { QrPlaceholder } from "@/components/qr-placeholder";
import styles from "./capture.module.css";

export const metadata: Metadata = { title: "Pair with studio" };

export default function PairPage() {
  return (
    <main className={styles.screen}>
      <Logo label="InkNation Capture" />

      <div className={styles.intro}>
        <h1>Scan the code on the studio screen</h1>
        <p>On the studio computer, open Uploads and click Pair phone.</p>
      </div>

      <div className={styles.scanner}>
        <div className={styles.reticle}>
          <span className={styles.cornerTl} />
          <span className={styles.cornerTr} />
          <span className={styles.cornerBl} />
          <span className={styles.cornerBr} />
          <div className={styles.qrInView}>
            <QrPlaceholder size={128} label="Studio QR code in view (placeholder)" />
          </div>
          <span className={styles.scanLine} />
        </div>
        <span className={styles.scanStatus}>Looking for a code…</span>
      </div>

      <div className={styles.footer}>
        {/* Until QR scanning is built, this skips straight to the camera. */}
        <Link href="/capture/camera" className={`btn ${styles.tall}`}>
          Type a 6-digit code instead
        </Link>
        <p className={styles.fine}>Stays paired until 22:00. The studio can unpair this phone at any time.</p>
      </div>
    </main>
  );
}
