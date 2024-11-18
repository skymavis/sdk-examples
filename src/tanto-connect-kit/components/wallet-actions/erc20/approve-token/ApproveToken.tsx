import Button from '@components/button/Button';
import WillRender from '@components/will-render/WillRender';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { Input } from '@nextui-org/react';
import { ethers } from 'ethers';
import { isNil } from 'lodash';
import React, { FC, useCallback, useState } from 'react';

import { Erc20__factory } from '../../../../../abis/types';
import useConnectStore from '../../../../stores/useConnectStore';

interface IPropsType {
  tokenAddress: string;
  recipient: string;
  amount: string;
}

const ApproveToken: FC<IPropsType> = ({ tokenAddress, recipient, amount }) => {
  const { connector } = useConnectStore();
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string>();

  const createERC20Contract = async () => {
    const provider = await connector?.getProvider();
    if (provider) {
      const web3Provider = new Web3Provider(provider as ExternalProvider);
      const signer = web3Provider.getSigner();
      return Erc20__factory.connect(tokenAddress, signer);
    }
  };

  const approveToken = useCallback(async () => {
    const erc20Contract = await createERC20Contract();
    if (!erc20Contract) return;

    setIsLoading(true);
    erc20Contract
      .approve(recipient, ethers.utils.parseEther(amount))
      .then(tx => setTxHash(tx.hash))
      .catch(error => console.error('[send_erc20]', error))
      .finally(() => setIsLoading(false));
  }, [recipient, amount]);

  return (
    <React.Fragment>
      <Button
        disabled={!recipient || !amount || !tokenAddress}
        color={'primary'}
        radius={'sm'}
        onPress={approveToken}
        isLoading={isLoading}
      >
        Approve
      </Button>
      <WillRender when={!isNil(txHash)}>
        <Input label={'Transaction Hash'} value={txHash} disabled color={'primary'} radius={'sm'} />
      </WillRender>
    </React.Fragment>
  );
};

export default ApproveToken;
