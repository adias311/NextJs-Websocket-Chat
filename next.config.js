/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io"
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/socket/:path*',
        destination: '/api/socket/io', 
      },
    ];
  },
}

module.exports = nextConfig;
