import WillRender from '@components/will-render/WillRender';
import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import React, { FC, useEffect, useState } from 'react';

import useTantoConnect from '../../../hooks/useTantoConnect';
import useConnectStore from '../../../stores/useConnectStore';
import ConnectButton from '../../connect-wallet/connect-button/ConnectButton';
import ConnectedWallet from '../../connect-wallet/connected-wallet/ConnectedWallet';
import WaitingWallet from '../../connect-wallet/waiting-wallet/WaitingWallet';

import styles from './RoninWaypoint.module.scss';

const roninWaypoint = DEFAULT_CONNECTORS_CONFIG.WAYPOINT;
const RoninWaypoint: FC = () => {
  const { handleConnect, findConnector, connectors, listenEvents, removeListeners } = useTantoConnect();
  const { connector, isConnected, setConnector, chainId, account } = useConnectStore();

  const [isConnecting, setIsConnecting] = useState(false);

  const connectWaypointWallet = async () => {
    if (connectors.length === 0) {
      console.error('Ronin Wallet connectors not found.');
      return;
    }

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
        <WaitingWallet icon={roninWaypoint.icon} name={roninWaypoint.name} onCancel={() => setIsConnecting(false)} />
      </WillRender>

      <WillRender when={isConnected}>
        <ConnectedWallet
          chainId={chainId}
          account={account}
          connectorName={roninWaypoint?.name}
          disconnect={() => connector?.disconnect()}
        />
      </WillRender>
    </div>
  );
};

export default RoninWaypoint;
