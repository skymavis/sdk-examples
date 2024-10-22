import { Tab, Tabs } from '@nextui-org/react';
import { paymentTokens } from '@sky-mavis/mavis-market-core';
import { FC, Key } from 'react';
import Typography from 'src/components/typography/Typography';
import { useGetWalletConnectData } from 'src/mavis-market-sdk/hooks/useGetWalletConnectData';

import Classes from './SelectPaymentTokens.module.scss';

interface SelectPaymentTokensProps {
  selectedTokenAddress: string;
  onSelectPaymentToken: (tokenAddress: string) => void;
}

const SelectPaymentTokens: FC<SelectPaymentTokensProps> = props => {
  const { selectedTokenAddress, onSelectPaymentToken } = props;
  const { chainId } = useGetWalletConnectData();

  const tokens = paymentTokens[chainId];

  const onSelect = (tokenAddress: Key) => {
    onSelectPaymentToken(tokenAddress as string);
  };

  return (
    <Tabs className={Classes.tabs} selectedKey={selectedTokenAddress} onSelectionChange={onSelect}>
      {Object.entries(tokens).map(([, token]) => {
        const { address, imageUrl, symbol } = token;
        return (
          <Tab
            key={address}
            title={
              <div className={Classes.token}>
                <img src={imageUrl} className={Classes.image} />
                <Typography size="xSmall">{symbol}</Typography>
              </div>
            }
          />
        );
      })}
    </Tabs>
  );
};

export default SelectPaymentTokens;
