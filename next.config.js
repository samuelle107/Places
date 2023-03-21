/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{ hostname: 'fastly.4sqi.net', protocol: 'https' }],
  },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/map',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
