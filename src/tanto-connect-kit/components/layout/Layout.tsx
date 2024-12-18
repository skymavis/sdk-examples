import { useRouter } from 'next/router';
import React, { FC, ReactNode, useEffect } from 'react';

import { useCheckClient } from '../../../mavis-market-sdk/hooks/useCheckClient';
import useConnectStore from '../../stores/useConnectStore';
import ConnectorActions from '../connector-actions/ConnectActions';
import WalletActions from '../wallet-actions/WalletActions';
import Header from './header/Header';

import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isClient } = useCheckClient();
  const clearStore = useConnectStore(state => state.clearStore);

  useEffect(() => router.events.on('routeChangeComplete', clearStore), [router.events]);

  if (!isClient) {
    return null;
  }

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.body}>
        <div className={styles.content}>{children}</div>

        <div className={styles.sections}>
          <ConnectorActions />
          <WalletActions />
        </div>
      </div>
    </div>
  );
};

export default Layout;
