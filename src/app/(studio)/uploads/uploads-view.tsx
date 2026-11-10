"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AssetArt } from "@/components/artwork";
import { useStudioChanges } from "@/lib/supabase/browser";
import type { Asset, AssetKind } from "@/lib/types";
import { PairPanel } from "./pair-panel";
import { UploadButton } from "./upload-button";
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

export function UploadsView({ studioId, assets, clients }: { studioId: string; assets: Asset[]; clients: string[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<AssetKind | "all">("all");
  const [client, setClient] = useState("all");

  // A photo sent from the phone (or an upload in another tab) re-renders the list from the server, with fresh signed URLs.
  useStudioChanges("assets", studioId, () => router.refresh());

  const visible = assets.filter(
    (a) => (kind === "all" || a.kind === kind) && (client === "all" || a.clientName === client),
  );
  const fresh = assets.filter((a) => a.isNew && a.fromPhone);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.heading}>
          <div>
            <h1>Uploads</h1>
            <p>Everything shot on the studio phone or dropped in here, filed by client.</p>
          </div>
          <UploadButton />
        </div>

        {fresh.length > 0 && (
          <div role="status" className={styles.arrival}>
            <span className={styles.dot} aria-hidden="true" />
            <span>
              <strong>{fresh.length === 1 ? "1 new photo" : `${fresh.length} new photos`}</strong> from Studio phone
              {fresh[0].clientName && ` for ${fresh[0].clientName}`} · {fresh[0].createdLabel}
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
                  {asset.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- signed storage URL, not optimisable by next/image
                    <img src={asset.imageUrl} alt="" loading="lazy" className={asset.kind === "design" ? styles.thumbDesign : styles.thumbImg} />
                  ) : (
                    <AssetArt kind={asset.kind} />
                  )}
                  <span className={styles.kind}>{KIND_LABEL[asset.kind]}</span>
                  {asset.isNew && <span className={styles.new}>New</span>}
                </div>
                <span className={styles.title}>{asset.title}</span>
                <span className={styles.meta}>
                  {asset.clientName ?? (asset.kind === "design" ? "Flash" : "No client yet")} · {asset.createdLabel}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {visible.length === 0 && (
          <p className={styles.empty}>
            {assets.length === 0
              ? "No uploads yet. Pair the studio phone, and photos you take will appear here."
              : "Nothing here yet for this filter."}
          </p>
        )}
      </main>

      <PairPanel studioId={studioId} />
    </div>
  );
}
