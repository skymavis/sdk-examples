import Button from '@components/button/Button';
import WillRender from '@components/will-render/WillRender';
import { Erc721Token, Order } from '@sky-mavis/mavis-market-core';
import { isEmpty } from 'lodash';
import { FC } from 'react';
import ArrowCounterClockwiseIcon from 'src/icons/ArrowCounterClockwiseIcon';
import TrashIcon from 'src/icons/TrashIcon';
import Price from 'src/mavis-market-sdk/components/price/Price';
import { useCartStore } from 'src/mavis-market-sdk/hooks/useCartStore';

import Classes from './CartItem.module.scss';

interface CartItemProps {
  token: Erc721Token;
  latestCartItem: Order;
}

const CartItem: FC<CartItemProps> = props => {
  const { token, latestCartItem } = props;
  const { image, name, collectionMetadata, order } = token;

  const { collection_name } = collectionMetadata || {};
  const { currentPrice, paymentToken } = order || {};

  const { setCartItemOrder, deleteItemFromCart } = useCartStore();

  const isUnavailableItem = isEmpty(latestCartItem);
  const isInvalidItem = !isUnavailableItem && latestCartItem.hash !== token.order?.hash;

  const onRefreshCartItem = () => {
    setCartItemOrder(token, latestCartItem);
  };

  const onRemoveCartItem = () => {
    deleteItemFromCart(token);
  };

  return (
    <div className={Classes.cartItem}>
      <div className={Classes.detail}>
        <img className={Classes.tokenImage} src={image || ''} width={48} />
        <div className={Classes.names}>
          <p className={Classes.tokenName}>{name}</p>
          <WillRender when={isUnavailableItem}>
            <p className={Classes.itemUnavailableText}>Item Unavailable</p>
          </WillRender>
          <WillRender when={isInvalidItem}>
            <p className={Classes.itemUpdatedText}>Item Updated</p>
          </WillRender>
          <WillRender when={!isInvalidItem && !isUnavailableItem}>
            <p>{collection_name}</p>
          </WillRender>
        </div>
      </div>
      <div className={Classes.actions}>
        <WillRender when={!isInvalidItem}>
          {currentPrice && <Price amount={currentPrice} tokenAddress={paymentToken} />}
        </WillRender>
        <WillRender when={isInvalidItem}>
          <Button isIconOnly onClick={onRefreshCartItem} variant="light">
            <ArrowCounterClockwiseIcon />
          </Button>
        </WillRender>
        <Button isIconOnly onClick={onRemoveCartItem} color="danger" variant="light">
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
