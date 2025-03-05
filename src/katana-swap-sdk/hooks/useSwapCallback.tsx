import { PermitSignature, swap } from '@sky-mavis/katana-swap';

import { Field, ReactQueryKey } from '../constants/enum';
import { useSwapContext } from '../context/SwapContext';
import { didUserReject, swapErrorToUserReadableMessage, TransactionFailedError } from '../utils/error';
import { useGetWalletConnectData } from './useGetWalletConnectData';
import useSwapSlippageTolerance from './useSwapSlippageTolerance';
import { useUpdateQueryKeys } from './useUpdateQueryKeys';

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(permitSignature: PermitSignature | undefined) {
  const {
    derivedSwapInfo: {
      bestTrade: { trade },
    },
    computedSwapInfo: { parsedAmounts },
  } = useSwapContext();

  const { chainId, wallet } = useGetWalletConnectData();

  const updateQueryKeys = useUpdateQueryKeys([ReactQueryKey.USER_TOKEN_BALANCES, ReactQueryKey.RON_BALANCE]);

  const userSlippageToleranceWithDefault = useSwapSlippageTolerance();

  return async ({
    onSuccess,
    onFailed,
  }: {
    onSuccess: (txHash: string) => void;
    onFailed: (error: any, txHash?: string) => void;
  }): Promise<void> => {
    if (!wallet || !trade || !parsedAmounts[Field.INPUT] || !parsedAmounts[Field.OUTPUT]) {
      return;
    }
    try {
      await swap({
        chainId,
        trade,
        wallet,
        slippageTolerance: userSlippageToleranceWithDefault,
        permitSignature,
        onSuccess(receipt) {
          if (receipt?.status === 1) {
            updateQueryKeys();
            onSuccess(receipt.transactionHash);
          } else {
            throw new TransactionFailedError('Transaction receipt return with status 0', receipt?.transactionHash);
          }
        },
      });
    } catch (error: unknown) {
      let newError;
      let txHash: string | undefined;
      if (error instanceof TransactionFailedError) {
        txHash = error.txHash;
      }

      if (didUserReject(error)) {
        newError = {
          title: 'Swap failed',
          message: 'Transaction rejected.',
        };
      } else {
        newError = {
          title: 'Swap failed',
          message: swapErrorToUserReadableMessage(error),
        };
      }
      onFailed(newError, txHash);
    }
  };
}
