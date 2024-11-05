const withTM = require('next-transpile-modules')([
  '@sky-mavis/mavis-market-core',
  '@sky-mavis/tanto-connect',
  '@sky-mavis/tanto-wagmi',
]);

const chainId = process.env.CHAIN_ID;
const waypointClientId = process.env.WAYPOINT_CLIENT_ID;

const nextConfig = withTM({
  reactStrictMode: true,
  env: {
    chainId,
    waypointClientId,
  },
  publicRuntimeConfig: {
    chainId,
    waypointClientId,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
});

module.exports = nextConfig;
