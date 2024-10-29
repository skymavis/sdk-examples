import { DEFAULT_CONNECTORS_CONFIG } from "@sky-mavis/tanto-connect";
import React, { FC, useEffect, useState } from "react";

import ConnectButton from "../../connect-wallet/connect-button/ConnectButton";
import WaitingWallet from "../../connect-wallet/waiting-wallet/WaitingWallet";
import WillRender from "@components/will-render/WillRender";
import ConnectedWallet from "../../connect-wallet/connected-wallet/ConnectedWallet";
import useConnectStore from "../../../stores/useConnectStore";

import styles from "./RoninWallet.module.scss";
import useTantoConnect from "../../../hooks/useTantoConnect";

const roninWallet = DEFAULT_CONNECTORS_CONFIG.RONIN_WALLET;
const RoninWallet: FC = () => {
  const {
    handleConnect,
    findConnector,
    connectors,
    listenEvents,
    removeListeners,
  } = useTantoConnect();
  const { connector, isConnected, setConnector } = useConnectStore();

  const [isConnecting, setIsConnecting] = useState(false);

  const connectRoninWallet = () => {
    if (connector) {
      setIsConnecting(true);
      setConnector(connector);
      handleConnect(connector).finally(() => setIsConnecting(false));
    }
  };

  useEffect(() => {
    const roninWalletConnector = findConnector(roninWallet.name);

    if (roninWalletConnector) {
      setConnector(roninWalletConnector);
      listenEvents(roninWalletConnector);
      roninWalletConnector.autoConnect();
    }

    return () => removeListeners(roninWalletConnector);
  }, [connectors]);

  return (
    <div className={styles.roninWallet}>
      <WillRender when={!isConnecting && !isConnected}>
        <ConnectButton
          onClick={connectRoninWallet}
          icon={roninWallet.icon}
          text={roninWallet.name}
          isRecent={true}
        />
      </WillRender>

      <WillRender when={isConnecting}>
        <WaitingWallet
          icon={roninWallet.icon}
          name={roninWallet.name}
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
