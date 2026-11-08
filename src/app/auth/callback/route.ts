import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth";
import { createUserClient } from "@/lib/supabase/server";

// The email link lands here with a one-time code, which becomes the session cookie.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (code) {
    const supabase = await createUserClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, request.url));
  }
  return NextResponse.redirect(new URL("/sign-in?error=link", request.url));
}
