import { BaseConnector, ConnectorEvent, IConnectResult } from '@sky-mavis/tanto-connect';

import useConnectStore from '../stores/useConnectStore';

const useConnectorEvents = () => {
  const { setIsConnected, setAccount, setChainId } = useConnectStore();

  const onConnect = (payload: IConnectResult) => {
    setIsConnected(true);
    setAccount(payload.account);
    setChainId(payload.chainId);
  };

  const onAccountChange = (accounts: string[]) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      setIsConnected(true);
    } else {
      setIsConnected(false);
    }
  };

  const onChainChanged = (chainId: number) => {
    setChainId(chainId);
  };

  const onDisconnect = () => {
    setIsConnected(false);
    setAccount(null);
    setChainId(null);
  };

  const listenEvents = (connector: BaseConnector) => {
    connector.on(ConnectorEvent.CONNECT, onConnect);
    connector.on(ConnectorEvent.ACCOUNTS_CHANGED, onAccountChange);
    connector.on(ConnectorEvent.CHAIN_CHANGED, onChainChanged);
    connector.on(ConnectorEvent.DISCONNECT, onDisconnect);
    connector.on(ConnectorEvent.SESSION_DELETE, onDisconnect);
  };

  const removeListeners = (connector?: BaseConnector) => {
    connector?.removeAllListeners();
  };

  return { listenEvents, removeListeners };
};

export default useConnectorEvents;
