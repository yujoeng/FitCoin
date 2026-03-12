/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Three.js 등 브라우저 전용 모듈을 위한 webpack 설정
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
};

module.exports = nextConfig;
