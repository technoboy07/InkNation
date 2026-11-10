"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRightIcon, CheckIcon, CloseIcon, FlashIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { photoFromFile, photoFromVideo, putWithProgress, type PreparedImage } from "@/lib/images";
import { finishPhotoUpload, startPhotoUpload } from "./upload-actions";
import captureStyles from "../capture.module.css";
import styles from "./camera.module.css";

type CameraStatus = "idle" | "starting" | "live" | "blocked";

type Shot = {
  id: string;
  title: string;
  previewUrl: string;
  photo: PreparedImage;
  state: "ready" | "sending" | "sent" | "failed";
  progress: number;
  error?: string;
};

const clockTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const fileSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

// The camera starts on a tap, not on load: iOS Safari is more reliable with a user gesture.
export function CameraView({ studioName }: { studioName: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const urlsRef = useRef<string[]>([]);
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [mode, setMode] = useState<"photo" | "ruler">("photo");
  const [shots, setShots] = useState<Shot[]>([]);
  const [phase, setPhase] = useState<"capture" | "send">("capture");
  const [pickError, setPickError] = useState<string | null>(null);

  useEffect(() => {
    // Same array that addShot pushes into, so the cleanup sees every URL.
    const urls = urlsRef.current;
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  function addShot(photo: PreparedImage) {
    const previewUrl = URL.createObjectURL(photo.blob);
    urlsRef.current.push(previewUrl);
    const shot: Shot = { id: crypto.randomUUID(), title: `Photo ${clockTime()}`, previewUrl, photo, state: "ready", progress: 0 };
    setShots((prev) => [...prev, shot]);
  }

  const updateShot = (id: string, patch: Partial<Shot>) =>
    setShots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus("idle");
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

  async function takePhoto() {
    const video = videoRef.current;
    if (status !== "live" || !video) return;
    addShot(await photoFromVideo(video));
  }

  async function pickFromGallery(files: FileList | null) {
    setPickError(null);
    for (const file of Array.from(files ?? [])) {
      try {
        addShot(await photoFromFile(file));
      } catch {
        setPickError(`Couldn't open ${file.name}. Try a JPEG or PNG.`);
      }
    }
  }

  async function sendShot(shot: Shot) {
    updateShot(shot.id, { state: "sending", progress: 0, error: undefined });
    try {
      const ticket = await startPhotoUpload();
      if ("error" in ticket) throw new Error(ticket.error);
      await putWithProgress(ticket.url, shot.photo.blob, (progress) => updateShot(shot.id, { progress }));
      const result = await finishPhotoUpload({ key: ticket.key, title: shot.title, width: shot.photo.width, height: shot.photo.height });
      if ("error" in result) throw new Error(result.error);
      updateShot(shot.id, { state: "sent", progress: 1 });
    } catch (e) {
      updateShot(shot.id, { state: "failed", error: e instanceof Error ? e.message : "Upload failed." });
    }
  }

  // One at a time, so a weak connection gives each photo its full bandwidth.
  async function startSending() {
    stopCamera();
    setPhase("send");
    for (const shot of shots.filter((s) => s.state !== "sent")) await sendShot(shot);
  }

  function takeMore() {
    shots.forEach((s) => URL.revokeObjectURL(s.previewUrl));
    urlsRef.current.length = 0;
    setShots([]);
    setPhase("capture");
  }

  if (phase === "send") {
    const sending = shots.some((s) => s.state === "sending" || s.state === "ready");
    const failed = shots.some((s) => s.state === "failed");
    return (
      <main className={captureStyles.screen}>
        <Logo label="InkNation Capture" />
        <div className={captureStyles.intro}>
          {!sending && !failed && (
            <span className={captureStyles.success}>
              <CheckIcon size={26} strokeWidth={2.4} />
            </span>
          )}
          <h1>{sending ? "Sending to the studio…" : failed ? "Some photos didn't send" : "On the studio screen"}</h1>
          <p>In {studioName}&apos;s Uploads. Location data was removed before sending.</p>
        </div>

        <ul className={captureStyles.sentList}>
          {shots.map((shot) => (
            <li key={shot.id}>
              <div className={captureStyles.sentRow}>
                {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                <img src={shot.previewUrl} alt="" className={captureStyles.sentThumb} />
                <span className={captureStyles.sentText}>
                  <span>{shot.title}</span>
                  <span className={captureStyles.fine}>
                    {shot.state === "ready" && "Waiting…"}
                    {shot.state === "sending" && `Sending · ${Math.round(shot.progress * 100)}%`}
                    {shot.state === "sent" && fileSize(shot.photo.blob.size)}
                    {shot.state === "failed" && shot.error}
                  </span>
                </span>
                {shot.state === "sent" && <strong>Sent</strong>}
                {shot.state === "failed" && (
                  <button type="button" className="btn" onClick={() => sendShot(shot)}>
                    Retry
                  </button>
                )}
              </div>
              {shot.state === "sending" && (
                <div
                  role="progressbar"
                  aria-label={`Upload progress, ${shot.title}`}
                  aria-valuenow={Math.round(shot.progress * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className={captureStyles.progress}
                >
                  <span style={{ width: `${shot.progress * 100}%` }} />
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className={captureStyles.footer}>
          <button type="button" className={`btn btn-primary ${captureStyles.tall}`} onClick={takeMore} disabled={sending}>
            Take more
          </button>
        </div>
      </main>
    );
  }

  const latest = shots.at(-1);

  return (
    <main className={styles.camera}>
      <div className={styles.top}>
        <Link href="/capture" className={styles.round} aria-label="Close camera">
          <CloseIcon />
        </Link>
        <span className={styles.client}>To {studioName}</span>
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
          {pickError ?? (mode === "ruler" ? "Place the scale card flat on the skin" : "Fit the whole area inside the frame")}
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
            <img src={latest.previewUrl} alt="" className={styles.stackImg} />
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
          <button type="button" className={styles.send} onClick={startSending}>
            Send {shots.length}
            <ArrowRightIcon size={16} />
          </button>
        ) : (
          <span className={styles.sendPlaceholder} aria-hidden="true" />
        )}
      </div>
    </main>
  );
}
