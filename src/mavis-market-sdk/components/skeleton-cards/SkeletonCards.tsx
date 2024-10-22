import { FC } from 'react';

import Card from './card/Card';

import Classes from './SkeletonCards.module.scss';

const SkeletonCards: FC = () => {
  return (
    <div className={Classes.skeleton}>
      {Array.from(Array(20).keys()).map(index => (
        <Card key={index} />
      ))}
    </div>
  );
};

export default SkeletonCards;
