import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apps.odoocdn.com",
      },
    ],
  },
};

export default nextConfig;
