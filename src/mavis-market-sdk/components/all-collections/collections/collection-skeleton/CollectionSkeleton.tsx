import { FC } from 'react';

import Card from './card/Card';

import Classes from './CollectionSkeleton.module.scss';

const CollectionSkeleton: FC = () => {
  return (
    <div className={Classes.collectionSkeleton}>
      {Array.from(Array(20).keys()).map(index => (
        <Card key={index} />
      ))}
    </div>
  );
};

export default CollectionSkeleton;
