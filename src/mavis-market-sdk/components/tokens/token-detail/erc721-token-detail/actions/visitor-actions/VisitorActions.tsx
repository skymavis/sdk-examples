import { Erc, Erc721Token, Offer, Order } from '@sky-mavis/mavis-market-core';
import { isEmpty, isNil } from 'lodash';
import { FC, useMemo } from 'react';
import WillRender from 'src/components/will-render/WillRender';
import { useCartStore } from 'src/mavis-market-sdk/hooks/useCartStore';
import { getCartKey } from 'src/mavis-market-sdk/utils/getCartDataUtils';

import { BuyAction } from '../../../common-actions';
import AddToCartAction from './add-to-cart-action/AddToCartAction';
import DeleteCartAction from './delete-cart-action/DeleteCartAction';
import MakeOfferAction from './make-offer-action/MakeOfferAction';
import SwapRonAction from './swap-ron-action/SwapRonAction';

import Classes from './VisitorActions.module.scss';

interface VisitorActionsProps {
  tokenData: Erc721Token;
  myOffer?: Offer | null;
}

const VisitorActions: FC<VisitorActionsProps> = props => {
  const { tokenData, myOffer } = props;
  const { cartItems } = useCartStore();

  const { order, tokenId, tokenAddress } = tokenData;
  const hasOrder = !isNil(order);
  const hasOffer = !isNil(myOffer);

  const tokenNotInCart = useMemo(() => isEmpty(cartItems[getCartKey(tokenId, tokenAddress)]), [cartItems]);

  return (
    <div className={Classes.visitorActions}>
      <WillRender when={hasOrder}>
        <BuyAction order={order || ({} as Order)} tokenType={Erc.Erc721} />
      </WillRender>
      <WillRender when={!hasOffer}>
        <MakeOfferAction tokenData={tokenData} />
      </WillRender>
      <SwapRonAction />
      <WillRender when={!isEmpty(order)}>
        <WillRender when={tokenNotInCart}>
          <AddToCartAction tokenData={tokenData} />
        </WillRender>
        <WillRender when={!tokenNotInCart}>
          <DeleteCartAction tokenData={tokenData} />
        </WillRender>
      </WillRender>
    </div>
  );
};

export default VisitorActions;
