import { Erc, Order } from '@sky-mavis/mavis-market-core';
import { FC, useState } from 'react';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';

import SuccessModal from '../../../success-modal/SuccessModal';
import BuyModal from './buy-modal/BuyModal';

interface BuyActionProps {
  order: Order;
  tokenType: Erc;
}

const BuyAction: FC<BuyActionProps> = props => {
  const { order, tokenType } = props;

  const [isOpenBuyModal, setIsOpenBuyModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);

  const onOpenBuyModal = () => {
    setIsOpenBuyModal(true);
  };

  const onCloseBuyModal = () => {
    setIsOpenBuyModal(false);
  };

  const onOpenSuccessModal = () => {
    setIsOpenSuccessModal(true);
  };

  const onCloseSuccessModal = () => {
    setIsOpenSuccessModal(false);
  };

  return (
    <>
      <ConnectWalletButton fullWidth color="primary" onPress={onOpenBuyModal}>
        Buy
      </ConnectWalletButton>
      <BuyModal
        order={order}
        tokenType={tokenType}
        isOpen={isOpenBuyModal}
        onClose={onCloseBuyModal}
        onBuySuccessfully={onOpenSuccessModal}
      />
      <SuccessModal title="Buy successfully" isOpen={isOpenSuccessModal} onClose={onCloseSuccessModal} />
    </>
  );
};

export default BuyAction;
