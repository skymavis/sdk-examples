import React, { FC, useState } from "react";
import { truncateAddress } from "../../../../mavis-market-sdk/utils/addressUtil";
import Button from "@components/button/Button";
import Avatar from "boring-avatars";
import Typography from "@components/typography/Typography";

import styles from "./ConnectedWallet.module.scss";
import { isNil } from "lodash";
import useConnectStore from "../../../stores/useConnectStore";

const ConnectedWallet: FC = () => {
  const { connector, account, chainId } = useConnectStore();
  const [isCopied, setIdCopied] = useState(false);

  if (isNil(connector) || isNil(account)) return null;

  const disconnectWallet = () => {
    connector.disconnect();
  };

  const copyAccountAddress = () => {
    if (!isCopied) {
      navigator.clipboard.writeText(account).then(() => {
        setIdCopied(true);
        setTimeout(() => setIdCopied(false), 2000);
      });
    }
  };

  return (
    <div className={styles.connectedWallet}>
      <Typography bold size={"xSmall"}>
        Connected
      </Typography>
      <Avatar name="account" size={80} />

      <div className={styles.content}>
        <Typography bold>{truncateAddress(account)}</Typography>
        <Typography size={"xSmall"} color={"gray"}>
          {connector.name} | Chain ID: {chainId}
        </Typography>
      </div>

      <div className={styles.actions}>
        <Button onClick={copyAccountAddress} fullWidth={true} radius={"sm"}>
          {isCopied ? "Copied!" : "Copy Address"}
        </Button>
        <Button
          color={"primary"}
          onClick={disconnectWallet}
          fullWidth={true}
          radius={"sm"}
        >
          Disconnect
        </Button>
      </div>
    </div>
  );
};

export default ConnectedWallet;
