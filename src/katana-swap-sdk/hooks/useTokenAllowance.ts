import { ContractTransaction } from '@ethersproject/contracts';
import { approveToken, getTokenAllowance } from '@sky-mavis/katana-swap';
import { useQuery } from '@tanstack/react-query';
import { CurrencyAmount, MaxUint256, Token } from '@uniswap/sdk-core';
import { BigNumber } from 'ethers';

import { ReactQueryKey } from '../constants/enum';
import { didUserReject, UserRejectedRequestError } from '../utils/error';
import { useGetWalletConnectData } from './useGetWalletConnectData';

const MAX_ALLOWANCE = MaxUint256.toString();

export function useTokenAllowance(token?: Token, owner?: string) {
  const { chainId } = useGetWalletConnectData();
  return useQuery({
    enabled: !!chainId && !!token && !!owner,
    queryKey: [ReactQueryKey.TOKEN_ALLOWANCE, token?.address, owner],
    queryFn: async () => {
      if (!token || !owner) {
        return undefined;
      }

      const params = {
        chainId,
        tokenAddress: token?.address,
        owner,
      };

      const rawAllowance: BigNumber = await getTokenAllowance(params);
      const allowance =
        token && rawAllowance ? CurrencyAmount.fromRawAmount(token, rawAllowance?.toString()) : undefined;
      return allowance;
    },
  });
}

export function useUpdateTokenAllowance(
  amount: CurrencyAmount<Token> | undefined,
): () => Promise<{ response: ContractTransaction; info: any } | undefined> {
  const { chainId, wallet } = useGetWalletConnectData();

  return async () => {
    try {
      if (!amount || !wallet) {
        return undefined;
      }

      try {
        const allowance = amount.equalTo(0) ? '0' : MAX_ALLOWANCE;
        const tokenAddress = amount.currency.address;

        const response: ContractTransaction = await approveToken({
          chainId,
          tokenAddress,
          amount: allowance,
          wallet,
        });

        return {
          response,
          info: {
            type: 'approval',
            tokenAddress,
            amount: allowance,
          },
        };
      } catch (error) {
        if (didUserReject(error)) {
          const symbol = amount?.currency.symbol ?? 'Token';
          throw new UserRejectedRequestError(`${symbol} token allowance failed: User rejected`);
        } else {
          throw error;
        }
      }
    } catch (error: unknown) {
      if (error instanceof UserRejectedRequestError) {
        console.error(error);
        return;
      } else {
        const symbol = amount?.currency.symbol ?? 'Token';
        console.error(new Error(`${symbol} token allowance failed: ${error instanceof Error ? error.message : error}`));
        return;
      }
    }
  };
}
