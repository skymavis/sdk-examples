import Skeleton from '@components/skeleton/Skeleton';
import { FC } from 'react';

import Classes from './TokenDetailSkeleton.module.scss';

const TokenDetailSkeleton: FC = () => {
  return (
    <div className={Classes.tokenDetailSkeleton}>
      <div className={Classes.imageContainer}>
        <Skeleton>
          <div className={Classes.image} />
        </Skeleton>
      </div>
      <div className={Classes.content}>
        <div className={Classes.container}>
          <Skeleton>
            <div className={Classes.title} />
          </Skeleton>
        </div>
        <div className={Classes.box}>
          <div className={Classes.container}>
            <Skeleton>
              <div className={Classes.listingDetail} />
            </Skeleton>
          </div>
          <div className={Classes.actions}>
            <div className={Classes.container}>
              <Skeleton>
                <div className={Classes.action} />
              </Skeleton>
            </div>
            <div className={Classes.container}>
              <Skeleton>
                <div className={Classes.action} />
              </Skeleton>
            </div>
          </div>
        </div>
        <div className={Classes.box}>
          <div className={Classes.list}>
            <div className={Classes.container}>
              <Skeleton>
                <div className={Classes.item} />
              </Skeleton>
            </div>
          </div>
        </div>
        <div className={Classes.box}>
          <div className={Classes.list}>
            <div className={Classes.container}>
              <Skeleton>
                <div className={Classes.item} />
              </Skeleton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetailSkeleton;
