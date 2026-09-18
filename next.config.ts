import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces a minimal self-contained Node.js server for the final Docker image.
  output: "standalone",
};

export default nextConfig;
