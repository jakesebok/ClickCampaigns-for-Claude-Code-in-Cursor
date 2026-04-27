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
      { source: "/assessment/drivers", destination: "/vapi/vapi-driver-library.html" },
      { source: "/assessment/archetypes", destination: "/vapi/vapi-archetype-library.html" },
    ];
  },
  async redirects() {
    return [
      { source: "/work-with-me/freedom-workshop", destination: "/", permanent: true },
      { source: "/work-with-me/freedom-builders", destination: "/", permanent: true },
      { source: "/work-with-me/strategic-intensives", destination: "/", permanent: true },
      { source: "/work-with-me/aligned-leaders", destination: "/", permanent: true },
      { source: "/homepage", destination: "/", permanent: true },
      { source: "/homepage-2", destination: "/", permanent: true },
    ];
  },
};

module.exports = nextConfig;
