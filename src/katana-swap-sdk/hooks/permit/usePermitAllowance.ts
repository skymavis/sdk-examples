import { createPermitObj, getPermitAllowance, signPermitAllowance } from '@sky-mavis/katana-swap';
import { useQuery } from '@tanstack/react-query';
import { PermitSingle } from '@uniswap/permit2-sdk';
import { CurrencyAmount, Token } from '@uniswap/sdk-core';
import { ReactQueryKey } from 'src/katana-swap-sdk/constants/enum';
import { AVERAGE_RONIN_L1_BLOCK_TIME } from 'src/katana-swap-sdk/constants/misc';
import { didUserReject, toReadableError, UserRejectedRequestError } from 'src/katana-swap-sdk/utils/error';

import { useGetWalletConnectData } from '../useGetWalletConnectData';

export function usePermitAllowance(token?: Token, owner?: string, skip?: boolean) {
  const { chainId } = useGetWalletConnectData();

  return useQuery({
    enabled: !!owner && !!token && !!token.address && !skip,
    queryKey: [ReactQueryKey.PERMIT_ALLOWANCE, token?.address, owner],
    queryFn: async () => {
      if (!owner) {
        throw new Error('missing owner');
      }
      if (!token || !token.address) {
        throw new Error('missing token');
      }

      const params = {
        chainId: chainId,
        tokenAddress: token.address,
        owner,
      };

      const { amount, expiration, nonce } = await getPermitAllowance(params);

      const rawAmount = amount.toString();
      const allowance = token && rawAmount ? CurrencyAmount.fromRawAmount(token, rawAmount) : undefined;

      return { permitAllowance: allowance, expiration, nonce };
    },
    refetchInterval(query) {
      const allowance = query.state.data?.permitAllowance as CurrencyAmount<Token> | undefined;
      return allowance?.equalTo(0) ? AVERAGE_RONIN_L1_BLOCK_TIME : false;
    },
  });
}

interface Permit extends PermitSingle {
  sigDeadline: number;
}

export interface PermitSignature extends Permit {
  signature: string;
}

export function useUpdatePermitAllowance(
  token: Token | undefined,
  nonce: number | undefined,
  onPermitSignature: (signature: PermitSignature) => void,
) {
  const { chainId, connectedAccount: account, wallet } = useGetWalletConnectData();

  return async () => {
    try {
      if (!account) {
        throw new Error('wallet not connected');
      }

      if (!wallet?.provider) {
        throw new Error('missing provider');
      }
      if (!token) {
        throw new Error('missing token');
      }

      if (nonce === undefined) {
        throw new Error('missing nonce');
      }

      const params = {
        chainId,
        wallet,
        permit: createPermitObj({
          chainId,
          token: token?.address,
          nonce,
        }),
      };

      try {
        const permitSignature = await signPermitAllowance(params);
        onPermitSignature?.(permitSignature);
      } catch (error) {
        if (didUserReject(error)) {
          const symbol = token?.symbol ?? 'Token';
          throw new UserRejectedRequestError(`${symbol} permit allowance failed: User rejected signature`);
        } else {
          throw error;
        }
      }
      return;
    } catch (error: unknown) {
      if (error instanceof UserRejectedRequestError) {
        throw error;
      } else {
        const symbol = token?.symbol ?? 'Token';
        throw toReadableError(`${symbol} permit allowance failed:`, error);
      }
    }
  };
}
