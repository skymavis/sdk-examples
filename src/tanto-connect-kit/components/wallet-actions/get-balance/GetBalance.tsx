import { Input } from "@nextui-org/react";
import { ethers } from "ethers";
import React, { FC, useState } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import Button from "@components/button/Button";

import styles from "./GetBalance.module.scss";

const GetBalance: FC = () => {
  const { connector, isConnected } = useConnectorStore();
  const [balance, setBalance] = React.useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getBalance = async () => {
    setIsLoading(true);
    try {
      const provider = await connector?.getProvider();
      if (!provider) return;

      const web3Provider = new ethers.providers.Web3Provider(
        provider as ethers.providers.ExternalProvider
      );
      const signer = web3Provider.getSigner();
      const address = await signer.getAddress();

      const balance = await web3Provider.getBalance(address);
      const balanceInEther = ethers.utils.formatEther(balance);

      setBalance(balanceInEther);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.getBalance}>
      <Input readOnly value={balance} radius={"sm"} />
      <Button
        onClick={getBalance}
        isLoading={isLoading}
        color="primary"
        radius={"sm"}
        className={styles.action}
        disabled={!isConnected}
      >
        Get Balance
      </Button>
    </div>
  );
};

export default GetBalance;
