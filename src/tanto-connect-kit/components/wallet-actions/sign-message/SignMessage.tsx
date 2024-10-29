import { Input } from "@nextui-org/react";
import { ethers } from "ethers";
import React, { FC, useState } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import { Textarea } from "@nextui-org/input";
import Button from "@components/button/Button";

import styles from "./SignMessage.module.scss";
import WillRender from "@components/will-render/WillRender";
import { isNil } from "lodash";

const SignMessage: FC = () => {
  const { connector, isConnected } = useConnectorStore();

  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signMessage = async () => {
    setIsLoading(true);
    try {
      const provider = await connector?.getProvider();
      if (!provider) return;
      const web3Provider = new ethers.providers.Web3Provider(
        provider as ethers.providers.ExternalProvider
      );
      const signer = web3Provider.getSigner();
      const signature = await signer.signMessage(message);
      setSignature(signature);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.signMessage}>
      <Textarea
        label="Message"
        onChange={(e) => setMessage(e.target.value)}
        radius={"sm"}
      />
      <Button
        onClick={signMessage}
        isLoading={isLoading}
        color="primary"
        radius={"sm"}
        disabled={!isConnected}
      >
        Sign Message
      </Button>
      <WillRender when={!isNil(signature)}>
        <Input
          readOnly
          value={signature}
          label="Signature Hash"
          color={"primary"}
          radius={"sm"}
        />
      </WillRender>
    </div>
  );
};

export default SignMessage;
