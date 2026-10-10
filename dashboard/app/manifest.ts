import type {MetadataRoute} from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "A Day Back Then — Ops",
    short_name: "DayBackThen Ops",
    description: "Content operations dashboard for the A Day Back Then shorts pipeline",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {src: "/icon.png", sizes: "512x512", type: "image/png"},
      {src: "/apple-icon.png", sizes: "180x180", type: "image/png"},
    ],
  };
}
