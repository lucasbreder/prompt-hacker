import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "cms-prompthacker.sudu.dev",
      },
      {
        protocol: "https",
        hostname: "cms.prompterhacker.io",
      },
    ],
  },
};

export default nextConfig;
