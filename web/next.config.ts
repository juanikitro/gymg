import type { NextConfig } from "next";

// output: "export"           → generates web/out/ with plain HTML/CSS/JS
// trailingSlash: true        → /page → /page/index.html (required for Apache)
// images.unoptimized: true   → disables Next.js image optimization API
//                              (it requires a running server; static export can't use it)
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
