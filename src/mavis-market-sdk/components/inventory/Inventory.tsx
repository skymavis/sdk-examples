import EmptyState from '@components/empty-state/EmptyState';
import { CommonTokenData, Erc, getAllTokens, Order } from '@sky-mavis/mavis-market-core';
import { isEmpty, isNil } from 'lodash';
import { FC, useEffect, useState } from 'react';
import Typography from 'src/components/typography/Typography';
import SkeletonCards from 'src/mavis-market-sdk/components/skeleton-cards/SkeletonCards';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import TokenCard from '../tokens/token-card/TokenCard';

import Classes from './Inventory.module.scss';

interface TokenData {
  ercType: Erc;
  data: CommonTokenData;
}

const Inventory: FC = () => {
  const { chainId, connectedAccount } = useGetWalletConnectData();

  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onGetAllTokens = async () => {
    try {
      setIsLoading(true);
      if (!isNil(connectedAccount)) {
        const { tokens } = await getAllTokens({ chainId, owner: connectedAccount, from: 0, size: 50 });
        setTokens(tokens);
      }
    } catch (err) {
      console.error('[get_all_tokens_error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    onGetAllTokens();
  }, [connectedAccount]);

  if (isLoading) {
    return (
      <div className={Classes.inventory}>
        <Typography size="large">All tokens</Typography>
        <SkeletonCards />
      </div>
    );
  }

  if (isEmpty(tokens)) {
    return (
      <div className={Classes.emptyState}>
        <EmptyState text="Tokens not found" />
      </div>
    );
  }

  return (
    <div className={Classes.inventory}>
      <Typography size="large">All tokens</Typography>
      <div className={Classes.tokens}>
        {tokens.map(token => {
          const { ercType, data } = token;
          const { name, tokenAddress, tokenId, orders, image } = data;
          const orderData = ercType === Erc.Erc721 ? (orders as Order) : (orders as Order[])?.[0];
          const { currentPrice, paymentToken } = orderData || {};

          return (
            <TokenCard
              key={`${tokenAddress}-${tokenId}`}
              imageUrl={image || ''}
              name={name || ''}
              tokenAddress={tokenAddress}
              tokenId={tokenId}
              listingPrice={currentPrice}
              paymentToken={paymentToken}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Inventory;
