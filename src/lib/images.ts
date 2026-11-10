// Runs in the browser before anything is uploaded. Photos are redrawn through a canvas, which
// re-encodes them as plain JPEG and drops EXIF, so GPS location never leaves the device.
// Designs (PNG, WebP) are sent untouched, since redrawing would lose their transparency.

const MAX_EDGE = 4096;

export type PreparedImage = { blob: Blob; width: number; height: number; kind: "photo" | "design" };

export const DESIGN_TYPES = ["image/png", "image/webp"];

function encode(source: CanvasImageSource, sourceWidth: number, sourceHeight: number): Promise<PreparedImage> {
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
    canvas.toBlob(
      (blob) => (blob ? resolve({ blob, width, height, kind: "photo" }) : reject(new Error("Couldn't encode the photo."))),
      "image/jpeg",
      0.9,
    ),
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

// PNG and WebP files are treated as designs; anything else is a photo.
export async function imageFromFile(file: File): Promise<PreparedImage> {
  if (!DESIGN_TYPES.includes(file.type)) return photoFromFile(file);
  const bitmap = await createImageBitmap(file);
  const prepared: PreparedImage = { blob: file, width: bitmap.width, height: bitmap.height, kind: "design" };
  bitmap.close();
  return prepared;
}

// XHR rather than fetch, because fetch can't report upload progress.
export function putWithProgress(url: string, blob: Blob, onProgress: (fraction: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", blob.type);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      // S3-style stores explain themselves in an XML <Code>, e.g. NoSuchBucket or SignatureDoesNotMatch.
      const code = /<Code>([^<]+)<\/Code>/.exec(xhr.responseText)?.[1];
      reject(new Error(`Upload failed (${xhr.status}${code ? `, ${code}` : ""}).`));
    };
    xhr.onerror = () => reject(new Error("No connection. Check the Wi-Fi."));
    xhr.send(blob);
  });
}
