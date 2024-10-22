import Skeleton from '@components/skeleton/Skeleton';
import { FC } from 'react';

import Classes from './Card.module.scss';

const Card: FC = () => {
  return (
    <div className={Classes.card}>
      <Skeleton>
        <div className={Classes.image} />
      </Skeleton>
      <div className={Classes.detail}>
        <Skeleton>
          <div className={Classes.title} />
        </Skeleton>
        <Skeleton>
          <div className={Classes.price} />
        </Skeleton>
      </div>
    </div>
  );
};

export default Card;
