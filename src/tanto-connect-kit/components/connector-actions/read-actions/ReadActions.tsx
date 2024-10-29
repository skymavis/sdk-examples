import { Input } from "@nextui-org/react";
import React, { FC, useState } from "react";

import Button from "@components/button/Button";

import styles from "./GetAccounts.module.scss";
import useConnectStore from "../../../stores/useConnectStore";

enum ConnectorReadAction {
  GET_ACCOUNTS = "getAccounts",
  GET_CHAIN_ID = "getChainId",
  IS_AUTHORIZED = "checkAuthorized",
}

interface IConnectorReadActions {
  key: ConnectorReadAction;
  title: string;
  execute?: () => Promise<any> | undefined;
}

const initialData: Record<ConnectorReadAction, string> = {
  [ConnectorReadAction.GET_ACCOUNTS]: "",
  [ConnectorReadAction.GET_CHAIN_ID]: "",
  [ConnectorReadAction.IS_AUTHORIZED]: "",
};

const GetAccounts: FC = () => {
  const connector = useConnectStore((state) => state.connector);
  const [actionLoading, setActionLoading] = useState<ConnectorReadAction[]>([]);
  const [connectorData, setConnectorData] = useState(initialData);

  const connectorActions: IConnectorReadActions[] = [
    {
      key: ConnectorReadAction.GET_ACCOUNTS,
      title: "Get Accounts",
      execute: () => connector?.getAccounts().then(),
    },
    {
      key: ConnectorReadAction.GET_CHAIN_ID,
      title: "Get ChainId",
      execute: () => connector?.getChainId(),
    },
    {
      key: ConnectorReadAction.IS_AUTHORIZED,
      title: "Check Authorized",
      execute: () => connector?.isAuthorized(),
    },
  ];

  const executeAction = async (actionKey: ConnectorReadAction) => {
    setActionLoading((prv) => [...prv, actionKey]);
    const action = connectorActions.find((act) => act.key === actionKey);
    if (!action) return;

    try {
      const data = await action?.execute?.();
      setConnectorData((prv) => ({ ...prv, [actionKey]: data }));
    } catch (error) {
      console.log(`execute_action_${actionKey}`, error);
    } finally {
      setActionLoading((prv) => prv.filter((key) => key !== actionKey));
    }
  };

  return (
    <div className={styles.getAccounts}>
      {connectorActions.map((action, index) => (
        <div key={index}>
          <Input readOnly value={connectorData[action.key]} radius={"sm"} />
          <Button
            onClick={() => executeAction(action.key)}
            isLoading={actionLoading.includes(action.key)}
            className={styles.action}
            color="primary"
            radius={"sm"}
          >
            {action.title}
          </Button>
        </div>
      ))}
    </div>
  );
};

export default GetAccounts;
