import { DEFAULT_ERC20 } from '@sky-mavis/katana-core';
import { Currency } from '@uniswap/sdk-core';
import React, { useState } from 'react';
import CoinMoneyIcon from 'src/icons/CoinMoneyIcon';
import { CDN_IMAGE_URL } from 'src/katana-swap-sdk/configs/url';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

export default function CurrencyLogo({
  address,
  size = 24,
  style,
  className,
  alt,
  forceShowNativeRonLogo = true,
  ...rest
}: {
  address?: string;
  size?: number;
  style?: React.CSSProperties;
  className?: string;
  alt?: string;
  forceShowNativeRonLogo?: boolean;
}) {
  const { chainId } = useGetWalletConnectData();

  const [isError, setIsError] = useState(false);

  const src = address
    ? forceShowNativeRonLogo && address.toLowerCase() === DEFAULT_ERC20[chainId].WRON.address.toLowerCase()
      ? `${CDN_IMAGE_URL}/${chainId}/ron/logo.png`
      : `${CDN_IMAGE_URL}/${chainId}/erc20/${address?.toLowerCase()}/logo.png`
    : undefined;

  // if (!src) {
  //   return (
  //     <Skeleton>
  //       <div style={style} className={className} />
  //     </Skeleton>
  //   );
  // }

  if (isError) return <CoinMoneyIcon size={size} style={style} className={className} />;

  return (
    <img
      {...rest}
      alt={`${alt ?? 'token'} logo`}
      src={src}
      className={className}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      onError={() => {
        setIsError(true);
      }}
    />
  );
}

export const RonLogo = (props: { size?: number; style?: React.CSSProperties; alt?: string }) => {
  const { chainId } = useGetWalletConnectData();

  return <CurrencyLogo {...props} address={DEFAULT_ERC20[chainId].WRON.address.toLowerCase()} />;
};

export const toValidLogoAddress = (currency: Currency | string | undefined) => {
  return typeof currency === 'string'
    ? currency?.toLowerCase()
    : (currency?.isNative ? currency?.wrapped?.address : currency?.address)?.toLowerCase();
};
