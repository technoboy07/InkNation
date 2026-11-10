"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { UploadIcon } from "@/components/icons";
import { imageFromFile, putWithProgress } from "@/lib/images";
import { finishStudioUpload, startStudioUpload } from "./upload-actions";
import styles from "./uploads.module.css";

type Progress = { done: number; total: number; fraction: number; failures: string[] };

const titleFrom = (name: string) => name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();

// Uploads straight to storage, one file at a time. JPEGs become body photos (EXIF removed);
// PNG and WebP become designs, untouched so transparency survives.
export function UploadButton() {
  const router = useRouter();
  const [progress, setProgress] = useState<Progress | null>(null);

  async function upload(files: File[]) {
    if (files.length === 0) return;
    const failures: string[] = [];
    setProgress({ done: 0, total: files.length, fraction: 0, failures });

    for (const [i, file] of files.entries()) {
      try {
        const image = await imageFromFile(file);
        const ticket = await startStudioUpload(image.kind, image.blob.type);
        if ("error" in ticket) throw new Error(ticket.error);
        await putWithProgress(ticket.url, image.blob, (fraction) => setProgress((p) => p && { ...p, fraction }));
        const result = await finishStudioUpload({ key: ticket.key, title: titleFrom(file.name), width: image.width, height: image.height });
        if ("error" in result) throw new Error(result.error);
      } catch (e) {
        failures.push(`${file.name}: ${e instanceof Error ? e.message : "upload failed"}`);
      }
      setProgress({ done: i + 1, total: files.length, fraction: 0, failures: [...failures] });
    }
    router.refresh();
    if (failures.length === 0) setProgress(null);
  }

  const busy = progress !== null && progress.done < progress.total;

  return (
    <div className={styles.uploader}>
      <label className="btn btn-primary" aria-disabled={busy}>
        <UploadIcon size={16} />
        {busy ? `Uploading ${progress.done + 1} of ${progress.total}…` : "Upload files"}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/heic"
          multiple
          disabled={busy}
          className="visually-hidden"
          onChange={(e) => {
            upload(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
      </label>
      {busy && (
        <div role="progressbar" aria-label="Upload progress" aria-valuenow={Math.round(progress.fraction * 100)} aria-valuemin={0} aria-valuemax={100} className={styles.uploadBar}>
          <span style={{ width: `${progress.fraction * 100}%` }} />
        </div>
      )}
      {!busy && progress && progress.failures.length > 0 && (
        <div role="alert" className={styles.uploadErrors}>
          <ul>
            {progress.failures.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <button type="button" className="btn" onClick={() => setProgress(null)}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
