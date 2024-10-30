import { Accordion, AccordionItem } from '@nextui-org/react';
import React, { FC } from 'react';

import ERC20 from './erc20/ERC20';
import GetBalance from './get-balance/GetBalance';
import SendNativeToken from './send-native-token/SendNativeToken';
import SignMessage from './sign-message/SignMessage';
import SignSIWE from './sign-siwe/SignSiwe';
import SignTransaction from './sign-transaction/SignTransaction';
import SignTypedData from './sign-typed-data/SignTypedData';

import styles from '../connector-actions/ConnectorActions.module.scss';

const walletActions = [
  {
    title: 'Get Balance',
    subtitle: 'View the current balance of your wallet.',
    content: <GetBalance />,
  },
  {
    title: 'Sign Message',
    subtitle: 'Generate a unique signature for a custom message.',
    content: <SignMessage />,
  },
  {
    title: 'Sign TypedDataV4',
    subtitle: 'Sign structured data according to TypedData V4 standard.',
    content: <SignTypedData />,
  },
  {
    title: 'Sign SIWE Message',
    subtitle: 'Sign-in with Ethereum (SIWE) for authentication.',
    content: <SignSIWE />,
  },
  {
    title: 'Send Native Token',
    subtitle: 'Transfer native tokens from your wallet to another address.',
    content: <SendNativeToken />,
  },
  {
    title: 'Sign Transaction',
    subtitle: 'Authorize and sign a transaction with your wallet.',
    content: <SignTransaction />,
  },
  {
    title: 'ERC20',
    subtitle: 'Transfer ERC20 tokens from your wallet to another address.',
    content: <ERC20 />,
  },
];

const WalletActions: FC = () => {
  return (
    <div className={styles.connectorActions}>
      {walletActions.map((action, index) => (
        <Accordion selectionMode="multiple" key={index}>
          <AccordionItem aria-label={action.title} title={action.title} subtitle={action.subtitle}>
            {action.content}
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default WalletActions;
