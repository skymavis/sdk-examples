import Button from '@components/button/Button';
import { Select, SelectItem } from '@nextui-org/react';
import { CHAINS_CONFIG } from '@sky-mavis/tanto-connect';
import { isNil } from 'lodash';
import React, { FC, useState } from 'react';

import useConnectStore from '../../../stores/useConnectStore';

import styles from './Swithchain.module.scss';

const SwitchChain: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChainId, setSelectedChainId] = useState<number | null>(null);
  const connector = useConnectStore(state => state.connector);

  const switchChain = () => {
    if (selectedChainId) {
      setIsLoading(true);
      connector
        ?.switchChain(selectedChainId)
        .catch(error => console.error('switch_chain', error))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className={styles.switchChain}>
      <Select
        aria-label={'Select Network'}
        placeholder={'Select Network'}
        onChange={e => setSelectedChainId(Number(e.target.value))}
        radius={'sm'}
      >
        {Object.values(CHAINS_CONFIG).map(chain => (
          <SelectItem key={chain.chainId} value={chain.chainId}>
            {chain.chainName + ' - ' + chain.chainId}
          </SelectItem>
        ))}
      </Select>

      <Button
        onClick={switchChain}
        disabled={isNil(selectedChainId)}
        isLoading={isLoading}
        color="primary"
        radius={'sm'}
        className={styles.action}
      >
        Switch Network
      </Button>
    </div>
  );
};

export default SwitchChain;
