import {
  ChainIds,
  DEFAULT_CONNECTORS_CONFIG,
  IWaypointProviderConfigs,
  SupportedConnectors,
} from '@sky-mavis/tanto-connect';
import getConfig from 'next/config';

export const tantoExamplePrefix = '/tanto-kit';

const { publicRuntimeConfig } = getConfig();
const { chainId: chainIdFromConfig, waypointClientId } = publicRuntimeConfig;

export const connectorPaths: Record<SupportedConnectors, string> = {
  [SupportedConnectors.RONIN_WALLET]: `${tantoExamplePrefix}/ronin-wallet`,
  [SupportedConnectors.RONIN_WC]: `${tantoExamplePrefix}/ronin-wc`,
  [SupportedConnectors.INJECTED]: `${tantoExamplePrefix}/injected-providers`,
  [SupportedConnectors.WAYPOINT]: `${tantoExamplePrefix}/ronin-waypoint`,
  [SupportedConnectors.SAFE]: ``,
};

export const connectorTabs = Object.values(DEFAULT_CONNECTORS_CONFIG).map(connector => {
  const connectorId = connector.id as SupportedConnectors;
  return {
    id: connectorId,
    name: connector.name,
    icon: connector.icon,
    type: connector.type,
    url: connectorPaths[connectorId],
  };
});

interface IDefaultConfigs {
  recipient: string;
  amount: string;
  erc20: Record<number, string>;
  checkin: Record<number, string>;
}

export const appConfigs: IDefaultConfigs = {
  recipient: '0xd115A29BDf33f6DB712Dc514721fbFa9b522505c',
  amount: '0',
  erc20: {
    [ChainIds.RoninMainnet]: '0xe514d9deb7966c8be0ca922de8a064264ea6bcd4',
    [ChainIds.RoninTestnet]: '0xa959726154953bae111746e265e6d754f48570e6',
  },
  checkin: {
    [ChainIds.RoninMainnet]: '0xcd4f1cd738cf862995239b5b7d9ff09cffc22399',
    [ChainIds.RoninTestnet]: '0x40ca2f9af6050434a62c2f9caba6ebefa59c6982',
  },
};

export const roninWCConfigs = {
  projectId: 'd2ef97836db7eb390bcb2c1e9847ecdc',
  metadata: {
    name: 'TantoKit Example',
    description: 'TantoKit Example',
    icons: ['https://cdn.skymavis.com/skymavis-home/public//homepage/core-value.png'],
    url: 'https://mavis-sdk-examples.vercel.app/',
  },
};

export const waypointConfigs: IWaypointProviderConfigs = {
  clientId: waypointClientId,
  chainId: chainIdFromConfig,
};
