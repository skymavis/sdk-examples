import { checkIsErc721Approved, CollectionData, Offer } from '@sky-mavis/mavis-market-core';
import { isEmpty } from 'lodash';
import { FC, useEffect, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import OfferItem from './offer-item/OfferItem';

import Classes from './Offers.module.scss';

interface OffersProps {
  collectionData: CollectionData;
  offers: Offer[];
  owner: string;
}

const Offers: FC<OffersProps> = props => {
  const { collectionData, offers, owner } = props;
  const { tokenAddress } = collectionData || {};

  const [isApproved, setIsApproved] = useState(false);
  const [isCheckingAcceptance, setIsCheckingAcceptance] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { chainId, connectedAccount } = useGetWalletConnectData();

  const onCheckIsTokenApproved = async () => {
    try {
      if (!isEmpty(tokenAddress) && !isEmpty(connectedAccount)) {
        setIsCheckingAcceptance(true);
        const isApproved = await checkIsErc721Approved(chainId, connectedAccount as string, tokenAddress);
        setIsApproved(isApproved);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || err);
    } finally {
      setIsCheckingAcceptance(false);
    }
  };

  useEffect(() => {
    onCheckIsTokenApproved();
  }, [connectedAccount, tokenAddress]);

  return (
    <div className={Classes.offers}>
      <WillRender when={!isEmpty('errorMessage')}>
        <Typography color="danger" size="xSmall">
          {errorMessage}
        </Typography>
      </WillRender>
      {offers.map((offer, index) => (
        <div key={offer.hash}>
          <WillRender when={index > 0}>
            <div className={Classes.divider} />
          </WillRender>
          <OfferItem
            isApproved={isApproved}
            isCheckingAcceptance={isCheckingAcceptance}
            collectionData={collectionData}
            owner={owner}
            offer={offer}
            setIsApproved={setIsApproved}
          />
        </div>
      ))}
    </div>
  );
};

export default Offers;
