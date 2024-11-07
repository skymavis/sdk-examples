import { useDisclosure } from '@nextui-org/react';
import { FC, ReactNode, useEffect } from 'react';
import ConnectWalletModal from 'src/mavis-market-sdk/components/layout/connect-wallet-modal/ConnectWalletModal';
import { useConnectWallet } from 'src/mavis-market-sdk/hooks/useConnectWallet';

import Header from './header/Header';

import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = props => {
  const { children } = props;

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { reconnectWallet } = useConnectWallet();

  useEffect(() => {
    reconnectWallet();
  }, []);

  return (
    <div className={styles.layout}>
      <ConnectWalletModal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} />
      <Header onConnectWallet={onOpen} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Layout;
