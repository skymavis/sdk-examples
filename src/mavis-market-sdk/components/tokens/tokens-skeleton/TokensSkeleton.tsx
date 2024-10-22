import Skeleton from '@components/skeleton/Skeleton';
import { FC } from 'react';
import SkeletonCards from 'src/mavis-market-sdk/components/skeleton-cards/SkeletonCards';

import Classes from './TokensSkeleton.module.scss';

const TokensSkeleton: FC = () => {
  return (
    <div className={Classes.tokenSkeleton}>
      <div className={Classes.bannerContainer}>
        <Skeleton>
          <div className={Classes.banner} />
        </Skeleton>
      </div>
      <SkeletonCards />
    </div>
  );
};

export default TokensSkeleton;
