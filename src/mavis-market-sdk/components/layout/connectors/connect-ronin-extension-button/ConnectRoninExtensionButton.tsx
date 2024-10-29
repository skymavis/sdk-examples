import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import { FC } from 'react';
import { useConnectWallet } from 'src/mavis-market-sdk/hooks/useConnectWallet';

import CustomButton from '../custom-button/CustomButton';

import styles from './ConnectRoninExtensionButton.module.scss';

const ConnectRoninExtensionButton: FC = () => {
  const { connectWalletExtension } = useConnectWallet();

  const onClickWalletExtensionButton = () => {
    connectWalletExtension();
  };

  return (
    <CustomButton
      className={styles.extensionButton}
      icon={DEFAULT_CONNECTORS_CONFIG.RONIN_WALLET.icon as string}
      variant="flat"
      name="Ronin Extension"
      onPress={onClickWalletExtensionButton}
    />
  );
};

export default ConnectRoninExtensionButton;
