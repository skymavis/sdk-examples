import { cancelOrder, Order } from '@sky-mavis/mavis-market-core';
import { isNil } from 'lodash';
import { FC, useState } from 'react';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import SuccessModal from '../../../success-modal/SuccessModal';

interface CancelListingActionProps {
  order: Order | null;
}

const CancelListingAction: FC<CancelListingActionProps> = props => {
  const { order } = props;
  const { hash } = order || {};

  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const { chainId, wallet } = useGetWalletConnectData();

  const onOpenSuccessModal = () => {
    setIsOpenSuccessModal(true);
  };

  const onCloseSuccessModal = () => {
    setIsOpenSuccessModal(false);
  };

  const onCancelListing = async () => {
    try {
      if (!isNil(wallet) && !isNil(hash)) {
        setIsCanceling(true);
        await cancelOrder({ chainId, wallet, hash });
        onOpenSuccessModal();
      }
    } catch (err) {
      console.error('[cancel_order_failed]', err);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <>
      <ConnectWalletButton color="primary" fullWidth isLoading={isCanceling} onPress={onCancelListing}>
        Cancel listing
      </ConnectWalletButton>
      <SuccessModal title="Cancel order successfully" isOpen={isOpenSuccessModal} onClose={onCloseSuccessModal} />
    </>
  );
};

export default CancelListingAction;
