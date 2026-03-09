/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" },
    ],
  },
  async rewrites() {
    return [
      { source: "/assessment", destination: "/vapi/vapi-landing.html" },
      { source: "/assessment/start", destination: "/vapi/vapi-quiz.html" },
      { source: "/assessment/results", destination: "/vapi/vapi-results.html" },
    ];
  },
};

module.exports = nextConfig;
