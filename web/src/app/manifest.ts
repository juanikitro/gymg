import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GyMG Consignataria de Hacienda",
    short_name: "GyMG",
    description: "Consignataria de hacienda en 25 de Mayo, Buenos Aires",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f8",
    theme_color: "#0a5634",
    icons: [
      { src: "/logo.png", sizes: "192x192", type: "image/png" },
      { src: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
