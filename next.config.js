/** @type {import('next').NextConfig} */
const nextConfig = {
  fastRefresh: true,
  optimizeFonts: false, // Disable font optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // experimental: {
  //   serverActions: true,
  // },
  // trailingSlash: true,
};

module.exports = nextConfig;
