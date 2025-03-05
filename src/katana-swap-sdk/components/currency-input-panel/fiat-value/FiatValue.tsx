import Typography from '@components/typography/Typography';
import { Percent } from '@uniswap/sdk-core';
import React from 'react';
import { formatNumber } from 'src/katana-swap-sdk/utils/formatNumber';

import Class from './FiatValue.module.scss';

export function FiatValue({
  fiatValue,
  priceImpact,
}: {
  fiatValue: string | number | undefined;
  priceImpact?: Percent;
}) {
  if (!fiatValue) return null;

  return (
    <Typography size="xSmall" color="gray" className={Class.FiatValue}>
      {priceImpact ? <Typography color="gray">{`(~${priceImpact.multiply(-1).toSignificant(3)}%)`}</Typography> : null}
      {'$'}
      {formatNumber(fiatValue)}
    </Typography>
  );
}
