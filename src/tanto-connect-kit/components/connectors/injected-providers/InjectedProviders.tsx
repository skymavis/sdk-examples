import WillRender from '@components/will-render/WillRender';
import { BaseConnector, ConnectorType } from '@sky-mavis/tanto-connect';
import React, { FC, useState } from 'react';

import { RecentConnectorStorage } from '../../../common/storage';
import useTantoConnect from '../../../hooks/useTantoConnect';
import useConnectStore from '../../../stores/useConnectStore';
import ConnectButton from '../../connect-wallet/connect-button/ConnectButton';
import ConnectedWallet from '../../connect-wallet/connected-wallet/ConnectedWallet';
import WaitingWallet from '../../connect-wallet/waiting-wallet/WaitingWallet';

import styles from './InjectedProviders.module.scss';

const InjectedProviders: FC = () => {
  const { handleConnect, connectors, listenEvents } = useTantoConnect();
  const { connector, isConnected, setConnector, chainId, account } = useConnectStore();

  const [isConnecting, setIsConnecting] = useState(false);

  const handleClickConnector = (connector: BaseConnector) => {
    // why: Adding a 200ms delay to prevent UI flash when the connector is already authorized
    const timeout = setTimeout(() => setIsConnecting(true), 100);

    setConnector(connector);
    listenEvents(connector);
    handleConnect(connector)
      .catch(error => console.error('[handle_click_connector]', error))
      .finally(() => {
        clearTimeout(timeout);
        setIsConnecting(false);
      });
  };

  const injectedConnectors = connectors.filter(connector => connector.type === ConnectorType.WALLET);

  return (
    <div className={styles.injectedProviders}>
      <div className={styles.content}>
        <WillRender when={!isConnected && !isConnecting}>
          {injectedConnectors.map((connector, index) => (
            <ConnectButton
              isRecent={RecentConnectorStorage.check(connector.id)}
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
          <ConnectedWallet
            chainId={chainId}
            account={account}
            connectorName={connector?.name}
            disconnect={() => connector?.disconnect()}
          />
        </WillRender>
      </div>
    </div>
  );
};

export default InjectedProviders;
