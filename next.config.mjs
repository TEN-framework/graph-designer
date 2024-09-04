/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/ai-agent',
  // output: 'test',
  output: "standalone",
  reactStrictMode: false,
  async rewrites() {
    const { TEN_DEV_SERVER_URL } = process.env;

    // Check if environment variables are available
    if (!TEN_DEV_SERVER_URL) {
      throw "Environment variables TEN_DEV_SERVER_URL are not available";
    }
    return [
      {
        source: '/api/dev-server/v1/:path*',
        destination: `${TEN_DEV_SERVER_URL}/api/dev-server/v1/:path*`,
      },
    ];
  },
}

export default nextConfig
