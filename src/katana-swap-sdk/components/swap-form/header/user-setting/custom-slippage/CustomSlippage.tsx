import Typography from '@components/typography/Typography';
import WillRender from '@components/will-render/WillRender';
import { Input, Tab, Tabs, Tooltip } from '@nextui-org/react';
import { Percent } from '@uniswap/sdk-core';
import React, { FC, useState } from 'react';
import {
  useSetUserSlippageTolerance,
  useUserSlippageTolerance,
} from 'src/katana-swap-sdk/hooks/store/user/useUserActionHandler';
import useSwapSlippageTolerance from 'src/katana-swap-sdk/hooks/useSwapSlippageTolerance';

import styles from './CustomSlippage.module.scss';

const CustomSlippage: FC = () => {
  const [slippageInput, setSlippageInput] = useState('');
  const [invalidSlippageInput, setInvalidSlippageInput] = useState<boolean>(false);

  const userSlippageTolerance = useUserSlippageTolerance();
  const userSlippageToleranceWithDefault = useSwapSlippageTolerance();
  const setUserSlippageTolerance = useSetUserSlippageTolerance();

  const enableSlipInput = userSlippageTolerance === 'auto';
  const [activeTab, setActiveTab] = useState(enableSlipInput ? 'auto' : 'custom');

  const userSlippageTooLow = userSlippageTolerance !== 'auto' && userSlippageTolerance.lessThan(new Percent(5, 10_000));
  const userSlippageTooHigh =
    userSlippageTolerance !== 'auto' && userSlippageTolerance.greaterThan(new Percent(1, 100));

  const parseSlippageInput = (value: string) => {
    // populate what the user typed and clear the error
    setSlippageInput(value);
    setInvalidSlippageInput(false);

    if (value.length === 0) {
      setUserSlippageTolerance('auto');
    } else {
      const parsed = Math.floor(Number.parseFloat(value) * 100);

      if (!Number.isInteger(parsed) || parsed < 0 || parsed > 5000) {
        setUserSlippageTolerance('auto');
        if (value !== '.') {
          setInvalidSlippageInput(true);
        }
      } else {
        setUserSlippageTolerance(new Percent(parsed, 10_000));
      }
    }
  };

  return (
    <>
      <Tooltip
        className={styles.layerTooltip}
        content={
          <Typography size="xSmall">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </Typography>
        }
      >
        Max. slippage
      </Tooltip>
      <div className={styles.customSlippage}>
        <Tabs
          variant="bordered"
          color="primary"
          selectedKey={activeTab}
          onSelectionChange={key => {
            parseSlippageInput('');
            setActiveTab(key as string);
          }}
          aria-label="Options Slippage"
        >
          <Tab key="auto" title="Auto" />
          <Tab key="custom" title="Custom" />
        </Tabs>

        <Input
          variant="bordered"
          placeholder={userSlippageToleranceWithDefault.toFixed(2)}
          color={invalidSlippageInput ? 'danger' : 'default'}
          disabled={activeTab === 'auto'}
          value={
            slippageInput.length > 0
              ? slippageInput
              : userSlippageTolerance === 'auto'
              ? ''
              : userSlippageTolerance.toFixed(2)
          }
          onChange={e => parseSlippageInput(e.target.value)}
          endContent={
            <Typography size="xSmall" color="gray">
              %
            </Typography>
          }
        />
      </div>

      <WillRender when={invalidSlippageInput}>
        <Typography size="xSmall" color="danger">
          Enter a valid slippage percentage
        </Typography>
      </WillRender>
      <WillRender when={userSlippageTooLow}>
        <Typography size="xSmall" color="danger">
          Slippage below 0.05% may result in a failed transaction.
        </Typography>
      </WillRender>
      <WillRender when={userSlippageTooHigh}>
        <Typography size="xSmall" color="danger">
          Your transaction may be frontrun and result in an unfavorable trade.
        </Typography>
      </WillRender>
    </>
  );
};

export default CustomSlippage;
