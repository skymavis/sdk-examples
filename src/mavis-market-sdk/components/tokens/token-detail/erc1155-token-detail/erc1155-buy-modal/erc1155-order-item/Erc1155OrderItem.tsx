import { BulkBuyOrderData, getPaymentToken } from '@sky-mavis/mavis-market-core';
import { BigNumber } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { FC } from 'react';
import Typography from 'src/components/typography/Typography';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import Classes from './Erc1155OrderItem.module.scss';

interface Erc1155OrderItemProps {
  tokenData: BulkBuyOrderData;
}

const Erc1155OrderItem: FC<Erc1155OrderItemProps> = props => {
  const { tokenData } = props;
  const { chainId } = useGetWalletConnectData();
  const { order, quantity } = tokenData;
  const { currentPrice, paymentToken: paymentTokenAddress } = order;
  const paymentTokenData = getPaymentToken(chainId, paymentTokenAddress);
  const { decimals, symbol } = paymentTokenData || {};

  return (
    <div className={Classes.erc1155OrderItem}>
      <Typography>{quantity}</Typography>
      <Typography>
        {formatUnits(BigNumber.from(currentPrice), decimals)} {symbol}
      </Typography>
    </div>
  );
};

export default Erc1155OrderItem;
