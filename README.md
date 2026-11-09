# InkNation

A studio tool for tattoo mockups. Staff photograph a client's body part on the studio phone, the photo lands in the studio's web workspace, and the artist cuts out a design, places and warps it onto the photo, and exports the mockup. No WhatsApp, no Photoshop.

The earlier 3D try-on prototype is shelved; it is in git history before this branch.

## Status

Sign-in, studio setup, phone pairing and phone photo uploads work. The editor engine and background removal are still to come.

| Route | Screen | What works today |
| --- | --- | --- |
| `/sign-in`, `/setup` | Email-link sign-in, then name your studio | Real (Supabase Auth) |
| `/uploads` | Uploads library and phone pairing panel | The studio's photos with real thumbnails, updating live as the phone sends them; pairing QR and 6-digit code; paired phones with revoke |
| `/editor` | Mockup editor | Sample layers. Tool switching, layer show/hide/lock, blend mode, opacity, healed-look preview, zoom |
| `/capture` | Phone: pair with the studio | Real: QR link or 6-digit code pairs the phone for 12 hours; unpair |
| `/capture/camera` | Phone: camera and sending | Needs pairing. Camera or gallery; Send uploads each photo straight to storage with progress and retry |
| `/mockups`, `/clients`, `/flash` | Placeholders | — |

Studio routes need a signed-in user who belongs to a studio (`src/proxy.ts`, `src/lib/auth.ts`). Phone routes need the pairing cookie; phones never sign in. Their requests use the service role after the device token is checked (`src/lib/pairing.ts`).

Photos go from the phone straight to storage through short-lived signed URLs (`src/lib/storage.ts`, `src/app/capture/camera/upload-actions.ts`); the server only checks the file landed and records it in `assets`. Before sending, the phone redraws every photo through a canvas (`prepare-photo.ts`), which caps it at 4096 px and drops EXIF, GPS included. Storage is any S3-compatible bucket: Cloudflare R2 in production, Supabase Storage locally.

The editor preview uses CSS blend modes and filters as a stand-in. The real canvas will be a WebGL compositor (PixiJS) so mesh warp stays smooth on a 12 MP photo.

## Run it

Needs Docker for the local Supabase stack.

```bash
npm install
npx supabase start
npx supabase status -o env   # copy the Supabase and S3 values into .env.local (see .env.example)
npm run dev
```

`.env.local` uses the names in `.env.example`. For local storage use `STORAGE_S3_URL` and the `S3_PROTOCOL_*` keys from that output with region `local`; `supabase/seed.sql` creates the bucket.

Open http://localhost:3000 and sign in. Locally, sign-in emails are caught by Mailpit at http://localhost:54324. `supabase/config.toml` allows redirects back to ports 3000 and 3100.

To pair a real phone, it has to reach the dev server: set `NEXT_PUBLIC_SITE_URL` to your computer's LAN address (or a tunnel) so the QR code points there. Camera access needs HTTPS outside localhost, so use `next dev --experimental-https`.

## Stack

- Next.js 16 (App Router, Cache Components) with React 19 and TypeScript
- CSS modules; design tokens in `src/app/globals.css` ("Ink & Paper": paper ground, black ink, one ink-blue accent)
- Planned: Supabase (Postgres with row-level security, Auth, Realtime), Cloudflare R2 for files, Modal for the background-removal GPU fallback. See `.env.example` and `supabase/migrations/0001_init.sql`.

## Next steps

1. Hosted Supabase project and an R2 bucket (with CORS for the site's origin) for the Vercel deployment.
2. Small thumbnails: the grid loads full-size photos today. Also a storage lifecycle rule to clear uploads that were never confirmed.
3. Assign photos to clients, from the phone or the studio.
4. Editor engine on PixiJS: layers, transforms, mesh warp, history, autosave.
5. Background removal in the browser (BiRefNet via ONNX Runtime Web) plus line-art threshold mode.
