import { CollectionData } from '@sky-mavis/mavis-market-core';
import { useRouter } from 'next/router';
import { FC } from 'react';
import Typography from 'src/components/typography/Typography';

import Classes from './CollectionCard.module.scss';

interface CollectionCardProps {
  data: CollectionData;
}

const CollectionCard: FC<CollectionCardProps> = props => {
  const { data } = props;
  const { collectionMetadata, tokenAddress } = data;
  const { collection_name, studio_name, avatar, banner } = collectionMetadata || {};

  const router = useRouter();

  const onClickCard = () => {
    router.push(`/mavis-market-sdk/tokens/${tokenAddress}`);
  };

  return (
    <div className={Classes.collectionCard} onClick={onClickCard}>
      <img src={banner || ''} alt="" className={Classes.banner} />
      <div className={Classes.avatarContainer}>
        <img src={avatar || ''} alt="" className={Classes.avatar} />
      </div>
      <div className={Classes.footer}>
        <Typography className={Classes.collectionName}>{collection_name}</Typography>
        <Typography color="gray" className={Classes.collectionName}>
          {studio_name}
        </Typography>
      </div>
    </div>
  );
};

export default CollectionCard;
