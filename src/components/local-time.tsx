"use client";

// Formats on the device, so the time is in the viewer's timezone rather than the server's.
export function LocalTime({ iso }: { iso: string }) {
  return (
    <time dateTime={iso} suppressHydrationWarning>
      {new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </time>
  );
}
