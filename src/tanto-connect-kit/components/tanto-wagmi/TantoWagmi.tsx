import WillRender from '@components/will-render/WillRender';
import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import React, { useState } from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';

import ConnectButton from '../connect-wallet/connect-button/ConnectButton';
import ConnectedWallet from '../connect-wallet/connected-wallet/ConnectedWallet';
import WaitingWallet from '../connect-wallet/waiting-wallet/WaitingWallet';
import WalletCheckIn from '../wallet-actions/wallet-check-in/WalletCheckIn';

import styles from './TantoWagmi.module.scss';

const TantoWagmi = () => {
  const [currentConnector, setCurrentConnector] = useState<Connector | null>(null);
  const { address, chainId, isConnected, isConnecting } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClickConnect = (connector: Connector) => {
    setCurrentConnector(connector);
    connect({ connector });
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
