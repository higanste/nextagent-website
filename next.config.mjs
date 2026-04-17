// next.config.mjs — Next.js 15 + Cloudflare Pages compatible
import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Exclude Node.js-only modules that cannot run in Cloudflare Edge Workers
  webpack: (config, { isServer }) => {
    if (!isServer) return config;
    config.externals = config.externals || [];
    config.externals.push('mammoth', 'pdf-parse', 'canvas', 'pdfjs-dist');
    return config;
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
