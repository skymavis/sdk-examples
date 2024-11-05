import { roninWallet, waypoint } from '@sky-mavis/tanto-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { walletConnect } from '@wagmi/connectors';
import React, { FC } from 'react';
import { ronin, saigon } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';

import { roninWalletConnectConfigs, waypointConfigs } from '../../../src/tanto-connect-kit/common/constant';
import WagmiAccount from '../../../src/tanto-connect-kit/components/tanto-wagmi/TantoWagmi';

const config = createConfig({
  chains: [ronin, saigon],
  transports: {
    [ronin.id]: http(),
    [saigon.id]: http(),
  },
  connectors: [roninWallet(), waypoint(waypointConfigs), walletConnect(roninWalletConnectConfigs)],
  multiInjectedProviderDiscovery: false,
  ssr: true,
});

const queryClient = new QueryClient();

const WagmiExample: FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WagmiAccount />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiExample;
