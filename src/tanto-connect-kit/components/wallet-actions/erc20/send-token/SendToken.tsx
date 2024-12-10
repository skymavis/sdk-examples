import Button from '@components/button/Button';
import WillRender from '@components/will-render/WillRender';
import { Input } from '@nextui-org/react';
import { ethers } from 'ethers';
import { isNil } from 'lodash';
import React, { FC, useCallback, useState } from 'react';

import useConnectStore from '../../../../stores/useConnectStore';
import { IERC20TransactionData } from '../types';
import { createERC20Contract } from '../utils';

interface IPropsType {
  txData: IERC20TransactionData;
}

const SendToken: FC<IPropsType> = ({ txData }) => {
  const { tokenDecimal, tokenAddress, amount, recipient } = txData;

  const { connector, isConnected } = useConnectStore();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();

  const isDisabled = isNil(recipient) || isNil(amount) || isNil(tokenAddress) || !isConnected || isNil(tokenDecimal);

  const sendToken = useCallback(async () => {
    const erc20Contract = await createERC20Contract(connector, tokenAddress);
    if (!erc20Contract || isDisabled) return;

    setIsLoading(true);
    erc20Contract
      .transfer(recipient, ethers.utils.parseUnits(amount, tokenDecimal))
      .then(tx => setTxHash(tx.hash))
      .catch(error => console.error('[send_erc20]', error))
      .finally(() => setIsLoading(false));
  }, [recipient, amount]);

  return (
    <React.Fragment>
      <Button disabled={isDisabled} color={'primary'} radius={'sm'} onPress={sendToken} isLoading={isLoading}>
        Send
      </Button>
      <WillRender when={!isNil(txHash)}>
        <Input label={'Transaction Hash'} value={txHash} disabled color={'primary'} radius={'sm'} />
      </WillRender>
    </React.Fragment>
  );
};

export default SendToken;
