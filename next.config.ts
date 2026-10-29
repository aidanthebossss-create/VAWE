import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["10.0.0.166", "10.0.0.168", "172.20.10.2"],
};

export default nextConfig;
