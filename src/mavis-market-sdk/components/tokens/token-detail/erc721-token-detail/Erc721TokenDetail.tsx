import EmptyState from '@components/empty-state/EmptyState';
import {
  CollectionData,
  Erc721Token,
  getErc721Token,
  getOfferByAddress,
  getOffers,
  getPaymentToken,
  Offer,
} from '@sky-mavis/mavis-market-core';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { isEmpty, isNil } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import Price from 'src/mavis-market-sdk/components/price/Price';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';
import { roundingNumber } from 'src/mavis-market-sdk/utils/roundingNumberUtil';

import Attributes from '../attributes/Attributes';
import TokenDetailSkeleton from '../token-detail-skeleton/TokenDetailSkeleton';
import Actions from './actions/Actions';
import CancelOfferAction from './actions/visitor-actions/cancel-offer-action/CancelOfferAction';
import Offers from './offers/Offers';

import Classes from './Erc721TokenDetail.module.scss';

interface Erc721TokenDetailProps {
  collectionData: CollectionData;
  tokenId: string;
}

const Erc721TokenDetail: FC<Erc721TokenDetailProps> = props => {
  const { collectionData, tokenId } = props;

  const { chainId, connectedAccount } = useGetWalletConnectData();

  const [myOffer, setMyOffer] = useState<Offer | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [tokenData, setTokenData] = useState<Erc721Token>({} as Erc721Token);
  const [isLoading, setIsLoading] = useState(false);

  const { tokenAddress } = collectionData;
  const { owner, name, order, image, attributes, traitDistribution } = tokenData;
  const { currentPrice, paymentToken } = order || {};
  const token = getPaymentToken(chainId, paymentToken as string);
  const { imageUrl, decimals } = token || {};

  const displayedPrice = useMemo(() => {
    if (isNil(currentPrice)) {
      return '--';
    }
    const formattedPrice = formatUnits(BigNumber.from(currentPrice), decimals);
    return roundingNumber(formattedPrice);
  }, [currentPrice, decimals]);

  const onGetMyOffer = async () => {
    if (!isNil(connectedAccount)) {
      try {
        const offer = await getOfferByAddress({
          chainId,
          tokenAddress,
          tokenId,
          account: connectedAccount,
        });

        setMyOffer(offer);
      } catch (error) {
        console.error('[get_my_offers_error]', error);
      }
    }
  };

  const onGetTokenDetail = async () => {
    try {
      setIsLoading(true);
      const tokenData = await getErc721Token({
        chainId,
        tokenAddress,
        tokenId: tokenId,
      });
      const offers = await getOffers({
        chainId,
        tokenAddress,
        tokenId,
        from: 0,
        size: 20,
      });

      setTokenData(tokenData);
      setOffers(offers);
    } catch (error) {
      console.error('[get_token_detail_error]', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onGetTokenDetail();
  }, []);

  useEffect(() => {
    onGetMyOffer();
  }, [connectedAccount]);

  if (isLoading) {
    return <TokenDetailSkeleton />;
  }

  if (isEmpty(tokenData)) {
    return (
      <div className={Classes.erc721TokenDetail}>
        <EmptyState text="Token not found" />
      </div>
    );
  }

  return (
    <div className={Classes.erc721TokenDetail}>
      <img src={image || ''} className={Classes.image} />
      <div className={Classes.content}>
        <Typography size="large">{name}</Typography>
        <div className={Classes.listingContainer}>
          <div className={Classes.listingPrice}>
            <Typography size="medium">Listing price:</Typography>
            <div className={Classes.price}>
              <img src={imageUrl} className={Classes.tokenLogo} />
              <Typography size="large">{displayedPrice}</Typography>
            </div>
          </div>
          <WillRender when={!isNil(connectedAccount)}>
            <Actions myOffer={myOffer} tokenData={tokenData} collectionData={collectionData} />
          </WillRender>
        </div>
        <Attributes attributes={attributes} traitDistribution={traitDistribution} />
        <WillRender when={!isNil(myOffer)}>
          <div className={Classes.myOfferContainer}>
            <div className={Classes.price}>
              <Typography color="gray">My offer:</Typography>
              <Price amount={myOffer?.currentPrice || '0'} isWRON />
            </div>
            <CancelOfferAction offer={myOffer} />
          </div>
        </WillRender>
        <div className={Classes.offersContainer}>
          <Typography size="medium">All offers</Typography>
          <WillRender when={!isEmpty(offers)}>
            <Offers owner={owner} offers={offers} />
          </WillRender>
          <WillRender when={isEmpty(offers)}>No offers found</WillRender>
        </div>
      </div>
    </div>
  );
};

export default Erc721TokenDetail;
