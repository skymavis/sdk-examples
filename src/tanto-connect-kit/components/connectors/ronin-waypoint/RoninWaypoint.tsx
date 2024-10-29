import { DEFAULT_CONNECTORS_CONFIG } from "@sky-mavis/tanto-connect";
import React, { FC, useEffect, useState } from "react";

import ConnectButton from "../../connect-wallet/connect-button/ConnectButton";
import WaitingWallet from "../../connect-wallet/waiting-wallet/WaitingWallet";
import WillRender from "@components/will-render/WillRender";

import styles from "./RoninWaypoint.module.scss";
import ConnectedWallet from "../../connect-wallet/connected-wallet/ConnectedWallet";
import useConnectStore from "../../../stores/useConnectStore";
import useTantoConnect from "../../../hooks/useTantoConnect";

const roninWaypoint = DEFAULT_CONNECTORS_CONFIG.WAYPOINT;
const RoninWaypoint: FC = () => {
  const {
    handleConnect,
    findConnector,
    connectors,
    listenEvents,
    removeListeners,
  } = useTantoConnect();
  const { connector, isConnected, setConnector } = useConnectStore();

  const [isConnecting, setIsConnecting] = useState(false);

  const connectWaypointWallet = async () => {
    setIsConnecting(true);
    if (connector) {
      setConnector(connector);
      handleConnect(connector).finally(() => setIsConnecting(false));
    }
  };

  useEffect(() => {
    const roninWaypointConnector = findConnector(roninWaypoint.name);

    if (roninWaypointConnector) {
      setConnector(roninWaypointConnector);
      listenEvents(roninWaypointConnector);
      roninWaypointConnector.autoConnect();
    }

    return () => removeListeners(roninWaypointConnector);
  }, [connectors]);

  return (
    <div className={styles.roninWaypoint}>
      <WillRender when={!isConnecting && !isConnected}>
        <ConnectButton
          onClick={connectWaypointWallet}
          icon={roninWaypoint.icon}
          text={roninWaypoint.name}
          isRecent={true}
        />
      </WillRender>

      <WillRender when={!!connector && isConnecting}>
        <WaitingWallet
          icon={roninWaypoint.icon}
          name={roninWaypoint.name}
          onCancel={() => setIsConnecting(false)}
        />
      </WillRender>

      <WillRender when={isConnected}>
        <ConnectedWallet />
      </WillRender>
    </div>
  );
};

export default RoninWaypoint;
