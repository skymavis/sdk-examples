import { Input } from "@nextui-org/react";
import React, { FC, useState } from "react";

import { useConnectorStore } from "../../../hooks/useConnectStore";
import Button from "@components/button/Button";

import styles from "./GetAccounts.module.scss";

const GetAccounts: FC = () => {
  const connector = useConnectorStore((state) => state.connector);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<string[] | null>(null);

  const requestAccount = () => {
    setIsLoading(true);
    connector
      ?.getAccounts()
      .then((accounts) => setAccounts([...accounts]))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  return (
    <div className={styles.getAccounts}>
      <Input readOnly value={accounts?.toString()} radius={"sm"} />
      <Button
        onClick={requestAccount}
        isLoading={isLoading}
        className={styles.action}
        color="primary"
        radius={"sm"}
      >
        Get Accounts
      </Button>
    </div>
  );
};

export default GetAccounts;
