import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  // @ts-expect-error - Next 16 runtime reads top-level serverActions, type still under experimental
  serverActions: {
    bodySizeLimit: "5mb",
  },
};

export default nextConfig;
