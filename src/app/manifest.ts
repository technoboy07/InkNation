import type { MetadataRoute } from "next";

// Lets studio staff add the capture app to the phone's home screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "InkNation Capture",
    short_name: "InkNation",
    description: "Take client photos and send them straight to your studio's InkNation workspace.",
    start_url: "/capture",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fafaf8",
    theme_color: "#0e0e0e",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
