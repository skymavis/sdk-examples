import Button from '@components/button/Button';
import WillRender from '@components/will-render/WillRender';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { Input } from '@nextui-org/react';
import { ChainIds } from '@sky-mavis/tanto-connect';
import { isNil } from 'lodash';
import React, { FC, useEffect, useState } from 'react';

import { CheckIn__factory } from '../../../../abis/types';
import { appConfigs } from '../../../common/constant';
import useConnectStore from '../../../stores/useConnectStore';

import styles from './SignTransaction.module.scss';

const SignTransaction: FC = () => {
  const { connector, isConnected, chainId, account } = useConnectStore();

  const [isLoadingStreak, setIsLoadingStreak] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [streak, setStreak] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string>();

  const isDisabled = !chainId || ![ChainIds.RoninMainnet, ChainIds.RoninTestnet].includes(chainId);

  const createCheckInContract = async () => {
    if (!chainId || !appConfigs.checkin[chainId]) return;

    const provider = await connector?.getProvider();
    if (provider) {
      const web3Provider = new Web3Provider(provider as ExternalProvider);
      const signer = web3Provider.getSigner();
      return CheckIn__factory.connect(appConfigs.checkin[chainId], signer);
    }
  };

  const fetchCurrentStreak = async () => {
    if (!account) return;

    setIsLoadingStreak(true);
    try {
      const checkInContract = await createCheckInContract();
      const currentStreak = await checkInContract?.getCurrentStreak(account);
      const isCheckedInToday = await checkInContract?.isCheckedInToday(account);

      setTimeLeft(isCheckedInToday ? calculateTimeLeftToMidnight() : null);
      setStreak(String(currentStreak));
    } catch (error) {
      console.error('Error fetching streak:', error);
    } finally {
      setIsLoadingStreak(false);
    }
  };

  const checkIn = async () => {
    if (!account) return;
    setIsCheckingIn(true);
    try {
      const checkInContract = await createCheckInContract();
      const tx = await checkInContract?.checkIn(account);
      setTxHash(tx?.hash || '');
      await fetchCurrentStreak();
    } catch (err) {
      console.error('Error during check-in:', err);
    } finally {
      setIsCheckingIn(false);
    }
  };

  const calculateTimeLeftToMidnight = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);

    return Math.floor((midnight.getTime() - now.getTime()) / 1000);
  };

  useEffect(() => {
    if (!isNil(timeLeft) && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => (prev ? prev - 1 : prev));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    fetchCurrentStreak();
  }, [account, chainId]);

  return (
    <div className={styles.signTransaction}>
      <div className={styles.group}>
        <Input
          className={styles.input}
          value={isDisabled ? 'Only available on Ronin network' : streak || ''}
          disabled
          radius={'sm'}
        />
        <Button
          disabled={!isConnected || isDisabled}
          isLoading={isLoadingStreak}
          onClick={fetchCurrentStreak}
          className={styles.action}
          color={'primary'}
          radius={'sm'}
        >
          Get Current Streaks
        </Button>
      </div>

      <Button disabled={!isNil(timeLeft)} isLoading={isCheckingIn} onClick={checkIn} color={'primary'} radius={'sm'}>
        {isNil(timeLeft) ? 'Check In' : `${timeLeft}s`}
      </Button>

      <WillRender when={!isNil(txHash)}>
        <Input
          label="Transaction Hash"
          labelPlacement={'outside'}
          color={'primary'}
          radius={'sm'}
          className={styles.input}
          value={txHash}
          disabled
        />
      </WillRender>
    </div>
  );
};

export default SignTransaction;
