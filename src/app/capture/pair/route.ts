import { NextResponse, type NextRequest } from "next/server";
import { redeemPairingCode } from "@/lib/pairing";

// The studio's QR code links here. The phone's camera app opens it, and the phone is paired.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("t");
  const studio = token ? await redeemPairingCode({ token }) : null;
  return NextResponse.redirect(new URL(studio ? "/capture/camera" : "/capture?error=expired", request.url));
}
