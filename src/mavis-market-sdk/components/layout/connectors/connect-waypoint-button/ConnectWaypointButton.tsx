import { DEFAULT_CONNECTORS_CONFIG } from '@sky-mavis/tanto-connect';
import { FC } from 'react';
import { useConnectWallet } from 'src/mavis-market-sdk/hooks/useConnectWallet';

import CustomButton from '../custom-button/CustomButton';

const ConnectWaypointButton: FC = () => {
  const { connectWaypoint } = useConnectWallet();

  const onClickWaypointButton = () => {
    connectWaypoint();
  };

  return (
    <CustomButton
      icon={DEFAULT_CONNECTORS_CONFIG.WAYPOINT.icon as string}
      name="Ronin Waypoint"
      subText="Connect the wallet with your email"
      variant="bordered"
      onPress={onClickWaypointButton}
    />
  );
};

export default ConnectWaypointButton;
