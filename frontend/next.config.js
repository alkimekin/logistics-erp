/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_HOST: "10.1.1.21",
    NEXT_PORT: 80,
    API_HOST: "10.1.1.21",
    API_PORT: 8000,
  },
};

module.exports = nextConfig;
