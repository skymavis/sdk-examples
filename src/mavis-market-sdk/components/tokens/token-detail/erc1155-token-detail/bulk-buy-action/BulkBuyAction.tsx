import { Input } from '@nextui-org/react';
import {
  CollectionData,
  Erc1155Token,
  getErc1155Orders,
  getOrdersByQuantity,
  Order,
} from '@sky-mavis/mavis-market-core';
import { isEmpty, isNil } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import ConnectWalletButton from 'src/mavis-market-sdk/components/connect-wallet-button/ConnectWalletButton';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import SuccessModal from '../../../success-modal/SuccessModal';
import Erc1155BuyModal from '../erc1155-buy-modal/Erc1155BuyModal';

import Classes from './BulkBuyAction.module.scss';

interface BulkBuyActionProps {
  collectionData: CollectionData;
  tokenId: string;
  tokenData: Erc1155Token;
}

const getAvailableOrdersQuantity = (orders: Order[]) => {
  return orders.reduce((total, order) => {
    const { orderQuantity } = order;
    const availableQuantity = Number(orderQuantity?.availableQuantity || 0);
    return total + availableQuantity;
  }, 0);
};

const BulkBuyAction: FC<BulkBuyActionProps> = props => {
  const { collectionData, tokenId, tokenData } = props;
  const { tokenAddress } = collectionData;
  const { chainId, connectedAccount } = useGetWalletConnectData();

  const [openBuyModal, setOpenBuyModal] = useState(false);
  const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orders, setOrders] = useState<Order[]>([]);

  const notMyOrders = orders.filter(order => order.maker !== connectedAccount);

  const onGetAllOrders = async () => {
    try {
      if (!isNil(tokenAddress) && !isNil(tokenId)) {
        const orders = await getErc1155Orders({ chainId, tokenAddress, tokenId, from: 0, size: 50 });
        setOrders(orders);
      }
    } catch (err) {
      console.error('[get_all_orders_error]', err);
    }
  };

  const availableOrdersQuantity = useMemo(() => {
    if (isEmpty(orders)) {
      return 0;
    }
    return getAvailableOrdersQuantity(notMyOrders as Order[]);
  }, [notMyOrders]);

  const onCloseSuccessModal = () => {
    setIsOpenSuccessModal(false);
  };

  useEffect(() => {
    onGetAllOrders();
  }, [tokenAddress, tokenId]);

  return (
    <>
      <div className={Classes.bulkBuyAction}>
        <div className={Classes.available}>
          <Typography color="gray">Available:</Typography>
          <Typography>{availableOrdersQuantity} items</Typography>
        </div>
        <WillRender when={availableOrdersQuantity > 0 && !isNil(connectedAccount)}>
          <Input
            type="number"
            min={1}
            max={availableOrdersQuantity || 0}
            label="Quantity"
            value={quantity.toString()}
            onChange={e => setQuantity(Number(e.target.value))}
          />
          <ConnectWalletButton
            fullWidth
            color="primary"
            isDisabled={quantity === 0 || quantity > availableOrdersQuantity}
            onPress={() => setOpenBuyModal(true)}
          >
            Bulk buy
          </ConnectWalletButton>
        </WillRender>
      </div>
      <Erc1155BuyModal
        isOpen={openBuyModal}
        onClose={() => setOpenBuyModal(false)}
        totalQuantity={quantity}
        tokenData={tokenData}
        ordersByQuantity={getOrdersByQuantity(notMyOrders, quantity)}
        onBuySuccessfully={() => setIsOpenSuccessModal(true)}
      />
      <SuccessModal title="Buy successfully" isOpen={isOpenSuccessModal} onClose={onCloseSuccessModal} />
    </>
  );
};

export default BulkBuyAction;
