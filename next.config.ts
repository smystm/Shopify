import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    globalNotFound: true
  },
  images:{
    domains: [""] // use it for a external images 
  }
};

export default nextConfig;
