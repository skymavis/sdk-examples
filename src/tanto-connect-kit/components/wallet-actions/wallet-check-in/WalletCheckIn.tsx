import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import { ChainIds } from '@sky-mavis/tanto-connect';
import React, { FC, useEffect } from 'react';
import CheckInAbi from 'src/abis/check-in.json';
import { useAccount, useReadContract, useSwitchChain, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';

import { appConfigs } from '../../../common/constant';

import styles from './WalletCheckIn.module.scss';

const WalletCheckIn: FC = () => {
  const { address, chainId } = useAccount();
  const { chains, switchChainAsync } = useSwitchChain();
  const { data: hash, isPending, writeContract, reset } = useWriteContract();
  const contractAddress = chainId ? appConfigs.checkin[chainId] : '0x';

  const checkinContract = {
    abi: CheckInAbi,
    address: contractAddress as `0x${string}`,
    args: [address],
  } as const;

  const getCurrentStreak = useReadContract({
    ...checkinContract,
    functionName: 'getCurrentStreak',
    query: {
      placeholderData: 0,
      select: data => Number(data),
    },
  });

  const isCheckedInToday = useReadContract({
    ...checkinContract,
    functionName: 'isCheckedInToday',
    query: {
      placeholderData: true,
      select: data => Boolean(data),
    },
  });

  const performDailyCheckin = async () => {
    try {
      if (!chainId || ![ChainIds.RoninMainnet, ChainIds.RoninTestnet].includes(chainId)) {
        await switchChainAsync({ chainId: chains[0].id });
      }
      writeContract({
        ...checkinContract,
        functionName: 'checkIn',
        args: [address],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const refetchData = () => {
    getCurrentStreak.refetch();
    isCheckedInToday.refetch();
  };

  const txReceipt = useWaitForTransactionReceipt({ hash });

  const isLoading = isCheckedInToday.isFetching || getCurrentStreak.isFetching || isPending || txReceipt.isLoading;

  useEffect(() => {
    refetchData();
    reset();
  }, [chainId, address, txReceipt.isSuccess]);

  return (
    <div className={styles.walletCheckIn}>
      <div className={styles.content}>
        <Typography bold size={'small'}>
          Daily checkin Ronin Wallet to complete your quest
        </Typography>
        <Button
          onClick={performDailyCheckin}
          color={isCheckedInToday.data ? 'default' : 'primary'}
          radius={'sm'}
          className={styles.checkInBtn}
          disabled={isCheckedInToday.data}
          isLoading={address && isLoading}
        >
          {isCheckedInToday.data && address ? 'Checked' : 'Check-in'}
        </Button>
      </div>

      <div className={styles.streaks}>
        <img src="/static/images/ronin-wallet.png" className={styles.roninWallet} />
        <Typography bold className={styles.currentStreaks}>
          {getCurrentStreak.data || 0}
        </Typography>
        <Typography size={'xSmall'} color={'gray'}>
          STREAKS
        </Typography>
      </div>
    </div>
  );
};

export default WalletCheckIn;
