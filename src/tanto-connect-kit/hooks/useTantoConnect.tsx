import {
  BaseConnector,
  requestInjectedConnectors,
  requestRoninWalletConnectConnector,
  requestWaypointConnector,
} from '@sky-mavis/tanto-connect';
import { useEffect } from 'react';

import { roninWalletConnectConfigs } from '../common/constant';
import useConnectorsStore from '../stores/useConnectorsStore';
import useConnectorEvents from './useConnectorEvents';

const useTantoConnect = () => {
  const { connectors, isInitialized, setConnectors, setIsInitialized } = useConnectorsStore();
  const { listenEvents, removeListeners } = useConnectorEvents();

  const initConnectors = async () => {
    const injectedWallets = await requestInjectedConnectors();
    const roninWalletConnect = await requestRoninWalletConnectConnector(roninWalletConnectConfigs);
    const waypoint = requestWaypointConnector();

    return [...injectedWallets, roninWalletConnect, waypoint];
  };

  const handleConnect = async (connector: BaseConnector, chainId?: number) => {
    try {
      await connector.connect(chainId);
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
