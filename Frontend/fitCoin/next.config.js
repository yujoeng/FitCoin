/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false,
});

const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'j14a504.p.ssafy.io',
      },
    ],
  },
  // Three.js 등 브라우저 전용 모듈을 위한 webpack 설정
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
};

module.exports = withPWA(nextConfig);