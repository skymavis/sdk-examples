import { Offer } from '@sky-mavis/mavis-market-core';
import { FC } from 'react';
import WillRender from 'src/components/will-render/WillRender';

import OfferItem from './offer-item/OfferItem';

import Classes from './Offers.module.scss';

interface OffersProps {
  offers: Offer[];
  owner: string;
}

const Offers: FC<OffersProps> = props => {
  const { offers, owner } = props;

  return (
    <div className={Classes.offers}>
      {offers.map((offer, index) => (
        <div key={offer.hash}>
          <WillRender when={index > 0}>
            <div className={Classes.divider} />
          </WillRender>
          <OfferItem owner={owner} offer={offer} />
        </div>
      ))}
    </div>
  );
};

export default Offers;
