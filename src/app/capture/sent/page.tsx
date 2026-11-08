import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import styles from "../capture.module.css";

export const metadata: Metadata = { title: "Sent to studio" };

// Static until uploads are wired: shows the states the real list will have.
const SENT = [
  { name: "Left forearm, outer", size: "3.1 MB", angle: 14, progress: 100 },
  { name: "Left forearm, inner", size: "2.8 MB", angle: -8, progress: 100 },
  { name: "Left wrist", size: "2.6 MB", angle: 30, progress: 68 },
];

export default function SentPage() {
  return (
    <main className={styles.screen}>
      <Logo label="InkNation Capture" />

      <div className={styles.intro}>
        <span className={styles.success}>
          <CheckIcon size={26} strokeWidth={2.4} />
        </span>
        <h1>On the studio screen</h1>
        <p>Filed under Aarav M. in Uploads. Location data was removed before sending.</p>
      </div>

      <ul className={styles.sentList}>
        {SENT.map((shot) => (
          <li key={shot.name}>
            <div className={styles.sentRow}>
              <span className={styles.sentThumb}>
                <span style={{ transform: `rotate(${shot.angle}deg)` }} />
              </span>
              <span className={styles.sentText}>
                <span>{shot.name}</span>
                <span className={styles.fine}>{shot.progress < 100 ? `Sending · ${shot.progress}%` : shot.size}</span>
              </span>
              {shot.progress === 100 && <strong>Sent</strong>}
            </div>
            {shot.progress < 100 && (
              <div
                role="progressbar"
                aria-label={`Upload progress, ${shot.name}`}
                aria-valuenow={shot.progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className={styles.progress}
              >
                <span style={{ width: `${shot.progress}%` }} />
              </div>
            )}
          </li>
        ))}
      </ul>

      <div className={styles.footer}>
        <Link href="/capture/camera" className={`btn btn-primary ${styles.tall}`}>
          Take more
        </Link>
        <Link href="/capture" className={`btn ${styles.tall}`}>
          Switch client
        </Link>
      </div>
    </main>
  );
}
