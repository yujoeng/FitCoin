/** @type {import('next').NextConfig} */
const nextConfig = {
  // Three.js 등 브라우저 전용 모듈을 위한 webpack 설정
  webpack: (config) => {
    config.externals = [...(config.externals || [])];
    return config;
  },
};

export default nextConfig;
