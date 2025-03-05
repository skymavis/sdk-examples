import Typography from '@components/typography/Typography';
import { Input, Tooltip } from '@nextui-org/react';
import React, { FC, useState } from 'react';
import { DEFAULT_DEADLINE_FROM_NOW } from 'src/katana-swap-sdk/constants/misc';
import { useUserTransactionTTL } from 'src/katana-swap-sdk/hooks/store/user/useUserActionHandler';

import styles from './TransactionDeadline.module.scss';

const TransactionDeadline: FC = () => {
  const [deadlineInput, setDeadlineInput] = useState('');
  const [deadlineError, setDeadlineError] = useState<boolean>(false);

  const [userDeadline, setUserDeadline] = useUserTransactionTTL();

  const parseCustomDeadline = (value: string) => {
    // populate what the user typed and clear the error
    setDeadlineInput(value);
    setDeadlineError(false);

    if (value.length === 0) {
      setUserDeadline(DEFAULT_DEADLINE_FROM_NOW);
    } else {
      try {
        const parsed: number = Math.floor(Number.parseFloat(value) * 60);
        if (!Number.isInteger(parsed) || parsed < 60 || parsed > 180 * 60) {
          setDeadlineError(true);
        } else {
          setUserDeadline(parsed);
        }
      } catch (error) {
        console.error(error);
        setDeadlineError(true);
      }
    }
  };

  return (
    <>
      <Tooltip
        className={styles.layerTooltip}
        content={
          <Typography size="xSmall">
            Your transaction will revert if it is pending for more than this period of time.
          </Typography>
        }
      >
        Transaction deadline
      </Tooltip>

      <Input
        variant="bordered"
        placeholder={(DEFAULT_DEADLINE_FROM_NOW / 60).toString()}
        color={deadlineError ? 'danger' : 'default'}
        value={
          deadlineInput.length > 0
            ? deadlineInput
            : userDeadline === DEFAULT_DEADLINE_FROM_NOW
            ? ''
            : (userDeadline / 60).toString()
        }
        onChange={e => parseCustomDeadline(e.target.value)}
        onBlur={() => {
          setDeadlineInput('');
          setDeadlineError(false);
        }}
        endContent={
          <Typography size="xSmall" color="gray">
            minutes
          </Typography>
        }
      />
    </>
  );
};

export default TransactionDeadline;
