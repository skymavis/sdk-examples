import { Input } from "@nextui-org/react";
import React, { FC, useState } from "react";

import { Textarea } from "@nextui-org/input";
import Button from "@components/button/Button";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";

import WillRender from "@components/will-render/WillRender";
import { isNil } from "lodash";
import useConnectStore from "../../../stores/useConnectStore";
import styles from "./SignMessage.module.scss";

const SignMessage: FC = () => {
  const { connector, isConnected } = useConnectStore();

  const [message, setMessage] = useState<string>("");
  const [signature, setSignature] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const signMessage = async () => {
    setIsLoading(true);
    try {
      const provider = await connector?.getProvider();
      if (!provider) return;
      const web3Provider = new Web3Provider(provider as ExternalProvider);
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
