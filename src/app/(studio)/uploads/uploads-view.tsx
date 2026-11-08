"use client";

import Link from "next/link";
import { useState } from "react";
import { AssetArt } from "@/components/artwork";
import { PhoneIcon, UploadIcon } from "@/components/icons";
import { QrPlaceholder } from "@/components/qr-placeholder";
import type { Asset, AssetKind } from "@/lib/types";
import styles from "./uploads.module.css";

const KIND_FILTERS: { value: AssetKind | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "photo", label: "Body photos" },
  { value: "design", label: "Designs" },
  { value: "mockup", label: "Mockups" },
];

const KIND_LABEL: Record<AssetKind, string> = {
  photo: "Body photo",
  design: "Design",
  mockup: "Mockup",
};

export function UploadsView({ assets, clients }: { assets: Asset[]; clients: string[] }) {
  const [kind, setKind] = useState<AssetKind | "all">("all");
  const [client, setClient] = useState("all");

  const visible = assets.filter(
    (a) => (kind === "all" || a.kind === kind) && (client === "all" || a.clientName === client),
  );
  const fresh = assets.filter((a) => a.isNew);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <div>
            <h1>Uploads</h1>
            <p>Everything shot on the studio phone or dropped in here, filed by client.</p>
          </div>
          <label className="btn btn-primary">
            <UploadIcon size={16} />
            Upload files
            <input type="file" accept="image/png,image/jpeg,image/webp,image/heic,image/svg+xml" multiple className="visually-hidden" />
          </label>
        </div>

        {fresh.length > 0 && (
          <div role="status" className={styles.arrival}>
            <span className={styles.dot} aria-hidden="true" />
            <span>
              <strong>{fresh.length} new photos</strong> from Studio phone for {fresh[0].clientName} · just now
            </span>
            <Link href="/editor">Start a mockup →</Link>
          </div>
        )}

        <div className={styles.filters}>
          <div role="group" aria-label="Filter by kind" className={styles.segmented}>
            {KIND_FILTERS.map((f) => (
              <button key={f.value} type="button" aria-pressed={kind === f.value} onClick={() => setKind(f.value)}>
                {f.label}
              </button>
            ))}
          </div>
          <label className={styles.clientFilter}>
            Client
            <select value={client} onChange={(e) => setClient(e.target.value)}>
              <option value="all">All clients</option>
              {clients.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <span className={styles.count}>{visible.length} items</span>
        </div>

        <ul className={styles.grid}>
          {visible.map((asset) => (
            <li key={asset.id}>
              <Link href="/editor" className={styles.card}>
                <div className={styles.thumb}>
                  <AssetArt kind={asset.kind} />
                  <span className={styles.kind}>{KIND_LABEL[asset.kind]}</span>
                  {asset.isNew && <span className={styles.new}>New</span>}
                </div>
                <span className={styles.title}>{asset.title}</span>
                <span className={styles.meta}>
                  {asset.clientName ?? "Flash"} · {asset.createdLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {visible.length === 0 && <p className={styles.empty}>Nothing here yet for this filter.</p>}
      </main>

      <aside id="pair" aria-label="Pair a phone" className={styles.aside}>
        <section className={styles.panel}>
          <h2>Pair a phone</h2>
          <div className={styles.qr}>
            <QrPlaceholder label="Pairing QR code (placeholder)" />
          </div>
          <ol>
            <li>
              On the phone, open <strong>/capture</strong> on this site
            </li>
            <li>Scan this code</li>
            <li>Photos you take land here in seconds</li>
          </ol>
          <p className={styles.note}>The code changes every 2 minutes. A paired phone stays connected until 22:00.</p>
        </section>

        <section className={styles.panel}>
          <h2 className={styles.small}>Paired phones</h2>
          <div className={styles.device}>
            <span className={styles.deviceIcon}>
              <PhoneIcon size={16} />
            </span>
            <span className={styles.deviceText}>
              <span>Studio phone</span>
              <span className={styles.meta}>Active · until 22:00</span>
            </span>
            <button type="button" className="btn">
              Revoke
            </button>
          </div>
        </section>
      </aside>
    </div>
  );
}
