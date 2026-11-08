"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, ChevronDownIcon, CloseIcon, FlashIcon } from "@/components/icons";
import styles from "./camera.module.css";

type CameraStatus = "idle" | "starting" | "live" | "blocked";

// The camera starts on a tap, not on load: iOS Safari is more reliable with a user gesture.
export function CameraView({ clientName, bodyPart }: { clientName: string; bodyPart: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlsRef = useRef<string[]>([]);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [mode, setMode] = useState<"photo" | "ruler">("photo");
  const [shots, setShots] = useState<string[]>([]);

  useEffect(() => {
    // Same array that addShot pushes into, so the cleanup sees every URL.
    const urls = urlsRef.current;
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  function addShot(blob: Blob) {
    const url = URL.createObjectURL(blob);
    urlsRef.current.push(url);
    setShots((prev) => [...prev, url]);
  }

  async function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("blocked");
      return;
    }
    setStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 4096 }, height: { ideal: 4096 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setStatus("live");
    } catch {
      setStatus("blocked");
    }
  }

  function takePhoto() {
    const video = videoRef.current;
    if (status !== "live" || !video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    // TODO: resize to 4096 px long edge, then upload to the presigned R2 URL from the API.
    canvas.toBlob((blob) => blob && addShot(blob), "image/jpeg", 0.92);
  }

  function pickFromGallery(files: FileList | null) {
    // TODO: convert HEIC to JPEG and strip EXIF location before upload.
    Array.from(files ?? []).forEach(addShot);
  }

  const latest = shots.at(-1);

  return (
    <main className={styles.camera}>
      <div className={styles.top}>
        <Link href="/capture" className={styles.round} aria-label="Close camera">
          <CloseIcon />
        </Link>
        <button type="button" className={styles.client}>
          For {clientName} · {bodyPart}
          <ChevronDownIcon size={14} />
        </button>
        <button type="button" className={styles.round} aria-label="Flash off">
          <FlashIcon />
        </button>
      </div>

      <div className={styles.viewfinder}>
        <video ref={videoRef} className={styles.video} playsInline muted data-live={status === "live"} />
        {status !== "live" && <div className={styles.limb} aria-hidden="true" />}
        {status !== "live" && (
          <div className={styles.offline}>
            {status === "blocked" ? (
              <p>Camera access is off. Allow it in the browser settings, or pick photos from the gallery below.</p>
            ) : (
              <button type="button" className="btn" onClick={startCamera} disabled={status === "starting"}>
                {status === "starting" ? "Starting camera…" : "Turn on camera"}
              </button>
            )}
          </div>
        )}
        <div className={styles.guide} aria-hidden="true" />
        <span className={styles.tip}>
          {mode === "ruler" ? "Place the scale card flat on the skin" : "Fit the whole area inside the frame"}
        </span>
      </div>

      <div role="group" aria-label="Capture mode" className={styles.modes}>
        <button type="button" aria-pressed={mode === "photo"} onClick={() => setMode("photo")}>
          Photo
        </button>
        <button type="button" aria-pressed={mode === "ruler"} onClick={() => setMode("ruler")}>
          Ruler card
        </button>
      </div>

      <div className={styles.controls}>
        <label className={styles.stack} aria-label="Pick photos from the gallery">
          {latest ? (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
            <img src={latest} alt="" className={styles.stackImg} />
          ) : (
            <span className={styles.stackEmpty}>Gallery</span>
          )}
          {shots.length > 0 && <span className={styles.badge}>{shots.length}</span>}
          <input type="file" accept="image/*" multiple className="visually-hidden" onChange={(e) => pickFromGallery(e.target.files)} />
        </label>

        <button type="button" className={styles.shutter} aria-label="Take photo" onClick={takePhoto} disabled={status !== "live"}>
          <span />
        </button>

        {shots.length > 0 ? (
          <Link href="/capture/sent" className={styles.send}>
            Send {shots.length}
            <ArrowRightIcon size={16} />
          </Link>
        ) : (
          <span className={styles.sendPlaceholder} aria-hidden="true" />
        )}
      </div>
    </main>
  );
}
