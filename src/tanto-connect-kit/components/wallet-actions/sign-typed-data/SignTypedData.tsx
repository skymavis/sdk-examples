import { ethers } from "ethers";
import React, { FC, useState } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import { ExternalProvider } from "@ethersproject/providers";
import { Textarea } from "@nextui-org/input";
import Button from "@components/button/Button";

import styles from "./SignTypedData.module.scss";
import { isNil } from "lodash";
import WillRender from "@components/will-render/WillRender";
const SignTypedData: FC = () => {
  const { connector } = useConnectorStore();

  const [signature, setSignature] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const domain = {
    name: "MyDApp",
    version: "1",
    chainId: 2020,
    verifyingContract: "0x3b3adf1422f84254b7fbb0e7ca62bd0865133fe3",
  };

  const types = {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" },
    ],
    Mail: [
      { name: "from", type: "Person" },
      { name: "to", type: "Person" },
      { name: "contents", type: "string" },
    ],
  };

  const value = {
    from: {
      name: "Alice",
      wallet: "0xd115A29BDf33f6DB712Dc514721fbFa9b522505c",
    },
    to: {
      name: "Bob",
      wallet: "0x215757C4F40901B18d83316AA7dCf796678198Ea",
    },
    contents: "Hello, Bob!",
  };

  async function signTypedData() {
    try {
      setIsLoading(true);
      const provider = (await connector?.getProvider()) as ExternalProvider;
      const web3Provider = new ethers.providers.Web3Provider(provider);
      const signer = web3Provider.getSigner();
      const signature = await signer._signTypedData(domain, types, value);
      setSignature(signature);
    } catch (error) {
      console.error("[signing_typed_data]", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.sendTypedData}>
      <Button
        onClick={signTypedData}
        isLoading={isLoading}
        color="primary"
        radius={"sm"}
      >
        Sign Typed Data V4
      </Button>
      <WillRender when={!isNil(signature)}>
        <Textarea
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

export default SignTypedData;
