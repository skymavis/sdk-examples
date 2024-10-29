import React, { FC, useCallback } from "react";
import Button from "@components/button/Button";
import { ethers } from "ethers";
import { defaultConfigs } from "../../../../common/constant";
import { CheckIn__factory } from "../../../../abis/types";
import { useConnectorStore } from "../../../../hooks/useConnectStore";

interface IPropsType {
  tokenAddress: string;
  recipient: string;
  amount: string;
}

const SendToken: FC<IPropsType> = ({ tokenAddress, recipient, amount }) => {
  const { connector, isConnected, chainId, account } = useConnectorStore();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Button
        onClick={approveToken}
        disabled={!recipient || !amount}
        color={"primary"}
        radius={"sm"}
        isLoading={isLoading}
      >
        Approve
      </Button>
    </React.Fragment>
  );
};

export default SendToken;
