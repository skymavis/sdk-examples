import Button from '@components/button/Button';
import Typography from '@components/typography/Typography';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { isNil } from 'lodash';
import { useRouter } from 'next/router';
import { FC } from 'react';
import WillRender from 'src/components/will-render/WillRender';
import { useConnectorStore } from 'src/mavis-market-sdk/components/layout/connectors/stores/useConnectorStore';
import { truncateAddress } from 'src/mavis-market-sdk/utils/addressUtil';

import Classes from './Header.module.scss';

interface HeaderProps {
  onConnectWallet: () => void;
}

const Header: FC<HeaderProps> = props => {
  const { onConnectWallet } = props;

  const router = useRouter();
  const { connectedAccount, connector } = useConnectorStore();

  const onRedirectToHomepage = () => {
    router.push('/');
  };

  const handleSelectMenu = (key: string) => {
    if (key === 'disconnect') {
      connector?.disconnect();
      return;
    }
  };

  return (
    <div className={Classes.header}>
      <div className={Classes.content}>
        <div className={Classes.logo} onClick={onRedirectToHomepage}>
          <img src="https://cdn.skymavis.com/skymavis-home/public/homepage/core-value.png" width={40} />
          <Typography className={Classes.title}>Katana Swap</Typography>
        </div>
        <div className={Classes.actions}>
          <WillRender when={isNil(connectedAccount)}>
            <Button color="primary" onPress={onConnectWallet}>
              Connect wallet
            </Button>
          </WillRender>
          <WillRender when={!isNil(connectedAccount)}>
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">{truncateAddress(connectedAccount as string)}</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" onAction={key => handleSelectMenu(key as string)}>
                <DropdownItem key="disconnect" className="text-danger" color="danger">
                  Disconnect
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </WillRender>
        </div>
      </div>
    </div>
  );
};

export default Header;
