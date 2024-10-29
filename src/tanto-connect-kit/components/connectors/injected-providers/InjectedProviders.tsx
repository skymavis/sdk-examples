import {
  BaseConnector,
  ConnectorEvent,
  IConnectResult,
  requestInjectedConnectors,
} from "@sky-mavis/tanto-connect";
import React, { FC, useEffect, useState } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import ConnectButton from "../../connect-wallet/connect-button/ConnectButton";
import WillRender from "@components/will-render/WillRender";

import styles from "./InjectedProviders.module.scss";
import WaitingWallet from "../../connect-wallet/waiting-wallet/WaitingWallet";
import ConnectButtonSkeleton from "../../connect-wallet/connect-button-skeleton/ConnectButtonSkeleton";
import ConnectedWallet from "../../connect-wallet/connected-wallet/ConnectedWallet";

const walletPlaceholders = new Array(3).fill(0);
const InjectedProviders: FC = () => {
  const {
    connector,
    setConnector,
    setIsConnected,
    isConnected,
    setChainId,
    setAccount,
  } = useConnectorStore();
  const [connectors, setConnectors] = useState<BaseConnector[]>([]);
  const [isLoading, setIsConnecting] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setIsConnected(false);
    requestInjectedConnectors()
      .then((connectors) => setConnectors(connectors))
      .catch(console.error)
      .finally(() => setFetching(false));
  }, []);

  const onConnect = (payload: IConnectResult) => {
    if (!payload.account) {
      return;
    }
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

  const connectWallet = (connector: BaseConnector) => {
    setConnector(connector);
    setIsConnecting(true);
    connector.removeAllListeners();
    connector.on(ConnectorEvent.CONNECT, onConnect);
    connector.on(ConnectorEvent.ACCOUNTS_CHANGED, onAccountChange);
    connector.on(ConnectorEvent.CHAIN_CHANGED, onChainChanged);
    connector.on(ConnectorEvent.DISCONNECT, onDisconnect);

    connector
      .connect()
      .catch(console.error)
      .finally(() => setIsConnecting(false));
  };

  return (
    <div className={styles.injectedProviders}>
      <WillRender when={!isConnected && fetching}>
        {walletPlaceholders.map((_, index) => (
          <ConnectButtonSkeleton key={index} />
        ))}
      </WillRender>

      <WillRender when={!isConnected && !fetching}>
        <WillRender when={!isLoading}>
          {connectors.map((connector) => (
            <ConnectButton
              onClick={() => connectWallet(connector)}
              icon={connector.icon as string}
              text={connector.name}
            />
          ))}
        </WillRender>

        <WillRender when={isLoading}>
          <WaitingWallet
            icon={connector?.icon}
            name={connector?.name}
            onCancel={() => setIsConnecting(false)}
          />
        </WillRender>
      </WillRender>

      <WillRender when={isConnected && !fetching}>
        <ConnectedWallet />
      </WillRender>
    </div>
  );
};

export default InjectedProviders;
