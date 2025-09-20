import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Explicitly set root to silence multiple lockfile root inference warning
    root: __dirname,
  },
};

export default nextConfig;
