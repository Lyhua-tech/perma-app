import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // frontend path
        destination: "http://localhost:3333/api/:path*", // backend target
      },
    ];
  },
};

export default nextConfig;
