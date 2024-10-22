import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import { FC } from 'react';
import { useConnectWallet } from 'src/mavis-market-sdk/hooks/useConnectWallet';

import ButtonOption from '../button-option/ButtonOption';

import styles from './RoninWalletExtension.module.scss';

const RoninWalletExtension: FC = () => {
  const { connectWalletExtension } = useConnectWallet();

  const onClickWalletExtensionButton = () => {
    connectWalletExtension();
  };

  return (
    <ButtonOption
      className={styles.extensionButton}
      icon={DEFAULT_CONNECTORS_CONFIG.RONIN_WALLET.icon as string}
      variant="flat"
      name="Ronin Extension"
      onClick={onClickWalletExtensionButton}
    />
  );
};

export default RoninWalletExtension;
