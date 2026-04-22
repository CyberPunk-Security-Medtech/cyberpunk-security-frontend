import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/dashboard/lab-scientist-dashboard",
        destination: "/dashboard/lab-scientist",
        permanent: false,
      },
      {
        source: "/dashboard/lab-scientist-dashboard/:path*",
        destination: "/dashboard/lab-scientist/:path*",
        permanent: false,
      },
    ];
  },
   allowedDevOrigins: ["http://localhost:3001",
    "10.23.180.78"
  ],

  async rewrites() {
    return [
      {
        source: `/api/:path*`,
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias["yjs"] = path.resolve(__dirname, "node_modules/yjs");
      config.cache = false; // Disable caching
    }
    return config;
  },
};

export default nextConfig;
