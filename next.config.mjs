import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Resolve warning de múltiplos lockfiles (root + dashboard)
  outputFileTracingRoot: resolve(import.meta.dirname, './'),

  // Evita problemas de file lock no Windows
  webpack: (config) => {
    config.snapshot = {
      ...(config.snapshot || {}),
      managedPaths: [],
    };
    return config;
  },
};

export default nextConfig;
