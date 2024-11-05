import {
  BaseConnector,
  requestInjectedConnectors,
  requestRoninWalletConnectConnector,
  requestWaypointConnector,
} from '@sky-mavis/tanto-connect';
import { useEffect } from 'react';

import { roninWalletConnectConfigs, waypointConfigs } from '../common/constant';
import { RecentConnectorStorage } from '../common/storage';
import useConnectorsStore from '../stores/useConnectorsStore';
import useConnectorEvents from './useConnectorEvents';

const useTantoConnect = () => {
  const { connectors, isInitialized, setConnectors, setIsInitialized } = useConnectorsStore();
  const { listenEvents, removeListeners } = useConnectorEvents();

  const initConnectors = async () => {
    const injectedWallets = await requestInjectedConnectors();
    const roninWalletConnect = await requestRoninWalletConnectConnector(roninWalletConnectConfigs);
    const waypoint = requestWaypointConnector({}, waypointConfigs);

    return [...injectedWallets, roninWalletConnect, waypoint];
  };

  const handleConnect = async (connector: BaseConnector, chainId?: number) => {
    try {
      await connector.connect(chainId);
      RecentConnectorStorage.set(connector.id);
    } catch (error) {
      console.error(error);
    }
  };

  const findConnector = (name: string) => {
    return connectors.find(connector => connector.name === name);
  };

  useEffect(() => {
    if (isInitialized) return;

    initConnectors()
      .then(res => {
        setConnectors(res);
        setIsInitialized(true);
      })
      .catch(error => console.error('[init_connectors]', error));
  }, []);

  return {
    connectors,

    handleConnect,
    findConnector,

    listenEvents,
    removeListeners,
  };
};

export default useTantoConnect;
