import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import { FC, useMemo, useState } from 'react';
import WillRender from 'src/components/will-render/WillRender';
import ShoppingCartSimpleIcon from 'src/icons/ShoppingCartSimpleIcon';
import { useCartStore } from 'src/mavis-market-sdk/hooks/useCartStore';
import { countCartItems } from 'src/mavis-market-sdk/utils/getCartDataUtils';

import CartDialog from './cart-dialog/CartDialog';

import Classes from './CartButton.module.scss';

const CartButton: FC = () => {
  const { cartItems } = useCartStore();

  const [openCart, setOpenCart] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [successAddtionalText, setSuccessAdditionalText] = useState('');

  const cartCount = useMemo(() => countCartItems(cartItems), [cartItems]);

  const onClickCart = () => {
    setOpenCart(true);
  };

  const onCloseCart = () => {
    setOpenCart(false);
  };

  const onOpenSuccessModal = (additionalText?: string) => {
    setSuccessAdditionalText(additionalText || '');
    setIsOpenSuccessModal(true);
  };

  const onCloseSuccessModal = () => {
    setIsOpenSuccessModal(false);
    setSuccessAdditionalText('');
  };

  return (
    <div className={Classes.cartButton}>
      <Button isIconOnly variant="light" onClick={onClickCart}>
        <ShoppingCartSimpleIcon />
      </Button>
      <WillRender when={cartCount > 0}>
        <Typography className={Classes.cartCount}>{cartCount}</Typography>
      </WillRender>
      <CartDialog
        openCart={openCart}
        isOpenSuccessModal={isOpenSuccessModal}
        successAddtionalText={successAddtionalText}
        onCloseCart={onCloseCart}
        onOpenSuccessModal={onOpenSuccessModal}
        onCloseSuccessModal={onCloseSuccessModal}
      />
    </div>
  );
};

export default CartButton;
