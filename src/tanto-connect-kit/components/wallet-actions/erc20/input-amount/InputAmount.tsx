import { Button, Input } from '@nextui-org/react';
import { ethers } from 'ethers';
import React, { FC, useState } from 'react';

import useConnectStore from '../../../../stores/useConnectStore';
import { IERC20TransactionData } from '../types';
import { createERC20Contract } from '../utils';

interface IPropsType {
  txData: IERC20TransactionData;
  setAmount: (amount: string) => void;
}

const InputAmount: FC<IPropsType> = ({ setAmount, txData }) => {
  const { amount, tokenDecimal, tokenAddress } = txData;

  const { connector, account } = useConnectStore();
  const [loading, setIsLoading] = useState(false);

  const setMaxAmount = async () => {
    if (!connector) return;

    const erc20Contract = await createERC20Contract(connector, tokenAddress);
    if (!erc20Contract || !account || !tokenAddress) return;

    setIsLoading(true);
    erc20Contract
      .balanceOf(account)
      .then(amount => setAmount(String(ethers.utils.formatUnits(String(amount), tokenDecimal))))
      .catch(error => console.error('[set_max_amount]', error))
      .finally(() => setIsLoading(false));
  };

  return (
    <Input
      endContent={
        <Button onClick={setMaxAmount} size={'sm'} isLoading={loading}>
          MAX
        </Button>
      }
      onValueChange={setAmount}
      label={'Amount'}
      value={amount}
      radius={'sm'}
    />
  );
};

export default InputAmount;
