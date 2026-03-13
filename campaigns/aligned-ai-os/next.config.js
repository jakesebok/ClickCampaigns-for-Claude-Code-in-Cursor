// PWA temporarily disabled — next-pwa has compatibility issues with Next.js 15
// Can be re-enabled when a compatible package is available

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

module.exports = nextConfig;
