import { useDisclosure } from '@nextui-org/react';
import { FC, ReactNode, useEffect } from 'react';

import { useConnectWallet } from '../../hooks/useConnectWallet';
import ConnectWalletModal from './connect-wallet-modal/ConnectWalletModal';
import Footer from './footer/Footer';
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
      <div>
        <Header onConnectWallet={onOpen} />
        <div className={styles.content}>{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
