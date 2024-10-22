import Button from '@components/button/Button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { isNil } from 'lodash';
import { useRouter } from 'next/router';
import { FC } from 'react';
import WillRender from 'src/components/will-render/WillRender';
import { truncateAddress } from 'src/mavis-market-sdk/utils/addressUtil';

import CartButton from '../../cart-button/CartButton';
import { useConnectorStore } from '../connectors/stores/useConnectorStore';

import Classes from './Header.module.scss';

interface HeaderProps {
  onConnectWallet: () => void;
}

const Header: FC<HeaderProps> = props => {
  const { onConnectWallet } = props;

  const router = useRouter();
  const { connectedAccount, connector } = useConnectorStore();

  const onRedirectToHomepage = () => {
    router.push('/mavis-market-sdk');
  };

  const handleSelectMenu = (key: string) => {
    if (key === 'disconnect') {
      connector?.disconnect();
      return;
    }
    if (key === 'inventory') {
      router.push('/mavis-market-sdk/inventory');
      return;
    }
  };

  return (
    <div className={Classes.header}>
      <div className={Classes.content}>
        <div className={Classes.logo} onClick={onRedirectToHomepage}>
          <img src="https://cdn.skymavis.com/skymavis-home/public/homepage/core-value.png" width={40} />
          New Mavis Market
        </div>
        <div className={Classes.actions}>
          <WillRender when={isNil(connectedAccount)}>
            <Button color="primary" onClick={onConnectWallet}>
              Connect wallet
            </Button>
          </WillRender>
          <WillRender when={!isNil(connectedAccount)}>
            <CartButton />
            <Dropdown>
              <DropdownTrigger>
                <Button variant="bordered">{truncateAddress(connectedAccount as string)}</Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" onAction={key => handleSelectMenu(key as string)}>
                <DropdownItem key="inventory">Inventory</DropdownItem>
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
