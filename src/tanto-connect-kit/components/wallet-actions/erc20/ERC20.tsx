import { Input } from "@nextui-org/react";
import React, { FC, useState } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import styles from "./ERC20.module.scss";
import { defaultConfigs } from "../../../common/constant";
import SendToken from "./send-token/SendToken";

const ERC20: FC = () => {
  const { chainId, isConnected } = useConnectorStore();
  const [recipient, setRecipient] = React.useState(defaultConfigs.recipient);
  const [amount, setAmount] = React.useState(defaultConfigs.amount);
  const [tokenAddress, setTokenAddress] = useState(
    chainId ? defaultConfigs.erc20[chainId] : ""
  );

  return (
    <div className={styles.erc20}>
      <Input
        onValueChange={setTokenAddress}
        label={"Token Address"}
        value={tokenAddress}
        radius={"sm"}
      />
      <Input
        onValueChange={setAmount}
        label={"Amount"}
        value={amount}
        radius={"sm"}
      />
      <Input
        onValueChange={setRecipient}
        label={"Recipient"}
        value={recipient}
        radius={"sm"}
      />

      <SendToken
        tokenAddress={tokenAddress}
        amount={amount}
        recipient={recipient}
      />
    </div>
  );
};

export default ERC20;
