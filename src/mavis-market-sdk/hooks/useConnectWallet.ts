import { ExternalProvider } from '@ethersproject/providers';
import {
  ConnectorEvent,
  IBaseConnector,
  IConnectResult,
  requestRoninWalletConnectConnector,
  requestRoninWalletConnector,
  requestWaypointConnector,
  SupportedConnectors,
} from '@sky-mavis/tanto-connect';
import { isEmpty } from 'lodash';
import getConfig from 'next/config';
import { useEffect } from 'react';

import { useConnectorStore } from '../components/layout/connectors/stores/useConnectorStore';
import { checkHasConnector } from '../utils/checkHasConnector';

const wcOptions = {
  projectId: 'd2ef97836db7eb390bcb2c1e9847ecdc',
  metadata: {
    name: 'New Ronin Wallet',
    description: 'New Ronin Wallet',
    icons: ['https://cdn.skymavis.com/skymavis-home/public/homepage/core-value.png'],
    url: 'https://wallet.roninchain.com',
  },
};

export const useConnectWallet = () => {
  const { publicRuntimeConfig } = getConfig();
  const { chainId: chainIdFromConfig } = publicRuntimeConfig;

  const { connector, setConnectedChainId, setConnector, setConnectedAccount, setWalletProvider, clearData } =
    useConnectorStore();

  const onConnect = (payload: IConnectResult) => {
    const { chainId, account, provider } = payload || {};
    setConnectedChainId(chainId);
    setConnectedAccount(account?.toLowerCase());
    setWalletProvider(provider as ExternalProvider);
  };

  const onAccountChange = (accounts: string[]) => {
    if (accounts.length > 0) {
      setConnectedAccount(accounts[0]);
    }
  };

  const handleConnect = async (connector: IBaseConnector, autoConnect: boolean, chainId?: number) => {
    try {
      setConnector(connector);
      const connectionResult = autoConnect ? await connector.autoConnect() : await connector.connect(chainId);
      onConnect(connectionResult as IConnectResult);
    } catch (error) {
      console.error(error);
      connector?.disconnect();
    }
  };

  const handleChainChanged = (chainId: number) => {
    setConnectedChainId(chainId);
    if (chainId === chainIdFromConfig) {
      const provider = connector?.getProvider();
      if (provider) {
        setWalletProvider(provider as ExternalProvider);
      }
    }
  };

  const connectWaypoint = async (autoConnect = false) => {
    try {
      const connector = requestWaypointConnector({}, { chainId: chainIdFromConfig });
      await handleConnect(connector, autoConnect);
    } catch (error) {
      console.error(error);
    }
  };

  const connectWalletExtension = async (autoConnect = false) => {
    try {
      const connector = await requestRoninWalletConnector();
      await handleConnect(connector, autoConnect);
    } catch (error) {
      console.error(error);
    }
  };

  const connectRoninMobile = async (autoConnect = false) => {
    try {
      const connector = await requestRoninWalletConnectConnector(wcOptions);
      await handleConnect(connector, autoConnect, Number(chainIdFromConfig));
    } catch (error) {
      console.error(error);
    }
  };

  const reconnectWallet = () => {
    if (checkHasConnector(SupportedConnectors.WAYPOINT)) {
      connectWaypoint(true);
      return;
    }
    if (checkHasConnector(SupportedConnectors.RONIN_WALLET)) {
      connectWalletExtension(true);
      return;
    }
    if (checkHasConnector(SupportedConnectors.RONIN_WC)) {
      connectRoninMobile(true);
    }
  };

  useEffect(() => {
    if (!isEmpty(connector)) {
      connector.on(ConnectorEvent.ACCOUNTS_CHANGED, onAccountChange);
      connector.on(ConnectorEvent.CHAIN_CHANGED, handleChainChanged);
      connector.on(ConnectorEvent.DISCONNECT, clearData);
    }

    return () => {
      if (!isEmpty(connector)) {
        connector.off(ConnectorEvent.ACCOUNTS_CHANGED, () => {});
        connector.off(ConnectorEvent.CHAIN_CHANGED, () => {});
        connector.off(ConnectorEvent.DISCONNECT, () => {});
      }
    };
  }, [connector]);

  return { connectWaypoint, connectWalletExtension, connectRoninMobile, reconnectWallet };
};
