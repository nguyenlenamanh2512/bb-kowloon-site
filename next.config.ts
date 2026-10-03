import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained Node.js server for the final Docker image.
  output: "standalone",
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    serverActions: {
      bodySizeLimit: "64mb",
    },
  },
};

export default nextConfig;
