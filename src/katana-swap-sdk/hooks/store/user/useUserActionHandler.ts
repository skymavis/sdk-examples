import { Percent } from '@uniswap/sdk-core';
import JSBI from 'jsbi';
import { useMemo } from 'react';

import { useUserStore } from './useUserStore';

export function useIsExpertMode(): boolean {
  return useUserStore().userExpertMode;
}

export function useExpertModeManager(): [boolean, () => void] {
  const { updateUserExpertMode } = useUserStore();
  const expertMode = useIsExpertMode();

  const toggleSetExpertMode = () => {
    updateUserExpertMode({ userExpertMode: !expertMode });
  };

  return [expertMode, toggleSetExpertMode];
}

export function useSetUserSlippageTolerance(): (slippageTolerance: Percent | 'auto') => void {
  const { updateUserSlippageTolerance } = useUserStore();
  return (userSlippageTolerance: Percent | 'auto') => {
    let value: 'auto' | number;
    try {
      value =
        userSlippageTolerance === 'auto' ? 'auto' : JSBI.toNumber(userSlippageTolerance.multiply(10_000).quotient);
    } catch (error) {
      value = 'auto';
    }
    updateUserSlippageTolerance({
      userSlippageTolerance: value,
    });
  };
}

/**
 * Return the user's slippage tolerance, from the redux store, and a function to update the slippage tolerance
 */
export function useUserSlippageTolerance(): Percent | 'auto' {
  const userSlippageTolerance = useUserStore().userSlippageTolerance;

  return useMemo(
    () => (userSlippageTolerance === 'auto' ? 'auto' : new Percent(userSlippageTolerance, 10_000)),
    [userSlippageTolerance],
  );
}

/**
 * Same as above but replaces the auto with a default value
 * @param defaultSlippageTolerance the default value to replace auto with
 */
export function useUserSlippageToleranceWithDefault(defaultSlippageTolerance: Percent): Percent {
  const allowedSlippage = useUserSlippageTolerance();
  return useMemo(
    () => (allowedSlippage === 'auto' ? defaultSlippageTolerance : allowedSlippage),
    [allowedSlippage, defaultSlippageTolerance],
  );
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const { userDeadline, updateUserDeadline } = useUserStore();

  const setUserDeadline = (userDeadline: number) => {
    updateUserDeadline({ userDeadline });
  };

  return [userDeadline, setUserDeadline];
}
