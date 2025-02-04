/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb", // ou la limite que vous souhaitez
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        express: false,
        "@adminjs/express": false,
      };
    }
    return config;
  },
};

export default nextConfig;
