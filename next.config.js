const withTM = require('next-transpile-modules')(['@sky-mavis/mavis-market-core', '@sky-mavis/tanto-connect']);

const chainId = process.env.CHAIN_ID;

const nextConfig = withTM({
  reactStrictMode: true,
  env: {
    chainId,
  },
  publicRuntimeConfig: {
    chainId,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});

module.exports = nextConfig;
