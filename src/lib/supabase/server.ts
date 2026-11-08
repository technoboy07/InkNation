import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { supabaseEnv } from "./config";

// Acts as the signed-in user, so row-level security applies.
export async function createUserClient() {
  const env = supabaseEnv();
  if (!env) throw new Error("Supabase is not configured. Copy .env.example to .env.local.");
  // Session checks compare token expiry with the clock, so they only run at request time.
  await connection();
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components can't set cookies; the proxy refreshes the session instead.
        }
      },
    },
  });
}

// Bypasses row-level security. Only for requests from paired phones, after their token is checked.
export function createServiceClient() {
  const env = supabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !serviceKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set.");
  return createClient(env.url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
