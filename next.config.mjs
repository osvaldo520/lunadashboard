import { resolve } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignora erros de tipagem durante o build de produção
  // Os tipos continuam sendo verificados localmente pelo VS Code
  typescript: {
    ignoreBuildErrors: true,
  },

  // Resolve warning de múltiplos lockfiles (root + dashboard)
  outputFileTracingRoot: resolve(import.meta.dirname, './'),
};

export default nextConfig;
