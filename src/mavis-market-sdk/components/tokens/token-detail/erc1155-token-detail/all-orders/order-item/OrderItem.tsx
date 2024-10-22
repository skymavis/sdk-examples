import { Erc, Order } from '@sky-mavis/mavis-market-core';
import { isNil } from 'lodash';
import { FC } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import Price from 'src/mavis-market-sdk/components/price/Price';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import { BuyAction } from '../../../common-actions';

import Classes from './OrderItem.module.scss';

interface OrderItemProps {
  order: Order;
}

const OrderItem: FC<OrderItemProps> = props => {
  const { order } = props;
  const { maker, makerProfile, currentPrice, paymentToken, orderQuantity } = order;

  const { connectedAccount } = useGetWalletConnectData();

  const shouldShowBuyAction = !isNil(connectedAccount) && maker.toLowerCase() !== connectedAccount.toLowerCase();

  return (
    <div className={Classes.orderItem}>
      <div className={Classes.detail}>
        <div className={Classes.item}>
          <Typography size="xSmall" color="gray">
            From:
          </Typography>
          <Typography size="xSmall">{makerProfile?.name || maker}</Typography>
        </div>
        <div className={Classes.item}>
          <Typography size="xSmall" color="gray">
            Listing price:
          </Typography>
          <Price amount={currentPrice} tokenAddress={paymentToken} />
        </div>
        <div className={Classes.item}>
          <Typography size="xSmall" color="gray">
            Available quantity:
          </Typography>
          <Typography>{orderQuantity?.availableQuantity}</Typography>
        </div>
      </div>
      <WillRender when={shouldShowBuyAction}>
        <div>
          <BuyAction order={order} tokenType={Erc.Erc1155} />
        </div>
      </WillRender>
    </div>
  );
};

export default OrderItem;
