// Runs on the phone before anything is sent. Redrawing through a canvas re-encodes the image as a
// plain JPEG, which drops EXIF, so GPS location never leaves the phone.

const MAX_EDGE = 4096;

export type PreparedPhoto = { blob: Blob; width: number; height: number };

function encode(source: CanvasImageSource, sourceWidth: number, sourceHeight: number): Promise<PreparedPhoto> {
  const scale = Math.min(1, MAX_EDGE / Math.max(sourceWidth, sourceHeight));
  const width = Math.round(sourceWidth * scale);
  const height = Math.round(sourceHeight * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas is not available."));
  ctx.drawImage(source, 0, 0, width, height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve({ blob, width, height }) : reject(new Error("Couldn't encode the photo."))), "image/jpeg", 0.9),
  );
}

export const photoFromVideo = (video: HTMLVideoElement) => encode(video, video.videoWidth, video.videoHeight);

// HEIC decodes only where the browser supports it (Safari); elsewhere this rejects.
export async function photoFromFile(file: File) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    return await encode(bitmap, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}

// XHR rather than fetch, because fetch can't report upload progress.
export function putWithProgress(url: string, blob: Blob, onProgress: (fraction: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", "image/jpeg");
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status}).`)));
    xhr.onerror = () => reject(new Error("No connection. Check the phone's Wi-Fi."));
    xhr.send(blob);
  });
}
