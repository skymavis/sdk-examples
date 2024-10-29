import {
  ConnectorEvent,
  DEFAULT_CONNECTORS_CONFIG,
  IConnectResult,
  requestWaypointConnector,
} from "@sky-mavis/tanto-connect";
import React, { FC, useEffect } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import ConnectButton from "../../connect-wallet/connect-button/ConnectButton";
import WaitingWallet from "../../connect-wallet/waiting-wallet/WaitingWallet";
import WillRender from "@components/will-render/WillRender";

import styles from "./RoninWaypoint.module.scss";
import ConnectedWallet from "../../connect-wallet/connected-wallet/ConnectedWallet";

const defaultConfigs = DEFAULT_CONNECTORS_CONFIG.WAYPOINT;
const RoninWaypoint: FC = () => {
  const {
    connector,
    setConnector,
    isConnected,
    setIsConnected,
    setAccount,
    setChainId,
  } = useConnectorStore();

  const [connecting, setConnecting] = React.useState(false);

  const connectWallet = async () => {
    setConnecting(true);
    connector
      ?.connect()
      .catch(console.error)
      .finally(() => setConnecting(false));
  };

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
  useEffect(() => {
    const initializeConnector = async () => {
      try {
        const connector = await requestWaypointConnector({}, { chainId: 2021 });
        setConnector(connector);
        connector.autoConnect();

        connector.on(ConnectorEvent.CONNECT, onConnect);
        connector.on(ConnectorEvent.ACCOUNTS_CHANGED, onAccountChange);
        connector.on(ConnectorEvent.CHAIN_CHANGED, onChainChanged);
        connector.on(ConnectorEvent.DISCONNECT, onDisconnect);
      } catch (error) {
        console.error("[initialize_ronin_wallet_connector]", error);
      }
    };

    initializeConnector();

    return () => {
      connector?.removeAllListeners();
      setConnector(null);
    };
  }, []);

  return (
    <div className={styles.roninWaypoint}>
      <WillRender when={!connecting && !isConnected}>
        <ConnectButton
          onClick={connectWallet}
          icon={defaultConfigs.icon}
          text={defaultConfigs.name}
          isRecent={true}
        />
      </WillRender>

      <WillRender when={!!connector && connecting}>
        <WaitingWallet
          icon={defaultConfigs.icon}
          name={defaultConfigs.name}
          onCancel={() => setConnecting(false)}
        />
      </WillRender>

      <WillRender when={isConnected}>
        <ConnectedWallet />
      </WillRender>
    </div>
  );
};

export default RoninWaypoint;
