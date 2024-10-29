import { Button } from '@nextui-org/react';
import { Erc721Token } from '@sky-mavis/mavis-market-core';
import { FC } from 'react';
import { useCartStore } from 'src/mavis-market-sdk/hooks/useCartStore';

interface DeleteCartActionProps {
  tokenData: Erc721Token;
}

const DeleteCartAction: FC<DeleteCartActionProps> = props => {
  const { tokenData } = props;
  const { deleteItemFromCart } = useCartStore();

  const onRemoveFromCart = () => {
    deleteItemFromCart(tokenData);
  };

  return (
    <Button fullWidth variant="bordered" onPress={onRemoveFromCart}>
      Delete from cart
    </Button>
  );
};

export default DeleteCartAction;
