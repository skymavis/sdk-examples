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
  // const priceImpactColor = useMemo(() => {
  //   if (!priceImpact) return undefined;
  //   if (priceImpact.lessThan('0')) return 'var(--dg-tc-text-success)';
  //   const severity = warningSeverity(priceImpact);
  //   if (severity < 1) return 'var(--dg-tc-text-disabled)';
  //   if (severity < 3) return 'var(--dg-tc-text-warning)';
  //   return 'var(--dg-tc-text-critical)';
  // }, [priceImpact]);

  if (!fiatValue) return null;

  return (
    <Typography size="small" color="gray" className={Class.FiatValue}>
      {priceImpact ? (
        <Typography
          color="gray"
          //  style={{ color: priceImpactColor, display: 'inline', marginRight: 4 }}
        >
          {`(~${priceImpact.multiply(-1).toSignificant(3)}%)`}
        </Typography>
      ) : null}
      {formatNumber(fiatValue)}
    </Typography>
  );
}
