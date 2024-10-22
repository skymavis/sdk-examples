import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import { FC } from 'react';
import { useConnectWallet } from 'src/mavis-market-sdk/hooks/useConnectWallet';

import ButtonOption from '../button-option/ButtonOption';

const RoninWalletMobile: FC = () => {
  const { connectRoninMobile } = useConnectWallet();

  const onClickRoninMobileButton = () => {
    connectRoninMobile();
  };

  return (
    <ButtonOption
      icon={DEFAULT_CONNECTORS_CONFIG.RONIN_WC.icon as string}
      variant="flat"
      name="Ronin Wallet"
      subText="Connect the mobile wallet by QR code"
      onClick={onClickRoninMobileButton}
    />
  );
};

export default RoninWalletMobile;
