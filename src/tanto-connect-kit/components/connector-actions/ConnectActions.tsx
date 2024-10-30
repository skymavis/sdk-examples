import { Accordion, AccordionItem } from '@nextui-org/react';
import React, { FC } from 'react';

import ReadActions from './read-actions/ReadActions';
import RequestAccount from './request-account/RequestAccount';
import SwitchChain from './switch-chain/SwitchChain';

import styles from './ConnectorActions.module.scss';

const connectorActions = [
  {
    title: 'Request Account',
    subtitle: "Request permission to access the user's account in the wallet.",
    content: <RequestAccount />,
  },
  {
    title: 'Switch Chain',
    subtitle: 'Change the blockchain network within the wallet to a different chain.',
    content: <SwitchChain />,
  },
  {
    title: 'Read Actions',
    subtitle: 'View available actions that can be performed with the connector.',
    content: <ReadActions />,
  },
];

const ConnectorActions: FC = () => {
  return (
    <div className={styles.connectorActions}>
      {connectorActions.map((action, index) => (
        <Accordion selectionMode="multiple" key={index}>
          <AccordionItem aria-label={action.title} title={action.title} subtitle={action.subtitle}>
            {action.content}
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default ConnectorActions;
