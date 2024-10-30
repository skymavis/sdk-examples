import Button from '@components/button/Button';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { Input } from '@nextui-org/react';
import { ethers } from 'ethers';
import React, { FC, useState } from 'react';

import useConnectStore from '../../../stores/useConnectStore';

import styles from './GetBalance.module.scss';

const GetBalance: FC = () => {
  const { connector, isConnected } = useConnectStore();
  const [balance, setBalance] = React.useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBalance = async () => {
    setIsLoading(true);
    try {
      const provider = await connector?.getProvider();
      if (!provider) return;

      const web3Provider = new Web3Provider(provider as ExternalProvider);
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      const balance = await web3Provider.getBalance(address);
      const balanceInEther = ethers.utils.formatEther(balance);

      setBalance(balanceInEther);
    } catch (error) {
      console.error('get_balance', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.getBalance}>
      <Input readOnly value={balance} radius={'sm'} />
      <Button
        onClick={getBalance}
        isLoading={isLoading}
        color="primary"
        radius={'sm'}
        className={styles.action}
        disabled={!isConnected}
      >
        Get Balance
      </Button>
    </div>
  );
};

export default GetBalance;
