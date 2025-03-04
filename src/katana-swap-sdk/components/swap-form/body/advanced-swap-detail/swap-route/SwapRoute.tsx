import Typography from '@components/typography/Typography';
import { Chip, Tooltip } from '@nextui-org/react';
import { Protocol } from '@uniswap/router-sdk';
import { Currency } from '@uniswap/sdk-core';
import { FeeAmount } from '@uniswap/v3-sdk';
import React, { FC } from 'react';
import CurrencyLogo, { toValidLogoAddress } from 'src/katana-swap-sdk/components/currency-logo/CurrencyLogo';
import PairTokenLogo from 'src/katana-swap-sdk/components/pair-token-logo/PairTokenLogo';
import { BIPS_BASE } from 'src/katana-swap-sdk/constants/misc';
import { useSwapContext } from 'src/katana-swap-sdk/context/SwapContext';
import { useGetWalletConnectData } from 'src/katana-swap-sdk/hooks/useGetWalletConnectData';
import getRoutingDiagramEntries, { RoutingDiagramEntry } from 'src/katana-swap-sdk/utils/getRoutingDiagramEntries';

import styles from './SwapRoute.module.scss';

function Pool({
  currency0,
  currency1,
  feeAmount,
  pairOrPoolAddress,
}: {
  currency0: Currency;
  currency1: Currency;
  feeAmount: FeeAmount;
  pairOrPoolAddress: string;
}) {
  return (
    <Tooltip
      content={
        <Typography size="small">{`${currency0?.symbol}/${currency1?.symbol} ${
          feeAmount / BIPS_BASE
        }% pool`}</Typography>
      }
    >
      <Chip className={styles.badgeContainer}>
        <Typography size="xSmall" bold className={styles.badgePool} color="gray">
          <PairTokenLogo address={toValidLogoAddress(pairOrPoolAddress)} size={16} />
          {`${feeAmount / BIPS_BASE}%`}
        </Typography>
      </Chip>
    </Tooltip>
  );
}

function Route({ entry: { percent, path, protocol } }: { entry: RoutingDiagramEntry }) {
  return (
    <div className={styles.routeEntry}>
      <div className={styles.dottedLine} />

      <Chip className={styles.badgePoolVersionAndAmount}>
        <Typography size="xSmall" bold className={styles.badgeContent}>
          {protocol === Protocol.MIXED ? 'V3 + V2' : protocol.toUpperCase()}{' '}
          <Typography size="xSmall" bold color="gray">
            {percent.toSignificant(2)}%
          </Typography>
        </Typography>
      </Chip>

      <div className={styles.poolWrapper}>
        {path.map(([currency0, currency1, feeAmount, pairOrPoolAddress], index) => {
          return (
            <Pool
              key={`${index}-${currency0?.symbol}-${currency1?.symbol}-${feeAmount.toString()}`}
              currency0={currency0}
              currency1={currency1}
              feeAmount={feeAmount}
              pairOrPoolAddress={pairOrPoolAddress}
            />
          );
        })}
      </div>
    </div>
  );
}
type Props = {
  isOnDialog?: boolean;
};
const SwapRoute: FC<Props> = () => {
  const { chainId } = useGetWalletConnectData();

  const {
    derivedSwapInfo: {
      bestTrade: { trade },
    },
  } = useSwapContext();

  if (!trade) return null;

  const { inputAmount, outputAmount } = trade;

  const routes = getRoutingDiagramEntries(trade, chainId);

  return (
    <Tooltip
      className={styles.tooltipLayer}
      content={
        <>
          <div className={styles.swapRouteWrapper}>
            {routes.map((route, i) => {
              return (
                <div key={`route-line-${i}`} className={styles.routeLine}>
                  <CurrencyLogo address={inputAmount?.currency?.wrapped?.address} forceShowNativeRonLogo size={16} />
                  <Route entry={route} />
                  <CurrencyLogo address={outputAmount?.currency?.wrapped?.address} forceShowNativeRonLogo size={16} />
                </div>
              );
            })}
          </div>

          <Typography size="xSmall" color="gray" className={styles.description}>
            Our routing system automatically splits your trade among multiple pools to secure the best price.
          </Typography>
        </>
      }
    >
      Routing API
    </Tooltip>
  );
};

export default SwapRoute;
