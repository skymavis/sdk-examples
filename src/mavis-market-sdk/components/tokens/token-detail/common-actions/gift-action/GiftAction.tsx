import { Erc } from '@sky-mavis/mavis-market-core';
import { FC, useState } from 'react';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';

import SuccessModal from '../../../success-modal/SuccessModal';
import GiftModal from './gift-modal/GiftModal';

interface GiftActionProps {
  tokenId: string;
  tokenAddress: string;
  tokenType: Erc;
  maxQuantity?: number;
}

const GiftAction: FC<GiftActionProps> = props => {
  const { tokenAddress, tokenType, maxQuantity, tokenId } = props;

  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [isOpenGiftModal, setIsOpenGiftModal] = useState(false);

  const onOpenGiftModal = () => {
    setIsOpenGiftModal(true);
  };

  const onCloseGiftModal = () => {
    setIsOpenGiftModal(false);
  };

  const onOpenSuccessModal = () => {
    setIsOpenSuccessModal(true);
  };

  const onCloseSuccessModal = () => {
    setIsOpenSuccessModal(false);
  };

  return (
    <>
      <ConnectWalletButton variant="bordered" fullWidth onClick={onOpenGiftModal}>
        Gift
      </ConnectWalletButton>
      <GiftModal
        tokenType={tokenType}
        tokenAddress={tokenAddress}
        tokenId={tokenId}
        maxQuantity={maxQuantity}
        isOpen={isOpenGiftModal}
        onClose={onCloseGiftModal}
        onGiftSuccessfully={onOpenSuccessModal}
      />
      <SuccessModal title="Gift successfully" isOpen={isOpenSuccessModal} onClose={onCloseSuccessModal} />
    </>
  );
};

export default GiftAction;
