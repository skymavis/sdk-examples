import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import classNames from 'classnames';
import { FC } from 'react';
import { useConnectWallet } from 'src/mavis-market-sdk/hooks/useConnectWallet';

import { useCheckIsInWalletApp } from '../../../../hooks/useCheckIsInWalletApp';
import CustomButton from '../custom-button/CustomButton';

import styles from './ConnectRoninMobileWalletButton.module.scss';

interface ConnectRoninMobileWalletButtonProps {
  isUsingQrCode?: boolean;
  className?: string;
  onClick: () => void;
}

const ConnectRoninMobileWalletButton: FC<ConnectRoninMobileWalletButtonProps> = props => {
  const { isUsingQrCode = false, className, onClick } = props;

  const { connectWalletExtension, connectRoninMobile } = useConnectWallet();

  const isInWalletApp = useCheckIsInWalletApp();

  const onClickRoninMobileButton = () => {
    if (isInWalletApp) {
      connectWalletExtension();
      return;
    }
    connectRoninMobile();
    onClick();
  };

  const subText = isUsingQrCode ? 'Connect the mobile wallet by QR code' : 'Connect the mobile wallet';

  return (
    <CustomButton
      className={classNames(styles.extensionButton, className)}
      icon={DEFAULT_CONNECTORS_CONFIG.RONIN_WC.icon as string}
      variant="flat"
      name="Ronin Wallet"
      subText={subText}
      onPress={onClickRoninMobileButton}
    />
  );
};

export default ConnectRoninMobileWalletButton;
