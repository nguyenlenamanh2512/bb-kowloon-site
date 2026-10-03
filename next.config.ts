import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained Node.js server for the final Docker image.
  output: "standalone",
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    serverActions: {
      bodySizeLimit: "64mb",
    },
  },
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^cloudflare:workers$/,
        path.resolve(process.cwd(), "lib/cloudflare-workers-node-shim.ts"),
      ),
    );
    return config;
  },
};

export default nextConfig;
