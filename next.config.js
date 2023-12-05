/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "export",
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  // experimental: {
  //   serverActions: true,
  // },
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
