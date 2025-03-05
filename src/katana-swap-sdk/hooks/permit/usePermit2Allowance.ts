import { PERMIT2_ADDRESS } from '@sky-mavis/katana-core';
import {
  checkIsValidPermitAllowance,
  checkIsValidPermitAllowanceSignature,
  getIntervalTimeCheckPermit,
} from '@sky-mavis/katana-swap';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { parseUnits } from 'ethers/lib/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AVERAGE_RONIN_L1_BLOCK_TIME } from 'src/katana-swap-sdk/constants/misc';
import { truncateValue } from 'src/katana-swap-sdk/utils/tryParseCurrencyAmount';

import { useHasPendingApproval, useTransactionAdder } from '../store/transaction/useTransactionHandler';
import { useGetWalletConnectData } from '../useGetWalletConnectData';
import { useTokenAllowance, useUpdateTokenAllowance } from '../useTokenAllowance';
import { PermitSignature, usePermitAllowance, useUpdatePermitAllowance } from './usePermitAllowance';

enum ApprovalState {
  PENDING,
  SYNCING,
  SYNCED,
}

export enum AllowanceState {
  LOADING,
  REQUIRED,
  ALLOWED,
}

interface AllowanceRequired {
  state: AllowanceState.REQUIRED;
  token: Token;
  isApprovalLoading: boolean;
  isApprovalPending: boolean;
  approveAndPermit: () => Promise<void>;
  approve: () => Promise<void>;
  permit: () => Promise<void>;
  needsSetupApproval: boolean;
  needsPermitSignature: boolean;
  allowedAmount: CurrencyAmount<Token>;
}

export type Allowance =
  | { state: AllowanceState.LOADING }
  | {
      state: AllowanceState.ALLOWED;
      permitSignature?: PermitSignature;
    }
  | AllowanceRequired;

export default function usePermit2Allowance({ amount }: { amount?: CurrencyAmount<Token> }): Allowance {
  const { connectedAccount: account, chainId } = useGetWalletConnectData();
  const token = amount?.currency;

  const {
    data: tokenAllowance,
    isLoading: isApprovalSyncing,
    refetch: refetchTokenAllowance,
  } = useTokenAllowance(token, account);
  const updateTokenAllowance = useUpdateTokenAllowance(amount);
  const addTransaction = useTransactionAdder();

  const isApproved = useMemo(() => {
    if (!amount || !tokenAllowance) {
      return false;
    }
    return tokenAllowance.greaterThan(amount) || tokenAllowance.equalTo(amount);
  }, [amount, tokenAllowance]);

  // Marks approval as loading from the time it is submitted (pending), until it has confirmed and another block synced.
  // This avoids re-prompting the user for an already-submitted but not-yet-observed approval, by marking it loading
  // until it has been re-observed. It wll sync immediately, because confirmation fast-forwards the block number.
  const [approvalState, setApprovalState] = useState(ApprovalState.SYNCED);
  const isApprovalLoading = approvalState !== ApprovalState.SYNCED;
  const isApprovalPending = useHasPendingApproval(token?.wrapped.address, PERMIT2_ADDRESS[chainId]);

  useEffect(() => {
    if (isApprovalPending) {
      setApprovalState(ApprovalState.PENDING);
    } else {
      setApprovalState(state => {
        if (state === ApprovalState.PENDING && isApprovalSyncing) {
          return ApprovalState.SYNCING;
        } else if (state === ApprovalState.SYNCING && !isApprovalSyncing) {
          return ApprovalState.SYNCED;
        }
        return state;
      });
    }
  }, [isApprovalPending, isApprovalSyncing]);

  // Signature and PermitAllowance will expire, so they should be rechecked at an interval.
  // Calculate now such that the signature will still be valid for the submitting block.
  const now = getIntervalTimeCheckPermit(AVERAGE_RONIN_L1_BLOCK_TIME);

  const [signature, setSignature] = useState<PermitSignature>();
  const isSigned = useMemo(() => {
    return !!token?.address && checkIsValidPermitAllowanceSignature({ chainId, now, signature, token: token?.address });
  }, [amount, now, signature, token?.address]);

  const { data: permitData } = usePermitAllowance(token, account);
  const { permitAllowance, expiration: permitExpiration, nonce } = permitData ?? {};

  const updatePermitAllowance = useUpdatePermitAllowance(token, nonce, setSignature);
  const isPermitted = useMemo(() => {
    return (
      !!amount &&
      !!permitAllowance &&
      !!permitExpiration &&
      checkIsValidPermitAllowance({
        amount: parseUnits(truncateValue(amount?.toExact(), amount?.currency.decimals), amount?.currency.decimals),
        now,
        permitAllowance: parseUnits(
          truncateValue(permitAllowance.toExact(), permitAllowance?.currency.decimals),
          permitAllowance?.currency.decimals,
        ),
        permitExpiration,
      })
    );
  }, [amount, now, permitAllowance, permitExpiration]);

  const shouldRequestApproval = !(isApproved || isApprovalLoading);
  const shouldRequestSignature = !(isPermitted || isSigned);

  const approveAndPermit = useCallback(async () => {
    if (shouldRequestApproval) {
      const res = await updateTokenAllowance();
      if (res === undefined) return;
      const { response, info } = res;
      addTransaction(response, info);
    }
    if (shouldRequestSignature) {
      await updatePermitAllowance();
    }
  }, [addTransaction, shouldRequestApproval, shouldRequestSignature, updatePermitAllowance, updateTokenAllowance]);

  const approve = useCallback(async () => {
    const res = await updateTokenAllowance();
    if (res === undefined) return;
    const { response, info } = res;
    addTransaction(response, info);
    refetchTokenAllowance();
  }, [addTransaction, refetchTokenAllowance, updateTokenAllowance]);

  return useMemo(() => {
    if (token) {
      if (!tokenAllowance || !permitAllowance) {
        return { state: AllowanceState.LOADING };
      } else if (shouldRequestSignature) {
        return {
          token,
          state: AllowanceState.REQUIRED,
          isApprovalLoading: false,
          isApprovalPending,
          approveAndPermit,
          approve,
          permit: updatePermitAllowance,
          needsSetupApproval: !isApproved,
          needsPermitSignature: shouldRequestSignature,
          allowedAmount: tokenAllowance,
        };
      } else if (!isApproved) {
        return {
          token,
          state: AllowanceState.REQUIRED,
          isApprovalLoading,
          isApprovalPending,
          approveAndPermit,
          approve,
          permit: updatePermitAllowance,
          needsSetupApproval: true,
          needsPermitSignature: shouldRequestSignature,
          allowedAmount: tokenAllowance,
        };
      }
    }
    return {
      token,
      state: AllowanceState.ALLOWED,
      permitSignature: !isPermitted && isSigned ? signature : undefined,
      needsSetupApproval: false,
      needsPermitSignature: false,
    };
  }, [
    token,
    isPermitted,
    isSigned,
    signature,
    tokenAllowance,
    permitAllowance,
    shouldRequestSignature,
    isApproved,
    isApprovalPending,
    approveAndPermit,
    approve,
    updatePermitAllowance,
    isApprovalLoading,
  ]);
}
