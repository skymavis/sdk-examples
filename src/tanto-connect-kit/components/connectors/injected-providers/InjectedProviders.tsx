import { BaseConnector, ConnectorType } from "@sky-mavis/tanto-connect";
import React, { FC, useState } from "react";

import ConnectButton from "../../connect-wallet/connect-button/ConnectButton";
import WillRender from "@components/will-render/WillRender";

import WaitingWallet from "../../connect-wallet/waiting-wallet/WaitingWallet";
import ConnectedWallet from "../../connect-wallet/connected-wallet/ConnectedWallet";
import useConnectStore from "../../../stores/useConnectStore";
import useTantoConnect from "../../../hooks/useTantoConnect";

import styles from "./InjectedProviders.module.scss";

const InjectedProviders: FC = () => {
  const { handleConnect, connectors, listenEvents } = useTantoConnect();
  const { connector, isConnected, setConnector } = useConnectStore();

  const [isConnecting, setIsConnecting] = useState(false);

  const handleClickConnector = (connector: BaseConnector) => {
    setConnector(connector);
    listenEvents(connector);
    handleConnect(connector);
  };

  const injectedConnectors = connectors.filter(
    (connector) => connector.type === ConnectorType.WALLET
  );

  return (
    <div className={styles.injectedProviders}>
      <WillRender when={!isConnected}>
        {injectedConnectors.map((connector) => (
          <ConnectButton
            onClick={() => handleClickConnector(connector)}
            icon={connector.icon}
            text={connector.name}
          />
        ))}

        <WillRender when={isConnecting}>
          <WaitingWallet
            icon={connector?.icon}
            name={connector?.name}
            onCancel={() => setIsConnecting(false)}
          />
        </WillRender>
      </WillRender>

      <WillRender when={isConnected}>
        <ConnectedWallet />
      </WillRender>
    </div>
  );
};

export default InjectedProviders;
