import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudflare-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "cdn.orin.se" },
      // Local file provider in dev
      { protocol: "http", hostname: "localhost", port: "9000" },
    ],
  },
};

export default nextConfig;
