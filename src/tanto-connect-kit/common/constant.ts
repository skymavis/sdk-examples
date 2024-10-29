import {
  ChainIds,
  DEFAULT_CONNECTORS_CONFIG,
  SupportedConnectors,
} from "@sky-mavis/tanto-connect";

export const connectorPaths: Record<SupportedConnectors, string> = {
  [SupportedConnectors.RONIN_WALLET]: "/tanto-connect-kit/ronin-wallet",
  [SupportedConnectors.RONIN_WC]: "/tanto-connect-kit/ronin-wc",
  [SupportedConnectors.INJECTED]: "/tanto-connect-kit/injected-providers",
  [SupportedConnectors.WAYPOINT]: "/tanto-connect-kit/ronin-waypoint",
  [SupportedConnectors.SAFE]: "",
};

export const connectorTabs = Object.values(DEFAULT_CONNECTORS_CONFIG).map(
  (connector) => {
    const connectorId = connector.id as SupportedConnectors;
    return {
      id: connectorId,
      name: connector.name,
      icon: connector.icon,
      type: connector.type,
      url: connectorPaths[connectorId],
    };
  }
);

interface IDefaultConfigs {
  recipient: string;
  amount: string;
  erc20: Record<number, string>;
  checkin: Record<number, string>;
}

export const defaultConfigs: IDefaultConfigs = {
  recipient: "0xd115A29BDf33f6DB712Dc514721fbFa9b522505c",
  amount: "0",
  erc20: {
    [ChainIds.RoninMainnet]: "0xe514d9deb7966c8be0ca922de8a064264ea6bcd4",
    [ChainIds.RoninTestnet]: "0xa959726154953bae111746e265e6d754f48570e6",
  },
  checkin: {
    [ChainIds.RoninMainnet]: "0xcd4f1cd738cf862995239b5b7d9ff09cffc22399",
    [ChainIds.RoninTestnet]: "0x40ca2f9af6050434a62c2f9caba6ebefa59c6982",
  },
};
