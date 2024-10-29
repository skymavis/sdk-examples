import { Input } from "@nextui-org/react";
import React, { FC, useState } from "react";

import Button from "@components/button/Button";

import styles from "./RequestAccount.module.scss";
import useConnectStore from "../../../stores/useConnectStore";

const RequestAccount: FC = () => {
  const connector = useConnectStore((state) => state.connector);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);

  const requestAccount = () => {
    setIsLoading(true);
    connector
      ?.requestAccounts()
      .then((accounts) => setAccount(accounts[0]))
      .catch((error) => console.error("request_account", error))
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={styles.requestAccount}>
      <Input readOnly value={account || ""} radius={"sm"} />
      <Button
        onClick={requestAccount}
        isLoading={isLoading}
        className={styles.action}
        color="primary"
        radius={"sm"}
      >
        Request Account
      </Button>
    </div>
  );
};

export default RequestAccount;
