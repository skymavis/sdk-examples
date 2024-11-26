import WillRender from '@components/will-render/WillRender';
import { ConnectorErrorType, DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import React, { useState } from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';

import usePlatformCheck from '../../hooks/usePlatformCheck';
import { toDeepLinkInAppBrowser } from '../../utils/link';
import ConnectButton from '../connect-wallet/connect-button/ConnectButton';
import ConnectedWallet from '../connect-wallet/connected-wallet/ConnectedWallet';
import WaitingWallet from '../connect-wallet/waiting-wallet/WaitingWallet';
import WalletCheckIn from '../wallet-actions/wallet-check-in/WalletCheckIn';

import styles from './TantoWagmi.module.scss';

const TantoWagmi = () => {
  const [currentConnector, setCurrentConnector] = useState<Connector | null>(null);
  const { address, chainId, isConnected, isConnecting } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const { isMobile } = usePlatformCheck();

  const handleClickConnect = (connector: Connector) => {
    setCurrentConnector(connector);

    connectAsync({ connector }).catch(error => {
      if (error.name === ConnectorErrorType.PROVIDER_NOT_FOUND) {
        if (isMobile) {
          window.location.href = toDeepLinkInAppBrowser(window.location.href);
        } else {
          window.open('https://wallet.roninchain.com', '_blank');
        }
      }
    });
  };

  return (
    <div className={styles.tantoWagmi}>
      <div className={styles.connectors}>
        <WillRender when={!isConnected && !isConnecting}>
          {connectors.map(connector => (
            <ConnectButton
              text={connector.name}
              onClick={() => handleClickConnect(connector)}
              key={connector.id}
              icon={connector.icon || DEFAULT_CONNECTORS_CONFIG.RONIN_WALLET.icon}
            />
          ))}
        </WillRender>

        <WillRender when={isConnecting}>
          <WaitingWallet name={currentConnector?.name} icon={currentConnector?.icon} />
        </WillRender>

        <WillRender when={isConnected}>
          <ConnectedWallet account={address} chainId={chainId} disconnect={disconnect} avatarVariant={'beam'} />
        </WillRender>
      </div>
      <WalletCheckIn />
    </div>
  );
};

export default TantoWagmi;
