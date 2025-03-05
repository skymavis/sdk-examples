import Typography from '@components/typography/Typography';
import WillRender from '@components/will-render/WillRender';
import { Accordion, AccordionItem, Chip } from '@nextui-org/react';
import { CurrencyAmount } from '@uniswap/sdk-core';
import cl from 'classnames';
import { parseUnits } from 'ethers/lib/utils';
import React, { FC } from 'react';
import TradePrice from 'src/katana-swap-sdk/components/trade-price/TradePrice';
import { useSwapContext } from 'src/katana-swap-sdk/context/SwapContext';
import { useUserSlippageTolerance } from 'src/katana-swap-sdk/hooks/store/user/useUserActionHandler';
import { useUSDPrice } from 'src/katana-swap-sdk/hooks/usd-price/useUSDPrice';
import useSwapSlippageTolerance from 'src/katana-swap-sdk/hooks/useSwapSlippageTolerance';
import { warningSeverity } from 'src/katana-swap-sdk/utils/prices';

import SwapRoute from './swap-route/SwapRoute';

import styles from './AdvancedSwapDetail.module.scss';

type Props = {
  showRate?: boolean;
  isOnDialog?: boolean;
};

const AdvancedSwapDetail: FC<Props> = props => {
  const {
    derivedSwapInfo: {
      bestTrade: { trade },
    },
    computedSwapInfo: { totalFeeUSD, minimumAmountOut, executionPrice, stablecoinPriceImpact: priceImpact },
  } = useSwapContext();

  const { showRate = true, isOnDialog } = props;

  const allowedSlippage = useSwapSlippageTolerance();
  const isAutoSlippage = useUserSlippageTolerance() === 'auto';

  return trade ? (
    <div className={styles.rowContainer}>
      {showRate && (
        <div className={styles.row}>
          <Typography size="xSmall" color="gray">
            Rate
          </Typography>
          <TradePrice price={executionPrice} />
        </div>
      )}

      <div className={styles.row}>
        <Typography size="xSmall" color="gray">
          Price impact
        </Typography>
        <Typography size="xSmall" className={cl({ [styles[`PriceImpact-${warningSeverity(priceImpact)}`]]: true })}>
          ~{priceImpact?.greaterThan(0) ? '-' : ''}
          {priceImpact ? Math.abs(Number(priceImpact?.toFixed(2))) : '--'}%
        </Typography>
      </div>

      <div className={styles.row}>
        <Typography size="xSmall" color="gray">
          Max. slippage
        </Typography>
        <Typography size="xSmall" className={styles.column}>
          {isAutoSlippage && <Chip size="sm">Auto</Chip>}
          {allowedSlippage.toSignificant()}%
        </Typography>
      </div>

      <div className={styles.row}>
        <Typography size="xSmall" color="gray">
          Minimum receive
        </Typography>
        <Typography size="xSmall" className={styles.columnWithSmallGap}>
          {minimumAmountOut?.toFixed(4)} {trade?.outputAmount?.currency.symbol}
        </Typography>
      </div>

      <div className={styles.row}>
        <Typography size="xSmall" color="gray">
          Fee
        </Typography>

        <Typography size="xSmall">~${totalFeeUSD?.toFixed(4)}</Typography>
      </div>

      <div className={styles.row}>
        <Typography size="xSmall" color="gray">
          Route
        </Typography>
        <Typography size="xSmall">
          <SwapRoute isOnDialog={isOnDialog} />
        </Typography>
      </div>
    </div>
  ) : null;
};

type IAdvancedSwapDetailCollapseProps = {
  className?: string;
};

const AdvancedSwapDetailCollapse: FC<IAdvancedSwapDetailCollapseProps> = () => {
  const { derivedSwapInfo, computedSwapInfo } = useSwapContext();
  const {
    bestTrade: { trade },
  } = derivedSwapInfo ?? {};
  const { executionPrice } = computedSwapInfo ?? {};

  const priceQuoteUSD = useUSDPrice(
    executionPrice
      ? executionPrice?.quote(
          CurrencyAmount.fromRawAmount(
            executionPrice?.baseCurrency,
            parseUnits('1', executionPrice?.baseCurrency.decimals).toString(),
          ),
        )
      : undefined,
  );

  return (
    <Accordion>
      <AccordionItem
        hidden={!trade}
        key="1"
        aria-label="Accordion 1"
        title={
          <Typography size="xSmall" bold className={styles.headerContent}>
            1 {executionPrice?.baseCurrency?.symbol} = {executionPrice?.toSignificant()}{' '}
            {executionPrice?.quoteCurrency.symbol}
            <WillRender when={!!priceQuoteUSD?.data}>
              <Typography size="xSmall" color="gray">
                {'(~$'}
                {priceQuoteUSD?.data?.toFixed(4)}
                {`)`}
              </Typography>
            </WillRender>
          </Typography>
        }
      >
        <AdvancedSwapDetail showRate={false} />
      </AccordionItem>
    </Accordion>
  );
};

export default AdvancedSwapDetail;
export { AdvancedSwapDetailCollapse };
