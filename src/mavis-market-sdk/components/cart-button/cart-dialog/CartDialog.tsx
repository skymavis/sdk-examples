import { FC } from 'react';

import SuccessModal from '../../tokens/success-modal/SuccessModal';
import Cart from './cart/Cart';

interface CartDialogProps {
  openCart: boolean;
  isOpenSuccessModal: boolean;
  successAddtionalText: string;
  onCloseCart: () => void;
  onOpenSuccessModal: (additionalText?: string) => void;
  onCloseSuccessModal: () => void;
}

const CartDialog: FC<CartDialogProps> = props => {
  const { openCart, isOpenSuccessModal, successAddtionalText, onCloseCart, onOpenSuccessModal, onCloseSuccessModal } =
    props;
  return (
    <>
      <Cart isOpen={openCart} onClose={onCloseCart} onBuySuccessfully={onOpenSuccessModal} />
      <SuccessModal
        title={`Buy ${successAddtionalText} successfully`}
        isOpen={isOpenSuccessModal}
        onClose={onCloseSuccessModal}
      />
    </>
  );
};

export default CartDialog;
