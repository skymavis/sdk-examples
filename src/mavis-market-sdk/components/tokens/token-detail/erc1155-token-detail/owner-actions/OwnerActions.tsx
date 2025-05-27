import { CollectionData, Erc, Erc1155Token, getErc1155Orders, Order } from '@sky-mavis/mavis-market-core';
import { isNil } from 'lodash';
import { FC, useEffect, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import Price from 'src/mavis-market-sdk/components/price/Price';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import { CancelListingAction, GiftAction, ListingAction } from '../../common-actions';

import Classes from './OwnerActions.module.scss';

interface OwnerActionsProps {
  collectionData: CollectionData;
  tokenData: Erc1155Token;
  myErc1155TokenBalance: number;
}

const OwnerActions: FC<OwnerActionsProps> = props => {
  const { collectionData, tokenData, myErc1155TokenBalance } = props;
  const { tokenAddress } = collectionData;
  const { tokenId } = tokenData;

  const [myOrder, setMyOrder] = useState<Order | null>(null);
  const { currentPrice, paymentToken } = myOrder || {};
  const hasOrder = !isNil(myOrder);

  const { chainId, connectedAccount } = useGetWalletConnectData();

  const onGetMyOrder = async () => {
    try {
      if (!isNil(connectedAccount)) {
        const data = await getErc1155Orders({
          chainId,
          from: 0,
          size: 1,
          tokenAddress,
          tokenId,
          maker: connectedAccount,
        });

        const myOrder = data?.[0];

        if (!isNil(myOrder)) {
          setMyOrder(myOrder);
        }
      }
    } catch (err) {
      console.error(['get_my_listing_error'], err);
    }
  };

  useEffect(() => {
    onGetMyOrder();
  }, [connectedAccount]);

  return (
    <div className={Classes.ownerActions}>
      <div className={Classes.yourListing}>
        <Typography color="gray">Your listing:</Typography>
        <Price amount={currentPrice as string} tokenAddress={paymentToken} />
      </div>
      <div className={Classes.actions}>
        <WillRender when={hasOrder}>
          <CancelListingAction order={myOrder} />
        </WillRender>
        <WillRender when={!hasOrder}>
          <ListingAction
            tokenType={Erc.Erc1155}
            tokenId={tokenId}
            collectionData={collectionData}
            maxQuantity={myErc1155TokenBalance}
          />
        </WillRender>
        <GiftAction
          tokenAddress={tokenAddress}
          tokenId={tokenId}
          tokenType={Erc.Erc1155}
          maxQuantity={myErc1155TokenBalance}
        />
      </div>
    </div>
  );
};

export default OwnerActions;
