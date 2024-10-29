import { Button } from '@nextui-org/react';
import { Erc721Token } from '@sky-mavis/mavis-market-core';
import { FC } from 'react';
import CustomShoppingCartRemoveIcon from 'src/icons/CustomShoppingCartRemoveIcon';
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
    <Button isIconOnly variant="bordered" onPress={onRemoveFromCart}>
      <CustomShoppingCartRemoveIcon />
    </Button>
  );
};

export default DeleteCartAction;
