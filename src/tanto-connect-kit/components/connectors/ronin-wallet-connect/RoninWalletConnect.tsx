import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import WillRender from '@components/will-render/WillRender';
import { ConnectorEvent, DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import { isNil } from 'lodash';
import { QRCodeSVG } from 'qrcode.react';
import React, { FC, useEffect } from 'react';

import usePlatformCheck from '../../../hooks/usePlatformCheck';
import useTantoConnect from '../../../hooks/useTantoConnect';
import useConnectStore from '../../../stores/useConnectStore';
import { toDeepLinkWalletConnect } from '../../../utils/link';
import ConnectedWallet from '../../connect-wallet/connected-wallet/ConnectedWallet';
import WaitingWallet from '../../connect-wallet/waiting-wallet/WaitingWallet';

import styles from './RoninWalletConnect.module.scss';

const roninWC = DEFAULT_CONNECTORS_CONFIG.RONIN_WC;
const RoninWalletConnect: FC = () => {
  const { handleConnect, findConnector, connectors, listenEvents, removeListeners } = useTantoConnect();
  const { isConnected, connector, setConnector, chainId, account } = useConnectStore();
  const { isMobile } = usePlatformCheck();

  const [uri, setUri] = React.useState<string | null>(null);

  useEffect(() => {
    const roninWCConnector = findConnector(roninWC.name);

    if (roninWCConnector) {
      setConnector(roninWCConnector);
      listenEvents(roninWCConnector);
      handleConnect(roninWCConnector);

      roninWCConnector.on(ConnectorEvent.DISPLAY_URI, uri => setUri(uri));
      roninWCConnector.on(ConnectorEvent.DISCONNECT, () =>
        // request new uri when disconnected
        handleConnect(roninWCConnector),
      );
    }

    return () => removeListeners(roninWCConnector);
  }, [connectors]);

  const handleClickConnectOnMobile = () => {
    if (!uri) return;
    window.location.href = toDeepLinkWalletConnect(uri);
  };

  return (
    <div className={styles.roninWalletConnect}>
      <WillRender when={!isConnected && isNil(uri)}>
        <WaitingWallet icon={roninWC.icon} name={roninWC.name} />
      </WillRender>
      <WillRender when={!isConnected && !isNil(uri)}>
        <div className={'w-full flex flex-col items-center gap-2 p-6'}>
          <QRCodeSVG
            value={uri as string}
            marginSize={2}
            size={164}
            imageSettings={{
              src: roninWC.icon as string,
              height: 32,
              width: 32,
              excavate: true,
            }}
          />
          <Typography size={'small'}>Scan with Ronin Wallet</Typography>

          <WillRender when={isMobile}>
            <Button color={'primary'} onPress={handleClickConnectOnMobile}>
              Open Ronin Wallet
            </Button>
          </WillRender>
        </div>
      </WillRender>

      <WillRender when={isConnected}>
        <ConnectedWallet
          chainId={chainId}
          account={account}
          connectorName={roninWC?.name}
          disconnect={() => connector?.disconnect()}
        />
      </WillRender>
    </div>
  );
};

export default RoninWalletConnect;
