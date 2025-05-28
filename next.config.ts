import type { NextConfig } from "next";
const nextI18NextConfig = require('./next-i18next.config');

const nextConfig: NextConfig = {
  /* config options here */
  ...nextI18NextConfig,
  experimental: {
    appDir: true,
  },
};

export default nextConfig;
