import WillRender from '@components/will-render/WillRender';
import { BaseConnector, ConnectorType } from '@sky-mavis/tanto-connect';
import React, { FC, useState } from 'react';

import useTantoConnect from '../../../hooks/useTantoConnect';
import useConnectStore from '../../../stores/useConnectStore';
import ConnectButton from '../../connect-wallet/connect-button/ConnectButton';
import ConnectedWallet from '../../connect-wallet/connected-wallet/ConnectedWallet';
import WaitingWallet from '../../connect-wallet/waiting-wallet/WaitingWallet';

import styles from './InjectedProviders.module.scss';

const InjectedProviders: FC = () => {
  const { handleConnect, connectors, listenEvents } = useTantoConnect();
  const { connector, isConnected, setConnector } = useConnectStore();

  const [isConnecting, setIsConnecting] = useState(false);

  const handleClickConnector = (connector: BaseConnector) => {
    setIsConnecting(true);
    setConnector(connector);
    listenEvents(connector);
    handleConnect(connector)
      .catch(error => console.error('[handle_click_connector]', error))
      .finally(() => setIsConnecting(false));
  };

  const injectedConnectors = connectors.filter(connector => connector.type === ConnectorType.WALLET);

  return (
    <div className={styles.injectedProviders}>
      <WillRender when={!isConnected && !isConnecting}>
        {injectedConnectors.map((connector, index) => (
          <ConnectButton
            onClick={() => handleClickConnector(connector)}
            icon={connector.icon}
            text={connector.name}
            key={index}
          />
        ))}
      </WillRender>

      <WillRender when={isConnecting}>
        <WaitingWallet icon={connector?.icon} name={connector?.name} onCancel={() => setIsConnecting(false)} />
      </WillRender>

      <WillRender when={isConnected}>
        <ConnectedWallet />
      </WillRender>
    </div>
  );
};

export default InjectedProviders;
