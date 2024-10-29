import { FC, useState } from 'react';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import SuccessModal from 'src/mavis-market-sdk/components/tokens/success-modal/SuccessModal';

import SwapRonModal from './swap-ron-modal/SwapRonModal';

const SwapRonAction: FC = () => {
  const [isOpenSwapRonModal, setIsOpenSwapRonModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const onOpenSwapRonModal = () => {
    setIsOpenSwapRonModal(true);
  };

  const onCloseSwapRonModal = () => {
    setIsOpenSwapRonModal(false);
  };

  const onOpenSuccessModal = () => {
    setIsOpenSuccessModal(true);
  };

  const onCloseSuccessModal = () => {
    setIsOpenSuccessModal(false);
  };

  return (
    <>
      <ConnectWalletButton variant="bordered" fullWidth onPress={onOpenSwapRonModal}>
        Swap ron/wron
      </ConnectWalletButton>
      <SwapRonModal isOpen={isOpenSwapRonModal} onClose={onCloseSwapRonModal} onSwapSuccessfully={onOpenSuccessModal} />
      <SuccessModal title="Swap successfully" isOpen={isOpenSuccessModal} onClose={onCloseSuccessModal} />
    </>
  );
};

export default SwapRonAction;
