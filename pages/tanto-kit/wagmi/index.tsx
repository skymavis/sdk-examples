import { roninWallet, waypoint } from '@sky-mavis/tanto-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { walletConnect } from '@wagmi/connectors';
import React, { FC } from 'react';
import { ronin, saigon } from 'viem/chains';
import { createConfig, http, WagmiProvider } from 'wagmi';

import { roninWCConfigs, waypointConfigs } from '../../../src/tanto-connect-kit/common/constant';
import Header from '../../../src/tanto-connect-kit/components/layout/header/Header';
import WagmiAccount from '../../../src/tanto-connect-kit/components/tanto-wagmi/TantoWagmi';

const config = createConfig({
  chains: [ronin, saigon],
  transports: {
    [ronin.id]: http(),
    [saigon.id]: http(),
  },
  connectors: [roninWallet(), waypoint(waypointConfigs), walletConnect(roninWCConfigs)],
  multiInjectedProviderDiscovery: false,
  ssr: true,
});

const queryClient = new QueryClient();

const WagmiExample: FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Header showConnectorTabs={false} />
        <WagmiAccount />
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WagmiExample;
