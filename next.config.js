/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, buildId, dev, webpack }) => {
    // Important: return the modified config
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });
    return config;
  },
};

module.exports = nextConfig;
