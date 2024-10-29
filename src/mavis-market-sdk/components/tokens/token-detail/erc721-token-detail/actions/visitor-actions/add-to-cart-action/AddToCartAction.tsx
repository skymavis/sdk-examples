import { Button } from '@nextui-org/react';
import { Erc721Token } from '@sky-mavis/mavis-market-core';
import { FC } from 'react';
import { useCartStore } from 'src/mavis-market-sdk/hooks/useCartStore';
import { checkIsAllowedAddToCart } from 'src/mavis-market-sdk/utils/getCartDataUtils';

interface AddToCartActionProps {
  tokenData: Erc721Token;
}

const AddToCartAction: FC<AddToCartActionProps> = props => {
  const { tokenData } = props;
  const { cartItems, addItemToCart } = useCartStore();

  const onAddToCart = () => {
    const isValid = checkIsAllowedAddToCart(cartItems);
    if (isValid) {
      addItemToCart(tokenData);
    }
  };

  return (
    <Button fullWidth variant="bordered" onPress={onAddToCart}>
      Add to cart
    </Button>
  );
};

export default AddToCartAction;
