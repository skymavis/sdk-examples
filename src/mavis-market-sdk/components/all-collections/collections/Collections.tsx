import { CollectionData } from '@sky-mavis/mavis-market-core';
import { FC } from 'react';
import Typography from 'src/components/typography/Typography';
import WillRender from 'src/components/will-render/WillRender';

import CollectionCard from './collection-card/CollectionCard';
import CollectionSkeleton from './collection-skeleton/CollectionSkeleton';

import Classes from './Collections.module.scss';

interface CollectionsProps {
  title: string;
  collections: CollectionData[];
  isLoading: boolean;
}

const Collections: FC<CollectionsProps> = props => {
  const { title, collections, isLoading } = props;

  return (
    <div className={Classes.collectionsContainer}>
      <Typography size="large" bold>
        {title}
      </Typography>
      <WillRender when={isLoading}>
        <CollectionSkeleton />
      </WillRender>
      <WillRender when={!isLoading}>
        <div className={Classes.collections}>
          {collections.map(collection => (
            <CollectionCard data={collection} key={collection.tokenAddress} />
          ))}
        </div>
      </WillRender>
    </div>
  );
};

export default Collections;
