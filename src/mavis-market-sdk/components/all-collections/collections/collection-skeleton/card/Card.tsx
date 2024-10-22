import Skeleton from '@components/skeleton/Skeleton';
import { FC } from 'react';

import Classes from './Card.module.scss';

const Card: FC = () => {
  return (
    <div className={Classes.card}>
      <Skeleton>
        <div className={Classes.banner} />
      </Skeleton>
      <div className={Classes.avatarContainer}>
        <Skeleton>
          <div className={Classes.avatar} />
        </Skeleton>
      </div>
      <div className={Classes.detail}>
        <div className={Classes.titleContainer}>
          <Skeleton>
            <div className={Classes.title} />
          </Skeleton>
        </div>
        <div className={Classes.titleContainer}>
          <Skeleton>
            <div className={Classes.title} />
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export default Card;
