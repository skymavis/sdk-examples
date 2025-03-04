import { Button } from '@nextui-org/react';
import { KatanaTrade } from '@sky-mavis/katana-swap';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import { FC, ReactNode } from 'react';
import { Field, TradeState } from 'src/katana-swap-sdk/constants/enum';
import { useSwapContext } from 'src/katana-swap-sdk/context/SwapContext';
import usePermit2Allowance, { AllowanceState } from 'src/katana-swap-sdk/hooks/permit/usePermit2Allowance';
import { useSwapStore } from 'src/katana-swap-sdk/hooks/store/swap/useSwapStore';
import { useMaxAmountIn } from 'src/katana-swap-sdk/hooks/useMaxAmountIn';
import useSwapSlippageTolerance from 'src/katana-swap-sdk/hooks/useSwapSlippageTolerance';

import WalletRequiredButton from '../../wallet-required-btn/WalletRequiredButton';
import SwapBtn from './SwapBtn';
import WrapBtn from './WrapBtn';

function getIsReviewableQuote(
  trade: KatanaTrade | undefined,
  tradeState: TradeState,
  swapInputError?: ReactNode,
): boolean {
  if (swapInputError) {
    return false;
  }

  return Boolean(trade && tradeState === TradeState.VALID);
}
const SwapFormFooter: FC = () => {
  const {
    derivedSwapInfo: {
      currencies,
      showWrap,
      bestTrade: { trade, state: tradeState },
      inputError: swapInputError,
    },
    computedSwapInfo: {
      parsedAmounts,
      routeIsLoading,
      routeIsSyncing,
      routeNotFound,
      priceImpactSeverity,
      stablecoinPriceImpact,
    },
  } = useSwapContext();

  const { independentField } = useSwapStore();

  const allowedSlippage = useSwapSlippageTolerance();

  const maximumAmountIn = useMaxAmountIn(trade, allowedSlippage);

  const allowance = usePermit2Allowance({
    amount:
      maximumAmountIn ??
      (parsedAmounts[Field.INPUT]?.currency.isToken
        ? (parsedAmounts[Field.INPUT] as CurrencyAmount<Token>)
        : undefined),
  });

  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] &&
      currencies[Field.OUTPUT] &&
      parsedAmounts[independentField as Field]?.greaterThan(JSBI.BigInt(0)),
  );

  const noRouteFound = routeNotFound && userHasSpecifiedInputOutput && !routeIsLoading && !routeIsSyncing;
  const priceImpactTooHigh = priceImpactSeverity > 3;

  const handleApprove = async () => {
    if (allowance.state === AllowanceState.REQUIRED) {
      return await allowance.approve();
    }
  };

  const handleSignMessageForPermit = async () => {
    if (allowance.state === AllowanceState.REQUIRED) {
      return await allowance.permit();
    }
  };
  return (
    <WalletRequiredButton size="lg">
      {showWrap ? (
        <WrapBtn />
      ) : noRouteFound ? (
        <Button disabled fullWidth size="lg">
          Insufficient liquidity for this trade
        </Button>
      ) : allowance.state === AllowanceState.REQUIRED && allowance.needsSetupApproval ? (
        <Button
          isLoading={allowance.isApprovalPending || allowance.isApprovalLoading}
          onClick={handleApprove}
          fullWidth
          size="lg"
          color="primary"
        >
          Approve ${currencies[Field.INPUT]?.symbol}
        </Button>
      ) : allowance.state === AllowanceState.REQUIRED && allowance.needsPermitSignature ? (
        <Button color="primary" onClick={handleSignMessageForPermit} fullWidth size="lg">
          Sign message in wallet
        </Button>
      ) : (
        <SwapBtn
          disabled={!getIsReviewableQuote(trade, tradeState, swapInputError) || priceImpactTooHigh || !!swapInputError}
          priceImpactSeverity={priceImpactSeverity}
          stablecoinPriceImpact={stablecoinPriceImpact}
          allowance={allowance}
        />
      )}
    </WalletRequiredButton>
  );
};

export default SwapFormFooter;
