import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudflare-loader.ts",
    remotePatterns: [
      { protocol: "https", hostname: "cdn.orin.se" },
    ],
  },
};

export default nextConfig;
