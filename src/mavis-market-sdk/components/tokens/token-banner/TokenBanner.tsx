import Typography from '@components/typography/Typography';
import { CollectionData } from '@sky-mavis/mavis-market-core';
import { FC } from 'react';

import Classes from './TokenBanner.module.scss';

interface TokenBannerProps {
  collectionData: CollectionData;
}

const TokenBanner: FC<TokenBannerProps> = props => {
  const { collectionData } = props;
  const {
    collection_name: collectionName,
    studio_name: studioName,
    banner,
    avatar,
  } = collectionData?.collectionMetadata || {};

  return (
    <div className={Classes.tokenBanner}>
      <div className={Classes.bannerContainer}>
        <div className={Classes.overlay} />
        <img src={banner || ''} className={Classes.banner} />
      </div>
      <div className={Classes.content}>
        <img src={avatar || ''} className={Classes.avatar} />
        <div className={Classes.collectionName}>
          <Typography size="large">{collectionName}</Typography>
          <Typography color="gray">by {studioName}</Typography>
        </div>
      </div>
    </div>
  );
};

export default TokenBanner;
