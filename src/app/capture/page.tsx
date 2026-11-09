import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CheckIcon } from "@/components/icons";
import { LocalTime } from "@/components/local-time";
import { Logo } from "@/components/logo";
import { getPairedDevice } from "@/lib/pairing";
import { unpair } from "./actions";
import { CodeForm } from "./code-form";
import styles from "./capture.module.css";

export const metadata: Metadata = { title: "Pair with studio" };

export default function PairPage() {
  return (
    <main className={styles.screen}>
      <Logo label="InkNation Capture" />
      <Suspense>
        <PairState />
      </Suspense>
    </main>
  );
}

async function PairState() {
  const device = await getPairedDevice();

  if (device) {
    return (
      <>
        <div className={styles.intro}>
          <span className={styles.success}>
            <CheckIcon size={26} strokeWidth={2.4} />
          </span>
          <h1>Paired with {device.studioName}</h1>
          <p>
            Photos you take go straight to Uploads. This phone stays paired until <LocalTime iso={device.expiresAt} />.
          </p>
        </div>
        <div className={styles.footer}>
          <Link href="/capture/camera" className={`btn btn-primary ${styles.tall}`}>
            Open camera
          </Link>
          <form action={unpair}>
            <button type="submit" className={`btn ${styles.tall}`}>
              Unpair this phone
            </button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.intro}>
        <h1>Pair with your studio</h1>
        <p>Do this once a day. After that, photos you take land in the studio&apos;s Uploads.</p>
      </div>
      <ol className={styles.steps}>
        <li>On the studio computer, open Uploads</li>
        <li>Point this phone&apos;s camera at the code shown there</li>
        <li>Tap the link that pops up</li>
      </ol>
      <div className={styles.footer}>
        <CodeForm />
        <p className={styles.fine}>The studio can unpair this phone at any time.</p>
      </div>
    </>
  );
}
