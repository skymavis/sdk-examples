import WillRender from '@components/will-render/WillRender';
import { Skeleton } from '@nextui-org/react';
import React, { FC, useState } from 'react';
import CoinMoneyIcon from 'src/icons/CoinMoneyIcon';
import { CDN_IMAGE_URL } from 'src/katana-swap-sdk/configs/url';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import { useCheckClient } from 'src/mavis-market-sdk/hooks/useCheckClient';

import styles from './PairTokenLogo.module.scss';

interface IPairTokenLogoProps {
  address: string | undefined;
  size?: number;
  alt?: string;
}

const PairTokenLogo: FC<IPairTokenLogoProps> = ({ size = 24, address, alt }) => {
  const [hasError, setHasError] = useState<boolean | null>(null);
  const { isClient } = useCheckClient();
  const { chainId } = useGetWalletConnectData();

  const src = address ? `${CDN_IMAGE_URL}/${chainId}/erc20/${address?.toLowerCase()}/logo.png` : undefined;
  /* NOTE:
    PAIR_TOKEN_LOGO => FIRST_TOKEN_LOGO and SECOND_TOKEN_LOGO (which move to left a distance x to overlay the first one)
    x = size / ratio_distance_origin
    ratio_distance_origin = 278px (size of a token logo) / 44px (in the origin img size 512x512, the second token logo move 44px to the left to overlay the first one) 
  */
  const ratioDistanceOrigin = size / (278 / 44);
  const trueImgSize = size * 2 - ratioDistanceOrigin;

  const isValidImgSrc = src !== null;
  const isShowFallback = !isValidImgSrc || hasError === true;
  const isShowSkeleton = hasError === null;

  if (!isClient) return null;
  return (
    <>
      <WillRender when={isValidImgSrc}>
        {/* NOTE: custom style for this img wrapper because we want to return a logo with the desired
        size props but not the trueImgSize */}
        <div
          style={{
            height: size,
            width: 'fit-content',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <img
            src={src ?? ''}
            alt={`${alt ?? 'LP token'} logo`}
            style={{ width: trueImgSize, height: trueImgSize }}
            onError={() => {
              setHasError(true);
            }}
            onLoad={() => setHasError(false)}
            hidden={isShowFallback || isShowSkeleton}
          />
        </div>
      </WillRender>

      <WillRender when={isShowSkeleton}>
        <div className={styles.Container}>
          <Skeleton style={{ height: size, width: size, borderRadius: '50%' }} className={styles.skeletonContainer} />
          <Skeleton
            style={{ height: size, width: size, borderRadius: '50%', marginLeft: `-${ratioDistanceOrigin}px` }}
            className={styles.skeletonContainer}
          />
        </div>
      </WillRender>

      <WillRender when={isShowFallback}>
        <div className={styles.Container}>
          <CoinMoneyIcon size={size} />
          <CoinMoneyIcon size={size} style={{ marginLeft: `-${ratioDistanceOrigin}px` }} />
        </div>
      </WillRender>
    </>
  );
};

export default PairTokenLogo;
