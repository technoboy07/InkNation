import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { DEVICE_COOKIE } from "@/lib/pairing-cookie";
import { supabaseEnv } from "@/lib/supabase/config";

const STUDIO_PATHS = ["/uploads", "/editor", "/mockups", "/clients", "/flash", "/setup"];
const DEVICE_PATHS = ["/capture/camera"];

const startsWithAny = (path: string, prefixes: string[]) =>
  prefixes.some((p) => path === p || path.startsWith(`${p}/`));

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The phone screens need a paired-device cookie. The token itself is checked on upload.
  if (startsWithAny(pathname, DEVICE_PATHS)) {
    return request.cookies.has(DEVICE_COOKIE)
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/capture", request.url));
  }

  const env = supabaseEnv();
  if (!env) {
    return startsWithAny(pathname, STUDIO_PATHS)
      ? NextResponse.redirect(new URL("/sign-in", request.url))
      : NextResponse.next();
  }

  // Refresh the Supabase session cookie on every studio request.
  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims && startsWithAny(pathname, STUDIO_PATHS)) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("next", pathname);
    return NextResponse.redirect(signIn);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:png|jpg|svg|webp|ico)$).*)"],
};
