import React, { FC } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import SwitchChain from "./switch-chain/SwitchChain";
import RequestAccount from "./request-account/RequestAccount";

import styles from "./ConnectorActions.module.scss";
import GetAccounts from "./get-accounts/GetAccounts";
const connectorActions = [
  {
    title: "Request Account",
    subtitle: "Request permission to access the user's account in the wallet.",
    content: <RequestAccount />,
  },
  {
    title: "Switch Chain",
    subtitle:
      "Change the blockchain network within the wallet to a different chain.",
    content: <SwitchChain />,
  },
  {
    title: "Get Accounts",
    subtitle: "Retrieve a list of all accounts connected to the wallet.",
    content: <GetAccounts />,
  },
];

const ConnectorActions: FC = () => {
  return (
    <div className={styles.connectorActions}>
      {connectorActions.map((action, index) => (
        <Accordion selectionMode="multiple" key={index}>
          <AccordionItem
            aria-label={action.title}
            title={action.title}
            subtitle={action.subtitle}
          >
            {action.content}
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default ConnectorActions;
