# InkNation

A studio tool for tattoo mockups. Staff photograph a client's body part on the studio phone, the photo lands in the studio's web workspace, and the artist cuts out a design, places and warps it onto the photo, and exports the mockup. No WhatsApp, no Photoshop.

The earlier 3D try-on prototype is shelved; it is in git history before this branch.

## Status

Sign-in, studio setup and phone pairing run on Supabase. Photo uploads, the editor engine and background removal are still to come.

| Route | Screen | What works today |
| --- | --- | --- |
| `/sign-in`, `/setup` | Email-link sign-in, then name your studio | Real (Supabase Auth) |
| `/uploads` | Uploads library and phone pairing panel | Lists the studio's assets; live pairing QR and 6-digit code; paired phones with revoke |
| `/editor` | Mockup editor | Sample layers. Tool switching, layer show/hide/lock, blend mode, opacity, healed-look preview, zoom |
| `/capture` | Phone: pair with the studio | Real: QR link or 6-digit code pairs the phone for 12 hours; unpair |
| `/capture/camera` | Phone: camera | Needs pairing. Real camera after a tap, shutter, gallery picker; sending isn't wired yet |
| `/capture/sent` | Phone: upload progress | Static |
| `/mockups`, `/clients`, `/flash` | Placeholders | — |

Studio routes need a signed-in user who belongs to a studio (`src/proxy.ts`, `src/lib/auth.ts`). Phone routes need the pairing cookie; phones never sign in. Their requests use the service role after the device token is checked (`src/lib/pairing.ts`).

The editor preview uses CSS blend modes and filters as a stand-in. The real canvas will be a WebGL compositor (PixiJS) so mesh warp stays smooth on a 12 MP photo.

## Run it

Needs Docker for the local Supabase stack.

```bash
npm install
npx supabase start
npx supabase status -o env   # copy API_URL, ANON_KEY and SERVICE_ROLE_KEY into .env.local
npm run dev
```

`.env.local` uses the names in `.env.example`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

Open http://localhost:3000 and sign in. Locally, sign-in emails are caught by Mailpit at http://localhost:54324. `supabase/config.toml` allows redirects back to ports 3000 and 3100.

To pair a real phone, it has to reach the dev server: set `NEXT_PUBLIC_SITE_URL` to your computer's LAN address (or a tunnel) so the QR code points there. Camera access needs HTTPS outside localhost, so use `next dev --experimental-https`.

## Stack

- Next.js 16 (App Router, Cache Components) with React 19 and TypeScript
- CSS modules; design tokens in `src/app/globals.css` ("Ink & Paper": paper ground, black ink, one ink-blue accent)
- Planned: Supabase (Postgres with row-level security, Auth, Realtime), Cloudflare R2 for files, Modal for the background-removal GPU fallback. See `.env.example` and `supabase/migrations/0001_init.sql`.

## Next steps

1. Phone uploads straight to R2 through presigned URLs, recorded in `assets`.
2. Uploads screen live through Realtime (replaces the pairing panel's polling, too).
3. Hosted Supabase project for the Vercel deployment.
4. Editor engine on PixiJS: layers, transforms, mesh warp, history, autosave.
5. Background removal in the browser (BiRefNet via ONNX Runtime Web) plus line-art threshold mode.
