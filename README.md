# InkNation

A studio tool for tattoo mockups. Staff photograph a client's body part on the studio phone, the photo lands in the studio's web workspace, and the artist cuts out a design, places and warps it onto the photo, and exports the mockup. No WhatsApp, no Photoshop.

The earlier 3D try-on prototype is shelved; it is in git history before this branch.

## Status

This is the UI scaffold. Every screen from the design is built with sample data; nothing is connected to a backend yet.

| Route | Screen | What works today |
| --- | --- | --- |
| `/uploads` | Uploads library and phone pairing panel | Kind and client filters |
| `/editor` | Mockup editor | Tool switching, layer show/hide/lock, blend mode, opacity, healed-look preview, zoom |
| `/capture` | Phone: pair with the studio | Layout only; the button skips to the camera |
| `/capture/camera` | Phone: camera | Real camera after a tap, shutter, gallery picker |
| `/capture/sent` | Phone: upload progress | Static |
| `/mockups`, `/clients`, `/flash` | Placeholders | — |

The editor preview uses CSS blend modes and filters as a stand-in. The real canvas will be a WebGL compositor (PixiJS) so mesh warp stays smooth on a 12 MP photo.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. For the phone screens, open `/capture` on a phone on the same network. Camera access needs HTTPS outside localhost, so use `next dev --experimental-https`.

## Stack

- Next.js 16 (App Router, Cache Components) with React 19 and TypeScript
- CSS modules; design tokens in `src/app/globals.css` ("Ink & Paper": paper ground, black ink, one ink-blue accent)
- Planned: Supabase (Postgres with row-level security, Auth, Realtime), Cloudflare R2 for files, Modal for the background-removal GPU fallback. See `.env.example` and `supabase/migrations/0001_init.sql`.

## Next steps

1. Supabase project, apply the migration, email-link sign-in.
2. Pairing: API route that issues a short-lived QR token, and phone uploads straight to R2 through presigned URLs.
3. Uploads list from the `assets` table, live through Realtime.
4. Editor engine on PixiJS: layers, transforms, mesh warp, history, autosave.
5. Background removal in the browser (BiRefNet via ONNX Runtime Web) plus line-art threshold mode.
