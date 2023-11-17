/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack : (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    })
    return config;  
  },
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
