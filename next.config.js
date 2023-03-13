/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: 'fastly.4sqi.net', protocol: 'https' }],
  },
};

module.exports = nextConfig;
