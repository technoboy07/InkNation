"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { RealtimeChannel, SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useRef } from "react";

let client: SupabaseClient | null = null;

// One client per tab. It reads the session cookie the server set, so Realtime respects row-level security.
function browserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;
  client ??= createBrowserClient(url, anonKey);
  return client;
}

// Calls onChange whenever a row of this studio's table is inserted, updated or deleted.
export function useStudioChanges(table: "assets" | "paired_devices", studioId: string, onChange: () => void) {
  const callback = useRef(onChange);
  useEffect(() => {
    callback.current = onChange;
  });

  useEffect(() => {
    const supabase = browserClient();
    if (!supabase) return;
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    // Join with the user's token, not the anon key: row-level security decides which rows' changes
    // arrive, so a channel joined before the session loads receives nothing.
    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled || !data.session) return;
      await supabase.realtime.setAuth(data.session.access_token);
      if (cancelled) return;
      channel = supabase
        .channel(`${table}:${studioId}`)
        .on("postgres_changes", { event: "*", schema: "public", table, filter: `studio_id=eq.${studioId}` }, () => callback.current())
        .subscribe();
    });
    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, [table, studioId]);
}
