import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      // Future: add Payload CMS media hostname here
    ],
  },
};

export default nextConfig;
