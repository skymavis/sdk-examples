import { Input } from "@nextui-org/react";
import { ChainIds } from "@sky-mavis/tanto-connect";
import { ethers } from "ethers";
import { isNil } from "lodash";
import React, { FC, useCallback, useEffect, useState } from "react";

import { CheckIn__factory } from "../../../abis/types";
import { useConnectorStore } from "../../../hooks/useConnectStore";
import Button from "@components/button/Button";
import styles from "./SignTransaction.module.scss";
import WillRender from "@components/will-render/WillRender";
import { defaultConfigs } from "../../../common/constant";

const SignTransaction: FC = () => {
  const { connector, isConnected, chainId, account } = useConnectorStore();

  const [isLoadingStreak, setIsLoadingStreak] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [streak, setStreak] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string>();

  const createCheckInContract = useCallback(async () => {
    if (!chainId || !defaultConfigs.checkin[chainId]) return;

    const provider = await connector?.getProvider();
    if (provider) {
      const web3Provider = new ethers.providers.Web3Provider(
        provider as ethers.providers.ExternalProvider
      );
      const signer = web3Provider.getSigner();
      return CheckIn__factory.connect(defaultConfigs.checkin[chainId], signer);
    }
  }, [connector, chainId]);

  const fetchStreak = useCallback(async () => {
    setIsLoadingStreak(true);
    try {
      const accounts = await connector?.getAccounts();
      if (!accounts?.[0]) return;

      const checkInContract = await createCheckInContract();
      const currentStreak = await checkInContract?.getCurrentStreak(
        accounts[0]
      );
      const isCheckedInToday = await checkInContract?.isCheckedInToday(
        accounts[0]
      );

      setTimeLeft(isCheckedInToday ? calculateTimeLeftToMidnight() : null);
      setStreak(String(currentStreak));
    } catch (error) {
      console.error("Error fetching streak:", error);
    } finally {
      setIsLoadingStreak(false);
    }
  }, [connector, createCheckInContract]);

  const checkIn = async () => {
    setIsCheckingIn(true);
    try {
      const accounts = await connector?.getAccounts();
      if (!accounts?.[0]) return;

      const checkInContract = await createCheckInContract();
      const tx = await checkInContract?.checkIn(accounts[0]);

      setTxHash(tx?.hash || "");
      await fetchStreak();
    } catch (err) {
      console.error("Error during check-in:", err);
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
        setTimeLeft((prev) => (prev ? prev - 1 : prev));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    fetchStreak();
  }, [account, chainId, fetchStreak]);

  return (
    <div className={styles.signTransaction}>
      <div className={styles.group}>
        <Input
          className={styles.input}
          value={streak || ""}
          disabled
          radius={"sm"}
        />
        <Button
          disabled={!isConnected}
          isLoading={isLoadingStreak}
          onClick={fetchStreak}
          className={styles.action}
          color={"primary"}
          radius={"sm"}
        >
          Get Current Streaks
        </Button>
      </div>

      <Button
        disabled={!isNil(timeLeft)}
        isLoading={isCheckingIn}
        onClick={checkIn}
        color={"primary"}
        radius={"sm"}
      >
        {isNil(timeLeft) ? "Check In" : `${timeLeft}s`}
      </Button>

      <WillRender when={!isNil(txHash)}>
        <Input
          label="Transaction Hash"
          labelPlacement={"outside"}
          color={"primary"}
          radius={"sm"}
          className={styles.input}
          value={txHash}
          disabled
        />
      </WillRender>
    </div>
  );
};

export default SignTransaction;
