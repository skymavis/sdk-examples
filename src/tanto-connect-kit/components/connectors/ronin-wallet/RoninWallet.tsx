import {
  ConnectorEvent,
  DEFAULT_CONNECTORS_CONFIG,
  IConnectResult,
  requestRoninWalletConnector,
} from "@sky-mavis/tanto-connect";
import React, { FC, useEffect, useState } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import ConnectButton from "../../connect-wallet/connect-button/ConnectButton";
import WaitingWallet from "../../connect-wallet/waiting-wallet/WaitingWallet";
import WillRender from "@components/will-render/WillRender";
import styles from "./RoninWallet.module.scss";
import ConnectedWallet from "../../connect-wallet/connected-wallet/ConnectedWallet";

const configs = DEFAULT_CONNECTORS_CONFIG.RONIN_WALLET;
const RoninWallet: FC = () => {
  const {
    connector,
    setConnector,
    isConnected,
    setIsConnected,
    setAccount,
    setChainId,
  } = useConnectorStore();

  const [isConnecting, setIsConnecting] = useState(false);

  const connectRoninWallet = () => {
    setIsConnecting(true);
    connector?.connect().finally(() => setIsConnecting(false));
  };

  const onConnect = (payload: IConnectResult) => {
    // Workaround for Ronin Wallet when it resolves even if the user rejects the request
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

  useEffect(() => {
    const initializeConnector = async () => {
      try {
        const connector = await requestRoninWalletConnector();
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
    <div className={styles.roninWallet}>
      <WillRender when={!isConnecting && !isConnected}>
        <ConnectButton
          onClick={connectRoninWallet}
          icon={configs.icon}
          text={configs.name}
          isRecent={true}
        />
      </WillRender>

      <WillRender when={!!connector && isConnecting}>
        <WaitingWallet
          icon={configs.icon}
          name={configs.name}
          onCancel={() => setIsConnecting(false)}
        />
      </WillRender>

      <WillRender when={isConnected}>
        <ConnectedWallet />
      </WillRender>
    </div>
  );
};

export default RoninWallet;
