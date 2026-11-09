"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { PhoneIcon } from "@/components/icons";
import { useStudioChanges } from "@/lib/supabase/browser";
import { createPairingCode, listDevices, revokeDevice, type DeviceRow, type PairingCode } from "./pair-actions";
import styles from "./uploads.module.css";

const timeOf = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function PairPanel({ studioId }: { studioId: string }) {
  const [code, setCode] = useState<PairingCode | null>(null);
  const [devices, setDevices] = useState<DeviceRow[] | null>(null);
  const [justPaired, setJustPaired] = useState(false);
  const [failed, setFailed] = useState(false);
  const [, startTransition] = useTransition();
  const deviceCount = useRef<number | null>(null);

  const refreshCode = useCallback(() => {
    createPairingCode()
      .then((c) => {
        setCode(c);
        setFailed(false);
      })
      .catch(() => setFailed(true));
  }, []);

  // A fresh code on load, and again whenever the current one runs out.
  useEffect(() => {
    if (!code) {
      refreshCode();
      return;
    }
    const timer = setTimeout(refreshCode, Math.max(0, new Date(code.expiresAt).getTime() - Date.now()));
    return () => clearTimeout(timer);
  }, [code, refreshCode]);

  const loadDevices = useCallback(() => {
    listDevices()
      .then((rows) => {
        // A new phone used up the code on screen, so show the next one.
        if (deviceCount.current !== null && rows.length > deviceCount.current) {
          setJustPaired(true);
          refreshCode();
        }
        deviceCount.current = rows.length;
        setDevices(rows);
      })
      .catch(() => {});
  }, [refreshCode]);

  useEffect(loadDevices, [loadDevices]);
  useStudioChanges("paired_devices", studioId, loadDevices);

  const revoke = (id: string) =>
    startTransition(async () => {
      const rows = await revokeDevice(id);
      deviceCount.current = rows.length;
      setDevices(rows);
    });

  return (
    <aside id="pair" aria-label="Pair a phone" className={styles.aside}>
      <section className={styles.panel}>
        <h2>Pair a phone</h2>
        <div className={styles.qr}>
          {code ? (
            // The SVG comes from the qrcode package on our own server, not from user input.
            <div role="img" aria-label="Pairing QR code" className={styles.qrImage} dangerouslySetInnerHTML={{ __html: code.qrSvg }} />
          ) : (
            <span className={styles.qrLoading}>{failed ? "Couldn't make a code." : "Making a code…"}</span>
          )}
        </div>
        {code && (
          <p className={styles.shortCode}>
            or type <strong>{code.shortCode.slice(0, 3)} {code.shortCode.slice(3)}</strong> at <strong>/capture</strong>
          </p>
        )}
        {failed && (
          <button type="button" className="btn" onClick={refreshCode}>
            Try again
          </button>
        )}
        <ol>
          <li>Point the phone&apos;s camera at this code and open the link</li>
          <li>Photos you take land here in seconds</li>
        </ol>
        <p className={styles.note}>The code changes every 2 minutes and works once. A paired phone stays connected for 12 hours.</p>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.small}>Paired phones</h2>
        {justPaired && (
          <p role="status" className={styles.paired}>
            Phone paired.
          </p>
        )}
        {devices === null && <p className={styles.note}>Loading…</p>}
        {devices?.length === 0 && <p className={styles.note}>No phones paired yet.</p>}
        {devices?.map((d) => (
          <div key={d.id} className={styles.device}>
            <span className={styles.deviceIcon}>
              <PhoneIcon size={16} />
            </span>
            <span className={styles.deviceText}>
              <span>{d.label}</span>
              <span className={styles.meta}>Active · until {timeOf(d.expiresAt)}</span>
            </span>
            <button type="button" className="btn" onClick={() => revoke(d.id)}>
              Revoke
            </button>
          </div>
        ))}
      </section>
    </aside>
  );
}
